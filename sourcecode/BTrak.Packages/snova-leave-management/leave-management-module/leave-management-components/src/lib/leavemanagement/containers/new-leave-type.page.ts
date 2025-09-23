import { Component,Output, EventEmitter,OnInit, ViewChild, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {  MatTabGroup } from "@angular/material/tabs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from "@angular/material/dialog";

import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { State } from "../store/reducers/index";

import { LeaveFrequencyTypeModel } from "../models/leave-frequency-type-model";
import { LeaveTypeInputModel } from "../models/leave-type-input-model";
import { LeaveFrequencyTypeSearchInputModel } from "../models/leave-type-search-model";

import { TranslateService } from "@ngx-translate/core";
import { AddNewLeaveTypeTriggered, LeaveTypeActionTypes, LoadLeaveTypeByIdTriggered } from "../store/actions/leave-types.actions";
import * as leaveManagementModuleReducers from "../store/reducers/index";
import { CookieService } from "ngx-cookie-service";
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Page } from "../models/Page";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LeavesService } from "../services/leaves-service";

@Component({
    selector: "app-fm-component-new-leave-type-page",
    templateUrl: `new-leave-type.page.template.html`
})
export class NewLeaveTypePageComponent extends AppBaseComponent implements OnInit {
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    

    searchText: string;
    isAnyAppSelected = false;
    leaveTypes: any;
    leaveTypes$: Observable<LeaveFrequencyTypeModel[]>;
    isLeaveTypesLoadingInProgress: boolean;
    upsertLeaveTypeInProgress$: Observable<boolean>;
    LeaveTypeId$: Observable<string>;
    leaveTypeId: string;
    leaveType$: Observable<LeaveFrequencyTypeModel[]>;
    leaveType: LeaveFrequencyTypeModel;
    isAnyOperationIsInprogress: boolean;
    public ngDestroyed$ = new Subject();
    page = new Page();
    sortBy: string;
    sortDirection: boolean;
    isToLoadLeaveFrequencies = true;
    leaveTypeForm: FormGroup;
    masterLeaveTypes: any;
    selectedTab = "";
    selectedTabIndex: number = 0;
    timeStamp: any;
    isToIncludeHolidays: boolean;
    currentUser: string;
    public color: string = "";
    roleFeaturesIsInProgress$: Observable<boolean>;
    softLabels: any;
    matDialogData:any;
    @Output() closeMatDialog = new EventEmitter<string>();

    constructor(private snackBar: MatSnackBar, private translateService: TranslateService, private store: Store<State>,
        private actionUpdates$: Actions,public dialog: MatDialog, private routes: Router, private leavesService: LeavesService,
        public AppDialog: MatDialogRef<NewLeaveTypePageComponent>,
        private activatedRoute: ActivatedRoute, private toastr: ToastrService, private cookieService: CookieService, 
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        if(data.data){
            if(this.selectedTab === undefined){
                this.selectedTab = "frequency";
            }
            
            this.leaveTypeId = data.data;
            if (this.leaveTypeId) {
                const leaveFrequencyType = new LeaveFrequencyTypeSearchInputModel();
                leaveFrequencyType.leaveTypeId = this.leaveTypeId;
                this.isLeaveTypesLoadingInProgress = true;
                this.store.dispatch(new LoadLeaveTypeByIdTriggered(leaveFrequencyType));
            }
        }
        this.isAnyAppSelected = false;
        this.matDialogData = data;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.AddNewLeaveTypeCompleted),
                tap(() => {
                    this.LeaveTypeId$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypeId));
                    this.selectedTabIndexChange();
                    this.LeaveTypeId$.subscribe((result) => {
                        this.leaveTypeId = result;
                        const leaveFrequencyType = new LeaveFrequencyTypeSearchInputModel();
                        leaveFrequencyType.leaveTypeId = this.leaveTypeId;
                        this.isLeaveTypesLoadingInProgress = true;
                        this.currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
                        if (this.currentUser != 'null') {
                            this.store.dispatch(new LoadLeaveTypeByIdTriggered(leaveFrequencyType));
                            if (!this.ngDestroyed$) {
                                if (this.leaveType.leaveTypeId) {
                                    this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveTypeUpdatedSuccessfully), "ok", {
                                        duration: 3000
                                    });
                                } else {
                                    this.snackBar.open(this.translateService.instant(ConstantVariables.LeaveTypeAddedSuccessfully), "ok", {
                                        duration: 3000
                                    });
                                }
                            }
                        }
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveTypeActionTypes.LoadLeaveTypeByIdCompleted),
                tap(() => {
                    this.leaveType$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypeById));
                    this.leaveType$.subscribe((result) => {
                        this.isLeaveTypesLoadingInProgress = false;
                        if (result) {
                            this.leaveType = result[0];
                            this.timeStamp = this.leaveType.timeStamp;
                            this.leaveTypeForm.patchValue(this.leaveType);
                        }
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.page.pageNumber = 1;
        this.page.size = 10;
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        this.activatedRoute.params.subscribe((routeParams) => {
            this.selectedTab = routeParams.tab;
            if (this.selectedTab === undefined) {
                this.selectedTab = "frequency";
            }
            console.log(this.matDialogData);
            if (routeParams.id) {
                this.leaveTypeId = routeParams.id;
            }
            if (this.leaveTypeId) {
                const leaveFrequencyType = new LeaveFrequencyTypeSearchInputModel();
                leaveFrequencyType.leaveTypeId = this.leaveTypeId;
                this.isLeaveTypesLoadingInProgress = true;
                this.store.dispatch(new LoadLeaveTypeByIdTriggered(leaveFrequencyType));
            }
        });
        this.initializeForm();
        this.getMasterLeaveTypes();
    }

    initializeForm() {
        this.leaveTypeForm = new FormGroup({
            leaveTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])
            ),
            leaveTypeShortName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])
            ),
            masterLeaveTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            leaveTypeColor: new FormControl(null,
                Validators.compose([
                ])
            ),
            isToIncludeHolidays: new FormControl(null,
                Validators.compose([
                ])
            )
        })
    }

    getMasterLeaveTypes() {
        this.leavesService.getMasterLeaveTypes().subscribe((response: any) => {
            if (response.success) {
                this.masterLeaveTypes = response.data;
            } else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }

    upsertLeaveType() {
        let leaveTypeModel = new LeaveTypeInputModel();
        leaveTypeModel = this.leaveTypeForm.value;
        if (this.leaveTypeId && this.timeStamp) {
            leaveTypeModel.leaveTypeId = this.leaveType.leaveTypeId;
            leaveTypeModel.timeStamp = this.leaveType.timeStamp;
        }
        this.store.dispatch(new AddNewLeaveTypeTriggered(leaveTypeModel));
        this.upsertLeaveTypeInProgress$ = this.store.pipe(select(leaveManagementModuleReducers.getUpsertLeaveTypeInProgress));
    }
    selectedTabIndexChange() {
        this.selectedTabIndex = this.selectedTabIndex + 1;
    }
    appsSelected(app) {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
    }
    previous() {
        this.selectedTabIndex = this.selectedTabIndex - 1;
    }
    onEvent() {
        this.AppDialog.close(this.isAnyAppSelected);
    }
    outputs = {
        appsSelected: app => {
            if (app == null)
                this.AppDialog.close(this.isAnyAppSelected);
            else {
                this.isAnyAppSelected = true;
                this.closeMatDialog.emit(app);
            }

        }
    }
    

}
