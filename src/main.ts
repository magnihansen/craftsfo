import { CSP_NONCE, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CSP_CONFIG } from './app/core/configs/csp.config';

fetch(environment.hubSettings.url + '/V1/Csp/GetNonce')
  .then(response => response.json())
  .then((nonce: string) => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic(
      [{
        provide: CSP_CONFIG,
        useValue: nonce
      }]
    ).bootstrapModule(AppModule, {
        providers: [{
          provide: CSP_NONCE,
          useValue: nonce
        }]
    }).catch(err => console.log('BootstrapModule', err));
  }
);
