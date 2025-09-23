import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Branch } from "../models/branch";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
@Injectable({
  providedIn: "root"
})
export class BranchService {
  constructor(private http: HttpClient) {}
  private BRANCH_SEARCH_API_PATH =
    APIEndpoint + "Branch/BranchApi/GetAllBranches";

  GetBranchesList() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
    };
    let body = JSON.stringify(new Branch());
    return this.http
      .post(`${this.BRANCH_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
