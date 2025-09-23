import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { LocalStorageProperties } from "src/roleFeatures/localStorageProperties";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
import { CreateForm } from "../models/createForm";
import { CustomApplicationSearchModel } from "../models/customApplicationSearchModel";
import { FormSubmitted } from "../models/formSubmitted";
import { FormType } from "../models/formType";
import { FormFieldValue } from "../models/formFieldValue";
import { FormRelatedFieldValue } from "../models/formRelatedFieldValues";
import { RoleModel } from "../models/roleform";

// const APIEndpoint = "http://localhost:55224/";

const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224/' : document.location.origin + '/backend/';


@Injectable({
    providedIn: "root"
})

export class FormService {
    constructor(private http: HttpClient) { }

    private Get_Form_Types = APIEndpoint + 'GenericForm/GenericFormApi/GetFormTypes';
    private Get_FormTypes = APIEndpoint + 'MasterData/GenericFormMasterDataApi/GetGenericFormTypes';
    private Upsert_FormType = APIEndpoint + 'MasterData/GenericFormMasterDataApi/UpsertGenericFormType';
    public Get_Forms_List = APIEndpoint + 'GenericForm/GenericFormApi/GetForms';
    public Get_Form_Fields = APIEndpoint + 'GenericForm/GenericFormApi/GetFormsFieldsDropdown?id=';
    private Get_Form_Field_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetFormFieldValues';
    private Get_Form_Related_Field_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetFormRecordValues';
    public Get_Role_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetRoles';
    public Get_User_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetUsersBasedonRole?roles=';
    public Get_User_Valu_ByRole = APIEndpoint + 'User/UsersApi/GetUsersByRoles';
    public Get_related_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetFormsWithField';
    public Get_Related_Form_Field = APIEndpoint + 'GenericForm/GenericFormApi/GetFormsFields';
    public formJson: any;


    getAllFormTypes(formType: FormType) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(formType);
        return this.http.post(this.Get_FormTypes, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    upsertFormType(formType: FormType) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(formType);

        return this.http.post(this.Upsert_FormType, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
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




    GetFormFieldValues(formFieldValue: FormFieldValue) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(formFieldValue);

        return this.http.post(`${this.Get_Form_Field_Values}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    GetFormRelatedFieldValues(formRelatedFieldValue: FormRelatedFieldValue) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(formRelatedFieldValue);

        return this.http.post(`${this.Get_Form_Related_Field_Values}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
    GetallRoles() {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
        let body = JSON.stringify(data);
        return this.http
            .post(`${this.Get_Role_Values}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
    GetUsersByRoles(roles: RoleModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(roles);

        return this.http.post(`${this.Get_User_Valu_ByRole}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }
}