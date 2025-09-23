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
const DocAPIEndpoint = environment.documentStorageApiURL;

@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  private UPSERT_FILEUPLOAD_API_PATH = APIEndpoint + "File/FileApi/UpsertFile";
  private UPLOAD_FILE_API_PATH = APIEndpoint + ApiUrls.UploadFile;

  constructor(private http: HttpClient) {}


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

  searchFiles(referenceId, referenceTypeId, referenceTypeName) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };
  
    return this.http
      .get(DocAPIEndpoint+'File/FileApi/SearchFile?referenceTypeId=' + referenceTypeId + '&referenceTypeName=' + referenceTypeName, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchFilesWithoutReferenceTypeName(referenceTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };
  
    return this.http
      .get(DocAPIEndpoint+'File/FileApi/SearchFile?referenceTypeId=' + referenceTypeId, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  archiveFile(fileId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };
  
    const body = {};
    return this.http.delete<any>(DocAPIEndpoint+`File/FileApi/deleteFile?fileId=` + fileId, body)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileName(fileModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);

    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFileName, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  activateAndArchiveFiles(activateAndArchiveFileModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(activateAndArchiveFileModel);

    return this.http.post<any>(DocAPIEndpoint+`File/FileApi/ActivateAndArchiveFiles`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

}
