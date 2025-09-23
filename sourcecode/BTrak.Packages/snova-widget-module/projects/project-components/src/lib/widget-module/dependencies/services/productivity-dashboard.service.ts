import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from "rxjs/Observable"

import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const ApiUrls = {
  GetEntityDropDown: 'ProductivityDashboard/ProductivityDashboardApi/GetEntityDropDown'
}

@Injectable({
  providedIn: 'root',
})

export class ProductivityDashboardService {

  constructor(private http: HttpClient) { }

  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'my-auth-token'}),
      params: paramsobj
    };
   
    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`,httpOptions)
    .pipe(map(result => {
    return result;
    }));
  }
  
}