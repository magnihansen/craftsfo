export interface ImageGallery {
    id: number,
    name: string,
    description: string,
    imageTypeId: number,
    active: boolean,
    createdDate: Date,
    createdBy: string,
    updatedDate: Date | undefined,
    updatedBy: string
}