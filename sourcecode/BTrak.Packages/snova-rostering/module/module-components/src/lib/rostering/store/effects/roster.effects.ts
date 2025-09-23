import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { RosterPlan } from "../../models/roster-create-plan-model";
import { RosterPlanSolution } from "../../models/roster-plan-solution-model";
import { RosterPlanOutput } from "../../models/roster-planoutput-model";
import { RosterService } from "../../services/roster-service";
import { EmployeeRosterActions, EmployeeRosterActionTypes, CreateEmployeeRosterPlanTriggered, CreateEmployeeRosterPlanCompleted, CreateEmployeeRosterPlanFailed, LoadEmployeeRosterPlansTriggered, LoadEmployeeRosterPlansCompleted, LoadEmployeeRosterPlansFailed, GetEmployeeRosterByIdTriggered, GetEmployeeRosterByIdFailed, GetEmployeeRosterByIdCompleted, ApproveEmployeeRosterTriggered, ApproveEmployeeRosterFailed, ApproveEmployeeRosterCompleted, GetRosterSolutionsByIdTriggered, GetRosterSolutionsByIdFailed, GetRosterSolutionsByIdCompleted, GetEmployeeRosterPlanRequestByIdTriggered, GetEmployeeRosterPlanRequestByIdCompleted, GetEmployeeRosterPlanRequestByIdFailed, UpdateEmployeeRosterPlanByRequestId, LoadEmployeeRosterTemplatePlansTriggered, LoadEmployeeRosterTemplatePlansCompleted, LoadEmployeeRosterTemplatePlansFailed, LoadEmployeeRateSheetDetailsTriggered, LoadEmployeeRateSheetDetailsCompleted, LoadEmployeeRateSheetDetailsFailed } from "../actions/roster.action";
import { CreateEmployeeRosterSolutionCompleted, CreateEmployeeRosterSolutionFailed, CreateEmployeeRosterSolutionTriggered } from "../actions/roster.action";
import { ExceptionHandled } from "../actions/roster.action";
import { ShowValidationMessages } from "../../models/notification-validator.action";
import { RosterRequestModel } from "../../models/roster-request-model";
import { RosterPlanInput } from "../../models/roster-plan-input-model";
import { EmployeeRateSheetModel } from '../../models/employee-ratesheet-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

@Injectable()
export class EmployeeRosterEffects {
    requestId: string;
    loadSearchObject: any;
    rosterPlan: RosterPlanOutput;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    rosterPlanInput: RosterPlanInput;
    rosterRequest: RosterRequestModel;
    employeeRosterInsertModel: RosterPlan;
    employeeId: string;
    totalCount: number;
    isNewRosterDetails: boolean;
    toasterMessage: string;
    isArchived: boolean;
    employeeRateSheetList: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;

    @Effect()
    loadRosterSolutions$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRosterSolutionTriggered>(EmployeeRosterActionTypes.CreateEmployeeRosterSolutionTriggered),
        switchMap((searchAction) => {
            this.employeeRosterInsertModel = searchAction.employeeRosterInsertModel;
            return this.rosterService
                .getRosterSolutions(searchAction.employeeRosterInsertModel)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                        }
                        return new CreateEmployeeRosterSolutionCompleted(rosterResponse.data);
                    } else {
                        return new CreateEmployeeRosterSolutionFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    showValidationMessagesForloadRosterSolutions$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRosterSolutionFailed>(EmployeeRosterActionTypes.CreateEmployeeRosterSolutionFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    submitRosterPlan$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRosterPlanTriggered>(EmployeeRosterActionTypes.CreateEmployeeRosterPlanTriggered),
        switchMap((searchAction) => {
            this.rosterPlanInput = searchAction.rosterPlanInput;
            this.isArchived = searchAction.rosterPlanInput.basicInput.isArchived;
            return this.rosterService
                .createEmployeeRosterPlan(searchAction.rosterPlanInput)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                        }
                        return new CreateEmployeeRosterPlanCompleted(rosterResponse.data);
                    } else {
                        return new CreateEmployeeRosterPlanFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    showValidationMessagesForsubmitRosterPlan$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRosterPlanFailed>(EmployeeRosterActionTypes.CreateEmployeeRosterPlanFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    loadRosterPlans$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeRosterPlansTriggered>(EmployeeRosterActionTypes.LoadEmployeeRosterPlansTriggered),
        switchMap((searchAction) => {
            this.loadSearchObject = searchAction.loadSearchObject;
            return this.rosterService
                .getRosterPlans(this.loadSearchObject)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                        }
                        return new LoadEmployeeRosterPlansCompleted(rosterResponse.data);
                    } else {
                        return new LoadEmployeeRosterPlansFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    getRosterPlansByRequest$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeRosterByIdTriggered>(EmployeeRosterActionTypes.GetEmployeeRosterByIdTriggered),
        switchMap((searchAction) => {
            this.requestId = searchAction.requestId;
            return this.rosterService
                .getRosterPlanByRequest(this.requestId)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                        }
                        return new GetEmployeeRosterByIdCompleted(rosterResponse.data);
                    } else {
                        return new GetEmployeeRosterByIdFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    approveRosterPlan$: Observable<Action> = this.actions$.pipe(
        ofType<ApproveEmployeeRosterTriggered>(EmployeeRosterActionTypes.ApproveEmployeeRosterTriggered),
        switchMap((searchAction) => {
            this.rosterPlanInput = searchAction.rosterPlanInput;
            return this.rosterService
                .createEmployeeRosterPlan(searchAction.rosterPlanInput)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        this.requestId = rosterResponse.data;
                        return new ApproveEmployeeRosterCompleted(rosterResponse.data);
                    } else {
                        return new ApproveEmployeeRosterFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    approveRosterPlanSuccessfulAndRequest$: Observable<Action> = this.actions$.pipe(
        ofType<ApproveEmployeeRosterCompleted>(EmployeeRosterActionTypes.ApproveEmployeeRosterCompleted),
        pipe(
            map(() => {
                return new GetEmployeeRosterPlanRequestByIdTriggered(this.requestId);
            })
        )
    );

    // @Effect()
    // approveRosterPlanSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    //     ofType<ApproveEmployeeRosterCompleted>(EmployeeRosterActionTypes.ApproveEmployeeRosterCompleted),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.toasterMessage, // TODO: Change to proper toast message
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    @Effect()
    getEmployeeRosterPlanRequestById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeRosterPlanRequestByIdTriggered>(EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdTriggered),
        switchMap(searchAction => {
            let requestObject;
            if (searchAction.loadSearchObject) {
                requestObject = searchAction.loadSearchObject;
            } else {
                requestObject = { requestId: this.requestId, pageSize: 1, pageNumber: 0 };
            }
            return this.rosterService
                .getRosterPlans(requestObject)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                            this.rosterRequest = rosterResponse.data[0];
                            return new GetEmployeeRosterPlanRequestByIdCompleted(rosterResponse.data[0]);
                        } else {
                            return new GetEmployeeRosterPlanRequestByIdFailed(rosterResponse.apiResponseMessages);
                        }
                    } else {
                    }
                }),
                    catchError((error) => {
                        this.employeeId = "";
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeSalaryDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeRosterPlanRequestByIdCompleted>(EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdCompleted),
        pipe(
            map(() => {
                return new UpdateEmployeeRosterPlanByRequestId({
                    rosterRequestUpdate: {
                        id: this.requestId,
                        changes: this.rosterRequest
                    }
                });
            })
        )
    );

    @Effect()
    showValidationMessagesForapproveRosterPlan$: Observable<Action> = this.actions$.pipe(
        ofType<ApproveEmployeeRosterFailed>(EmployeeRosterActionTypes.ApproveEmployeeRosterFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    getRosterSolutionsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetRosterSolutionsByIdTriggered>(EmployeeRosterActionTypes.GetRosterSolutionsByIdTriggered),
        switchMap((searchAction) => {
            this.requestId = searchAction.requestId;
            return this.rosterService
                .getRosterSolutionByRequestId(searchAction.requestId)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        return new GetRosterSolutionsByIdCompleted(rosterResponse.data);
                    } else {
                        return new GetRosterSolutionsByIdFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )


    @Effect()
    loadRosterTemplatePlan$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeRosterTemplatePlansTriggered>(EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansTriggered),
        switchMap((searchAction) => {
            this.loadSearchObject = searchAction.loadSearchObject;
            return this.rosterService
                .getRosterTemplatePlanByRequest(this.loadSearchObject)
                .pipe(map((rosterResponse: any) => {
                    if (rosterResponse.success === true) {
                        if (rosterResponse.data.length > 0) {
                            this.totalCount = rosterResponse.data[0].totalCount;
                        }
                        return new LoadEmployeeRosterTemplatePlansCompleted(rosterResponse.data);
                    } else {
                        return new LoadEmployeeRosterTemplatePlansFailed(rosterResponse.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    
    @Effect()
    loadRateSheetDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeRateSheetDetailsTriggered>(EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsTriggered),
        switchMap((searchAction) => {
            this.employeeRateSheetDetailsSearchResult = searchAction.employeeRateSheetDetailsSearchResult;
            return this.rosterService
                .getEmployeeDetails(searchAction.employeeRateSheetDetailsSearchResult)
                .pipe(map((employeeRateSheetDetailsList: any) => {
                    if (employeeRateSheetDetailsList.success === true) {
                        if (employeeRateSheetDetailsList.data.employeeRateSheetDetails.length > 0) {
                            this.totalCount = employeeRateSheetDetailsList.data.employeeRateSheetDetails[0].totalCount;
                        }
                        return new LoadEmployeeRateSheetDetailsCompleted(employeeRateSheetDetailsList.data.employeeRateSheetDetails);
                    } else {
                        return new LoadEmployeeRateSheetDetailsFailed(employeeRateSheetDetailsList.apiResponseMessage);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private rosterService: RosterService
    ) { }

}
