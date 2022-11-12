import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Setting } from "../models/setting.model";

@Injectable({
    providedIn: 'root'
  })
  export class SettingService {
    private apiPath = '/V1/Setting';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(
      private http: HttpClient,
      @Inject('HUB_URL') private apiUrl: string
    ) { }

    public getSetting(settingId: number): Observable<Setting> {
      return this.http.get<Setting>(`${this.apiUrl}${this.apiPath}/GetSetting?settingId=${settingId}`, this.httpOptions);
    }
  
    public getSettings(): Observable<Setting[]> {
      return this.http.get<Setting[]>(`${this.apiUrl}${this.apiPath}/GetSettings`, this.httpOptions);
    }

    public deleteSetting(settingId: number): Observable<boolean> {
      const deleteUrl = `${this.apiUrl}${this.apiPath}/DeleteSetting`;
      return this.http.delete<boolean>(
        deleteUrl,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          params: {
            settingId: settingId.toString()
          }
        }
      );
    }
  }