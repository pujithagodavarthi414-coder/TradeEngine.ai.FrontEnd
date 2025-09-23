import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { Persistance } from "../models/persistance.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs"; 

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class PersistanceService {
    constructor(private http: HttpClient) { }

    private Upsert_Persistance = APIEndpoint + ApiUrls.UpdatePersistance;
    private Get_Persistance = APIEndpoint + ApiUrls.GetPersistance;

    UpsertPersistance(inputModel: Persistance) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(inputModel);

        return this.http.post(`${this.Upsert_Persistance}`, body, httpOptions);
    }

    GetPersistance(searchModel: Persistance) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(searchModel);

        return this.http.post(`${this.Get_Persistance}`, body, httpOptions);
    }
}