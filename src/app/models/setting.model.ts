import { BaseDates } from "./base-dates.model";

export interface Setting extends BaseDates {
    id: number;
    key: string;
    value: string;
}