import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { ProjectMember } from "../models/projectMember";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProjectMemberService {
  
  constructor(private http: HttpClient) {}

  getAllProjectMembers(projectId: string) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
     
    return this.http.post(
      `${APIEndpoint + ApiUrls.GetAllProjectMembers}`,
      JSON.stringify({ ProjectId: projectId,IsArchived:false }),
      httpOptions
    );
  }

  getProjectMembers(projectMember:ProjectMember){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    projectMember.isArchived = false;
    return this.http.post(
      `${APIEndpoint + ApiUrls.GetAllProjectMembers}`,
      JSON.stringify(projectMember),
      httpOptions
    );
  }

  upsertProjectMember(projectMember: ProjectMember) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let RoleIds = [];
    RoleIds = projectMember.roleIds;
    projectMember.roleIds = RoleIds;

    let body = JSON.stringify(projectMember);
    return this.http
      .post(`${APIEndpoint + ApiUrls.UpsertProjectMember}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteProjectMember(projectMember:ProjectMember){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(projectMember);
    return this.http
      .post(`${APIEndpoint + ApiUrls.DeleteProjectMember}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getProjectMemberById(projectMemberId:string,projectId:string){
    let paramsobj = new HttpParams().set("projectMemberId", projectMemberId).set("projectId",projectId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetProjectMemberById}`, httpOptions);
  }
}
