import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import cssVars, { CSSVarsPonyfillOptions } from "css-vars-ponyfill";
import { Observable } from "rxjs/internal/Observable";
import { DomainSetting } from "../models/domain-setting.model";
import { SettingKey } from "../models/setting-key.model";
import { SettingType } from "../models/setting-type.model";
import { Setting } from "../models/setting.model";
import { User } from "../models/user";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  public readonly domainSettingKey = 'domainSettings';

  private apiPath = '/V1/Setting';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    @Inject('API_URL') private apiUrl: string
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

  public UpdateSetting(setting: Setting): Observable<boolean> {
    const user: User = this.authenticationService.getUser();

    const body = {
      id: setting.id,
      settingKeyId: setting.settingKeyId,
      value: setting.value,
      updatedBy: user.username
    };
    return this.http.put<boolean>(`${this.apiUrl}${this.apiPath}/UpdateSetting`, body, this.httpOptions);
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

  public setCssVariables(domainSettings: DomainSetting[]): void {
    let option_variables: { [key: string]: string; } = {};
    domainSettings.filter(s => s.key.startsWith('--')).forEach((s: DomainSetting) => {
      option_variables[s.key] = s.value;
    });

    const options: CSSVarsPonyfillOptions = {
      watch: true,
      preserveStatic: true,
      preserveVars: true,
      variables: option_variables
    };
    cssVars(options);
  }

  public loadCSS(domainSettings: DomainSetting[]): void {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    let css: string = '';
    domainSettings.filter(s => s.key.startsWith('--')).forEach((s: DomainSetting) => {
      css += s.key + ':' + s.value + ';';
    });

    // style.appendChild(document.createTextNode(':root{' + css + '}'));
    // head.appendChild(style);

    let styleRef: HTMLStyleElement = document.createElement('style');
    // styleRef.setAttribute('type', 'text/css');
    styleRef.textContent = ':root{' + css + '}';

    if (typeof styleRef !== 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(styleRef);
    }
  }
}