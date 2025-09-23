import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { TransitionDeadlineModel } from "../models/transitionDeadline";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class TransitionDeadlineService {
  constructor(private http: HttpClient) {}
  private UPSERT_Transition_API_PATH =
    APIEndpoint +
    "TransitionDeadline/TransitionDeadlineApi/UpsertTransitionDeadline";
  private GET_ALL_GetAllTransitions_API_PATH =
    APIEndpoint +
    "TransitionDeadline/TransitionDeadlineApi/GetAllTransitionDeadlines";
  // private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;

  GetAllTransitionDeadlines(transitionDeadlineModel: TransitionDeadlineModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(transitionDeadlineModel);
    return this.http
      .post<any[]>(
        `${this.GET_ALL_GetAllTransitions_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertTransitionDeadline(transitionDeadlineModel: TransitionDeadlineModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(transitionDeadlineModel);
    return this.http
      .post(`${this.UPSERT_Transition_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
