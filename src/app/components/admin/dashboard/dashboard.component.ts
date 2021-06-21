import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { PageService } from 'src/app/services/page.service';
import * as uuid from 'uuid';
import { Page } from '../../../interfaces/page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private _pages: Page[] = [];
  private _showAddPage = false;
  public newPage: Page | null = null;
  public guid = '';

  public get pages(): Page[] {
    return this._pages;
  }
  public set pages(p: Page[]) {
    this._pages = p;
  }

  public get showAddPage(): boolean {
    return this._showAddPage;
  }
  public set showAddPage(value: boolean) {
    this._showAddPage = value;
  }

  constructor(
    private pageService: PageService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    console.log('Dashboard');
  }

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.loadPages();
    });
  }

  loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        this.pages = pages;
        console.log('loadPages()');
      },
      error: (err: any) => console.log(err)
    });
  }

  toggleAddNewPage(): void {
    this.showAddPage = !this.showAddPage;
    console.log('this.showAddPage', this.showAddPage);
  }

  addPage(title: string, link: string, content: string, rank: string): void {
    // if (this.authService.isAuthenticated()) {
    //   this.newPage = {
    //     uid: uuid.v4(),
    //     rank,
    //     parent: '',
    //     title,
    //     link,
    //     content,
    //     active: true
    //   };
    //   // this.af.list('/pages').push(this.newPage);
    // }
  }
}
