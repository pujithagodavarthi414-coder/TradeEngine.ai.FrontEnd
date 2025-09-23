import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { TestCaseAutomationTypeModel } from '../models/test-case-automation-type-model';
import { Observable } from "rxjs";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class TestrailManagementService {

    private Get_All_TestCaseAutomationTypes = APIEndpoint + ApiUrls.GetAllTestCaseAutomationTypes;
    private TestCaseAutomation_Type = APIEndpoint + ApiUrls.UpsertTestCaseAutomationType;


    constructor(private http: HttpClient) { }

    getAllTestCaseAutomationTypes(testCaseAutomationType: TestCaseAutomationTypeModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(testCaseAutomationType);
    
        return this.http.post(this.Get_All_TestCaseAutomationTypes, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
      }
  
      upsertTestCaseAutomationType(testCaseAutomationType: TestCaseAutomationTypeModel) {
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
    
        let body = JSON.stringify(testCaseAutomationType);
    
        return this.http.post(this.TestCaseAutomation_Type, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
      }

}
