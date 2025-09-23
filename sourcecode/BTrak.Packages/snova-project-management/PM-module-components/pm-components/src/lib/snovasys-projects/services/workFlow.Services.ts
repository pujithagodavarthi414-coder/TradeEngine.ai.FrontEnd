import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { WorkFlowSearchCriteriaInputModel, WorkFlow } from "../models/workFlow";
import {
  WorkflowStatusesModel,
  StatusesModel
} from "../models/workflowStatusesModel";
import { WorkflowStatus } from "../models/workflowStatus";
import { WorkFlowStatusTransitionTableData } from "../models/workFlowStatusTransitionTableData";
import { RoleSearchCriteriaInputModel } from "../models/roleSearchCriteria";
import { TransitionDeadlineModel } from "../models/transitionDeadline";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class WorkFlowService {
  constructor(private http: HttpClient) {}
  private WorkFlow_SEARCH_API_PATH =
    APIEndpoint + "WorkFlow/WorkFlowApi/GetAllWorkFlows";
  private UPSERT_WorkFlow_API_PATH =
    APIEndpoint + "WorkFlow/WorkFlowApi/UpsertWorkFlow";
  private UPSERT_Status_API_PATH =
    APIEndpoint + "Status/StatusApi/UpsertStatus";
  private Get_All_Status_API_PATH =
    APIEndpoint + "Status/StatusApi/GetAllStatuses";
  private UPSERT_WorkFlow_Status_API_PATH =
    APIEndpoint + "WorkFlow/WorkFlowStatusApi/UpsertWorkFlowStatus";
  private Get_All_WorkFlow_Status_API_PATH =
    APIEndpoint + "WorkFlow/WorkFlowStatusApi/GetAllWorkFlowStatus";
  private Get_All_WorkFlow_Eligible_Status_Transactions__API_PATH =
    APIEndpoint +
    "WorkFlow/WorkFlowEligibleStatusTransitionApi/GetWorkFlowEligibleStatusTransitions";
  private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private UPSERT_WorkFlow_Status_Transactions_API_PATH =
    APIEndpoint +
    "WorkFlow/WorkFlowEligibleStatusTransitionApi/UpsertWorkFlowEligibleStatusTransition";
  private GET_ALL_TRANSITIONS_API_PATH =
    APIEndpoint +
    "TransitionDeadline/TransitionDeadlineApi/GetAllTransitionDeadlines";
  EditConfigurationType: WorkFlow;

  UpsertWorkFlow(WorkFloweModel: WorkFlow) {
    let paramsobj = new HttpParams().set(
      "WorkFlowName",
      WorkFloweModel.WorkFlowName
    );
    paramsobj = paramsobj.set("WorkFlowId", WorkFloweModel.workFlowId);
    paramsobj = paramsobj.set("isArchive", "false");
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    var data = {
      WorkFlowName: WorkFloweModel.workFlowId,
      ConfigurationTypeId: WorkFloweModel.workFlowId
    };

    let body = JSON.stringify(data);
    return this.http
      .post(`${this.UPSERT_WorkFlow_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllWorkFlows(WorkFlowsearchinput: WorkFlowSearchCriteriaInputModel) {
    let paramsobj = new HttpParams().set("isArchive", "false");

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(WorkFlowsearchinput);
    return this.http.get(`${this.WorkFlow_SEARCH_API_PATH}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  UpsertStatus(statusModel: WorkflowStatusesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var data = {
      UserStoryStatusName: statusModel.statusName,
      UserStoryStatusColor: statusModel.statusColor,
      UserStoryStatusId: statusModel.statusId,
      IsArchived: statusModel.isArchived
    };

    let body = JSON.stringify(data);
    return this.http
      .post(`${this.UPSERT_Status_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllStatus(workflowInput: StatusesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(workflowInput);
    return this.http
      .post(`${this.Get_All_Status_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertWorkFlowStatus(workflowstatusModel: WorkflowStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var data = {
      WorkFlowId: workflowstatusModel.workFlowId,
      StatusId: workflowstatusModel.statusId,
      IsCompleted: workflowstatusModel.isComplete,
      WorkFlowStatusId: workflowstatusModel.workFlowStatusId,
      IsArchived: workflowstatusModel.isArchived,
      ExistingUserStoryStatusId: workflowstatusModel.existingUserStoryStatusId,
      CurrentUserStoryStatusId: workflowstatusModel.currentUserStoryStatusId,
      OrderId: workflowstatusModel.orderId,
      timeStamp:workflowstatusModel.timeStamp
    };
    let body = JSON.stringify(data);
    return this.http
      .post(`${this.UPSERT_WorkFlow_Status_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllWorkFlowStatus(WorkflowStatusModel: WorkflowStatus) {
    let paramsobj = new HttpParams().set(
      "workFlowId",
      WorkflowStatusModel.workFlowId
    );
    paramsobj = paramsobj.set("isArchive", "false");
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(WorkflowStatusModel);
    return this.http
      .get(`${this.Get_All_WorkFlow_Status_API_PATH}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetWorkflowStatusById(WorkflowStatusModel: WorkflowStatus) {
    let paramsobj = new HttpParams().set(
      "workFlowId",
      WorkflowStatusModel.workFlowId
    );
    paramsobj = paramsobj.set(
      "statusId",
      WorkflowStatusModel.statusId.toString()
    );
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(WorkflowStatusModel);
    return this.http
      .get(`${this.Get_All_WorkFlow_Status_API_PATH}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllWorkFlowStatusTranitions(
    workflowTransitions: WorkFlowStatusTransitionTableData
  ) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(workflowTransitions);
    return this.http.post(
      `${this.Get_All_WorkFlow_Eligible_Status_Transactions__API_PATH}`,
      body,
      httpOptions
    );
  }

  GetallRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var roleSearchCriteriaModel = new RoleSearchCriteriaInputModel();
    var data = { RoleId: null, RoleName: null, Data: null };
    let body = JSON.stringify(data);

    return this.http
      .post(`${this.Get_All_Roles__API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertWorkFlowStatusTransitions(
    WorkFlowStatusTransitionTableData: WorkFlowStatusTransitionTableData
  ) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(WorkFlowStatusTransitionTableData);
    return this.http
      .post(
        `${this.UPSERT_WorkFlow_Status_Transactions_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllTransitionDeadlines() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var transitionDeadlineModel = new TransitionDeadlineModel();
    let body = JSON.stringify(transitionDeadlineModel);
    return this.http
      .post<any[]>(`${this.GET_ALL_TRANSITIONS_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
