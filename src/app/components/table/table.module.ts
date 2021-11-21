import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { TableComponent } from './table.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@NgModule({
    declarations: [
      TableComponent,
      ContextMenuComponent
    ],
    imports: [
      FormsModule,
      BrowserModule,
      CommonModule,
      LocalLocalizationModule
    ],
    exports: [
      TableComponent
    ]
})

export class TableModule {
  constructor() {
    console.log('TableModule');
  }
}
