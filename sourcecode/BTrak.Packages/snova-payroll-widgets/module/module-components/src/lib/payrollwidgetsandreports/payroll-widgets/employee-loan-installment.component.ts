import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewChildren, Input, ViewChild } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SearchHourlyTds } from "../models/search-hourly-tdsmodel";
import { PayRollService } from "../services/PayRollService";
import { EmployeeLoan } from '../models/employee-loan';
import { EmployeeLoanModel } from '../models/employeeloancomponentmodel';
import { Router } from '@angular/router';
import { UserModel } from '../models/user';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'app-employee-loan-installment',
    templateUrl: `employee-loan-installment.component.html`
})

export class EmployeeLoanInstallment extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertEmployeeLoanPopUp") upsertEmployeeLoanPopover;
    @ViewChild("addEmployeeLoanPopup") addEmployeeLoanPopover;
    @ViewChild('myTable') table: any;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getEmployeeLoanInstallment();
        }
    }

    employeeLoanInstallmentId: string;
    permission: boolean = false;
    employeeId: string;
    employeeLoanList: any;
    validationMessage: string;
    isAnyOperationIsInprogress: boolean;
    employeeLoanForm: FormGroup;
    addemployeeLoanForm: FormGroup;
    popoverTitle: string;
    searchText: string;
    isArchivedTypes: boolean;
    timeStamp: any;
    principle: number;
    employeeLoans: EmployeeLoanModel[];
    userData$: UserModel;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private cdRef: ChangeDetectorRef,
        private payRollService: PayRollService, private toastr: ToastrService, private router: Router) {super()
    }


    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabelConfigurations();
        this.employeeLoanList = [];
        this.getEmployeeLoanInstallment();
    }

    clearForm() {
        this.employeeLoanForm = new FormGroup({
            principalAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            installmentAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isTobePaid: new FormControl(null
            ),
            employeeLoanId: new FormControl(null
            ),
            installmentDate: new FormControl(null
            )
        });

        this.addemployeeLoanForm = new FormGroup({
            employeeLoanId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            installmentAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }
    
    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }
      
    upsertemployeeLoan(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var employeeLoan = new EmployeeLoan();
        employeeLoan.employeeId = this.employeeId;
        employeeLoan.id = this.employeeLoanInstallmentId;
        employeeLoan.principalAmount = this.employeeLoanForm.value.principalAmount;
        employeeLoan.installmentAmount = this.employeeLoanForm.value.installmentAmount;
        employeeLoan.employeeLoanId = this.employeeLoanForm.value.employeeLoanId;
        employeeLoan.installmentDate = this.employeeLoanForm.value.installmentDate;
        employeeLoan.isTobePaid = this.employeeLoanForm.value.isTobePaid;
        employeeLoan.timeStamp = this.timeStamp;
        this.payRollService.upsertEmployeeLoanInstallMent(employeeLoan).subscribe((response: any) => {
            if (response.success == true) {
                this.closeUpsertEmployeeLoan(formDirective);
                this.getEmployeeLoanInstallment();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        })
    }

    getAllEmployeeLoans() {
        this.isAnyOperationIsInprogress = true;
        var employeeLoanModel = new EmployeeLoanModel();
        employeeLoanModel.isArchived = this.isArchivedTypes;
        employeeLoanModel.IsApproved = true;
        employeeLoanModel.employeeId = this.employeeId;
        this.payRollService.getAllEmployeeLoans(employeeLoanModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeLoans = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    addemployeeLoan(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var employeeLoan = new EmployeeLoan();
        employeeLoan.employeeId = this.employeeId;
        employeeLoan.employeeLoanId = this.addemployeeLoanForm.value.employeeLoanId;
        employeeLoan.installmentAmount = this.addemployeeLoanForm.value.installmentAmount;

        this.payRollService.upsertEmployeeLoanInstallMent(employeeLoan).subscribe((response: any) => {
            if (response.success == true) {
                this.closeAddEmployeeLoan(formDirective);
                this.getEmployeeLoanInstallment();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        })
    }

    createAddEmployeeLoan(addEmployeeLoanPopup) {
        this.popoverTitle = "PAYROLLBRANCHCONFIGURATION.CREATEEMPLOYEELOANINSTALLMENT";
        this.clearForm();
        this.addEmployeeLoanPopover = addEmployeeLoanPopup;
        addEmployeeLoanPopup.openPopover();
    }

    createUpsertEmployeeLoan(row, upsertEmployeeLoanPopUp) {
        this.clearForm();
        this.employeeLoanForm.patchValue(row);
        this.timeStamp = row.timeStamp;
        this.employeeLoanInstallmentId = row.id;
        upsertEmployeeLoanPopUp.openPopover();
    }

    closeAddEmployeeLoan(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.addEmployeeLoanPopover.closePopover();
    }

    closeUpsertEmployeeLoan(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeeLoanPopover.forEach((p) => p.closePopover());
    }

    getEmployeeLoanInstallment() {
        this.isAnyOperationIsInprogress = true;
        var searchHourlyTds = new SearchHourlyTds();
        searchHourlyTds.employeeId = this.employeeId;
        this.payRollService.getEmployeeLoanInstallment(searchHourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeLoanList = [];
                if (response.data) {
                    this.employeeLoanList = response.data;
                }
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        })
        this.getAllEmployeeLoans();
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46);
    }


    toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }

    downloadEmployeeLoanStatement(employeeLoanId) {
        var employeeLoanModel = new EmployeeLoanModel();
        employeeLoanModel.employeeId = this.employeeId;
        employeeLoanModel.employeeLoanId = employeeLoanId;
        this.payRollService.downloadEmployeeLoanStatement(employeeLoanModel).subscribe((response: any) => {
            if (response != null) {
                const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.template;base64,' + response;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = 'EmployeeLoanStatement.doc';
                downloadLink.click();
                this.toastr.success("", "Downloaded successfully");
            }
            else {
                this.toastr.error("", "Could not download the document please contact administrator");
            }
        })
    }

}