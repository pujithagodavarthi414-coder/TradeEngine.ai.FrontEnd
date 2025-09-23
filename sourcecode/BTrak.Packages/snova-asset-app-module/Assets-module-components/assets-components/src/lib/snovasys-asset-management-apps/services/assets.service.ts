import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductDetails } from '../models/product-details';
import { Product } from '../models/product';
import { Assets } from '../models/asset';
import { Currency } from '../models/currency';
import { AssetInputModel } from '../models/asset-input-model';
import { PrintAssetsModel } from '../models/print-assets-model';
import { CompanysettingsModel } from '../models/company-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Branch } from '../models/branch';
import { CurrencyModel } from '../models/currency-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserModel } from '../models/user-model';
import { User } from '../models/user';
import { EmployeeListModel } from '../models/employee-model';
import { SoftLabelConfigurationModel } from '../models/softlabelconfiguration.model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class AssetService {
  constructor(private http: HttpClient) { }

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


  getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);

  }

  getProductList(productInputSearch: Product): Observable<Product[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productInputSearch);
    return this.http.post<Product[]>(APIEndpoint + ApiUrls.GetAllProducts, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
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

  getAllCompanySettings(companysettingModel: CompanysettingsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companysettingModel);

    return this.http.post(APIEndpoint + ApiUrls.GetCompanysettings, body, httpOptions);

  }

  getProductDetailsList(productDetailsInputSearch: ProductDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productDetailsInputSearch);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.SearchProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertProduct(productModel: Product) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(productModel);
    return this.http.post<Product[]>(APIEndpoint + ApiUrls.UpsertProduct, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertProductDetails(productDetailsModel: ProductDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(productDetailsModel);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.UpsertProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertAssetDetails(assetDetailsModel: Assets) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetDetailsModel);
    return this.http.post<Assets[]>(APIEndpoint + ApiUrls.UpsertAsset, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllAssets(assetsInputModel: AssetInputModel): Observable<AssetInputModel[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.SearchAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAssetById(assetsInputModel: AssetInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.SearchAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAssetsCount(assetsInputModel: AssetInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.GetAssetsCount, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchProductDetailsList(productDetailsById: ProductDetails) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productDetailsById);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.SearchProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  printAssets(printAssetsModel: PrintAssetsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(printAssetsModel);
    return this.http.post(APIEndpoint + ApiUrls.PrintAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUsersDropDown(searchText: string) {
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

  GetAllUsers(): Observable<User[]> {
    var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true' };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post<User[]>(APIEndpoint + ApiUrls.GetAllUsers,
      body,
      httpOptions
    );
  }

  GetUsersList(UserInputModel: UserModel): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(UserInputModel);
    return this.http.post<User[]>(APIEndpoint + ApiUrls.GetAllUsers,
      body,
      httpOptions
    );
  }

  upsertUser(userModel: UserModel): Observable<UserModel[]> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userModel);
    return this.http.post<UserModel[]>(APIEndpoint + ApiUrls.UpsertUser, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeById(employeeId: string) {
    let paramsobj = new HttpParams().set('employeeId', employeeId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetEmployeeById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllEmployeesDetails(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployeesDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeePersonalDetails}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getLoggedUserData() {
    return this.http.get<any[]>(`${APIEndpoint + ApiUrls.GetLoggedInUser}`);
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

}
