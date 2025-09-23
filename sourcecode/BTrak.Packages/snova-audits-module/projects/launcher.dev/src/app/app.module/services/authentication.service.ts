import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { CompaniesList } from "../models/companieslist.model";

const APIEndpoint = environment.apiURL;

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const loginObj = {
      UserName: username,
      Password: password
    };
    const body = JSON.stringify(loginObj);
    return this.http.post<any>(APIEndpoint + `api/LoginApi/Authorise`, body, httpOptions);
  }

  loginNewUser(username: string) {
    return this.http.post<any>(APIEndpoint + `api/LoginApi/AuthorizeNewUser`, {
      UserName: username
    });
  }

  getThemes() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const userId = this.cookieService.get("CurrentUserId");
    const getThemeInput = {
      companyId: "",
      companyName: "",
      authToken: "",
      userId: "",
      siteAddress: "",
      companyMiniLogo: ""
    };
    if (userId) {
      getThemeInput.userId = userId;
    }
    const body = JSON.stringify(getThemeInput);
    return this.http
      .post(APIEndpoint + "Company/CompanyStructure/GetTheme", body, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  companyLogin(userDetails: CompaniesList) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userDetails);
    return this.http
      .post(APIEndpoint + "api/LoginApi/CompanyLogin", body, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  getCompanyExistsOrNot() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http
      .get(APIEndpoint + "Company/CompanyStructure/IsCompanyExists", httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }
}
