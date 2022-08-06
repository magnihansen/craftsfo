import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TableModule } from '../components/table/table.module';
import { I18nPipe } from '../localization/i18n.pipe';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ModalComponent } from '../components/modal/modal.component';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    AutoFocusDirective,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CKEditorModule,
    TableModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    MatIconModule
  ],
  exports: [
    CKEditorModule,
    TableModule,
    MatIconModule,
    NavigationComponent,
    FooterComponent,
    AutoFocusDirective,
    ModalComponent
  ],
  providers: [
    I18nPipe
  ]
})

export class SharedModule {
  constructor() { }
}
