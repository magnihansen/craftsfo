import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginRoutingModule } from './login-routing.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { MySqlService } from './services/mysql.service';
import { PageHubService } from './services/pagehub.service';
import { I18nService } from './localization/i18n.service';
import languageDK from './localization/languages/da.json';

const routes: Routes = [
  { path: '', redirectTo: '/page/start' },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminRoutingModule,
    LoginRoutingModule,
    RouterModule.forRoot(routes, {
        enableTracing: false
      }
    )
  ],
  providers: [
    MySqlService,
    PageHubService,
    {
      provide: APP_BASE_HREF,
      useValue: '/' + (window.location.pathname.split('/')[1] || '')
    },
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
