import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiPath = '/V1/User';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient,
        @Inject('API_URL') private apiUrl: string
    ) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}${this.apiPath}/GetUsers`, this.httpOptions);
    }
}
