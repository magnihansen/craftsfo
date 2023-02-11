import { CollectionImage } from "./collection-image.model";

export interface ImageCollection {
    id: number;
    domainId: number;
    name: string;
    description: string;
    images: CollectionImage[];
}