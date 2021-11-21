import { DataColumn } from './data-column';

export interface DataRow {
    rowIndex: number;
    rowIdentifier: string;
    dataColumns: DataColumn[];
    showContextMenu: boolean;
    allowDelete: boolean;
}
