import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HrBranchModel } from '../models/HrBranchModel';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const ApiUrls = {
  GetAllBranches: `Branch/BranchApi/GetAllBranches`,
  GetWebHooks: `HrManagement/HrManagementApi/GetWebHooks`
}

@Injectable({
  providedIn: "root"
})

export class HRManagementService {

  constructor(private http: HttpClient) { }

  //required
  getBranches(branchModel: HrBranchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(branchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  }
