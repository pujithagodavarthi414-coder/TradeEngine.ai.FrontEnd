import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {UserStoryHistory} from '../models/userstory-history.model';
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class UserstoryHistoryService {
    constructor(private http: HttpClient) {}

    getUserStoryHistory(userstoryId:string) {
      let paramsobj = new HttpParams().set("userStoryId", userstoryId);
  
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        params: paramsobj
      };;
      return this.http.get(`${APIEndpoint + ApiUrls.GetUserStoryHistory}`, httpOptions).pipe(
        map(result => {
          return result;
        })
      );
    }

}