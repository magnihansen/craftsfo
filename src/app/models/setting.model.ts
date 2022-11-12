import { BaseDates } from "./base-dates.model";

export interface Setting extends BaseDates {
    id: number;
    settingTypeId: number;
    key: string;
    value: string;
}