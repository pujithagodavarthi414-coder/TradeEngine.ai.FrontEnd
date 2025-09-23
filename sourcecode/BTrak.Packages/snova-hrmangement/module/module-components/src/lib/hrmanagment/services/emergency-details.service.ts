import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeEmergencyContactDetails } from '../models/employee-emergency-contact-details-model';
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import { EmployeeEmergencyContactSearchModel } from '../models/employee-emergency-contact-details-search-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class EmergencyDetailsService {
  constructor(private http: HttpClient) { }

  upsertEmergencyContact(employeeEmergencyContactDetailsModel: EmployeeEmergencyContactDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(employeeEmergencyContactDetailsModel);

    return this.http.post<EmployeeEmergencyContactDetails[]>(APIEndpoint + ApiUrls.UpsertEmployeeEmergencyContactDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllEmergencyDetails(employeeEmergencyContactDetailsModel: EmployeeDetailsSearchModel): Observable<EmployeeEmergencyContactDetails[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(employeeEmergencyContactDetailsModel);

    return this.http.post<EmployeeEmergencyContactDetails[]>(APIEndpoint + ApiUrls.GetEmployeeDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  

  getAllEmergencyContactDetailById(employeeEmergencyContactSearchModel: EmployeeEmergencyContactSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(employeeEmergencyContactSearchModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.SearchEmployeeEmergencyContactDetails,body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}