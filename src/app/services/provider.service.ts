import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ServiceProvider{
    constructor(
        private http: HttpClient
    ) { }

    public setNonce(): void {

    }
}