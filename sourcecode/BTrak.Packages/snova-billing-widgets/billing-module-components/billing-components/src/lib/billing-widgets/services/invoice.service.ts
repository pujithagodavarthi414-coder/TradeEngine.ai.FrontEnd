import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CustomFormFieldModel, InvoiceInputModel } from '../models/invoice-input-model';
import { InvoiceOutputModel } from '../models/invoice-output-model';
import { InvoiceGoalModel } from '../models/invoice-goal-model';
import { InvoiceProjectModel } from '../models/invoice-project-model';
import { InvoiceItemModel } from '../models/invoice-item-model';
import { InvoiceTaskModel } from '../models/invoice-task-model';
import { InvoiceTaxModel } from '../models/invoice-tax-model';
import { InvoiceLogPayment } from '../models/invoice-log-payment.model';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].ProductID === item.ProductID) {
      return idx;
    }
  }

  return -1;
};

@Injectable({
  providedIn: 'root',
})

export class InvoiceService {
  EditClient: Boolean

  data: any[] = [];
  originalData: any[] = [];
  createdItems: any[] = [];
  updatedItems: any[] = [];
  deletedItems: any[] = [];

  private UPSERT_USER_API_PATH = APIEndpoint + "User/UsersApi/UpsertUser";
  constructor(private http: HttpClient) {
  }

  getClientInvoice(client: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/GetClientInvoice', client, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoices(invoice: InvoiceInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoice);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoices, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceHistory(invoice: InvoiceInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoice);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceStatuses(invoice: InvoiceInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoice);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceStatuses, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  upsertInvoice(invoices: InvoiceOutputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(invoices);
    return this.http.post(APIEndpoint + ApiUrls.UpsertInvoice, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadOrSendPdfInvoice(invoices: InvoiceOutputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(invoices);
    return this.http.post(APIEndpoint + ApiUrls.DownloadOrSendPdfInvoice, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAccountTypes(IinvoiceLogPayment: InvoiceLogPayment) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(IinvoiceLogPayment);
    return this.http.post(APIEndpoint + ApiUrls.GetAccountTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  insertInvoiceLogPayment(invoiceLogPayment: InvoiceLogPayment) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(invoiceLogPayment);
    return this.http.post(APIEndpoint + ApiUrls.InsertInvoiceLogPayment, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getInvoiceGoals(invoiceGoals: InvoiceGoalModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoiceGoals);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceGoals, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceItems(invoiceItems: InvoiceItemModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoiceItems);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceItems, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceTasks(invoiceTasks: InvoiceTaskModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoiceTasks);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetInvoiceTasks, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceProjects(invoiceProjects: InvoiceProjectModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoiceProjects);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceProjects, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceTax(invoiceTax: InvoiceTaxModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    let body = JSON.stringify(invoiceTax);
    return this.http.post(APIEndpoint + ApiUrls.GetInvoiceTax, body, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getInvoiceStatus(invoice: any): Observable<any> {
    ;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/GetInvoiceStatus', invoice, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getRecentInvoice(invoice: any): Observable<any> {
    ;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/GetRecentInvoices', invoice, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }
  multipleInvoiceDelete(invoice: any): Observable<any> {
    ;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/MultipleInvoiceDelete', invoice, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getProjectsOfClient(invoice: any): Observable<any> {
    ;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/MultipleInvoiceDelete', invoice, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  getProjectGoals(invoice: any): Observable<any> {
    ;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    ;
    return this.http.post<any>(APIEndpoint + 'BillingManagement/InvoiceManagementApi/MultipleInvoiceDelete', invoice, httpOptions)
      .pipe(map(result => {
        return result;
      }))
  }

  public hasChanges(): boolean {
    return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
  }

  public remove(item: any): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    //super.next(this.data);
  }

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    const completed = [];
    // if (this.deletedItems.length) {
    //     completed.push(this.fetch(REMOVE_ACTION, this.deletedItems));
    // }

    // if (this.updatedItems.length) {
    //     completed.push(this.fetch(UPDATE_ACTION, this.updatedItems));
    // }

    // if (this.createdItems.length) {
    //     completed.push(this.fetch(CREATE_ACTION, this.createdItems));
    // }

    // this.reset();

    // zip(...completed).subscribe(() => this.read());
  }

  searchCustomFields(searchCustomField : any) {
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
}