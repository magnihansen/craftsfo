import { Component, HostBinding, HostListener, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { Page } from '../../models/page.model';
import { PageService } from 'src/app/services/page.service';
import { PageHubService } from 'src/app/services/pagehub.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventQueueService } from 'src/app/event-queue/event.queue';
import { AppEventType } from 'src/app/event-queue';
import { environment } from 'src/environments/environment';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
  standalone: true,
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule, LocalLocalizationModule]
}) 
export class NavigationComponent implements OnInit {
  @Input() pageType = 'pages';
  @HostBinding('class.navbar-opened') navbarOpened = false;

  public pages: Page[] = [];
  public isLoggedIn = false;
  public brandName: string;
  public logoUrl: string;
  public isFixedNavbar = false;

  constructor(
    private pageHubService: PageHubService,
    private pageService: PageService,
    private authenticationService: AuthenticationService,
    private eventQueueService: EventQueueService,
    @Inject('HUB_URL') private apiUrl: string
  ) {
    this.brandName = environment.brandName;
    this.logoUrl = environment.logo;
  }

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

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (offset > 10) {
      this.isFixedNavbar = true;
    } else {
      this.isFixedNavbar = false;
    }
  }

  public toggleNavbar(): void {
    this.navbarOpened = !this.navbarOpened;
  }

  private loadPages(): void {
    this.isLoggedIn = this.authenticationService.IsUserLoggedIn;
    if (this.isLoggedIn) {
      this.pageService.getAdminPages().subscribe({
        next: (adminPages: Page[]) => {
          this.pages = adminPages;
        }
      });
    } else {
      this.setupSignalr();
    }
  }

  private startHttpRequest = () => {
    this.pageService.getPages().subscribe({
      next: (pages: Page[]) => {
        this.setAndSortPages(pages);
      }
    });
  }

  private setupSignalr(): void {
    this.pageHubService.startConnection();
    this.pageHubService.addTransferDataListener();
    this.startHttpRequest();

    this.pageHubService.getPagesObservable().subscribe({
      next: (pages: Page[]) => {
        this.setAndSortPages(pages);
      }
    });
  }

  private setAndSortPages(pages: Page[]): void {
    this.pages = pages.sort((a: Page, b: Page) => a.sort > b.sort ? 1 : -1);
  }

  public onSignOut(): void {
    this.authenticationService.logout();
  }
}
