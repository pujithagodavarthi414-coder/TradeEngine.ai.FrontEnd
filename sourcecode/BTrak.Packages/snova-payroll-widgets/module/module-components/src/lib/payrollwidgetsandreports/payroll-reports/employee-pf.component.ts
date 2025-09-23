import { Component, ViewChild, ChangeDetectorRef, Input } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { GridComponent, GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { FormControl } from "@angular/forms";
import { State } from "@progress/kendo-data-query";
import { PayRollService } from "../services/PayRollService";
import { Moment } from "moment";
import * as moment_ from 'moment';
const moment = moment_;
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { EmployeePFModel } from "../models/employee-pf.model";
import { UserModel } from '../models/user';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { EntityDropDownModel } from '../models/entity-dropdown.module';


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
    selector: 'app-employee-pf',
    templateUrl: `employee-pf.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class EmployeePFComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if (filters && filters.entityId) {
        //     this.selectedEntity = filters.entityId;
        //     this.getEmployeePF(null);
        // }
        // if (filters && filters.isActiveEmployeesOnly == "true") {
        //     this.isActiveEmployeesOnly = true;
        //     this.getEmployeePF(null);
        // }
        // else {
        //     this.isActiveEmployeesOnly = null;
        //     this.getEmployeePF(null);
        // }
        // if (filters && filters.monthDate) {
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0] + '-01';
        //     this.getEmployeePF(null);
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
    columnHeadersIgnored: any[] = [
        { title: 'Is archived', field: "isArchived" },
        { title: 'Profile image', field: "profileImage" },
        { title: 'Total records count', field: "totalRecordsCount" },
        { title: 'User Id', field: "userId" }];
    columnHeaders: any[] = [
        { title: 'UAN', field: "uanNumber" },
        { title: 'Member name', field: "employeename" },
        { title: 'Gross Wages', field: "grossWages" },
        { title: 'EPF Wages', field: "epfWages" },
        { title: 'EPS Wages', field: "epsWages" },
        { title: 'EDLI Wages', field: "edliWages" },
        { title: 'EPF Contribution', field: "epfContribution" },
        { title: 'EPS Contribution', field: "epsContribution" },
        { title: 'EPF EPS DIFF', field: "epfandpsDifference" },
        { title: 'NCP Days', field: "ncpDays" },
        { title: 'Refund of Advance', field: "refundOfAdvance" }
    ];

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private router: Router) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.getEntityDropDown();
        this.getEmployeePF(null);
    }

    getEmployeePF(isExcel) {
        this.isAnyOperationIsInProgress = true;
        this.cdRef.detectChanges();
        let employeePFModel = new EmployeePFModel();
        employeePFModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        employeePFModel.entityId = this.selectedEntity;
        employeePFModel.userId = this.usersId;
        employeePFModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        employeePFModel.sortBy = this.sortBy;
        employeePFModel.sortDirectionAsc = this.sortDirection;
        employeePFModel.pageNumber = isExcel ? null : (this.state.skip / this.state.take) + 1;
        employeePFModel.pageSize = isExcel ? null : this.state.take;
        employeePFModel.searchText = this.searchText;
        this.payRollService.getEmployeePF(employeePFModel).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
                this.gridData = {
                    data: this.data,
                    total: this.data.length > 0 ? this.data[0].totalRecordsCount : 0
                }
                this.cdRef.detectChanges();
                if (isExcel) {
                    this.excel();
                }
                let totalCount = response.data.length > 0 ? this.data[0].totalRecordsCount : 0;
                if (totalCount > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
                }
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
        this.getEmployeePF(true);
        this.state.take = this.data[0].TotalRecordsCount;
        this.cdRef.detectChanges();
    }

    excel() {
        this.grid.saveAsExcel();
        this.state.take = 20;
        this.getEmployeePF(false);
    }
    
    exportToCSV() {
        let fileName = "EmployeesPF.csv"
        this.payRollService.ConvertDataToCSVFile(this.columnHeaders, this.gridData.data,
            this.columnHeadersIgnored, fileName);
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
        this.getEmployeePF(null);
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
        this.getEmployeePF(null);
    }


    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getEmployeePF(null);
    }

    closeSearch() {
        this.searchText = null;
        this.getEmployeePF(null);
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getEmployeePF(null);
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getEmployeePF(null);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getEmployeePF(null);
    }
    filter() {
        if (this.searchText || this.dateForFilter || this.entityName || this.employeeName || this.isActiveEmployeesOnly) {
            return true;
        }
        else {
            return false;
        }
    }

    goToUserProfile(selectedUserId) {
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    resetAllFilters() {
        this.fromDate = null;
        this.usersId = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.date.patchValue(null);
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        this.getEmployeePF(null);
    }
}