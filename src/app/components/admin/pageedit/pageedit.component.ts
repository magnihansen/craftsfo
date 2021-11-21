import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../interfaces/page';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { I18nService } from 'src/app/localization/i18n.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pageedit',
  templateUrl: './pageedit.component.html',
  styleUrls: ['./pageedit.component.scss']
})
export class PageeditComponent {
  public classicEditor = ClassicEditor;
  pages: Page[] = [];
  title = '';
  content = '';
  rank = '';
  pageuid = '';
  page: Page | null = null;

  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  // editorConfig: AngularEditorConfig = {
  //   editable: true,
  //     spellcheck: true,
  //     height: 'auto',
  //     minHeight: '0',
  //     maxHeight: 'auto',
  //     width: 'auto',
  //     minWidth: '0',
  //     translate: 'yes',
  //     enableToolbar: true,
  //     showToolbar: true,
  //     placeholder: 'Enter text here...',
  //     defaultParagraphSeparator: '',
  //     defaultFontName: '',
  //     defaultFontSize: '',
  //     fonts: [
  //       {class: 'arial', name: 'Arial'},
  //       {class: 'times-new-roman', name: 'Times New Roman'},
  //       {class: 'calibri', name: 'Calibri'},
  //       {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  //     ],
  //     customClasses: [
  //     {
  //       name: 'quote',
  //       class: 'quote',
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: 'titleText',
  //       class: 'titleText',
  //       tag: 'h1',
  //     },
  //   ],
  //   uploadUrl: 'v1/image',
  //   uploadWithCredentials: false,
  //   sanitize: true,
  //   toolbarPosition: 'top',
  //   toolbarHiddenButtons: [
  //     ['bold', 'italic'],
  //     ['fontSize']
  //   ]
  // };

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
