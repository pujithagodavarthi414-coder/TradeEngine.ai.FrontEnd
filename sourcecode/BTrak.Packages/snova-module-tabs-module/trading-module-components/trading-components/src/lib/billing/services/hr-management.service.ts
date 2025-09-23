import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CountryModel } from "../models/country-model";
import { ApiUrls } from '../constants/api-urls';
import { UserModel } from '../models/userModel';
import { TimeZoneModel } from '../models/time-zone';
import { ContractTypeModel } from '../models/contract-type-model';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { Observable } from "rxjs";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable()

export class HRManagementService {
  private GET_All_ContractTypes = APIEndpoint + ApiUrls.GetContractTypes;
  private Upsert_Contract_Type = APIEndpoint + ApiUrls.UpsertContractType;
  private GET_All_Countries = APIEndpoint + ApiUrls.GetCountries;
  private Upsert_Country = APIEndpoint + ApiUrls.UpsertCountry;

  constructor(private http: HttpClient) { }


  getCountries(countryModel: CountryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(countryModel);

    return this.http.post(this.GET_All_Countries, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertCountry(countryModel: CountryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(countryModel);
    return this.http.post(this.Upsert_Country, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getContractTypes(contractTypeModel: ContractTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(this.GET_All_ContractTypes, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertContractType(contractTypeModel: ContractTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(contractTypeModel);

    return this.http.post(this.Upsert_Contract_Type, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetShiftTimingOptions() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetShiftTimingOptions}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllTimeZones(timeZoneModel: TimeZoneModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(timeZoneModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTimeZones, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTimeZones(timeZoneModel: TimeZoneModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(timeZoneModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTimeZone, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));

  }

  getEmployees() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeesForBonus}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getOrgazationChartDetails() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get(`${APIEndpoint + ApiUrls.GetOrganizationChartDetails}`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyEmployeeId(userId: string) {
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

  GetEmployeeReportToMembers(userId: string) {
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeeReportToMembers}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getThemes() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var theme = {};
    let body = JSON.stringify(theme);
    return this.http
      .post(APIEndpoint + `Company/CompanyStructure/GetTheme`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
