import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Page } from '../interfaces/page';

@Injectable({
    providedIn: 'root'
})
export class PageHubService {
    public data: BehaviorSubject<Page[]> = new BehaviorSubject<Page[]>([]);
    private hubConnection!: HubConnection;

    public startConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl  + '/pagehub', {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            // .configureLogging(LogLevel.Debug)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('connection started'))
            .catch((err) => console.log('error while establishing signalr connection: ' + err));
    }

    constructor(
        @Inject('HUB_URL') private hubUrl: string
    ) { }

    public addTransferDataListener = () => {
        // runs all the time
        // this.hubConnection.on('pagesReceived', (pages) => {
        //     console.log('pagesReceived', pages);
        //     this.sendPages(pages);
        // });
    }

    sendPages(pages: Page[]): void {
        this.data.next(pages);
    }

    clearMessages(): void {
        this.data.next([]);
    }

    getPages(): Observable<Page[]> {
        return this.data.asObservable();
    }
}
