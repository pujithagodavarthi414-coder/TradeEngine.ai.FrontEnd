import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from "../constants/localstorage-properties";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const pdfHtmlAddress = "https://pdfhtml.sgt1dev.nxusworld.com/";
// const pdfHtmlAddress = "https://localhost:55848/";
//const APIEndpoint ="http://localhost:55260/";


@Injectable({
    providedIn: "root"
})

export class WebPagesService {

    constructor(private http: HttpClient) { }
    private GetAllPdfTemplates = pdfHtmlAddress + 'PDFDocumentEditor/HTMLDataSetApi/GetAllHTMLDataSet';
    private GetPdfTemplatesById = pdfHtmlAddress + 'PDFDocumentEditor/HTMLDataSetApi/GetHTMLDataSetById';
    private SaveWebPageView = APIEndpoint + 'DataService/DataSetApi/SaveWebPageView';
    private GetWebPageView = APIEndpoint + 'DataService/DataSetApi/GetWebPageView';
    
    getPdfTemplates(searchText) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetAllPdfTemplates}`+'?IsArchived='+false+'&SearchText='+searchText, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    getgriddata(id) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" , Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJDREQ2RkIzMUY0MEE5REFCNjZEQTlDOTM1NzhCNEFFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NjM2NTU2MjQsImV4cCI6MTY2MzY2MjgyNCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1ODMwMyIsImNsaWVudF9pZCI6Ijg0MDU0OTRGLTRCQkEtNDk2Qi05RTc3LTJDQkJFMzA4RjgzNCAzM0YzNEQ3Ny0yNjExLTRERTctQkExOS0xN0IzRDRBODFCNDYiLCJqdGkiOiIxNzZCRTJGNEU2MjVFQ0IzQjEzNzNERTg5M0M3OTY1MiIsImlhdCI6MTY2MzY1NTYyNCwic2NvcGUiOlsiMzNGMzRENzctMjYxMS00REU3LUJBMTktMTdCM0Q0QTgxQjQ2Il19.BF-pUV7ncqBHk0qrdxqNGc4U1nlBD1OhgeuQQ15UEX7SV2zJc2cTXjP15JU3unsxMQeJScxTc40CNld8JuG8gFfQc5mHYNyVylgBuaiCUDiII3IuiqncrGS3JndXfhm5tSRdq9y5jys7emAtWjAtfCWQeUH-_aA4xYwXhbHjjNUtNHBNc1RyZgDfw6mERaH1vr3aA37cif0Tj3Hr-rO74_HoFG5ycwCTMGzcu3MiKzYtDkMNwrnR2V2p_E085LgSJVHIa4Czoz080Q6Tk9_os1kixuCTxXEgdPjClPT0sA68OfKt6C2d-yWJIyHIXwyYzI7GGRuvltRK33CpFezzBA"})
      };
      return this.http.get(`${this.GetPdfTemplatesById}?id=${id}`,httpOptions);
    }
    saveWebPageView(saveWebPageModel) {
        const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJDREQ2RkIzMUY0MEE5REFCNjZEQTlDOTM1NzhCNEFFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NjM2NTU2MjQsImV4cCI6MTY2MzY2MjgyNCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1ODMwMyIsImNsaWVudF9pZCI6Ijg0MDU0OTRGLTRCQkEtNDk2Qi05RTc3LTJDQkJFMzA4RjgzNCAzM0YzNEQ3Ny0yNjExLTRERTctQkExOS0xN0IzRDRBODFCNDYiLCJqdGkiOiIxNzZCRTJGNEU2MjVFQ0IzQjEzNzNERTg5M0M3OTY1MiIsImlhdCI6MTY2MzY1NTYyNCwic2NvcGUiOlsiMzNGMzRENzctMjYxMS00REU3LUJBMTktMTdCM0Q0QTgxQjQ2Il19.BF-pUV7ncqBHk0qrdxqNGc4U1nlBD1OhgeuQQ15UEX7SV2zJc2cTXjP15JU3unsxMQeJScxTc40CNld8JuG8gFfQc5mHYNyVylgBuaiCUDiII3IuiqncrGS3JndXfhm5tSRdq9y5jys7emAtWjAtfCWQeUH-_aA4xYwXhbHjjNUtNHBNc1RyZgDfw6mERaH1vr3aA37cif0Tj3Hr-rO74_HoFG5ycwCTMGzcu3MiKzYtDkMNwrnR2V2p_E085LgSJVHIa4Czoz080Q6Tk9_os1kixuCTxXEgdPjClPT0sA68OfKt6C2d-yWJIyHIXwyYzI7GGRuvltRK33CpFezzBA" })
		  };
		let body = JSON.stringify(saveWebPageModel);
		return this.http.post(this.SaveWebPageView,body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
    }
    getWebPageView(webPageModel) {
            let paramsobj = new HttpParams().set("path", webPageModel.path);
            const httpOptions = {
                headers: new HttpHeaders({ "Content-Type": "application/json", Authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjJDREQ2RkIzMUY0MEE5REFCNjZEQTlDOTM1NzhCNEFFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NjM2NTU2MjQsImV4cCI6MTY2MzY2MjgyNCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1ODMwMyIsImNsaWVudF9pZCI6Ijg0MDU0OTRGLTRCQkEtNDk2Qi05RTc3LTJDQkJFMzA4RjgzNCAzM0YzNEQ3Ny0yNjExLTRERTctQkExOS0xN0IzRDRBODFCNDYiLCJqdGkiOiIxNzZCRTJGNEU2MjVFQ0IzQjEzNzNERTg5M0M3OTY1MiIsImlhdCI6MTY2MzY1NTYyNCwic2NvcGUiOlsiMzNGMzRENzctMjYxMS00REU3LUJBMTktMTdCM0Q0QTgxQjQ2Il19.BF-pUV7ncqBHk0qrdxqNGc4U1nlBD1OhgeuQQ15UEX7SV2zJc2cTXjP15JU3unsxMQeJScxTc40CNld8JuG8gFfQc5mHYNyVylgBuaiCUDiII3IuiqncrGS3JndXfhm5tSRdq9y5jys7emAtWjAtfCWQeUH-_aA4xYwXhbHjjNUtNHBNc1RyZgDfw6mERaH1vr3aA37cif0Tj3Hr-rO74_HoFG5ycwCTMGzcu3MiKzYtDkMNwrnR2V2p_E085LgSJVHIa4Czoz080Q6Tk9_os1kixuCTxXEgdPjClPT0sA68OfKt6C2d-yWJIyHIXwyYzI7GGRuvltRK33CpFezzBA" }),
                params: paramsobj
            };
            return this.http.get(`${this.GetWebPageView}`, httpOptions)
            .pipe(
              map(result => {
                return result;
              })
            );
    }
}