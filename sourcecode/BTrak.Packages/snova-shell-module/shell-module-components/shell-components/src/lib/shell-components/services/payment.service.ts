import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { Observable } from 'rxjs';
import { CompanyPaymentUpsertModel } from '../models/company-payment-model';

@Injectable({ providedIn: "root" })
export class PaymentService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  cancelSubscription() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify({});
    return this.http.post<any>(APIEndpoint + ApiUrls.CancelSubscription, body, httpOptions);
  }

  getAllInvoices(transaction) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var companyPaymentDetails = new CompanyPaymentUpsertModel();
    companyPaymentDetails.TransactionName = transaction;
    let body = JSON.stringify(companyPaymentDetails);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetInvoiceDetails, body, httpOptions);
  }

  getActiveUsersCount() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsObject = new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObject
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetActiveUsersCount, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getPurchasedLicensesCount() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsObject = new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObject
    };
    return this.http
      .get(APIEndpoint + ApiUrls.GetPurchasedLicensesCount, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertCompanyPayments(companyPaymentDetails: CompanyPaymentUpsertModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(companyPaymentDetails);
    return this.http
      .post(APIEndpoint + `Payments/PaymentsApi/UpsertCompanyPayment`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getPaymentHistory() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify({});
    return this.http.post<any>(APIEndpoint + ApiUrls.GetPaymentHistory, body, httpOptions);
}

getAllTransactions(transaction) {
  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  let APIEndpoint = environment.apiURL;
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  var companyPaymentDetails = new CompanyPaymentUpsertModel();
  companyPaymentDetails.TransactionName = transaction;
  let body = JSON.stringify(companyPaymentDetails);
  return this.http.post<any>(APIEndpoint + ApiUrls.GetAllTransactionsDetails, body, httpOptions);
}

}