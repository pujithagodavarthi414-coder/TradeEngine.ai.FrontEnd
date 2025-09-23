import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { MerchantModel, ExpenseCategoryModel } from "./models/merchant-model";
import { ExpenseManagementModel, ExpenseStatusModel } from "./models/expenses-model";
import { Observable } from 'rxjs';
import { Currency } from './models/currency';
import { CurrencyModel } from './models/currency-model';
import { ApiUrls } from './constants/api-urls';
import { LocalStorageProperties } from './constants/localstorage-properties';
import { Branch } from './models/branch';
import { UserModel } from './models/user';
import { CustomFormFieldModel } from './models/custom-field-model';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class ExpenseManagementService {
  constructor(private http: HttpClient) { }

  searchExpenses(expensesSearchModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expensesSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchExpenses, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchExpenseHistory(expensesSearchModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expensesSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchExpenseHistory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertFormType(upsertExpenseModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(upsertExpenseModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertExpense, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchMerchants(merchantsSearchModel: MerchantModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantsSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchMerchants, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchExpenseCategories(expenseCategoriesSearchModel: ExpenseCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoriesSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchExpenseCategories, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertExpense(expenseDetailsModel: ExpenseManagementModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertExpense, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  approveOrRejectExpense(expenseDetailsModel: ExpenseManagementModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.ApproveOrRejectExpense, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMultipleExpenses(expenseDetailsModel: ExpenseManagementModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.AddMultipleExpenses, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertExpenseCategory(expenseCategoryModel: ExpenseCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expenseCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertExpenseCategory, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertMerchant(merchantModel: MerchantModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(merchantModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertMerchant, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  downloadOrSendPdfExpense(expenseModel: ExpenseManagementModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(expenseModel);
    return this.http.post(APIEndpoint + ApiUrls.DownloadOrSendPdfExpense, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetUserBranchDetails(expensesSearchModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(expensesSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetUserBranchDetails, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  
  getCurrencyList(): Observable<Currency[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let currencyModel = new CurrencyModel();
    currencyModel.isArchived = false;
    let body = JSON.stringify(currencyModel);
    return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBranchList(branchSearchResult: Branch): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getBranchDropdown(branchSearchResult: Branch): Observable<Branch[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranchesDropdown, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllUsers(userModel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  approvePendingExpenses() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    return this.http.post(APIEndpoint + ApiUrls.ApprovePendingExpenses, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getExpenseStatuses(expenseSttausModel: ExpenseStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(expenseSttausModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchExpenseStatuses, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadSelectedExpenses(expenseDetailsModel: ExpenseManagementModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(expenseDetailsModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchExpenseDownloadDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
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
