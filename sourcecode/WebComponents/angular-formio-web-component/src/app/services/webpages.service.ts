import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
const env = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = (env && env.apiURL) ? env.apiURL : environment.apiURL;
const pdfDesignerApiUrl = (env && env.pdfDesignerApiUrl) ?  env.pdfDesignerApiUrl : environment.pdfDesignerApiUrl;;

@Injectable({
    providedIn: "root"
})

export class WebPagesService {

    constructor(private http: HttpClient) { }
    private GetAllPdfTemplates = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GetAllHTMLDataSet';
    private GetPdfTemplatesById = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GetHTMLDataSetById';
    private SaveWebPageView = APIEndpoint + 'DataService/DataSetApi/SaveWebPageView';
    private GetWebPageView = APIEndpoint + 'DataService/DataSetApi/GetWebPageView';
    private GenerateWebTemplate = pdfDesignerApiUrl + "PDFDocumentEditor/HTMLDataSetApi/GenerateWebTemplate";
    private GenerateWebTemplateUnAuth = pdfDesignerApiUrl + "PDFDocumentEditor/HTMLDataSetApi/GenerateWebTemplateUnAuth";
    private TriggerWorkflow = APIEndpoint +"GenericForm/GenericFormApi/TriggerWorkFlow";
    
    getPdfTemplates(searchText) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetAllPdfTemplates}`+'?IsArchived='+false+'&SearchText='+searchText, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getPdfTemplatesById(id) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
      return this.http.get(`${this.GetPdfTemplatesById}?id=${id}`,httpOptions);
    }

    saveWebPageView(saveWebPageModel) {
        const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
                headers: new HttpHeaders({ "Content-Type": "application/json"}),
                params: paramsobj
            };
            return this.http.get(`${this.GetWebPageView}`, httpOptions)
            .pipe(
              map(result => {
                return result;
              })
            );
    } 

    generateWebTemplate(inputModel) {
      const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
  let body = JSON.stringify(inputModel);
  return this.http.post(this.GenerateWebTemplate,body, httpOptions)
    .pipe(map(result => {
      return result;
    }));
  }

  generateWebTemplateUnAuth(inputModel) {
    const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
let body = JSON.stringify(inputModel);
return this.http.post(this.GenerateWebTemplateUnAuth,body, httpOptions)
  .pipe(map(result => {
    return result;
  }));
}

  triggerWorkflow(inputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(inputModel);
    return this.http.post(this.TriggerWorkflow, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}