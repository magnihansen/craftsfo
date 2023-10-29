import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../models/page.model';
import { PageService } from 'src/app/services/page.service';
import { MiscHelper } from 'src/app/core/misc.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ModuleType } from '../modules/module-type.enum';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { CommonModule } from '@angular/common';
import { ImageGalleryComponent } from '../modules/image-gallery/image-gallery.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { HandleSafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';

@Component({
  standalone: true,
  selector: 'app-routerpagecontent',
  templateUrl: './routerpagecontent.component.html',
  styleUrls: ['./routerpagecontent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [ 
    LoaderComponent, 
    ContentWrapperComponent, 
    ImageGalleryComponent, 
    CommonModule, 
    LocalLocalizationModule,
    HandleSafeHtmlPipe
  ]
})
export class RouterpagecontentComponent {
  public content = '';
  public isLoading = false;
  public moduleType: ModuleType = ModuleType.IsLoading;
  public pages: Page[] = [];
  public currentPage?: Page | undefined;

  constructor(
    private pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private miscHelper: MiscHelper
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.loadPageByLink(params.link);
    });
  }

  private loadPageByLink(pageLink: string | undefined): void {
    this.moduleType = ModuleType.IsLoading;
    this.pageService.getPageByLink(pageLink).subscribe({
      next: (page: Page) => {
        this.currentPage = page;
        switch (page.pageTypeId) {
          case 46:
            this.moduleType = ModuleType.Content;
            break;
          case 47:
            this.moduleType = ModuleType.ImageGallery;
            break;
          default:
            this.moduleType = ModuleType.None;
            break;
        }
        this.content = page.content;
      },
      error: (err: HttpErrorResponse) => {
        this.miscHelper.handleError(err);
      }
    });
  }
}
