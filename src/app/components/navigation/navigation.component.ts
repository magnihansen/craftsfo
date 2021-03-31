import { Component, Inject, Input, OnInit } from '@angular/core';
import { Page } from '../../interfaces/page';
import { PageService } from 'src/app/services/page.service';
import { PageHubService } from 'src/app/services/pagehub.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() pageType = 'pages';
  public pages: Page[] = [];

  constructor(
    private pageHubService: PageHubService,
    private pageService: PageService,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  ngOnInit(): void {
    if (this.pageType === 'pages') {
      this.pageHubService.startConnection();
      this.pageHubService.addTransferDataListener();
      this.startHttpRequest();

      this.pageHubService.getPages().subscribe(pages => {
        console.log('pageHubService.getPages()');
        this.pages = pages;
      });
    } else {
      const adminPages: Page[] = this.pageService.getAdminPages();
      console.log('load admin pages', adminPages);
      this.pages = adminPages;
    }
  }

  private startHttpRequest = () => {
    this.http.get(`${this.apiUrl}/Page/GetPages`).subscribe(res => {
      this.pages = res as Page[];
    });
  }

  public onSignOut(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
