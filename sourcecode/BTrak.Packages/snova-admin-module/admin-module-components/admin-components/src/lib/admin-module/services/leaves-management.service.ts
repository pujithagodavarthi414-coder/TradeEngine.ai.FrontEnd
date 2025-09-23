import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LeaveTypeModel } from '../models/leaves-models/leave-type-model';
import { LeaveSessionModel } from '../models/leaves-models/leave-session-model';
import { LeaveStatusModel } from '../models/leaves-models/leave-status-model';
import { HolidayModel } from '../models/leaves-models/holiday-model';
import { LeaveFrequencyModel } from '../models/leaves-models/leaves-frequency-model';
import { LeaveFormulaModel } from '../models/leaves-models/leave-formula-model';
import { RestrictionTypeModel } from '../models/leaves-models/restriction-type-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
import { ApiUrls } from '../constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class LeavesManagementService {

  private Get_All_LeaveTypes = APIEndpoint + ApiUrls.GetAllLeaveTypes;
  private Leave_Type = APIEndpoint + ApiUrls.UpsertLeaveType;
  private Get_All_LeaveSessions = APIEndpoint + ApiUrls.GetAllLeaveSessions;
  private Leave_Session = APIEndpoint + ApiUrls.UpsertLeaveSession;
  private Get_All_LeaveStatus = APIEndpoint + ApiUrls.GetLeaveStatus;
  private Leave_Status = APIEndpoint + ApiUrls.UpsertLeaveStatus;


  constructor(private http: HttpClient) { }

  getAllLeaveTypes(leaveType: LeaveTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveType);

    return this.http.post(this.Get_All_LeaveTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveType(leaveType: LeaveTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveType);

    return this.http.post(this.Leave_Type, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveSessions(leaveSession: LeaveSessionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveSession);

    return this.http.post(this.Get_All_LeaveSessions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveSession(leaveSession: LeaveSessionModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveSession);

    return this.http.post(this.Leave_Session, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllHolidays(holidays: HolidayModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveStatus);

    return this.http.post(this.Get_All_LeaveStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveStatus(leaveStatus: LeaveStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(leaveStatus);

    return this.http.post(this.Leave_Status, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllLeaveFrequencies(leaveFrequency: LeaveFrequencyModel) {
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
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(restrictionType);

    return this.http.post(APIEndpoint + ApiUrls.UpsertRestrictionType, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
