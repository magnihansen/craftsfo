import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Page } from '../../interfaces/page';

@Component({
  selector: 'app-routerpagecontent',
  templateUrl: './routerpagecontent.component.html',
  styleUrls: ['./routerpagecontent.component.scss']
})
export class RouterpagecontentComponent {
  content = '';
  pages: Page[] = [];

  constructor(
    private route: ActivatedRoute,
    private af: AngularFireDatabase
  ) {
    const path = this.route.routeConfig?.path ?? '';
    this.loadPage(path);
  }

  loadPage(url: string): void {
    // this.af.list('/pages', ref => ref.orderByChild('link').equalTo(url)).valueChanges().subscribe(snapshots => {
    //   this.pages = snapshots as Page[];
    //   if (this.pages.length === 1) {
    //     this.content = this.pages[0].content;
    //   }
    // });
  }
}
