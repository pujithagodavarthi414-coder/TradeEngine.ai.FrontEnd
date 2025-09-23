import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { GridDataResult, DataStateChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LeavesService } from '../services/leaves-service';
import { LeaveManagementService } from '../services/leaves-management-service';
import { LeaveSessionModel } from '../models/leave-session-model';
import { LeaveStatusModel } from '../models/leave-status-model';
import { Page } from '../models/Page';
import {LocalStorageProperties} from '../../globaldependencies/constants/localstorage-properties';
import {SoftLabelConfigurationModel} from '../models/softlabels-model';

@Component({
    selector: 'app-fm-component-leave-list',
    templateUrl: `leave-list.component.html`,
})

export class LeavesListComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("upsertLeavePopUp") upsertLeavePopUp;
    @ViewChild('leaveTypePopover') leaveTypePopover: SatPopover;
    @ViewChild('leaveStatusPopover') leaveStatusPopover: SatPopover;
    @ViewChild('datePopover') datePopover: SatPopover;
    @ViewChild('namePopover') namePopover: SatPopover;
    @ViewChildren('approveLeavePopUp') approveLeavePopOver;
    @ViewChildren('rejectLeavePopUp') rejectLeavePopOver;
    @ViewChild('dateFromPopover') dateFromPopover: SatPopover;
    @ViewChild('dateToPopover') dateToPopover: SatPopover;

    leavesList$: Observable<LeaveModel[]>;
    leaveTypesList$: Observable<any>;
    employeeList: any[];
    isLoadingLeavesList$: Observable<boolean>;
    isUpsertLeaveInprogress$: Observable<boolean>;
    leaveDetails: LeaveModel;
    page = new Page();
    leaveList: any;
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
    leaveApplicationModel: any;
    leaveDateFromFilter: Date;
    leaveDateToFilter: Date;
    minDate: Date;
    dateFromFilterIsActive: boolean = false;
    dateToFilterIsActive: boolean = false;
    totalCount: number;
    selectedEmployeeName: string;
    selectedBranch: string;
    selectedLeaveType: string;
    leaveStatusSelected: string;
    displayFilters: boolean;
    softLabels:SoftLabelConfigurationModel[];

    constructor(private store: Store<LeaveTypeState.State>, private routes: Router,
        private actionUpdates$: Actions,private leavesService: LeavesService, 
        private leavesManagementService: LeaveManagementService, private toastr: ToastrService,
         private cdRef: ChangeDetectorRef) {
        super();
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
                        if (result.length)
                            this.totalCount = result[0].totalCount;
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
        this.page.size = 10;
        this.leaveDateFromFilter = new Date();
        this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 120);
        super.ngOnInit();
        this.getAllLeaves();
        this.getAllLeaveTypes();
        this.getAllLeaveSessions();
        this.getAllLeaveStatuses();
        this.getSoftLabelConfigurations();
        let teamleadInput = {
            
        }
        this.leavesService.getTeamLeadsList(teamleadInput).subscribe((response: any) => {
            this.employeeList = response.data;
            if(this.employeeList.length > 0){
                this.employeeList = this.employeeList.filter(x => x.isActive == 1);
            }
        })
        // this.getAllEmployees();
        this.initializeForm();
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
        leavesSearchModel.userId = this.selectedEmployeeId;
        leavesSearchModel.leaveTypeId = this.selectedLeaveTypeId;
        leavesSearchModel.overallLeaveStatusId = this.selectedLeaveStatus;
        leavesSearchModel.date = this.fromDate;
        leavesSearchModel.leaveDateFrom = this.leaveDateFromFilter;
        leavesSearchModel.leaveDateTo = this.leaveDateToFilter;
        leavesSearchModel.pageSize = this.state.take;
        leavesSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;
        leavesSearchModel.sortBy = this.sortBy;
        leavesSearchModel.isWaitingForApproval = true;
        leavesSearchModel.sortDirectionAsc = this.sortDirection;
        this.store.dispatch(new LoadLeavesTriggered(leavesSearchModel));
        this.leavesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeavesAll));
        this.isLoadingLeavesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeavesInprogress));
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
    }

    // getAllEmployees() {
    //     var employeeSearchResult = new EmployeeListModel();
    //     employeeSearchResult.isArchived = false;
    //     this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeSearchResult));
    //     this.employeeList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeAll));
    // }

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
        this.page.size = 10;
        this.page.pageNumber = 1;
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
        // this.getAllEmployees();
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
        this.getAllLeaves();
    }


    searchByLeaveStatus(leaveStatusId) {
        this.leaveStatusFilterIsActive = true;
        if (leaveStatusId == "all") {
            this.selectedLeaveStatus = "";
        }
        else {
            this.selectedLeaveStatus = leaveStatusId;
        }
        this.leaveStatusPopover.close();
        this.state.skip = 0;
        this.getAllLeaves();
    }

    searchByEmployeeName(employee) {
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
        this.getAllLeaves();
    }

    onDateFromChange(event: MatDatepickerInputEvent<Date>) {
        this.dateFilterIsActive = true;
        this.fromDate = event.target.value;
        this.datePopover.close();
        this.state.skip = 0;
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
        this.getAllLeaves();
    }

    resetAllFilters() {
        this.searchText = '';
        this.selectedLeaveTypeId = null;
        this.selectedLeaveStatus = null;
        this.selectedEmployeeId = null;
        this.fromDate = null;
        this.nameFilterIsActive = false;
        this.searchByLeaveTypeFilterIsActive = false;
        this.leaveStatusFilterIsActive = false;
        this.dateFilterIsActive = false;
        this.dateToFilterIsActive = false;
        this.dateFromFilterIsActive = false;
        this.leaveDateFromFilter = new Date();
        this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 120);
        this.leaveDateToFilter = null;
        this.getAllLeaves();
    }

    approveLeavePopupOpen(row, approveLeavePopUp) {
        this.leaveDetails = row;
        approveLeavePopUp.openPopover();
    }

    rejectLeavePopupOpen(row, rejectLeavePopup) {
        this.leaveDetails = row;
        rejectLeavePopup.openPopover();
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

    approveLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = Object.assign({}, this.leaveDetails);
        leaveUpsertModel.isApproved = true;
        this.leavesService.approveOrRejectLeave(leaveUpsertModel).subscribe((result: any) => {
            if (result.success) {
                this.closeApproveLeavePopup();
                this.getAllLeaves();
            }
            else {
                this.toastr.error(result.apiResponseMessages[0].message);
            }
        });
    }

    rejectLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = Object.assign({}, this.leaveDetails);
        leaveUpsertModel.isApproved = false;
        leaveUpsertModel.leaveReason = this.reason.value;
        this.leavesService.approveOrRejectLeave(leaveUpsertModel).subscribe((response: any) => {
            if (response.success) {
                this.closeRejectLeavePopup();
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

    // onSelect(selected) {
    //     this.isHistoryVisible = true;
    //     this.leaveApplicationId = selected.selected[0].leaveApplicationId;
    // }

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
    }
    selectedRow(e) {
        this.isHistoryVisible = true;
        this.leaveApplicationModel = e.dataItem;
        this.leaveApplicationId = e.dataItem.leaveApplicationId;
    }
    filterStatus() {
        if (
            this.selectedLeaveTypeId || this.selectedEmployeeId ||
            this.fromDate || this.leaveDateFromFilter ||
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

    profilePage(e){
        this.routes.navigateByUrl('/dashboard/profile/'+ e +'/overview');
    }
}