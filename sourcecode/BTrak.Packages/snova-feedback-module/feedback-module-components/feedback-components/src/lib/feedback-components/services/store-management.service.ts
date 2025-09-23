import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { UpsertFileModel } from '../models/upsert-file-model';
import { SearchFileModel } from '../models/search-file-model';
import { ApiUrls } from '../constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root",
})

export class StoreManagementService {
  constructor(private http: HttpClient) { }

  deleteFile(deleteFileInputModel: DeleteFileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(deleteFileInputModel);
    return this.http.post(APIEndpoint + ApiUrls.DeleteFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertMultipleFiles(fileModel: UpsertFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertMultipleFiles, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFiles(searchFileModel: SearchFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFilesById(searchFileById: string[]) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileById);
    return this.http.post(APIEndpoint + ApiUrls.GetFileDetailById, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
