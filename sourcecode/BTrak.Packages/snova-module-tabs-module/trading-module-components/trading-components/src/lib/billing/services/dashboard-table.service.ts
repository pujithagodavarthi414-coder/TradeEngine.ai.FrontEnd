import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators/map";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})


export class DashboardService {

  constructor(private http: HttpClient) { }


  getProfitLossList(searchModel) {
    let paramsobj = new HttpParams().set('productType', searchModel.productType).set('fromDate', searchModel.fromDate).set('ContractUniqueId', searchModel.contractUniqueId).set('ToDate', searchModel.toDate);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetProfitLossList, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProfitLossListBasedOnInstance(searchModel) {
    let paramsobj = new HttpParams().set('productType', searchModel.productType).set('fromDate', searchModel.fromDate).set('ToDate', searchModel.toDate).set('companyName', searchModel.companyName);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetProfitLossListBasedOnInstance, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProfitLossListForConsolidatedDashboard(searchModel) {
    let paramsobj = new HttpParams().set('productType', searchModel.productType).set('fromDate', searchModel.fromDate).set('ToDate', searchModel.toDate).set('companyName', searchModel.companyName).set('isConsolidated', searchModel.isConsolidated);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetProfitLossConsolidatedDashboard, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUnrealisedProfitLossList(searchModel) {
    let paramsobj = new HttpParams().set('productType', searchModel.productType).set('fromDate', searchModel.fromDate).set('ContractUniqueId', searchModel.contractUniqueId).set('ToDate', searchModel.toDate);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetUnrealisedProfitLossList, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  GetFormFieldValues(searchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(searchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetFormFieldValues, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchCompanies(companyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(companyModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchCompanies, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  getCardValues(searchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(searchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetCardValues, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getDataList(searchModel) {
    let body = JSON.stringify(searchModel);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetDataList + '?productType=' + searchModel.productType + '&ContractUniqueId=' + searchModel.contractUniqueId + '&fromDate=' + searchModel.fromDate + '&ToDate=' + searchModel.toDate, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getContractLevelDashboard(searchModel) {
    let body = JSON.stringify(searchModel);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetContractLevelDashboard + '?productType=' + searchModel.productType + '&ContractUniqueId=' + searchModel.contractUniqueId + '&fromDate=' + searchModel.fromDate + '&ToDate=' + searchModel.toDate + '&companyName=' + searchModel.companyName, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getConsolidatedVesselDashboard(searchModel) {
    let body = JSON.stringify(searchModel);
    let headers = new HttpHeaders().set('Content-Type','application/json' ).set('Access-Control-Allow-Origin', '*' ).set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT' )
    const httpOptions = {
      headers: headers,

    };
    return this.http.get(APIEndpoint + ApiUrls.GetConsolidatedVesselDashboard + '?&fromDate=' + searchModel.fromDate + '&ToDate=' + searchModel.toDate, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getInstanceLevelDashboard(searchModel) {
    let body = JSON.stringify(searchModel);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetInstanceLevelDashboard + '?productType=' + searchModel.productType + '&fromDate=' + searchModel.fromDate + '&ToDate=' + searchModel.toDate + '&companyName=' + searchModel.companyName+ '&isConsolidated=' + searchModel.isConsolidated, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getConsolidatedDashboard(searchModel) {
    let body = JSON.stringify(searchModel);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    };
    return this.http.get(APIEndpoint + ApiUrls.GetConsolidatedDashboard + '?productType=' + searchModel.productType + '&fromDate=' + searchModel.fromDate + '&ToDate=' + searchModel.toDate + '&companyName=' + searchModel.companyName + '&isConsolidated=' + searchModel.isConsolidated, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  updateContractUserQuantity(quantityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(quantityModel);
    return this.http.post(APIEndpoint + ApiUrls.UpdateContractUserQuantity, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getCommodityHeaderValues() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetCommodityHeaderValues, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}