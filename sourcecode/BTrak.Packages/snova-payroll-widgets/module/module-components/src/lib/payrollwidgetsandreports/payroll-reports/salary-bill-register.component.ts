import { Component, ChangeDetectorRef, ViewChild, Input } from "@angular/core";
import { PayRollService } from "../services/PayRollService";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { MonthlyESIModel } from "../models/monthlyEsiModel";

import { State } from '@progress/kendo-data-query';
import { GridComponent, DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { UserModel } from '../models/user';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-salary-bill-register',
    templateUrl: `salary-bill-register.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class SalaryBillRegisterComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getSalaryBillRegisterDetails(null);
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getSalaryBillRegisterDetails(null);
        // }
        // if(filters && filters.monthDate){
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0]+'-01';
        //     this.getSalaryBillRegisterDetails(null);
        // }
    }
    @ViewChild("grid") public grid: GridComponent;
    isAnyOperationIsInProgress: boolean = false;
    isActiveEmployeesOnly: boolean;
    selectedEntity: string;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    fromDate: string;
    sortBy: string;
    sortDirection: boolean = true;
    pageable: boolean = false;
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    data: any;
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;
    gridData: GridDataResult;
    component: any;
    isOpen: boolean;
    employeeName: string;
    entityName: string;
    dateForFilter: string;

    constructor(private payRollService: PayRollService, private router: Router, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private cookieService: CookieService) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.getEntityDropDown();
        this.getSalaryBillRegisterDetails(null);
    }
    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getSalaryBillRegisterDetails(null);
    }

    closeSearch() {
        this.searchText = null;
        this.getSalaryBillRegisterDetails(null);
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getSalaryBillRegisterDetails(null);
    }

    getSalaryBillRegisterDetails(isExcel) {
        this.isAnyOperationIsInProgress = true;
        let monthlyESIModel = new MonthlyESIModel();
        monthlyESIModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        monthlyESIModel.entityId = this.selectedEntity;
        monthlyESIModel.userId = this.usersId;
        monthlyESIModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        monthlyESIModel.sortBy = this.sortBy;
        monthlyESIModel.sortDirectionAsc = this.sortDirection;
        monthlyESIModel.pageNumber = isExcel ? null : (this.state.skip / this.state.take) + 1;
        monthlyESIModel.pageSize = isExcel ? null : this.state.take;
        monthlyESIModel.searchText = this.searchText;
        this.payRollService.getSalaryBillRegister(monthlyESIModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    this.data = JSON.parse(response.data[0].dataJson);
                    this.component = JSON.parse(response.data[0].componentJson);
                } else {
                    this.data = null;
                }
                this.gridData = {
                    data: this.data,
                    total: this.data ? this.data[0].TotalRecordsCount : 0
                }
                this.cdRef.detectChanges();
                if (isExcel) {
                    this.excel();
                }
                let totalCount = response.data.length > 0 ? this.data ? this.data[0].TotalRecordsCount : 0 : 0;
                if (totalCount > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
                }
                console.log(this.data);
                this.isAnyOperationIsInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInProgress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    exportToExcel(grid: GridComponent): void {
        this.getSalaryBillRegisterDetails(true);
        this.state.take = this.data[0].TotalRecordsCount;
        this.cdRef.detectChanges();
    }

    excel() {
        this.grid.saveAsExcel();
        this.state.take = 20;
        this.getSalaryBillRegisterDetails(false);
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value.toString();
        this.getSalaryBillRegisterDetails(null);
    }

    getEntityDropDown() {
        let searchText = "";
        this.payRollService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
            else {
                this.entities = responseData.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isActive = true;
        this.payRollService.getAllUsers(userModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.employeeList = responseData.data;
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
        })
    }

    entityValues(id, event) {
        if (id === '0') {
            this.selectedEntity = "";
            if (event == null) {
                this.entityName = null;
            }
            else {
                this.entityName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        else {
            this.selectedEntity = id;
            this.entityName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getSalaryBillRegisterDetails(null);
    }

    getEmployee(id, event) {
        if (id === '0') {
            this.usersId = "";
            if (event == null) {
                this.employeeName = null;
            }
            else {
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        else {
            this.usersId = id;
            this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getSalaryBillRegisterDetails(null);
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters(isExcel) {
        this.fromDate = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.usersId = null;
        this.searchText = null;
        this.date.patchValue(null);
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        if (isExcel) {
            this.getSalaryBillRegisterDetails(true);
        }
        else {
            this.getSalaryBillRegisterDetails(null)
        }
    }

    closeSearchFilter() {
        this.searchText = null;
        this.getSalaryBillRegisterDetails(null);
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getSalaryBillRegisterDetails(null);
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getSalaryBillRegisterDetails(null);
    }

    filter() {
        if (this.searchText || this.dateForFilter || this.entityName || this.employeeName || this.isActiveEmployeesOnly) {
            return true;
        }
        else {
            return false;
        }
    }
    goToUserProfile(row) {
        if (row.IsArchived) {
            this.toastr.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
        }
        else {
            this.router.navigate(["dashboard/profile", row.UserId, "overview"]);
        }
    }
}