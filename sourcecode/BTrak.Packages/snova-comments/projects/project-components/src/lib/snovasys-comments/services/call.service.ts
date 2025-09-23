import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";

import { LocalStorageProperties } from "../models/localstorage-properties";
import { ComponentModel } from '../models/componentModel';
import { RoomModel } from "../models/roomModel";


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})

export class CallService {
    constructor(private http: HttpClient) { }
    private GET_CALL_TOKEN = APIEndpoint + "Call/CallApi/GetCallToken";
    private GET_OUTGOING_CALLER = APIEndpoint + "Call/CallApi/GetCallingNumbers";
    private GET_CALL_OUTCOME = APIEndpoint + "Call/CallApi/GetCallOutcome";
    private GET_CUSTOMERS_TO_CALL = APIEndpoint + "Call/CallApi/GetCustomersToCall";
    private MAKE_CALL = APIEndpoint + "Call/CallApi/MakeCall";
    private END_CALL = APIEndpoint + "Call/CallApi/EndCall";
    private UPSERT_CALL_FEEDBACK = APIEndpoint + "Call/CallApi/UpsertCallFeedback";
    // private GET_CALL_FEEDBACK = APIEndpoint + "Call/CallApi/SearchCallFeedback";
    private GET_CALL_FEEDBACK_RECEIVERID = APIEndpoint + "Call/CallApi/GetCallFeedbacksByReceiverId";
    private GET_CALL_STATUS_CALLBACK = APIEndpoint + "Call/CallApi/GetCallStatusCallback";
    private UPDATE_PAYMENT = APIEndpoint + "Payments/PaymentsApi/UpdatePayment";
    private CUSTOM_WIDGET = APIEndpoint + `Widgets/WidgetsApi/GetWidgetsBasedOnUser`;
    private GET_CUSTOM_GRID_DATA = APIEndpoint + `Widgets/WidgetsApi/GetCustomGridData`;
    private CALL_CONNECT = APIEndpoint + `Call/CallApi/Connect`;
    private CREATE_ROOM = APIEndpoint + `Call/CallApi/UpsertRoom`;
    private GET_VIDEO_TOKEN = APIEndpoint + `Call/CallApi/GetVideoCallToken`;
    private GET_VIDEO_PARTICIPANT_TOKEN = APIEndpoint + `Call/CallApi/GetVideoCallTokenForParticipant`;
    private SEARCH_VIDEO_LOG = APIEndpoint + `Call/CallApi/SearchVideoCallLog`;
    private GET_VIDEO_CALL_ROOM_STATUS = APIEndpoint + `Call/CallApi/GetVideoCallRoomStatus`;

    getHttpOptions(componentModel: ComponentModel) {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${componentModel.accessToken}`
            })
        };
        return httpOptions;
    }

    GetCallToken(componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_CALL_TOKEN}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCallOutcomes(componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_CALL_OUTCOME}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCallActiveEvents() {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http
            .get(`https://insights.twilio.com/v1/Voice/AC2bdb0e66f286db21803e241b21eb990a/Events`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetOutwardCallerIds(componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_OUTGOING_CALLER}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetListCustomersToCall(componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_CUSTOMERS_TO_CALL}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    InitiateApiCall(componentModel: ComponentModel, callFrom: string, callTo: string) {
        const httpOptions = this.getHttpOptions(componentModel);
        let data = { callFrom: callFrom, callTo: callTo };
        return this.http
            .post(`${this.MAKE_CALL}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    EndApiCall(componentModel: ComponentModel, callDetails: any) {
        const httpOptions = this.getHttpOptions(componentModel);

        let data = JSON.stringify(callDetails);
        return this.http
            .post(`${this.END_CALL}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    UpsertCallLog(componentModel: ComponentModel, calLog: any) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .post(`${this.UPSERT_CALL_FEEDBACK}`, calLog, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCallLogs(componentModel: ComponentModel, receiverId: any) {
        const httpOptions = this.getHttpOptions(componentModel);
        return this.http
            .get(`${this.GET_CALL_FEEDBACK_RECEIVERID}?id=${receiverId}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetStatusCheck(componentModel: ComponentModel, pathSid: string) {
        const httpOptions = this.getHttpOptions(componentModel);
        return this.http
            .get(`${this.GET_CALL_STATUS_CALLBACK}?id=${pathSid}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    UpdatePayment(componentModel: ComponentModel, paymentInfo: any) {
        const httpOptions = this.getHttpOptions(componentModel);
        let data = JSON.stringify(paymentInfo);
        return this.http
            .post(`${this.UPDATE_PAYMENT}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCustomWidgets(componentModel: ComponentModel, widgetModel: any) {
        const httpOptions = this.getHttpOptions(componentModel);

        const body = JSON.stringify(widgetModel);

        return this.http
            .post(`${this.CUSTOM_WIDGET}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCustomWidgetsGridData(componentModel: ComponentModel, widgetModel: any) {
        const httpOptions = this.getHttpOptions(componentModel);

        const body = JSON.stringify(widgetModel);

        return this.http
            .post(`${this.GET_CUSTOM_GRID_DATA}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetCallCoutcome(componentModel: ComponentModel, calModel: any) {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",

            })
        };

        return this.http
            .get(`${this.CALL_CONNECT}?from=${calModel.from}&&to=${calModel.to}&&isRecord=${calModel.isRecord}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    createRoom(componentModel: ComponentModel, roomInput: RoomModel){
        const httpOptions = this.getHttpOptions(componentModel);
        
        const body = JSON.stringify(roomInput);

        return this.http
            .post(`${this.CREATE_ROOM}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetVideoCallToken(componentModel: ComponentModel, roomInput: RoomModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        const body = JSON.stringify(roomInput);

        return this.http
            .post(`${this.GET_VIDEO_TOKEN}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetVideoCallTokenForParticipant(roomInput: RoomModel) {

        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",

            })
        };
        
        const body = JSON.stringify(roomInput);

        return this.http
            .post(`${this.GET_VIDEO_PARTICIPANT_TOKEN}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    SearchVideoCallLog(componentModel: ComponentModel, roomInput: RoomModel){
        const httpOptions = this.getHttpOptions(componentModel);

        const body = JSON.stringify(roomInput);

        return this.http
            .post(`${this.SEARCH_VIDEO_LOG}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetVideoCallRoomStatus(roomInput: RoomModel) {

        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",

            })
        };
        
        const body = JSON.stringify(roomInput);

        return this.http
            .post(`${this.GET_VIDEO_CALL_ROOM_STATUS}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
}
