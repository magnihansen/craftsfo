import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import { Observable } from "rxjs/internal/Observable";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ImageGalleryType } from "../models/image-gallery-type.model";

@Injectable()
export class ImageGalleryTypeService {
    private apiPath = '/V1/ImageGalleryType';
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

    public getImageGalleryTypes(): Observable<ImageGalleryType[]> {
        return this.http.get<ImageGalleryType[]>(
            `${this.apiUrl}${this.apiPath}/GetImageGalleryTypes`,
            this.httpOptions
        );
    }

    public addImageGalleryType(ig: ImageGalleryType): Observable<boolean> {
        return this.http.post<boolean>(
          `${this.apiUrl}${this.apiPath}/InsertImageGalleryType`,
          ig,
          this.httpOptions
        );
      }
}