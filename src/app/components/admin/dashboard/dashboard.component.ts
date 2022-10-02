import { AfterViewInit, Component, ContentChild, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControlStatus, FormGroup } from '@angular/forms';

import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PageService } from 'src/app/services/page.service';
import { Page } from '../../../models/page.model';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';
import * as uuid from 'uuid';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormPageAddService } from 'src/app/services/form-page-add.service';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../modal/modal.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ContentChild('addPageModalContent', { static: false }) private modalContent!: any;

  @Input() public pageRows: DataRow[] = [];

  public classicEditor = ClassicEditor;
  public newPage?: Page;
  public formPageAdd: FormGroup = new FormGroup({});
  public formPageAddState?: Subscription;
  public guid = '';
  public showAddPageModal = false;

  constructor(
    private router: Router,
    private pageService: PageService,
    private authService: AuthenticationService,
    private formPageAddService: FormPageAddService,
    @Inject(DOCUMENT) private modalDocument: Document
  ) {
    this.formPageAdd = this.formPageAddService.addPageForm.controls['addpage'] as FormGroup;
  }

  public ngOnInit(): void {
    this.loadPages();
  }

  public ngAfterViewInit(): void {
    this.formPageAddState = this.formPageAdd.statusChanges
      .subscribe({
        next: (state: FormControlStatus) => {
          this.formPageAddService.isFormValid = (state === 'INVALID' ? false : true);
        }
      });
  }

  private loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        const _allowDelete = true;
        const _showContextMenu = true;
        const _pageRows: DataRow[] = [];
        pages.sort((a: Page, b: Page) => a.pageRank < b.pageRank ? -1 : 0);

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
    if (!this.showAddPageModal) {
      const ap: FormGroup = (this.formPageAddService.addPageForm.controls['addpage'] as FormGroup);
      ap.controls.pageRank.setValue((this.pageRows.length + 1).toString());

      const inputs: any = this.modalDocument.querySelectorAll('input');
      console.log('toggleAddNewPage', inputs);
    }
    this.showAddPageModal = !this.showAddPageModal;
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

  public addPage(form: any): void {
    if (this.authService.IsUserLoggedIn) {
      const user: User = this.authService.getUser();
      
      const ap: FormGroup = (this.formPageAddService.addPageForm.controls['addpage'] as FormGroup);

      const pageRank: string = ap.controls.pageRank.value as string;
      const title: string = ap.controls.title.value as string;
      const link: string = ap.controls.link.value as string;
      const content: string = ap.controls.content.value as string;

      const newPage: Page = {
        uid: uuid.v4(),
        pageRank,
        parent: '',
        title,
        link,
        content,
        active: true,
        createdBy: user.username
      } as Page;

      this.pageService.addPage(newPage).subscribe({
        next: (result: boolean) => {
          if (result) {
            // this.closeAddpage(true);
            // toast => page added
          }
        },
        error: (err: any) => {
          // do nothing yet 
        }
      });
    }
  }

  public closeModal(modalClosed: boolean): void {
    if (modalClosed) {
      this.formPageAddService.addPageForm.reset();
      this.loadPages();
      this.showAddPageModal = false;
    }
  }

  public ngOnDestroy(): void {
    this.formPageAddState?.unsubscribe();
  }
}
