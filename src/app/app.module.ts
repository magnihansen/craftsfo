import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CSP_NONCE, enableProdMode, Inject, NgModule, Renderer2, inject, provideAppInitializer } from '@angular/core';
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
import { LocalStorageService } from './services/local-storage.service';
import { NonceService } from './services/nonce.service';
import { ServiceProviderFactory } from './core/factories/service-provider.factory';
import { DomainSettingFactory } from './core/factories/domain-setting.factory';
import { CSP_CONFIG } from './core/configs/csp.config';

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
    provideAppInitializer(() => {
        const initializerFn = (DomainSettingFactory)(inject(SettingService), inject(LocalStorageService));
        return initializerFn();
      }),
    // { provide: APP_INITIALIZER, useFactory: ServiceProviderFactory, deps: [NonceService], multi: true },
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