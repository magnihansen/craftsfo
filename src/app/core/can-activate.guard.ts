import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateGuard  {
  constructor(
    private authService: AuthenticationService
  ) { }

public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const url: string = route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');

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
