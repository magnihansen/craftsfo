import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.authenticationService.validateToken()
            .pipe(
                map((isValid: boolean) => {
                    console.log('canActivate', isValid);
                    return true;
                })
            );
    }
}
