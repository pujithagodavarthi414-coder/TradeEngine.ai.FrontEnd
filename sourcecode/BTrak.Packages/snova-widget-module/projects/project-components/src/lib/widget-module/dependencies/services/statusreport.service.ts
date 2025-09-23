import { HttpHeaders, HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const ApiUrls = {
  GetMyTeamMembersList: `HrManagement/HrManagementApi/GetMyTeamMembersList`
}

@Injectable({
  providedIn: 'root'
})

export class StatusreportService {

  constructor(private http: HttpClient) { }

  getTeamLeadsList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  }
