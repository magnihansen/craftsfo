import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../interfaces/page';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-pageedit',
  templateUrl: './pageedit.component.html',
  styleUrls: ['./pageedit.component.scss']
})
export class PageeditComponent implements OnInit {
  public classicEditor = ClassicEditor;
  pages: Page[] = [];
  title = '';
  content = '';
  rank = '';
  pageuid = '';
  messageStatus = '';
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
    private route: ActivatedRoute
  ) {
    console.log('PageeditComponent');
    this.route.params.subscribe(params => this.loadPage(params.id));
  }

  ngOnInit(): void {
    console.log('PageeditComponent :: ngOnInit');
  }

  generateArray(obj: string): any {
    return Object.keys(obj).map((key: any) => obj[key]);
  }

  loadPage(uid: number): void {
    // this.pageService.getPage(uid).subscribe({
    //   next: (result: Page) => {
    //     console.log(result);
    //     this.page = result;
    //     this.title = result.title;
    //     this.rank = result.rank.toString();
    //     this.content = result.content.replace('\n', '<br />');
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log('complete');
    //   }
    // });
  }

  gotoDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  onSubmit(): void {
    // if (this.authService.isAuthenticated()) {
    //   if (this.page) {
    //     this.page.content = this.content;
    //     this.page.title = this.title;
    //     this.pageService.updatePage(this.page.uid, this.page);

    //     this.messageStatus = 'Teksten gemt';
    //   } else {
    //     this.messageStatus = 'Teksten ikke gemt!';
    //   }
    // }
  }
}
