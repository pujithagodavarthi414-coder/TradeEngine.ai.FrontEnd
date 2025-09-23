import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
import { PayRollService } from '../../services/PayRollService';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { EmployeePreviousCompanyTaxModel } from '../../models/employeepreviouscompanytaxmodel';
import { EmployeeListModel } from '../../models/employee-list-model';
const moment = moment_;
import * as _ from "underscore";

@Component({
    selector: 'app-employeepreviouscompanytaxes',
    templateUrl: `employeepreviouscompanytax.component.html`
})

export class EmployeePreviousCompanyTaxComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertEmployeePreviousCompanyTaxPopUp") upsertEmployeePreviousCompanyTaxPopover;
    @ViewChildren("deleteEmployeePreviousCompanyTaxPopUp") deleteEmployeePreviousCompanyTaxPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    employeePreviousCompanyTaxName: string;
    timeStamp: any;
    searchText: string;
    employeePreviousCompanyTaxForm: FormGroup;
    employeePreviousCompanyTaxModel: EmployeePreviousCompanyTaxModel;
    isEmployeePreviousCompanyTaxArchived: boolean = false;
    toMonth: number;
    fromMonth: number;
    isArchivedTypes: boolean = false;
    employeePreviousCompanyTaxes: EmployeePreviousCompanyTaxModel[];
    employeePreviousCompanyTaxId: string;
    percentage: number;
    employeePreviousCompanyTaxTitle: string;
    employeeId: string;
    financialYearTypeId: string;
    financialYearTypes: any;
    minDate = new Date(1753, 0, 1);
    activeFrom: Date;
    activeTo: Date;
    countries: any;
    employeeListDataDetails: EmployeeListModel[];
    employeesList: EmployeeListModel[];
    selectedEmployees: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getEmployeesLists();
        this.getAllEmployeePreviousCompanyTaxes();
    }

    constructor(private payRollService: PayRollService, private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }


    getAllEmployeePreviousCompanyTaxes() {
        this.isAnyOperationIsInprogress = true;
        var employeePreviousCompanyTaxModel = new EmployeePreviousCompanyTaxModel();
        employeePreviousCompanyTaxModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllEmployeePreviousCompanyTaxes(employeePreviousCompanyTaxModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeePreviousCompanyTaxes = response.data;
                this.temp = this.employeePreviousCompanyTaxes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }


    getEmployeesLists() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.sortDirectionAsc = true;
        employeeListSearchResult.isArchived = false;
        employeeListSearchResult.isActive = true;
        this.payRollService.getAllEmployees(employeeListSearchResult).subscribe((responseData: any) => {
            this.employeeListDataDetails = responseData.data;
            this.employeesList = responseData.data;
        })
    }

    clearForm() {
        this.employeePreviousCompanyTaxId = null;
        this.fromMonth = null;
        this.toMonth = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.toMonth = null;
        this.isAnyOperationIsInprogress = false;
        this.employeePreviousCompanyTaxForm = new FormGroup({
            employeeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            taxAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(employeePreviousCompanyTax =>
            (employeePreviousCompanyTax.employeeName == null ? null : employeePreviousCompanyTax.employeeName.toLowerCase().indexOf(this.searchText) > -1)
            || (employeePreviousCompanyTax.taxAmount == null ? null : employeePreviousCompanyTax.taxAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
        );

        this.employeePreviousCompanyTaxes = temp;
    }

    editEmployeePreviousCompanyTaxPopupOpen(row, upsertEmployeePreviousCompanyTaxPopUp) {
        this.employeePreviousCompanyTaxForm.patchValue(row);
        this.employeePreviousCompanyTaxId = row.employeePreviousCompanyTaxId;
        this.timeStamp = row.timeStamp;
        this.employeePreviousCompanyTaxTitle = 'EMPLOYEEPREVIOUSCOMPANYTAX.EDITEMPLOYEEPREVIOUSCOMPANYTAX';
        upsertEmployeePreviousCompanyTaxPopUp.openPopover();
    }


    closeUpsertEmployeePreviousCompanyTaxPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeePreviousCompanyTaxPopover.forEach((p) => p.closePopover());
    }

    createEmployeePreviousCompanyTaxPopupOpen(upsertEmployeePreviousCompanyTaxPopUp) {
        this.clearForm();
        upsertEmployeePreviousCompanyTaxPopUp.openPopover();
        this.employeePreviousCompanyTaxTitle = 'EMPLOYEEPREVIOUSCOMPANYTAX.ADDEMPLOYEEPREVIOUSCOMPANYTAX';
    }

    upsertEmployeePreviousCompanyTax(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.employeePreviousCompanyTaxModel = this.employeePreviousCompanyTaxForm.value;
        if (this.employeePreviousCompanyTaxId) {
            this.employeePreviousCompanyTaxModel.employeePreviousCompanyTaxId = this.employeePreviousCompanyTaxId;
            this.employeePreviousCompanyTaxModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertEmployeePreviousCompanyTax(this.employeePreviousCompanyTaxModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertEmployeePreviousCompanyTaxPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllEmployeePreviousCompanyTaxes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });

    }

    deleteEmployeePreviousCompanyTaxPopUpOpen(row, deleteEmployeePreviousCompanyTaxPopUp) {
        this.employeePreviousCompanyTaxModel = row;
        this.isEmployeePreviousCompanyTaxArchived = this.isArchivedTypes;
        this.employeePreviousCompanyTaxModel.isArchived = !this.isArchivedTypes;
        deleteEmployeePreviousCompanyTaxPopUp.openPopover();
    }

    deleteEmployeePreviousCompanyTax() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.upsertEmployeePreviousCompanyTax(this.employeePreviousCompanyTaxModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeePreviousCompanyTaxPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmployeePreviousCompanyTaxes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }


    closeDeleteEmployeePreviousCompanyTaxDialog() {
        this.clearForm();
        this.deleteEmployeePreviousCompanyTaxPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    getSelectedEmployees() {
        const employeeListDataDetailsList = this.employeesList;
        const employmentIds = this.employeePreviousCompanyTaxForm.controls['employeeId'].value;

        const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
            return employmentIds.toString().includes(x.employeeId);
        })
        const employeeNames = employeeListDataDetails.map((x) => x.userName);
        this.selectedEmployees = employeeNames.toString();
    }
} 