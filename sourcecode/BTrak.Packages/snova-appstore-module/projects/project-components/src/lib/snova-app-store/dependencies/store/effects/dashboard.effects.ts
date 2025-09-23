import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
// import { CanteenPurchaseSummaryComponent } from "@snovasys/snova-hrmangement";
// import { CreditComponent } from "@snovasys/snova-hrmangement";
// import { FoodItemsListComponent } from "@snovasys/snova-hrmangement";
// import { OffersCreditedComponent } from "@snovasys/snova-hrmangement";
import { ShowExceptionMessages } from "../actions/notification-validator.action";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { DashboardList } from "../../models/dashboardList";
import { WidgetService } from "../../services/widget.service";
import {
    DashboardException, DashboardFailed, DashboardsActionTypes, LoadDashboardsCompleted, LoadDashboardsListCompleted,
    LoadDashboardsListTriggered, LoadDashboardsTriggered
} from "../actions/Dashboardlist.action";
@Injectable()
export class DashboardEffects {
    DashboardId: string;
    snackBarMessage: string;
    validationMessages: any[];
    exceptionMessage: any;
    searchDashboard: DashboardList;
    latestDashboardData: DashboardList;
    dashboardCollection: any;
    componentCollection = [
        // // { name: "Employee spent time", componentInstance: EmployeeSpentTimeComponent },
        // // { name: "Time punch card", componentInstance: FeedtimesheetComponentProfile },
        // // { name: "Employee feed time sheet", componentInstance: UpdatefeedtimesheetComponent },
        // // { name: "Work allocation summary", componentInstance: WorkAllocationSummaryChartComponent },
        // // { name: "Work allocation profile summary", componentInstance: WorkAllocationSummaryChartProfileComponent},
        // // { name: "User stories dependency on me", componentInstance: UserStoriesDependencyOnMeComponent },
        // // { name: "User stories dependency on others", componentInstance: UserStoriesOtherDependencyComponent },
        // // { name: "Imminent deadlines", componentInstance: ImminentDeadlinesComponent },
        // // { name: "Employees current userstories", componentInstance: EmployeesCurrentUserStoriesComponent },
        // // { name: "Actively running goals", componentInstance: EmployeerunninggoalsComponent },
        // // { name: "Project actively running goals", componentInstance: ProjectrunninggoalsComponent },
        // // { name: "Goals to archive", componentInstance: GoalsArchiveComponent },
        // // { name: "Process dashboard", componentInstance: ProcessdashboardComponent },
        // // { name: "Live dashboard", componentInstance: LiveDashBoardComponent },
        // // { name: "Employee Attendance", componentInstance: EmployeeAttendanceComponent },
        // // { name: "Employee working days", componentInstance: EmployeeWorkingDaysComponent },
        // // { name: "Late employee count vs date", componentInstance: LateEmployeeCountVsDateComponent },
        // // { name: "Daily log time report", componentInstance: DailyLogTimeReportComponent },
        // // { name: "Monthly log time report", componentInstance: MonthlyLogTimeReportComponent },
        // // { name: "Leaves report", componentInstance: LeavesReportComponent },
        // // { name: "Employee index", componentInstance: EmployeeIndexComponent },
        // // { name: "Dev quality", componentInstance: DevQualityComponent },
        // // { name: "Qa performance", componentInstance: QaPerformanceComponent },
        // // { name: "User stories waiting for qa approval", componentInstance: UserStoriesWaitingForQaApprovalComponent },
        // // { name: "Bug report", componentInstance: BugReportComponent },
        // // { name: "Employee user stories", componentInstance: EmployeeUserStoriesComponent },
        // // { name: "Everyday target details", componentInstance: EveryDayTargetDetailsComponent },
        // // { name: "Everyday target details", componentInstance: EveryDayTargetDetailsComponent },
        // { name: "Canteen food items list", componentInstance: FoodItemsListComponent },
        // { name: "Canteen purchase summary", componentInstance: CanteenPurchaseSummaryComponent },
        // { name: "Canteen offers credited", componentInstance: OffersCreditedComponent },
        // { name: "Canteen credit", componentInstance: CreditComponent }
    ];

    constructor(private actions$: Actions, private WidgetService: WidgetService) { }

    @Effect()
    loadDashboards$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDashboardsTriggered>(DashboardsActionTypes.LoadDashboardsTriggered),
        switchMap(getAction => {
            return this.WidgetService.GetDashboardList(getAction.Dashboards).pipe(
                map((Dashboards: any) => {
                    if (Dashboards.success == true) {
                        this.DashboardId = Dashboards.data.dashboard;
                        return new LoadDashboardsCompleted();
                    }
                    else {
                        this.validationMessages = Dashboards.apiResponseMessages
                        return new DashboardFailed(Dashboards.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new DashboardException(err));
                })
            );
        })
    );


    @Effect()
    loadDashboardsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDashboardsListTriggered>(DashboardsActionTypes.LoadDashboardsListTriggered),
        switchMap(getAction => {
            return this.WidgetService.GetDashboardList(getAction.DashboardsList).pipe(
                map((Dashboards: any) => {
                    if (Dashboards.success == true) {
                        this.dashboardCollection = Dashboards.data;
                        if (this.dashboardCollection != null && this.dashboardCollection.length > 0 && this.dashboardCollection[0].dashboard.length > 0) {
                            this.dashboardCollection[0].dashboard.forEach(dashboard => {
                                this.componentCollection.forEach(component => {
                                    if (dashboard.name === component.name) {
                                        dashboard.component = component.componentInstance;
                                    }
                                });
                            });
                        }
                        return new LoadDashboardsListCompleted(this.dashboardCollection);
                    }
                    else {
                        this.validationMessages = Dashboards.apiResponseMessages
                        return new DashboardFailed(Dashboards.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new DashboardException(err));
                })
            );
        })
    );

    @Effect()
    loadDashboardsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDashboardsCompleted>(DashboardsActionTypes.LoadDashboardsCompleted),
        pipe(
            map(
                () => {
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: "Success"
                    });
                    return new LoadDashboardsCompleted();
                }
            )
        )
    );

    @Effect()
    showValidationMessagesForDashboard$: Observable<Action> = this.actions$.pipe(
        ofType<DashboardFailed>(DashboardsActionTypes.DashboardFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    // @Effect()
    // exceptionHandled$: Observable<Action> = this.actions$.pipe(
    //     ofType<DashboardException>(DashboardsActionTypes.DashboardException),
    //     pipe(
    //         map(
    //             () =>
    //                 new ShowExceptionMessages({
    //                     message: this.exceptionMessage.message
    //                 })
    //         )
    //     )
    // );
}