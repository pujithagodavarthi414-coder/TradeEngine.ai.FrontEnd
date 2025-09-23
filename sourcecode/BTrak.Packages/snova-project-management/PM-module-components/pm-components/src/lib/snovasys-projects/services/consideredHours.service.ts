import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import {
  ConfigurationType,
  ConfigurationSearchCriteriaInputModel
} from "../models/configurationType";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ConsideredHours } from "../models/consideredHours";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class ConsideredHoursService {
  constructor(private http: HttpClient) {}

  private GET_ALL_CONSIDERED_HOURS_API_PATH =
    APIEndpoint + "ConsideredHours/ConsideredHoursApi/GetAllConsideredHours";
  private UPSERT_CONSIDERED_HOURS_API_API_PATH =
    APIEndpoint + "ConsideredHours/ConsideredHoursApi/UpsertConsideredHours";

  GetAllConsideredHours(consideredHours: ConsideredHours) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var data = {
      ConsiderHourId: consideredHours.considerHourId,
      ConsiderHourName: consideredHours.considerHourName
    };

    let body = JSON.stringify(data);
    return this.http
      .post<any[]>(
        `${this.GET_ALL_CONSIDERED_HOURS_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertConsideredHours(consideredHoursModel: ConsideredHours) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(consideredHoursModel);
    return this.http
      .post(`${this.UPSERT_CONSIDERED_HOURS_API_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
