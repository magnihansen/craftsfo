import { ChangeDetectorRef, Component, ContentChild, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PageService } from 'src/app/services/page.service';
import { Page } from '../../../models/page.model';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';
import { FormPageAddService } from 'src/app/services/form-page-add.service';
import { I18nService } from 'src/app/localization/i18n.service';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { AddpageComponent } from 'src/app/features/add/add-page/add-page.component';
import { TableComponent } from '../../table/table.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LocalLocalizationModule, 
    CKEditorModule,
    AddpageComponent,
    TableComponent,
    HeaderComponent
  ],
  providers: [FormPageAddService]
})
export class DashboardComponent implements OnInit {
  @ContentChild('addPageModalContent', { static: false }) private modalContent!: any;

  @Input() public pageRows: DataRow[] = [];

  public showAddPageModal = false;
  private allowDelete = true;
  private showContextMenu = true;

  constructor(
    private router: Router,
    private pageService: PageService,
    private cdr: ChangeDetectorRef,
    private i18nService: I18nService
  ) {}

  public ngOnInit(): void {
    this.loadPages();
  }

  public loadPages(): void {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        const _pageRows: DataRow[] = [];
        pages.sort((a: Page, b: Page) => a.sort < b.sort ? -1 : 0);

        pages.forEach((dataPage: Page, index: number) => {
          _pageRows.push(this.createDataRow(dataPage, index));
        });

        this.pageRows = _pageRows;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private createDataRow(dataPage: Page, index: number): DataRow {
    return {
      rowIndex: index,
      rowIdentifier: dataPage.id.toString(),
      showContextMenu: this.showContextMenu,
      allowDelete: this.allowDelete,
      dataColumns: [
        {
          name: this.i18nService.getTranslation('common.name'),
          value: dataPage.title
        } as DataColumn,
        {
          name: this.i18nService.getTranslation('common.link'),
          value: dataPage.link
        } as DataColumn,
        {
          name: this.i18nService.getTranslation('common.sort'),
          value: dataPage.sort
        } as DataColumn,
        {
          name: this.i18nService.getTranslation('common.created'),
          value: dataPage.createdDate
        } as DataColumn
      ]
    } as DataRow
  }

  public openAddNewPage(): void {
    this.showAddPageModal = true;
  }

  public rowClicked(dataRow: DataRow): void {
    console.log('dataRow', dataRow);
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

  public closeAddPage(newPage: Page): void {
    if (newPage) {
      this.pageRows = [...this.pageRows, this.createDataRow(newPage, this.pageRows.length)];
    }
    this.showAddPageModal = false;
  }
}
