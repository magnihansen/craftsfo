import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export class CustomDomSharedStylesHost {
    constructor(
      @Inject(DOCUMENT) private _doc: Document
    ) { }

    private _addStylesToHost(
        styles: Set<string>,
        host: Node,
        styleNodes: Node[]
      ): void {
        console.log('_addStylesToHost');
        styles.forEach((style: string) => {
          const styleEl = this._doc.createElement('style');
          if (styleEl) {
            styleEl.textContent = style;
            styleEl.setAttribute('nonce', 'random-csp-nonce'); // Add nonce
            styleNodes.push(host.appendChild(styleEl));
          }
        });
    }
}