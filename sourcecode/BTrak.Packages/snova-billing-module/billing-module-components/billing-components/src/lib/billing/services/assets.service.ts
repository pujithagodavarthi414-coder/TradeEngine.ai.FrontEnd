import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductDetails } from '../models/product-details';
import { Product } from '../models/product';
import { Assets } from '../models/asset';
import { Currency } from '../models/currency';
import { AssetInputModel } from '../models/asset-input-model';
import { PrintAssetsModel } from '../models/print-assets-model';
import { ApiUrls } from '../constants/api-urls';
import { Branch } from '../models/branch';
import { CurrencyModel } from '../models/currency-model';
import { LocalStorageProperties } from '../constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class AssetService {
  constructor(private http: HttpClient) { }

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

  getProductList(productInputSearch: Product): Observable<Product[]> {
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
