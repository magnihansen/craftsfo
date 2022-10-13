import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../models/page.model';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { I18nService } from 'src/app/localization/i18n.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';

@Component({
  selector: 'app-pageedit',
  templateUrl: './pageedit.component.html',
  styleUrls: ['./pageedit.component.scss']
})
export class PageeditComponent {
  public classicEditor = ClassicEditor;
  public pages: Page[] = [];
  public title = '';
  public content = '';
  public rank = '';
  public pageuid = '';
  public page: Page | null = null;

  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor(
    private authenticationService: AuthenticationService,
    private pageService: PageService,
    private router: Router,
    private route: ActivatedRoute,
    private i18nService: I18nService,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe(params => this.loadPage(params.id));
  }

  public onReady(eventData: any) {
    console.log('Editor ready..');
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  private loadPage(pageId: number): void {
    this.pageService.getPage(pageId).subscribe({
      next: (result: Page) => {
        console.log(result);
        this.page = result;
        this.title = result.title;
        this.rank = result.pageRank;
        this.content = result.content.replace('\n', '<br />');
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
        this.page.pageRank = this.rank.toString();
        this.page.updatedBy = user.username;

        this.pageService.updatePage(this.page).subscribe({
          next: (result: boolean) => {
            if (result) {
              this.toastr.success(
                this.i18nService.getTranslation('Page is saved')
              );
            } else {
              this.toastr.warning(
                this.i18nService.getTranslation('Page not saved')
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
