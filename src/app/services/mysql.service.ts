import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from '../interfaces/page';

@Injectable({
    providedIn: 'root'
})
export class MySqlService {
    constructor(
        private http: HttpClient,
        @Inject('HUB_URL') private apiUrl: string
    ) {
    }

    public getPages(): Observable<Page[]> {
        return this.http
            .get<Page[]>(`${this.apiUrl}/V1/Page/GetPages`)
            .pipe(
                catchError(this.handleError<Page[]>('getPages', []))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T): any {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
