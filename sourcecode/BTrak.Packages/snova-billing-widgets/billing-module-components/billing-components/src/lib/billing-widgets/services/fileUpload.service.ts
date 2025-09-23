import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { fileModel } from "../models/fileModel";
import { FileSearchCriteriaInputModel } from "../models/fileSearchCriteriaInputModel";
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { Observable } from "rxjs";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  private UPSERT_FILEUPLOAD_API_PATH = APIEndpoint + "File/FileApi/UpsertFile";
  private UPLOAD_FILE_API_PATH = APIEndpoint + ApiUrls.UploadFile;

  constructor(private http: HttpClient) {}

  UpsertFile(fileModel: fileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(fileModel);
    return this.http
      .post<any>(`${this.UPSERT_FILEUPLOAD_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UploadFile(formData, moduleTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchUploadedFiles(fileSearchCriteriaModel:FileSearchCriteriaInputModel){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(fileSearchCriteriaModel);
    return this.http
      .post<any>(`${APIEndpoint + ApiUrls.SearchFile}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  employeeUpload(empList) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(empList);
    return this.http
      .post(`${APIEndpoint + ApiUrls.EmployeeUpload}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

}
