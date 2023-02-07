import { Inject, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'cdnImageGalleryUrl',
    standalone: true
  })
  export class CdnImageGalleryUrlPipe implements PipeTransform {
    constructor(
        @Inject('CDN_URL') private cdnUrl: string
    ) {}
  
    transform(filename: string, domainId: number, imageGalleryId: number): any {
      return `${this.cdnUrl}/V1/Cdn/GetImageGalleryImage?domainId=${domainId}&imageGalleryId=${imageGalleryId}&filename=${filename}`;
    }
  }