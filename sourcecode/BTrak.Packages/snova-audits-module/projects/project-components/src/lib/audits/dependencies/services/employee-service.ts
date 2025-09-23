import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

// import { environment } from "../../../../environments/environment";
import { ApiUrls } from "../constants/api-urls";
import { Observable } from "rxjs";

import { EmployeeListModel } from "../models/employee-model";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { BusinessUnitDropDownModel } from '../../models/businessunitmodel';

@Injectable({
    providedIn: "root"
})

export class EmployeeService {

    constructor(private http: HttpClient) { }

    getAllEmployees(employeeModel: EmployeeListModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };

        let body = JSON.stringify(employeeModel);

        return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllProjectMembers(projectId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.post(APIEndpoint + ApiUrls.GetAllProjectMembers, JSON.stringify({ ProjectId: projectId, IsArchived: false }), httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
     
    getBusinessUnits(getBusinessUnitDropDownModel: BusinessUnitDropDownModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(getBusinessUnitDropDownModel);
      
        return this.http.post(`${APIEndpoint + ApiUrls.GetBusinessUnitDropDown}`, body, httpOptions);
    }
}
