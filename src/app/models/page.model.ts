export interface Page {
    id: number;
    uid: string;
    parentId: number | null;
    pageTypeId: number;
    title: string;
    content: string;
    sort: number;
    link: string;
    active: boolean;
    isRouterLink: boolean;
    createdDate: Date | null;
    createdBy: string;
    updatedDate: Date | null;
    updatedBy: string | null;
}
