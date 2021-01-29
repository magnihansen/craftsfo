import { Component, OnInit } from '@angular/core';
import * as uuid from 'uuid';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../../../services/auth.service';
import { Page } from '../../../interfaces/page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pages: Page[];
  newPage: Page;
  guid: string;
  showAddPage = false;

  constructor(
    private authService: AuthService,
    private af: AngularFireDatabase
  ) {
    console.log('Dashboard');
  }

  ngOnInit() {
    this.af.list('/pages', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
      this.pages = snapshots as Page[];
    });
  }

  toggleAddNewPage() {
    this.showAddPage = !this.showAddPage;
  }

  addPage(title: string, link: string, content: string, rank: number) {
    if (this.authService.isAuthenticated()) {
      this.newPage = {
        uid: uuid.v4(),
        rank: rank,
        parent: '',
        title: title,
        link: link,
        content: content,
        active: true
      };
      this.af.list('/pages').push(this.newPage);
      return false;
    }
  }
}
