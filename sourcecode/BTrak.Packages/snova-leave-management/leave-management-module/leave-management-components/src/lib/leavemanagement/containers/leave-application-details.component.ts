import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as LeaveTypeState from '../store/reducers/index';
import { Observable, Subject } from 'rxjs';
import * as leaveManagementModuleReducers from '../store/reducers/index';
import * as SharedState from "../store/reducers/index";
import { LeaveModel } from '../models/leave-model';
import { AddNewLeaveTriggered, LeavesActionTypes } from '../store/actions/leaves.actions';
import { Actions, ofType } from '@ngrx/effects';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import { LoadLeaveTypesTriggered } from '../store/actions/leave-types.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { LeaveOverviewModel } from '../models/leave-overview-model';
import { LoadLeavesOverviewTriggered, LeaveOverviewActionTypes } from '../store/actions/leave-overview.action';
import { takeUntil, tap } from 'rxjs/operators';
import { LeaveApprovalChain } from '../models/leave-approval-chain.model';
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { LeaveSessionModel } from '../models/leave-session-model';
import { LeaveManagementService } from '../services/leaves-management-service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {SoftLabelConfigurationModel} from '../models/softlabels-model';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
    selector: 'app-fm-component-leave-application-details',
    templateUrl: 'leave-application-details.component.html',
})

export class LeaveApplicationDetailsComponent extends AppBaseComponent implements OnInit {
    @ViewChild('tabstrip') public tabstrip: TabStripComponent;
    endDateBool: boolean = false;
    minDateForEndDate = new Date();

    @Output() closeHistoryWindow = new EventEmitter<any>();
    leavesApplicationsList$: Observable<LeaveModel[]>;
    isLoadingLeavesList$: Observable<boolean>;

    @Input("leaveApplicationInputId")
    set leaveApplicationInputId(data: any) {
        this.leaveApplicationId = data;
        if (this.tabstrip) {
            Promise.resolve(null).then(() => this.tabstrip.selectTab(0));
        }
    }

    @Input("saveLeave")
    set _saveLeave(data: any) {
        if (data) {
            this.saveLeave = true;
        }
    }

    @Input("leaveApplicationInputModel")
    set leaveApplicationInputModel(data: any) {
        this.initializeForm();
        if (data) {
            this.leaveForm.patchValue(data);
            this.leaveApplicationModel = data;
            this.minDateForEndDate = data.leaveDateFrom;
            this.isApproved = this.leaveApplicationModel.isApproved;
            this.getLeavesOverviewList();
        }
    }

    leaveApplicationId: string;
    leaveForm: FormGroup;
    selectedIndex: any;
    isUpsertLeaveInprogress$: Observable<boolean>;
    leaveApplicationModel: LeaveModel;
    leaveSessionList: any;
    loadingLeaveSessionList: boolean;
    leaveTypesList$: Observable<any>;
    saveLeave = false;
    leaveOverviewlist$: Observable<LeaveOverviewModel[]>;
    leaveOverviewlist: LeaveOverviewModel;
    remainingLeaves: number;
    isLoadingInProgress: boolean;
    approveleaves: number;
    ngDestroyed$ = new Subject();
    isApproved = false;
    selectedStoreId: null;
    moduleTypeId: number = 1;
    referenceTypeId = ConstantVariables.LeaveReferenceTypeId;
    isButtonVisible: boolean = true;
    approvalChain: LeaveApprovalChain[];
    componentModel: ComponentModel = new ComponentModel();
    softLabels : SoftLabelConfigurationModel[];

    constructor(private store: Store<LeaveTypeState.State>, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions, sharedStore: Store<SharedState.State>,
        private leavesManagementService: LeaveManagementService, private cookieService: CookieService,
        private toastr: ToastrService, private translateService: TranslateService) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeaveOverviewActionTypes.LoadLeavesOverviewCompleted),
                tap(() => {
                    this.leaveOverviewlist$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveOverviewAll));
                    this.leaveOverviewlist$.subscribe((result: any) => {
                        if (result != null && result.length > 0) {
                            this.remainingLeaves = result[0].balance;
                            this.approveleaves = result[0].approved;
                            let dummy = JSON.parse(result[0].approvalChain);
                            this.approvalChain = dummy;
                            this.cdRef.detectChanges();
                        }
                        this.isLoadingInProgress = false;
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeavesActionTypes.LoadLeavesByIdCompleted),
                tap((result: any) => {
                    this.leaveApplicationModel = result.leavesUpsertModel;
                    this.closeHistoryWindow.emit();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.isApproved = this.leaveApplicationModel.isApproved;
        if (this.isApproved) {
            this.leaveForm.disable();
        }
        this.getAllLeaveSessions();
        this.getLeavesOverviewList();
        this.getAllLeaveTypes();
        this.getSoftLabelConfigurations();
        // setting component model to pass default variable values
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }


    getLeavesOverviewList() {
        this.isLoadingInProgress = true;
        let leaveOverViewModel = new LeaveOverviewModel();
        leaveOverViewModel.leaveApplicationId = this.leaveApplicationModel.leaveApplicationId;
        leaveOverViewModel.userId = this.leaveApplicationModel.userId
        this.store.dispatch(new LoadLeavesOverviewTriggered(leaveOverViewModel));
    }

    upsertLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = this.leaveForm.value;
        leaveUpsertModel.leaveApplicationId = this.leaveApplicationModel.leaveApplicationId;
        leaveUpsertModel.timeStamp = this.leaveApplicationModel.timeStamp;
        this.store.dispatch(new AddNewLeaveTriggered(leaveUpsertModel));
        this.isUpsertLeaveInprogress$ = this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveInprogress));
    }

    getAllLeaveSessions() {
        var leaveSessionModel = new LeaveSessionModel();
        leaveSessionModel.isArchived = false;
        this.loadingLeaveSessionList = true;
        this.leavesManagementService.getAllLeaveSessions(leaveSessionModel).subscribe((response: any) => {
            this.loadingLeaveSessionList = false;
            if (response.success == true) {
                this.leaveSessionList = response.data;
            }
        });

    }

    startDate() {
        if (this.leaveForm.value.leaveDateFrom) {
            this.minDateForEndDate = this.leaveForm.value.leaveDateFrom;
            this.endDateBool = false;
            this.leaveForm.controls["leaveDateTo"].setValue(null);
        }
        else {
            this.endDateBool = true;
            this.leaveForm.controls["leaveDateTo"].setValue(null);
        }
        this.cdRef.detectChanges();
    }

    getAllLeaveTypes() {
        var leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        leaveTypeSearchModel.isApplyLeave = false;
        this.store.dispatch(new LoadLeaveTypesTriggered(leaveTypeSearchModel));
        this.leaveTypesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesAll));
    }

    closeLeaveHistoryWindow() {
        this.closeHistoryWindow.emit();
    }

    initializeForm() {
        this.leaveForm = new FormGroup({
            leaveDateFrom: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            leaveDateTo: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            leaveReason: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(500)
                ])
            ),
            userId: new FormControl(null,
            ),
            leaveTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            fromLeaveSessionId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            toLeaveSessionId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            isApplyingForOtherEmployee: new FormControl(null,
            ),
        })
    }
}