import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
// import { ApiUrls } from '../../../common/constants/api-urls';
import { LeaveTypeModel } from '../models/leave-type-model';
import { LeaveSessionModel } from '../models/leave-session-model';
import { LeaveStatusModel } from '../models/leave-status-model';
import { HolidayModel } from '../models/holiday-model';
import { LeaveFrequencyModel } from '../models/leaves-frequency-model';
import { LeaveFormulaModel } from '../models/leave-formula-model';
import { RestrictionTypeModel } from '../models/restriction-type-model';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class LeavesManagementService {

  private Get_All_LeaveTypes = ApiUrls.GetAllLeaveTypes;
  private Leave_Type = ApiUrls.UpsertLeaveType;
  private Get_All_LeaveSessions = ApiUrls.GetAllLeaveSessions;
  private Leave_Session = ApiUrls.UpsertLeaveSession;
  private Get_All_LeaveStatus = ApiUrls.GetLeaveStatus;
  private Leave_Status = ApiUrls.UpsertLeaveStatus;


  constructor(private http: HttpClient) { }

  getAllLeaveTypes(leaveType: LeaveTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveType);

    return this.http.post(APIEndpoint +this.Get_All_LeaveTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveType(leaveType: LeaveTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveType);

    return this.http.post(APIEndpoint +this.Leave_Type, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveSessions(leaveSession: LeaveSessionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveSession);

    return this.http.post(APIEndpoint +this.Get_All_LeaveSessions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveSession(leaveSession: LeaveSessionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveSession);

    return this.http.post(APIEndpoint +this.Leave_Session, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllHolidays(holidays: HolidayModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(holidays);

    return this.http.post(APIEndpoint + ApiUrls.GetHolidays, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertHoliday(holidayInputModel: HolidayModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(holidayInputModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertHoliday, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveStatuss(leaveStatus: LeaveStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveStatus);

    return this.http.post(APIEndpoint +this.Get_All_LeaveStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveStatus(leaveStatus: LeaveStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveStatus);

    return this.http.post(APIEndpoint +this.Leave_Status, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveFrequencies(leaveFrequency: LeaveFrequencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveFrequency);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveFrequency, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveFrequency(leaveFrequency: LeaveFrequencyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveFrequency);

    return this.http.post(APIEndpoint + ApiUrls.UpsertLeaveFrequency, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveFormulas(leaveFormula: LeaveFormulaModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveFormula);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveFormula, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveFormula(leaveFormula: LeaveFormulaModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveFormula);

    return this.http.post(APIEndpoint + ApiUrls.UpsertLeaveFormula, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllRestrictionTypes(restrictionType: RestrictionTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(restrictionType);

    return this.http.post(APIEndpoint + ApiUrls.GetRestrictionTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertRestrictionType(restrictionType: RestrictionTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(restrictionType);

    return this.http.post(APIEndpoint + ApiUrls.UpsertRestrictionType, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
