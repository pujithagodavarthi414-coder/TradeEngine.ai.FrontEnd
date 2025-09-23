import { Component, Input, OnInit, ViewChild, EventEmitter, Output, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LeaveTypeActionTypes } from "../store/actions/leave-types.actions";
import { State } from "../store/reducers/index";
import { NewLeaveTypePageComponent } from '../containers/new-leave-type.page';
import * as leaveManagementModuleReducers from "../store/reducers/index";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {  MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LeaveFrequencyTypeModel } from "../models/leave-frequency-type-model";
import { LeaveFrequencyTypeSearchInputModel } from "../models/leave-type-search-model";
import { AddNewLeaveTypeFrequencyTriggered, LeaveFrequencyActionTypes, LoadLeaveFrequenciesTriggered, UpdateLeaveTypeFrequencyTriggered } from "../store/actions/leave-frequency.actions";
import { SatPopover } from "@ncstate/sat-popover";
import { AppBaseComponent } from "../../globaldependencies/components/componentbase";
import { Page } from "../models/Page";
import { ConstantVariables } from "../../globaldependencies/constants/constant-variables";

@Component({
    selector: "app-fm-component-leave-frequency",
    templateUrl: `leave-frequency.component.html`
})

export class LeaveFrequencyComponent extends AppBaseComponent implements OnInit {
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @ViewChildren("upsertLeaveFrequencyPopUp") upsertLeaveFrequencyPopOver;
    @ViewChildren("deleteLeaveFrequencyPopUp") deleteLeaveFrequencyPopOver;
    @ViewChild('dateFromPopover') dateFromPopover: SatPopover;
    @ViewChild('dateToPopover') dateToPopover: SatPopover;
    @Output() selectedTabIndex = new EventEmitter<any>();
    @Output() previousTabIndex = new EventEmitter<any>();
    @Output() closeMatDialog = new EventEmitter<string>();


    @Input("leaveTypeId")
    set getLeaveTypeId(data: any) {
        this.leaveTypeId = data;
    }

    @Input("isToLoadLeaveFrequencies")
    set loadLeaveFrequency(data: boolean) {
        if (data) {
            this.page.pageNumber = 0;
            this.page.size = 10;
            this.loadLeaveFrequencies();
        }
    }

    dateTo: Date;
    dateFrom: Date;
    leaveFrequencyForm: FormGroup;
    isAnyAppSelected = false;
    leaveFrequencyEditForm: FormGroup;
    leaveFrequencyEdit: string;
    isUpsertInProgress$: Observable<boolean>;
    isLeaveFrequenciesLoadingInProgress$: Observable<boolean>;
    isLoadingLeaveFrequenciesInProgress: boolean;
    leaveFrequenciesList$: Observable<any>;
    leaveTypeFrequencies: LeaveFrequencyTypeModel;
    leaveTypeId: string;
    ngDestroyed$ = new Subject();
    page = new Page();
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    minDateForEndDate = new Date();
    endDateBool = true;
    toNext: boolean = false;
    isArchived: boolean = false;
    dateToFilterIsActive: boolean = false;
    dateFromFilterIsActive: boolean = false;
    leaveDateFromFilter: Date;
    leaveDateToFilter: Date;
    minDate: Date;
    isOpen: boolean = true;
    editBool: boolean = true;
    leaveFrequencyId: string;
    timeStamp: any;
    isUpsertexistingInProgress$: Observable<boolean>;
    validationMessage: string;


    constructor(private store: Store<State>,private activatedRoute: ActivatedRoute,
        private actionUpdates$: Actions, private route: Router,
        private snackBar: MatSnackBar, private translateService: TranslateService,
        public dialogRef : MatDialogRef<NewLeaveTypePageComponent>) {
        super();
        this.isAnyAppSelected = false;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyCompleted),
                tap(() => {
                    this.formDirective.resetForm();
                    this.initializeForm();
                    this.page.pageNumber = 0;
                    this.page.size = 10;
                    this.loadLeaveFrequencies();
                    this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveFrequencyAddedSuccessfully), "ok", {
                        duration: 200
                    });
                    this.isLeaveFrequenciesLoadingInProgress$ =
                        this.store.pipe(select(leaveManagementModuleReducers.getLeaveFrequencyTypesLoading));
                    this.closeLeaveFrequencyPopup(this.formDirective);
                    this.closeDeleteLeaveFrequencyDialog();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyCompleted),
                tap(() => {
                    this.formDirective.resetForm();
                    this.closeLeaveFrequencyPopup(this.formDirective);
                    this.closeDeleteLeaveFrequencyDialog();
                    this.initializeForm();
                    this.page.pageNumber = 0;
                    this.page.size = 10;
                    this.loadLeaveFrequencies();
                    this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveApplicabilityDetailsUpdatedSuccessfully), "ok", {
                        duration: 200
                    });
                    this.isLeaveFrequenciesLoadingInProgress$ =
                        this.store.pipe(select(leaveManagementModuleReducers.getLeaveFrequencyTypesLoading));
                    this.closeLeaveFrequencyPopup(this.formDirective);
                    this.closeDeleteLeaveFrequencyDialog();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyFailed),
                tap(() => {
                    let validationMessage$ =
                        this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveApplicabilityFailedError));
                    validationMessage$.subscribe((result: any) => {
                        console.log(result);
                        this.validationMessage = result[0].message;
                        // this.validationMessage = result.apiResponseMessage[0].message;
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.LoadLeaveFrequenciesCompleted),
                tap(() => {
                    this.leaveFrequenciesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveFrequencyAll));
                    this.leaveFrequenciesList$.subscribe((result) => {
                        this.isLoadingLeaveFrequenciesInProgress = false;
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        if (this.page.totalElements > 0) {
                            this.toNext = true;
                        }
                    });
                    //this.closeLeaveFrequencyPopup(this.formDirective);
                    this.formDirective.resetForm();
                    this.initializeForm();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.LoadLeaveTypeByIdCompleted),
                tap(() => {
                    this.activatedRoute.params.subscribe((params) => {
                        if (params.id) {
                            this.leaveTypeId = params.id;
                            this.page.pageNumber = 0;
                            this.page.size = 10;
                            this.loadLeaveFrequencies();
                        }
                    });
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.initializeForm();
        super.ngOnInit();
        this.page.pageNumber = 0;
        this.page.size = 10;
        if (this.leaveTypeId) {
            this.loadLeaveFrequencies();
        }
    }

    initializeForm() {
        this.leaveFrequencyForm = new FormGroup({
            dateFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            dateTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            NoOfLeaves: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })

        this.leaveFrequencyEditForm = new FormGroup({
            dateFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            dateTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            noOfLeaves: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    resetAllFilters() {
        this.leaveDateFromFilter = null;
        this.leaveDateToFilter = null;
    }

    loadLeaveFrequencies() {
        this.isLoadingLeaveFrequenciesInProgress = true;
        const leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        leaveTypeSearchModel.pageNumber = this.page.pageNumber + 1;
        leaveTypeSearchModel.pageSize = this.page.size;
        leaveTypeSearchModel.searchText = this.searchText;
        leaveTypeSearchModel.sortBy = this.sortBy;
        leaveTypeSearchModel.fromDate = this.leaveDateFromFilter;
        leaveTypeSearchModel.toDate = this.leaveDateToFilter;
        leaveTypeSearchModel.isArchived = this.isArchived;
        leaveTypeSearchModel.sortDirectionAsc = this.sortDirection;
        leaveTypeSearchModel.leaveTypeId = this.leaveTypeId;
        this.store.dispatch(new LoadLeaveFrequenciesTriggered(leaveTypeSearchModel));
    }

    upsertLeaveTypeFrequency() {
        let leaveFrequency = new LeaveFrequencyTypeModel();
        leaveFrequency = this.leaveFrequencyForm.value;
        leaveFrequency.noOfLeaves = this.leaveFrequencyForm.value.NoOfLeaves;
        leaveFrequency.leaveTypeId = this.leaveTypeId;
        leaveFrequency.isArchived = false;
        this.store.dispatch(new AddNewLeaveTypeFrequencyTriggered(leaveFrequency));
        this.isUpsertInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getupsertLeaveFrequencyInProgress));
    }

    editLeaveTypeFrequency() {
        let leaveFrequency = new LeaveFrequencyTypeModel();
        this.leaveTypeFrequencies.dateFrom = this.leaveFrequencyEditForm.value.dateFrom;
        this.leaveTypeFrequencies.dateTo = this.leaveFrequencyEditForm.value.dateTo;
        this.leaveTypeFrequencies.noOfLeaves = this.leaveFrequencyEditForm.value.noOfLeaves;
        this.leaveTypeFrequencies.isArchived = false;
        leaveFrequency = this.leaveTypeFrequencies;
        this.store.dispatch(new UpdateLeaveTypeFrequencyTriggered(leaveFrequency));
        this.isUpsertInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getupsertLeaveFrequencyInProgress));
    }

    editLeaveFrequencyPopupOpen(row, upsertLeaveFrequencyPopUp) {
        this.leaveFrequencyEditForm.patchValue(row);
        this.leaveTypeFrequencies = new LeaveFrequencyTypeModel();
        this.leaveTypeFrequencies.leaveFrequencyId = row.leaveFrequencyId;
        this.leaveTypeFrequencies.leaveTypeId = row.leaveTypeId;
        this.leaveTypeFrequencies.dateFrom = row.dateFrom;
        this.leaveTypeFrequencies.dateTo = row.dateTo;
        this.leaveTypeFrequencies.noOfDaysToBeIntimated = row.noOfDaysToBeIntimated;
        this.leaveTypeFrequencies.noOfLeaves = row.noOfLeaves;
        this.leaveTypeFrequencies.isPaid = row.isPaid;
        this.leaveTypeFrequencies.isToCarryForward = row.isToCarryForward;
        this.leaveTypeFrequencies.carryForwardLeavesCount = row.carryForwardLeavesCount;
        this.leaveTypeFrequencies.leaveFormulaId = row.leaveFormulaId;
        this.leaveTypeFrequencies.encashMentTypeId = row.encashMentTypeId;
        this.leaveTypeFrequencies.restrictionTypeId = row.restrictionTypeId;
        this.leaveTypeFrequencies.employmentStatusId = row.employmentStatusId;
        this.leaveTypeFrequencies.encashMentTypeId = row.encashMentTypeId;
        this.leaveTypeFrequencies.leaveFrequencyTimeStamp = row.leaveFrequencyTimeStamp;
        this.leaveFrequencyEdit = "Edit leave frequency";
        this.editToDate();
        upsertLeaveFrequencyPopUp.openPopover();
    }

    deleteLeaveFrequencyPopUpOpen(row, deleteLeaveFrequencyPopUp) {
        this.leaveTypeFrequencies = new LeaveFrequencyTypeModel();
        this.leaveTypeFrequencies.leaveFrequencyId = row.leaveFrequencyId;
        this.leaveTypeFrequencies.leaveTypeId = row.leaveTypeId;
        this.leaveTypeFrequencies.dateFrom = row.dateFrom;
        this.leaveTypeFrequencies.dateTo = row.dateTo;
        this.leaveTypeFrequencies.noOfDaysToBeIntimated = row.noOfDaysToBeIntimated;
        this.leaveTypeFrequencies.noOfLeaves = row.noOfLeaves;
        this.leaveTypeFrequencies.isPaid = row.isPaid;
        this.leaveTypeFrequencies.isToCarryForward = row.isToCarryForward;
        this.leaveTypeFrequencies.carryForwardLeavesCount = row.carryForwardLeavesCount;
        this.leaveTypeFrequencies.leaveFormulaId = row.leaveFormulaId;
        this.leaveTypeFrequencies.encashMentTypeId = row.encashMentTypeId;
        this.leaveTypeFrequencies.restrictionTypeId = row.restrictionTypeId;
        this.leaveTypeFrequencies.employmentStatusId = row.employmentStatusId;
        this.leaveTypeFrequencies.encashMentTypeId = row.encashMentTypeId;
        this.leaveTypeFrequencies.leaveFrequencyTimeStamp = row.leaveFrequencyTimeStamp;
        this.leaveFrequencyId = row.leaveFrequencyId;
        this.timeStamp = row.leaveFrequencyTimeStamp;
        deleteLeaveFrequencyPopUp.openPopover();
    }

    deleteLeaveFrequency() {
        let leaveFrequency = new LeaveFrequencyTypeModel();
        this.leaveTypeFrequencies.isArchived = !this.isArchived;
        leaveFrequency = this.leaveTypeFrequencies;
        this.store.dispatch(new UpdateLeaveTypeFrequencyTriggered(leaveFrequency));
        this.isUpsertexistingInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getupsertexistingLeaveFrequencyInProgress));
    }

    closeLeaveFrequencyPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.validationMessage = null;
        this.upsertLeaveFrequencyPopOver.forEach((p) => p.closePopover());
    }

    onSelect(event) {
        this.route.navigate(["/leavemanagement/new-leave-type/" + this.leaveTypeId, "encashment"]);
    }

    onLeaveDateToChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToFilterIsActive = true;
        this.leaveDateToFilter = event.target.value;
        this.dateToPopover.close();
        this.page.pageNumber = 0;
        this.loadLeaveFrequencies();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }


    onLeaveDateFromChange(event: MatDatepickerInputEvent<Date>) {
        this.dateFromFilterIsActive = true;
        this.leaveDateFromFilter = event.target.value;
        this.minDate = this.leaveDateFromFilter;
        this.dateFromPopover.close();
        this.page.pageNumber = 0;
        this.loadLeaveFrequencies();
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.loadLeaveFrequencies();
    }

    next() {
        this.selectedTabIndex.emit(null);
    }

    previousPage() {
        this.previousTabIndex.emit(null);
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === "asc") {
            this.sortDirection = true;
        } else {
            this.sortDirection = false;
        }
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.loadLeaveFrequencies();
    }
    appsSelected(app) {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
    }
    goToPreviousPage() {
        this.dialogRef.close(this.isAnyAppSelected);
        //this.route.navigateByUrl('leavemanagement/dashboard');
    }

    startDate() {
        if (this.leaveFrequencyForm.value.dateFrom) {
            this.minDateForEndDate = this.leaveFrequencyForm.value.dateFrom;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.leaveFrequencyForm.controls["dateTo"].setValue("");
        }
    }

    editToDate() {
        if (this.leaveFrequencyEditForm.value.dateFrom) {
            this.minDateForEndDate = this.leaveFrequencyEditForm.value.dateFrom;
            if (this.leaveFrequencyEditForm.value.dateTo < this.minDateForEndDate) {
                this.leaveFrequencyEditForm.controls["dateTo"].setValue("");
                this.editBool = true;
            }
            else {
                this.editBool = false;
            }
        }
    }

    closeDeleteLeaveFrequencyDialog() {
        this.deleteLeaveFrequencyPopOver.forEach((p) => p.closePopover());
        this.validationMessage = null;
    }
}
