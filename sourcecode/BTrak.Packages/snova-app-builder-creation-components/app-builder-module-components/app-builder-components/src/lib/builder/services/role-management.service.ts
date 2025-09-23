import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { EntityRoleFeatureModel } from '../models/entity-role-feature.model';
import { Observable } from "rxjs/Observable"; 
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class RoleManagementService {

  private Get_All_IntroducedByOptions = APIEndpoint + ApiUrls.GetAllRoles;

  constructor(private http: HttpClient) { }

  getAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
    let body = JSON.stringify(data);

    return this.http.post(this.Get_All_IntroducedByOptions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getAllPermittedEntityRoleFeaturesByUserId(){
    
    var entityFeatureModel = new EntityRoleFeatureModel();
     let body = JSON.stringify(entityFeatureModel);
     const httpOptions = {
       headers: new HttpHeaders({ "Content-Type": "application/json" }),
     };
     return this.http.post(`${APIEndpoint + ApiUrls.GetAllEntityRoleFeaturesByUserId}`,body, httpOptions);
   }
}