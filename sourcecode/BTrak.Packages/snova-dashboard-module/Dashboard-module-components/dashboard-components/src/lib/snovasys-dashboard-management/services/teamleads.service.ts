import { HttpHeaders, HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

import { Observable } from "rxjs";
import { EntityRoleFeatureModel } from '../models/entity-role-feature.model';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class TeamLeadsService {
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

  getAllPermittedEntityRoleFeatures(projectId:string){
    var entityFeatureModel = new EntityRoleFeatureModel();
    entityFeatureModel.projectId = projectId;
     let body = JSON.stringify(entityFeatureModel);
     const httpOptions = {
       headers: new HttpHeaders({ "Content-Type": "application/json" }),
       
     };
     return this.http.post(`${APIEndpoint + ApiUrls.GetAllPermittedEntityRoleFeatures}`,body, httpOptions);
   }
}