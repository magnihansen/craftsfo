import { Component, Input, OnInit } from '@angular/core';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { ImageGalleryComponent } from '../../image-gallery.component';
import { ImageGalleryService } from '../services/image-gallery.service';

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend.component.html',
    styleUrls: ['./frontend.component.scss'],
    imports: [
        LocalLocalizationModule,
        ContentWrapperComponent
    ]
})
export class FrontendComponent implements OnInit {
  @Input() public data: any;

  public page: Page = {} as Page;

  constructor(
    private imageGalleryService: ImageGalleryService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.page = this.data as Page;

      this.imageGalleryService.getImageGalleryImagesByPageId(this.page.id).subscribe({
        next: (images: any[]) => {
          
        }
      });
      console.log('Frontend : Data', this.data);


    }
  }
}
