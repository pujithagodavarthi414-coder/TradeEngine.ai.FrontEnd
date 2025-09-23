import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../../../../globaldependencies/constants/api-urls";
import { CreateGenericForm } from "../models/createGenericForm";
import { CustomApplicationModel } from "../models/custom-application-input.model";
import { CustomApplicationKeyModel } from "../models/custom-application-key-input.model";
import { CustomApplicationKeySearchModel } from "../models/custom-application-key-search.model";
import { CustomApplicationPersistanceModel } from "../models/custom-application-persistance.model";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { CustomApplicationWorkflowModel } from "../models/custom-application-workflow";
import { GenericFormSubmitted, GenericFormSubmittedSearchInputModel } from "../models/generic-form-submitted.model";
import { ObservationTypeModel } from "../models/observation-type.model";
import { FormHistoryModel } from "../models/form-history.model";
import { CustomFormFieldModel } from "../models/custom-fileds-model";
import { GenericFormType } from '../models/generic-form-type-model';
import { Observable } from "rxjs/Observable";
import { LocalStorageProperties } from "../../../../globaldependencies/constants/localstorage-properties";
import { Persistance } from '../../../models/persistance.model';
import { WorkflowTrigger } from '../../../models/workflow-trigger.model';




const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const pdfDesignerApiUrl = environment.pdfDesignerApiUrl;
//const APIEndpoint ="http://localhost:55228/";


@Injectable({
    providedIn: "root"
})

export class GenericFormService {

    constructor(private http: HttpClient) { }
    private Get_Form_Types = APIEndpoint + 'GenericForm/GenericFormApi/GetFormTypes';
    private Get_Generic_Forms = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericForms';
    private Create_Generic_Form = APIEndpoint + 'GenericForm/GenericFormApi/UpsertGenericForms';
    private Get_Forms_By_TypeId = APIEndpoint + 'GenericForm/GenericFormApi/GetGenericFormsByTypeId';
    private GetPdfTemplates = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GetAllHTMLDataSet';
    private GetGeneratedInvoices = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GetGeneratedInvoices';
    private GetTreeData = pdfDesignerApiUrl + 'PDFDocumentEditor/PDFMenuDataSetApi/GetAllPDFMenuDataSet';
    private ValidateAndRunMongoQuery = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/ValidateAndRunMongoQuery';
    private GetHTMLDataSetById = pdfDesignerApiUrl + "PDFDocumentEditor/HTMLDataSetApi/GetHTMLDataSetById"
    private ConversionFromHtmltoSfdt = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/ConversionFromHtmltoSfdt';
    private GetTemplateByIdWithDataSources = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GetTemplateByIdWithDataSources';
    private GenerateCompleteTemplates = pdfDesignerApiUrl + 'PDFDocumentEditor/HTMLDataSetApi/GenerateCompleteTemplates';

    private Share_Generic_From_API = APIEndpoint + "GenericForm/GenericFormApi/ShareGenericFormSubmitted";
    private GetCo2EmissionReport = APIEndpoint + ApiUrls.GetCo2EmissionsList;
    private Get_Roles_Dropdown = APIEndpoint + ApiUrls.GetRolesDropdown;
    private Get_All_Users = APIEndpoint + ApiUrls.GetAllUsers;
    private Share_Generic_Form = APIEndpoint + ApiUrls.ShareNewGenericForm;
    private ShareDocument = APIEndpoint + ApiUrls.ShareNewGenericForm;
    private Get_All_Workflows = APIEndpoint + "GenericForm/GenericFormApi/GetWorkflows";
    private GetDocumentsList = APIEndpoint + ApiUrls.GetDocumentsForGenericFormSubmitetd;
    private Share_Generic_Form_New = APIEndpoint + ApiUrls.ShareNewEmptyForm;
    private DailyUploadExcel = APIEndpoint + ApiUrls.DailyUploadExcel;
    public GetExcelToCustomApplicationsDetails = APIEndpoint + ApiUrls.GetExcelToCustomApplicationsDetails;


    backgroundLookupLink(appId, formId, companyIds) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        const body = { customApplicationId: appId, formId: formId, companyIds: companyIds };
        return this.http.post<any>(APIEndpoint + `GenericForm/GenericFormApi/BackgroundLookupLink`, body
            , httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    GetSubmittedReportsByFormId(customApplicationId: any, formId: any, userId: any = null, isArchived: any = null, pageNumber?: any, pageSize?: any, isPagingRequired?: boolean, dateFrom?: any, dateTo?: any, filters?: any, advancedFilter?: boolean, keyFilterJson?: any, recordLevelPermissionFieldName?: any,isRecordLevelPermissionEnabled?: any, conditionalEnum?: any, conditionsJson?: any, roleIds?: any, stagesJson? : any ) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId, IsArchived: isArchived, pageNumber: pageNumber, pageSize: pageSize, isPagingRequired: isPagingRequired, dateFrom: dateFrom, dateTo: dateTo, filters: filters, advancedFilter: advancedFilter, keyFilterJson: keyFilterJson,isRecordLevelPermissionEnabled: isRecordLevelPermissionEnabled,recordLevelPermissionFieldName: recordLevelPermissionFieldName, conditionalEnum: conditionalEnum, conditionsJson: conditionsJson, roleIds : roleIds, stagesJson : stagesJson };
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmitted, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetSubmittedReportsByFormIdUnAuth(customApplicationId: any, formId: any, userId: any = null, isArchived: any = null, pageNumber?: any, pageSize?: any, isPagingRequired?: boolean, dateFrom?: any, dateTo?: any, filters?: any, advancedFilter?: boolean, keyFilterJson?: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = { CustomApplicationId: customApplicationId, FormId: formId, UserId: userId, IsArchived: isArchived, pageNumber: pageNumber, pageSize: pageSize, isPagingRequired: isPagingRequired, dateFrom: dateFrom, dateTo: dateTo, filters: filters, advancedFilter: advancedFilter, keyFilterJson: keyFilterJson };
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmittedUnAuth, body, httpOptions)
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

    GetGenericFormsByTypeId(formTypeId) {
        var paramsobj = new HttpParams().set("formTypeId", formTypeId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };

        return this.http.get(`${this.Get_Forms_By_TypeId}`, httpOptions)
            .pipe(map(result => {
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

    submitGenericApplicationUnAuth(genericForm: GenericFormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.UpsertGenericFormSubmittedUnAuth, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }


    shareGenericApplication(genericForm: GenericFormSubmittedSearchInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.ShareGenericFormSubmitted, body, httpOptions)
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

    triggerWorkflowsList(genericForm) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.TriggerWorkflow, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getSubmittedReportByFormReportIdUnAuth(genericForm: GenericFormSubmitted) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(genericForm);
        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmittedUnAuth, body, httpOptions)
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
    getCustomApplicationKeysSelected(customApplicationSearchModel: CustomApplicationSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(customApplicationSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetCustomApplicationKeysSelected, body, httpOptions)
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

    getGenericFormHistory(recordId,pageNumber,pageSize) {
        let paramsObj = new HttpParams().set("referenceId", recordId).set("pageNo", pageNumber).set("pageSize", pageSize);
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          params: paramsObj
        };
    
        return this.http
          .get(`${APIEndpoint + ApiUrls.GetGenericFormHistory}`, httpOptions)
          .pipe(
            map(result => {
              return result;
            })
          );
    }








    ImportFormDataFromExcel(formData, customAppId, formName) {
        let paramsobj = new HttpParams().set('applicationId', customAppId).set('formName', formName);
        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" }),
            params: paramsobj
        };
        return this.http
            // tslint:disable-next-line: max-line-length
            .post(`${APIEndpoint + ApiUrls.ImportFormDataFromExcel}`, formData, httpOptions)
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

    getResidentObservations(searchCustomField: CustomFormFieldModel) {
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
        return this.http.get(`${APIEndpoint + ApiUrls.GenericFormSubmittedData}` +
            "?customApplicationId=" + customApplicationId + "&formId=" + formId, httpOptions)
    }

    getAllFormTypes(genericFormType: GenericFormType) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(genericFormType);

        return this.http.post(APIEndpoint + ApiUrls.GetGenericFormTypes, body, httpOptions)
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

    getWorkflowsForTriggers(workflowModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(workflowModel);

        return this.http.post(APIEndpoint + ApiUrls.GetWorkFlowsForTriggers, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    getWorkflowsByReferenceId(triggerModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(triggerModel);

        return this.http.post(APIEndpoint + ApiUrls.GetWorkFlowTriggers, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    upsertWorkflowTrigger(triggerModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(triggerModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertWorkFlowTrigger, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    upsertLevel(levelModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(levelModel);
        return this.http.post(APIEndpoint + ApiUrls.UpsertLevel, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    getLevel(levelSearchModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(levelSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetLevel, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    validateAndRunMongoQuery(inputModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(inputModel);
        return this.http.post(`${this.ValidateAndRunMongoQuery}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    conversionFromHtmlToSfdt(htmlFile: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify({ htmlFile: htmlFile });
        return this.http.post(`${this.ConversionFromHtmltoSfdt}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    getPdfTemplates() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetPdfTemplates}` + '?IsArchived=' + false, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getPdfTemplateById(Id) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetHTMLDataSetById}` + '?Id=' + Id, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getTreeData(id: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(`${this.GetTreeData}` + '?TemplateId=' + id, httpOptions);
    }

    getTemplateByIdWithDataSources(Id) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetTemplateByIdWithDataSources}` + '?Id=' + Id, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    generateCompleteTemplates(inputModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(inputModel);
        return this.http.post(`${this.GenerateCompleteTemplates}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getGeneratedInvoices(genericFormSubmittedId) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };

        return this.http.get(`${this.GetGeneratedInvoices}` + '?GenericFormSubmittedId=' + genericFormSubmittedId, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getDocumentsList(inputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        const body = JSON.stringify(inputModel);
        return this.http.post(`${this.GetDocumentsList}`,body,httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getCo2EmissionReport(searchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(searchModel);
        return this.http.post(`${this.GetCo2EmissionReport}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getAllRoles() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.get(this.Get_Roles_Dropdown, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetAllUsers(searchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(searchModel);
        return this.http.post(`${this.Get_All_Users}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    shareNewGenericForm(searchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(searchModel);
        return this.http.post(`${this.Share_Generic_Form_New}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    shareDocument(searchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(searchModel);
        return this.http.post(`${this.ShareDocument}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getAllWorkflows(workflowModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(workflowModel);
        return this.http.post(`${this.Get_All_Workflows}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    dailyUploadExcel(formData: FormData) {
        // No need to set headers, Angular will set it as multipart/form-data automatically
        return this.http.post(`${this.DailyUploadExcel}`, formData)
            .pipe(map((result) => {
                return result;
            }));
    }

    getUploadedExcelSheetDetails(inputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(inputModel);
        return this.http.post(`${this.GetExcelToCustomApplicationsDetails}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}