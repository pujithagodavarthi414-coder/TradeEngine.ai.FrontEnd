import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from 'rxjs';
import { FeedBackModel } from '../models/feedbackModel';
import { ApiUrls } from '../constants/api-urls';
import { UserStory } from '../models/userStory';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({ providedIn: "root" })
export class FeedBackService {
  constructor(private http: HttpClient) { }
  upsertFeedBackReport(feedBackModel: FeedBackModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(feedBackModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertFeedBack, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getFeedBackReport(feedBackModel: FeedBackModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(feedBackModel);

    return this.http.post(APIEndpoint + ApiUrls.GetFeedbacksList, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getFeedbackById(feedbackId: string) {
    const paramsobj = new HttpParams().set("feedbackId", feedbackId);

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetFeedbackById}`, httpOptions);
  }

  submitBug(userStoryModel: UserStory) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStoryModel);

    return this.http.post(APIEndpoint + ApiUrls.SubmitBug, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  requestMissingFeature(userStoryModel: UserStory) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStoryModel);

    return this.http.post(APIEndpoint + ApiUrls.RequestMissingFeature, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllUserStoryTypes(userStoryTypesModel) {
    const paramsObj = new HttpParams().set("isArchived", userStoryTypesModel.isArchived).set("searchText", userStoryTypesModel.searchText);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http.get(
      `${APIEndpoint + ApiUrls.GetUserStoryTypeDropDown}`,
      httpOptions
    );
  }
}
