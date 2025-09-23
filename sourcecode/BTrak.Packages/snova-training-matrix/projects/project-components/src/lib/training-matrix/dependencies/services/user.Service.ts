import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})

export class UserService {
  constructor(private http: HttpClient) { }

  getUsersDropDown(searchText: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
