import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReportingMethodDetailsModel } from  '../models/repoting-method-details-model';
import {ReportingMethodSearchModel} from '../models/repoting-method-search-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class ReportingMethodDetailsService {
  constructor(private http: HttpClient) { }

 
  getReportingMethodDetailsList(ReportingMethodDetails: ReportingMethodSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ReportingMethodDetails);

    return this.http.post<ReportingMethodSearchModel[]>(APIEndpoint + ApiUrls.GetReportingMethods, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}