import { Component, ViewChild, ChangeDetectorRef, Input } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { GridComponent, GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { FormControl } from "@angular/forms";
import { State } from "@progress/kendo-data-query";
import { PayRollService } from "../services/PayRollService";
import { TranslateService } from "@ngx-translate/core";
import { Moment } from "moment";
import * as moment_ from 'moment';
const moment = moment_;
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SalaryForITModel } from "../models/salary-for-it.model";
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { UserModel } from '../models/user';
import * as $_ from 'jquery';
const $ = $_;

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
    selector: 'app-salary-for-it',
    templateUrl: `salary-for-it.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    styles: [`
    .prevalue {
      white-space: pre;
    }`]
})

export class SalaryForItComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if (filters && filters.entityId) {
        //     this.selectedEntity = filters.entityId;
        //     this.getSalaryWages(null);
        // }
        // if (filters && filters.isActiveEmployeesOnly) {
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getSalaryWages(null);
        // }
        // if (filters && filters.monthDate) {
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0] + '-01';
        //     this.getSalaryWages(null);
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
    number: number = 0;
    overAllData: any;
    employeeData: any[] = [];

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private router: Router) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.getEntityDropDown();
        this.getSalaryWages(null);
    }

    getSalaryWages(isExcel) {
        this.isAnyOperationIsInProgress = true;
        this.cdRef.detectChanges();
        let salaryForITModel = new SalaryForITModel();
        salaryForITModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        salaryForITModel.entityId = this.selectedEntity;
        salaryForITModel.userId = this.usersId;
        salaryForITModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        salaryForITModel.sortBy = this.sortBy;
        salaryForITModel.sortDirectionAsc = this.sortDirection;
        salaryForITModel.pageNumber = isExcel ? null : (this.state.skip / this.state.take) + 1;
        salaryForITModel.pageSize = isExcel ? null : this.state.take;
        salaryForITModel.searchText = this.searchText;
        this.payRollService.getSalaryForIT(salaryForITModel).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
                if (this.data && this.data.length > 0) {
                    this.overAllData = this.data[0];
                    this.employeeData = [];
                    this.employeeData.push({
                        employeeName: this.overAllData.employeeName,
                        panNumber: this.overAllData.panNumber,
                        age: this.overAllData.age,
                        dateOfBirth: this.overAllData.dateofBirth
                    })
                    if (!(this.data[0].sectionName)) {
                        this.data = [];
                    }
                    this.data.unshift({
                        age: null,
                        dateofBirth: null,
                        employeeId: null,
                        employeeName: null,
                        investment: null,
                        isParent: true,
                        maxInvestment: null,
                        netSalary: null,
                        panNumber: null,
                        parentSectionName: null,
                        profileImage: null,
                        sectionName: "Gross Annual Income/Salary (with all allowances)",
                        tax: null,
                        taxableAmount: null,
                        totalTax: null,
                        total: this.overAllData.netSalary
                    })
                    if (this.data[0].sectionName) {
                        this.data.forEach(element => {
                            if (!element.isParent) {
                                this.number = this.number + 1;
                                element.sectionName = "   " + this.number.toString() + ") " + element.sectionName
                            }
                            else {
                                this.number = 0;
                            }
                        });
                    }
                    this.data.push(
                        {
                            age: null,
                            dateofBirth: null,
                            employeeId: null,
                            employeeName: null,
                            investment: null,
                            isParent: true,
                            maxInvestment: null,
                            netSalary: null,
                            panNumber: null,
                            parentSectionName: null,
                            profileImage: null,
                            sectionName: "Total Taxable Income",
                            tax: null,
                            taxableAmount: null,
                            totalTax: null,
                            total: this.overAllData.taxableAmount
                        })
                    this.data.push(
                        {
                            age: null,
                            dateofBirth: null,
                            employeeId: null,
                            employeeName: null,
                            investment: null,
                            isParent: true,
                            maxInvestment: null,
                            netSalary: null,
                            panNumber: null,
                            parentSectionName: null,
                            profileImage: null,
                            sectionName: "Net Tax Payable",
                            tax: null,
                            taxableAmount: null,
                            totalTax: null,
                            total: this.overAllData.totalTax
                        })
                }
                this.state.take = this.data ? this.data.length : 0;
                this.cdRef.detectChanges();
                if (isExcel) {
                    this.excel();
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

    exportToExcel(component: any, component1: any) {
        Promise.all([component.workbookOptions(), component1.workbookOptions()]).then((workbooks) => {
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[1].sheets);
            component.save(workbooks[0]);
        });
    }

    excel() {
        this.grid.saveAsExcel();
        this.state.take = 20;
        this.getSalaryWages(false);
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
        this.getSalaryWages(null);
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
        this.getSalaryWages(null);
    }


    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getSalaryWages(null);
    }

    closeSearch() {
        this.searchText = null;
        this.getSalaryWages(null);
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getSalaryWages(null);
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getSalaryWages(null);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getSalaryWages(null);
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
        this.getSalaryWages(null);
    }

    fitContent(optionalParameters: any){
     
        if(optionalParameters['gridsterView']){

            var parentElement = optionalParameters['gridsterViewSelector'];                   
            if ($(parentElement + ' #salary-for-it-height').length > 0)
                $(parentElement + ' #salary-for-it-height').height($(parentElement).height() - 50);          
        }

    }

}