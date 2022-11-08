import { NgModule } from '@angular/core';

import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';

@NgModule({
    imports: [
        MainLayoutComponent,
        MainLayoutRoutingModule
    ]
  })

  export class MainLayoutModule {}
