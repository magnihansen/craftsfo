import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PageService } from '../services/page.service';

@NgModule({
    declarations: [
      NavigationComponent,
      FooterComponent
    ],
    imports: [
        RouterModule,
        CommonModule
    ],
    exports: [
      NavigationComponent,
      FooterComponent
    ],
    providers: [
      // LoginActivate,
      // AngularFireDatabase,
      // AuthService,
      PageService,
      // SharedService,
      // Title
    ]
})

export class SharedModule {
  constructor() {
    console.log('SharedModule');
  }
}
