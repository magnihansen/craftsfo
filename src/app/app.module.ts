import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { MySqlService } from './services/mysql.service';
import { PageHubService } from './services/pagehub.service';
import { I18nService } from './localization/i18n.service';
import languageDK from './localization/languages/da.json';
import { SharedModule } from './shared/shared.module';
import { ImageGalleryComponent } from './components/modules/image-gallery/image-gallery.component';
import { ImageGalleryService } from './components/modules/image-gallery/ui/services/image-gallery.service';
import { SettingService } from './services/setting.service';
import { DomainSetting } from './models/domain-setting.model';
import { LocalStorageService } from './services/local-storage.service';
import { ServiceProviderFactory } from './core/factories/service-provider.factory';
import { ServiceProvider } from './services/provider.service';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ImageGalleryComponent
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeDomainSettings, deps: [SettingService, LocalStorageService, ServiceProvider], multi: true },
    MySqlService,
    PageHubService,
    ImageGalleryService,
    { provide: 'HUB_URL', useValue: environment.hubSettings.url },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    private i18nService: I18nService
  ) {
    switch (environment.language) {
      case 'da':
        this.i18nService.addTranslations(languageDK);
        break;
    }
  }
}

export function getBaseHref(): string {
  return window.location.pathname;
}

export function initializeDomainSettings(
  settingService: SettingService,
  localStorageService: LocalStorageService,
  providerService: ServiceProvider
): () => Promise<void> {
  return () =>
    new Promise((resolve) => {
      providerService.setNonce();
      const domainSettings: any = localStorageService.getWithExpiry(settingService.domainSettingKey);
      if (domainSettings) {
        settingService.setCssVariables(domainSettings);
        // settingService.loadCSS(domainSettings);
        resolve();
      } else {
        settingService.getDomainSettings().subscribe({
          next: (_settings: DomainSetting[]) => {
            settingService.setCssVariables(_settings);
            // settingService.loadCSS(_settings);
            localStorageService.setWithExpiry(settingService.domainSettingKey, _settings, 3600000 * 8);
            resolve();
          },
          error: () => resolve()
        });
      }
    });
}