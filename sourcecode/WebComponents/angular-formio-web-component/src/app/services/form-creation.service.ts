import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CreateForm } from "../models/createForm";
import { FormSubmitted } from "../models/formSubmitted";
import { CustomApplicationSearchModel } from "../models/customApplicationSearchModel";
const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55226/' : document.location.origin + '/backend/';
@Injectable({
    providedIn: "root"
})

export class FormCreationService {

    constructor(private http: HttpClient) {

    }
    private Create_Form = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericForms';
    private Upsert_Form_Submitted = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericFormSubmitted';
    private Upsert_Form_SubmittedUnAuth = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericFormSubmittedUnAuth';
    private Get_Form_Submitted = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormSubmitted';
    private Get_Custom_Application = APIEndpoint + 'CustomAppplication/CustomApplicationApi/GetCustomApplication';
    private Get_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';
    private Get_LatestSubmittedReportByFormId = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormSubmitted';
    private Get_Custom_Application_UnAuth = APIEndpoint + 'CustomAppplication/CustomApplicationApi/GetCustomApplicationUnAuth';
    private Get_LatestSubmittedReportByFormId_UnAuth = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormSubmittedUnAuth';
    private Get_Forms_UnAuth = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormsUnAuth';
    private Get_Workflows = APIEndpoint + 'GenericForm/GenericFormApi/GetWorkflows';
    private Get_Form_Keys = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormKey';

    UpsertGenericForm(createGenericForm: CreateForm) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(createGenericForm);

        return this.http.post(`${this.Create_Form}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    submitGenericApplication(genericForm: FormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(`${this.Upsert_Form_Submitted}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    submitGenericApplicationUnAuth(genericForm: FormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(`${this.Upsert_Form_SubmittedUnAuth}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }


    getCustomApplication(customApplicationSearchModel: CustomApplicationSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationSearchModel);
        return this.http.post(`${this.Get_Custom_Application}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getSubmittedReportByFormReportId(form: FormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(form);
        return this.http.post(`${this.Get_Form_Submitted}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getSubmittedReportByFormReportIdUnAuth(form: FormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(form);
        return this.http.post(`${this.Get_LatestSubmittedReportByFormId_UnAuth}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetGenericForms(createForm: CreateForm) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(createForm);

        return this.http.post(`${this.Get_Forms}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    GetLatestSubmittedReportByFormId(customApplicationId: any, formId: any, userId: any = null, isArchived: any = null, pageNumber?: any, pageSize?: any,isPagingRequired?: boolean, dateFrom?: any, dateTo?: any, filters?: any, advancedFilter?:boolean, keyFilterJson?: any ) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId, IsArchived: isArchived, pageNumber: pageNumber,pageSize: pageSize, isPagingRequired: isPagingRequired, dateFrom: dateFrom, dateTo: dateTo, filters:filters, advancedFilter:advancedFilter, keyFilterJson: keyFilterJson};
        return this.http.post(`${this.Get_LatestSubmittedReportByFormId}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getCustomApplicationUnAuth(customApplicationSearchModel: CustomApplicationSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationSearchModel);
        return this.http.post(`${this.Get_Custom_Application_UnAuth}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetLatestSubmittedReportByFormIdUnAuth(customApplicationId: any, formId: any, userId: any = null, isArchived: any = null, pageNumber?: any, pageSize?: any,isPagingRequired?: boolean, dateFrom?: any, dateTo?: any, filters?: any, advancedFilter?:boolean, keyFilterJson?: any ) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId, IsArchived: isArchived, pageNumber: pageNumber,pageSize: pageSize, isPagingRequired: isPagingRequired, dateFrom: dateFrom, dateTo: dateTo, filters:filters, advancedFilter:advancedFilter, keyFilterJson: keyFilterJson};
        return this.http.post(`${this.Get_LatestSubmittedReportByFormId_UnAuth}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetGenericFormsUnAuth(createForm: CreateForm) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(createForm);

        return this.http.post(`${this.Get_Forms_UnAuth}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getWorkflows(searchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(searchModel);

        return this.http.post(`${this.Get_Workflows}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getFormKeysByFormId(formId) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { GenericFormId: formId };
        return this.http.post(`${this.Get_Form_Keys}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

}