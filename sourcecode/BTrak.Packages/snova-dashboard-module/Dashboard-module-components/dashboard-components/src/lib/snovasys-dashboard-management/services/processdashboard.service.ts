import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class ProcessDashboardService {
  constructor(private http: HttpClient) { }

  getProcessDashboardSummary(processDashboardId: string, entityId) {
    let paramsobj = new HttpParams().set(
      "DashboardId", processDashboardId).set("entityId", entityId);
    paramsobj = paramsobj.set("isArchive", "false");
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };

    return this.http.get<any>(APIEndpoint + ApiUrls.GetGoalsOverAllStatusByDashboardId, httpOptions)
  }

  getLatestProcessDashboardId() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };

    return this.http.get<any>(APIEndpoint + ApiUrls.GetLatestDashboardId, httpOptions)
  }
}
