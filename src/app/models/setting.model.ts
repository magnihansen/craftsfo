import { BaseDates } from "./base-dates.model";

export interface Setting extends BaseDates {
    id: number;
    settingKeyId: number;
    key: string;
    value: string;
}