import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  showToTopButton = false;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log('MainLayoutComponent');
    this.showToTopButton = this.hasScrollBar(this.document.body);
  }

  hasScrollBar = (element: any) => {
    const {scrollTop} = element;
    if (scrollTop > 0) {
      return true;
    }
    element.scrollTop += 10;
    if (scrollTop === element.scrollTop) {
      return false;
    }
    // undoing the change
    element.scrollTop = scrollTop;
    return true;
  }
}
