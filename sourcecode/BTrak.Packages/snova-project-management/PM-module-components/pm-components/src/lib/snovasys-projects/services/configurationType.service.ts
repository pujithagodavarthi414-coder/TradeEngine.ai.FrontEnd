import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import {
  ConfigurationType,
  ConfigurationSearchCriteriaInputModel,
  ConfigurationSettingModel
} from "../models/configurationType";
import { map } from "rxjs/operators";
import { WorkflowStatusesModel } from "../models/workflowStatusesModel";
import { RoleSearchCriteriaInputModel } from "../models/roleSearchCriteria";
import { BoardType } from "../models/boardtypes";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ConfigurationTypeService {
  constructor(private http: HttpClient) {}
  private ConfigurationType_SEARCH_API_PATH =
    APIEndpoint +
    "ConfigurationTypes/ConfigurationTypesApi/GetAllConfigurationTypes";
  private UPSERT_ConfigurationType_API_PATH =
    APIEndpoint +
    "ConfigurationTypes/ConfigurationTypesApi/UpsertConfigurationType";
  private UPSERT_ConfigurationSetting_API_PATH =
    APIEndpoint +
    "ConfigurationTypes/ConfigurationSettingsApi/UpsertConfigurationSettings";
  private GETAll_ConfigurationSetting_API_PATH =
    APIEndpoint +
    "ConfigurationTypes/ConfigurationSettingsApi/GetAllConfigurationSettings";

  private GOAL_SEARCH_API_PATH = APIEndpoint + ApiUrls.SearchGoals;
  private USERSTORY_SEARCH_API_PATH =
    APIEndpoint + ApiUrls.SearchUserStories;
  private GOAL_GET_WORKFLOW_STATUSES_API_PATH =
    APIEndpoint + "Status/StatusApi/GetStatuses?goalId=";
  private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private GET_ALL_BOARD_TYPES_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypesApi/GetAllBoardTypes";
  private Get_All_Status_API_PATH =
    APIEndpoint + "Status/StatusApi/GetAllStatuses";
  EditConfigurationType: ConfigurationType;
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
    //  var data = {PageNumber :configurationTypesearchinput.PageNumber,PageSize :configurationTypesearchinput.PageSize,ConfigurationName : configurationTypesearchinput.ConfigurationName,IsArchived : configurationTypesearchinput.IsArchived};
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
    //  var data = {PageNumber :configurationTypesearchinput.PageNumber,PageSize :configurationTypesearchinput.PageSize,ConfigurationName : configurationTypesearchinput.ConfigurationName,IsArchived : configurationTypesearchinput.IsArchived};
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
  GetAllGoalTypes() {
    return "";
  }
}
