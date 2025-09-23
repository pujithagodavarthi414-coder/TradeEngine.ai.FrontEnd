import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { UserStoryLogTimeModel } from "../models/userStoryLogTimeModel";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LogTimeService {
  constructor(private http: HttpClient) {}
 
  GetAllLogTimeOptions() {
    return this.http
      .get<any[]>(`${APIEndpoint + ApiUrls.GetAllLogTimeOptions}`)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertUserStoryLogTime(userStoryLogTimeModel: UserStoryLogTimeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryLogTimeModel);    
    return this.http.post(`${APIEndpoint + ApiUrls.InsertUserStoryLogTime}`,body,httpOptions)
    .pipe(map(result => {
    return result;
    }));
  }

  UpsertUserStoryLogTimeFromPuncCard(isBreakStarted) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      //params: new HttpParams().set('searchText',isBreakStarted.toString())
    };
  return this.http.post(`${APIEndpoint + ApiUrls.UpsertUserstoryLogTimeBasedOnPunchCard}`+"?BreakStarted="+isBreakStarted, httpOptions).pipe(map(result => {
    return result;
  }));
  }

  SearchLogTimeHistory(userStoryLogTimeModel: UserStoryLogTimeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryLogTimeModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.SearchLogTimeHistory}`,
      body,
      httpOptions
    );
  }
}
