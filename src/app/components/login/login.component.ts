import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonModule } from '@angular/common';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, LocalLocalizationModule ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    const qParam = 'returnUrl';
    this.returnUrl = this.route.snapshot.queryParams[qParam] || '/';
  }

  get f(): any {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
    .subscribe({
      next: (res: boolean) => {
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
