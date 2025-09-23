import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { EntityRoleFeatureModel } from '../models/entityRoleFeature';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";
import { Branch } from '../models/branch';
import { UserModel } from '../models/user';

@Injectable({ providedIn: "root" })
export class MenuItemService {
  constructor(private http: HttpClient) {}


  getBranchList(branchSearchResult: Branch): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchUsers(userModel: UserModel) {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    let body = JSON.stringify(userModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
        .pipe(map(result => {
            return result;
        }));
}

  
  getAllPermittedEntityRoleFeatures(projectId:string){
    var entityFeatureModel = new EntityRoleFeatureModel();
    entityFeatureModel.projectId = projectId;
     let body = JSON.stringify(entityFeatureModel);
     const httpOptions = {
       headers: new HttpHeaders({ "Content-Type": "application/json" }),
       
     };
     return this.http.post(`${APIEndpoint + ApiUrls.GetAllPermittedEntityRoleFeatures}`,body, httpOptions);
   }
 
   getAllPermittedEntityRoleFeaturesByUserId(){
     
    var entityFeatureModel = new EntityRoleFeatureModel();
     let body = JSON.stringify(entityFeatureModel);
     const httpOptions = {
       headers: new HttpHeaders({ "Content-Type": "application/json" }),
     };
     return this.http.post(`${APIEndpoint + ApiUrls.GetAllEntityRoleFeaturesByUserId}`,body, httpOptions);
   }
 
}