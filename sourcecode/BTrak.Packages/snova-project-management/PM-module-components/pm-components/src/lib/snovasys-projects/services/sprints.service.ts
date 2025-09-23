import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SprintModel } from "../models/sprints-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;



@Injectable({
    providedIn: "root"
})
export class SprintService {
    constructor(private http: HttpClient) { }

    searchSprints(sprintsSearchModel: SprintModel) {
        return this.http.post<any[]>(
            `${APIEndpoint + ApiUrls.SearchSprints}`,
            sprintsSearchModel
        );
    }

    searchAllSprints(sprintsSearchModel: SprintModel) {
        return this.http.post<any[]>(
            `${APIEndpoint + ApiUrls.GetUserStoriesForAllSprints}`,
            sprintsSearchModel
        );
    }

    upsertSprints(sprintsSearchModel: SprintModel) {
        return this.http.post<any>(
            `${APIEndpoint + ApiUrls.UpsertSprints}`,
            sprintsSearchModel
        );
    }

    completeSprints(sprintsSearchModel: SprintModel) {
        return this.http.post<any>(
            `${APIEndpoint + ApiUrls.CompleteSprint}`,
            sprintsSearchModel
        );
    }



    getSprintById(sprintId,isBacklog, isUnique) {
        let paramsObj = new HttpParams().set("sprintId", sprintId).set("isBacklog", isBacklog).set("isUnique", isUnique);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsObj
        };

        return this.http
            .get(`${APIEndpoint + ApiUrls.GetSprintById}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    archiveSprint(sprintsSearchModel: SprintModel) {
        return this.http
            .post<any>(
                `${APIEndpoint + ApiUrls.DeleteSprint}`,
                sprintsSearchModel
            )
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
}