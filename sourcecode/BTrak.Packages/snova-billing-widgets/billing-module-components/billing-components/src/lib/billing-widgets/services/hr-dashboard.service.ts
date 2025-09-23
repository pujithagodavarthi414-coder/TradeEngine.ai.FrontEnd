import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { DailyLogTimeReport } from "../models/dailyLogTimeReportData";
import { MonthlyLogTime } from "../models/monthly-log-time-module";
import { SelectBranch } from "../models/select-branch";
import { HrDashboardModel } from '../models/hrDashboardModel';
import { LeavesReport } from "../models/leavesReport.model";
import { EmployeeListInput } from "../models/employee-List";
import { EmployeeWorkingDays } from '../models/employee-working-days';
import { EmployeeAttendance } from '../models/employee-attendance.model';
import { LeaveReportInputModel } from "../models/leave-report.model";
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class HrDashboardService {

  constructor(private http: HttpClient) { }
  
  getDailyLogTimeReport(dailyLogTimeReport: DailyLogTimeReport) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dailyLogTimeReport);
    return this.http
      .post(APIEndpoint + ApiUrls.GetDailyLogTimeReport, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getMonthlyLogTimeReport(MonthlyLogTime: MonthlyLogTime) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(MonthlyLogTime);
    return this.http
      .post(APIEndpoint + ApiUrls.GetMonthlyLogTimeReport, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllUsers(EmployeeSpentTime: EmployeeListInput) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(EmployeeSpentTime);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  
  GetAllEmployees(leaveReportInput: LeaveReportInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(leaveReportInput);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getLineManagers(searchText: string) {
    let paramsobj = new HttpParams().set('searchText',searchText)
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetLineManagers, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getMyTeamManagers(searchText: string,isReportToOnly: any) {
    let paramsobj = new HttpParams().set('searchText',searchText).set('isReportToOnly',isReportToOnly)
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetLineManagers, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }  

  getAllBranches(selectbranch: SelectBranch) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(selectbranch);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(
        map(result => {
          console.log(" result:", result);
          return result;
        })
      );
  }

  getAlldesignations(selectbranch: SelectBranch) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(selectbranch);
    return this.http
      .post(APIEndpoint + ApiUrls.GetDesignations, body, httpOptions)
      .pipe(
        map(result => {
          console.log(" result:", result);
          return result;
        })
      );
  }

  getdepartment(selectbranch: SelectBranch) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(selectbranch);
    return this.http
      .post(APIEndpoint +ApiUrls.GetDepartments, body, httpOptions)
      .pipe(
        map(result => {
          console.log(" result:", result);
          return result;
        })
      );
  }


  getEmployeePresence(HrDashboardModel:   HrDashboardModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(HrDashboardModel);
    return this.http
      .post(APIEndpoint + ApiUrls.GetEmployeePresence, body, httpOptions)
      .pipe(
        map(result => {
          console.log("result:", result);
          return result;
        })
      );
  }
       
  GetEmployeeWorkingDays(EmployeeWorkingDays:   EmployeeWorkingDays) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(EmployeeWorkingDays);
    return this.http
      .post(APIEndpoint + ApiUrls.GetEmployeeWorkingDays, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

getLateEmployeeDetails(hrDashboardModel: HrDashboardModel) {
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  let body = JSON.stringify(hrDashboardModel);
  return this.http
    .post(APIEndpoint + ApiUrls.GetLateEmployee, body, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
}

GetLeavesReport(leavesReport: LeavesReport) {
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  let body = JSON.stringify(leavesReport);
  return this.http
    .post(APIEndpoint + ApiUrls.GetLeavesReport, body, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
}

GetEmployeeSpentTime(userId,fromDate,toDate,entityId){
  let paramsobj = new HttpParams().set('UserId',userId).set('FromDate',fromDate).set('Todate',toDate).set('entityId',entityId);
  const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      params:paramsobj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetEmployeeSpentTime, httpOptions)
   .pipe(map(result => {
    return result;
   }));
  }


  getEmployeeAttendanceByDayWise(EmployeeAttendance: EmployeeAttendance) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(EmployeeAttendance);
    return this.http
      .post(APIEndpoint +ApiUrls.GetEmployeeAttendanceByDay, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  sendMessage(mobileNo: string) {
    let paramsobj = new HttpParams().set('mobileNo',mobileNo)
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.SendMessage, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }  
  
}