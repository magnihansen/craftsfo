import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { I18nService } from "src/app/localization/i18n.service";
import { LocalLocalizationModule } from "src/app/localization/local-localization.module";
import { Setting } from "src/app/models/setting.model";
import { SettingService } from "src/app/services/setting.service";
import { DataColumn } from "../../table/data-column";
import { DataRow } from "../../table/data-row";
import { TableComponent } from "../../table/table.component";
import { HeaderComponent } from "../header/header.component";

@Component({
    standalone: true,
    selector: 'app-setting',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [ CommonModule, LocalLocalizationModule, TableComponent, HeaderComponent ]
  }) 
  export class SettingsComponent implements OnInit {
    @Input() public rows: DataRow[] = [];

    private allowDelete = true;
    private showContextMenu = true;

    constructor(
        private router: Router,
        private i18nService: I18nService,
        private settingService: SettingService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadSettings();
    }

    private loadSettings(): void {

    }

    private createDataRow(data: Setting, index: number): DataRow {
        return {
            rowIndex: index,
            rowIdentifier: data.id.toString(),
            showContextMenu: this.showContextMenu,
            allowDelete: this.allowDelete,
            dataColumns: [
            {
                name: this.i18nService.getTranslation('common.key'),
                value: data.key
            } as DataColumn,
            {
                name: this.i18nService.getTranslation('common.value'),
                value: data.value
            } as DataColumn,
            {
                name: this.i18nService.getTranslation('common.created'),
                value: data.createdDate
            } as DataColumn
            ]
        } as DataRow;
    }

    public rowClicked(data: DataRow): void {
        // should be edited in a modal
        throw new Error("Not implemented yet!");
    }

    public deleteRow(dataRow: DataRow): void {
        const settingId: number = parseInt(dataRow.rowIdentifier, undefined);
        this.settingService.deleteSetting(settingId).subscribe({
          next: (isDeleted: boolean) => {
            if (isDeleted) {
              this.loadSettings();
            } else {
              console.log('warning.setting-not-deleted');
            }
          },
          error: (err: any) => {
            alert('error.setting-delete');
          }
        });
      }
    
      public closeAddPage(data: Setting): void {
        this.rows = [...this.rows, this.createDataRow(data, this.rows.length)];
        this.cdr.detectChanges();
      }
  }