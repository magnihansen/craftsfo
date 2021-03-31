import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../interfaces/page';
import { PageService } from 'src/app/services/page.service';

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
    private router: Router
  ) {
    console.log('RouterpagecontentComponent');
    console.log('router', this.router);

    this.activatedRoute.params.subscribe(params => {
      console.log('params.link', params.link);
      this.loadPage(params.link);
    });
  }

  private loadPage(pageLink: string): void {
    this.pageService.getPageByLink(pageLink).subscribe({
      next: (result: Page) => {
        this.content = result.content.replace('\n', '<br />');
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('Page content for ' + pageLink + ' complete');
      }
    });
  }
}
