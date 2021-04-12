import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Page } from '../../interfaces/page';
import { PageService } from 'src/app/services/page.service';
import { PageHubService } from 'src/app/services/pagehub.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {
  @Input() pageType = 'pages';
  public pages: Page[] = [];
  public isLoggedIn = false;

  constructor(
    private pageHubService: PageHubService,
    private pageService: PageService,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isUserLoggedIn;
    if (this.pageType === 'pages') {
      this.pageHubService.startConnection();
      this.pageHubService.addTransferDataListener();
      this.startHttpRequest();

      this.pageHubService.getPages().subscribe(pages => {
        this.pages = pages;
      });
    } else {
      const adminPages: Page[] = this.pageService.getAdminPages();
      this.pages = adminPages;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.pages) {
        this.isLoggedIn = this.authenticationService.isUserLoggedIn;
      }
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
