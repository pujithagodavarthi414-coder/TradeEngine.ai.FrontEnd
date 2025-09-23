import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { fileModel } from "../models/file.model";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { FileSearchCriteriaInputModel } from "../models/file-search-criteria-input.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  private UPSERT_FILEUPLOAD_API_PATH = APIEndpoint + "File/FileApi/UpsertFile";

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
