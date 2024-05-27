import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppEvent, AppEventType } from '../event-queue';
import { EventQueueService } from '../event-queue/event.queue';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  static readonly ONE_HOUR_IN_MS: number = 3600000;

  private apiPath = '/V1/Auth';
  private _isUserLoggedIn = false;

  public get isUserLoggedIn(): boolean {
    const lsUserLoggedIn: string = this.sessionStorageService.get(environment.storage.session.IS_USER_LOGGED_IN);
    if (lsUserLoggedIn === 'true') {
      this._isUserLoggedIn = true;
    }
    return this._isUserLoggedIn;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private eventQueueService: EventQueueService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  public login(userName: string, passWord: string, remember: boolean = false): Observable<boolean> {
    const body = {
      username: userName,
      password: passWord
    };
    return this.http.post<string>(`${this.apiUrl}${this.apiPath}/Login`, body)
      .pipe(
        map((response: string) => {
          console.log('Login response', response);
          this._isUserLoggedIn = true;
          this.sessionStorageService.set(environment.storage.session.IS_USER_LOGGED_IN, 'true');
          if (remember) {
            this.localStorageService.set(environment.storage.local.API_TOKEN, response);
          }
          this.localStorageService.set(environment.storage.local.USER, JSON.stringify({
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
    console.log('Logout');
    this._isUserLoggedIn = false;
    this.sessionStorageService.remove(environment.storage.session.IS_USER_LOGGED_IN);
    this.localStorageService.remove(environment.storage.local.API_TOKEN);
    this.localStorageService.remove(environment.storage.local.USER);

    this.router.navigate(['/' + (gotoLogin ? 'login' : '')]).then(() => {
      this.eventQueueService.dispatch(new AppEvent(AppEventType.Logout));
    });
  }

  public getUser(): User {
    const user: string = this.localStorageService.get(environment.storage.local.USER) || '{}';
    return JSON.parse(user) as User;
  }

  public loadUser(): Observable<User> {
    const apiToken: string = this.getApiToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<User>(`${this.apiUrl}${this.apiPath}/GetUserByIdentity`, httpOptions)
      .pipe(
        map((user: User) => {
          this.localStorageService.set(environment.storage.local.USER, JSON.stringify(user));
          return user;
        }),
        catchError(this.handleError<User>('GetUserByIdentity'))
      );
  }

  public getClaimValue(claimType: string): Observable<object> {
    const apiToken: string = this.getApiToken();
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
    const apiToken: string = this.getApiToken();
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
      params: {
        token: apiToken
      }
    };
    return this.http.get<boolean>(`${this.apiUrl}/V1/Auth/ValidateToken`, httpOptions)
      .pipe(
        map((value: boolean) => {
          if (value) {
            this._isUserLoggedIn = value;
            this.sessionStorageService.set(environment.storage.session.IS_USER_LOGGED_IN, 'true');
            this.eventQueueService.dispatch(new AppEvent(AppEventType.Login));
          }
          return value;
        })
      );
  }

  public getApiToken(): string {
    return this.localStorageService.get(environment.storage.local.API_TOKEN) || '{}';
  }

  public get isApiTokenSet(): boolean {
    return this.getApiToken() !== '{}';
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
}
