import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import {
  ConfigurationType,
  ConfigurationSearchCriteriaInputModel
} from "../models/configurationType";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  BoardTypeModel,
  BoardTypeDropDownData
} from "../models/boardTypeDropDown";
import { boardTypeapi } from "../models/boardtypeApi";
import { BoardTypeUiModel } from "../models/boardTypeUiModel";
import { BoardType } from "../models/boardtypes";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class BoardTypeService {
  constructor(private http: HttpClient) {}

  private GET_ALL_BOARD_TYPES_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypesApi/GetAllBoardTypes";
  private GET_ALL_WORKFLOW_API_PATH =
    APIEndpoint + "WorkFlow/WorkFlowApi/GetAllWorkFlows";
  private UPSERT_BOARD_TYPE_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypesApi/UpsertBoardType";
  private GET_ALL_BOARD_TYPE_UI_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypeUiApi/GetAllBoardTypeUis";
  private GET_BOARD_TYPE_By_Id_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypesApi/GetBoardTypeById";
  private GET_ALL_BOARD_TYPES_API_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypeApi/GetAllBoardTypeApi";
  private UPSERT_BOARD_TYPE_API_API_PATH =
    APIEndpoint + "BoardTypes/BoardTypeApi/UpsertBoardTypeApi";

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
}
