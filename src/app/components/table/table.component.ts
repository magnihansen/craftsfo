import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { DataColumn } from './data-column';
import { DataRow } from './data-row';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    imports: [CommonModule, LocalLocalizationModule, ContextMenuComponent, EmptyStateComponent]
})
export class TableComponent implements OnChanges {
  @Input()
  get dataRows(): DataRow[] {
    return this._data;
  }
  set dataRows(dataRows: DataRow[]) {
    if (this._data !== dataRows) {
      this._data = dataRows;
      this.dataRowsChange.emit(dataRows);
    }
  }

  @Output() dataRowsChange: EventEmitter<DataRow[]> = new EventEmitter();
  @Output() rowClicked: EventEmitter<DataRow> = new EventEmitter();
  @Output() deleteRowChange: EventEmitter<DataRow> = new EventEmitter();

  private _data: DataRow[] = [];

  public columns: DataColumn[] = [];
  public showContextMenu = false;
  public openContextMenu = false;
  public allowDelete = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.columns = [];
    if (this._data.length > 0) {
      const dataRow: DataRow = this._data[0];
      this.showContextMenu = dataRow.showContextMenu;
      this.allowDelete = dataRow.allowDelete;

      dataRow.dataColumns.forEach((dataColumn: DataColumn) => {
        this.columns.push(dataColumn);
      });
    }
  }

  public rowClick(dataRow: DataRow): void {
    this.rowClicked.emit(dataRow);
  }

  public deleteRow(dataRow: DataRow): void {
    this.openContextMenu = !this.openContextMenu;
    this.deleteRowChange.emit(dataRow);
  }
}
