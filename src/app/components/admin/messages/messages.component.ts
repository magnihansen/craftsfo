import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { DataRow } from '../../table/data-row';
import { TableComponent } from '../../table/table.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    imports: [CommonModule, TableComponent, HeaderComponent]
})
export class MessagesComponent {
  messages: DataRow[] = [];

  constructor() { }

  public rowClicked(dataRow: DataRow): void {
    console.log('dataRow', dataRow);
    // this.router.navigate(['/admin/edit/message' + dataRow.rowIdentifier]);
  }

  public deleteRow(dataRow: DataRow): void {
    const pageId: number = parseInt(dataRow.rowIdentifier, undefined);
    // this.pageService.deletePage(pageId).subscribe({
    //   next: (isDeleted: boolean) => {
    //     if (isDeleted) {
    //       this.loadPages();
    //     } else {
    //       console.log('Page not deleted!');
    //     }
    //   },
    //   error: (err: any) => {
    //     console.log('Page delete error', err);
    //   }
    // });
  }
}
