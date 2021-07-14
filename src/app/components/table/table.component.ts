import { Component, Input, OnInit } from '@angular/core';
import { DataColumn } from './data-column';
import { DataRow } from './data-row';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() public data: DataRow[] = [];

  public columns: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // this.data.forEach((dataRow: DataRow) => {
    //   dataRow.dataColumns.forEach((dataColumn: DataColumn) => {
    //     this.columns.push(dataColumn.name);
    //   });
    // });
  }
}
