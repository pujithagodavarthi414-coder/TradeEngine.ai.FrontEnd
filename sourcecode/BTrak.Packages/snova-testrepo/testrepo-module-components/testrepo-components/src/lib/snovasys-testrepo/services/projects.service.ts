import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ProjectSearchCriteriaInputModel } from "../models/ProjectSearchCriteriaInputModel";
import { ArchivedProjectInputModel } from "../models/archivedProjectInputModel";
import { ApiUrls } from "../constants/api-urls";
import { UserStory } from "../models/userStory";
import { map } from 'rxjs/operators';
import { Project } from '../models/project';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})

export class ProjectService {
  constructor(private http: HttpClient) { }

  EditProject: Project;

  searchProjects(projectSearchInput: ProjectSearchCriteriaInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(projectSearchInput);
    return this.http.post<Project[]>(APIEndpoint + ApiUrls.SearchProjects, body, httpOptions);
  }

  getEntityDropDown(searchText) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetEntityDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
