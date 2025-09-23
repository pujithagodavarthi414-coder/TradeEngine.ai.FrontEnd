import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityRoleFeatureModel } from '../models/entityRoleFeature';
import { Observable } from "rxjs";
import { UserModel } from '../models/user';
import { ApiUrls } from '../constants/api-urls';
import { UserNotificationReadModel } from '../models/NotificationsOutPutModel';

@Injectable({ providedIn: "root" })

export class MenuItemService {
  constructor(private http: HttpClient) { }

  getAllApplicableMenuItems() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.get<any>(APIEndpoint + ApiUrls.GetAllApplicableMenuItems, httpOptions);
  }

  getAllPermittedRoleFeatures() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.get<any>(APIEndpoint + ApiUrls.GetAllPermittedRoleFeatures, httpOptions);
  }

  searchUsers(userModel: UserModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(userModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPermittedEntityRoleFeatures(projectId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    var entityFeatureModel = new EntityRoleFeatureModel();
    entityFeatureModel.projectId = projectId;
    let body = JSON.stringify(entityFeatureModel);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http.post(APIEndpoint + ApiUrls.GetAllPermittedEntityRoleFeatures, body, httpOptions);
  }

  getAllPermittedEntityRoleFeaturesByUserId() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    var entityFeatureModel = new EntityRoleFeatureModel();
    let body = JSON.stringify(entityFeatureModel);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http.post(APIEndpoint + ApiUrls.GetAllEntityRoleFeaturesByUserId, body, httpOptions);
  }

  getAllNotifications(notificationsModel: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(notificationsModel);
    return this.http.post(APIEndpoint + ApiUrls.GetNotifications, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertNotificationReadStatus(upsertNotificationModel: UserNotificationReadModel[]) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(upsertNotificationModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertNotificationReadStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  clearDemoData() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    return this.http.post(APIEndpoint + ApiUrls.DeleteCompanyTestData, httpOptions);
  }
}