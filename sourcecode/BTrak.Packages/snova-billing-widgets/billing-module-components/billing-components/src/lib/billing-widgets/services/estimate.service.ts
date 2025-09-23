import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EstimateInputModel } from '../models/estimate-input.model';
import { EstimateOutputModel } from '../models/estimate-output.model';
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: 'root',
})

export class EstimateService {
    constructor(private http: HttpClient) { }

    getEstimates(invoice: EstimateInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(invoice);
        return this.http.post(APIEndpoint + ApiUrls.GetEstimates, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    getEstimateHistory(invoice: EstimateInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(invoice);
        return this.http.post(APIEndpoint + ApiUrls.GetEstimateHistory, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    getEstimateStatuses(invoice: EstimateInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        let body = JSON.stringify(invoice);
        return this.http.post(APIEndpoint + ApiUrls.GetEstimateStatuses, body, httpOptions)
            .pipe(map(result => {
                return result;
            }))
    }

    upsertEstimate(invoices: EstimateOutputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        let body = JSON.stringify(invoices);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEstimate, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
}