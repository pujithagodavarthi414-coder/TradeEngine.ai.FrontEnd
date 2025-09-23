import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VendorManagement } from '../models/vendor-management';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})
export class VendorManagementService {
  constructor(private http: HttpClient) { }

  getAllSuppliersList(vendorManagementModel: VendorManagement): Observable<VendorManagement[]> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(vendorManagementModel);

    return this.http.post<VendorManagement[]>(APIEndpoint + ApiUrls.SearchSupplier, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertSupplier(vendorModel: VendorManagement) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(vendorModel);

    return this.http.post<VendorManagement[]>(APIEndpoint + ApiUrls.UpsertSupplier, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}