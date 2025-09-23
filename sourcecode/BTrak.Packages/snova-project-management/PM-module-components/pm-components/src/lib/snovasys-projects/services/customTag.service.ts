import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CustomTagModel } from "../models/customTagsModel";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})
export class CustomTagService {
    constructor(private http: HttpClient) { }

    upsertCustomTag(customTagsModel: CustomTagModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customTagsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCustomTags, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getCustomTags(customTagsModel: CustomTagModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customTagsModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomTags, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}
