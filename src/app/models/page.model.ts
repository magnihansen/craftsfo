import { BaseDates } from "./base-dates.model";

export interface Page extends BaseDates {
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
}
