import { Injectable } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormPageAddService {
    public readonly addPageForm: FormGroup = new FormGroup({});
    public isFormValid = false;

    constructor(
        private fb: NonNullableFormBuilder
    ) {
        this.addPageForm = this.fb.group({
            addpage: this.fb.group({
                title: this.fb.control('', { updateOn: 'blur', validators: [Validators.required] }),
                link: this.fb.control('', { updateOn: 'blur', validators: [Validators.required] }),
                content: this.fb.control('', { updateOn: 'blur', validators: [Validators.required] }),
                pageRank: this.fb.control('', {  updateOn: 'blur', validators: [Validators.required] })
            })
        });

        // not required fields
        (this.addPageForm.controls.addpage as FormGroup).controls.link.clearValidators();
    }

    public update(): void {
        this.addPageForm.updateValueAndValidity();
    }

    public resetForm(): void {
        Object.entries(this.addPageForm.controls).forEach((control, formIndex) => {
            this.addPageForm.controls[control[0]]?.reset();
        });
    }
}
