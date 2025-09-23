import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

import { CustomApplicationWorkflowModel } from "../models/custom-application-workflow";
import { Observable } from "rxjs/Observable";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../../audits/dependencies/constants/api-urls';
import { Persistance } from '../../../audits/dependencies/models/persistance.model';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})

export class GenericFormService {

    constructor(private http: HttpClient) { }
    private Get_Form_Types = APIEndpoint + 'GenericForm/GenericFormApi/GetFormTypes';
  

    GetSubmittedReportsByFormId(customApplicationId: any, formId: any, userId: any = null, isArchived: any = null) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId, IsArchived: isArchived };
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    

    importValidatedAppData(appImportData: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(appImportData);
        return this.http.post(APIEndpoint + ApiUrls.ImportVerifiedApplication, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    ImportFormDataFromExcel(formData, customAppId) {
        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };
        return this.http
            // tslint:disable-next-line: max-line-length
            .post(`${APIEndpoint + ApiUrls.ImportFormDataFromExcel}?applicationId=` + customAppId, formData, httpOptions)
            .pipe(
                map((result) => {
                    return result;
                })
            );
    }

    getPublicCustomApplication(customApplication: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(customApplication);

        return this.http.post(APIEndpoint + ApiUrls.GetPublicCustomApplicationById, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }



    getCustomApplicationWorkflow(customApplicationWorkflowModel: CustomApplicationWorkflowModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationWorkflowModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplicationWorkflow, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    

   

    getWorkflowHumanTasks(definitionKey) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(`${APIEndpoint + ApiUrls.GetHumanTaskList}?processDefinitionKey=` + definitionKey, httpOptions)

    }

    updateUserTask(taskId, isApproved) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.post(`${APIEndpoint + ApiUrls.CompleteUserTask}?taskId=` + taskId + "&isApproved=" + isApproved, httpOptions)
    }


    getGenericFormSubmittedData(customApplicationId: any, formId: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(`${APIEndpoint + ApiUrls.GenericFormSubmittedData}` +
            "?customApplicationId=" + customApplicationId + "&formId=" + formId, httpOptions)
    }


    GetFormTypes() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.get(`${this.Get_Form_Types}`, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    UpsertPersistance(inputModel: Persistance) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(inputModel);

        return this.http.post(APIEndpoint + ApiUrls.UpdatePersistance, body, httpOptions);
	}
	
	GetPersistance(searchModel: Persistance) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        let body = JSON.stringify(searchModel);

        return this.http.post(APIEndpoint + ApiUrls.GetPersistance, body, httpOptions);
    }

    
    getCustomApplicationWorkflowTypes() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.get(APIEndpoint + ApiUrls.GetCustomApplicationWorkflowTypes, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    upsertCustomApplicationWorkflow(customApplicationWorkflowModel: CustomApplicationWorkflowModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationWorkflowModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCustomApplicationWorkflow, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    UploadFile(formData) {

        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };

        return this.http
            .post(APIEndpoint + ApiUrls.UploadFileAsync, formData, httpOptions)
            .pipe(
                map((result) => {
                    return result;
                })
            );
    }
}