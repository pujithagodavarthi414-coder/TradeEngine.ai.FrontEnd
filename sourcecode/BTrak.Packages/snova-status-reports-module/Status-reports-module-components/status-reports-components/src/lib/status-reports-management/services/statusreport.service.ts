import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CreateGenericForm } from '../models/createGenericForm';
import { StatusReportingConfiguration } from '../models/statusReportingConfiguration';
import { StatusReporting, StatusReportSeenStatus } from '../models/statusReporting';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from "rxjs";
import { PerformanceSubmissionModel } from '../models/performance-submision.model';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: 'root'
})

export class StatusreportService {

  constructor(private http: HttpClient) { }

  private EMPLOYEE_INTRO_API_PATH = APIEndpoint + "Intro/IntroApiController/GetIntro";

  UpsertGenericForm(createGenericForm: CreateGenericForm) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(createGenericForm);

    return this.http.post(APIEndpoint + ApiUrls.UpsertGenericForms, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetGenericFormById(applicationId: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var formClass = new CreateGenericForm();
    formClass.Id = applicationId;

    let body = JSON.stringify(formClass);

    return this.http.post(APIEndpoint + ApiUrls.GetGenericForms, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetGenericForms(createGenericForm: CreateGenericForm) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(createGenericForm);

    return this.http.post(APIEndpoint + ApiUrls.GetGenericForms, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetAllUsers() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTeamLeadsList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetFormTypes() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetFormTypes, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetGenericFormsByTypeId(formTypeId) {
    var paramsobj = new HttpParams().set("formTypeId", formTypeId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetGenericFormsByTypeId, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusConfigurationOptions() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetStatusReportingConfigurationOptions, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertStatusReportingConfiguration(statusReportingConfiguration: StatusReportingConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReportingConfiguration);

    return this.http.post(APIEndpoint + ApiUrls.UpsertStatusReportingConfiguration, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReportingConfigurations(statusReportingConfiguration: StatusReportingConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReportingConfiguration);

    return this.http.post(APIEndpoint + ApiUrls.GetStatusReportingConfigurations, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReportingConfigurationForms() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetStatusReportingConfigurationForms, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  CreateStatusReport(statusReporting) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReporting);

    return this.http.post(APIEndpoint + ApiUrls.CreateStatusReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReports(statusReport: StatusReporting) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReport);

    return this.http.post(APIEndpoint + ApiUrls.GetStatusReportings, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertStatusReportSeenStatus(statusReport: StatusReportSeenStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReport);

    return this.http.post(APIEndpoint + ApiUrls.UpsertReportSeenStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  UpsertFile(formData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    };

    return this.http.post(APIEndpoint + ApiUrls.UploadFile, formData, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  GetPerformanceSubmissions(performanceModel: PerformanceSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformanceSubmissions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetPerformanceDetails(performanceModel: PerformanceSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformanceSubmissionDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  upsertIntroDetails(){
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.EMPLOYEE_INTRO_API_PATH}`, httpOptions)
    .pipe(map(result => {
      return result;
    }));
  }
}
