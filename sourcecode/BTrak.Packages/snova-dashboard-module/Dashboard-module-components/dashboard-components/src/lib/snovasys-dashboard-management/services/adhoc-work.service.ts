import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserStory } from '../models/userstory.model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { AdhocWorkSearchCriteriaInputModel } from '../models/adhocWorkSearchCriteriaModel';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root"
})


export class AdhocWorkService {

    constructor(private http: HttpClient) { }

    upsertAdhocWork(userStory: UserStory) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(userStory);
        return this.http
            .post(APIEndpoint + ApiUrls.UpsertAdhocWork, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    loadAdhocWorkUserStories(adhocWorkSearchCriteriaModel: AdhocWorkSearchCriteriaInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(adhocWorkSearchCriteriaModel);
        return this.http
            .post(APIEndpoint + ApiUrls.SearchAdhocWork, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getAdhocUserStoryById(userStoryId:string){
        let paramsObj = new HttpParams().set("userStoryId", userStoryId);
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: paramsObj
        };
    
        return this.http
          .get(`${APIEndpoint + ApiUrls.GetAdhocWorkByUserStoryId}`, httpOptions)
          .pipe(
            map(result => {
              return result;
            })
          );
    }

    getAdhocUsersDropDown(searchText: string, isForDropDown: any){
        let paramsObj = new HttpParams().set("searchText", searchText).set("isForDropDown", isForDropDown);
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: paramsObj
        };
    
        return this.http
          .get(`${APIEndpoint + ApiUrls.GetAdhocUsersDropDown}`, httpOptions)
          .pipe(
            map(result => {
              return result;
            })
          );
    }
}
