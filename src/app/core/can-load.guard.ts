import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class CanLoadGuard implements CanLoad {
  constructor(
    private authService: AuthenticationService
  ) { }

  public canLoad(route: Route): boolean {
    const url: string | undefined = route.path;

    if (url === 'admin') {
      this.authService.validateToken().subscribe({
        next: (isValid: boolean) => {
          if (isValid) {
            return true;
          } else {
            this.authService.logout(true);
            return false;
          }
        },
        error: () => {
          this.authService.logout();
          return false;
        }
      });
    }

    return true;
  }
}
