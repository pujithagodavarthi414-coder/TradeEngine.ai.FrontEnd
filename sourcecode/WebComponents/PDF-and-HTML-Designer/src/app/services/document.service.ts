import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { environment } from 'src/environments/environment.prod';

const env = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = env && env.apiURL ? env.apiURL :environment.apiURL;
const pdfDesignerApiUrl = env && env.pdfDesignerApiUrl ? env.pdfDesignerApiUrl :environment.pdfDesignerApiUrl;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private Backbutton = new Subject<any>();
  Backbutton$ = this.Backbutton.asObservable();
  private Get_All_IntroducedByOptions = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private GetUsersBasedonRole = APIEndpoint + "GenericForm/GenericFormApi/GetUsersBasedonRole";


  private editdocument = new Subject<any>();
  editdocument$ = this.editdocument.asObservable();
  constructor(private http: HttpClient) { }


  getTreeData(id: string) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    // return this.http.get(`https://localhost:44394/api/FormMenu/GetTreeFormDetails`);
    return this.http.get(`${pdfDesignerApiUrl}PDFDocumentEditor/PDFMenuDataSetApi/GetAllPDFMenuDataSet?templateId=${id}`, httpOptions);
  }

  notifyCallback(data: boolean) {
    this.Backbutton.next(data)
  }

  notifyeditdocument(data: any) {
    this.editdocument.next(data)
  }

  getgriddata(isArchived: boolean, searchText: string) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.get(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/GetAllHTMLDataSet?IsArchived=${isArchived}&SearchText=${searchText ? searchText : ''}`, httpOptions);
  }

  saveTemplate(templateDetails: any) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/InsertHTMLDataSet`, templateDetails, httpOptions)
  }

  HtmlPreview(fileurl: any,) {
    const body = {
      "sfdtString": fileurl,
      "filetype": ".html"
    }
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/FileConvertionApi/PreviewFileHTML`, body, httpOptions)
  }

  updateTemplate(templateDetails) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/UpdateHTMLDataSetById`, templateDetails, httpOptions)
  }

  gethtmlBlob(bloburl: any, filetype: any, filename: any) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/FileConvertionApi/ConvertSFDTToHTMLBlob?blobPath=${bloburl}&filetype=${filetype}&filename=${filename}`, {}, httpOptions);
  }

  gethtmlconvertion(bloburl: any, filetype: any, filename: any) {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.get<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/FileConvertionApi/ConvertSFDTToHTML?blobPath=${bloburl}&filetype=${filetype}&filename=${filename}`, httpOptions);
  }

  getpdfBlob(bloburl: any, filetype: any, filename: any) {
    
    const httpOptions = {

      headers: new HttpHeaders({
        "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}ConvertHTMLToPDF?blobPath=${bloburl}&filetype=${filetype}&filename=${filename}`, {}, httpOptions);
  }

  uploadFileUrl(file: any, chunkNumber: any, moduleTypeId: any, fileName: any, contentType: any, parentDocumentId: any) {
    let APIUrlEndpoint = environment.documentStoregeApiURL;
    let body
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data", Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFQjQwM0ExNjNFQ0JBNkNFQjVERDM4ODZGOTJDRjVGIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2Mzg1MzUxNzgsImV4cCI6MTYzODU0MjM3OCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eXNlcnZpY2Uubnh1c3dvcmxkLmNvbSIsImNsaWVudF9pZCI6Ijg1NEMzMDJFLTFGNkQtNDI3Qy1CRTJBLUQ3OEVGNEExQjY4QSA0REJENEFERi0wNjM1LTREQzgtQkZBQS1DMDdDNTg1RERFQ0UiLCJqdGkiOiI4NThGMzNCMTRFNTkzQ0FGRDAxNTY1OTI3NTAyMUEyNCIsImlhdCI6MTYzODUzNTE3OCwic2NvcGUiOlsiNERCRDRBREYtMDYzNS00REM4LUJGQUEtQzA3QzU4NURERUNFIl19.ZLE8bORUexbjNT5cYiQO-NvaWCF64ZgWCJv26AAQoxJeVj4PjSDkabqTXAcBqqFcKhIf4xy45pfgWcuh3CXS0T1morFXT7kIWil164QLnAtc_KkEcaNtsjAT3Z8f54RY38blJmFpNCE96jNwr7lXto4TmU8El88PnG2V0iX8x0XKq57PvSojfj2l_WoWznBG_dHAfCg24IdnvC32b-RRPC7fBYER-cr8A92DBEARwGA-0e2q5TErGt303tnNMeI-JRw2G0KzsIe3TN9bL78wZz4gX35QZYid-jvpWRyPvFcOVWfGXGmFMBvuOA3pAgNhmp22QRa3yoAaOSE" })
    };
    return this.http
      .post(`${APIUrlEndpoint}File/FileApi/UploadFileChunks?chunkNumber=` + chunkNumber + '&&moduleTypeId=' + moduleTypeId + '&&fileName=' + fileName + '&&contentType=' + contentType, file, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getBlobUrl(moduleTypeId: any, fileName: any, chunkList: any, contentType: any, parentDocumentId: any) {

    let APIUrlEndpoint = environment.documentStoregeApiURL;

    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data", Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFQjQwM0ExNjNFQ0JBNkNFQjVERDM4ODZGOTJDRjVGIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2Mzg1MzUxNzgsImV4cCI6MTYzODU0MjM3OCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eXNlcnZpY2Uubnh1c3dvcmxkLmNvbSIsImNsaWVudF9pZCI6Ijg1NEMzMDJFLTFGNkQtNDI3Qy1CRTJBLUQ3OEVGNEExQjY4QSA0REJENEFERi0wNjM1LTREQzgtQkZBQS1DMDdDNTg1RERFQ0UiLCJqdGkiOiI4NThGMzNCMTRFNTkzQ0FGRDAxNTY1OTI3NTAyMUEyNCIsImlhdCI6MTYzODUzNTE3OCwic2NvcGUiOlsiNERCRDRBREYtMDYzNS00REM4LUJGQUEtQzA3QzU4NURERUNFIl19.ZLE8bORUexbjNT5cYiQO-NvaWCF64ZgWCJv26AAQoxJeVj4PjSDkabqTXAcBqqFcKhIf4xy45pfgWcuh3CXS0T1morFXT7kIWil164QLnAtc_KkEcaNtsjAT3Z8f54RY38blJmFpNCE96jNwr7lXto4TmU8El88PnG2V0iX8x0XKq57PvSojfj2l_WoWznBG_dHAfCg24IdnvC32b-RRPC7fBYER-cr8A92DBEARwGA-0e2q5TErGt303tnNMeI-JRw2G0KzsIe3TN9bL78wZz4gX35QZYid-jvpWRyPvFcOVWfGXGmFMBvuOA3pAgNhmp22QRa3yoAaOSE" })
    };

    const body = {};
    return this.http
      .post(`${APIUrlEndpoint}File/FileApi/GetChunkBlobUrl?fileName=` + fileName + '&&moduleTypeId=' + moduleTypeId + '&&list=' + chunkList + '&&contentType=' + contentType, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  importfromurl(fileurl: any, contenttype: any) {
    
    const httpOptions = {

      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = {
      "fileUrl": fileurl,
      "content": contenttype
    }
    return this.http.post(`${pdfDesignerApiUrl}PDFDocumentEditor/ImportFileURL`, body, httpOptions)
  }

  deletehtml(id: any, status: boolean) {
    const body = {
      "_id": id,
      "status": status
    }
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/RemoveHTMLDataSetById`, body, httpOptions)
  }

  enablehtml(id: any, status: boolean) {
    const body = {
      "_id": id,
      "status": status
    }
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/RemoveHTMLDataSetById`, body, httpOptions)
  }

  saveDataSource(dataSourceDetails: any,) {

    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.post<any>(`${pdfDesignerApiUrl}PDFDocumentEditor/HTMLDataSetApi/SaveDataSource`, dataSourceDetails, httpOptions)
  }

  getAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
    let body = JSON.stringify(data);

    return this.http.post(this.Get_All_IntroducedByOptions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUsersBasedonRole() {
    
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    // return this.http.get(`https://localhost:44394/api/FormMenu/GetTreeFormDetails`);
    return this.http.get(this.GetUsersBasedonRole+'?roles=' , httpOptions);
  }

}

