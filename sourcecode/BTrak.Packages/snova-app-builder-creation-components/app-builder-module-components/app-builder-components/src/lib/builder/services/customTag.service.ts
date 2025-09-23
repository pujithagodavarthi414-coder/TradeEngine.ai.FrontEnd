import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { CustomTagModel } from "../models/custom-tags.model";
import { CustomTagsModel } from '../models/custom-tags-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { TestSuiteModel } from '../models/testsuite-model';

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

    searchCustomTags(searchText: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const customTagsModel = new CustomTagsModel();
        customTagsModel.searchTagText = searchText;
        const body = JSON.stringify(customTagsModel);
        return this.http.post(
            `${APIEndpoint + ApiUrls.GetCustomApplicationTag}`,
            body,
            httpOptions
        );
    }

    upsertTag(customTagsModel: CustomTagModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customTagsModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertTags, body, httpOptions)
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

    searchTestSuites(testSuiteInputModel: TestSuiteModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(testSuiteInputModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchTestSuites, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}
