import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CreateGenericForm } from '../models/createGenericForm';
import { StatusReportingConfiguration } from '../models/statusReportingConfiguration';
import { StatusReporting, StatusReportSeenStatus } from '../models/statusReporting';
import { PerformanceConfigurationModel } from '../models/performanceConfigurationModel';
import { PerformanceModel } from '../models/performanceModel';
import { PerformanceSubmissionModel } from '../models/performance-submission.model';
import { PerformanceReportModel } from '../models/performance-report.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { ReminderModel } from '../models/reminder.model';

import { Observable } from "rxjs";
import { ProbationSubmissionModel } from '../models/probation-submission.model';
import { ProbationConfigurationModel } from '../models/probationConfigurationModel';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class StatusreportService {

  constructor(private http: HttpClient) { }

  private Create_Generic_Form = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericForms';
  private Get_Generic_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';
  private Get_Generic_Form_By_Id = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';
  private Employees_List_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
  private Get_Form_Types = APIEndpoint + 'GenericForm/GenericFormApi/GetFormTypes';
  private Get_Forms_By_TypeId = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormsByTypeId';
  private Get_Status_Configuration_Options = APIEndpoint + 'StatusReporting/StatusReportingApi/GetStatusReportingConfigurationOptions';
  private Upsert_Status_Reporting_Configuration = APIEndpoint + 'StatusReporting/StatusReportingApi/UpsertStatusReportingConfiguration';
  private Get_Status_Reporting_Configurations = APIEndpoint + 'StatusReporting/StatusReportingApi/GetStatusReportingConfigurations';
  private Get_Status_Reporting_Configuration_Forms = APIEndpoint + 'StatusReporting/StatusReportingApi/GetStatusReportingConfigurationForms';
  private Create_Status_Report = APIEndpoint + 'StatusReporting/StatusReportingApi/CreateStatusReport';
  private Get_Status_Reports = APIEndpoint + 'StatusReporting/StatusReportingApi/GetStatusReportings';
  private Upsert_status_report_seen = APIEndpoint + 'StatusReporting/StatusReportingApi/UpsertReportSeenStatus';
  private Upload_File_API_Path = APIEndpoint + 'File/FileApi/UploadFile';

  UpsertGenericForm(createGenericForm: CreateGenericForm) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(createGenericForm);

    return this.http.post(`${this.Create_Generic_Form}`, body, httpOptions)
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

    return this.http.post(`${this.Get_Generic_Form_By_Id}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetGenericForms(createGenericForm: CreateGenericForm) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(createGenericForm);

    return this.http.post(`${this.Get_Generic_Forms}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetAllUsers() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${this.Employees_List_API_PATH}`, httpOptions)
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

    return this.http.get(`${this.Get_Form_Types}`, httpOptions)
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

    return this.http.get(`${this.Get_Forms_By_TypeId}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusConfigurationOptions() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(`${this.Get_Status_Configuration_Options}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertStatusReportingConfiguration(statusReportingConfiguration: StatusReportingConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReportingConfiguration);

    return this.http.post(`${this.Upsert_Status_Reporting_Configuration}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReportingConfigurations(statusReportingConfiguration: StatusReportingConfiguration) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReportingConfiguration);

    return this.http.post(`${this.Get_Status_Reporting_Configurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReportingConfigurationForms() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(`${this.Get_Status_Reporting_Configuration_Forms}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  CreateStatusReport(statusReporting) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReporting);

    return this.http.post(`${this.Create_Status_Report}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetStatusReports(statusReport: StatusReporting) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReport);

    return this.http.post(`${this.Get_Status_Reports}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertStatusReportSeenStatus(statusReport: StatusReportSeenStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(statusReport);

    return this.http.post(`${this.Upsert_status_report_seen}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  UpsertFile(formData) {
    console.log(formData);
    const httpOptions = {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    };

    return this.http.post(`${this.Upload_File_API_Path}`, formData, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UpsertPerformanceConfiguration(performanceConfigurationModel: PerformanceConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPerformanceConfiguration, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetPerformanceConfiguration(performanceConfigurationModel: PerformanceConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformanceConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetPerformances(performanceModel: PerformanceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformances, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertPerformance(performanceModel: PerformanceModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPerformance, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertPerformanceSubmission(performanceModel: PerformanceSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPerformanceSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertPerformanceDetails(performanceModel: PerformanceSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertPerformanceSubmissionDetails, body, httpOptions)
      .pipe(map((result) => {
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

  GetPerformanceReports(performanceModel: PerformanceReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPerformanceReports, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertReminder(reminderModel: ReminderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(reminderModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertReminder, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetReminders(reminderModel: ReminderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(reminderModel);

    return this.http.post(APIEndpoint + ApiUrls.GetReminders, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetProbationDetails(probationModel: ProbationSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(probationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProbationSubmissionDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetProbationSubmissions(performanceModel: ProbationSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(performanceModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProbationSubmissions, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetProbationConfiguration(probationConfigurationModel: ProbationConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(probationConfigurationModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProbationConfigurations, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertProbationSubmission(probationModel: ProbationSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(probationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertProbationSubmission, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  UpsertProbationDetails(probationModel: ProbationSubmissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const body = JSON.stringify(probationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertProbationSubmissionDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
