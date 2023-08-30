import { Injectable } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FormsService {
    public readonly formGroups: FormGroup = new FormGroup({});
    public isFormValid = false;

    constructor(
        private fb: NonNullableFormBuilder
    ) {
        this.formGroups = this.fb.group({
            addpage: this.fb.group({
                pageTypeId: this.fb.control<number>(0, { updateOn: 'change', validators: [Validators.required] }),
                title: this.fb.control<string>('', { updateOn: 'change', validators: [Validators.required] }),
                link: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                content: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                sort: this.fb.control<number>(0, {  updateOn: 'change', validators: [Validators.required] })
            }),
            editpage: this.fb.group({
                id: this.fb.control<number>(0, { updateOn: 'blur', validators: [Validators.required] }),
                pageTypeId: this.fb.control<number>(0, { updateOn: 'blur', validators: [Validators.required] }),
                title: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                link: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                content: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                sort: this.fb.control<number>(0, {  updateOn: 'blur', validators: [Validators.required] })
            }),
            addsetting: this.fb.group({
                settingKeyId: this.fb.control<number>(-1, { updateOn: 'blur', validators: [Validators.required] }),
                value: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required,Validators.minLength(3)] })
            }),
            editsetting: this.fb.group({
                id: this.fb.control<number>(0, { updateOn: 'blur', validators: [Validators.required] }),
                settingKeyId: this.fb.control<number>(-1, { updateOn: 'blur', validators: [Validators.required] }),
                value: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required,Validators.minLength(3)] })
            }),
            addsettingkey: this.fb.group({
                settingTypeId: this.fb.control<number>(-1, { updateOn: 'blur', validators: [Validators.required] }),
                key: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required,Validators.minLength(3)] }),
                isDefault: this.fb.control<boolean>(false, { updateOn: 'blur', validators: [Validators.required] }),
                defaultValue: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required,Validators.minLength(3)] })
            }),
            imageGalleryAdd: this.fb.group({
                name: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required] }),
                description: this.fb.control<string>('', { updateOn: 'blur', validators: [] }),
                imageGalleryTypeId: this.fb.control<number>(-1, { updateOn: 'blur', validators: [Validators.pattern(/^[0-9]+$/),Validators.required] })
            }),
            galleryTypeAdd: this.fb.group({
                name: this.fb.control<string>('', { updateOn: 'blur', validators: [Validators.required,Validators.minLength(2)] }),
            })
        });

        // not required fields
        (this.formGroups.controls.addpage as FormGroup).controls.link.clearValidators();
    }

    public update(): void {
        this.formGroups.updateValueAndValidity();
    }

    public resetForm(): void {
        Object.entries(this.formGroups.controls).forEach((control, formIndex) => {
            this.formGroups.controls[control[0]]?.reset();
        });
    }
}
