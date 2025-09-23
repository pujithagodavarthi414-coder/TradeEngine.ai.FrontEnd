import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LeaveFrequencyTypeSearchInputModel } from "../models/leave-type-search-model";
import { State } from "../store/reducers/index";

import { EncashmentTypeModel } from "../models/encashment-type-model";
import { LeaveFrequencyTypeModel } from "../models/leave-frequency-type-model";
import { EmploymentStatusModel, EmploymentStatusSearchModel } from '../models/employment';

import {
    AddNewLeaveTypeFrequencyTriggered, LeaveFrequencyActionTypes, LoadEncashmentTypesTriggered,
    LoadLeaveFormulasTriggered, LoadLeaveFrequenciesByFrequencyIdTriggered,
    LoadLeaveFrequenciesByIdTriggered, LoadRestrictionTypesTriggered
} from "../store/actions/leave-frequency.actions";

import * as leaveManagementModuleReducers from "../store/reducers/index";
import { AppBaseComponent } from "../../globaldependencies/components/componentbase";
import { Page } from "../models/Page";
import { LeaveFormulaModel } from "../models/leave-formula-model";
import { RestrictionTypeModel } from "../models/restriction-type-model";
import { LeaveManagementService } from "../services/leaves-management-service";
import { NewLeaveTypePageComponent } from '../containers/new-leave-type.page';

@Component({
    selector: "app-fm-component-leave-encashment",
    templateUrl: `leave-encashment.component.html`
})

export class LeaveEncashmentComponent extends AppBaseComponent implements OnInit {
    showEncashedDetails: boolean;
    @Input("leaveTypeById")
    set selectedTabIndexByNumber(data: any) {
        this.leaveTypeId = data;
    }


    @Output() selectedTabIndex = new EventEmitter<any>();
    @Output() previousTabIndex = new EventEmitter<any>();
    @Output() closeMatDialog = new EventEmitter<string>();

    leaveTypeId: string;
    isAnyAppSelected = false;
    page = new Page();
    leaveFrequenciesList$: Observable<any>;
    leaveFormulasList$: Observable<LeaveFormulaModel[]>;
    restrictionTypesList$: Observable<RestrictionTypeModel[]>;
    selectEmploymentStatusDropDownListData: EmploymentStatusModel[];
    encashmentTypes$: Observable<any>;
    frequencyDetails$: Observable<any>;
    isUpsertFrequencyInProgress$: Observable<boolean>;
    loadFrequencyDetailsInprogress$: Observable<boolean>;
    showCarryForwardDetails = false;
    showEncashmentDetails = false;
    isPaid: any;
    NoOfLeavesToCarryForward: number;
    NoOfLeavesToEncash: number;
    selectedFrequency: any;
    encashmentForm: FormGroup;
    selectedFrequencyId: string;
    selectedFrequencyDateFrom: Date;
    selectedFrequencyDateTo: Date;
    selectedFrequencyLeavesCount: number;
    ngDestroyed$ = new Subject();
    timeStamp: any;
    isToCarryForward: string;


    constructor(private store: Store<State>, private actionUpdates$: Actions, 
        private activatedRoute: ActivatedRoute, private route: Router,private leavesService:LeaveManagementService,
        private cdRef: ChangeDetectorRef,
        public dialogRef : MatDialogRef<NewLeaveTypePageComponent>) {
        super();
        
        this.isAnyAppSelected = false;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdCompleted),
                tap(() => {
                    this.frequencyDetails$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveFrequencyDetails));
                    this.frequencyDetails$.subscribe((result) => {
                        const details = result[0];
                        this.encashmentForm.patchValue(details);
                        this.isPaid = details.isPaid ? "1" : "2";
                        this.isToCarryForward = details.isToCarryForward ? "1" : details.isEncashable ? "2" : null;
                        this.encashmentForm.get('isPaid').setValue(this.isPaid);
                        this.encashmentForm.get('isToCarryForward').setValue(this.isToCarryForward);
                        this.showCarryForwardDetails = details.isToCarryForward;
                        this.showEncashmentDetails = details.isPaid;
                        this.timeStamp = details.leaveFrequencyTimeStamp;
                        this.toggleIsToCarryForward(this.isToCarryForward);
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyCompleted),
                tap(() => {
                    const leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
                    leaveTypeSearchModel.leaveTypeId = this.leaveTypeId;
                    leaveTypeSearchModel.leaveFrequencyId = this.selectedFrequencyId;
                    this.store.dispatch(new LoadLeaveFrequenciesByFrequencyIdTriggered(leaveTypeSearchModel));
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.initializeForm();
        super.ngOnInit();
        this.activatedRoute.params.subscribe((params) => {
            if (params.id) {
                this.leaveTypeId = params.id;
            }
        });
        this.getLeaveFrequencies();
        this.getLeaveFormulas();
        this.getEmploymentStatusList();
        this.getRestrictionTypes();
        const encashmentSearchModel = new EncashmentTypeModel();
        encashmentSearchModel.isArchived = false;
        this.store.dispatch(new LoadEncashmentTypesTriggered(encashmentSearchModel));
        this.encashmentTypes$ = this.store.pipe(select(leaveManagementModuleReducers.getEncashmentTypesList));
    }

    change(event) {
        if (event.value) {
            this.encashmentForm.reset;
            this.selectedFrequency = true;
            this.selectedFrequencyId = event.value.leaveFrequencyId;
            this.selectedFrequencyDateFrom = event.value.dateFrom;
            this.selectedFrequencyDateTo = event.value.dateTo;
            this.selectedFrequencyLeavesCount = event.value.noOfLeaves;
            this.timeStamp = event.value.leaveFrequencyTimeStamp;
            const leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
            leaveTypeSearchModel.leaveTypeId = this.leaveTypeId;
            leaveTypeSearchModel.leaveFrequencyId = this.selectedFrequencyId;
            this.store.dispatch(new LoadLeaveFrequenciesByFrequencyIdTriggered(leaveTypeSearchModel));
            this.loadFrequencyDetailsInprogress$ =
                this.store.pipe(select(leaveManagementModuleReducers.getLoadLeaveFrequencyDetailsInProgress));
        }
    }

    getLeaveFrequencies() {
        const leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        leaveTypeSearchModel.leaveTypeId = this.leaveTypeId;
        leaveTypeSearchModel.isArchived = false;
        this.store.dispatch(new LoadLeaveFrequenciesByIdTriggered(leaveTypeSearchModel));
        this.leaveFrequenciesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveFrequencyTypeById));
    }

    getLeaveFormulas() {
        const leaveFormulaSearchModel = new LeaveFormulaModel();
        leaveFormulaSearchModel.isArchived = false;
        this.store.dispatch(new LoadLeaveFormulasTriggered(leaveFormulaSearchModel));
        this.leaveFormulasList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveFormulasList));
    }

    getRestrictionTypes() {
        const restrictionTypeSearchModel = new RestrictionTypeModel();
        restrictionTypeSearchModel.isArchived = false;
        this.store.dispatch(new LoadRestrictionTypesTriggered(restrictionTypeSearchModel));
        this.restrictionTypesList$ = this.store.pipe(select(leaveManagementModuleReducers.getRestrictionTypesList));
    }

    getEmploymentStatusList() {
        const employmentSearchModel = new EmploymentStatusSearchModel();
        employmentSearchModel.isArchived = false;
        this.leavesService.getAllEmploymentStatus(employmentSearchModel).subscribe((response: any) => {
            this.selectEmploymentStatusDropDownListData = response.data;
        })
    }

    initializeForm() {
        this.encashmentForm = new FormGroup({
            carryForwardLeavesCount: new FormControl(null,
                Validators.compose([
                ])
            ),
            payableLeavesCount: new FormControl(null,
                Validators.compose([
                ])
            ),
            restrictionTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            employmentStatusId: new FormControl(null,
                Validators.compose([
                ])
            ),
            noOfDaysToBeIntimated: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.max(365)
                ])
            ),
            isToCarryForward: new FormControl(null,
                Validators.compose([
                ])
            ),
            isPaid: new FormControl(this.isPaid,
                Validators.compose([
                ])
            ),
            isToIncludeHolidays: new FormControl(null,
                Validators.compose([
                ])
            ),
            isToRepeatInterval: new FormControl(null,
                Validators.compose([
                ])
            ),
            encashedLeavesCount: new FormControl(null,
                Validators.compose([
                ])
            )
        })

        this.encashmentForm.get('noOfDaysToBeIntimated').setValue("-31");
    }

    onChange(mrChange: MatRadioChange) {
        this.isPaid = mrChange.value;
        this.showEncashmentDetails = this.isPaid == 1 ? true : false;
        if (this.showEncashmentDetails) {
            this.encashmentForm.controls["isToCarryForward"].setValidators(Validators.required);
            this.encashmentForm.controls["isToCarryForward"].updateValueAndValidity();
        } else {
            this.encashmentForm.controls["isToCarryForward"].setValue(null);
            this.encashmentForm.get("isToCarryForward").clearValidators();
            this.encashmentForm.get("isToCarryForward").updateValueAndValidity();
            this.encashmentForm.get("encashedLeavesCount").setValue(null);
            this.encashmentForm.get("encashedLeavesCount").clearValidators();
            this.encashmentForm.get("encashedLeavesCount").updateValueAndValidity();
            this.encashmentForm.get("carryForwardLeavesCount").setValue(null);
            this.encashmentForm.get("carryForwardLeavesCount").clearValidators();
            this.encashmentForm.get("carryForwardLeavesCount").updateValueAndValidity();
        }
        this.toggleIsToCarryForward(this.encashmentForm.controls["isToCarryForward"].value)
    }

    upsertLeaveFrequency(isFinish) {
        let leaveFrequency = new LeaveFrequencyTypeModel();
        leaveFrequency = this.encashmentForm.value;
        leaveFrequency.leaveTypeId = this.leaveTypeId;
        leaveFrequency.leaveFrequencyId = this.selectedFrequencyId;
        leaveFrequency.dateFrom = this.selectedFrequencyDateFrom;
        leaveFrequency.dateTo = this.selectedFrequencyDateTo;
        leaveFrequency.noOfLeaves = this.selectedFrequencyLeavesCount;
        leaveFrequency.isPaid = this.isPaid == 1 ? true : false;
        if(this.encashmentForm.value.isToCarryForward == "1" && leaveFrequency.isPaid == true){
            leaveFrequency.isToCarryForward = true;
            leaveFrequency.isEncashable = false;
            leaveFrequency.encashedLeavesCount = null;
        }
        else if(this.encashmentForm.value.isToCarryForward == "2" && leaveFrequency.isPaid == true){
           leaveFrequency.isEncashable = true;
           leaveFrequency.isToCarryForward = false;
           leaveFrequency.carryForwardLeavesCount = null;
        }
        else{
            leaveFrequency.carryForwardLeavesCount = null;
            leaveFrequency.encashedLeavesCount = null;
            leaveFrequency.isEncashable = null;
            leaveFrequency.isToCarryForward = null;
        }

        leaveFrequency.leaveFrequencyTimeStamp = this.timeStamp;
        this.store.dispatch(new AddNewLeaveTypeFrequencyTriggered(leaveFrequency));
        this.isUpsertFrequencyInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getupsertLeaveFrequencyInProgress));
        if (isFinish) {
            this.dialogRef.close(this.isAnyAppSelected);
        }
    }

    toggleIsToCarryForward(value) {
        if (value == "1") {
            this.showCarryForwardDetails = true;
            this.showEncashedDetails = false;
        }
        else if(value == "2"){
            this.showCarryForwardDetails = false;
            this.showEncashedDetails= true;
        }
        else{
            this.showCarryForwardDetails = false;
            this.showEncashedDetails= false;
        }
        if (this.showCarryForwardDetails) {
            this.encashmentForm.controls["carryForwardLeavesCount"].setValidators(Validators.required);
            this.encashmentForm.controls["carryForwardLeavesCount"].updateValueAndValidity();
            this.encashmentForm.get("encashedLeavesCount").setValue(null);
            this.encashmentForm.get("encashedLeavesCount").clearValidators();
            this.encashmentForm.get("encashedLeavesCount").updateValueAndValidity();
        } else {
            if(value != null){
                this.encashmentForm.controls["encashedLeavesCount"].setValidators(Validators.required);
                this.encashmentForm.controls["encashedLeavesCount"].updateValueAndValidity();
                this.encashmentForm.get("carryForwardLeavesCount").setValue(null);
                this.encashmentForm.get("carryForwardLeavesCount").clearValidators();
                this.encashmentForm.get("carryForwardLeavesCount").updateValueAndValidity();
            }
        }
    }
    appsSelected(app) {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
    }
    
    next() {
        this.selectedTabIndex.emit(null);
    }

    previousPage() {
        this.previousTabIndex.emit(null);
    }

    goToPreviousPage() {
        this.route.navigateByUrl('leavemanagement/dashboard');
    }
}
