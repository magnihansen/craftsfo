import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Page } from '../../../models/page.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { I18nService } from 'src/app/localization/i18n.service';
import { User } from 'src/app/models/user';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';
import { PageType } from 'src/app/models/page-type.model';
import { PageTypeService } from 'src/app/services/pagetype.service';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { ImageGalleryComponent } from '../../modules/image-gallery/image-gallery.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  standalone: true,
  selector: 'app-pageedit',
  templateUrl: './pageedit.component.html',
  styleUrls: ['./pageedit.component.scss'],
  imports: [FormsModule, CommonModule, LocalLocalizationModule, CKEditorModule, ContentWrapperComponent, ImageGalleryComponent]
})
export class PageeditComponent implements OnChanges {
  public classicEditor = ClassicEditor;
  public pages: Page[] = [];
  public title = '';
  public content = '';
  public sort = 0;
  public pageuid = '';
  public page: Page | null = null;
  public pageTypeId = 0;
  public pageTypes: PageType[] = [];

  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor(
    private authenticationService: AuthenticationService,
    private pageService: PageService,
    private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private toastr: ToastrService,
    private pageTypeService: PageTypeService
  ) {
    this.route.params.subscribe(params => this.loadPage(params.id));
    this.loadPageTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
  }

  public onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  private loadPageTypes(): void {
    this.pageTypeService.getPageTypes().subscribe({
      next: (pageTypes: PageType[]) => {
        this.pageTypes = pageTypes;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private loadPage(pageId: number): void {
    this.pageService.getPage(pageId).subscribe({
      next: (page: Page) => {
        this.page = page;
        
        this.title = page.title;
        this.sort = page.sort;
        this.content = page.content.replace('\n', '<br />');
        this.pageTypeId = page.pageTypeId;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public gotoDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  public onSubmit(): void {
    if (this.authenticationService.IsUserLoggedIn) {
      if (this.page) {
        const user: User = this.authenticationService.getUser();

        this.page.content = this.content;
        this.page.title = this.title;
        this.page.sort = this.sort;
        this.page.updatedBy = user.username;
        this.page.pageTypeId = this.pageTypeId;

        this.pageService.updatePage(this.page).subscribe({
          next: (result: boolean) => {
            if (result) {
              this.toastr.success(
                this.i18nService.getTranslation('common.page-saved')
              );
            } else {
              this.toastr.warning(
                this.i18nService.getTranslation('warning.page-not-saved')
              );
            }
          },
          error: (err: any) => {
            this.toastr.error(
              err,
              this.i18nService.getTranslation('Error'),
            );
          }
        });
      } else {
        this.toastr.warning(
          this.i18nService.getTranslation('Page not valid')
        );
      }
    } else {
      this.toastr.warning(
        this.i18nService.getTranslation('User not authorized')
      );
    }
  }
}
