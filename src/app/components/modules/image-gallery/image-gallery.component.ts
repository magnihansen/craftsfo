import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { I18nService } from 'src/app/localization/i18n.service';
import { Page } from 'src/app/models/page.model';
import { environment } from 'src/environments/environment';
import { BackendComponent } from './ui/backend/backend.component';
import { UiDirectiveDirective } from './ui/directives/ui-directive.directive';
import { FrontendComponent } from './ui/frontend/frontend.component';
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
  @Input() public page: Page = {} as Page;

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
    } else {
      const componentRef = viewContainerRef.createComponent<FrontendComponent>(FrontendComponent);
      componentRef.instance.data = this.page;
    } 
  }

  ngOnDestroy(): void {
    this.i18nService.removeTranslations(languageDK);
  }
}
