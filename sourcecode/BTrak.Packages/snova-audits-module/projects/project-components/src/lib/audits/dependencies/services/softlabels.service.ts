import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
// import { environment } from '../../../../environments/environment';
// import { ApiUrls } from '../../../common/constants/api-urls';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class SoftLabelConfigurationService {
    constructor(private http: HttpClient) { }

    getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(softLabels);
    
        return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
    
      upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(softLabels);
    
        return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getsoftLabelById(softLabelId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        let paramsObj = new HttpParams().set("softLabelId", softLabelId);
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: paramsObj
        };
    
        return this.http
          .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
          .pipe(
            map(result => {
              return result;
            })
          );
      }
}