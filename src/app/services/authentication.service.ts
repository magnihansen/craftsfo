import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { AppEvent, AppEventType } from '../event-queue';
import { EventQueueService } from '../event-queue/event.queue';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  static readonly API_TOKEN: string = 'apitoken';
  static readonly USER: string = 'user';
  static readonly IS_USER_LOGGED_IN: string = 'isUserLoggedIn';

  private apiPath = '/V1/Auth';
  private isUserLoggedIn = false;

  public get IsUserLoggedIn(): boolean {
    const lsUserLoggedIn: string = localStorage.getItem(AuthenticationService.IS_USER_LOGGED_IN) || '';
    if (lsUserLoggedIn === 'true') {
      return true;
    }
    return this.isUserLoggedIn;
  }
  public set IsUserLoggedIn(value: boolean) {
    if (value === true) {
      localStorage.setItem(AuthenticationService.IS_USER_LOGGED_IN, 'true');
    }
    this.isUserLoggedIn = value;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private eventQueueService: EventQueueService,
    @Inject('HUB_URL') private apiUrl: string
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
          localStorage.setItem(AuthenticationService.API_TOKEN, response);
          localStorage.setItem(AuthenticationService.USER, JSON.stringify({
            username: userName,
            password: passWord,
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
    localStorage.removeItem(AuthenticationService.IS_USER_LOGGED_IN);
    localStorage.removeItem(AuthenticationService.USER);
    this.router.navigate(['/' + (gotoLogin ? 'login' : '')]).then(() => {
      this.eventQueueService.dispatch(new AppEvent(AppEventType.Logout));
    });
  }

  public getUser(): User {
    const user: string = localStorage.getItem(AuthenticationService.USER) || '{}';
    return JSON.parse(user) as User;
  }

  public loadUser(): Observable<User> {
    const apiToken: string = localStorage.getItem(AuthenticationService.API_TOKEN) || '{}';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<User>(`${this.apiUrl}${this.apiPath}/GetUserByIdentity`, httpOptions)
      .pipe(
        map((user: User) => {
          localStorage.setItem(AuthenticationService.USER, JSON.stringify(user));
          return user;
        }),
        catchError(this.handleError<User>('getUserByToken'))
      );
  }

  public validateToken(): Observable<boolean> {
    const apiToken: string = localStorage.getItem(AuthenticationService.API_TOKEN) || '';
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

  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      // console.error(error);
      // if (error && error.message) {
      //   this.log(`${operation} failed: ${error.message}`);
      // }
      return of(result as T);
    };
  }

  private log(message: string): void {
    console.log(message);
  }
}
