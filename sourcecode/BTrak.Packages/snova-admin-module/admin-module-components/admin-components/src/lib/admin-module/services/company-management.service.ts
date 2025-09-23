import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IntroducedByOptionsModel } from '../models/introduced-by-option-model';
import { ApiUrls } from '../constants/api-urls';
import { CompanyLocationModel } from '../models/company-location-model';
import { DateFormatModel } from '../models/date-format-model';
import { Observable } from "rxjs";
import { MainUseCaseModel } from '../models/mainUseCaseModel';
import { TimeFormatModel } from '../models/time-format-model';
import { NumberFormatModel } from '../models/number-format-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class CompanyManagementService {

  private Get_All_IntroducedByOptions = APIEndpoint + ApiUrls.SearchIntroducedByOptions;
  private Upsert_IntroducedByOption = APIEndpoint + ApiUrls.UpsertCompanyIntroducedByOption;
  private Get_All_CompanyLocations = APIEndpoint + ApiUrls.SearchCompanyLocation;
  private Upsert_CompanyLocation = APIEndpoint + ApiUrls.UpsertCompanyLocation;
  private Get_All_DateFormats = APIEndpoint + ApiUrls.SearchDateFormats;
  private Upsert_DateFormat = APIEndpoint + ApiUrls.UpsertDateFormat;
  private Get_All_MainUseCases = APIEndpoint + ApiUrls.SearchMainUseCases;
  private MainUse_case = APIEndpoint + ApiUrls.UpsertMainUseCase;
  private Get_All_NumberFormats = APIEndpoint + ApiUrls.SearchNumberFormats;
  private Upsert_NumberFormat = APIEndpoint + ApiUrls.UpsertNumberFormat;
  private Get_All_TimeFormats = APIEndpoint + ApiUrls.SearchTimeFormats;
  private Upsert_TimeFormat = APIEndpoint + ApiUrls.UpsertTimeFormat;

  constructor(private http: HttpClient) { }

  getAllIntroducedByOptions(introducedByOptions: IntroducedByOptionsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(introducedByOptions);

    return this.http.post(this.Get_All_IntroducedByOptions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertIntroducedByOption(introducedByOptionsModel: IntroducedByOptionsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(introducedByOptionsModel);

    return this.http.post(this.Upsert_IntroducedByOption, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllCompanyLocations(companyLocationModel: CompanyLocationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyLocationModel);

    return this.http.post(this.Get_All_CompanyLocations, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertCompanyLocation(companyLocationModel: CompanyLocationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyLocationModel);

    return this.http.post(this.Upsert_CompanyLocation, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getDateFormats(dateFormatModel: DateFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dateFormatModel);

    return this.http.post(this.Get_All_DateFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  };

  upsertDateFormat(dateFormatModel: DateFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dateFormatModel);

    return this.http.post(this.Upsert_DateFormat, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllMainUseCaseTypes(mainUseCase: MainUseCaseModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(mainUseCase);

    return this.http.post(this.Get_All_MainUseCases, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertMainUsecase(mainUseCase: MainUseCaseModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(mainUseCase);

    return this.http.post(this.MainUse_case, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertNumberFormat(numberFormatModel: NumberFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(numberFormatModel);

    return this.http.post(this.Upsert_NumberFormat, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getnumberFormats(numberFormatModel: NumberFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(numberFormatModel);

    return this.http.post(this.Get_All_NumberFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllTimeFormats(timeFormatModel: TimeFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeFormatModel);

    return this.http.post(this.Get_All_TimeFormats, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertTimeFormat(timeFormatModel: TimeFormatModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(timeFormatModel);

    return this.http.post(this.Upsert_TimeFormat, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
