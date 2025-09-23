import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { PayRollService } from '../../services/PayRollService';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeTemplate } from '../../models/employee-payroll-template';
import { EmployeePayRollConfiguration } from '../../models/employee-payroll-configuration';
import * as moment_ from 'moment';
const moment = moment_;
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Component({
    selector: 'app-employee-payroll-templates',
    templateUrl: './employee-payroll-templates.component.html',
    styleUrls: ['./employee-payroll-templates.component.scss']
})
export class EmployeePayrollTemplatesComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayGradePopUp") upsertPayGradePopover;
    @ViewChildren("deletePayGradePopUp") deletePayGradePopover;
    @ViewChildren("approveBonusPopUp") approveBonusPopover;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getEmployeeConfigurations();
        this.getEmployeesTemplates();
    }

    constructor(private payRollService: PayRollService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef) { super() }

    payGradeForm: FormGroup;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    employeepayrollConfigs: EmployeePayRollConfiguration[];
    payGradeName: string;
    payGradeId: string;
    EmployeeId: string;
    employeepayrollConfig: EmployeePayRollConfiguration;
    config: EmployeePayRollConfiguration;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    isPayGradeArchived: boolean = false;
    payGradeEdit: string;
    employeeTemplate: any;
    tempEmployeeTemplates: EmployeeTemplate[];
    isApproved: boolean;

    getEmployeeConfigurations() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.getEmployeePayrollConfiguration().subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.employeepayrollConfigs = response.data;
                this.temp = this.employeepayrollConfigs;
                this.filterSlabs();
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

    filterSlabs() {
        console.log(this.temp);
        this.employeepayrollConfigs = this.temp.filter(slab => slab.isApproved == this.isArchived);
    }

    closeUpsertTaxSlabsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayGradePopover.forEach((p) => p.closePopover());
    }

    closeDeleteApproveBonusDialog() {
        this.isThereAnError = false;
        this.approveBonusPopover.forEach((p) => p.closePopover());
    }


    approveBonusPopUpOpen(row, approveBonusPopUp) {
        this.payGradeId = row.id;
        this.EmployeeId = row.employeeId;
        this.employeepayrollConfig = row;
        this.isApproved = row.isApproved;

        this.employeepayrollConfig.IsApproved = !row.isApproved;

        approveBonusPopUp.openPopover();
    }

    deleteTaxSlab() {
        this.isAnyOperationIsInprogress = true;

        this.payRollService.upsertEmployeePayrollConfiguration(this.employeepayrollConfig).subscribe((response: any) => {
            if (response.success == true) {
                this.approveBonusPopover.forEach((p) => p.closePopover());
                this.clearForm();
                // formDirective.resetForm();
                this.getEmployeeConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    editTaxSlabPopupOpen(row, upsertPayGradePopUp) {
        this.payGradeForm.patchValue(row);
        this.payGradeId = row.id;
        this.EmployeeId = row.employeeId;
        this.employeepayrollConfig = row;
        this.tempEmployeeTemplates = this.employeeTemplate.filter(empTemplate => (empTemplate.employeeId == this.EmployeeId && empTemplate.payRollTemplateName != null));

        this.payGradeEdit = this.translateService.instant("Update Employee template");
        upsertPayGradePopUp.openPopover();
    }


    upsertTaxSlab(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.employeepayrollConfig = this.payGradeForm.value;
        this.employeepayrollConfig.Id = this.payGradeId;
        this.employeepayrollConfig.EmployeeId = this.EmployeeId;

        this.payRollService.upsertEmployeePayrollConfiguration(this.employeepayrollConfig).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getEmployeeConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    clearForm() {
        this.payGradeName = null;
        this.payGradeId = null;
        // this.employeeBonus = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payGradeForm = new FormGroup({
            employeeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            payrollTemplateId: new FormControl(null,
                Validators.compose([Validators.required
                ])
            ),
            activeFrom: new FormControl('',
                Validators.compose([
                ])
            ),
            activeTo: new FormControl('',
                Validators.compose([
                ])
            ),
        })
    }
    getEmployeesTemplates() {
        this.payRollService.getEmployeesPayTemplates().subscribe((responseData: any) => {
            this.employeeTemplate = responseData.data;

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

        const temp = this.temp.filter((item =>
            (((item.employeeName == null ? null : item.employeeName.toString().toLowerCase().indexOf(this.searchText) > -1))
                || (item.employeeName != null && item.employeeName.toString().toLowerCase().indexOf(this.searchText) > -1)
                || (item.payrollName != null && item.payrollName.toString().toLowerCase().indexOf(this.searchText) > -1)
                || (item.activeFrom != null && moment(item.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
                || (item.activeTo != null && moment(item.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)) && item.isApproved == this.isArchived)
        );
        this.employeepayrollConfigs = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.filterByName(null);
    }

    checkValidations() {
        var taxrange = this.payGradeForm.value;

        if (taxrange.activeTo != null && new Date(taxrange.activeFrom) > new Date(taxrange.activeTo)) {
            this.isAnyOperationIsInprogress = true;
            this.isThereAnError = true;
            this.validationMessage = "Active from date should be less than the Active to date.";

        } else {
            this.isAnyOperationIsInprogress = false;
            this.isThereAnError = false;
        }
    }
}
