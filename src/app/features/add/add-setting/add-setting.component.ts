import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, AfterViewInit, OnDestroy, Input, OnInit } from '@angular/core';
import { FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs/internal/Subscription';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { SettingKey } from 'src/app/models/setting-key.model';

@Component({
  selector: 'app-add-setting',
  standalone: true,
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, CKEditorModule, LocalLocalizationModule],
  providers: [FormsService]
})
export class AddSettingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public renderModal = false;
  @Input() public currentSettingCount = 999;

  @Output() public closeChange: EventEmitter<Setting> = new EventEmitter();

  public classicEditor = ClassicEditor;
  public formSettingAdd: FormGroup = new FormGroup({});
  public formSettingAddState?: Subscription;
  public settingKeys: SettingKey[] = [];

  constructor(
    private settingService: SettingService,
    private authService: AuthenticationService,
    private formsService: FormsService
  ) { 
    this.loadSettingKeys();
  }

  public ngOnInit(): void {
    this.formSettingAdd = this.formsService.formGroups.controls['addsetting'] as FormGroup;
  }

  public ngAfterViewInit(): void {
    this.formSettingAddState = this.formSettingAdd.statusChanges
      .subscribe({
        next: (state: FormControlStatus) => {
          this.formsService.isFormValid = (state === 'INVALID' ? false : true);
        }
      });
  }

  private loadSettingKeys(): void {
    this.settingService.getSettingKeys().subscribe({
      next: (settingKeys: SettingKey[]) => {
        this.settingKeys = settingKeys;
      } 
    });
  }

  public addSetting(form: any): void {
    if (this.authService.IsUserLoggedIn) {
      const user: User = this.authService.getUser();

      const _settingKeyId: number = this.formSettingAdd.controls.settingKeyId.value as number;
      const _value: string = this.formSettingAdd.controls.value.value as string;

      const newSetting: Setting = {
        settingKeyId: _settingKeyId,
        value: _value,
        createdBy: user.username
      } as unknown as Setting;

      this.settingService.insertSetting(newSetting).subscribe({
        next: (insertedSetting: Setting) => {
          if (insertedSetting) {
            this.formsService.formGroups.reset();
            this.closeChange.emit(insertedSetting);
          }
        },
        error: (err: any) => {
          // do nothing yet 
        }
      });
    }
  }

  public closeModal(modalClosed: boolean): void {
    if (modalClosed) {
      this.formsService.formGroups.reset();
      this.closeChange.emit(undefined);
    }
  }

  public ngOnDestroy(): void {
    this.formSettingAddState?.unsubscribe();
  }
}
