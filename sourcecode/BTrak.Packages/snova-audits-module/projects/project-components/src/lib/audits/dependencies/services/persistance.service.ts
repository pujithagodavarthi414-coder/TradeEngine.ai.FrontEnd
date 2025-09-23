import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
// import { environment } from "../../../environments/environment";
import { ApiUrls } from "../constants/api-urls";
import { Persistance } from "../models/persistance.model";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class PersistanceService {
    constructor(private http: HttpClient) { }

    private Upsert_Persistance = ApiUrls.UpdatePersistance;
    private Get_Persistance = ApiUrls.GetPersistance;

    UpsertPersistance(inputModel: Persistance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(inputModel);

        return this.http.post(`${APIEndpoint + this.Upsert_Persistance}`, body, httpOptions);
    }

    GetPersistance(searchModel: Persistance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(searchModel);

        return this.http.post(`${APIEndpoint + this.Get_Persistance}`, body, httpOptions);
    }
}