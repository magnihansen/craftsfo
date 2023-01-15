import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppEvent, AppEventType } from '../event-queue';
import { EventQueueService } from '../event-queue/event.queue';
import { User } from '../models/user';
import { GlobalVariables } from '../shared/global-variables';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiPath = '/V1/Auth';
  private isUserLoggedIn = false;

  public get IsUserLoggedIn(): boolean {
    const lsUserLoggedIn: string = this.getWithExpiry(GlobalVariables.IS_USER_LOGGED_IN);
    if (lsUserLoggedIn === 'true') {
      return true;
    }
    return this.isUserLoggedIn;
  }

  public set IsUserLoggedIn(value: boolean) {
    if (value === true) {
      this.setWithExpiry(GlobalVariables.IS_USER_LOGGED_IN, 'true', GlobalVariables.ONE_HOUR_IN_MS * 8);
    }
    this.isUserLoggedIn = value;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private eventQueueService: EventQueueService,
    @Inject('API_URL') private apiUrl: string
  ) { }

  public login(userName: string, passWord: string): Observable<boolean> {
    const body = {
      username: userName,
      password: passWord
    };
    return this.http.post<string>(`${this.apiUrl}${this.apiPath}/Login`, body)
      .pipe(
        map(response => {
          this.IsUserLoggedIn = true;
          localStorage.setItem(GlobalVariables.API_TOKEN, response);
          localStorage.setItem(GlobalVariables.USER, JSON.stringify({
            username: userName,
            token: response
          } as User));
          this.eventQueueService.dispatch(new AppEvent(AppEventType.Login));
          return true;
        }),
        catchError(this.handleError<User>('getUserByToken'))
      );
  }

  public logout(gotoLogin = false): void {
    this.IsUserLoggedIn = false;
    localStorage.removeItem(GlobalVariables.IS_USER_LOGGED_IN);
    localStorage.removeItem(GlobalVariables.USER);

    this.router.navigate(['/' + (gotoLogin ? 'login' : '')]).then(() => {
      this.eventQueueService.dispatch(new AppEvent(AppEventType.Logout));
    });
  }

  public getUser(): User {
    const user: string = localStorage.getItem(GlobalVariables.USER) || '{}';
    return JSON.parse(user) as User;
  }

  public loadUser(): Observable<User> {
    const apiToken: string = localStorage.getItem(GlobalVariables.API_TOKEN) || '{}';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<User>(`${this.apiUrl}${this.apiPath}/GetUserByIdentity`, httpOptions)
      .pipe(
        map((user: User) => {
          localStorage.setItem(GlobalVariables.USER, JSON.stringify(user));
          return user;
        }),
        catchError(this.handleError<User>('GetUserByIdentity'))
      );
  }

  public getClaimValue(claimType: string): Observable<object> {
    const apiToken: string = localStorage.getItem(GlobalVariables.API_TOKEN) || '{}';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<object>(`${this.apiUrl}${this.apiPath}/GetClaimValue?claimType=${claimType}`, httpOptions)
      .pipe(
        map((value: object) => {
          return value;
        }),
        catchError(this.handleError<object>('GetClaimValue'))
      );
  }

  public validateToken(): Observable<boolean> {
    const apiToken: string = localStorage.getItem(GlobalVariables.API_TOKEN) || '';
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
      params: {
        token: apiToken
      }
    };
    return this.http.get<boolean>(`${this.apiUrl}/V1/Auth/ValidateToken`, httpOptions);
  }

  public getCdnToken(): Observable<string> {
    const apiToken: string = localStorage.getItem(GlobalVariables.API_TOKEN) || '{}';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };

    return this.http.get<string>(
      `${this.apiUrl}${this.apiPath}/GetCdnToken`,
      httpOptions
    );
  }

  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      // console.error(error);
      // if (error && error.message) {
      //   this.log(`${operation} failed: ${error.message}`);
      // }
      return of(result as T);
    };
  }

  public getWithExpiry(key: string): any {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  public setWithExpiry(key: string, value: any, ttl_ms: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl_ms,
    };
    localStorage.setItem(key, JSON.stringify(item))
  }
}
