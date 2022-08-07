import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControlStatus, FormGroup } from '@angular/forms';

import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PageService } from 'src/app/services/page.service';
import { Page } from '../../../interfaces/page';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';
import * as uuid from 'uuid';
import { FormPageAddService } from 'src/app/services/form-page-add.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public pageRows: DataRow[] = [];

  public newPage?: Page;
  public formPageAdd: FormGroup = new FormGroup({});
  public formPageAddState?: Subscription;
  public guid = '';
  public get showAddPage(): boolean {
    return this._showAddPage;
  }
  public set showAddPage(value: boolean) {
    this._showAddPage = value;
  }

  private _showAddPage = false;

  constructor(
    private router: Router,
    private pageService: PageService,
    private authService: AuthenticationService,
    private formPageAddService: FormPageAddService
  ) {
    console.log('addPageForm', this.formPageAddService.addPageForm);
    console.log('addPage', this.formPageAddService.addPageForm.controls.addPage);
    this.formPageAdd = this.formPageAddService.addPageForm;
    console.log('formPageAdd', this.formPageAdd);
  }

  public ngOnInit(): void {
    this.loadPages();
  }

  public ngAfterViewInit(): void {
    // this.formPageAdd = this.formPageAddService.addPageForm.controls.addPage as FormGroup;
    // this.formPageAddState = this.formPageAdd.statusChanges
    //   .subscribe({
    //     next: (state: FormControlStatus) => {
    //       this.formPageAddService.isFormValid = (state === 'INVALID' ? false : true);
    //     }
    //   });
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

  public addPage(form: any): void {
    if (this.authService.IsUserLoggedIn) {
      const user: User = this.authService.getUser();

      // const ap: FormGroup = (this.formPageAddService.addPageForm.controls.addPage as FormGroup);

      // const rank: string = ap.controls.rank.value as string;
      // const title: string = ap.controls.title.value as string;
      // const link: string = ap.controls.link.value as string;
      // const content: string = ap.controls.content.value as string;

      // const newPage: Page = {
      //   uid: uuid.v4(),
      //   rank,
      //   parent: '',
      //   title,
      //   link,
      //   content,
      //   active: true,
      //   createdBy: user.username
      // } as Page;

      // this.pageService.addPage(newPage).subscribe((result: boolean) => {
      //   if (result) {
      //     this.closeAddpage(true);
      //   }
      // });
    }
  }

  public ngOnDestroy(): void {
    this.formPageAddState?.unsubscribe();
  }
}
