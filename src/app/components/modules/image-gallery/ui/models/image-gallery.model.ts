export interface ImageGallery {
    id: number,
    name: string,
    description: string,
    imageGalleryTypeId: number,
    imageTemplateId: number,
    active: boolean,
    createdDate: Date,
    createdBy: string,
    updatedDate: Date | undefined,
    updatedBy: string | undefined
}