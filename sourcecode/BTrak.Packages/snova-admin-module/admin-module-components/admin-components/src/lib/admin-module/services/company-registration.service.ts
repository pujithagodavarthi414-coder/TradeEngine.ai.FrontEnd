import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { CompanyRegistrationModel } from '../models/company-registration-model';
import { Observable } from "rxjs";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class CompanyregistrationService {

  private GET_All_Countries = APIEndpoint + ApiUrls.SearchSystemCountries;
  private Get_All_NumberFormats = APIEndpoint + ApiUrls.SearchNumberFormats;
  private Get_All_DateFormats = APIEndpoint + ApiUrls.SearchDateFormats;
  private Get_All_TimeFormats = APIEndpoint + ApiUrls.SearchTimeFormats;
  private GET_Currencies = APIEndpoint + ApiUrls.SearchSystemCurrencies;

  constructor(private http: HttpClient) { }

  getCountries(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.GET_All_Countries, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getNumberformat(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.Get_All_NumberFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getCurrencies(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.GET_Currencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getdateFormats(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.Get_All_DateFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTimeFormats(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(this.Get_All_TimeFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getIndustries(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchIndustries, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMainUseCases(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchMainUseCases, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getRoles(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchSystemRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTimeZones(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTimeZones, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertCompany(companyModel: CompanyRegistrationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertCompany, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertCompanyDetails(companyModel: CompanyRegistrationModel){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    let body = JSON.stringify(companyModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertCompanyDetails, body, httpOptions)
    .pipe(map(result => {
      return result;
    }))
  }

  getCompanyDetails(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    let body = ''

    return this.http.post(APIEndpoint + ApiUrls.CompanyDetails, body, httpOptions)
    .pipe(map(result => {
      return result;
    }))
  }
}