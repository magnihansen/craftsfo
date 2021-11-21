import { NgModule, ModuleWithProviders } from '@angular/core';
import { I18nPipe } from './i18n.pipe';
import { I18nService } from './i18n.service';
import { I18nLanguageConfigService } from './i18n-language.service';

@NgModule({
    declarations: [
        I18nPipe
    ],
    exports: [
        I18nPipe
    ]
})
export class LocalLocalizationModule {
    static forRoot(languageData: any): ModuleWithProviders<LocalLocalizationModule> {
        return {
            ngModule: LocalLocalizationModule,
            providers: [
                I18nService,
                {
                    provide: I18nLanguageConfigService,
                    useValue: languageData
                }]
        };
    }
}
