import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { AppEvent, AppEventType } from '../event-queue';
import { EventQueueService } from '../event-queue/event.queue';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isUserLoggedIn = false;

  public get IsUserLoggedIn(): boolean {
    const lsUserLoggedIn: string = localStorage.getItem('isUserLoggedIn') || '';
    if (lsUserLoggedIn === 'true') {
      return true;
    }
    return this.isUserLoggedIn;
  }
  public set IsUserLoggedIn(value: boolean) {
    if (value === true) {
      localStorage.setItem('isUserLoggedIn', 'true');
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
    return this.http.post<string>(`${this.apiUrl}/V1/Login/Authenticate`, body)
      .pipe(
        map(response => {
          this.IsUserLoggedIn = true;
          localStorage.setItem('apitoken', response);

          this.loadUser().subscribe({
            next: (user: User) => {
              console.log('User loaded');
            }
          });

          this.eventQueueService.dispatch(new AppEvent(AppEventType.Login));
          return true;
        })
      );
  }

  public logout(): void {
    this.IsUserLoggedIn = false;
    localStorage.removeItem('isUserLoggedIn');
    this.router.navigate(['/']).then(() => {
      this.eventQueueService.dispatch(new AppEvent(AppEventType.Logout));
    });
  }

  public getUser(): User {
    const user: string = localStorage.getItem('user') || '';
    return JSON.parse(user) as User;
  }

  public loadUser(): Observable<User> {
    const apiToken: string = localStorage.getItem('apitoken') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<User>(`${this.apiUrl}/V1/User/GetUserByIdentity`, httpOptions)
      .pipe(
        retry(1),
        map((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }),
        catchError(this.handleError<User>('getUserByToken'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string): void {
    console.log(message);
  }
}
