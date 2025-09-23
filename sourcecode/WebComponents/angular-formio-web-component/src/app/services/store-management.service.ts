import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

import { FolderModel } from "../models/folder-model";
import { DeleteFileInputModel } from "../models/delete-file-input-model";
import { UpsertFileModel } from "../models/upsert-file-model";
import { SearchFileModel } from "../models/search-file-model";
import { SearchFolderModel } from "../models/search-folder-model";
import { FileInputModel } from "../models/file-input-model";
import { FileModel } from '../models/file-model';
import { ApiUrls } from '../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';
import { StoreSearchModel } from '../models/store-search-model';
import { StoreModel } from '../models/store-model';
import { environment } from "src/environments/environment.prod";
const APIEndpoint = document.location.hostname == 'localhost' ? 'https://localhost:55224/' : document.location.origin + '/backend/'; //"https://test-btrak515.nxusworld.com/"; //environment.apiURL;
//const DocAPIEndpoint = "https://localhost:62904/";//'https://localhost:44344/'//'https://documentstorageservice.nxusworld.com/'//;
const env = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const DocAPIEndpoint = (env && env.documentStorageApiURL) ? env.documentStorageApiURL : environment.documentStorageApiURL;

@Injectable({
  providedIn: "root",
})

export class StoreManagementService {
  constructor(private http: HttpClient) {
    

   }

  getFolders(searchFolderModel: SearchFolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFolderModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.SearchFolder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFolder(folderModel: FolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(folderModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFolder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileDetails(fileDetails: FileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileDetails);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFileDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFiles(searchFileModel: SearchFileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.SearchFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFilesById(searchFileById: string[]) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFileById);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetFileDetailById, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFolderDetailsById(folderId: string) {
    const paramsobj = new HttpParams().set("folderId", folderId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetFolderDetailById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFile(fileModel: FileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  uploadFromDrive(files) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(files);
    return this.http.post<any>(APIEndpoint + "File/FileApi/UploadFromDrive", body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  // deleteFile(deleteFileInputModel: DeleteFileInputModel) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "application/json" }),
  //   };
  //   let body = JSON.stringify(deleteFileInputModel);
  //   return this.http.post<any>(APIEndpoint + ApiUrls.DeleteFile, body, httpOptions)
  //     .pipe(map(result => {
  //       return result;
  //     }));
  // }

  
  DeleteFileByReferenceId(deleteFileInputModel: DeleteFileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(deleteFileInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.DeleteFileByReferenceId, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  // upsertMultipleFiles(fileModel: UpsertFileModel) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "application/json" }),
  //   };
  //   let body = JSON.stringify(fileModel);
  //   return this.http.post<any>(APIEndpoint + ApiUrls.UpsertMultipleFiles, body, httpOptions)
  //     .pipe(map(result => {
  //       return result;
  //     }));
  // }

  getStoreConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  isUsersStore(folderId) {
    const paramsobj = new HttpParams().set("folderId", folderId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.IsUsersStore, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFolderDescription(folderModel: FolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(folderModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFolderDescription, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  // downloadFile(filePath: string) {
  //   let paramsobj = new HttpParams().set("filePath", filePath);
  //   const httpOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "application/json" }),
  //     params: paramsobj
  //   };
  //   return this.http.get<any>(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
  //     .pipe(map(result => {
  //       return result;
  //     }));
  // }

  // reviewFile(reviewFileDetails: FileInputModel) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "application/json" }),
  //   };
  //   let body = JSON.stringify(reviewFileDetails);
  //   return this.http.post<any>(APIEndpoint + ApiUrls.ReviewFile, body, httpOptions)
  //     .pipe(map(result => {
  //       return result;
  //     }));
  // }

  getTreeView(fileInputModel: SearchFolderModel){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json"}),
    };
    let body = JSON.stringify(fileInputModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.FolderTreeView, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileName(fileModel: FileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);

    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertFileName, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  
  getStores(storeSearchModel: StoreSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeSearchModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetStores, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  
  upsertStore(storeModel: StoreModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertStore, body, httpOptions)
      .pipe(map((result) => {
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
}
