import { Component, ChangeDetectorRef, ViewChild, Input } from "@angular/core";
import { PayRollService } from "../services/PayRollService";
import { ToastrService } from "ngx-toastr";
import { IncomeSalaryModel } from "../models/incomeSalaryModel";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State, process } from '@progress/kendo-data-query';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from "@angular/common";
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
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
    selector: 'app-income-salary-report',
    templateUrl: `income-salary-statement.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class IncomeSalaryComponent {

    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getAllIncomeSalaryDetails();
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getAllIncomeSalaryDetails();
        // }
        // if(filters && filters.isFinancialYear){
        //     this.isFinancialYearBasedOnly = filters.isFinancialYear;
        //     this.getAllIncomeSalaryDetails();
        // }
    }
    deductions: any;
    monthlyIncome: any;
    totalIncome: any;
    adhoc: any;
    deductionsColumns: any;
    monthlyIncomeColumns: any;
    totalIncomeColumns: any;
    adhocColumns: any;
    incomeGridData: any;
    totalGridData: any;
    adhocGridData: any;
    deductionsGridData: any;
    @ViewChild(MatDatepicker) picker;
    isActiveEmployeesOnly: boolean;
    isFinancialYearBasedOnly: boolean;
    selectedEntity: string;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    date: Date = new Date();
    fromDate: string = this.date.getFullYear().toString();
    overAllData: any;
    employeeName: string;
    entityName: string;
    dateForFilter: string;
    weekNumber: number;

    state: State = {
        skip: 0,
        take: 20,
    };

    state2: State = {
        skip: 0,
        take: 20,
    };

    state3: State = {
        skip: 0,
        take: 20,
    };

    state4: State = {
        skip: 0,
        take: 20,
    };
    pageable: boolean = true;
    employeeDetailsList: any[] = [];
    isAnyOperationIsInprogress: boolean = false;
    direction: string;
    yearDate: Date = new Date();
    searchText: string;
    isOpen: boolean;
    dummyDate: Date = new Date();
    year: number = this.dummyDate.getFullYear();
    selectedYearDate: string = this.year.toString() + "-01-01";

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,private datePipe: DatePipe,
        private toastr: ToastrService) {

    }

    ngOnInit() {
        this.getAllIncomeSalaryDetails();
        this.getEntityDropDown();
        this.getAllUsers();
    }


    getAllIncomeSalaryDetails() {
        this.isAnyOperationIsInprogress = true;
        let incomeSalaryModel = new IncomeSalaryModel();
        incomeSalaryModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        incomeSalaryModel.entityId = this.selectedEntity;
        incomeSalaryModel.userId = this.usersId;
        incomeSalaryModel.date = this.selectedYearDate;
        incomeSalaryModel.isFinantialYearBased = this.isFinancialYearBasedOnly
        this.payRollService.getIncomeSalaryDetails(incomeSalaryModel).subscribe((response: any) => {
            if (response.success) {
                if (response.data && response.data.length > 0) {
                    this.overAllData = response.data[0];
                    this.employeeDetailsList = [];
                    this.employeeDetailsList.push({
                        employeeNumber: this.overAllData.employeeNumber,
                        employeeName: this.overAllData.employeeName,
                        panNumber: this.overAllData.panNumber,
                        gender: this.overAllData.gender,
                        location: this.overAllData.location,
                        joinedDate: this.overAllData.joinedDate,
                        dateofBirth: this.overAllData.dateofBirth,
                        dateOfLeavingService: this.overAllData.dateOfLeavingService
                    })
                }
                if (response.data[0] && response.data[0].totalIncome) {
                    this.totalIncome = JSON.parse(response.data[0].totalIncome);
                    this.totalIncomeColumns = Object.keys(this.totalIncome[0]);
                    this.totalGridData = process(this.totalIncome, this.state);
                }
                else {
                    this.totalIncome = [];
                    this.totalIncomeColumns = [];
                    this.totalGridData = [];
                }
                if (response.data[0] && response.data[0].deductions) {
                    this.deductions = JSON.parse(response.data[0].deductions)
                    this.deductionsColumns = Object.keys(this.deductions[0]);
                    this.deductionsGridData = process(this.deductions, this.state);
                }
                else {
                    this.deductions = [];
                    this.deductionsColumns = [];
                    this.deductionsGridData = [];
                }
                if (response.data[0] && response.data[0].monthlyIncome) {
                    this.monthlyIncome = JSON.parse(response.data[0].monthlyIncome);
                    this.monthlyIncomeColumns = Object.keys(this.monthlyIncome[0]);
                    this.incomeGridData = process(this.monthlyIncome, this.state);
                }
                else {
                    this.monthlyIncome = [];
                    this.monthlyIncomeColumns = [];
                    this.incomeGridData = [];
                }
                if (response.data[0] && response.data[0].adhocIncome) {
                    this.adhoc = JSON.parse(response.data[0].adhocIncome);
                    this.adhocColumns = Object.keys(this.adhoc[0]);
                    this.adhocGridData = process(this.adhoc, this.state);
                }
                else {
                    this.adhoc = [];
                    this.adhocColumns = [];
                    this.adhocGridData = [];
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            console.log(response.data);
        });
    }

    exportToExcel(component: any, component1: any, component2: any, component3: any, component4: any) {
        Promise.all([component4.workbookOptions(), component.workbookOptions(), component1.workbookOptions(), component2.workbookOptions(), component3.workbookOptions()]).then((workbooks) => {
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[1].sheets);
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[2].sheets);
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[3].sheets);
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[4].sheets);
            component.save(workbooks[0]);
        });
    }

    getIncomeBasedOnDate(direction) {
        if (direction === 'left') {
            const day = 1;
            const month = 1;
            this.year = this.dummyDate.getFullYear() - 1;
            const newDate = day + '/' + month + '/' + this.year;
            this.dummyDate = this.parse(newDate);
            this.selectedYearDate = this.datePipe.transform(this.dummyDate, 'yyyy-MM-dd');
        } else {
            const day = 1;
            const month = 1;
            this.year = 0 + this.dummyDate.getFullYear() + 1;
            const newDate = day + '/' + month + '/' + this.year;
            this.dummyDate = this.parse(newDate);
            this.selectedYearDate = this.datePipe.transform(this.dummyDate, 'yyyy-MM-dd');
        }
        this.getAllIncomeSalaryDetails();
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
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
        this.getAllIncomeSalaryDetails();
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
        this.getAllIncomeSalaryDetails();
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.incomeGridData = process(this.monthlyIncome, this.state);
    }

    public dataStateChange2(state: DataStateChangeEvent): void {
        this.state2 = state;
        this.deductionsGridData = process(this.deductions, this.state);
    }

    public dataStateChange3(state: DataStateChangeEvent): void {
        this.state3 = state;
        this.totalGridData = process(this.totalIncome, this.state);
    }

    public dataStateChange4(state: DataStateChangeEvent): void {
        this.state4 = state;
        this.adhocGridData = process(this.adhoc, this.state);
    }

    resetAllFilters() {
        this.date= new Date();
        this.selectedYearDate = null;
        this.year = new Date().getFullYear();
        this.selectedYearDate = this.year.toString() + "-01-01";
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.isFinancialYearBasedOnly = null;
        this.usersId = null;
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        this.getAllIncomeSalaryDetails();
    }


    closeDateFilter() {
        this.selectedYearDate = null;
        this.year = new Date().getFullYear();
        this.selectedYearDate = this.year.toString() + "-01-01";
        this.getAllIncomeSalaryDetails();
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getAllIncomeSalaryDetails();
    }

    closeIsFinancial() {
        this.isFinancialYearBasedOnly = false;
        this.getAllIncomeSalaryDetails();
    }

    filter() {
        if (this.isFinancialYearBasedOnly || this.selectedYearDate || this.entityName || this.employeeName || this.isActiveEmployeesOnly) {
            return true;
        }
        else {
            return false;
        }
    }

    fitContent(optionalParameters: any){

        if(optionalParameters['gridsterView']){
            $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset').height($(optionalParameters['gridsterViewSelector']).height() - 50);
        }
        else if (optionalParameters['popupView']) {

            if(optionalParameters['isAppStoreCustomViewFromDashboard']){

               $(optionalParameters['popupViewSelector'] + ' .gridster-noset .no-drag').css({"height" : "calc(100vh - 420px)" });
               if($('mat-dialog-container app-store app-widgetslist #custom-style-1').length>0)
                  $('mat-dialog-container app-store app-widgetslist #custom-style-1').attr('id', '');               
            }
            else{
               $(optionalParameters['popupViewSelector'] + ' .gridster-noset .no-drag').css({"height" : "calc(100vh - 400px)" });
            }
        }
        else if (optionalParameters['individualPageView']) {

            if(optionalParameters['isAppStoreUrl'])
               $(optionalParameters['individualPageSelector'] + ' .gridster-noset .no-drag').css({"height" : "calc(100vh - 210px)" });
            else
               $(optionalParameters['individualPageSelector'] + ' .gridster-noset .no-drag').css({"height" : "calc(100vh - 135px)" });

        }
       
    }
}