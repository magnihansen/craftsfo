import { AppEventType } from './event.type';

export class AppEvent<T> {
    constructor(
      public type: AppEventType
    ) {}
}
