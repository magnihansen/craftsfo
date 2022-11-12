import { BaseDates } from "./base-dates.model";

export interface PageType extends BaseDates {
    id: number;
    name: string;
    active: boolean;
}