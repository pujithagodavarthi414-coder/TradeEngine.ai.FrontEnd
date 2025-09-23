import { Component, ChangeDetectorRef, ViewChild, Input } from "@angular/core";
import { PayRollService } from "../services/PayRollService";
import { ToastrService } from "ngx-toastr";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ProfessionalTaxMonthlyModel } from "../models/professional-tax-monthly";
import { ProfessionalTaxReturnsMonthly } from "../models/professional-tax-returnsModel";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { HrBranchModel } from '../models/branch-model';

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
    selector: 'app-professional-tax-return-report',
    templateUrl: `professional-tax-return-component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class ProfessionalTaxReturnComponent {
    @Input("dashboardFilters") set _dashboardFilters(filters: any) {
        // if(filters && filters.entityId){
        //     this.selectedBranchId = filters.branchId;
        //     this.getTaxReturnDetails();
        // }
        // if(filters && filters.isActiveEmployeesOnly){
        //     this.isActiveEmployeesOnly = filters.isActiveEmployeesOnly;
        //     this.getTaxReturnDetails();
        // }
        // if(filters && filters.monthDate){
        //     var arr = filters.monthDate.split('-');
        //     this.fromDate = arr[0]+'-01';
        //     this.getTaxReturnDetails();
        // }
    }

    isAnyOperationIsInProgress: boolean = false;
    fromDate: string = null;
    isOpen: boolean = true;
    loading: boolean = false;
    toDate: Date;
    selectedEntity: string = null;
    isActiveEmployeesOnly: boolean = false;
    entities: EntityDropDownModel[];
    employeeList: SelectEmployeeDropDownListData[];
    usersId: string = null;
    take: number = 20;
    taxDetails: ProfessionalTaxReturnsMonthly[];
    totalTaxAmount: any = 0;
    totalTax: any = 0;
    totalEmployees: number = 0;
    date1: Date = new Date();
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;
    searchText: string;
    dateForFilter: string;
    completeAddress: string;
    branches: HrBranchModel[];
    selectedBranchId: string;
    branchName: string;

    constructor(private payRollService: PayRollService, 
        private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.getTaxReturnDetails();
        this.getAllBranches();
    }

    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.fromDate = moment(normalizedYear.toDate()).format("YYYY-MM").toString();
        this.dateForFilter = this.fromDate.toString() + '-01';
        this.picker.close();
        this.getTaxReturnDetails();
    }


    getTaxReturnDetails() {
        this.isAnyOperationIsInProgress = true;
        this.cdRef.detectChanges();
        let professionalTaxMonthlyModel = new ProfessionalTaxMonthlyModel();
        professionalTaxMonthlyModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        professionalTaxMonthlyModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        professionalTaxMonthlyModel.entityId = this.selectedEntity;
        professionalTaxMonthlyModel.userId = this.usersId;;
        professionalTaxMonthlyModel.branchId = this.selectedBranchId;
        this.payRollService.getProfessionalTaxReturn(professionalTaxMonthlyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.taxDetails = response.data;
                this.totalTaxAmount = 0;
                this.totalTax = 0;
                this.totalEmployees = 0;
                if (this.taxDetails && this.taxDetails.length > 0) {
                    var address = [];
                    if(this.taxDetails && this.taxDetails[0].address){
                        var detailAddress = JSON.parse(this.taxDetails[0].address);
                        if(detailAddress.Street)
                        address.push(detailAddress.Street);
                        if(detailAddress.City)
                        address.push(detailAddress.City);
                        if(detailAddress.State)
                        address.push(detailAddress.State);
                        this.completeAddress = address.toString();
                    }
                    this.taxDetails.forEach((x) => {
                        this.totalTaxAmount = this.totalTaxAmount + x.taxAmount;
                        this.totalTax = this.totalTax + x.totalTax;
                        this.totalEmployees = this.totalEmployees + x.noOfEmployee;
                    })
                }
                else {
                    this.taxDetails = null
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

    getPdf() {
        this.loading = true;
        this.cdRef.detectChanges();
        let professionalTaxMonthlyModel = new ProfessionalTaxMonthlyModel();
        professionalTaxMonthlyModel.isActiveEmployeesOnly = this.isActiveEmployeesOnly;
        professionalTaxMonthlyModel.date = this.fromDate ? this.fromDate.toString() + '-01' : null;
        professionalTaxMonthlyModel.entityId = this.selectedEntity;
        professionalTaxMonthlyModel.userId = this.usersId;
        professionalTaxMonthlyModel.completeAddress = this.completeAddress;
        this.payRollService.getFormvPdf(professionalTaxMonthlyModel).subscribe((response: any) => {
            if (response.success == true) {
                const linkSource = 'data:application/pdf;base64,' + response.data;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = "professional-tax-returns.pdf";
                downloadLink.click();
                this.loading = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.loading = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getAllBranches() {
        var hrBranchModel = new HrBranchModel();
        hrBranchModel.isArchived = false;
        this.payRollService.getBranches(hrBranchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branches = response.data;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        });
    }


    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value.toString();
        this.getTaxReturnDetails();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.getTaxReturnDetails();
    }
    filterClick() {
        this.isOpen = !this.isOpen;
    }

    branchSelected(id, event) {
        if (id === '0') {
            this.selectedBranchId = "";
            if (event == null) {
                this.branchName = null;
            }
            else {
                this.branchName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        else {
            this.selectedBranchId = id;
            this.branchName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getTaxReturnDetails();
    }

    resetAllFilters() {
        this.fromDate = null;
        this.toDate = null;
        this.selectedEntity = null;
        this.selectedBranchId = null;
        this.isActiveEmployeesOnly = null;
        this.usersId = null;
        this.dateForFilter = null;
        this.branchName = null;
        this.date.patchValue(null);
        this.getTaxReturnDetails();
    }

    closeDateFilter() {
        this.dateForFilter = null;
        this.fromDate = null;
        this.date.patchValue(null);
        this.getTaxReturnDetails();
    }

    closeIsActive() {
        this.isActiveEmployeesOnly = false;
        this.getTaxReturnDetails();
    }

    filter() {
        if (this.dateForFilter || this.isActiveEmployeesOnly || this.branchName) {
            return true;
        }
        else {
            return false;
        }
    }
}