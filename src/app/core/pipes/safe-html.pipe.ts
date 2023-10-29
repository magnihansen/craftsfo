import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify';
import { trustedTypes } from 'trusted-types';

@Pipe({
    standalone: true,
    name: 'safeHtml'
})
export class HandleSafeHtmlPipe implements PipeTransform {
  transform(content: string): TrustedHTML {
    const policy = trustedTypes.createPolicy('safeHtml', { 
      createHTML: (s: any) => { return s; } 
    });
    content = content.replace(/\n/gi, '<br />').replace(/<p>&nbsp;<\/p>/gi, '<p class="empty">&nbsp;</p>');
    var safeHtml: SafeHtml = DOMPurify.sanitize(content);

    const trustedHTML: TrustedHTML = policy.createHTML(safeHtml);
    return trustedHTML;
  }
}
