import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocationManagement } from '../models/location-management';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class LocationManagementService {
  constructor(private http: HttpClient) { }

  getAllLocationManagementList(locationManagementModel: LocationManagement) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(locationManagementModel);

    return this.http.post<LocationManagement[]>(APIEndpoint + ApiUrls.SearchSeatingArrangement, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLocation(locationModel: LocationManagement) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(locationModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSeating, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchLocation(locationModel: LocationManagement) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(locationModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchSeatingArrangement, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}