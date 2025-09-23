import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { BoardType } from '../models/projects/boardtypes';
import { BoardTypeUiModel } from '../models/projects/boardTypeUiModel';
import { BoardTypeModel } from '../models/projects/boardTypeDropDown';
import { boardTypeapi } from '../models/projects/boardtypeApi';
import { ConfigurationType, ConfigurationSettingModel, ConfigurationSearchCriteriaInputModel } from '../models/projects/configurationType';
import { ApiUrls } from '../constants/api-urls';
import { WorkflowStatusesModel } from '../models/projects/workflowStatusesModel';
import { RoleSearchCriteriaInputModel } from '../models/projects/roleSearchCriteria';
import { ConsideredHours } from '../models/projects/consideredHours';
import { PermissionModel } from '../models/projects/permission';
import { GoalStatusDropDownData } from '../models/projects/goalStatusDropDown';
import { GoalModel } from '../models/projects/GoalModel';
import { processDashboard } from '../models/projects/processDashboard';
import { TransitionDeadlineModel } from '../models/projects/transitionDeadline';
import { WorkflowStatus, WorkFlowStatusTransitionTableData } from '../models/projects/workflowStatus';
import { WorkFlowSearchCriteriaInputModel, WorkFlow, StatusesModel } from '../models/projects/workFlow';
import { UserStoryReplanTypeModel } from '../models/projects/user-story-repaln-type-model';
import { UserStoryStatusModel } from '../models/projects/user-story-status-model';
import { UserstorySubTypeModel } from '../models/projects/user-story-sub-type-model';
import { UserstoryTypeModel } from '../models/projects/user-story-type-model';
import { ProjectType } from '../models/projects/projectType';
import { GoalReplanModel } from '../models/projects/goalReplanModel';
import { BugPriorityDropDownData } from '../models/projects/bugPriorityDropDown';
import { BugPriorityModel } from '../models/projects/bug-priority-model';
import { CumulativeWorkReportSearchInputModel } from "../models/projects/cumulativeWorkReportModel";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProjectManagementService {
  constructor(private http: HttpClient) { }

  private GET_ALL_BOARD_TYPES_API_PATH = APIEndpoint + "BoardTypes/BoardTypesApi/GetAllBoardTypes";
  private GET_ALL_WORKFLOW_API_PATH = APIEndpoint + "WorkFlow/WorkFlowApi/GetAllWorkFlows";
  private UPSERT_BOARD_TYPE_API_PATH = APIEndpoint + "BoardTypes/BoardTypesApi/UpsertBoardType";
  private GET_ALL_BOARD_TYPE_UI_API_PATH = APIEndpoint + "BoardTypes/BoardTypeUiApi/GetAllBoardTypeUis";
  private GET_BOARD_TYPE_By_Id_API_PATH = APIEndpoint + "BoardTypes/BoardTypesApi/GetBoardTypeById";
  private GET_ALL_BOARD_TYPES_API_API_PATH = APIEndpoint + "BoardTypes/BoardTypeApi/GetAllBoardTypeApi";
  private UPSERT_BOARD_TYPE_API_API_PATH = APIEndpoint + "BoardTypes/BoardTypeApi/UpsertBoardTypeApi";
  private ConfigurationType_SEARCH_API_PATH = APIEndpoint + "ConfigurationTypes/ConfigurationTypesApi/GetAllConfigurationTypes";
  private UPSERT_ConfigurationType_API_PATH = APIEndpoint + "ConfigurationTypes/ConfigurationTypesApi/UpsertConfigurationType";
  private UPSERT_ConfigurationSetting_API_PATH = APIEndpoint + "ConfigurationTypes/ConfigurationSettingsApi/UpsertConfigurationSettings";
  private GETAll_ConfigurationSetting_API_PATH = APIEndpoint + "ConfigurationTypes/ConfigurationSettingsApi/GetAllConfigurationSettings";
  private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private Get_All_Status_API_PATH = APIEndpoint + "Status/StatusApi/GetAllStatuses";
  private GET_ALL_CONSIDERED_HOURS_API_PATH = APIEndpoint + "ConsideredHours/ConsideredHoursApi/GetAllConsideredHours";
  private UPSERT_CONSIDERED_HOURS_API_API_PATH = APIEndpoint + "ConsideredHours/ConsideredHoursApi/UpsertConsideredHours";
  private UPSERT_PERMISSION_API_PATH = APIEndpoint + "Permission/PermissionApi/UpsertPermission";
  private GET_ALL_PERMISSION_API_PATH = APIEndpoint + "Permission/PermissionApi/GetAllPermissions";
  private UPSERT_Process_Dashboard_Status_API_PATH = APIEndpoint + "Dashboard/ProcessDashboardStatusApi/UpsertProcessDashboardStatus";
  private GET_ALL_PROCESS_DASHBOARD_STATUS_API_PATH = APIEndpoint + "Dashboard/ProcessDashboardStatusApi/GetAllProcessDashboardStatuses";
  private UPSERT_Transition_API_PATH = APIEndpoint + "TransitionDeadline/TransitionDeadlineApi/UpsertTransitionDeadline";
  private GET_ALL_GetAllTransitions_API_PATH = APIEndpoint + "TransitionDeadline/TransitionDeadlineApi/GetAllTransitionDeadlines";
  private UPSERT_WorkFlow_Status_API_PATH = APIEndpoint + "WorkFlow/WorkFlowStatusApi/UpsertWorkFlowStatus";
  private Get_All_WorkFlow_Eligible_Status_Transactions__API_PATH = APIEndpoint + "WorkFlow/WorkFlowEligibleStatusTransitionApi/GetWorkFlowEligibleStatusTransitions";
  private GET_ALL_TRANSITIONS_API_PATH = APIEndpoint + "TransitionDeadline/TransitionDeadlineApi/GetAllTransitionDeadlines";
  private UPSERT_WorkFlow_Status_Transactions_API_PATH = APIEndpoint + "WorkFlow/WorkFlowEligibleStatusTransitionApi/UpsertWorkFlowEligibleStatusTransition";
  private Get_All_WorkFlow_Status_API_PATH = APIEndpoint + "WorkFlow/WorkFlowStatusApi/GetAllWorkFlowStatus";
  private WorkFlow_SEARCH_API_PATH = APIEndpoint + "WorkFlow/WorkFlowApi/GetAllWorkFlows";
  private UPSERT_Status_API_PATH = APIEndpoint + "Status/StatusApi/UpsertStatus";
  private UPSERT_WorkFlow_API_PATH = APIEndpoint + "WorkFlow/WorkFlowApi/UpsertWorkFlow";
  private Upsert_Bug_Priority = APIEndpoint + ApiUrls.UpsertBugPriority;
  private GoalReplan_Type = APIEndpoint + ApiUrls.UpsertGoalReplanType;
  private GETALL_PROJECTTYPES_API_PATH = APIEndpoint + ApiUrls.GetAllProjectTypes;
  private Upsert_Project_Type = APIEndpoint + ApiUrls.UpsertProjectType;
  private Get_UserStory_Replan_Types = APIEndpoint + ApiUrls.GetUserStoryReplanTypes;
  private Upsert_UserStoryReplanType = APIEndpoint + ApiUrls.UpsertUserStoryReplanType;
  private Get_All_UserstorySubTypes = APIEndpoint + ApiUrls.SearchUserStorySubTypes;
  private Upsert_Userstory_sub_type = APIEndpoint + ApiUrls.UpsertUserStorySubType;
  private Upsert_UserStory_Type = APIEndpoint + ApiUrls.UpsertUserStoryType;
  private Delete_UserStory_Type = APIEndpoint + ApiUrls.DeleteUserStoryType;
  private REORDER_WORKFLOW_STATUS_API_PATH = APIEndpoint + ApiUrls.ReOrderWorkflowStatus;
  private UPDATE_WORKFLOW_STATUS_API_PATH = APIEndpoint + "WorkFlow/WorkFlowStatusApi/UpsertWorkFlowStatus";
  private GET_CUMULATIVE_WORK_REPORT = APIEndpoint + "Projects/ProjectsApi/GetCumulativeWorkReport";

  EditConfigurationType: ConfigurationType;

  GetAllBoardTypes() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var boardTypeModel = new BoardType();
    boardTypeModel.isArchived = false;
    let body = JSON.stringify(boardTypeModel);
    return this.http
      .post<any[]>(`${this.GET_ALL_BOARD_TYPES_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  GetAllBoardTypesUI() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var boardTypeUiModel = new BoardTypeUiModel();
    let body = JSON.stringify(boardTypeUiModel);
    return this.http
      .post<any[]>(`${this.GET_ALL_BOARD_TYPE_UI_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllWorkFlows() {
    let paramsobj = new HttpParams().set("isArchive", "false");

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http.get(`${this.GET_ALL_WORKFLOW_API_PATH}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }


  GetAllWorkFlow(WorkFlowsearchinput: WorkFlowSearchCriteriaInputModel) {
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

  UpsertBoardType(boardTypeModel: BoardTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }
    boardTypeModel.isArchived = false;
    let body = JSON.stringify(boardTypeModel);

    return this.http
      .post(`${this.UPSERT_BOARD_TYPE_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  
  reOrderWorkflowStatus(statusModel: WorkflowStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }
    let body = JSON.stringify(statusModel);

    return this.http
      .post(`${this.REORDER_WORKFLOW_STATUS_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateWorkflowStatus(statusModel: WorkflowStatus) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }
    let body = JSON.stringify(statusModel);

    return this.http
      .post(`${this.UPDATE_WORKFLOW_STATUS_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetBoardTypeById(boardtypeId: string) {
    let paramsobj = new HttpParams().set("boardTypeId", boardtypeId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http
      .get<any[]>(`${this.GET_BOARD_TYPE_By_Id_API_PATH}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllBoardTypeApi(apiname: string) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(new boardTypeapi());
    return this.http
      .post(`${this.GET_ALL_BOARD_TYPES_API_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertBoardTypeApi(boardTypeModel: boardTypeapi) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(boardTypeModel);
    return this.http
      .post(`${this.UPSERT_BOARD_TYPE_API_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  UpsertConfigurationType(configurationTypeModel: ConfigurationType) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
    };
    var data = {
      ConfigurationTypeName: configurationTypeModel.ConfigurationTypeName,
      ConfigurationTypeId: configurationTypeModel.ConfigurationTypeId
    };

    let body = JSON.stringify(data);
    return this.http
      .post(`${this.UPSERT_ConfigurationType_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  UpsertConfigurationSetting(Configurationobj: ConfigurationSettingModel) {
    // let paramsobj = new HttpParams().set('configurationId', ConfigurationId.configurationId).set('configurationSettingModel',JSON.stringify(ConfigurationId));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
      // params:paramsobj
    };



    let body = JSON.stringify(Configurationobj);
    return this.http
      .post(
        `${this.UPSERT_ConfigurationSetting_API_PATH}?configurationId=` +
        Configurationobj.configurationTypeId,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  InsertConfigurationSetting(ConfigurationId) {
    let paramsobj = new HttpParams()
      .set("configurationId", ConfigurationId)
      .set("configurationSettingModel", null);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      }),
      params: paramsobj
    };
    //  let body = JSON.stringify(Configurationobj);
    return this.http
      .post(`${this.UPSERT_ConfigurationSetting_API_PATH}`, null, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  GetAllConfigurationTypes(
    configurationTypesearchinput: ConfigurationSearchCriteriaInputModel
  ) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(configurationTypesearchinput);
    return this.http
      .post(`${this.ConfigurationType_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllConfigurationSettings(
    configurationSettingModel: ConfigurationSettingModel
  ) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(configurationSettingModel);
    return this.http
      .post(`${this.GETAll_ConfigurationSetting_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetallRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var roleSearchCriteriaModel = new RoleSearchCriteriaInputModel();
    var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
    let body = JSON.stringify(data);

    return this.http
      .post(`${this.Get_All_Roles__API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllStatus(workflowInput: WorkflowStatusesModel) {
    var data = {
      UserStoryStatusName: workflowInput.statusName,
      UserStoryStatusColor: workflowInput.statusColor
    };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http
      .post(`${this.Get_All_Status_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllGoalTypes() {
    return "";
  }

  GetAllConsideredHours(consideredHours: ConsideredHours) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    var data = {
      ConsiderHourId: consideredHours.considerHourId,
      ConsiderHourName: consideredHours.considerHourName
    };

    let body = JSON.stringify(data);
    return this.http
      .post<any[]>(
        `${this.GET_ALL_CONSIDERED_HOURS_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertConsideredHours(consideredHoursModel: ConsideredHours) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(consideredHoursModel);
    return this.http
      .post(`${this.UPSERT_CONSIDERED_HOURS_API_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllPermissions(PermissionModel: PermissionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),

    };
    let body = JSON.stringify(PermissionModel);
    return this.http
      .post(`${this.GET_ALL_PERMISSION_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertPermissions(PermissionModel: PermissionModel) {
    let paramsobj = new HttpParams().set(
      "permissionName",
      PermissionModel.operationName
    );
    paramsobj = paramsobj.set("permissionId", PermissionModel.id);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    let body = JSON.stringify(PermissionModel);
    return this.http
      .post(`${this.UPSERT_PERMISSION_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllGoalStatus() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(new GoalStatusDropDownData());
    return this.http.post<GoalModel[]>(
      `${APIEndpoint + ApiUrls.GetAllGoalStatuses}`,
      body,
      httpOptions
    );
  }

  UpsertprocessDashboardStatus(processDashboard: processDashboard) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(processDashboard);
    return this.http
      .post(
        `${this.UPSERT_Process_Dashboard_Status_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllProcessDashboardStatus(processDashboard: processDashboard) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(processDashboard);
    return this.http
      .post(
        `${this.GET_ALL_PROCESS_DASHBOARD_STATUS_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllTransitionDeadlines(transitionDeadlineModel: TransitionDeadlineModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(transitionDeadlineModel);
    return this.http
      .post<any[]>(
        `${this.GET_ALL_GetAllTransitions_API_PATH}`,
        body,
        httpOptions
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertTransitionDeadline(transitionDeadlineModel: TransitionDeadlineModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(transitionDeadlineModel);
    return this.http
      .post(`${this.UPSERT_Transition_API_PATH}`, body, httpOptions)
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
      timeStamp: workflowstatusModel.timeStamp
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

  GetAllTransitionsDeadlines() {
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

  GetAllTransitionDeadline() {
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


  GetAllStatuses(workflowInput: StatusesModel) {
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

  upsertBugPriority(bugPriority: BugPriorityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPriority);

    return this.http.post(this.Upsert_Bug_Priority, body, httpOptions);
  }

  private GET_ALL_BUG_PRIPORITIES =
    APIEndpoint + "Status/BugPriorityApi/GetAllBugPriorities";

  GetAllBugPriporities(bugPripority: BugPriorityDropDownData) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPripority);

    return this.http
      .post(`${this.GET_ALL_BUG_PRIPORITIES}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  GetAllGoalReplanTypes(goalReplanModel: GoalReplanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const data = {
      GoalReplanTypeId: "",
      GoalReplanTypeName: "",
      isArchived: goalReplanModel.isArchived
    };

    const body = JSON.stringify(data);
    return this.http.post<GoalReplanModel[]>(
      `${APIEndpoint + ApiUrls.GetAllGoalReplanTypes}`,
      body,
      httpOptions
    );
  }

  upsertGoalReplanType(goalReplanType: GoalReplanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(goalReplanType);

    return this.http.post(this.GoalReplan_Type, body, httpOptions);
  }

  upsertProjectType(projectType: ProjectType) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(projectType);

    return this.http.post(this.Upsert_Project_Type, body, httpOptions);
  }

  GetAllProjectTypes(projectType: ProjectType) {
    var data = {
      ProjectTypeName: "",
      IsArchived: projectType.isArchived,
      ProjectTypeId: ""
    };

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post(
      `${this.GETALL_PROJECTTYPES_API_PATH}`,
      body,
      httpOptions
    );
  }


  GettAllUserStoryReplanTypes(userStoryReplanTypeModel: UserStoryReplanTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanTypeModel);

    return this.http.post(this.Get_UserStory_Replan_Types, body, httpOptions);
  }

  upsertUserStoryReplanType(userStoryReplanType: UserStoryReplanTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanType);

    return this.http.post(this.Upsert_UserStoryReplanType, body, httpOptions);
  }

  SearchTaskStatuses() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(APIEndpoint + ApiUrls.GetAllTaskStatuses, httpOptions);
  }

  upsertUserstoryStatus(userStoryStatusModel: UserStoryStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertStatus, body, httpOptions);
  }


  SearchUserstoryStatuses(userStoryStatusModel: UserStoryStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.GetAllStatuses, body, httpOptions);
  }


  SearchUserstorySubTypes(userstorySubType: UserstorySubTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstorySubType);

    return this.http.post(this.Get_All_UserstorySubTypes, body, httpOptions);
  }

  upsertUserstorySubTypeType(userStorySubTypeModel: UserstorySubTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStorySubTypeModel);

    return this.http.post(this.Upsert_Userstory_sub_type, body, httpOptions);
  }


  SearchUserStoryTypes(userstoryType: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryType);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryTypes, body, httpOptions);
  }

  upsertUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(this.Upsert_UserStory_Type, body, httpOptions);
  }

  deleteUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(this.Delete_UserStory_Type, body, httpOptions);
  }

  getCumulativeWorkReport(cumulativeWorkReportSearchInputModel: CumulativeWorkReportSearchInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(cumulativeWorkReportSearchInputModel);

    return this.http.post(this.GET_CUMULATIVE_WORK_REPORT, body, httpOptions);
  }
  GetAllUsers() {
    var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true', isActive: true };

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(data);

    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions);
  }
}
