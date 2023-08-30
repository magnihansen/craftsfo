import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AppEventType } from 'src/app/event-queue';
import { EventQueueService } from 'src/app/event-queue/event.queue';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Company } from '../../models/company.model';
import { Developer } from '../../models/developer.model';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [ FormsModule, CommonModule, LocalLocalizationModule ]
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
    this.company = { name: '', address: '', zip: 0, city: '', phone: 0, email: '', cvr: 0 };
    this.developer = { name: '', url: '', facebook: '' };
  }

  public ngOnInit(): void {
    this.eventQueueService.on(AppEventType.Login).subscribe({
      next: () => {
        this.isLoggedIn = this.authenticationService.isUserLoggedIn;
      }
    });
    this.eventQueueService.on(AppEventType.Logout).subscribe({
      next: () => {
        this.isLoggedIn = this.authenticationService.isUserLoggedIn;
      }
    });
    this.isLoggedIn = this.authenticationService.isUserLoggedIn;
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
