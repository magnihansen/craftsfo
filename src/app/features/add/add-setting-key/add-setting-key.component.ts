import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs/internal/Subscription";

import { LocalLocalizationModule } from "src/app/localization/local-localization.module";
import { SettingKey } from "src/app/models/setting-key.model";
import { SettingType } from "src/app/models/setting-type.model";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FormsService } from "src/app/services/forms.service";
import { SettingService } from "src/app/services/setting.service";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";

@Component({
    selector: 'app-add-setting-key',
    templateUrl: './add-setting-key.component.html',
    styleUrls: ['./add-setting-key.component.scss'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, LocalLocalizationModule],
    providers: [FormsService]
})
export class AddSettingKeyComponent {
    @Input() renderModal = false;

    @Output() private closeChange: EventEmitter<SettingKey> = new EventEmitter();

    public formSettingKeyAdd: FormGroup = new FormGroup({});
    public formSettingKeyAddState?: Subscription;
    public settingTypes: SettingType[] = [];

    constructor(
        private settingService: SettingService,
        private authService: AuthenticationService,
        private formsService: FormsService
    ) {
        this.loadSettingTypes();
    }

    public ngOnInit(): void {
        this.formSettingKeyAdd = this.formsService.formGroups.controls['addsettingkey'] as FormGroup;
    }

    public ngAfterViewInit(): void {
        this.formSettingKeyAddState = this.formSettingKeyAdd.statusChanges
            .subscribe({
                next: (state: FormControlStatus) => {
                    this.formsService.isFormValid = (state === 'INVALID' ? false : true);
                }
            });
    }

    private loadSettingTypes(): void {
        this.settingService.getSettingTypes().subscribe({
            next: (settingTypes: SettingType[]) => {
                this.settingTypes = settingTypes;
            }
        });
    }

    public addSettingKey(form: any): void {
        if (this.authService.isUserLoggedIn) {
            const _settingTypeId: number = this.formSettingKeyAdd.controls.settingTypeId.value as number;
            const _key: string = this.formSettingKeyAdd.controls.key.value as string;
            const _isDefault: boolean = this.formSettingKeyAdd.controls.isDefault.value as boolean;
            const _defaultValue: string = this.formSettingKeyAdd.controls.defaultValue.value as string;

            const newSettingKey: SettingKey = {
                settingTypeId: _settingTypeId,
                key: _key,
                isDefault: _isDefault,
                isDefaultValue: _defaultValue
            } as unknown as SettingKey;

            this.settingService.insertSettingKey(newSettingKey).subscribe({
                next: (insertedSettingKey: SettingKey) => {
                    if (insertedSettingKey) {
                        this.formsService.formGroups.reset();
                        this.closeChange.emit(insertedSettingKey);
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
        this.formSettingKeyAddState?.unsubscribe();
    }
}