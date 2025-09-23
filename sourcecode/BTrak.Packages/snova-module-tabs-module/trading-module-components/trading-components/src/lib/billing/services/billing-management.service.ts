import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { LeadTemplate } from "../models/lead-template.model";
import { EntryFormFieldModel } from "../models/entry-form-field.model";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable()
  

export class BillingManagementService{

    constructor(private http: HttpClient) { }

    upsertLeadTemplate(leadModel: LeadTemplate) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let body = JSON.stringify(leadModel);
  return this.http.post(APIEndpoint + ApiUrls.UpsertLeadTemplate, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
    }
    upsertEntryFormField(entryFormModel: EntryFormFieldModel) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
  
      let body = JSON.stringify(entryFormModel);
  
      return this.http.post(APIEndpoint + ApiUrls.UpsertEntryFormField, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

    getLeadTemplate(leadModel: LeadTemplate){
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let body = JSON.stringify(leadModel);
      return this.http.post(APIEndpoint + ApiUrls.GetLeadTemplates, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
    getEntryFormField(entryFormModel: EntryFormFieldModel) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let body = JSON.stringify(entryFormModel);
      return this.http.post(APIEndpoint + ApiUrls.GetEntryFormField, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }
     
}