import { Component, ChangeDetectorRef, ViewChildren, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { PermissionReasons } from '../models/leavesession-model';
import { TimeSheetPermissionsInputModel } from '../models/timesheet-model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TimeSheetService } from '../services/timesheet.service';
import { TimeSheetManagementPermissionModel } from '../models/time-sheet-management-permission-model';
import { Store, select } from '@ngrx/store';
import { PermissionReasonModel } from '../models/permission-reason-model';
import { Observable, Subject, Subscription } from 'rxjs';
import { State } from "../store/reducers/index";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as timeSheetModuleReducer from '../store/reducers/index';
import { tap, takeUntil } from "rxjs/operators";
import { ofType, Actions } from '@ngrx/effects';
import { LoadPermissionHistoryUsersTriggered, PermissionHistoryActionTypes } from '../store/actions/permission-history.action';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import "../../globaldependencies/helpers/fontawesome-icons";
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { PermissionsHistoryDetails } from '../models/PermissionsHistory';
import { SelectEmployeeDropDownList } from '../models/selectEmployeeDropDown';
import { SelectReasonDropDownList } from '../models/selectReasonDropDown';
import { Page } from '../models/Page';
import { UserModel } from '../models/user';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
        selector: 'app-hr-component-permissionHistory',
        templateUrl: 'permissionHistory.component.html'
})

export class PermissionHistoryComponent extends CustomAppBaseComponent implements OnInit {
        @ViewChildren("upsertPermissionpopup") upsertPermissionPopover;
        @ViewChildren("deletePermissionPopover") deletePermissionPopovers;

        @Input("dashboardFilters")
        set _dashboardFilters(data: DashboardFilterModel) {
                if (data && data !== undefined) {
                        this.dashboardFilters = data;
                }
        }

        dashboardFilters: DashboardFilterModel;
        permissionHistoryDetailsValue: PermissionsHistoryDetails[];
        selectEmployeeDetails: SelectEmployeeDropDownList[];
        selectReasonDetails: SelectReasonDropDownList[];
        sort: string;
        anyOperationInProgress: boolean;
        checked1: boolean;
        permissionsSkip: number = 0;
        permissionsPageSize: number = 10;
        permissionsSortBy: string;
        permissionsSortDirection: boolean;
        permissionsPageNumber: number = 1;
        permissionsSearchText: string;
        permissionList: any;
        permissionReasonList: PermissionReasons[];
        buttonText: string;
        titleHead: string;
        EditDeadLine: boolean;
        permissionModel: TimeSheetManagementPermissionModel;
        permissionForm: FormGroup;
        showSpinner: boolean;
        permissionListdata: any[];
        permissionDelete: any;
        dateToValue: Date;
        dateFromValue: Date;
        validationmessage: string;
        dateTo = new Date();
        dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
        maxDate = new Date();
        minDate = this.dateFrom;
        dateFromSelected = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
        dateToSelected = new Date();
        usersId: string;
        permissionReasonId: string;
        permissionId: string;
        fullName: string;
        date: Date;
        duration: string;
        isMorning: string;
        reasonId: string;
        userName: string;
        timeStamp: any;
        isThereAnError: boolean;
        isPermissionDeleted: boolean;
        employeeName: string;
        isAnyOperationIsInprogress: boolean;
        isArchived: boolean = false;
        permissionReasonModel: PermissionReasonModel;
        page = new Page();
        sortBy: string;
        sortDirection: boolean;
        selectedReason: string = '';
        searchEmployee: string = '';
        employeeSelectedValue: boolean = false;
        employeeList: UserModel[];
        employeeList$: Observable<UserModel[]>;
        employeeLoading$: Observable<boolean>;
        scrollbarH: boolean;
        public ngDestroyed$ = new Subject();
        subscription: Subscription;
        isValidDuration: boolean = false;
        selectedEntity: string;
        entities: EntityDropDownModel[];

        softLabels: SoftLabelConfigurationModel[];
        durationTimepicker: any;
        employeesDropDown: any;
        employeeLoading: boolean;

        constructor(private toastr: ToastrService, private store: Store<State>, private translateService: TranslateService, private timeSheetService: TimeSheetService, private snackbar: MatSnackBar,
                private cdRef: ChangeDetectorRef, private actionUpdates$: Actions) {
                super();
                this.page.size = 10;
                this.page.pageNumber = 0;
                this.getAllPermissionReasons();
                this.getPermissionDetails();
                this.actionUpdates$
                        .pipe(
                                takeUntil(this.ngDestroyed$),
                                ofType(PermissionHistoryActionTypes.LoadPermissionHistoryUsersCompleted),
                                tap(() => {
                                        this.employeeList$ = this.store.pipe(select(timeSheetModuleReducer.getUserAll), tap(employees => {
                                                this.employeeList = employees;
                                                if (this.employeeList.length === 0) {
                                                        this.permissionListdata = [];
                                                        this.page.totalElements = 0;
                                                        this.page.totalPages = this.page.totalElements / this.page.size;
                                                        this.cdRef.markForCheck();
                                                }
                                                else {
                                                        this.getPermissionDetails();
                                                }
                                        }));
                                })
                        )
                        .subscribe();
                window.onresize = () => {
                        this.scrollbarH = (window.innerWidth < 1200);
                };

        }

        ngOnInit() {
                this.clearForm();
                super.ngOnInit();
                this.getSoftLabels();
                this.getEntityDropDown();
                this.employeeLoading$ = this.store.pipe(select(timeSheetModuleReducer.getPermissionHistoryLoading));
        }

        getSoftLabels() {
                this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
                this.cdRef.markForCheck();
        }

        getAllPermissionReasons() {
                this.timeSheetService.getAllPermissionReasons().subscribe((responseData: any) => {
                        this.permissionReasonList = responseData.data;
                })
        }

        loadUsers() {
                // const userModel = new UserModel();
                // userModel.employeeNameText = '';
                // this.store.dispatch(new LoadPermissionHistoryUsersTriggered(userModel));
                this.employeeLoading = true;
                var searchModel = {
                        searchText: this.searchEmployee
                }
                this.timeSheetService.getTeamLeadsList(searchModel).subscribe((responseData: any) => {
                        this.employeesDropDown = responseData.data;
                        this.employeeLoading = false;
                        if (this.employeesDropDown && this.employeesDropDown.length === 0) {
                                this.permissionListdata = [];
                                this.page.totalElements = 0;
                                this.page.totalPages = this.page.totalElements / this.page.size;
                                this.cdRef.markForCheck();
                        }
                        else {
                                this.getPermissionDetails();
                        }
                })
        }

        dateFromChanged(event: MatDatepickerInputEvent<Date>) {
                this.dateFromSelected = event.target.value;
                this.dateFrom = this.dateFromSelected;
                this.minDate = this.dateFrom;
                this.getPermissionDetails();
        }

        dateToChanged(event: MatDatepickerInputEvent<Date>) {
                this.dateToSelected = event.target.value;
                this.dateToValue = this.dateToSelected;
                this.getPermissionDetails();
        }

        onChangeEmployee(event) {
                const userId = event;
                this.usersId = userId;
                this.getPermissionDetails();
        }

        onChangePermission(event) {
                this.permissionReasonId = event.value;
                this.getPermissionDetails();
        }

        getPermissionDetails() {
                this.isAnyOperationIsInprogress = true;
                var timeSheetPermissionsInputModel = new TimeSheetPermissionsInputModel();
                timeSheetPermissionsInputModel.pageNumber = this.page.pageNumber + 1;
                timeSheetPermissionsInputModel.pageSize = this.page.size;
                timeSheetPermissionsInputModel.sortBy = this.sortBy;
                timeSheetPermissionsInputModel.sortDirectionAsc = this.sortDirection;
                timeSheetPermissionsInputModel.dateFrom = this.dateFrom;
                timeSheetPermissionsInputModel.dateTo = this.dateTo;
                timeSheetPermissionsInputModel.userId = this.usersId;
                timeSheetPermissionsInputModel.permissionId = this.permissionId;
                timeSheetPermissionsInputModel.permissionReasonId = this.permissionReasonId;
                timeSheetPermissionsInputModel.isArchived = this.isArchived;
                timeSheetPermissionsInputModel.entityId = this.selectedEntity;
                this.timeSheetService.getPermissionDetails(timeSheetPermissionsInputModel).subscribe((responseData: any) => {
                        if (responseData.success == true) {
                                this.permissionList = null;
                                this.permissionListdata = responseData.data;
                                this.page.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
                                this.page.totalPages = this.page.totalElements / this.page.size;
                                this.isAnyOperationIsInprogress = false;
                                this.cdRef.markForCheck();
                                this.scrollbarH = true;
                        }
                        else {
                                this.permissionListdata = responseData.data;
                                this.page.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
                                this.page.totalPages = this.page.totalElements / this.page.size;
                                this.cdRef.markForCheck();
                                this.isAnyOperationIsInprogress = false;
                                this.scrollbarH = true;
                        }
                })
        }

        closedialog() {
                this.upsertPermissionPopover.forEach((p) => p.closePopover());
        }

        setPage(pageInfo) {
                this.page.pageNumber = pageInfo.offset;
                this.getPermissionDetails();
        }

        onSort(event) {
                const sort = event.sorts[0];
                this.sortBy = sort.prop;
                if (sort.dir === 'asc')
                        this.sortDirection = true;
                else
                        this.sortDirection = false;
                this.page.pageNumber = 0;
                this.getPermissionDetails();
        }

        editPermissionPopupOpen(timeSheetPermissionsModel, upsertPermissionpopup) {
                this.isValidDuration = false;
                this.permissionModel = timeSheetPermissionsModel;
                this.EditDeadLine = true;
                this.permissionForm = new FormGroup({
                        permissionId: new FormControl(
                                timeSheetPermissionsModel.permissionId
                        ),
                        userId: new FormControl(
                                timeSheetPermissionsModel.userId
                        ),
                        date: new FormControl(
                                timeSheetPermissionsModel.date
                        ), duration: new FormControl(
                                timeSheetPermissionsModel.duration,
                                Validators.compose([
                                        Validators.required])
                        ), isMorning: new FormControl(
                                timeSheetPermissionsModel.isMorning
                        ), reasonId: new FormControl(
                                timeSheetPermissionsModel.reasonId
                        ),
                        username: new FormControl(
                                timeSheetPermissionsModel.username
                        )
                });
                this.durationTimepicker = timeSheetPermissionsModel.duration;
                upsertPermissionpopup.openPopover();

        }

        deletePermission() {
                this.permissionDelete = this.permissionModel;
                this.deletePermissionPopovers.forEach((p) => p.closePopover());
        }

        deletePermissionPopupOpen(permission, deletePermissionPopover) {
                this.permissionId = permission.permissionId;
                this.timeStamp = permission.timeStamp;
                deletePermissionPopover.openPopover();
        }

        closeDeletePopup() {
                this.clearForm;
                this.permissionId = null;
                this.deletePermissionPopovers.forEach((p) => p.closePopover());
        }

        delete() {
                this.isAnyOperationIsInprogress = true;
                let timeSheetManagementPermissionModel = new TimeSheetManagementPermissionModel();
                timeSheetManagementPermissionModel.permissionId = this.permissionId;
                timeSheetManagementPermissionModel.timeStamp = this.timeStamp;
                this.timeSheetService.deleteTimeSheetPermission(timeSheetManagementPermissionModel).subscribe((response: any) => {
                        if (response.success == true) {
                                this.deletePermissionPopovers.forEach((p) => p.closePopover());
                                this.isThereAnError = false;
                                this.permissionId = null;
                                this.getPermissionDetails();
                                this.isAnyOperationIsInprogress = false;
                        }
                        else {
                                this.isAnyOperationIsInprogress = false;
                                this.isThereAnError = true;
                                this.validationmessage = response.apiResponseMessages[0].message;
                        }
                });
        }

        clearForm() {
                this.permissionForm = new FormGroup({
                        permissionId: new FormControl(),
                        userId: new FormControl(),
                        userName: new FormControl(),
                        date: new FormControl(),
                        duration: new FormControl(),
                        isMorning: new FormControl(),
                        reasonId: new FormControl(),
                });
        }

        savePermission(permissionModel) {
                this.isAnyOperationIsInprogress = true;
                let updatedModel;
                if (permissionModel == null) {
                        updatedModel = this.permissionModel;
                        updatedModel.isMorning = this.permissionForm.value.isMorning;
                        updatedModel.permissionReasonId = this.permissionForm.value.reasonId;
                        updatedModel.duration = this.permissionForm.value.duration;
                        updatedModel.userId = this.permissionForm.value.userId;
                        updatedModel.date = this.permissionForm.value.date;
                }
                else {
                        updatedModel = permissionModel;
                }
                this.timeSheetService.saveTimeSheetPermission(updatedModel).subscribe((responseData: any) => {
                        let success = responseData.success;
                        if (success) {
                                this.snackbar.open(this.translateService.instant('PERMISSIONHISTORY.TIMESHEETUPDATEDSUCCESSFULLY'), "", { duration: 3000 });
                                this.permissionId = null;
                                this.getPermissionDetails();
                                this.isAnyOperationIsInprogress = false;
                        }
                        else {
                                this.validationmessage = responseData.apiResponseMessages[0].message;
                                this.toastr.error("", this.validationmessage);
                                this.cdRef.markForCheck();
                                this.getPermissionDetails();
                                this.isAnyOperationIsInprogress = false;
                        }
                })
                this.upsertPermissionPopover.forEach((p) => p.closePopover());
        }

        reset() {
                this.selectedReason = '';
                this.searchEmployee = '';
                this.dateTo = new Date();
                this.dateFrom = new Date(this.dateTo.getFullYear(), this.dateTo.getMonth(), 1);
                this.usersId = '';
                this.permissionId = '';
                this.permissionReasonId = '';
                this.selectedEntity = "";
                this.getPermissionDetails();
        }

        employeeSelected(value) {
                this.employeeSelectedValue = true;
        }

        searchByEmployee() {
                this.employeeSelectedValue = false;
                this.usersId = '';
                // let searchEmployee = JSON.parse(JSON.stringify(this.searchEmployee));
                // const userModel = new UserModel();
                // userModel.employeeNameText = searchEmployee;
                // this.store.dispatch(new LoadPermissionHistoryUsersTriggered(userModel));
                this.loadUsers();
        }

        closeSearchEmployee() {
                this.searchEmployee = '';
                // const userModel = new UserModel();
                // userModel.employeeNameText = this.searchEmployee;
                // this.store.dispatch(new LoadPermissionHistoryUsersTriggered(userModel));
                this.loadUsers();
                this.usersId = '';
                this.getPermissionDetails();
        }

        displayFn(EmployeeId) {
                if (!EmployeeId) {
                        return '';
                }
                else {
                        let Employee = this.employeesDropDown.find(Employee => Employee.teamMemberId === EmployeeId);
                        return Employee.teamMemberName;
                }
        }

        ngOnDestroy(): void {
                if (this.subscription) {
                        this.subscription.unsubscribe();
                }
        }

        isValidTime(text) {
                if (text == "00:00") {
                        this.isValidDuration = true;
                }
                else {
                        this.isValidDuration = false;
                }
        }

        getEntityDropDown() {
                let searchText = "";
                this.timeSheetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
                        if (responseData.success === false) {
                                this.validationmessage = responseData.apiResponseMessages[0].message;
                                this.toastr.error(this.validationmessage);
                        }
                        else {
                                this.entities = responseData.data;
                        }
                });
        }

        entityValues(name) {
                this.selectedEntity = name;
                this.getPermissionDetails();
        }

        durationTimeShow() {
                if (!this.durationTimepicker) {
                        this.durationTimepicker = ConstantVariables.DefaultTime;
                }
        }
        closeDurationTime() {
                this.durationTimepicker = "";
        }

}


