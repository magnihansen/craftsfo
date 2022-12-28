import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class ImageCdnService {
    private cdnPath = '/V1/Cdn';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient,
        @Inject('CDN_URL') private cdnUrl: string
    ) { }

    public getImageCollection(collectionId: number): Observable<File[]> {
        return this.http.get<File[]>(
            `${this.cdnUrl}${this.cdnPath}/GetImageCollection?CollectionId=${collectionId}`,
            this.httpOptions
        );   
    }
}