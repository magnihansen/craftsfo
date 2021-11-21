import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { I18nService } from 'src/app/localization/i18n.service';
import { DataRow } from '../data-row';

@Component({
  selector: 'app-table-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
  @Input() public dataRow!: DataRow;

  @Output() deleteRowChange: EventEmitter<DataRow> = new EventEmitter();

  public openContextMenu = false;

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openContextMenu = false;
    }
  }

  constructor(
    private eRef: ElementRef,
    private i18nService: I18nService
  ) { }

  public deleteRow(dataRow: DataRow): void {
    const sureMessage: string = this.i18nService.getTranslation('Are you sure you want to delete?');
    if (window.confirm(sureMessage)) {
      this.deleteRowChange.emit(dataRow);
    }
    this.openContextMenu = !this.openContextMenu;
  }
}
