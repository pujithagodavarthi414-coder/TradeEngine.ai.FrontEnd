import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { Observable } from 'rxjs';
import { ClientDeleteModel } from '../models/client-delete-model';
import { ClientSearchInputModel } from '../models/client-search-input.model';
import { ClientContactModel } from '../models/client-contact.model';
import { RoleModel } from '../models/role-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class BillingDashboardService {

  private Upsert_SecondaryContact ;
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
 
  constructor(private http:HttpClient) { }
  
  addClient(dailyLogTimeReport: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint+ApiUrls.UpsertClientDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  addSecondaryContact(dailyLogTimeReport: any) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint+ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateSecondaryContactDetails(dailyLogTimeReport: any) {

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
   
    };
   
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint+ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteClient(deleteClient: ClientDeleteModel) {
   
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),     
    };
  let  body= JSON.stringify(deleteClient);
    return this.http
      .post(APIEndpoint+ApiUrls.MultipleClientDelete,body,httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  updateClientDetails(id,dailyLogTimeReport: any) {
    let paramsobj = new HttpParams().set('id',id)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .put(APIEndpoint+ApiUrls.UpsertClientDetails,body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  deleteSecondaryContactDetails(id) {
    let paramsobj = new HttpParams().set('id',id)
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
  
    return this.http
      .delete('http://expenseapi.btrak.io:3000/secondarycontact/'+id, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  
  daywiseExpense() {

  
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    return this.http.get<any[]>(APIEndpoint + '/expensesperday', httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getGeneralledger() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    return this.http.get<any[]>(APIEndpoint + '/generalGenderList', httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
 
  
  getCountryslist() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    return this.http.get<any[]>(APIEndpoint+ApiUrls.GetCountries, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
    
  getClients(clientSearch : ClientSearchInputModel)
  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    let body = JSON.stringify(clientSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetClients,body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  recentlyEdiitedClients()
  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    let body = JSON.stringify({"CreatedDateTime":true});
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetClients,body, httpOptions)
      .pipe(map(result => {

        return result;
      }));
  }
  getSecondaryContactDetails(clientid) {

    let body = JSON.stringify({"clientId":clientid});
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetSecondaryContactDetails,body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getHistory()
  {
    // return of(this.history)
  }
  addNewInvoice(dailyLogTimeReport: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post("http://localhost:3000/invoice", body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  upsertSecondaryContact(contactModel: ClientContactModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(contactModel);

    return this.http.post(APIEndpoint+ApiUrls.UpsertSecondaryContactDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getSecondaryContacts(contactModel : ClientContactModel)
  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    
    };
    let body = JSON.stringify(contactModel);
    return this.http.post(APIEndpoint + ApiUrls.GetSecondaryContacts,body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  
  getRoles(roleModel: RoleModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getEntryFormFields(entryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(entryModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEntryFormFiels, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getGroupeRomandeHistory(entryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(entryModel);
    return this.http.post(APIEndpoint + ApiUrls.GetGroupeERomandeHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  updateGroupeRomandeHistory(entryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(entryModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateGroupeRomandeHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getMessageFieldType(entryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(entryModel);
    return this.http.post(APIEndpoint + ApiUrls.GetMessageFieldType, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  upsertMessageFieldType(entryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(entryModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertMessageFieldType, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

}
