import { Component, OnInit, Input, Inject } from "@angular/core";
import * as _ from "underscore";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { Store, select } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { RosterPlanSolution } from "../models/roster-plan-solution-model";
import { process, State as KendoState } from "@progress/kendo-data-query";
import { CurrencyModel } from "../models/currency-model";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import * as RosterState from "../store/reducers/index";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { EmployeeRosterActionTypes, LoadEmployeeRosterPlansTriggered, GetEmployeeRosterByIdTriggered, LoadEmployeeRosterTemplatePlansTriggered } from "../store/actions/roster.action";
import { RosterRequestModel } from "../models/roster-request-model";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import { ConstantVariables } from "../models/constant-variables";
import { ViewRosterPlanDetailsComponent } from "./view-employee-roster-plan-details.component";
import { RosterSolution } from "../models/roster-solution-model";
import { RosterTemplatePlanOutputByRequestModel } from "../models/roster-request-template-plan-model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';

export interface ViewRosterTemplateDialogData {
    currency: CurrencyModel;
    dateFormat: any;
    preRequisites: any;
}

@Component({
    selector: "app-hr-component-view-template-roster-plans",
    templateUrl: `template-employee-roster.component.html`
})

export class ViewAndLoadRosterTemplate extends CustomAppBaseComponent implements OnInit {
    selectedPlan: RosterPlanOutput[];
    gridView: any;
    kendoState: KendoState;
    requestListGridData: GridDataResult;
    dateFormat: any;
    selectedCurrency: CurrencyModel;
    requestList: RosterRequestModel[];
    pageable: boolean;
    filterable: boolean;
    selectedObject: any;
    plansList: RosterTemplatePlanOutputByRequestModel[];
    selectedSolution: RosterSolution;
    requestId: string;
    isSubmitted = false;
    minDate = new Date();
    minDateForEndDate = new Date();
    startDate: any;
    error: boolean;
    preRequisites: any;
    selectedRequest: string;

    public ngDestroyed$ = new Subject();
    requestList$: Observable<RosterRequestModel[]>;
    plansList$: Observable<RosterTemplatePlanOutputByRequestModel[]>;
    anyOperationInProgress$: Observable<boolean>;

    constructor(private actionUpdates$: Actions,
        public dialogRef: MatDialogRef<ViewAndLoadRosterTemplate>,
        private rosterStore: Store<RosterState.State>, private router: Router,
        private toastr: ToastrService, private translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) private data: ViewRosterTemplateDialogData, public dialog: MatDialog) {
        super();
        if (data.dateFormat && data.dateFormat.pattern) {
            this.dateFormat = data.dateFormat;
        } else {
            this.dateFormat = {};
            this.dateFormat.pattern = ConstantVariables.DateFormat;
        }
        if (data.currency && data.currency.currencyCode) {
            this.selectedCurrency = data.currency;
        } else {
            this.selectedCurrency = new CurrencyModel();
            this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        }
        if (data.preRequisites) {
            this.preRequisites = data.preRequisites;
            this.startDate = this.preRequisites.startDate;
        } else {
            this.startDate = new Date();
        }
        this.selectedRequest = "";
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.LoadEmployeeRosterPlansCompleted),
                tap(() => {
                    this.requestList$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterRequestsAll));
                    this.requestList$.subscribe((result) => {
                        if (result) {
                            this.requestList = result;
                            this.gridView = {
                                data: this.requestList,
                                total: result.length > 0 ? result[0].totalCount : 0,
                            }
                            if (result.length > 0) {
                                this.pageable = true;
                            } else {
                                this.pageable = false;
                            }
                            // this.requestListGridData = process(this.gridView, this.kendoState);
                        }
                    });
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansCompleted),
                tap((response: any) => {
                    if (response.rosterTemplatePlans) {
                        this.plansList = response.rosterTemplatePlans;

                        if (response.rosterTemplatePlans.length > 0) {
                            this.requestId = this.plansList[0].requestId;
                            this.selectedSolution = new RosterSolution();
                            this.selectedSolution.solutionId = this.plansList[0].solutionId;

                            if (this.isSubmitted) {
                                this.closePopover(true);
                            } else {
                                this.showRosterDetails();
                            }
                        } else {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterTemplateALLEmployeeNotAvailable));
                        }
                    }
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.pageable = false;
        this.selectedRequest = "";
        this.kendoState = {
            skip: 0,
            take: 5,
            filter: {
                logic: 'or',
                filters: []
            }
        };
        this.getRequestList();
    }

    public onSelect(selected) {
        if (!this.startDate) {
            this.error = true;
            return;
        }
        //var s = document.getElementById(selected.dataItem.requestId).innerHTML;
        this.selectedRequest = selected.dataItem.requestId;
        this.selectedObject = selected;
    }

    onChange(mrChange: MatRadioChange) {
        var value = mrChange;
    }

    getRequestList() {
        let rosterPlan: any = {};
        rosterPlan.pageSize = this.kendoState.take;
        rosterPlan.pageNumber = this.kendoState.skip;
        rosterPlan.isTemplate = true;
        rosterPlan.branchId = this.preRequisites.branchId;

        this.rosterStore.dispatch(new LoadEmployeeRosterPlansTriggered(rosterPlan));
        this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.loadingEmployeeRoster));
    }

    loadRequestedData(dataItem) {
        if (!this.startDate) {
            this.error = true;
            return;
        }
        this.isSubmitted = false;
        if (dataItem.requestId != this.requestId) {
            const dataObject = { requestId: dataItem.requestId, startDate: this.startDate }
            this.rosterStore.dispatch(new LoadEmployeeRosterTemplatePlansTriggered(dataObject));
            this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.templateLoading));
        }
    }

    showRosterDetails() {
        let plansolution = new RosterPlanSolution();
        plansolution.requestId = this.requestId;
        plansolution.plans = this.plansList;

        const dialogRef = this.dialog.open(ViewRosterPlanDetailsComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { solution: plansolution ? plansolution : "", currency: this.selectedCurrency, dateFormat: this.dateFormat }
        });
    }

    closePopover(isSuccess): void {
        if (this.plansList && isSuccess) {
            const unavailableCount = this.plansList.filter(x => x.availableStatus != null);
            if (unavailableCount && unavailableCount.length > 0) {
                if (unavailableCount.length < this.plansList.length) {
                    this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterTemplateSOMEEmployeeNotAvailable));
                } else {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.RosterTemplateALLEmployeeNotAvailable));
                    return;
                }
            }
        }

        this.dialogRef.close({
            success: isSuccess,
            data: {
                solution: this.selectedSolution, plans: this.plansList ? this.plansList.filter(x => x.availableStatus == null) : null,
                requestId: this.requestId
            }
        });
        this.gridView.data = [];
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.kendoState = state;
        this.getRequestList();
    }

    public modifyTemplate() {
        this.isSubmitted = true;
        if (!this.plansList || this.plansList[0].requestId != this.requestId) {
            const dataObject = { requestId: this.selectedObject.dataItem.requestId, startDate: this.startDate }
            this.rosterStore.dispatch(new LoadEmployeeRosterTemplatePlansTriggered(dataObject));
            this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.templateLoading));
        } else {
            this.closePopover(true);
        }
    }

    goToUserProfile(event, selectedUserId) {
        event.stopPropagation();
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}
