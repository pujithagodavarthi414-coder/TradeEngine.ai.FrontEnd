import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../../environments/environment";
import { ProjectSearchCriteriaInputModel } from "../models/ProjectSearchCriteriaInputModel";
import { Project } from "../models/project";
import { ArchivedProjectInputModel } from "../models/archivedProjectInputModel";
import { ApiUrls } from "../../../common/constants/api-urls";
import { UserStory } from "../models/userStory";
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  constructor(private http: HttpClient) { }


  EditProject: Project;

  searchProjects(projectSearchInput: ProjectSearchCriteriaInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(projectSearchInput);
    return this.http.post<Project[]>(
      `${APIEndpoint + ApiUrls.SearchProjects}`,
      body,
      httpOptions
    );
  }

  upsertProject(project: Project) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(project);
    return this.http.post(`${APIEndpoint + ApiUrls.UpsertProject}`, body, httpOptions);
  }

  archiveProject(project: ArchivedProjectInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(project);
    return this.http.post(`${APIEndpoint + ApiUrls.ArchiveProject}`, body, httpOptions);
  }

  GetProjectById(projectId: string) {
    let paramsobj = new HttpParams().set("projectId", projectId);

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetProjectById}`, httpOptions);
  }

  searchAllWorkItems(userStory: UserStory) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStory);

    return this.http.post(`${APIEndpoint + ApiUrls.SearchWorkItemsByLoggedInId}`, body, httpOptions);
  }
}
