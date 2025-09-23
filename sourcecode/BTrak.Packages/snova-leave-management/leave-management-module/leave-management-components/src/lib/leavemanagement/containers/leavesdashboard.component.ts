
import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { tap, takeUntil } from 'rxjs/operators';
import * as LeaveTypeState from '../store/reducers/index';
import { Subject, Observable } from 'rxjs';
import * as leaveManagementModuleReducers from '../store/reducers/index';
import { State } from '@progress/kendo-data-query';
import { LeaveModel } from '../models/leave-model';
import { LoadLeavesTriggered, LeavesActionTypes, AddNewLeaveTriggered } from '../store/actions/leaves.actions';
import { ofType, Actions } from '@ngrx/effects';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import { LoadLeaveTypesTriggered } from '../store/actions/leave-types.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { LeavesPersistance } from '../models/leaves-dashboard-persistance.model';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { LeaveSessionModel } from '../models/leave-session-model';
import { LeaveStatusModel } from '../models/leave-status-model';
import { WorkspaceDashboardFilterModel } from '../models/workspacedashboardfiltermodel';
import { Page } from '../models/Page';
import { LeaveManagementService } from '../services/leaves-management-service';
import { LeavesService } from '../services/leaves-service';
import { EmployeeListModel } from '../models/employee';
import {SoftLabelConfigurationModel} from '../models/softlabels-model';

@Component({
    selector: 'app-fm-component-leavesdashboard', encapsulation: ViewEncapsulation.None,
    templateUrl: 'leavesdashboard.component.html',
})

export class LeavesDashBoardListComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("upsertLeavePopUp") upsertLeavePopUp;
    @ViewChild('leaveTypePopover') leaveTypePopover: SatPopover;
    @ViewChild('leaveStatusPopover') leaveStatusPopover: SatPopover;
    @ViewChild('datePopover') datePopover: SatPopover;
    @ViewChild('namePopover') namePopover: SatPopover;
    @ViewChild('entityPopover') entityPopover: SatPopover;
    @ViewChildren('approveLeavePopUp') approveLeavePopOver;
    @ViewChildren('rejectLeavePopUp') rejectLeavePopOver;
    @ViewChildren('archiveLeavePopUp') archiveLeavePopOver;
    @ViewChild('dateFromPopover') dateFromPopover: SatPopover;
    @ViewChild('dateToPopover') dateToPopover: SatPopover;

    @Output() closePopUp = new EventEmitter<any>();

    dashboardId: string;
    workspaceFilterModel = new LeavesPersistance();
    workspaceDashboardFilterId: string;
    validationMessage: string;
    updatePersistanceInprogress: boolean = false;
    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data) {
            this.dashboardId = data;
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("fromRoute")
    set _fromRoute(data: boolean) {
        if (data || data == false) {
            this.fromRoute = data;
        }
        else {
            this.fromRoute = null;
        }
    }

    dashboardFilters: DashboardFilterModel;
    leavesList$: Observable<LeaveModel[]>;
    // leavesList: LeaveModel[];
    leaveTypesList$: Observable<any>;
    allEmployeeList: any;
    employeeList: any[];
    isLoadingLeavesList$: Observable<boolean>;
    isUpsertLeaveInprogress$: Observable<boolean>;
    leaveDetails: LeaveModel;
    page = new Page();
    leaveList: any;
    entityIsActive: boolean = false;
    fromRoute: boolean;
    fromLeaves: boolean = false;
    leaveSessionList: any;
    leaveStatuses: any;
    ngDestroyed$ = new Subject();
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    isOpen: boolean = true;
    showEmployeeDropdown: boolean = false;
    nameFilterIsActive: boolean = false;
    searchByLeaveTypeFilterIsActive: boolean = false;
    leaveStatusFilterIsActive: boolean = false;
    dateFilterIsActive: boolean = false;
    isHistoryVisible: boolean = false;
    leaveApplicationModel: any;
    isAnyOperationIsInprogress: boolean;
    leaveForm: FormGroup;
    selectedLeaveTypeId: string;
    selectedEmployeeId: string;
    selectedLeaveStatus: string;
    leaveApplicationId: string;
    fromDate: Date;
    pageable: boolean = false;
    reason = new FormControl("", [Validators.required, Validators.maxLength(500)]);
    leavesList: GridDataResult;
    branchList$: Observable<any>;
    selectedBranchId: string;
    leaveDateFromFilter: Date;
    leaveDateToFilter: Date;
    minDate: Date;
    dateFromFilterIsActive: boolean = false;
    dateToFilterIsActive: boolean = false;
    totalCount: number;
    calanderView: boolean = false;
    calanderList: LeaveModel[];
    userId: string;
    selectedViewType: any;
    selectedEmployeeName: string;
    selectedBranch: string;
    selectedLeaveType: string;
    leaveStatusSelected: string;
    displayFilters: boolean;
    selectedEntityId: string = '';
    entities: EntityDropDownModel[];
    canAccess_feature_ViewCompanyWideLeaves: Boolean;
    softLabels : SoftLabelConfigurationModel[];

    constructor(private store: Store<LeaveTypeState.State>, private routes: Router,
        private actionUpdates$: Actions, private leavesService: LeavesService,
        private leavesManagementService: LeaveManagementService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private cookieService: CookieService) {
        super();

        if (this.routes.url.includes('leavemanagement')) {
            this.fromLeaves = true;
            this.cdRef.markForCheck();
        }

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeavesActionTypes.LoadLeavesCompleted),
                tap(() => {
                    this.isAnyOperationIsInprogress = false;
                    this.leavesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeavesAll));
                    this.leavesList$.subscribe((result) => {
                        this.leavesList = {
                            data: result,
                            total: result.length > 0 ? result[0].totalCount : 0,
                        }
                        this.calanderList = result;
                        this.cdRef.detectChanges();
                        if (result.length > 0)
                            this.totalCount = result[0].totalCount;
                        else
                            this.totalCount = 0;
                        if ((this.totalCount > this.state.take)) {
                            this.pageable = true;
                        }
                        else {
                            this.pageable = false;
                        }
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeavesActionTypes.AddNewLeaveCompleted),
                tap(() => {
                    this.upsertLeavePopUp.forEach((p) => p.closePopover());
                    this.approveLeavePopOver.forEach((p) => p.closePopover());
                    this.getAllLeaves();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.page.pageNumber = 1;
        this.userId = '';
        this.page.size = 10;
        this.leaveDateFromFilter = new Date();
        this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 120);
        super.ngOnInit();
        this.selectedEmployeeId = this.canAccess_feature_ViewCompanyWideLeaves ? null : this.cookieService.get(LocalStorageProperties.CurrentUserId);
        if (this.canAccess_feature_ViewCompanyWideLeaves)
            this.getAllLeaves();

        this.dashboardId ? this.getWorkspaceDashboardsFilter() : this.getAllLeaves();
        this.getAllLeaveTypes();
        this.getAllLeaveSessions();
        this.getAllLeaveStatuses();
        this.initializeForm();
        this.getEntityDropDown();
        this.getSoftLabelConfigurations();
        let teamleadInput;
        if (this.canAccess_feature_ViewCompanyWideLeaves) {
            teamleadInput = {
                isAllUsers: true
            }
        }
        else {
            teamleadInput = {
                isAllUsers: false
            }
        }
        this.leavesService.getTeamLeadsList(teamleadInput).subscribe((response: any) => {
            this.employeeList = response.data;
            if(this.selectedEmployeeId) {
                let index = this.employeeList.findIndex(x => x.teamMemberId.toLowerCase() == this.selectedEmployeeId.toLowerCase());
                if(index > -1) {
                    this.selectedEmployeeName = this.employeeList[index].teamMemberName;
                }
            }
        })
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }
    getAllLeaves() {
        this.isAnyOperationIsInprogress = true;
        let leavesSearchModel = new LeaveModel();
        leavesSearchModel.isArchived = false;
        leavesSearchModel.isCalendarView = this.calanderView;
        leavesSearchModel.branchId = this.selectedBranchId;
        leavesSearchModel.userId = this.selectedEmployeeId;
        leavesSearchModel.leaveTypeId = this.selectedLeaveTypeId;
        leavesSearchModel.overallLeaveStatusId = this.selectedLeaveStatus;
        leavesSearchModel.date = this.fromDate;
        leavesSearchModel.leaveDateFrom = this.leaveDateFromFilter;
        leavesSearchModel.leaveDateTo = this.leaveDateToFilter;
        leavesSearchModel.pageSize = this.state.take;
        leavesSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;
        leavesSearchModel.sortBy = this.sortBy;
        leavesSearchModel.sortDirectionAsc = this.sortDirection;
        leavesSearchModel.entityId = this.selectedEntityId;
        this.store.dispatch(new LoadLeavesTriggered(leavesSearchModel));
        this.isLoadingLeavesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeavesInprogress));
    }
    archiveLeave() {
        let archiveLeaveModel = new LeaveModel();
        this.closeArchiveLeavePopup();
        archiveLeaveModel = Object.assign({}, this.leaveDetails);
        archiveLeaveModel.isArchived = true;
        this.isHistoryVisible = false;
        this.store.dispatch(new AddNewLeaveTriggered(archiveLeaveModel));
        this.isUpsertLeaveInprogress$ = this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveInprogress));
    }
    getAllLeaveSessions() {
        var leaveSessionModel = new LeaveSessionModel();
        leaveSessionModel.isArchived = false;

        this.leavesManagementService.getAllLeaveSessions(leaveSessionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.leaveSessionList = response.data;
            }
        });

    }

    getAllLeaveStatuses() {
        let leaveStatusDetails = new LeaveStatusModel();

        this.leavesManagementService.getAllLeaveStatuss(leaveStatusDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.leaveStatuses = response.data;
            }
        });
    }

    getAllLeaveTypes() {
        var leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        this.store.dispatch(new LoadLeaveTypesTriggered(leaveTypeSearchModel));
        this.leaveTypesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesAll));
    }

    applyLeaveRoute() {
        this.routes.navigate(['leavemanagement/new-leave-type']);
        this.closePopUpEmit();
    }

    getWorkspaceDashboardsFilter() {
        this.isAnyOperationIsInprogress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        this.leavesService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data && responseData.data.length > 0) {
                        let dashboardFilters = responseData.data[0];
                        this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
                        this.calanderView = dashboardFilters.isCalenderView;
                        let filters = JSON.parse(dashboardFilters.filterJson);
                        this.workspaceFilterModel = filters;
                        this.selectedBranchId = this.workspaceFilterModel.selectedBranchId;
                        this.selectedEntityId = this.workspaceFilterModel.selectedEntityId;
                        this.selectedLeaveTypeId = this.workspaceFilterModel.selectedLeaveTypeId;
                        this.selectedLeaveStatus = this.workspaceFilterModel.selectedLeaveStatus;
                        this.selectedEmployeeId = this.workspaceFilterModel.selectedEmployeeId;
                        this.leaveDateFromFilter = this.workspaceFilterModel.leaveDateFromFilter;
                        this.leaveDateToFilter = this.workspaceFilterModel.leaveDateToFilter;
                        this.fromDate = this.workspaceFilterModel.fromDate;
                        this.isOpen = this.workspaceFilterModel.isOpen;
                        this.selectedViewType = this.workspaceFilterModel.selectedViewType;
                        this.getAllLeaves();
                        this.cdRef.detectChanges();
                    }
                    else {
                        this.getAllLeaves();
                    }
                } else {
                    this.getAllLeaves();
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                }
            });
    }

    updateWorkspaceDashboardFilters() {
        if (this.dashboardId) {
            this.updatePersistanceInprogress = true;
            let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
            workspaceDashboardFilterModel.isCalenderView = this.calanderView;
            workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
            workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
            this.workspaceFilterModel.selectedBranchId = this.selectedBranchId;
            this.workspaceFilterModel.selectedLeaveTypeId = this.selectedLeaveTypeId;
            this.workspaceFilterModel.selectedLeaveStatus = this.selectedLeaveStatus;
            this.workspaceFilterModel.selectedEmployeeId = this.selectedEmployeeId;
            this.workspaceFilterModel.leaveDateFromFilter = this.leaveDateFromFilter;
            this.workspaceFilterModel.leaveDateToFilter = this.leaveDateToFilter;
            this.workspaceFilterModel.fromDate = this.fromDate;
            this.workspaceFilterModel.isOpen = this.isOpen;
            this.workspaceFilterModel.selectedEntityId = this.selectedEntityId;
            this.workspaceFilterModel.selectedViewType = this.selectedViewType;
            workspaceDashboardFilterModel.filterJson = JSON.stringify(this.workspaceFilterModel);
            this.leavesService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
                .subscribe((responseData: any) => {
                    if (responseData.success) {
                        this.workspaceDashboardFilterId = responseData.data;
                        this.updatePersistanceInprogress = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                        this.updatePersistanceInprogress = false;
                        this.cdRef.markForCheck();
                    }
                });
        }
    }
    schedulerViewChanged(event) {
        this.selectedViewType = event;
        this.updateWorkspaceDashboardFilters();
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
                Validators.compose([
                ])
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
                Validators.compose([
                ])
            ),
        })
    }

    applyLeavePopupOpen(applyLeavePopup) {
        applyLeavePopup.openPopover();
    }

    closeUpsertLeavePopup() {
        this.initializeForm();
        this.upsertLeavePopUp.forEach((p) => p.closePopover());
    }

    upsertLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = this.leaveForm.value;
        this.store.dispatch(new AddNewLeaveTriggered(leaveUpsertModel));
        this.isUpsertLeaveInprogress$ = this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveInprogress));
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getAllLeaves();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.state.skip = 0;
        this.getAllLeaves();
    }

    toggleIsOnBehalfOfOthers() {
        this.showEmployeeDropdown = !this.showEmployeeDropdown;
        if (this.showEmployeeDropdown) {
            this.leaveForm.controls['userId'].setValidators(Validators.required);
            this.leaveForm.controls['userId'].updateValueAndValidity();
        }
        else {
            this.leaveForm.get('userId').clearValidators();
            this.leaveForm.get('userId').updateValueAndValidity();
        }
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    closeSearch() {
        this.searchText = '';
        this.nameFilterIsActive = false;
    }

    search() {
        if (this.searchText.length <= 0)
            this.nameFilterIsActive = false;
        else {
            this.searchText = this.searchText.trim();
            if (this.searchText.length > 0) {
                this.nameFilterIsActive = true;
            }
            else {
                this.nameFilterIsActive = false;
                return;
            }
        }
        this.getAllLeaves();
    }

    searchByLeaveType(leaveType) {
        this.searchByLeaveTypeFilterIsActive = true;
        if (leaveType == "all") {
            this.selectedLeaveTypeId = "";
        }
        else {
            this.selectedLeaveTypeId = leaveType.leaveTypeId;
            this.selectedLeaveType = leaveType.leaveTypeName;
        }
        this.leaveTypePopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    searchByEntityId(entity) {
        this.entityIsActive = true;
        if (entity == "all") {
            this.selectedEntityId = "";
        }
        else {
            this.selectedEntityId = entity.id;
            this.selectedBranch = entity.name;
        }
        this.entityPopover.close();
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    // searchByBranch(branch) {
    //     this.searchByBranchFilterIsActive = true;
    //     if (branch == "all") {
    //         this.selectedBranchId = "";
    //     }
    //     else {
    //         this.selectedBranchId = branch.branchId;
    //         this.selectedBranch = branch.branchName;
    //     }
    //     this.leaveTypePopover.close();
    //     this.state.skip = 0;
    //     this.updateWorkspaceDashboardFilters();
    //     this.getAllLeaves();
    //   }

    searchByLeaveStatus(leaveStatus) {
        this.leaveStatusFilterIsActive = true;
        if (leaveStatus == "all") {
            this.selectedLeaveStatus = "";
        }
        else {
            this.selectedLeaveStatus = leaveStatus.leaveStatusId;
            this.leaveStatusSelected = leaveStatus.leaveStatusName;
        }
        this.leaveStatusPopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    searchByEmployeeName(employee) {
        this.nameFilterIsActive = true;
        if (employee == "all") {
            this.selectedEmployeeId = "";
        }
        else {
            this.selectedEmployeeId = employee.userId;
            this.selectedEmployeeName = employee.userName;
        }
        this.namePopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    searchByTeamMemberName(employee) {
        this.nameFilterIsActive = true;
        if (employee == "all") {
            this.selectedEmployeeId = "";
        }
        else {
            this.selectedEmployeeId = employee.teamMemberId;
            this.selectedEmployeeName = employee.teamMemberName;
        }
        this.namePopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    onDateFromChange(event: MatDatepickerInputEvent<Date>) {
        this.dateFilterIsActive = true;
        this.fromDate = event.target.value;
        this.datePopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    onLeaveDateFromChange(event: MatDatepickerInputEvent<Date>) {
        this.dateFromFilterIsActive = true;
        this.leaveDateFromFilter = event.target.value;
        this.minDate = this.leaveDateFromFilter;
        this.dateFromPopover.close();
        this.state.skip = 0;
        this.getAllLeaves();
    }

    onLeaveDateToChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToFilterIsActive = true;
        this.leaveDateToFilter = event.target.value;
        this.dateToPopover.close();
        this.state.skip = 0;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    resetAllFilters() {
        this.searchText = '';
        this.selectedLeaveTypeId = null;
        this.selectedLeaveStatus = null;
        this.selectedEmployeeId = null;
        this.selectedBranchId = null;
        this.selectedEntityId = null;
        this.fromDate = null;
        this.nameFilterIsActive = false;
        this.searchByLeaveTypeFilterIsActive = false;
        this.leaveStatusFilterIsActive = false;
        this.entityIsActive = false;
        this.dateFilterIsActive = false;
        this.dateToFilterIsActive = false;
        this.dateFromFilterIsActive = false;
        this.leaveDateFromFilter = new Date();
        this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 120);
        this.leaveDateToFilter = null;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    approveLeavePopupOpen(row, approveLeavePopUp) {
        this.leaveDetails = row;
        approveLeavePopUp.openPopover();
    }

    approveLeave(e) {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = Object.assign({}, this.leaveDetails);
        leaveUpsertModel.isApproved = e;
        if (!e) {
            leaveUpsertModel.leaveReason = this.reason.value;
        }
        leaveUpsertModel.isAdminApprove = true;
        this.leavesService.approveOrRejectLeave(leaveUpsertModel).subscribe((result: any) => {
            if (result.success) {
                this.closeApproveLeavePopup();
                this.closeRejectLeavePopup();
                this.getAllLeaves();
            }
            else {
                this.toastr.error(result.apiResponseMessages[0].message);
            }
        });
    }

    closeApproveLeavePopup() {
        this.approveLeavePopOver.forEach((p) => p.closePopover());
        this.closeHistorywindow();
    }

    closeRejectLeavePopup() {
        this.rejectLeavePopOver.forEach((p) => p.closePopover());
        this.reason = new FormControl("", [Validators.required, Validators.maxLength(500)]);
        this.closeHistorywindow();
    }

    rejectLeavePopupOpen(row, rejectLeavePopup) {
        this.leaveDetails = row;
        rejectLeavePopup.openPopover();
    }

    closeArchiveLeavePopup() {
        this.archiveLeavePopOver.forEach((p) => p.closePopover());
        this.reason = new FormControl("", [Validators.required, Validators.maxLength(500)])
    }

    rejectLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = Object.assign({}, this.leaveDetails);
        leaveUpsertModel.isApproved = false;
        this.leavesService.approveOrRejectLeave(leaveUpsertModel).subscribe((response: any) => {
            if (response.success) {
                this.closeArchiveLeavePopup();
                this.getAllLeaves();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        })
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    closeHistorywindow() {
        this.isHistoryVisible = false;
        this.cdRef.detectChanges();

    }

    state: State = {
        skip: 0,
        take: 15,
    };

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getAllLeaves();
        // this.gridData = process(this.leavesList, this.state);

    }
    selectedRow(e) {
        this.closeHistorywindow();
        this.isHistoryVisible = true;
        this.leaveApplicationModel = e.dataItem;
        this.leaveApplicationId = e.dataItem.leaveApplicationId;
    }

    selectedEvent(e) {
        this.isHistoryVisible = true;
        this.leaveApplicationId = e.id;
        this.leaveApplicationModel = this.calanderList.find(x => x.id == this.leaveApplicationId)
    }

    getCalanderView() {
        this.calanderView = !this.calanderView;
        this.updateWorkspaceDashboardFilters();
        this.getAllLeaves();
    }

    getEntityDropDown() {
        let searchText = "";
        this.leavesService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    filterStatus() {
        if (
            this.selectedLeaveTypeId || this.selectedLeaveStatus || this.selectedEmployeeId ||
            this.selectedBranchId || this.fromDate || this.leaveDateFromFilter ||
            this.leaveDateToFilter) {
            return true;
        }
        else
            return false;
    }

    clearDate(a) {
        if (a == 1) {
            this.leaveDateFromFilter = null
        }
        if (a == 2) {
            this.leaveDateToFilter = null
        }
        if (a == 3) {
            this.fromDate = null
        }
        this.getAllLeaves();
    }
    profilePage(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
        this.closePopUpEmit();
    }

    closePopUpEmit() {
        this.closePopUp.emit(true);
    }

    setHeightParent() {
        if (this.fromLeaves) {
            let styles = {
                "height": 'calc(100vh - 100px)'
            };
            return styles;
        }
        else if (this.fromRoute) {
            let styles = {
                "height": 'calc(100vh - 160px)'
            };
            return styles;
        }
        else {
            let styles = {
                "display": 'flex'
            };
            return styles;
        }
    }

    setHeight() {
        let value = this.filterStatus();
        if (this.fromLeaves && value) {
            let styles = {
                // "height": '89%'
            };
            return styles;
        }
        else if (this.fromLeaves && !value) {
            let styles = {
                // "height": '94%'
            };
            return styles;
        }
        else {
            let styles = {
                "display": 'flex'
            };
            return styles;
        }
    }
}