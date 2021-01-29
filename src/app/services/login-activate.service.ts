import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActivate implements CanActivate {
  constructor(
    private authService: AuthService,
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.authService.isAuthenticated().then((result) => {
      return result;
    }).catch((error) => {
      console.log('canActivate', error);
      return false;
    });
  }
}
