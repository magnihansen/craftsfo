import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ImageGallery } from "../models/image-gallery.model";

@Injectable()
export class ImageGalleryService {
    private apiPath = '/V1/ImageGallery';
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

    public getImageGalleries(): Observable<ImageGallery[]> {
        return this.http.get<ImageGallery[]>(
            `${this.apiUrl}${this.apiPath}/GetImageGalleries`,
            this.httpOptions
        );
    }

    public insertImageGallery(ig: ImageGallery): Observable<boolean> {
        return this.http.post<boolean>(
            `${this.apiUrl}${this.apiPath}/InsertImageGallery`,
            ig,
            this.httpOptions
        );   
    }
}