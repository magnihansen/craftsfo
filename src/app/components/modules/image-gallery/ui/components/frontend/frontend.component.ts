import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { CollectionImage } from '../../models/collection-image.model';
import { ImageCollection } from '../../models/image-collection.model';
import { ImageGalleryFile } from '../../models/image-gallery-file.model';
import { ImageGallery } from '../../models/image-gallery.model';
import { CdnImageGalleryUrlPipe } from '../../pipes/cdn-url.pipe';
import { CdnService } from '../../services/cdn.service';

@Component({
  standalone: true,
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss'],
  imports: [
    CommonModule,
    LocalLocalizationModule, 
    ContentWrapperComponent,
    CdnImageGalleryUrlPipe 
  ],
  providers: [
    CdnService
  ]
})
export class FrontendComponent implements OnInit {
  @Input() public page: Page = {} as Page;

  public isCollectionLoading = false;
  public imageGalleries: ImageGallery[] = [];
  public imageCollection: ImageCollection = {} as ImageCollection;

  constructor(
    private cdnService: CdnService
  ) { }

  ngOnInit(): void {
    if (this.page) {
      this.loadImageGalleryImages();
    }
  }

  private loadImageGalleryImages(): void {
    this.isCollectionLoading = true;
    this.cdnService.getImageCollectionByPageId(this.page.id).subscribe({
      next: (imageCollection: ImageCollection) => {
        this.imageCollection = imageCollection;
        this.isCollectionLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isCollectionLoading = false;
      }
    });
  }
}
