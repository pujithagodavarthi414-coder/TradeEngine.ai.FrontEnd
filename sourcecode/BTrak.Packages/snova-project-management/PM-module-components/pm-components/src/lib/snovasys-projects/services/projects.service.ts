import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectSearchCriteriaInputModel } from "../models/ProjectSearchCriteriaInputModel";
import { Project } from "../models/project";
import { ArchivedProjectInputModel } from "../models/archivedProjectInputModel";
import { UserStory } from "../models/userStory";
import { EmployeeListModel } from '../models/employee-model';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from "rxjs";
import { ActionCategory } from '../models/action-category.model';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
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

  getAllEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getActionCategories(catgeoryModel: ActionCategory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(catgeoryModel);

    return this.http.post(APIEndpoint + ApiUrls.GetActionCategories, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBusinessUnits(getBusinessUnitDropDownModel: BusinessUnitDropDownModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
    let body = JSON.stringify(getBusinessUnitDropDownModel);
  
    return this.http.post(`${APIEndpoint + ApiUrls.GetBusinessUnitDropDown}`, body, httpOptions);
  }
}