import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ImageGallery } from "../models/image-gallery.model";
import { Image } from "../models/image.model";

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
        @Inject('HUB_URL') private apiUrl: string
    ) { }

    public getImageGalleries(): Observable<ImageGallery[]> {
        return this.http.get<ImageGallery[]>(
            `${this.apiUrl}${this.apiPath}/GetImageGalleries`,
            this.httpOptions
        );
    }

    public getImageGallery(imageGalleryId: number): Observable<ImageGallery> {
        return this.http.get<ImageGallery>(
            `${this.apiUrl}${this.apiPath}/GetImageGallery?imageGalleryId=` + imageGalleryId,
            this.httpOptions
        );
    }

    public getImageGalleryImagesByPageId(pageId: number): Observable<Image[]> {
        return this.http.get<Image[]>(
            `${this.apiUrl}${this.apiPath}/GetImageGalleryImagesByPageId?pageId=` + pageId,
            this.httpOptions
        );
    }
}