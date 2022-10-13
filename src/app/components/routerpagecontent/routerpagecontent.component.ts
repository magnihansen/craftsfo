import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../models/page.model';
import { PageService } from 'src/app/services/page.service';
import { MiscHelper } from 'src/app/helpers/misc.helper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routerpagecontent',
  templateUrl: './routerpagecontent.component.html',
  styleUrls: ['./routerpagecontent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RouterpagecontentComponent {
  content = '';
  pages: Page[] = [];

  constructor(
    private pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private miscHelper: MiscHelper
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.loadPageByLink(params.link);
    });
  }

  private loadPageByLink(pageLink: string | undefined): void {
    this.pageService.getPageByLink(pageLink).subscribe({
      next: (result: Page) => {
        this.content = result.content.replace(/\n/gi, '<br />').replace(/<p>&nbsp;<\/p>/gi, '<p class="empty">&nbsp;</p>');
      },
      error: (err: HttpErrorResponse) => {
        this.miscHelper.handleError(err);
      }
    });
  }
}
