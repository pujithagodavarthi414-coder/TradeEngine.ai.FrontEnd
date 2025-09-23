import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomFormFieldModel } from '../models/custom-fileds-model';
import { CreateGenericForm } from '../models/createGenericForm';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
@Injectable({
    providedIn: "root"
})

export class GenericFormService {

    constructor(private http: HttpClient) { }

    GetSubmittedReportsByFormId(customApplicationId: any, formId: any, userId: any = null) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId };
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getFormKeysByFormId(formId: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { GenericFormId: formId };
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormKey, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    submitGenericApplication(genericForm: GenericFormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.UpsertGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    submitPublicGenericApplication(genericForm: GenericFormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(genericForm);

        return this.http.post(APIEndpoint + ApiUrls.UpsertPublicGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getSubmittedReportByFormReportId(genericForm: GenericFormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getCustomApplication(customApplicationSearchModel: CustomApplicationSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplication, body, httpOptions)
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


    getCustomApplicationWorkflowTypes() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.get(APIEndpoint + ApiUrls.GetCustomApplicationWorkflowTypes, httpOptions)
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
        return this.http.get(`${APIEndpoint + ApiUrls.GenericFormSubmittedData}`+
        "?customApplicationId=" + customApplicationId + "&formId=" + formId, httpOptions)
    }

    GetGenericFormById(applicationId: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const formClass = new CreateGenericForm();
        formClass.Id = applicationId;
        const body = JSON.stringify(formClass);

        return this.http.post(APIEndpoint + ApiUrls.GetGenericForms, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}
