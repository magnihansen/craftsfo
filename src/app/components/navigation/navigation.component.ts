import { Component, Inject, Input, OnInit } from '@angular/core';
import { Page } from '../../interfaces/page';
import { PageService } from 'src/app/services/page.service';
import { PageHubService } from 'src/app/services/pagehub.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventQueueService } from 'src/app/event-queue/event.queue';
import { AppEventType } from 'src/app/event-queue';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() pageType = 'pages';
  public pages: Page[] = [];
  public isLoggedIn = false;

  constructor(
    private pageHubService: PageHubService,
    private pageService: PageService,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private eventQueueService: EventQueueService,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  ngOnInit(): void {
    this.eventQueueService.on(AppEventType.Login).subscribe({
      next: () => {
        this.loadPages();
      }
    });
    this.eventQueueService.on(AppEventType.Logout).subscribe({
      next: () => {
        this.loadPages();
      }
    });

    this.loadPages();
  }

  private loadPages(): void {
    this.isLoggedIn = this.authenticationService.IsUserLoggedIn;
    if (this.isLoggedIn) {
      const adminPages: Page[] = this.pageService.getAdminPages();
      this.pages = adminPages;
    } else {
      this.pageHubService.startConnection();
      this.pageHubService.addTransferDataListener();
      this.startHttpRequest();

      this.pageHubService.getPages().subscribe(pages => {
        this.pages = pages;
      });
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
