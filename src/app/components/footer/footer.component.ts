import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { AppEventType } from 'src/app/event-queue';
import { EventQueueService } from 'src/app/event-queue/event.queue';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Company } from '../../interfaces/company';
import { Developer } from '../../interfaces/developer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  company: Company;
  developer: Developer;
  date: Date = new Date();
  hasCompanyLoaded = false;
  hasDeveloperLoaded = false;
  isLoggedIn = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private eventQueueService: EventQueueService
  ) {
    console.log('FooterComponent');

    // this.date = new Date();
    this.company = { name: '', address: '', zip: 0, city: '', phone: 0, email: '', cvr: 0 };
    this.developer = { name: '', url: '', facebook: '' };
  }

  ngOnInit(): void {
    this.eventQueueService.on(AppEventType.Login).subscribe({
      next: () => {
        this.isLoggedIn = this.authenticationService.IsUserLoggedIn;
      }
    });
    this.eventQueueService.on(AppEventType.Logout).subscribe({
      next: () => {
        this.isLoggedIn = this.authenticationService.IsUserLoggedIn;
      }
    });
    this.isLoggedIn = this.authenticationService.IsUserLoggedIn;
  }

  clearSearch(search: any): void {
    search.value = '';
  }

  onSearch(value: string): void {
    if (value.length > 0) {
      this.router.navigate(['/resultater', value]);
    }
  }

  generateArray(obj: any): any {
    return Object.keys(obj).map((key) => obj[key]);
  }

  gotoLogin(): void {
    this.router.navigateByUrl('/login', { skipLocationChange: true });
  }

  gotoLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
