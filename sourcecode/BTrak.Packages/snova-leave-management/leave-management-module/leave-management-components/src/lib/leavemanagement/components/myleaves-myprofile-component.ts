import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import * as leaveManagementModuleReducers from "../store/reducers/index";
import * as hrManagementModuleReducer from '../store/reducers/index';
import { State } from '@progress/kendo-data-query';
import { ofType, Actions } from '@ngrx/effects';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LeavesActionTypes, LoadLeavesTriggered, AddNewLeaveTriggered } from '../store/actions/leaves.actions';
import { LoadLeaveTypesTriggered } from '../store/actions/leave-types.actions';
import { CookieService } from 'ngx-cookie-service';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import * as commonModuleReducers from "../store/reducers/index";
import { AppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LeaveModel } from '../models/leave-model';
import { Page } from '../models/Page';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { LeaveSessionModel } from '../models/leave-session-model';
import { LeaveManagementService } from '../services/leaves-management-service';
import { LeaveStatusModel } from '../models/leave-status-model';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import { EmployeeListModel } from '../models/employee';
import { LeavesService } from '../services/leaves-service';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-fm-component-my-leaves-list',
    templateUrl: `myleaves-myprofile-component.html`,
})

export class MyLeavesListComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("upsertLeavePopUp") upsertLeavePopUp;
    @ViewChild('leaveTypePopover') leaveTypePopover: SatPopover;
    @ViewChild('leaveStatusPopover') leaveStatusPopover: SatPopover;
    @ViewChild('datePopover') datePopover: SatPopover;
    @ViewChild('dateFromPopover') dateFromPopover: SatPopover;
    @ViewChild('dateToPopover') dateToPopover: SatPopover;
    @ViewChild('namePopover') namePopover: SatPopover;
    @ViewChildren('approveLeavePopUp') approveLeavePopOver;
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    fromCustomApp: boolean = false;
    Ids: string;
    

    @Input("Ids")
    set _Ids(Ids) {
        this.fromCustomApp = true;
        this.Ids = Ids;
    }
    
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
      if (data && data !== undefined) {
        this.dashboardFilters = data;
        if(this.dashboardFilters.userId){
            this.loggedInUserId = this.dashboardFilters.userId;
        }
        else{
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if(this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo){

            var dateFromStr = this.datePipe.transform(this.dashboardFilters.dateFrom, 'yyyy-MM-dd');
            this.leaveDateFromFilter = new Date(dateFromStr);
            var dateToStr = this.datePipe.transform(this.dashboardFilters.dateTo, 'yyyy-MM-dd');
            this.leaveDateToFilter = new Date(dateToStr);
        }
        else{
            if(this.dashboardFilters.date){
                var dateStr = this.datePipe.transform(this.dashboardFilters.date, 'yyyy-MM-dd');
                this.fromDate = new Date(dateStr);
            }
        }
        this.getAllLeaves();
      }
    }

    dashboardFilters: DashboardFilterModel;
    leavesList$: Observable<LeaveModel[]>;
    leaveTypesList$: Observable<any>;
    employeeList = [];
    isLoadingLeavesList$: Observable<boolean>;
    isUpsertLeaveInprogress$: Observable<boolean>;
    leaveDetails: LeaveModel;
    page = new Page();
    leavesList: GridDataResult;
    leaveSessionList: any;
    leaveStatuses: any;
    ngDestroyed$ = new Subject();
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    isOpen: boolean = true;
    isApplyLeave = true;
    showEmployeeDropdown: boolean = false;
    nameFilterIsActive: boolean = false;
    searchByLeaveTypeFilterIsActive: boolean = false;
    leaveStatusFilterIsActive: boolean = false;
    dateFilterIsActive: boolean = false;
    dateFromFilterIsActive: boolean = false;
    dateToFilterIsActive: boolean = false;
    applyLeaveForm: FormGroup;
    selectedLeaveTypeId: string;
    selectedEmployeeId: string;
    selectedLeaveStatus: string;
    loggedInUserId: string;
    fromDate: Date;
    minDateForEndDate = new Date();
    endDateBool = true;
    leaveAppliedOnBehalfUserId: string;
    isReApply: boolean;
    isHistoryVisible: boolean = false;
    leaveApplicationId: string;
    pageable: boolean = false;
    leaveApplicationModel: any;
    leaveDateFromFilter: Date;
    leaveDateToFilter: Date;
    minDate: Date;
    isMyleaves: boolean = true;
    totalCount: number;
    calanderView: boolean = false;
    calanderList: LeaveModel[];
    selectedBranch: string;
    selectedLeaveType: string;
    leaveStatusSelected: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    permission: boolean;

    constructor(
        private store: Store<State>, private routes: Router, private leavesService: LeavesService,
        private actionUpdates$: Actions, private leavesManagementService: LeaveManagementService,
        private cookieService: CookieService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe) {
        super();
        if (this.routes.url.split("/")[3])
            this.loggedInUserId = this.routes.url.split("/")[3];
        else
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);

        if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
            if (this.routes.url.split("/")[3].toLowerCase() == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
                this.permission = true;
            }
            else {
                this.permission = false;
            }
        }

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(LeavesActionTypes.LoadLeavesCompleted),
                tap(() => {
                    this.leavesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeavesAll));
                    this.leavesList$.subscribe((result) => {
                        this.isHistoryVisible = false;
                        this.leavesList = {
                            data: result,
                            total: result.length > 0 ? result[0].totalCount : 0,
                        }
                        if (result.length) {
                            this.totalCount = result[0].totalCount;
                            this.calanderList = result;
                            this.cdRef.detectChanges();
                        }
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
                    this.closeUpsertLeavePopup();
                    this.approveLeavePopOver.forEach((p) => p.closePopover());
                    this.getAllLeaves();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.page.pageNumber = 1;
        this.page.size = 10;
        
            if (!this.Ids && !this.routes.url.includes('/productivity/dashboard')) {
                this.leaveDateFromFilter = new Date();
                this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 30);
            }
        
        super.ngOnInit();
        this.getAllLeaves();
        this.getAllLeaveTypes();
        this.getAllLeaveSessions();
        this.getAllLeaveStatuses();
        this.getAllEmployees();
        this.initializeForm();
    }

    getAllLeaves() {
        let leavesSearchModel = new LeaveModel();
        this.Ids ? leavesSearchModel.leaveApplicationIds = this.Ids : null;
        leavesSearchModel.isArchived = false;
        if(this.loggedInUserId == 'myproductivity'){
            this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        this.Ids ? leavesSearchModel.userId = null : leavesSearchModel.userId = this.loggedInUserId;
        leavesSearchModel.leaveTypeId = this.selectedLeaveTypeId;
        leavesSearchModel.overallLeaveStatusId = this.selectedLeaveStatus;
        leavesSearchModel.date = this.fromDate;
        leavesSearchModel.isCalendarView = this.calanderView;
        leavesSearchModel.leaveDateFrom = this.leaveDateFromFilter;
        leavesSearchModel.leaveDateTo = this.leaveDateToFilter;
        leavesSearchModel.pageSize = this.state.take;
        leavesSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;
        leavesSearchModel.sortBy = this.sortBy;
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
        leaveTypeSearchModel.isApplyLeave = true;
        leaveTypeSearchModel.userId = this.leaveAppliedOnBehalfUserId;
        this.store.dispatch(new LoadLeaveTypesTriggered(leaveTypeSearchModel));
        this.leaveTypesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesAll));
    }

    applyLeaveRoute() {
        this.routes.navigate(['leavemanagement/new-leave-type']);
    }

    getAllEmployees() {
        var employeeSearchResult = new EmployeeListModel();
        employeeSearchResult.isArchived = false;
        employeeSearchResult.isActive = true;
        employeeSearchResult.sortDirectionAsc = true;
        this.leavesService.getAllEmployees(employeeSearchResult).subscribe((result: any) => {
            if (result.success) {
                this.employeeList = result.data;
                let index = this.employeeList.findIndex(x => x.userId == this.loggedInUserId);
                if (index != -1)
                    this.employeeList.splice(index, 1);
                this.cdRef.detectChanges();
            }
        });
    }

    initializeForm() {
        this.applyLeaveForm = new FormGroup({
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
                    //Validators.required,
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

    applyLeavePopupOpen(upsertLeavePopUp) {
        this.isHistoryVisible = false;
        this.leaveAppliedOnBehalfUserId = null;
        this.getAllLeaveTypes();
        upsertLeavePopUp.openPopover();
    }

    closeUpsertLeavePopup() {
        this.showEmployeeDropdown = false;
        this.formDirective.resetForm();
        this.initializeForm();
        this.upsertLeavePopUp.forEach((p) => p.closePopover());
    }

    upsertLeave() {
        let leaveUpsertModel = new LeaveModel();
        leaveUpsertModel = this.applyLeaveForm.value;
        this.store.dispatch(new AddNewLeaveTriggered(leaveUpsertModel));
        this.isUpsertLeaveInprogress$ = this.store.pipe(select(leaveManagementModuleReducers.upsertLeaveInprogress));
    }
    reApply(leaveDetails) {
        this.isHistoryVisible = false;
        let leaveReApplyModel = new LeaveModel();
        leaveReApplyModel = leaveDetails;
        this.store.dispatch(new AddNewLeaveTriggered(leaveReApplyModel));
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
            this.applyLeaveForm.controls['userId'].setValidators(Validators.required);
            this.applyLeaveForm.controls['userId'].updateValueAndValidity();
        }
        else {
            this.applyLeaveForm.get('userId').clearValidators();
            this.applyLeaveForm.get('userId').setValue("");
            this.applyLeaveForm.get('userId').updateValueAndValidity();
            this.getSelectedEmployeesLeaveTypes(null);
        }
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    closeSearch() {
        this.searchText = '';
        this.nameFilterIsActive = false;
        this.getAllEmployees();
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

    getSelectedEmployeesLeaveTypes(userId) {
        this.applyLeaveForm.get('leaveTypeId').setValue(null);
        this.leaveAppliedOnBehalfUserId = userId;
        this.getAllLeaveTypes();
    }

    searchByLeaveType(leaveType) {
        this.searchByLeaveTypeFilterIsActive = true;
        if (leaveType == "all") {
            this.selectedLeaveTypeId = "";
            this.selectedLeaveType = null;
        }
        else {
            this.selectedLeaveTypeId = leaveType.leaveTypeId;
            this.selectedLeaveType = leaveType.leaveTypeName;
        }
        this.leaveTypePopover.close();
        this.state.skip = 0;
        this.getAllLeaves();
    }

    searchByLeaveStatus(leaveStatus) {
        this.leaveStatusFilterIsActive = true;
        if (leaveStatus == "all") {
            this.selectedLeaveStatus = "";
            this.leaveStatusSelected = null;
        }
        else {
            this.selectedLeaveStatus = leaveStatus.leaveStatusId;
            this.leaveStatusSelected = leaveStatus.leaveStatusName;
        }
        this.leaveStatusPopover.close();
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
        this.leaveDateFromFilter.setDate(this.leaveDateFromFilter.getDate() - 30);
        this.leaveDateToFilter = null;
        this.getAllLeaves();
    }

    startDate() {
        if (this.applyLeaveForm.value.leaveDateFrom) {
            this.minDateForEndDate = this.applyLeaveForm.value.leaveDateFrom;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.applyLeaveForm.controls["leaveDateTo"].setValue("");
        }
    }

    closeHistorywindow() {
        this.isHistoryVisible = false;
        this.cdRef.detectChanges();

    }

    state: State = {
        skip: 0,
        take: 20,
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
        this.getAllLeaves();
    }

    filterStatus() {
        if (
            this.selectedLeaveTypeId || this.selectedLeaveStatus ||
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
}
