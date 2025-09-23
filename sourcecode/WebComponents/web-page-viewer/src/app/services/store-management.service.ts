import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";

const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224/' : document.location.origin + '/backend/'; //"https://test-btrak515.nxusworld.com/"; //environment.apiURL;
// const DocAPIEndpoint = "https://documentstorage.nxcore.nxusworld.com/";//'https://localhost:44344/'//'https://documentstorageservice.nxusworld.com/'//;
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const DocAPIEndpoint = environment.documentStorageApiURL;

@Injectable({
  providedIn: "root",
})

export class StoreManagementService {
  constructor(private http: HttpClient) { }
  searchFiles(referenceId, referenceTypeId, referenceTypeName) {

    // let APIEndpoint = environment.apiURL;
  
    const httpOptions = {
  
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
  
    };
  
    const body = {};
    var url = "";
    if(referenceTypeName) {
      url = `File/FileApi/SearchFile?referenceId=` + referenceId + '&referenceTypeId=' + referenceTypeId + '&referenceTypeName=' + referenceTypeName;
    } else {
      if(referenceId != null) {
        url = `File/FileApi/SearchFile?referenceId=` + referenceId + '&referenceTypeId=' + referenceTypeId;
      } else {
        url = `File/FileApi/SearchFile?referenceTypeId=` + referenceTypeId;
      }
    }
  
    // .get(DocAPIEndpoint+`File/FileApi/SearchFile?referenceId=` + referenceId + '&referenceTypeId=' + referenceTypeId + '&referenceTypeName=' + referenceTypeName, body)
    return this.http
      .get(DocAPIEndpoint+url, body)
      .pipe(
        map(result => {
          return result;
        })
      );
  
  }
  upsertMultipleFiles(files) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(files);
    return this.http
  
      .post(DocAPIEndpoint+`File/FileApi/UpsertMultipleFiles`, body, httpOptions)
  
      .pipe(
  
        map(result => {
  
          return result;
  
        })
  
      );
  
  }
  getStoreConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  deleteFile(fileId) {
    const httpOptions = {
  
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
  
    };
  
    const body = {};
    return this.http.delete<any>(DocAPIEndpoint+`File/FileApi/deleteFile?fileId=` + fileId, body)
      .pipe(map(result => {
        return result;
      }));
  }
  downloadFile(filePath: string) {
    let paramsobj = new HttpParams().set("filePath", filePath);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(DocAPIEndpoint+`File/FileApi/downloadFile?filePath=` + filePath)
      .pipe(map(result => {
        return result;
      }));
  }
  uploadFileUrl(file, chunkNumber, moduleTypeId, fileName, contentType, parentDocumentId) {
    // let APIEndpoint = environment.apiURL
    let body
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
  
    };
    return this.http
  
      .post(DocAPIEndpoint+`File/FileApi/UploadFileChunks?chunkNumber=` + chunkNumber + '&&moduleTypeId=' + moduleTypeId + '&&fileName=' + fileName + '&&contentType=' + contentType, file, httpOptions)
  
      .pipe(
  
        map(result => {
  
          return result;
  
        })
  
      );
  
  }
  getBlobUrl(moduleTypeId, fileName, chunkList, contentType, parentDocumentId) {

    // let APIEndpoint = environment.apiURL;
  
    const httpOptions = {
  
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
  
    };
  
    const body = {};
  
    return this.http
  
      .post(DocAPIEndpoint+`File/FileApi/GetChunkBlobUrl?fileName=` + fileName + '&&moduleTypeId=' + moduleTypeId + '&&list=' + chunkList + '&&contentType=' + contentType, body)
  
      .pipe(
  
        map(result => {
  
          return result;
  
        })
  
      );
  
  }
 
}
