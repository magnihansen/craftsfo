import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('apitoken') || '';
        if (token && !this.isAuthorization(request) && !this.isDomainSettings(request)) {
            // console.log(token, !this.isAuthorization(request), !this.isDomainSettings);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }

    private isAuthorization(request: HttpRequest<any>): boolean {
        if (request.url.indexOf('V1/Auth/ValidateToken') > -1 || request.url.indexOf('V1/Auth/Login') > -1) {
            return true;
        }

        return false;
    }

    private isDomainSettings(request: HttpRequest<any>): boolean {
        if (request.url.indexOf('V1/Setting/GetDomainSettings') > -1) {
            return true;
        }

        return false;
    }
}
