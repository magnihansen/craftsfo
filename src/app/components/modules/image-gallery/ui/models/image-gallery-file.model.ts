import { SafeUrl } from "@angular/platform-browser";

export interface ImageGalleryFile {
    createdBy: string;
    createdDate: Date;
    description: string;
    fileContents: SafeUrl;
    filename: string;
    id: number;
    title: string;
    updatedBy: string;
    updatedDate: Date;
}