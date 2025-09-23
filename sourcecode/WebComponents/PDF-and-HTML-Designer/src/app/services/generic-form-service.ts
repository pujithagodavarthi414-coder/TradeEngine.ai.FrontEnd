import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { environment } from "src/environments/environment.prod";

const env = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = env && env.apiURL? env.apiURL : environment.apiURL; 
//const APIEndpoint = "http://localhost:55226/";

@Injectable({
    providedIn: "root"
})

export class GenericFormService {

    constructor(private http: HttpClient) { }

getCustomApplication(customApplicationSearchModel: CustomApplicationSearchModel) {
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