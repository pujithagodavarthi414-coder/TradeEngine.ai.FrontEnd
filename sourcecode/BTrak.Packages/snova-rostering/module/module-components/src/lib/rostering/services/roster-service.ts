import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { map } from "rxjs/operators";

import { ApiUrls } from "../../globaldependencies/constants/api-urls";

import { RosterPlan } from "../models/roster-create-plan-model";
import { RosterPlanSolution } from "../models/roster-plan-solution-model";
import { TimeSheetSubmissionInputModel } from "../models/TimeSheet-Submission-Input-Model";
import { EmployeeTimesheetUpsertModel } from "../models/employee-timsheet-upsert-model";
import { EmployeeTimeSheetUpdateModel } from "../models/employee-timesheet-update-model";
import { ApproverTimeSheetSubmission } from "../models/approver-timesheet-input-model";
import { RosterPlanInput } from "../models/roster-plan-input-model";
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import { DepartmentModel } from '../models/department-model';
import { CurrencyModel } from '../models/currency-model';
import { ShiftWeekModel } from '../models/shift-week-model';
import { HolidayModel } from '../models/holiday-model';
import { WeekdayModel } from '../models/weekday-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
// import { environment } from "../../globaldependencies/environments/environment";
import { Observable } from "rxjs/Observable";
import { EmployeeRateTagInput } from '../models/employee-ratetag-Input-model';

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
let APIEndpoint = environment.apiURL;
// const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class RosterService {

    exportPDF: EventEmitter<any> = new EventEmitter();
    exportEXCEL: EventEmitter<any> = new EventEmitter();

    constructor(private http: HttpClient) { }

    getRosterSolutions(rosterPlan: RosterPlan) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(rosterPlan);
        return this.http.post(APIEndpoint + ApiUrls.CreateRosterSolutions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    createEmployeeRosterPlan(planInput: RosterPlanInput) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(planInput);
        return this.http.post(APIEndpoint + ApiUrls.CreateRosterPlan, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getRosterSolutionByRequestId(requestId: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify({ requestId });
        return this.http.post(APIEndpoint + ApiUrls.GetRosterSolutionByRequestId, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getRosterPlans(rosterSearch: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(rosterSearch);
        return this.http.post(APIEndpoint + ApiUrls.GetRosterPlans, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getRosterPlanByRequest(requestId: string) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify({ requestId });
        return this.http.post(APIEndpoint + ApiUrls.GetRosterPlanByRequest, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getRosterTemplatePlanByRequest(requestObject: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(requestObject);
        return this.http.post(APIEndpoint + ApiUrls.GetRosterTemplatePlanByRequest, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    checkRosterName(rosterPlan: RosterPlan) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(rosterPlan);
        return this.http.post<any>(APIEndpoint + ApiUrls.CheckRosterName, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getStatus() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetStatus, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getTimeSheetLineManager() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetTimeSheetApproveLineManagers, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getTimeSheetSubmission(timeSheetSubmissionInputModel: TimeSheetSubmissionInputModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(timeSheetSubmissionInputModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetEmployeeShiftWeekDays, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }



    getTimeSheetPunchCardDeatils(date: string, userId: string) {
        {
            let paramObj = new HttpParams().set('date', date).set('userId', userId);
            const httpOptions = {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
                params: paramObj
            };
            return this.http.get<any>(APIEndpoint + ApiUrls.getEmployeeTimeSheetPunchCardDetails, httpOptions)
                .pipe(map(result => {
                    return result;
                }));
        }
    }


    upsertTimeSheetPunchCard(employeeTimesheetUpsertModel: EmployeeTimesheetUpsertModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeTimesheetUpsertModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.upsertEmployeeTimeSheetPunchCard, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertApproverEditTimeSheet(employeeTimesheetUpsertModel: EmployeeTimesheetUpsertModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeTimesheetUpsertModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.UpsertApproverEditTimeSheet, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    updateTimeSheetPunchCard(employeeTimesheetUpdateModel: EmployeeTimeSheetUpdateModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeTimesheetUpdateModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.updateEmployeeTimeSheetPunchCard, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getApproverTimeSheets(approverTimeSheetSubmission: ApproverTimeSheetSubmission) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(approverTimeSheetSubmission);
        return this.http.post<any>(APIEndpoint + ApiUrls.getApproverTimeSheetSubmissions, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getShiftwiseEmployeeRoster(shiftwiseRoster: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(shiftwiseRoster);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetShiftwiseEmployeeRoster, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllBranches(selectbranch: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(selectbranch);
        return this.http
            .post<any>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getdepartment(departmentModel: DepartmentModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(departmentModel);

        return this.http.post<any>(APIEndpoint + ApiUrls.GetDepartments, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getEmployeeDetails(employeeDetailsSearchModel: EmployeeDetailsSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeDetailsSearchModel);
        return this.http.post<any>(APIEndpoint + ApiUrls.GetEmployeeDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllEmployees(employeeModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeModel);
        return this.http.post<any>(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllShiftTimings(shiftTimingModel: any) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(shiftTimingModel);
        return this.http.post<any>(`${APIEndpoint + ApiUrls.SearchShiftTiming}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getCurrencies(currencyModel: CurrencyModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(currencyModel);

        return this.http.post<any>(`${APIEndpoint + ApiUrls.SearchSystemCurrencies}`, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getShiftWeek(shiftWeekModel: ShiftWeekModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(shiftWeekModel);

        return this.http.post<any>(APIEndpoint + ApiUrls.GetShiftWeek, body, httpOptions)
            .pipe(map((result) => {
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

    getAllWeekDays(weekDayModel: WeekdayModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        const body = JSON.stringify(weekDayModel);

        return this.http.post(APIEndpoint + ApiUrls.GetWeekDays, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }


    getUserById(userId: string){
        let paramsobj = new HttpParams().set('userId', userId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get<any>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getEmployeeRates(employeeRateTagInput: EmployeeRateTagInput){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        const body = JSON.stringify(employeeRateTagInput);

        return this.http.post(APIEndpoint + ApiUrls.GetEmployeeRatesFromRateTags, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
}
