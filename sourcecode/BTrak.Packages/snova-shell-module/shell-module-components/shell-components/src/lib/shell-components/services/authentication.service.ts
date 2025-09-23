import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { CompaniesList } from '../models/companieslist.model';

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
    return this.http.post<any>(APIEndpoint + ApiUrls.Authorize, body, httpOptions);
  }

  loginNewUser(username: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.post<any>(APIEndpoint + 'api/LoginApi/AuthorizeNewUser', {
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
      .post(APIEndpoint + ApiUrls.GetCompanyTheme, body, httpOptions)
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

    const body = JSON.stringify(userDetails);
    return this.http
      .post(APIEndpoint + ApiUrls.CompanyLogin, body, httpOptions)
      .pipe(
        map((result) => {
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
      .get(APIEndpoint + ApiUrls.IsCompanyExists, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  getTimeSheetEnabledInformation() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<any>(
      APIEndpoint + 'Timesheet/TimesheetApi/GetEnableorDisableTimesheetButtons', httpOptions).pipe(
        map(data => {
          // this.timeSheetEnabledInformation.next(data);
          return data;
        })
      );
  }
}
