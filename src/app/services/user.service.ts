import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private http: HttpClient,
        @Inject('HUB_URL') private apiUrl: string
    ) { }

    getAll(): Observable<any> {
        return this.http.get<User[]>(`${this.apiUrl}/V1/Users`);
    }
}
