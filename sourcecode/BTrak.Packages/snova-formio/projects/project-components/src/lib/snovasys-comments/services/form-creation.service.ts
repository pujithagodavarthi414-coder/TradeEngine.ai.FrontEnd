import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CreateForm } from "../models/createForm";
import { environment } from "../../environments/environment.prod";
import { FormSubmitted } from "../models/formSubmitted";
import { CustomApplicationSearchModel } from "../models/customApplicationSearchModel";
const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224/' : document.location.origin + '/backend/';
@Injectable({
    providedIn: "root"
})

export class FormCreationService {

    constructor(private http: HttpClient) {

    }
    private Create_Form = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericForms';
    private Upsert_Form_Submitted = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericFormSubmitted';
    private Get_Form_Submitted = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormSubmitted';
    private Get_Custom_Application = APIEndpoint + 'CustomAppplication/CustomApplicationApi/GetCustomApplication';
    private Get_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';

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

}