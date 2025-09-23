import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationModel } from '../models/NotificationsOutPutModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class SignalrService {

    private connection: any;
    private proxy: any;
    public notifications$: any = new BehaviorSubject([]);
    notifications: any = [];
    constructor(private cookieService: CookieService, private http: HttpClient) { }

    public initializeSignalRConnection(): void {
        //     this.connection = $.hubConnection(`${environment.apiURL}signalr`, { useDefaultPath: false });
        // // Please note that by default '/signalr' URL will be used to connect to your SignalR service. Providing 'useDefaultPath' allows you to customize it
        //     this.proxy = this.connection.createHubProxy('LookupSyncNotification');

        //     this.proxy.on('LookupSyncSuccess', (serverMessage) => this.onMessageReceived(serverMessage));

        //     this.connection.start().done((data: any) => {
        //       console.log('Connected to Connection Hub');
        //       this.sendMessage();
        //     }).catch((error: any) => {
        //       console.log('Connection Hub error:' + error);
        //     });
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.notificationUrl;
        let connection = new signalR.HubConnectionBuilder()
            .withUrl(APIEndpoint, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => "Bearer " + this.cookieService.get(LocalStorageProperties.CurrentUser)
            })
            .withAutomaticReconnect()
            .build();
        connection.start().then(
            function () {
                console.log("connected signalr hub");
                connection.invoke('GetConnectionId', sessionStorage.getItem('conectionId'))
                    .then((res) =>  {sessionStorage.setItem('conectionId', res)})
                    .catch((error: any) => {
                        console.log(error);
                    });
            }
        ).catch(
                function (er) {
                    console.log("hub con error: " + er);
                }
            );
        connection.on('BroadCastNotification', (serverMessage) => this.addToNotificationItem(serverMessage));
    }

    //   public sendMessage(): void {
    //     connection.invoke('ClientMessage', 'My message')
    //       .catch((error: any) => {
    //         console.log('sending message error -> ' + error);
    //       });
    //   }

    private onMessageReceived(serverMessage: any) {
        console.log('New message received from Server: ' + serverMessage);
    }

    getNotifications() {
        this.notifications$.next(this.notifications);
    }

    addToNotificationItem(item) {
        this.notifications.push(item);
        this.getNotifications();
    }

    addToNotificationList(item) {
        this.notifications.push(...item);
        this.getNotifications();
    }

    removeItemFromNotifications(id) {
        this.notifications = this.notifications.filter(item => item.id != id);
        this.getNotifications();
    }

    removeAllNotifications() {
        this.notifications = [];
        this.getNotifications();
    }

    upsertReadNewNotifications(notifications: NotificationModel[]) {
        const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		  };
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		let body = JSON.stringify(notifications);
		return this.http.post(APIEndpoint + "Notification/NotificationApi/UpsertReadNewNotifications",body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
    }

    getNotificationsFromApi() {
        const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		  };
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		return this.http.post(APIEndpoint + "Notification/NotificationApi/GetNotifications", null, httpOptions)
			.pipe(map((result: any) => {
				if(result.success && result.data && result.data.length > 0) {
                    this.notifications = result.data;
                    this.getNotifications();
                }
			}));   
    }

}