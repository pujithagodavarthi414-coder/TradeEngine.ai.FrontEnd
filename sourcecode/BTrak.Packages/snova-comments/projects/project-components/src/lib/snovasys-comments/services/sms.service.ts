
import { LocalStorageProperties } from "../models/localstorage-properties";
import { ComponentModel } from '../models/componentModel';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})

export class SmsService {
    constructor(private http: HttpClient) { }
    private SEND_OTP = APIEndpoint + "Sms/SmsApi/SendOTP";
    private VALIDATE_OTP = APIEndpoint + "Sms/SmsApi/ValidateOtp";
    private GET_TEMPLATES = APIEndpoint + "Sms/SmsApi/GetTemplates";
    private GET_DATA_WITH_TEMPLATE = APIEndpoint + "Sms/SmsApi/GetDataBasedOnTemplate";
    private SEND_MESSAGE = APIEndpoint + "Sms/SmsApi/SendMessage";

    getHttpOptions(componentModel: ComponentModel) {
        let httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${componentModel.accessToken}`
            })
        };
        return httpOptions;
    }

    sendOtp(otpDetails: any, componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        let data = JSON.stringify(otpDetails);
        return this.http
            .post(`${this.SEND_OTP}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    validateOtp(otpDetails: any, componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        let data = JSON.stringify(otpDetails);
        return this.http
            .post(`${this.VALIDATE_OTP}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getSMSTemplates(componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_TEMPLATES}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getDataBasedTemplate(templateId: string, componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        return this.http
            .get(`${this.GET_DATA_WITH_TEMPLATE}\\${templateId}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    sendMessage(messageDetails: any, componentModel: ComponentModel) {
        const httpOptions = this.getHttpOptions(componentModel);

        let data = JSON.stringify(messageDetails);
        return this.http
            .post(`${this.SEND_MESSAGE}`, data, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
}