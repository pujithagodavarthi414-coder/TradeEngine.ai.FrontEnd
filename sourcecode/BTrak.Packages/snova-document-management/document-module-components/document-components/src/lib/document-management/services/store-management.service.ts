import { FolderTreeModel } from './../models/FolderTreeModel';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { FileInputModel } from "../models/file-input-model";
import { FileModel } from '../models/file-model';
import { SearchFolderModel } from '../models/search-folder-model';
import { FolderModel } from '../models/folder-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { SearchFileModel } from '../models/search-file-model';
import { UpsertFileModel } from '../models/upsert-file-model';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SignatureModel } from '../models/signature-model';
import { StoreSearchModel } from '../models/store-search-model';
import { WorkspaceDashboardFilterModel } from '../models/softlabels-model';
import { Dashboard } from '../models/dashboard';
import { StoreModel } from '../models/store-model';
import { Observable } from 'rxjs';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root",
})

export class StoreManagementService {
  constructor(private http: HttpClient) { }

  getFolders(searchFolderModel: SearchFolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(searchFolderModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchFolder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFolder(folderModel: FolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(folderModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertFolder, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileDetails(fileDetails: FileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileDetails);
    return this.http.post(APIEndpoint + ApiUrls.UpsertFileDetails, body, httpOptions)
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

  getFolderDetailsById(folderId: string) {
    const paramsobj = new HttpParams().set("folderId", folderId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetFolderDetailById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFile(fileModel: FileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

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

  
  DeleteFileByReferenceId(deleteFileInputModel: DeleteFileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(deleteFileInputModel);
    return this.http.post(APIEndpoint + ApiUrls.DeleteFileByReferenceId, body, httpOptions)
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

  getStoreConfiguration() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(APIEndpoint + ApiUrls.GetStoreConfiguration, httpOptions)
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
    return this.http.get(APIEndpoint + ApiUrls.IsUsersStore, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFolderDescription(folderModel: FolderModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(folderModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertFolderDescription, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  downloadFile(filePath: string) {
    let paramsobj = new HttpParams().set("filePath", filePath);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  reviewFile(reviewFileDetails: FileInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(reviewFileDetails);
    return this.http.post(APIEndpoint + ApiUrls.ReviewFile, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTreeView(fileInputModel: SearchFolderModel){
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json"}),
    };
    let body = JSON.stringify(fileInputModel);
    return this.http.post(APIEndpoint + ApiUrls.FolderTreeView, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFileName(fileModel: FileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(fileModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertFileName, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  getUsersDropDown(searchText: string) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  
  upsertSignature(signature: SignatureModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(signature);

    return this.http.post(APIEndpoint + ApiUrls.UpsertSignature, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getSignature(signature: SignatureModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(signature);

    return this.http.post(APIEndpoint + ApiUrls.GetSignature, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getStores(storeSearchModel: StoreSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetStores, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
  
	updateDashboardName(dashboardModel: Dashboard){
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this.http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
  }
  
  
	updateworkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this.http.post(APIEndpoint + ApiUrls.UpsertWorkspaceDashboardFilter, body, httpOptions);
	}

  
	getWorkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this.http.post(APIEndpoint + ApiUrls.GetWorkspaceDashboardFilters, body, httpOptions);
	}
  
  upsertStore(storeModel: StoreModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(storeModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertStore, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
