import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import { Observable } from "rxjs/internal/Observable";
import { PageType } from "../models/page-type.model";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
  })
  export class PageService {
    private apiPath = '/V1/PageType';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(
      private http: HttpClient,
      private authenticationService: AuthenticationService,
      @Inject('HUB_URL') private apiUrl: string
    ) { 

    }

    public getPageType(pageTypeId: number): Observable<PageType> {
        return this.http.get<PageType>(`${this.apiUrl}${this.apiPath}/GetPageType?pageTypeId=${pageTypeId}`, this.httpOptions);
      }
    
      public getPages(): Observable<PageType[]> {
        return this.http.get<PageType[]>(`${this.apiUrl}${this.apiPath}/GetPageTypes`, this.httpOptions);
      }
  }
