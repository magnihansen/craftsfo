import { CSP_NONCE, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

fetch(environment.hubSettings.url + '/V1/Csp/GetNonce')
  .then(response => response.json())
  .then((nonce: string) => {
    console.log('NONCE' , nonce);
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule(AppModule, {
      providers: [{
        provide: CSP_NONCE,
        useValue: nonce
      }]
    }).catch(err => console.log('BootstrapModule', err));
  }
);
