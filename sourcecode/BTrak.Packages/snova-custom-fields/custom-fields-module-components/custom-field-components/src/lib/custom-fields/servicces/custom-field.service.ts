import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { Dashboard } from '../models/dashboard';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CustomFieldHistoryModel } from '../models/custom-field-history.model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class CustomFieldService {
  constructor(private http: HttpClient) {}

  upsertcustomField(customField : CustomFormFieldModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.UpsertCustomFieldForm}`,
      customField
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  updatecustomField(customField : CustomFormFieldModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.UpdateCustomFieldData}`,
      customField
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  searchCustomFields(searchCustomField : CustomFormFieldModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.SearchCustomFieldForms}`,
      searchCustomField
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }
  
  getCustomFieldById(customFieldId: string) {
    let paramsObj = new HttpParams().set("customFieldId", customFieldId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetCustomFormFieldById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchCustomFieldsHistory(searchCustomField : CustomFieldHistoryModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.GetCustomFieldHistory}`,
      searchCustomField
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  
	updateDashboardName(dashboardModel: Dashboard){
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this.http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
  }
}