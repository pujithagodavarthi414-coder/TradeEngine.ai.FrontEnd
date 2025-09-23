import { Component, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { PayRollService } from '../services/PayRollService';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MonthlyESIModel } from '../models/monthlyEsiModel';
import { process, State } from '@progress/kendo-data-query';
import { salaryReportModel } from '../models/salary-report-model';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
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
    selector: 'app-salary-report',
    templateUrl: `salary-report-component.html`
})

export class SalaryReportComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getAllSalaryDetails();
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getAllSalaryDetails();
        // }
    }
    isAnyOperationIsInProgress: boolean = false;
    salaryDetails: salaryReportModel[];
    public state: State = {
        skip: 0,
        take: 20,
        group: [{ field: 'employeeName' }]
    };
    public gridView: GridDataResult;
    public pageSize = 20;
    public skip = 0;
    fromDate: string;
    isOpen: boolean = true;
    toDate: string;
    data: any;
    selectedEntity: string;
    isActiveEmployeesOnly: boolean;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    take: number = 20;
    pagination: boolean = true;
    searchText: string;
    date = new FormControl();
    date2 = new FormControl();
    @ViewChild(MatDatepicker) picker;
    @ViewChild(MatDatepicker) picker2;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    minDate = new Date(1753, 0, 1);
    maxDate = new Date();
    employeeName: string;
    entityName: string;
    fromDateForFilter: string;
    toDateForFilter: string;

    constructor(private payRollService: PayRollService, private router: Router, private translateService: TranslateService,
         private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.getAllSalaryDetails();
        this.getEntityDropDown();
        this.getAllUsers();
    }
    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.fromDateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getAllSalaryDetails();
    }
    monthSelected2(normalizedYear: Moment) {
        this.date2.setValue(normalizedYear);
        this.toDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.toDateForFilter = this.fromDate.toString() + '-01';
        this.picker2.close();
        this.getAllSalaryDetails();
    }

    startDate() {
        if (this.fromDate) {
            this.minDateForEndDate = new Date(this.fromDate.toString() + '-01');
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.toDate = null;
        }
    }

    getAllSalaryDetails() {
        this.isAnyOperationIsInProgress = true;
        let monthlyESIModel = new MonthlyESIModel();
        monthlyESIModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        monthlyESIModel.dateFrom = this.fromDate ? this.fromDate.toString() + '-01' : null;
        monthlyESIModel.dateTo = this.toDate ? this.toDate.toString() + '-01' : null;
        monthlyESIModel.entityId = this.selectedEntity;
        monthlyESIModel.userId = this.usersId;
        monthlyESIModel.searchText = this.searchText;
        this.payRollService.getSalaryReport(monthlyESIModel).subscribe((response: any) => {
            if (response.success == true) {
                this.salaryDetails = response.data;
                this.data = process(response.data, this.state);
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

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.data = process(this.salaryDetails, this.state);
    }

    exportToExcel(grid: GridComponent): void {
        this.state.take = this.salaryDetails.length;
        this.data = process(this.salaryDetails,this.state);
        this.cdRef.detectChanges();
        grid.saveAsExcel();
        this.state.take = 20;
        this.data = process(this.salaryDetails,this.state);
        this.cdRef.detectChanges();
    }


    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value.toString();
        this.getAllSalaryDetails();
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
        this.getAllSalaryDetails();
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
        this.getAllSalaryDetails();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value.toString();
        this.getAllSalaryDetails();
    }
    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.fromDate = null;
        this.toDate = null;
        this.usersId = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.fromDateForFilter = null;
        this.toDateForFilter = null;
        this.entityName = null;
        this.employeeName = null;
        this.date.patchValue(null);
        this.date2.patchValue(null);
        this.getAllSalaryDetails();
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

    closeSearch() {
        this.searchText = null;
        this.getAllSalaryDetails();
    }

    goToUserProfile(row) {
        if (row.isArchived) {
            this.toastr.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
        }
        else {
            this.router.navigate(["dashboard/profile", row.userId, "overview"]);
        }
    }

    closeSearchFilter() {
        this.searchText = null;
        this.getAllSalaryDetails();
    }

    closeDateFilter() {
        this.toDateForFilter = null;
        this.fromDateForFilter = null;
        this.date2.patchValue(null);
        this.date.patchValue(null);
        this.getAllSalaryDetails();
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getAllSalaryDetails();
    }

    filter() {
        if (this.searchText || this.fromDateForFilter || this.toDateForFilter || this.entityName || this.employeeName || this.isActiveEmployeesOnly) {
            return true;
        }
        else {
            return false;
        }
    }
}