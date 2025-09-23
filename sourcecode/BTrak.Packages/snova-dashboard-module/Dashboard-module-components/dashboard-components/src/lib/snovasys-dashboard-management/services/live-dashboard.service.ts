import { HttpHeaders, HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiveDashBoardStatusDropDownList } from '../models/liveDashboardDropDownList';
import { LiveDashBoardList } from '../models/liveDashboardList';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class LiveDashboardService {

  constructor(private http: HttpClient) { }

  private GetAll_ProcessDashboardStatuses_API_PATH = APIEndpoint + 'Dashboard/ProcessDashboardStatusApi/GetAllProcessDashboardStatuses';
  private GetAll_ProcessDashboard_API_PATH =APIEndpoint + ApiUrls.SearchOnboardedGoals;
  private Upsert_ProcessDashboard_API_PATH = APIEndpoint + 'Dashboard/ProcessDashboardApi/UpsertProcessDashboard';
  private GetAll_ProcessDashboard_ByDashboardId_API_PATH = APIEndpoint + 'Dashboard/ProcessDashboardApi/GetGoalsOverAllStatusByDashboardId';
  private Get_Dashboard_Id_API_PATH = APIEndpoint + 'Dashboard/ProcessDashboardApi/GetLatestDashboardId';

  getAllProcessDashboardStatuses(): Observable<LiveDashBoardStatusDropDownList[]> {
    var data = { ProcessDashboardStatusId: null, ProcessDashboardStatusName: null, ProcessDashboardHexaValue: null };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(data);
    return this.http.post<LiveDashBoardStatusDropDownList[]>(`${this.GetAll_ProcessDashboardStatuses_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllProcessDashboardDetails(statusColor: string,entityId, projectId): Observable<LiveDashBoardList[]> {
    let paramsobj = new HttpParams().set('statusColor', statusColor).set("entityId",entityId).set("projectId", projectId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    let body = JSON.stringify(statusColor);
    return this.http.get<LiveDashBoardList[]>(`${this.GetAll_ProcessDashboard_API_PATH}`,  httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllProcessDashboardDetailsById(dashboardId: string): Observable<LiveDashBoardList[]> {
    let paramsobj = new HttpParams().set('dashboardId', dashboardId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    let body = JSON.stringify(dashboardId);
    return this.http.get<LiveDashBoardList[]>(`${this.GetAll_ProcessDashboard_ByDashboardId_API_PATH}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetDashBoardId(): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    return this.http.get<string>(`${this.Get_Dashboard_Id_API_PATH}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getProcessDashboardScreenshot(): Observable<string> {
    var data = { processDashboardModels: { ProcessDashboardId: null, GoalId: null, MileStone: null, Delay: null, DashboardId: null, GeneratedDateTime: null } };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(data);
    return this.http.post<string>(`${this.Upsert_ProcessDashboard_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProcessDashboardScreenshotmain(processDashboardModelsList): Observable<string> {
    var data = { processDashboardModels: { ProcessDashboardId: null, GoalId: null, MileStone: null, Delay: null, DashboardId: null, GeneratedDateTime: null } };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(processDashboardModelsList);
    return this.http.post<string>(`${this.Upsert_ProcessDashboard_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

}

