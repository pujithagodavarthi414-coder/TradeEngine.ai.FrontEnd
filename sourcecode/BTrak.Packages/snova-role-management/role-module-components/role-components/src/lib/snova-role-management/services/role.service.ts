import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { RoleModel } from "../models/role-model";
import { FeatureSearchModel } from "../models/feature-model";
import { EntityRoleModel } from "../models/entity-role-model";
import { EntityTypeFeatureModel } from "../models/entity-type-feature-model";
import { EntityTypeRoleFeatureModel } from "../models/entity-type-role-feature-model";
import { EntityRoleFetureModel } from "../models/entity-role-feature-model";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityRoleFeatureModel } from '../models/entityRoleFeature';
import { RolesListModel } from '../models/roles-list.model';
import { EntityRolesListModel } from '../models/entity-roles-list.model';

@Injectable({
  providedIn: "root"
})

export class RoleService {
  constructor(private http: HttpClient) { }

  getFeatures(featureModel: FeatureSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(featureModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllFeatures, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  saveRole(roleModel: RoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertRole, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  deleteRole(roleModel: RoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.DeleteRole, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getAllRoles(roleModel: RoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getRoleById(roleId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set("roleId", roleId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetRoleById, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  GetLateEmployeeCount(model) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let data = JSON.stringify(model);
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetLateEmployeeCount, data, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPermittedEntityTypeFeatures(entityTypeFeatureModel: EntityTypeFeatureModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityTypeFeatureModel);
    return this.http.post<EntityTypeFeatureModel[]>(APIEndpoint + ApiUrls.GetAllPermittedEntityFeatures, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPermittedEntityTypeRoleFeatures(entityTypeRoleFeatureData: EntityTypeRoleFeatureModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityTypeRoleFeatureData);
    return this.http.post<EntityTypeFeatureModel[]>(APIEndpoint + ApiUrls.GetAllPermittedEntityRoleFeatures, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPermittedEntityRoleFeaturesByUserId() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    var entityFeatureModel = new EntityRoleFeatureModel();
    let body = JSON.stringify(entityFeatureModel);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http.post(APIEndpoint + ApiUrls.GetAllEntityRoleFeaturesByUserId, body, httpOptions);
  }

  upsertEntityTypeRoleFeature(entityTypeRoleFeatureData) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityTypeRoleFeatureData);
    return this.http.post(APIEndpoint + ApiUrls.UpsertEntityRoleFeature, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertEntityRole(entityRoleModel: EntityRoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityRoleModel);
    return this.http.post<EntityRoleModel[]>(APIEndpoint + ApiUrls.UpsertEntityRole, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteEntityRole(entityRoleModel: EntityRoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityRoleModel);
    return this.http.post(APIEndpoint + ApiUrls.DeleteEntityRole, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEntityRole() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(new EntityRoleModel());
    return this.http.post<EntityRoleModel[]>(APIEndpoint + ApiUrls.GetEntityRole, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEntityRoleFeatures(entityRoleFetureModel: EntityRoleFetureModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityRoleFetureModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEntityRolesWithFeatures, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getRolesList(featureId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set("featureId", featureId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetRolesByFeatureId, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  updateRoleFeatures(rolesListModel: RolesListModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(rolesListModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateRoleFeature, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  
  getEntityRolesList(entityFeatureId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set("entityFeatureId", entityFeatureId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetEntityRolesByEntityFeatureId, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  updateEntityRoleFeatures(entityRolesListModel: EntityRolesListModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(entityRolesListModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateEntityRoleFeature, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}