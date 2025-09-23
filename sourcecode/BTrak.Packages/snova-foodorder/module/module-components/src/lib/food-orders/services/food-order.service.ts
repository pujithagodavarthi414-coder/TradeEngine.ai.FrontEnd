import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";

import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user';
import { FoodOrderManagementApiInput, FoodOrderModel, ChangeFoodOrderStatusInputModel } from '../models/all-food-orders';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { SearchFileModel } from '../models/search-file-model';
import { UpsertFileModel } from '../models/upsert-file-model';
import { User } from '../models/induction-user-model';
import { Currency } from '../models/currency';
import { CurrencyModel } from '../models/currency-model';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class FoodOrderService {
  constructor(private http: HttpClient) { }
  EditUser: UserModel;

  private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;

  getAllFoodOrders(foodOrderManagementApiInput: FoodOrderManagementApiInput) {

    let paramsobj = new HttpParams().set("pageNumber", foodOrderManagementApiInput.pageNumber.toString()).set("pageSize", foodOrderManagementApiInput.pageSize.toString());
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      params: paramsobj
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetAllFoodOrders, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchFoodOrder(foodOrderManagementApiInput: FoodOrderManagementApiInput) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(foodOrderManagementApiInput);
    return this.http.post<FoodOrderModel[]>(APIEndpoint + ApiUrls.SearchFoodOrder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFoodOrder(foodOrderModel: FoodOrderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(foodOrderModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertFoodOrder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  changeFoodOrderStatus(foodOrderStatusModel: ChangeFoodOrderStatusInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(foodOrderStatusModel);
    return this.http.post(APIEndpoint + ApiUrls.ChangeFoodOrderStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getRecentFoodOrders(foodOrderManagementApiInput: FoodOrderManagementApiInput) {
    //let paramsobj = new HttpParams().set("pageNumber", foodOrderManagementApiInput.pageNumber.toString()).set("pageSize", foodOrderManagementApiInput.pageSize.toString()).set("searchText", foodOrderManagementApiInput.searchText.toString());
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      //params: paramsobj
    };
    let body = JSON.stringify(foodOrderManagementApiInput);
    return this.http.post<FoodOrderModel[]>(APIEndpoint + ApiUrls.GetRecentFoodOrders, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMonthlyFoodOrders(date, entityId) {
    console.log(date);
    let paramsobj = new HttpParams().set("date", date.toISOString()).set("entityId", entityId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<FoodOrderModel[]>(APIEndpoint + ApiUrls.GetMonthlyFoodOrderReport, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFiles(searchFileModel: SearchFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertMultipleFiles(fileModel: UpsertFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertMultipleFiles, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteFile(deleteFileInputModel: DeleteFileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(deleteFileInputModel);
    return this.http.post(APIEndpoint + ApiUrls.DeleteFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFilesById(searchFileById: string[]) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileById);
    return this.http.post(APIEndpoint + ApiUrls.GetFileDetailById, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadFile(filePath: string) {
    let paramsobj = new HttpParams().set("filePath", filePath);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetAllUsers(): Observable<User[]> {
    var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true', isActive: true };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post<User[]>(
      `${this.USERS_SEARCH_API_PATH}`,
      body,
      httpOptions
    );
  }

  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getCurrencyList(): Observable<Currency[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let currencyModel = new CurrencyModel();
    currencyModel.isArchived = false;
    let body = JSON.stringify(currencyModel);
    return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  UploadFile(formData, moduleTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getsoftLabelById(softLabelId: string) {
    let paramsObj = new HttpParams().set("softLabelId", softLabelId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getStoreConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
