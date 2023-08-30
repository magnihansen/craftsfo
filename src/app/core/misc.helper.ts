import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MiscHelper {
    constructor() { }

    public handleError(err: HttpErrorResponse): Observable<never> {
        // let errorMessage = '';
        // if (err.error instanceof ErrorEvent) {
        //     const _errorMessage: string = err.error && err.error.message ? err.error.message : 'Error message not displayed';
        //     errorMessage = `An error occurred: ${_errorMessage}`;
        // } else {
        //     errorMessage = `Server returned: ${err}`;
        // }
        return throwError(err);
    }

    public stringToSlug = (str: string) => {
        return str
          .trim()
          .toLowerCase()
          .replace(/[\W_]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };
}
