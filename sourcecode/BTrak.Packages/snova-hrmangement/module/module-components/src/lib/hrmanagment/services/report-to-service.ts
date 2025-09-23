import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ReportToSearchModel } from '../models/report-to-search-model';
import { ReportToDetailsModel } from '../models/report-to-details-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class ReportToService {
  constructor(private http: HttpClient) { }

  upsertReportTo(reportToModel: ReportToDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(reportToModel);

    return this.http.post<ReportToDetailsModel[]>(APIEndpoint + ApiUrls.UpsertEmployeeReportTo, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getReportToById(reportToInputModel: ReportToSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(reportToInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.SearchEmployeeReportToDetails,body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  
  getAllReports(reportToInputModel: ReportToSearchModel): Observable<ReportToDetailsModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(reportToInputModel);

    return this.http.post<ReportToDetailsModel[]>(APIEndpoint + ApiUrls.GetEmployeeDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


}