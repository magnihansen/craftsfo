import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { MySqlService } from './services/mysql.service';
import { PageHubService } from './services/pagehub.service';
import { I18nService } from './localization/i18n.service';
import languageDK from './localization/languages/da.json';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

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
    SharedModule
  ],
  providers: [
    MySqlService,
    PageHubService,
    // {
    //   provide: APP_BASE_HREF,
    //   useValue: '/' + (window.location.pathname.split('/')[1] || '')
    // },
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
