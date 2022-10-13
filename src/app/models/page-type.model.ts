export interface PageType {
    id: number;
    name: string;
    active: boolean;
    createdDate: Date;
    createdBy: string;
    updatedDate: Date | null;
    updatedBy: string | null;
}