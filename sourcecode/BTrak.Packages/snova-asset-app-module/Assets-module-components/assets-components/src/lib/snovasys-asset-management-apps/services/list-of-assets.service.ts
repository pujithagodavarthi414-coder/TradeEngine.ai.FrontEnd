import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AssetComments } from "../models/asset-comments";
import { AssetInputModel } from "../models/asset-input-model";
import { AssetCommentsAndHistory } from "../models/assets-comments-and-history.model";
import { AssetCommentsAndHistorySearch } from "../models/assets-comments-and-history-search.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class ListOfAssetsService {
  constructor(private http: HttpClient) { }

  upsertComments(assetComments: AssetComments) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(assetComments);
    return this.http.post(APIEndpoint + ApiUrls.UpsertComment, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMultipleAssets(assetsDetails: AssetInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(assetsDetails);
    return this.http.post(APIEndpoint + ApiUrls.UpdateAssigneeForMultipleAssets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getComments(assetCommentsAndHistorySearch: AssetCommentsAndHistorySearch) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(assetCommentsAndHistorySearch);
    return this.http.post(APIEndpoint + ApiUrls.GetAssetCommentsAndHistory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllUsersAssets(assetsDetails: AssetInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(assetsDetails);
    return this.http.post(APIEndpoint + ApiUrls.GetAllUsersAssets, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
