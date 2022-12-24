import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import { Observable } from "rxjs/internal/Observable";
import { PageType } from "../models/page-type.model";

@Injectable({
    providedIn: 'root'
  })
  export class PageTypeService {
    private apiPath = '/V1/PageType';
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(
      private http: HttpClient,
      @Inject('API_URL') private apiUrl: string
    ) { 

    }

    public getPageType(pageTypeId: number): Observable<PageType> {
        return this.http.get<PageType>(`${this.apiUrl}${this.apiPath}/GetPageType?pageTypeId=${pageTypeId}`, this.httpOptions);
      }
    
      public getPageTypes(): Observable<PageType[]> {
        return this.http.get<PageType[]>(`${this.apiUrl}${this.apiPath}/GetPageTypes`, this.httpOptions);
      }
  }
