import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";
import { SolarLogModel } from "../models/solar-log.model";

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
    upsertGridforSitesProjection(grdmodel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(grdmodel);
        return this.http.post<any>(APIEndpoint + ApiUrls.upsertGridforSitesProjection, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    searchGridforSitesProjection(siteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(siteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.searchGridforSitesProjection, body, httpOptions)
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

    getVats(vatModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(vatModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetVAT, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertVats(vatModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(vatModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertVAT, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    getCreditNote(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetCreditNote, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertCreditNote(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertCreditNote, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    sendCreditNoteMail(creditNoteDetails) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteDetails);
        return this.http.post<any>(APIEndpoint + ApiUrls.SendCreditNoteMail, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    getPaymentReceipts(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetPaymentReceipts, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertPaymentReceipt(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertPaymentReceipt, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    upsertMasterAccount(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertMasterAccount, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    getMasterAccount(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetMasterAccount, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    getExpenseBookings(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetExpenseBookings, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertExpenseBooking(creditNoteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(creditNoteModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertExpenseBooking, body, httpOptions)
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

    downloadPdf() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = {
            id: "38F6D1E9-D493-4D3B-AD9F-1283068C7AB7",
            siteId:"A54120F0-3BBF-43E9-94F4-29F5A1075F23",
            grdId:"CF15247D-225E-49AC-B513-B0A9E4E4B5ED",
            gridInvoiceDate: new Date(),
            month: "Sep-21",
            startDate: new Date("01-09-2021"),
            endDate: new Date("30-09-2021"),
            production: 20125,
            reprise:17508.75,
            autoCTariff:13.0,
            Facturation:0.1,
            distribution:10.43,
            greFacturation:413,
            TVA:7.70,
            isGRE: true,
            TVAForSubTotal:58.78,
            subTotal:763.36,
            total: 822.14,
            autoConsumptionSum:340.11,
            facturationSum: 340.2125,
            GreTotal:423.15


        }
        return this.http.post<any>(APIEndpoint + ApiUrls.DownloadOrSendInvoice, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    searchSolarLog(solorModel: SolarLogModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(solorModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetSolorLog, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }
    upsertSolarLog(solorModel: SolarLogModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(solorModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertSolorLog, body, httpOptions)
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
}