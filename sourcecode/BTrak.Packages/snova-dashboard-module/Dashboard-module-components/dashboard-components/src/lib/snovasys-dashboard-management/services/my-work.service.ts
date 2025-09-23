import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProjectsViewModel } from '../models/projects-view-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class MyWorkService {
  constructor(private http: HttpClient) { }

  getUserStoriesList(projectViewModel: ProjectsViewModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var body = JSON.stringify(projectViewModel);
    console.log(body);
    return this.http.post(`${APIEndpoint + ApiUrls.GetMyProjectsWork}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProjectOverViewDetails(projectViewModel: ProjectsViewModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var body = JSON.stringify(projectViewModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetMyWorkOverViewDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUserStoryById(requestId: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var body = JSON.stringify(requestId);
    return this.http.post(`${APIEndpoint + ApiUrls.GetMyWorkOverViewDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}