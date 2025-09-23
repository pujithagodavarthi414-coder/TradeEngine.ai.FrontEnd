import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { processDashboard } from "../models/processDashboard";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProcessDashboardStatusService {
  constructor(private http: HttpClient) {}

  private UPSERT_Process_Dashboard_Status_API_PATH =
    APIEndpoint +
    "Dashboard/ProcessDashboardStatusApi/UpsertProcessDashboardStatus";
  private GET_ALL_PROCESS_DASHBOARD_STATUS_API_PATH =
    APIEndpoint +
    "Dashboard/ProcessDashboardStatusApi/GetAllProcessDashboardStatuses";

  UpsertprocessDashboardStatus(processDashboard: processDashboard) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(processDashboard);
    return this.http
      .post(
        `${this.UPSERT_Process_Dashboard_Status_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllProcessDashboardStatus(processDashboard: processDashboard) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(processDashboard);
    return this.http
      .post(
        `${this.GET_ALL_PROCESS_DASHBOARD_STATUS_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
