import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../interfaces/page';
import { PageService } from 'src/app/services/page.service';
import { MiscHelper } from 'src/app/helpers/misc.helper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routerpagecontent',
  templateUrl: './routerpagecontent.component.html',
  styleUrls: ['./routerpagecontent.component.scss']
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
      this.loadPage(params.link);
    });
  }

  private loadPage(pageLink: string | undefined): void {
    this.pageService.getPageByLink(pageLink).subscribe({
      next: (result: Page) => {
        this.content = result.content.replace('\n', '<br />');
      },
      error: (err: HttpErrorResponse) => {
        this.miscHelper.handleError(err);
      }
    });
  }
}
