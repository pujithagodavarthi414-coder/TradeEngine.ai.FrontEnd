import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import * as signalR from "@microsoft/signalr";
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../constants/localstorage-properties';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class SignalrService {

    private connection: any;
    private proxy: any;

    constructor(private cookieService: CookieService) { }

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
        let connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:54580/lookupsync", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => "Bearer " + this.cookieService.get(LocalStorageProperties.CurrentUser)
            }).withAutomaticReconnect()
            .build();
        connection.start().then(
            function () {
                console.log("connected signalr hub");
                connection.invoke('GetConnectionId', sessionStorage.getItem('conectionId'))
                    .then((res) =>  {sessionStorage.setItem('conectionId', res)})
                    .catch((error: any) => {
                        alert("GetConnectionId error")
                    });
                // connection.invoke('GetUser')
                //     .then((res) => alert((res)))
                //     .catch((error: any) => {
                //         alert("GetUser error")
                //     });
                // connection.invoke('GetUserIdentifier')
                //     .then((res) => alert(res))
                //     .catch((error: any) => {
                //         alert("GetUserIdentifier error")
                //     });
            }
        )
            .catch(
                function (er) {
                    console.log("hub con error: " + er);
                }
            );
        connection.on('BroadCastNotification', (serverMessage) => alert(serverMessage));
        connection.on('BroadCastNotificationToUser', (serverMessage) => alert(serverMessage));
        connection.on('addChatMessage', (serverMessage) => alert(serverMessage));
    }

    //   public sendMessage(): void {
    //     this.proxy.invoke('ClientMessage', 'My message')
    //       .catch((error: any) => {
    //         console.log('sending message error -> ' + error);
    //       });
    //   }

    private onMessageReceived(serverMessage: string) {
        console.log('New message received from Server: ' + serverMessage);
    }

}