import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { environment } from '../../../../environments/environment';
import { Branch } from '../models/branch';
import { ProductDetails } from '../models/product-details';
import { Product } from '../models/product';
import { Assets } from '../models/asset';
import { Currency } from '../models/currency';
import { AssetInputModel } from '../models/asset-input-model';
import { ApiUrls } from '../constants/api-urls';
import { CurrencyModel } from '../models/currency-model';
import { PrintAssetsModel } from '../models/print-assets-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: 'root',
})

export class AssetService {
  constructor(private http: HttpClient) { }

  getCurrencyList(): Observable<Currency[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(branchSearchResult);
    return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProductList(productInputSearch: Product): Observable<Product[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productInputSearch);
    return this.http.post<Product[]>(APIEndpoint + ApiUrls.GetAllProducts, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProductDetailsList(productDetailsInputSearch: ProductDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productDetailsInputSearch);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.SearchProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertProduct(productModel: Product) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(productModel);
    return this.http.post<Product[]>(APIEndpoint + ApiUrls.UpsertProduct, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertProductDetails(productDetailsModel: ProductDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(productDetailsModel);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.UpsertProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertAssetDetails(assetDetailsModel: Assets) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetDetailsModel);
    return this.http.post<Assets[]>(APIEndpoint + ApiUrls.UpsertAsset, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllAssets(assetsInputModel: AssetInputModel): Observable<AssetInputModel[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.SearchAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAssetById(assetsInputModel: AssetInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.SearchAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAssetsCount(assetsInputModel: AssetInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(assetsInputModel);
    return this.http.post<AssetInputModel[]>(APIEndpoint + ApiUrls.GetAssetsCount, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchProductDetailsList(productDetailsById: ProductDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(productDetailsById);
    return this.http.post<ProductDetails[]>(APIEndpoint + ApiUrls.SearchProductDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  printAssets(printAssetsModel: PrintAssetsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(printAssetsModel);
    return this.http.post(APIEndpoint + ApiUrls.PrintAssets, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
