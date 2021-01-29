import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../../../services/auth.service';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../interfaces/page';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-pageedit',
  templateUrl: './pageedit.component.html',
  styleUrls: ['./pageedit.component.scss']
})
export class PageeditComponent implements OnInit {
  pages: Page[] = [];
  title = '';
  content = '';
  rank = '';
  pageuid = '';
  messageStatus = '';
  page: Page | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private pageService: PageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.loadPage(params.id));
  }

  ngOnInit(): void {
  }

  generateArray(obj: string): any {
    return Object.keys(obj).map((key: any) => obj[key]);
  }

  loadPage(uid: string): void {
    this.pageuid = uid;

    this.db.object<Page>('/pages/' + uid).valueChanges().subscribe(p => {
      const pageObj: Page = p as Page;
      this.page = pageObj;
      this.title = pageObj.title;
      this.rank = pageObj.rank;
      this.content = pageObj.content.replace('\n', '<br />');
    });
  }

  gotoDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  onSubmit(): void {
    if (this.authService.isAuthenticated()) {
      if (this.page) {
        this.page.content = this.content;
        this.page.title = this.title;
        this.pageService.updatePage(this.page.uid, this.page);

        this.messageStatus = 'Teksten gemt';
      } else {
        this.messageStatus = 'Teksten ikke gemt!';
      }
    }
  }
}
