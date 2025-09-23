import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { PayRollService } from '../../services/PayRollService';
import { PayrollStatus } from '../../models/payroll-status';

@Component({
  selector: 'app-payroll-status',
  templateUrl: './payroll-status.component.html',
  styleUrls: ['./payroll-status.component.scss']
})
export class PayrollStatusComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("upsertPopUp") upsertPopover;
  @ViewChildren("deletePopUp") deletePopover;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getPayrollStatusList();
    }

    constructor(private payrollService: PayRollService,
        private translateService: TranslateService,private cdRef: ChangeDetectorRef) {super()}
    payrollStatusForm: FormGroup;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    payrollStatusList: PayrollStatus[];
    Id: string;
    payrollStatus: PayrollStatus;
    validationMessage: string;
    searchText:string;
    temp:any;
    timeStamp: any;
    isPayGradeArchived: boolean = false;
    payrollStatusEdit:string;

    getPayrollStatusList() {
        this.isAnyOperationIsInprogress = true;        

        this.payrollService.getPayrollStatusList().subscribe((response: any) => {
            console.log(response);
            if (response.success == true) {
                this.isThereAnError = false;
                this.payrollStatusList = response.data;
                this.temp=this.payrollStatusList;
                this.filterPayrollStatus();
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

    filterPayrollStatus(){
        this.payrollStatusList = this.temp.filter(item => (item.isArchived == this.isArchived));
    }

    closeUpsertPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPopover.forEach((p) => p.closePopover());
    }

    closeDeleteDialog() {
        this.isThereAnError = false;
        this.deletePopover.forEach((p) => p.closePopover());
    }


    createPopupOpen(upsertPopUp) {
      upsertPopUp.openPopover();
        this.payrollStatusEdit=this.translateService.instant('PAYROLLSTATUS.ADDPAYROLLSTATUSTITLE');
    }

    editPopupOpen(row, upsertPopUp) {
        this.payrollStatusForm.patchValue(row);
        this.Id = row.id;
        // this.timeStamp = row.timeStamp;
        this.payrollStatusEdit=this.translateService.instant('PAYROLLSTATUS.EDITPAYROLLSTATUSTITLE');
        upsertPopUp.openPopover();
    }

    deletePopUpOpen(row, deletePayGradePopUp) {
        this.Id = row.id;
        this.payrollStatus = row;
        deletePayGradePopUp.openPopover();
    }

    upsertPayrollStatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.payrollStatus = this.payrollStatusForm.value;
        this.payrollStatus.Id = this.Id;

        this.payrollService.upsertPayrollStatus(this.payrollStatus).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getPayrollStatusList();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });
    }

    deletePayrollStatus() {
        this.isAnyOperationIsInprogress = true;

        // this.payrollStatus = new PayrollStatus();
        this.payrollStatus.Id = this.Id;
        
        this.payrollStatus.IsArchived = !this.isArchived;

        this.payrollService.upsertPayrollStatus(this.payrollStatus).subscribe((response: any) => {
            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.deletePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getPayrollStatusList();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });        
    }

    clearForm() {
        this.Id = null;
        this.payrollStatus = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress=false;
        this.payrollStatusForm = new FormGroup({
            payRollStatusName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
    
        const temp = this.temp.filter(item => (item.payRollStatusName.toString().toLowerCase().indexOf(this.searchText) > -1));
        this.payrollStatusList = temp;
    }
    
    closeSearch() {
        this.searchText="";
        this.filterByName(null);
    }
}
