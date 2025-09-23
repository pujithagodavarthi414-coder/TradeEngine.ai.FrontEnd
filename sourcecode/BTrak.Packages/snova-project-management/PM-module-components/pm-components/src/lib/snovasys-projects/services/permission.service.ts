import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { PermissionModel } from "../models/permission";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class PermissionService {
  constructor(private http: HttpClient) {}
  private UPSERT_PERMISSION_API_PATH =
    APIEndpoint + "Permission/PermissionApi/UpsertPermission";
  private GET_ALL_PERMISSION_API_PATH =
    APIEndpoint + "Permission/PermissionApi/GetAllPermissions";
  
  GetAllPermissions(PermissionModel: PermissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      
    };
   let body = JSON.stringify(PermissionModel);
    return this.http
      .post(`${this.GET_ALL_PERMISSION_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertPermissions(PermissionModel: PermissionModel) {
    let paramsobj = new HttpParams().set(
      "permissionName",
      PermissionModel.operationName
    );
    paramsobj = paramsobj.set("permissionId", PermissionModel.id);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(PermissionModel);
    return this.http
      .post(`${this.UPSERT_PERMISSION_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
