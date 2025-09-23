import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { CreateGenericForm } from "../models/createGenericForm";
import { Persistance } from "../models/persistance.model";
import { CustomFormFieldModel } from "../models/custom-form-field.model";


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
    providedIn: "root"
})

export class GenericFormService {

    constructor(private http: HttpClient) { }
    private Get_Generic_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';
    private Create_Generic_Form = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericForms';

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
    GetGenericForms(createGenericForm: CreateGenericForm) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(createGenericForm);

        return this.http.post(`${this.Get_Generic_Forms}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    UpsertGenericForm(createGenericForm: CreateGenericForm) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(createGenericForm);

        return this.http.post(`${this.Create_Generic_Form}`, body, httpOptions)
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
    searchCustomFields(searchCustomField : CustomFormFieldModel) {
        return this.http
        .post<any>(
          APIEndpoint + ApiUrls.SearchCustomFieldForms,
          searchCustomField
        )
        .pipe(
          map(result => {
            return result;
          })
        );
      }
      updatecustomField(customField : CustomFormFieldModel) {
        return this.http
        .post<any>(
         APIEndpoint + ApiUrls.UpsertCustomFieldForm,
          customField
        )
        .pipe(
          map(result => {
            return result;
          })
        );
      }
}