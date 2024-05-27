import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { FormsService } from 'src/app/services/forms.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, LocalLocalizationModule ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private formsService: FormsService
  ) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    const qParam = 'returnUrl';
    this.returnUrl = this.route.snapshot.queryParams[qParam] || '/';

    this.loginForm = this.formsService.formGroups.controls['login'] as FormGroup;
    console.log(this.loginForm);

    this.validateApiToken();
  }

  get f(): any {
    return this.loginForm.controls;
  }

  private validateApiToken(): void {
    if (this.authenticationService.isApiTokenSet) {
      this.authenticationService.validateToken().subscribe({
        next: (tokenValid: boolean) => {
          if (tokenValid) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.authenticationService.logout();
          }
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.loginForm);
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value, this.f.remember.value)
    .subscribe({
      next: (res: boolean) => {
        console.log('Login result', res);
        if (res) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onReset(): void {
    this.router.navigate(['/']);
  }
}
