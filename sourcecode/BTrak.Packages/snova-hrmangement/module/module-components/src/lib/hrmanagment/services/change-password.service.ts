import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { UserModel } from "../models/user";
import { ChangePasswordModel } from "../models/change-password-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class ChangePasswordService {

  constructor(private http: HttpClient) { }

  changePassword(changePasswordModel: ChangePasswordModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let body = JSON.stringify(changePasswordModel);

    return this.http.post<UserModel[]>(APIEndpoint + ApiUrls.ChangePassword, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}