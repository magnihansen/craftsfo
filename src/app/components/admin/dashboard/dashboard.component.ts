import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { AuthenticationService } from '../../../services/authentication.service';
import { Page } from '../../../interfaces/page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pages: Page[] = [];
  newPage: Page | null = null;
  guid = '';
  showAddPage = false;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    console.log('Dashboard');
  }

  ngOnInit(): void {
    // this.af.list('/pages', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
    //   this.pages = snapshots as Page[];
    // });
  }

  toggleAddNewPage(): void {
    this.showAddPage = !this.showAddPage;
  }

  addPage(title: string, link: string, content: string, rank: string): void {
    // if (this.authService.isAuthenticated()) {
    //   this.newPage = {
    //     uid: uuid.v4(),
    //     rank,
    //     parent: '',
    //     title,
    //     link,
    //     content,
    //     active: true
    //   };
    //   // this.af.list('/pages').push(this.newPage);
    // }
  }
}
