import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../../services/auth.service';
import { Page } from '../../interfaces/page';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  pages: Page[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private af: AngularFireDatabase) { }

  ngOnInit(): void {
    this.af.list('/pages', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
      this.pages = snapshots as Page[];
    });
  }

}
