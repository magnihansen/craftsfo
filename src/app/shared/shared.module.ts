import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToastrModule } from 'ngx-toastr';

import { I18nPipe } from '../localization/i18n.pipe';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { LocalLocalizationModule } from '../localization/local-localization.module';
import { ImageGalleryComponent } from '../components/modules/image-gallery/image-gallery.component';

@NgModule({
  declarations: [
    AutoFocusDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    CKEditorModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    MatIconModule,
    LocalLocalizationModule,
    ImageGalleryComponent
  ],
  exports: [
    CKEditorModule,
    MatIconModule,
    AutoFocusDirective,
    ImageGalleryComponent
  ],
  providers: [
    I18nPipe
  ]
})

export class SharedModule {
  constructor() { }
}
