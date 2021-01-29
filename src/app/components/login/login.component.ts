import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userForm: FormGroup | null = null;
  email = '';
  password = '';
  loginmessage = '';
  isRunningLoginSequence = false;

  constructor(
    private authService: AuthService,
    public ngZone: NgZone,
    private router: Router
  ) { }

  onSubmit(): void {
    this.loginmessage = '';
    if (this.email && this.password && this.isRunningLoginSequence === false) {
      this.isRunningLoginSequence = true;

      this.authService.signinUser(this.email, this.password)
      .then(user => {
        this.ngZone.run(() => {
          this.isRunningLoginSequence = false;
          this.authService.isAuthenticated().then()
          if (this.authService.isAuthenticated()) {
            this.loginmessage = '';
            console.log('Navigate to admin..');
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.authService.clearLocalstorage();
            this.loginmessage = 'Brúkari ikki funnin. Feilboð: ' + localStorage.getItem('LoginError');
          }
        });
      })
      .catch((error) => {
        this.authService.clearLocalstorage();
        this.loginmessage = error;
      });
    } else {
      this.authService.clearLocalstorage();
      this.loginmessage = 'Teldupostur og/ella loyniorð eru ikki útfylt';
    }
  }

  cancelLogin(): void {
    this.router.navigate(['/']);
  }
}
