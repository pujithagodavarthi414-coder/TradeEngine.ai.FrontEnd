import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const ApiUrls = {
  GetAddOrEditCustomAppIsRequired: `MasterData/MasterDataManagementApi/GetAddOrEditCustomAppIsRequired`,
  GetUserById: `User/UsersApi/GetUserById`
}

@Injectable({
  providedIn: "root"
})

export class MasterDataManagementService { 

  constructor(private http: HttpClient) { }  


getAddOrEditCustomAppIsRequired() {
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  return this.http.get(APIEndpoint + ApiUrls.GetAddOrEditCustomAppIsRequired, httpOptions)
    .pipe(map((result) => {
      return result;
    }));
}

getUserById(userId: string): Observable<UserModel[]> {
  let paramsobj = new HttpParams().set('userId', userId);
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: paramsobj
  };
  return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
    .pipe(map(result => {
      return result;
    }));
}
  
}
