import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[uiDirective]',
  standalone: true
})
export class UiDirectiveDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
