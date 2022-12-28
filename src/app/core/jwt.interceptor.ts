import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariables } from '../shared/global-variables';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const api_token: string = localStorage.getItem(GlobalVariables.API_TOKEN) || '';
        // console.log('request', request);
        // console.log('isAuthorization', this.isAuthorization(request));
        // console.log('isDomainSettings', this.isDomainSettings(request));
        // console.log('isCdn', this.isCdn(request));
        if (api_token && !this.isAuthorization(request) && !this.isDomainSettings(request) && !this.isCdn(request)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${api_token}`
                }
            });
        } else if (this.isCdn(request)) {
            const cdn_token: string = localStorage.getItem(GlobalVariables.CDN_TOKEN) || '';
            if (cdn_token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${cdn_token}`
                    }
                });
            }
        }
        return next.handle(request);
    }

    private isCdn(request: HttpRequest<any>): boolean {
        if (request.url.indexOf('V1/Cdn/') > -1) {
            return true;
        }
        return false;
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
