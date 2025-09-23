import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SprintModel } from "../models/sprints-model";
import { GoalSearchCriteriaApiInputModel } from '../models/goalSearchInput';
import { ApiUrls } from '../constants/api-urls';
import { UserstoryTypeModel } from '../models/user-story-type-model';
import { ProjectFeature } from '../models/projectFeature';
import { BugPriorityDropDownData } from '../models/bugPriorityDropDown';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomTagsModel } from "../models/custom-tags-model";

@Injectable({
    providedIn: "root"
})

export class SprintService {
    constructor(private http: HttpClient) { }

    searchSprints(sprintsSearchModel: SprintModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        return this.http.post<any[]>(APIEndpoint + ApiUrls.SearchSprints, sprintsSearchModel);
    }

    upsertSprints(sprintsSearchModel: SprintModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertSprints, sprintsSearchModel);
    }

    completeSprints(sprintsSearchModel: SprintModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        return this.http.post<any>(APIEndpoint + ApiUrls.CompleteSprint, sprintsSearchModel);
    }

    getSprintById(sprintId, isBacklog) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        let paramsObj = new HttpParams().set("sprintId", sprintId).set("isBacklog", isBacklog);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsObj
        };

        return this.http
            .get(APIEndpoint + ApiUrls.GetSprintById, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    archiveSprint(sprintsSearchModel: SprintModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        return this.http
            .post<any>(
                APIEndpoint + ApiUrls.DeleteSprint,
                sprintsSearchModel
            )
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    searchGoals(goalSearchInput: GoalSearchCriteriaApiInputModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(goalSearchInput);
        
        return this.http.post<any[]>(APIEndpoint + ApiUrls.SearchGoals, body, httpOptions);
    }

    SearchUserStoryTypes(userstoryType: UserstoryTypeModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(userstoryType);

        return this.http.post(APIEndpoint + ApiUrls.GetUserStoryTypes, body, httpOptions);
    }

    GetAllProjectFeatures(projectFeatureModel: ProjectFeature) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(projectFeatureModel);

        return this.http
            .post<any[]>(APIEndpoint + ApiUrls.GetAllProjectFeaturesByProjectId, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    GetAllBugPriporities(bugPripority: BugPriorityDropDownData) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(bugPripority);

        return this.http
            .post(APIEndpoint + ApiUrls.GetAllBugPriorities, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    searchCustomTags(searchText: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const customApplicationModel = new CustomTagsModel();
        customApplicationModel.searchTagText = searchText;
        const body = JSON.stringify(customApplicationModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplicationTag, body, httpOptions)
        .pipe(
            map(result => {
                return result;
            })
        );
      }
    
}