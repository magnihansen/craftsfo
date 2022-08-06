import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('apitoken') || '';
        if (token && this.addAuthorization(request)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }

    private addAuthorization(request: HttpRequest<any>): boolean {
        if (request.url.indexOf('V1/Auth/ValidateToken') > -1 || request.url.indexOf('V1/Auth/Login') > -1) {
            return false;
        }

        return true;
    }
}
