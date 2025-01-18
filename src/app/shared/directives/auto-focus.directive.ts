import {AfterContentChecked, Directive, ElementRef} from '@angular/core';

@Directive({
    selector: 'autofocus',
    standalone: false
})
export class AutoFocusDirective implements AfterContentChecked {
  private isFocused = false;

  constructor(
    private element: ElementRef<HTMLInputElement>
  ) {
    this.isFocused = false;
  }

  ngAfterContentChecked(): void {
    if (!this.isFocused) {
      this.element.nativeElement.focus();
      this.isFocused = true;
    }
  }
}
