import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../../globaldependencies/constants/api-urls";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { GenericFormType } from "../models/generic-form-type-model";
import { WorkflowModel } from "../models/workflow-model";
import { TimeZone, User } from "../models/timezone-model";
import { WorkFlowTriggerModel } from "../models/workFlowTriggerModel";
import { Observable } from "rxjs";

const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55226/' : document.location.origin + '/backend/';


@Injectable({
  providedIn: "root"
})


export class WorkflowService {

    
    private Get_All_GenericFormTypes = APIEndpoint + ApiUrls.GetForms;
    private Get_All_FormFieds = APIEndpoint + ApiUrls.GetFormsFields;
    private Upsert_Workflow = APIEndpoint + ApiUrls.UpsertWorkflow;
    private Update_Workflow = APIEndpoint + ApiUrls.UpdateWorkflow;
    private Get_Timezone = APIEndpoint + ApiUrls.GetTimezone;
    private Upsert_Workflow_Trigger = APIEndpoint + ApiUrls.UpsertWorkflowTrigger;
    private Workflow_List = APIEndpoint + ApiUrls.GetWorkflows;
    private Workflow_ById = APIEndpoint + ApiUrls.GetWorkflowById;
    private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
    private GET_USER_BY_NAME_API_PATH = APIEndpoint + "api/LoginApi/GetUserDetails";
    private Get_Generic_Forms = APIEndpoint + ApiUrls.GetGenericForms;
    private Get_DataService_Generic_Forms = APIEndpoint + ApiUrls.GetGenericForms;
    private Get_Roles_Dropdown = APIEndpoint + ApiUrls.GetRolesDropdown;
    constructor(private http: HttpClient) { }
  
    getAllFormTypes(genericFormType: GenericFormType) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(genericFormType);
  
      return this.http.get(this.Get_All_GenericFormTypes, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    getGenericForms(genericForm) {
      const body = JSON.stringify(genericForm);
      var paramsobj = new HttpParams().set("formSearchInputModel", body);
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        params: paramsobj
      };
      return this.http.get(this.Get_Generic_Forms, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    getDataServiceGenericForms(genericForm) {
      const body = JSON.stringify(genericForm);
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
      return this.http.post(this.Get_DataService_Generic_Forms, body, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    getAllFormFields(workflowModel: WorkflowModel) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(workflowModel);
  
      return this.http.post(this.Get_All_FormFieds, body, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    upsertWorkflowTrigger(workflowTiggerModel: WorkFlowTriggerModel) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(workflowTiggerModel);
  
      return this.http.post(this.Upsert_Workflow_Trigger, body, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    GetAllUsers(searchModel): Observable<User[]> {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
      let body = JSON.stringify(searchModel);
      return this.http.post<User[]>(
        `${this.USERS_SEARCH_API_PATH}`,
        body,
        httpOptions
      );
    }

    getWorkflows(workflowModel: WorkflowModel){
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(workflowModel);
  
      return this.http.post(this.Workflow_List, body,  httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    getWorkflowById(dataSourceId : any,id: any){
      var paramsobj = new HttpParams().set("id", id).set("dataSourceId",dataSourceId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
      return this.http.get(this.Workflow_ById, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }
  
    upsertWorkflow(workflowModel: WorkflowModel) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(workflowModel);
  
      return this.http.post(this.Upsert_Workflow, body, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }
  

    UpdateWorkflow(workflowModel: WorkflowModel) {
      
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(workflowModel);
  
      return this.http.post(this.Update_Workflow, body, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }
    
    getAllTimezone(timeZone: TimeZone) {
      const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      };
  
      const body = JSON.stringify(timeZone);
  
      return this.http.get(this.Get_Timezone, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }

    getAllRoles(){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      return this.http.get(this.Get_Roles_Dropdown, httpOptions)
        .pipe(map((result) => {
          return result;
        }));
    }
  
   
}