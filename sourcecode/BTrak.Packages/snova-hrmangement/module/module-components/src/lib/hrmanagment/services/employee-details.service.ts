import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { EmployeeContactDetailsModel } from "../models/employee-contact-details-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})

export class EmployeeDetailsService {

    constructor(private http: HttpClient) { }

    getAllEmployeeDetails(employeeContactDetailsModel: EmployeeContactDetailsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeContactDetailsModel);
        return this.http.post( `${APIEndpoint + ApiUrls.GetEmployeeDetails}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
}