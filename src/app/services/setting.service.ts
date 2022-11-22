import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { DomainSetting } from "../models/domain-setting.model";
import { SettingKey } from "../models/setting-key.model";
import { SettingType } from "../models/setting-type.model";
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

    public getDomainSettings(): Observable<DomainSetting[]> {
      return this.http.get<DomainSetting[]>(`${this.apiUrl}${this.apiPath}/GetDomainSettings`, this.httpOptions);
    }
  
    public getSettings(): Observable<Setting[]> {
      return this.http.get<Setting[]>(`${this.apiUrl}${this.apiPath}/GetSettings`, this.httpOptions);
    }

    public getSettingKeys(): Observable<SettingKey[]> {
      return this.http.get<SettingKey[]>(`${this.apiUrl}${this.apiPath}/GetSettingKeys`, this.httpOptions);
    }

    public getSettingTypes(): Observable<SettingType[]> {
      return this.http.get<SettingType[]>(`${this.apiUrl}${this.apiPath}/GetSettingTypes`, this.httpOptions);
    }

    public insertSetting(setting: Setting): Observable<Setting> {
      return this.http.post<Setting>(
        `${this.apiUrl}${this.apiPath}/InsertSetting`,
        setting,
        this.httpOptions
      );
    }

    public insertSettingKey(settingKey: SettingKey): Observable<SettingKey> {
      return this.http.post<SettingKey>(
        `${this.apiUrl}${this.apiPath}/InsertSettingKey`,
        settingKey,
        this.httpOptions
      );
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