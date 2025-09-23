import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { TemplateModel } from "../models/templates-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class TemplatesService {
  constructor(private http: HttpClient) {}

  upsertTemplates(templates : TemplateModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.UpsertTemplate}`,
      templates
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  searchTemplates(templates : TemplateModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.SearchTemplates}`,
      templates
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }
  
  getTemplateById(templateId: string) {
    let paramsObj = new HttpParams().set("templateId", templateId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetTemplateById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  insertDuplicateTemplate(template: TemplateModel) {
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.InsertTemplateDuplicate}`,
        template
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  insertGoalTemplate(templateId: string) {
    let paramsObj = new HttpParams().set("templateId", templateId);
    paramsObj = paramsObj.set("isFromTemplate", "true");
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };
    return this.http
    .get(`${APIEndpoint + ApiUrls.InsertGoalByTemplateId}`, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  archiveTemplates(templates : TemplateModel) {
    return this.http
    .post<any>(
      `${APIEndpoint + ApiUrls.DeleteTemplate}`,
      templates
    )
    .pipe(
      map(result => {
        return result;
      })
    );
  }
}

