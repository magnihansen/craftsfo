import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from 'src/app/services/page.service';
import { Page } from '../../../interfaces/page';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() public pageRows: DataRow[] = [];

  private _showAddPage = false;
  public newPage: Page | null = null;
  public guid = '';

  public get showAddPage(): boolean {
    return this._showAddPage;
  }
  public set showAddPage(value: boolean) {
    this._showAddPage = value;
  }

  constructor(
    private router: Router,
    private pageService: PageService
  ) { }

  ngOnInit(): void {
    this.loadPages();
  }

  private loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        const _allowDelete = true;
        const _showContextMenu = true;
        const _pageRows: DataRow[] = [];

        pages.forEach((dataPage: Page, index: number) => {
          _pageRows.push(
            {
              rowIndex: index,
              rowIdentifier: dataPage.id.toString(),
              showContextMenu: _showContextMenu,
              allowDelete: _allowDelete,
              dataColumns: [
                {
                  name: 'Navn',
                  value: dataPage.title
                } as DataColumn,
                {
                  name: 'Link',
                  value: dataPage.link
                } as DataColumn,
                {
                  name: 'Rank',
                  value: dataPage.pageRank
                } as DataColumn,
                {
                  name: 'Updated',
                  value: dataPage.updatedDate
                } as DataColumn
              ]
            } as DataRow
          );
        });
        this.pageRows = _pageRows;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public toggleAddNewPage(): void {
    this.showAddPage = !this.showAddPage;
  }

  public rowClicked(dataRow: DataRow): void {
    this.router.navigate(['/admin/editpage/' + dataRow.rowIdentifier]);
  }

  public deleteRow(dataRow: DataRow): void {
    const pageId: number = parseInt(dataRow.rowIdentifier, undefined);
    this.pageService.deletePage(pageId).subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          this.loadPages();
        } else {
          console.log('Page not deleted!');
        }
      },
      error: (err: any) => {
        console.log('Page delete error', err);
      }
    });
  }

  public closeAddpage(closed: boolean): void {
    if (closed) {
      this.showAddPage = false;
      this.loadPages();
    }
  }
}
