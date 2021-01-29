import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase} from '@angular/fire/database';
import { Imageslide } from './interfaces/imageslide';
import { SharedService } from './services/shared.service';
import { Company } from './interfaces/company';
import { Page } from './interfaces/page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss']
})
export class AppComponent {
  slides: Imageslide[] = [];
  company: Company | null = null;
  pages: Page[] = [];

  constructor(
    private shared: SharedService,
    private router: Router,
    private af: AngularFireDatabase
  ) {
      // this.shared.company().subscribe(c => {
      //   this.company = c;
      //   console.log('this.company', this.company);
      // });
      // this.shared.pages().subscribe(p => {
      //   this.pages = p;
      //   console.log('this.pages', this.pages);
      // });
      // this.router.errorHandler = (error: any) => {
      //   this.router.navigate(['404']); // or redirect to default route
      // };
      // this.af.list('/slides', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
      //   this.slides = snapshots as Imageslide[];
      // });
    }
}
