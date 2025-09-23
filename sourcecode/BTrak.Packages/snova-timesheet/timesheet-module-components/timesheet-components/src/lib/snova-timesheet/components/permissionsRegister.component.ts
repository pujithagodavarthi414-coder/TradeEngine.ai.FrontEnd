import { Component, Input, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TimeSheetPermissionsInputModel } from '../models/timesheet-model';
import { TimeSheetService } from '../services/timesheet.service';
import {  MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { State } from "../store/reducers/index";
import { LoadFeedTimeSheetUsersTriggered, FeedTimeSheetUsersActionTypes } from "../store/actions/feedtimesheet.action";
import * as timeSheetModuleReducer from '../store/reducers/index';
import { tap, takeUntil } from "rxjs/operators";
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import "../../globaldependencies/helpers/fontawesome-icons";

import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { PermissionModel } from '../models/permission';
import { Page } from '../models/Page';
import { UserModel } from '../models/user';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'app-hr-component-permissionRegister',
    templateUrl: 'permissionsRegister.component.html'
})

export class PermissionRegisterComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    skip: number = 0;
    sortBy: string;
    sortDirection: boolean;
    permissionList: PermissionModel[];
    dateToValue: Date;
    dateFromValue: Date;
    dateFromSelected: Date;
    dateToSelected: Date;
    page = new Page();
    isAnyOperationIsInprogress: boolean;
    review: string;
    dateTo = new Date();
    dateFrom = new Date();
    maxDate = new Date();
    minDate = this.dateFrom;
    employeeId: string;
    scrollbarH: boolean = false;
    searchEmployee: string = '';
    employeeSelectedValue: boolean = false;
    employeeList: UserModel[];
    employeeList$: Observable<UserModel[]>;
    employeeLoading$: Observable<boolean>;
    public ngDestroyed$ = new Subject();
    subscription: Subscription;
    selectedEntity: string;
    entities: EntityDropDownModel[];
    validationMessages: string;
    softLabels: SoftLabelConfigurationModel[];
    employeesDropDown: any;
    employeeLoading: boolean;

    constructor(private store: Store<State>, private router: Router, private timeSheetService: TimeSheetService, private toastr: ToastrService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersCompleted),
                tap(() => {
                    this.employeeList$ = this.store.pipe(select(timeSheetModuleReducer.getEmployeeAll), tap(employees => {
                        this.employeeList = employees;
                        if (this.employeeList.length === 0) {
                            this.permissionList = [];
                            this.page.totalElements = 0;
                            this.page.totalPages = this.page.totalElements / this.page.size;
                            this.cdRef.markForCheck();
                        }
                        else {
                            this.getPermissionRegister();
                        }
                    }));
                })
            )
            .subscribe();
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.getPermissionRegister();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getEntityDropDown();
        this.employeeLoading$ = this.store.pipe(select(timeSheetModuleReducer.getEmployeeLoading));
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateFromSelected = event.target.value;
        this.dateFromValue = this.dateFromSelected;
        this.minDate = this.dateFromSelected;
        this.getPermissionRegister();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateToSelected = event.target.value;
        this.dateToValue = this.dateToSelected;
        this.getPermissionRegister();
    }

    onPageChange(state: any) {
        this.viewPermissionsByPaging(state);
    }

    public sortChange(sort: any): void {
        this.viewPermissionsBySorting(sort);
    }

    viewPermissionsByPaging(event) {
        this.skip = event.skip;
        this.page.pageNumber = (event.skip / event.take) + 1;
        this.page.size = event.take;
        this.sortBy = null;
        this.sortDirection = true;
        this.getPermissionRegister();
    }

    viewPermissionsBySorting(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        console.log(sort);
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.getPermissionRegister();
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getPermissionRegister();
    }

    getPermissionRegister() {
        this.isAnyOperationIsInprogress = true;
        var timeSheetPermissionsInputModel: TimeSheetPermissionsInputModel;
        timeSheetPermissionsInputModel = new TimeSheetPermissionsInputModel();
        timeSheetPermissionsInputModel.dateFrom = this.dateFrom;
        timeSheetPermissionsInputModel.dateTo = this.dateTo;
        timeSheetPermissionsInputModel.pageNumber = this.page.pageNumber + 1;
        timeSheetPermissionsInputModel.pageSize = this.page.size;
        timeSheetPermissionsInputModel.sortBy = this.sortBy;
        timeSheetPermissionsInputModel.sortDirectionAsc = this.sortDirection;
        timeSheetPermissionsInputModel.review = this.review;
        timeSheetPermissionsInputModel.entityId = this.selectedEntity;
        timeSheetPermissionsInputModel.employeeId = this.employeeId;

        if (this.employeeId != null) {
            timeSheetPermissionsInputModel.employeeId = this.employeeId;
        }
        if (this.dateFromValue != null) {
            timeSheetPermissionsInputModel.dateFrom = this.dateFromValue;
        }
        if (this.dateToValue != null) {
            timeSheetPermissionsInputModel.dateTo = this.dateToValue;
        }

        this.timeSheetService.getPermissionRegister(timeSheetPermissionsInputModel).subscribe((responseData: any) => {
            if (responseData.data == null) {
                this.permissionList = null;
                this.page.totalElements = 0;
                this.scrollbarH = true;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.isAnyOperationIsInprogress = false;
            }
            else {
                this.permissionList = responseData.data;
                this.page.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.scrollbarH = true;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        })
    }

    onChangeEmployee(event) {
        const userId = event;
        this.employeeId = userId;
        this.getPermissionRegister();
    }

    reset() {
        this.searchEmployee = '';
        this.dateTo = new Date();
        this.dateFrom = new Date();
        this.dateFromValue = null;
        this.dateToValue = null;
        this.employeeId = null;
        this.selectedEntity = null;
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.getPermissionRegister();
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
                this.permissionList = [];
                this.page.totalElements = 0;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.cdRef.markForCheck();
            }
            else {
                this.getPermissionRegister();
            }
        })
    }

    employeeSelected(value) {
        this.employeeSelectedValue = true;
    }

    searchByEmployee() {
        this.employeeSelectedValue = false;
        this.employeeId = '';
        // let searchEmployee = JSON.parse(JSON.stringify(this.searchEmployee));
        // const userModel = new UserModel();
        // userModel.employeeNameText = searchEmployee;
        // this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
        this.loadUsers();
    }

    closeSearchEmployee() {
        this.searchEmployee = '';
        // const userModel = new UserModel();
        // userModel.employeeNameText = this.searchEmployee;
        // this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
        // this.employeeId = '';
        this.loadUsers();
        this.getPermissionRegister();
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

    goToProfile(url) {
        this.router.navigateByUrl('dashboard/profile/' + url);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getEntityDropDown() {
        let searchText = "";
        this.timeSheetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessages = responseData.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessages);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    entityValues(name) {
        this.selectedEntity = name;
        this.getPermissionRegister();
    }
}