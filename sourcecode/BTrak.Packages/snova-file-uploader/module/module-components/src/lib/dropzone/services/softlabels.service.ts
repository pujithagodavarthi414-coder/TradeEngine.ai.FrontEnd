import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class SoftLabelConfigurationService {
  constructor(private http: HttpClient) { }

  getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post<any>(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post<any>(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getsoftLabelById(softLabelId: string) {
    let paramsObj = new HttpParams().set("softLabelId", softLabelId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get<any>(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


}