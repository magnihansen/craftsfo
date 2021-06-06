import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PageService } from '../services/page.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
    declarations: [
      NavigationComponent,
      FooterComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CKEditorModule
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
