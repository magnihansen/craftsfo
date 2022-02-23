import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public company: Company;
  public developer: Developer;
  public date: Date = new Date();
  public hasCompanyLoaded = false;
  public hasDeveloperLoaded = false;
  public isLoggedIn = false;

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

  public ngOnInit(): void {
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

  public clearSearch(search: any): void {
    search.value = '';
  }

  public onSearch(value: string): void {
    if (value.length > 0) {
      this.router.navigate(['/resultater', value]);
    }
  }

  public generateArray(obj: any): any {
    return Object.keys(obj).map((key) => obj[key]);
  }

  public gotoLogin(): void {
    this.router.navigate(['/login']);
  }

  public gotoLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
