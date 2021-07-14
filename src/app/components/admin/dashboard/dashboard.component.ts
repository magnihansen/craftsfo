import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageService } from 'src/app/services/page.service';
// import * as uuid from 'uuid';
import { Page } from '../../../interfaces/page';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _pages: Page[] = [];
  private _showAddPage = false;
  public newPage: Page | null = null;
  public guid = '';
  public pageRows: DataRow[] = [];

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
    private pageService: PageService
  ) {
    console.log('Dashboard');
  }

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        this.pages = pages;
        pages.forEach((dataPage: Page) => {
          this.pageRows.push(
            {
              dataColumns: [
                {
                  name: 'Navn',
                  value: dataPage.title
                } as DataColumn,
                {
                  name: 'Link',
                  value: dataPage.link
                } as DataColumn
              ]
            } as DataRow
          );
        });
        console.log('this.pageRows', this.pageRows);
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

  ngOnDestroy(): void {
  }
}
