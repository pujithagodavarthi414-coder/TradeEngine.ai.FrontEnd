import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { Currency } from '../models/currency';
import { CurrencyModel } from '../models/currency-model';
import { ApiUrls } from '../constants/api-urls';
import { ScheduleModel } from '../models/schedule-models/schedule-model';
import { LeadTemplate } from "../models/lead-template.model";
import { EntryFormFieldModel } from "../models/entry-form-field.model";
import { EntryFormFieldTypeModel } from "../models/entry-form-field-type.model";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: 'root',
  })
  

export class BillingManagementService{

    private GET_ALL_Schedules ;
    private Upsert_Schedule ;
    constructor(private http: HttpClient) { }



    getSchedules(scheduleModel: ScheduleModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(scheduleModel);
    
        return this.http.post(this.GET_ALL_Schedules, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
    }

    upsertSchedule(scheduleModel: ScheduleModel) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
  
      let body = JSON.stringify(scheduleModel);
  
      return this.http.post(this.Upsert_Schedule, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

    getCurrencyList(currencyModel: CurrencyModel): Observable<Currency[]> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let body = JSON.stringify(currencyModel);
      return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

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

    getEntryFormFieldTypes(entryFormModel: EntryFormFieldTypeModel) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      let body = JSON.stringify(entryFormModel);
      return this.http.post(APIEndpoint + ApiUrls.GetEntryFormFieldTypes, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }
     
}