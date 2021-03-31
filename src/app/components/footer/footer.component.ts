import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../interfaces/company';
import { Developer } from '../../interfaces/developer';
import { AuthenticationService } from '../../services/authentication.service';

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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    console.log('FooterComponent');
    // this.date = new Date();
    this.company = { name: '', address: '', zip: 0, city: '', phone: 0, email: '', cvr: 0 };
    this.developer = { name: '', url: '', facebook: '' };

    // const companyItem = sessionStorage.getItem('company');
    // if (companyItem != null) {
    //   this.company = JSON.parse(companyItem) as Company;
    //   this.hasCompanyLoaded = true;
    // }
    // const developItem = sessionStorage.getItem('developer');
    // if (developItem != null) {
    //   this.developer = JSON.parse(developItem) as Developer;
    //   this.hasDeveloperLoaded = true;
    // }
  }

  ngOnInit(): void {
    // if (!this.hasCompanyLoaded) {
    //   firebase.default.database().ref('/company').on('value', snapshot => {
    //     this.company = snapshot.toJSON() as Company;
    //     if (this.company) {
    //       sessionStorage.setItem('company', JSON.stringify(this.company));
    //       this.hasCompanyLoaded = true;
    //     }
    //   });
    // }
    // if (!this.hasDeveloperLoaded) {
    //   firebase.default.database().ref('/developer').on('value', snapshot => {
    //     this.developer = snapshot.toJSON() as Developer;
    //     if (this.developer) {
    //       sessionStorage.setItem('developer', JSON.stringify(this.developer));
    //       this.hasDeveloperLoaded = true;
    //     }
    //   });
    // }
  }

  // public isAuthenticatedAsync(): Promise<boolean> {
  //   return this.authService.isAuthenticated()
  //     .then(result => result)
  //     .catch(() => false);
  // }

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
}
