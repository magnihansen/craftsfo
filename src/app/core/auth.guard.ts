import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.authenticationService.validateToken()
            .pipe(
                map((isValid: boolean) => {
                    if (isValid) {
                        return isValid;
                    } else {
                        console.log('canActivate', 'false');
                        this.router.navigate(['/login']);
                        return false;
                    }
                })
            );
    }
}
