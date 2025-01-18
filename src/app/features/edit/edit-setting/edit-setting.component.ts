import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, AfterViewInit, OnDestroy, Input, OnInit } from '@angular/core';
import { FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToastrService } from 'ngx-toastr';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { SettingKey } from 'src/app/models/setting-key.model';
import { DomainSetting } from 'src/app/models/domain-setting.model';
import { I18nService } from 'src/app/localization/i18n.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
    selector: 'app-edit-setting',
    templateUrl: './edit-setting.component.html',
    styleUrls: ['./edit-setting.component.scss'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, CKEditorModule, LocalLocalizationModule],
    providers: [FormsService]
})
export class EditSettingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() settingId: number = 0;
  @Input() public renderModal = false;

  @Output() private closeChange: EventEmitter<boolean> = new EventEmitter();

  public classicEditor = ClassicEditor;
  public formSettingEdit: FormGroup = new FormGroup({});
  public formSettingEditState?: Subscription;
  public settingKeys: SettingKey[] = [];

  constructor(
    private settingService: SettingService,
    private authService: AuthenticationService,
    private formsService: FormsService,
    private i18nService: I18nService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) { 
    this.loadSettingKeys();
  }

  public ngOnInit(): void {
    this.formSettingEdit = this.formsService.formGroups.controls['editsetting'] as FormGroup;
    this.loadSetting(this.settingId);
  }

  public ngAfterViewInit(): void {
    this.formSettingEditState = this.formSettingEdit.statusChanges
      .subscribe({
        next: (state: FormControlStatus) => {
          this.formsService.isFormValid = (state === 'INVALID' ? false : true);
        }
      });
  }

  private loadSetting(settingId: number): void {
    this.settingService.getSetting(settingId).subscribe({
      next: (setting: Setting) => {
        console.log('loaded setting', setting);
        this.formSettingEdit.controls.id.setValue(setting.id);
        this.formSettingEdit.controls.settingKeyId.setValue(setting.settingKeyId);
        this.formSettingEdit.controls.value.setValue(setting.value);
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

  public editSetting(form: any): void {
    if (this.authService.isUserLoggedIn) {
      const user: User = this.authService.getUser();

      const _id: number = this.formSettingEdit.controls.id.value as number;
      const _settingKeyId: number = this.formSettingEdit.controls.settingKeyId.value as number;
      const _value: string = this.formSettingEdit.controls.value.value as string;

      const newSetting: Setting = {
        id: _id,
        settingKeyId: _settingKeyId,
        value: _value,
        createdBy: user.username
      } as unknown as Setting;

      const obj: string = this.i18nService.getTranslation('common.setting');

      this.settingService.updateSetting(newSetting).subscribe({
        next: (updated: boolean) => {
          if (updated) {
            this.settingService.getDomainSettings().subscribe({
              next: (_domainSettings: DomainSetting[]) => {
                this.settingService.setCssVariables(_domainSettings);
                this.localStorageService.setWithExpiry(this.settingService.domainSettingKey, _domainSettings, 3600000 * 8);
              }
            });
            this.formsService.formGroups.reset();
            this.closeChange.emit(updated);
          } else {
            this.toastr.warning(
              this.i18nService.getTranslation('warning.x-not-saved', { x: obj }),
              this.i18nService.getTranslation('common.warning')
            );
          }
        },
        error: (err: any) => {
          this.toastr.error(
            this.i18nService.getTranslation('error.x-not-saved', { x: obj }),
            this.i18nService.getTranslation('common.error')
          );
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
    this.formSettingEditState?.unsubscribe();
  }
}
