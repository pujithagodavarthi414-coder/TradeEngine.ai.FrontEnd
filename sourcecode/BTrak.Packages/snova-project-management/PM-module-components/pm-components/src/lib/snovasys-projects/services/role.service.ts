import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class RoleService {
  private Get_All_Roles_API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private Get_All_EntityRoles_API_PATH = APIEndpoint + "EntityRole/EntityRoleApi/GetEntityRole";

  constructor(private http: HttpClient) {}

  GetAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify({ RoleId: null, RoleName: null, Data: null });

    return this.http.post(`${this.Get_All_Roles_API_PATH}`, body, httpOptions);
  }

  getEntityRole() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify({ EntityRoleId: null, EntityRoleName: null});

    return this.http.post(`${this.Get_All_EntityRoles_API_PATH}`, body, httpOptions);
  }
}
