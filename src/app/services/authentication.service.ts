import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isUserLoggedIn = false;
  userLoggedInId = 0;

  constructor(
    private http: HttpClient,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  login(userName: string, passWord: string): Observable<boolean> {
    const body = {
      username: userName,
      password: passWord
    };
    return this.http.post<string>(`${this.apiUrl}/login/authenticate`, body)
      .pipe(
        map(response => {
          console.log('Http login response', response);
          localStorage.setItem('apitoken', response);
          localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? 'true' : 'false');
          return true;
        })
      );
  }

  logout(): void {
    this.isUserLoggedIn = false;
    localStorage.removeItem('isUserLoggedIn');
  }

  getUser(): Observable<User> {
    const apiToken: string = localStorage.getItem('apitoken') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: apiToken
      })
    };
    return this.http.get<User>(`${this.apiUrl}/login/getuser`, httpOptions)
      .pipe(
        retry(1),
        map(user => user),
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
