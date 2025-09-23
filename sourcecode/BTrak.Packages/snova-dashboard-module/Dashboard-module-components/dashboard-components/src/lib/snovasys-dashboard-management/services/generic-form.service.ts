import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { FormHistoryModel } from "../models/form-history.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { CreateGenericForm } from '../models/createGenericForm';
import { CustomApplicationModel } from '../models/custom-application-input.model';
import { CustomApplicationWorkflowModel } from '../models/custom-application-workflow.model';
import { ObservationTypeModel } from '../models/observation-type.model';
import { CustomFormFieldModel } from '../models/custom-field.model';
import { CustomApplicationKeyModel } from '../models/custom-application-key-input.model';
import { CustomApplicationKeySearchModel } from '../models/custom-application-key-search.model';
import { CustomApplicationPersistanceModel } from '../models/custom-application-persistance.model';

import { Observable } from "rxjs";
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

    upsertCustomApplication(customApplicationInputModel: CustomApplicationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationInputModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCustomApplication, body, httpOptions)
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

    getObservationType(observationModel: ObservationTypeModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(observationModel);
        return this.http.post(APIEndpoint + ApiUrls.GetObservationType, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getResidentObservations(searchCustomField : CustomFormFieldModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(searchCustomField);
        return this.http.post(APIEndpoint + ApiUrls.GetResidentObservations, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    upsertObservationType(observationModel: ObservationTypeModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(observationModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertObservationType, body, httpOptions)
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

    upsertCustomApplicationKeys(customApplicationKeyInputModel: CustomApplicationKeyModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationKeyInputModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertCustomApplicationKeys, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getCustomApplicationKeys(customApplicationKeySearchModel: CustomApplicationKeySearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationKeySearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplicationKeys, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    setCustomAppDashboardPersistance(persistanceModel: CustomApplicationPersistanceModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(persistanceModel);
        return this.http.post(APIEndpoint + ApiUrls.SetCustomAppDashboardPersistanceForUser, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getCustomAppDashboardPersistance(persistanceModel: CustomApplicationPersistanceModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(persistanceModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomAppDashboardPersistanceForUser, body, httpOptions)
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

    getFormHistory(formHistoryModel: FormHistoryModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(formHistoryModel);

        return this.http.post(APIEndpoint + ApiUrls.GetFormHistory, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getGenericFormSubmittedData(customApplicationId: any, formId: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(`${APIEndpoint + ApiUrls.GenericFormSubmittedData}`+
        "?customApplicationId=" + customApplicationId + "&formId=" + formId, httpOptions)
    }
}
