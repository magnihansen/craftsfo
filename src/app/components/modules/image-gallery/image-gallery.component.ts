import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { I18nService } from 'src/app/localization/i18n.service';
import { Page } from 'src/app/models/page.model';
import { environment } from 'src/environments/environment';
import { BackendComponent } from './ui/components/backend/backend.component';
import { UiDirectiveDirective } from './ui/directives/ui-directive.directive';
import { FrontendComponent } from './ui/components/frontend/frontend.component';
import languageDK from './ui/i18n/da.json';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  standalone: true,
  imports: [ 
    FrontendComponent, 
    BackendComponent, 
    CommonModule, 
    UiDirectiveDirective
  ]
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
  @ViewChild(UiDirectiveDirective, {static: true}) uiHost!: UiDirectiveDirective;

  @Input() public isBackend = false;
  @Input() public page!: Page;

  @Output() public createdChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private i18nService: I18nService
  ) {
    switch (environment.language) {
      case 'da':
        this.i18nService.addTranslations(languageDK);
        break;
    }
  }
  
  ngOnInit(): void {
    this.loadUIComponent();
  }

  private loadUIComponent(): void {
    const viewContainerRef = this.uiHost.viewContainerRef;
    viewContainerRef.clear();

    if (this.isBackend) {
      const componentRef = viewContainerRef.createComponent<BackendComponent>(BackendComponent);
      componentRef.instance.data = this.page;
      componentRef.instance.galleryCreated.subscribe((created: boolean) => {
        this.createdChange.emit(created);
      });
    } else {
      const componentRef = viewContainerRef.createComponent<FrontendComponent>(FrontendComponent);
      componentRef.instance.page = this.page;
    } 
  }

  ngOnDestroy(): void {
    this.i18nService.removeTranslations(languageDK);
  }
}
