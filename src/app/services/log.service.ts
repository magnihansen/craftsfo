import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MiscHelper } from '../helpers/misc.helper';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpService: HttpClient,
    private miscHelper: MiscHelper,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  saveError(messageStr: string): void {
    const body = { message: messageStr };

    this.httpService.put(`${this.apiUrl}/Log/SaveError`, body, this.httpOptions)
    .subscribe({
      next: data => {
          console.log('Error logged');
      },
      error: error => {
        this.miscHelper.handleError(error);
      }
    });
  }
}
