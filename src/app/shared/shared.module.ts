import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from '../components/footer/footer.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PageService } from '../services/page.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TableModule } from '../components/table/table.module';
import { I18nPipe } from '../localization/i18n.pipe';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
      NavigationComponent,
      FooterComponent
    ],
    imports: [
      RouterModule,
      CommonModule,
      BrowserAnimationsModule,
      CKEditorModule,
      TableModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true
      })
    ],
    exports: [
      NavigationComponent,
      FooterComponent,
      CKEditorModule,
      TableModule
    ],
    providers: [
      I18nPipe,
      PageService
    ]
})

export class SharedModule {
  constructor() {
    console.log('SharedModule');
  }
}
