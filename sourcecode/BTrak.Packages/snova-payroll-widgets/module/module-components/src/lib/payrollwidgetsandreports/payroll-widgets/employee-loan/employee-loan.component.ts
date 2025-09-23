import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { TranslateService } from '@ngx-translate/core';
import { EmployeeLoanModel } from '../../models/employeeloancomponentmodel';
import { PayRollService } from '../../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import { PayRollTemplateModel } from '../../models/PayRollTemplateModel';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { EmployeeListModel } from '../../models/employee-list-model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employeeloancomponent',
    templateUrl: `employee-loan.component.html`,
    styles: [`
        .employeeloan-profile .employeeresignation-profile .employeebonus-profile{
        display: inline-table !important;
      }`]
})

export class EmployeeLoanComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertEmployeeLoanPopUp") upsertEmployeeLoanPopover;
    @ViewChildren("deleteEmployeeLoanPopUp") deleteEmployeeLoanPopover;
    @ViewChildren("approveEmployeeLoanPopUp") approveEmployeeLoanPopover;


    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    employeeLoan: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    employeeLoanName: string;
    timeStamp: any;
    searchText: string;
    employeeLoanForm: FormGroup;
    employeeLoanModel: EmployeeLoanModel;
    isEmployeeLoanArchived: boolean = false;
    isArchivedTypes: boolean = false;
    company: string;
    employeeLoanId: string;
    employeeListDataDetails: EmployeeListModel[];
    periodTypes: any;
    loanTypes: any;
    isEmployeeLoanApproved: boolean;
    isEditLoanAmount: boolean;
    employeesList: EmployeeListModel[];
    selectedEmployees: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getEmployeesLists();
        this.getAllEmployeeLoans();
        this.getAllPeriodTypes();
        this.getAllLoanTypes();
    }

    constructor(private payRollService: PayRollService,
        private snackbar: MatSnackBar, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private router: Router) { super() }


    getAllEmployeeLoans() {
        this.isAnyOperationIsInprogress = true;
        var employeeLoanModel = new EmployeeLoanModel();
        employeeLoanModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllEmployeeLoans(employeeLoanModel).subscribe((response: any) => {
            if (response.success == true) {
                this.company = response.data;
                this.temp = this.company;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
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

    getAllPeriodTypes() {
        this.isAnyOperationIsInprogress = true;
        var periodTypeModel = new PayRollTemplateModel();
        periodTypeModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPeriodTypes(periodTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.periodTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getAllLoanTypes() {
        this.isAnyOperationIsInprogress = true;
        var LoanTypeModel = new PayRollTemplateModel();
        LoanTypeModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllLoanTypes(LoanTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.loanTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.employeeLoanId = null;
        this.employeeLoanName = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.selectedEmployees = null;
        this.isAnyOperationIsInprogress = false;
        this.employeeLoanForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            employeeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            loanAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            loanTakenOn: new FormControl(null,
            ),
            loanInterestPercentagePerMonth: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            timePeriodInMonths: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            loanPaymentStartDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            loanBalanceAmount: new FormControl(null,
            ),
            loanTotalPaidAmount: new FormControl(null,
            ),
            loanClearedDate: new FormControl(null,
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            ),
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

        const temp = this.temp.filter(employeeLoans =>
            (employeeLoans.employeeName == null ? null : employeeLoans.employeeName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.name == null ? null : employeeLoans.name.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.description == null ? null : employeeLoans.description.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanAmount == null ? null : employeeLoans.loanAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanTakenOn != null && moment(employeeLoans.loanTakenOn).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanInterestPercentagePerMonth == null ? null : employeeLoans.loanInterestPercentagePerMonth.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.timePeriodInMonths == null ? null : employeeLoans.timePeriodInMonths.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanPaymentStartDate != null && moment(employeeLoans.loanPaymentStartDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanBalanceAmount == null ? null : employeeLoans.loanBalanceAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanBalanceAmount == null ? null : employeeLoans.loanBalanceAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (employeeLoans.loanClearedDate != null && moment(employeeLoans.loanClearedDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? employeeLoans.isApproved == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? employeeLoans.isApproved == false : null)
        );

        this.company = temp;
    }

    editEmployeeLoanPopupOpen(row, upsertEmployeeLoanPopUp) {
        this.employeeLoanForm.patchValue(row);
        this.employeeLoanId = row.employeeLoanId;
        this.timeStamp = row.timeStamp;
        this.employeeLoan = 'EMPLOYEELOAN.EDITEMPLOYEELOAN';
        if (row.isApproved == true) {
            this.isEditLoanAmount = true;
        }
        else {
            this.isEditLoanAmount = null;
        }
        this.selectedEmployees = row.employeeName;
        upsertEmployeeLoanPopUp.openPopover();
    }


    closeUpsertEmployeeLoanPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeeLoanPopover.forEach((p) => p.closePopover());
    }

    createEmployeeLoanPopupOpen(upsertEmployeeLoanPopUp) {
        this.clearForm();
        upsertEmployeeLoanPopUp.openPopover();
        this.isEditLoanAmount = false;
        this.employeeLoan = 'EMPLOYEELOAN.ADDEMPLOYEELOAN';
    }

    upsertEmployeeLoan(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.employeeLoanModel = this.employeeLoanForm.value;

        if (this.employeeLoanId) {
            this.employeeLoanModel.employeeLoanId = this.employeeLoanId;
            this.employeeLoanModel.timeStamp = this.timeStamp;
        }

        this.payRollService.upsertEmployeeLoan(this.employeeLoanModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertEmployeeLoanPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllEmployeeLoans();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    deleteEmployeeLoanPopUpOpen(row, deleteEmployeeLoanPopUp) {
        this.employeeLoanModel = new EmployeeLoanModel();
        this.employeeLoanModel = row;
        this.isEmployeeLoanArchived = !this.isArchivedTypes;
        this.employeeLoanModel.isArchived = this.isEmployeeLoanArchived;
        deleteEmployeeLoanPopUp.openPopover();
    }

    deleteEmployeeLoan() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.upsertEmployeeLoan(this.employeeLoanModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeeLoanPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmployeeLoans();
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

    approveEmployeeLoanPopUpOpen(row, approveEmployeeLoanDetailsPopUp) {
        this.isEmployeeLoanApproved = row.isApproved;
        this.employeeLoanModel = new EmployeeLoanModel();
        this.employeeLoanModel = row;
        this.employeeLoanModel.IsApproved = !row.isApproved;
        approveEmployeeLoanDetailsPopUp.openPopover();
    }

    closeApproveEmployeeLoanDialog() {
        this.isThereAnError = false;
        this.approveEmployeeLoanPopover.forEach((p) => p.closePopover());
    }

    closeDeleteEmployeeLoanDialog() {
        this.clearForm();
        this.deleteEmployeeLoanPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    getSelectedEmployees() {
        const employeeListDataDetailsList = this.employeesList;
        const employmentIds = this.employeeLoanForm.controls['employeeId'].value;

        const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
            return employmentIds.toString().includes(x.employeeId);
        })
        const employeeNames = employeeListDataDetails.map((x) => x.userName);
        this.selectedEmployees = employeeNames.toString();
    }

    goToProfile(userId) {
        this.router.navigate(["dashboard/profile", userId, "overview"]);
    }
} 