import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { Observable } from 'rxjs';

import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CompaniesList } from '../models/companieslist.model';
import { CompanyPaymentUpsertModel } from '../models/company-payment-model';

@Injectable({ providedIn: "root" })

export class AuthenticationService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var loginObj = {
      UserName: username,
      Password: password
    };
    const body = JSON.stringify(loginObj);
    return this.http.post<any>(APIEndpoint + `api/LoginApi/Authorise`, body, httpOptions);
  }

  loginWithGoogle(userDetails: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userDetails);
    return this.http.post<any>(APIEndpoint + `api/LoginApi/AuthorizeUserFromGoogle`, body, httpOptions);
  }

  loginNewUser(username: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.post<any>(APIEndpoint + `api/LoginApi/AuthorizeNewUser`, {
      UserName: username
    });
  }

  getThemes() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    var theme = new CompaniesList();
    if (userId) {
      theme.userId = userId;
    }
    let body = JSON.stringify(theme);
    return this.http
      .post(APIEndpoint + `Company/CompanyStructure/GetTheme`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  companyLogin(userDetails: CompaniesList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(userDetails);
    return this.http
      .post(APIEndpoint + `api/LoginApi/CompanyLogin`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getCompanyExistsOrNot() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http
      .get(APIEndpoint + `Company/CompanyStructure/IsCompanyExists`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getActiveUsersCount() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsObject =  new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObject
    };
    return this.http
      .get(APIEndpoint + `HrManagement/HrManagementApi/GetActiveUsersCount`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertCompanyPayments(companyPaymentDetails: CompanyPaymentUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyPaymentDetails);
    return this.http
      .post(APIEndpoint + `Payments/PaymentsApi/UpsertCompanyPayment`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

}