import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import { Observable } from "rxjs/internal/Observable";
import { FileContentResult } from "../models/file-content-result.model";

import { ImageGalleryFile } from "../models/image-gallery-file.model";

@Injectable()
export class CdnService {
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

    public getImageCollection(collectionId: number): Observable<ImageGalleryFile[]> {
        return this.http.get<ImageGalleryFile[]>(
            `${this.cdnUrl}${this.cdnPath}/GetImageCollection?CollectionId=${collectionId}`,
            this.httpOptions
        );   
    }

    public getImageCollectionByPageId(pageId: number): Observable<ImageGalleryFile[]> {
        return this.http.get<ImageGalleryFile[]>(
            `${this.cdnUrl}${this.cdnPath}/GetImageCollectionByPageIdAsync?pageId=${pageId}`,
            this.httpOptions
        );   
    }

    public getImageGalleryImage(domainId: number, imageGalleryId: number, filename: string): Observable<any> {
        return this.http.get<any>(
            `${this.cdnUrl}${this.cdnPath}/GetImageGalleryImage?domainId=${domainId}&imageGalleryId=${imageGalleryId}&filename=${filename}`,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'image/jpeg'
                })
            }
        ); 
    } 
}