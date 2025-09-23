import { Component, ChangeDetectorRef, ViewChild, Input } from "@angular/core";
import { PayRollService } from "../services/PayRollService";
import { ToastrService } from "ngx-toastr";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ProfessionalTaxMonthlyModel } from "../models/professional-tax-monthly";
import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
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
    selector: 'app-professional-tax-monthly-report',
    templateUrl: `professiona-tax-monthly.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class ProfessionalTaxMonthlyComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedEntity = filters.entityId;
        //     this.getAllTaxDetails(null);
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getAllTaxDetails(null);
        // }
        // if(filters && filters.monthDate){
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0]+'-01';
        //     this.getAllTaxDetails(null);
        // }
    }
    isAnyOperationIsInProgress: boolean = false;
    fromDate: string;
    isOpen: boolean = true;
    toDate: Date;
    selectedEntity: string;
    isActiveEmployeesOnly: boolean;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string;
    take: number = 20;
    take1: number = 20;
    taxDetails: ProfessionalTaxMonthlyModel[];
    summaryDetails: any;
    state: State = {
        skip: 0,
        take: 5,
    };
    state2: State = {
        skip: 0,
        take: 20,
    };
    sortBy: string;
    sortDirection: boolean = true;
    pageable: boolean = false;
    taxDetailsList: GridDataResult;
    summaryDetailsData: any;
    searchText: string;
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;
    @ViewChild("excelexport") public excelexport;
    @ViewChild("excelexport1") public excelexport1;
    employeeName: string;
    entityName: string;
    dateForFilter: string;

    constructor(private payRollService: PayRollService,private router: Router,private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService) {

    }

    ngOnInit() {
        this.getAllTaxDetails(null);
        this.getEntityDropDown();
        this.getAllUsers();
    }

    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getAllTaxDetails(null);
    }

    getAllTaxDetails(isExcel) {
        this.isAnyOperationIsInProgress = true;
        let professionalTaxMonthlyModel = new ProfessionalTaxMonthlyModel();
        professionalTaxMonthlyModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        professionalTaxMonthlyModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        professionalTaxMonthlyModel.entityId = this.selectedEntity;
        professionalTaxMonthlyModel.userId = this.usersId;
        professionalTaxMonthlyModel.sortBy = this.sortBy;
        professionalTaxMonthlyModel.sortDirectionAsc = this.sortDirection;
        professionalTaxMonthlyModel.pageNumber = isExcel ? null : (this.state.skip / this.state.take) + 1;
        professionalTaxMonthlyModel.pageSize = isExcel ? null : this.state.take;
        professionalTaxMonthlyModel.searchText = this.searchText;
        this.payRollService.getProfessionalTaxMonthly(professionalTaxMonthlyModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    this.taxDetails = response.data;
                } else {
                    this.taxDetails = null;
                }
                this.taxDetailsList = {
                    data: this.taxDetails,
                    total: this.taxDetails ? this.taxDetails[0].totalCount : 0
                }

                let totalCount = response.data.length > 0 ? response.data[0].totalCount : 0;
                if (totalCount > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
                }
                if (this.taxDetails && this.taxDetails[0].summaryJson) {
                    this.summaryDetailsData = JSON.parse(this.taxDetails[0].summaryJson);
                    this.summaryDetails = process(this.summaryDetailsData, this.state2);
                }
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

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getAllTaxDetails(null);
    }
    public dataStateChange2(state: DataStateChangeEvent): void {
        this.state2 = state;
        this.summaryDetails = process(this.summaryDetailsData, this.state2);
    }

    exportToExcel(component1: any, component2: any): void {
        this.getAllTaxDetails(true);
        this.state.take = this.taxDetails.length;
        this.state2.take = this.summaryDetails ? this.summaryDetails.data.length : null;
        this.cdRef.detectChanges();

    }

    excel() {
        Promise.all([this.excelexport.workbookOptions(), this.excelexport1.workbookOptions()]).then((workbooks) => {
            workbooks[0].sheets = workbooks[0].sheets.concat(workbooks[1].sheets);
            this.excelexport.save(workbooks[0]);
        });
        this.state.take = 5;
        this.state2.take = 20;
        this.getAllTaxDetails(false);
        this.cdRef.detectChanges();
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
        this.getAllTaxDetails(null);
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
        this.getAllTaxDetails(null);
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value.toString();
        this.getAllTaxDetails(null);
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.getAllTaxDetails(null);
    }
    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters(isExcel) {
        this.fromDate = null;
        this.toDate = null;
        this.selectedEntity = null;
        this.isActiveEmployeesOnly = null;
        this.usersId = null;
        this.searchText = null;
        this.date.patchValue(null);
        this.dateForFilter = null;
        this.employeeName = null;
        this.entityName = null;
        if (isExcel) {
            this.getAllTaxDetails(true);
        }
        else {
            this.getAllTaxDetails(null)
        }
    }

    closeSearch() {
        this.searchText = null;
        this.getAllTaxDetails(null);
    }

    closeSearchFilter() {
        this.searchText = null;
        this.getAllTaxDetails(null);
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getAllTaxDetails(null);
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getAllTaxDetails(null);
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
        if (row.isArchived) {
            this.toastr.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
        }
        else {
            this.router.navigate(["dashboard/profile", row.userId, "overview"]);
        }
    }
}