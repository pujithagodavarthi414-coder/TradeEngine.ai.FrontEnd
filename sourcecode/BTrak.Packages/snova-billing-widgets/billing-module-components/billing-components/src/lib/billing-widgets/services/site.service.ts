import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: 'root',
})


export class SiteService {
    constructor(private http: HttpClient) {

    }

    upsertSite(siteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(siteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertSite, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertGRD(grdmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(grdmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertGRD, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    upsertGrE(grEmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(grEmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertGRE, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    SendInvoice(grEmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(grEmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.SendInvoice, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    searchGrE(siteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(siteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetGrE, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    searchSite(siteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(siteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetSite, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    getGRD(grdmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(grdmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetGRD, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    getBankAccount(bankAccountmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(bankAccountmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetBankAccount, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    upsertBankAccount(bankAccountmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(bankAccountmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertBankAccount, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    getMessageFieldType(messageFieldSearchModel){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(messageFieldSearchModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetMessageFieldType, body, httpOptions)
        .pipe(map(result => {
            return result;
        }))
    }
}