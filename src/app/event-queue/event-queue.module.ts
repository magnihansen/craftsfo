import { NgModule } from '@angular/core';
import { EventQueueService } from './event.queue';

@NgModule({
    providers: [
        EventQueueService
    ]
})

export class EventQueueModule { }
