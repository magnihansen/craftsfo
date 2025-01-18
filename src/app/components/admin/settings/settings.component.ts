import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AddSettingKeyComponent } from "src/app/features/add/add-setting-key/add-setting-key.component";
import { AddSettingComponent } from "src/app/features/add/add-setting/add-setting.component";
import { EditSettingComponent } from "src/app/features/edit/edit-setting/edit-setting.component";

import { I18nService } from "src/app/localization/i18n.service";
import { LocalLocalizationModule } from "src/app/localization/local-localization.module";
import { SettingKey } from "src/app/models/setting-key.model";
import { Setting } from "src/app/models/setting.model";
import { SettingService } from "src/app/services/setting.service";
import { DataColumn } from "../../table/data-column";
import { DataRow } from "../../table/data-row";
import { TableComponent } from "../../table/table.component";
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-setting',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [
        CommonModule,
        LocalLocalizationModule,
        TableComponent,
        HeaderComponent,
        AddSettingComponent,
        AddSettingKeyComponent,
        EditSettingComponent
    ]
}) 
  export class SettingsComponent implements OnInit {
    @Input() public rows: DataRow[] = [];

    public showAddSettingModal = false;
    public showEditSettingModal = false;
    public selectedSettingId = 0;
    public showAddSettingKeyModal = false;

    private allowDelete = true;
    private showContextMenu = true;

    constructor(
        private router: Router,
        private i18nService: I18nService,
        private settingService: SettingService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadSettings();
    }

    private loadSettings(): void {
      this.settingService.getSettings().subscribe({
        next: (settings: Setting[]) => {
          this.rows = settings.map(
            (s: Setting, index: number) => {
              return this.createDataRow(s, index);
            }
          );
        }
      });
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
        this.selectedSettingId = +data.rowIdentifier;
        this.showEditSettingModal = true;
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

    public openAddNewSetting(): void {
      this.showAddSettingModal = true;
    }

    public openAddNewSettingKey(): void {
      this.showAddSettingKeyModal = true;
    }

    public closeAddSetting(newSetting: Setting): void {
      if (newSetting) {
        this.rows = [...this.rows, this.createDataRow(newSetting, this.rows.length)];
        this.toastr.success(
          this.i18nService.getTranslation('common.x-saved', { x: this.i18nService.getTranslation('common.setting') })
        );
      }
      this.showAddSettingModal = false;
    }

    public closeEditSetting(updated: boolean): void {
      if (updated) {
        this.loadSettings();
        this.toastr.success(
          this.i18nService.getTranslation('common.x-updated', { x: this.i18nService.getTranslation('common.setting') })
        );
      }
      this.showEditSettingModal = false;
    }

    public closeAddSettingKey(newSettingKey: SettingKey): void {
      this.showAddSettingKeyModal = false;
      if (newSettingKey) {
        this.toastr.success(
          this.i18nService.getTranslation('common.x-saved', { x: this.i18nService.getTranslation('common.setting-key') })
        );
      }
    }
  }