export interface Page {
    id: number;
    uid: string;
    title: string;
    rank: string;
    parent: string;
    content: string;
    pageRank: string;
    link: string;
    active: boolean;
    isRouterLink: boolean;
    createdDate: Date;
    createdBy: string;
    updatedDate: Date | null;
    updatedBy: string | null;
}
