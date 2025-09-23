import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivityModel } from "../models/activityModel";
import { map } from "rxjs/operators";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ErrorModel } from "../models/ErrorModel";
const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55226/' : document.location.origin + '/backend/';
@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    constructor(private http: HttpClient) { }

    getActivity(model: ActivityModel) {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.GetActivity, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertActivity(model: ActivityModel) {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.UpsertActivity, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getError(model: ErrorModel) {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.GetError, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertError(model: ErrorModel) {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        const body = JSON.stringify(model);

        return this.http.post(APIEndpoint + ApiUrls.UpsertError, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getCustomApplications(customApplicationSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplication, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}