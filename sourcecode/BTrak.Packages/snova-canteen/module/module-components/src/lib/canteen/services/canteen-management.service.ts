import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

import { FoodItemSearchInputModel } from "../models/canteen-food-item-search-input-model";
import { CanteenCreditSearchInputModel } from "../models/canteen-credit-search-input-model";
import { CanteenCreditModel } from "../models/canteen-credit-model";
import { FoodItemModel } from "../models/canteen-food-item-model";
import { CanteenPurchaseItemModel } from "../models/canteen-purchase-item-model";
import { CanteenPurchaseItemSearchModel } from "../models/canteen-purchase-item-search-model";
import { CanteenBalanceSearchInputModel } from "../models/canteen-balance-search-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { Currency } from '../models/currency';
import { CurrencyModel } from '../models/currency-model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class CanteenManagementService {
    
    constructor(private http: HttpClient) { }

    upsertCanteenFoodItem(foodItemModel: FoodItemModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(foodItemModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCanteenFoodItem, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchFoodItems(foodItemSearchInputModel: FoodItemSearchInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(foodItemSearchInputModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchFoodItems, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertCanteenCredit(canteenCreditModel: CanteenCreditModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenCreditModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCanteenCredit, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchCanteenCredit(canteenCreditSearchInputModel: CanteenCreditSearchInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenCreditSearchInputModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchCanteenCredit, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertCanteenPurchaseItem(canteenPurchaseItemModel: CanteenPurchaseItemModel[]) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenPurchaseItemModel);
        return this.http.post(APIEndpoint + ApiUrls.PurchaseCanteenItem, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchCanteenPurchaseItem(canteenPurchaseItemSearchModel: CanteenPurchaseItemSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenPurchaseItemSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchCanteenPurchases, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    searchMyCanteenPurchases(canteenPurchaseItemSearchModel: CanteenPurchaseItemSearchModel)
    {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenPurchaseItemSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetUserCanteenPurchases, body, httpOptions)
            .pipe(map(result => {
                return result;
            })); 
    }

    searchCanteenBalance(canteenBalanceSearchInputModel: CanteenBalanceSearchInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(canteenBalanceSearchInputModel);
        return this.http.post(APIEndpoint + ApiUrls.SearchCanteenBalance, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getMyCanteenBalance() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(APIEndpoint + ApiUrls.GetMyCanteenBalance, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEntityDropDown(searchText) {
        let paramsobj = new HttpParams().set('searchText', searchText);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
            params: paramsobj
        };

        return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
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
    getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getsoftLabelById(softLabelId: string) {
        let paramsObj = new HttpParams().set("softLabelId", softLabelId);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsObj
        };

        return this.http
            .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
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

    getUsersDropDown(searchText: string) {
        let paramsobj = new HttpParams().set('searchText', searchText);
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
          params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
}