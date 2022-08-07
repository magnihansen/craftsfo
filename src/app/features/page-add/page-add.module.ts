import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { I18nPipe } from 'src/app/localization/i18n.pipe';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { AddpageComponent } from './addpage.component';

@NgModule({
    declarations: [
        AddpageComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LocalLocalizationModule
    ],
    providers: [
        I18nPipe
    ]
})

export class PageAddModule {
    constructor() { }
}