import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
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
  ]
})
export class FrontendComponent implements OnInit {
  @Input() public page: Page = {} as Page;

  public isCollectionLoading = false;
  public imageGalleries: ImageGallery[] = [];
  public imageGalleryFiles: ImageGalleryFile[] = [];

  constructor(
    readonly cdnService: CdnService
  ) { }

  ngOnInit(): void {
    if (this.page) {
      console.log('Frontend : Data', this.page);
      this.loadImageGalleryImages();
    }
  }

  private loadImageGalleryImages(): void {
    this.isCollectionLoading = true;
    this.imageGalleryFiles = [];
    this.cdnService.getImageCollectionByPageId(this.page.id).subscribe({
      next: (files: ImageGalleryFile[]) => {
        files.forEach((igf: ImageGalleryFile) => {
          this.imageGalleryFiles = [...this.imageGalleryFiles, igf];
        });
        this.isCollectionLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isCollectionLoading = false;
      }
    });
  }
}
