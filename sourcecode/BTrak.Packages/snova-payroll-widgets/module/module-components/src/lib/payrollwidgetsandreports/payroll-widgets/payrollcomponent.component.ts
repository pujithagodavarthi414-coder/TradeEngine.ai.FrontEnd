import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PayRollComponentModel } from '../models/PayRollComponentModel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
    selector: 'app-payrollcomponent',
    templateUrl: `payrollcomponent.component.html`
})

export class PayRollComponentComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollComponentPopUp") upsertPayRollComponentPopover;
    @ViewChildren("deletePayRollComponentPopUp") deletePayRollComponentPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollComponent: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollComponentName: string;
    timeStamp: any;
    searchText: string;
    payRollComponentForm: FormGroup;
    payRollComponentModel: PayRollComponentModel;
    isPayRollComponentArchived: boolean = false;
    isVariablePay: boolean;
    componentName: string;
    isArchivedTypes: boolean = false;
    isDeduction: boolean;
    company: string;
    payRollComponentId: string;
    employeeContributionPercentage: number;
    employerContributionPercentage: number;
    relatedToContributionPercentage: boolean;
    isVisible: boolean;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayRollComponents();
        
    }

    constructor(private payRollService: PayRollService,
        private snackbar: MatSnackBar, private translateService: TranslateService, private cdRef: ChangeDetectorRef,private toastr: ToastrService) { super() }


    getAllPayRollComponents() {
        this.isAnyOperationIsInprogress = true;
        var payRollComponentModel = new PayRollComponentModel();
        payRollComponentModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
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

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.payRollComponentId = null;
        this.payRollComponentName = null;
        this.componentName = null;
        this.isDeduction = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isVariablePay = null;
        this.isVisible = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollComponentForm = new FormGroup({
            componentName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            isDeduction: new FormControl(null,
            ),
            isVariablePay: new FormControl(null,
            ),
            isVisible: new FormControl(null,
            ),
            employeeContributionPercentage: new FormControl(null,
            ),
            employerContributionPercentage: new FormControl(null,
            ),
            relatedToContributionPercentage: new FormControl(null,
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

        const temp = this.temp.filter(payRollComponents => 
               (payRollComponents.componentName == null ? null : payRollComponents.componentName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollComponents.employeeContributionPercentage == null ? null : payRollComponents.employeeContributionPercentage.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollComponents.employerContributionPercentage == null ? null : payRollComponents.employerContributionPercentage.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1)  ? payRollComponents.isDeduction == true :
                    ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollComponents.isDeduction == false: null)
               || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1)  ? payRollComponents.isVisible == true :
                    ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollComponents.isVisible == false: null)
            );

        this.company = temp;
    }

    editPayRollComponentPopupOpen(row, upsertPayRollComponentPopUp) {
        this.payRollComponentForm.patchValue(row);
        this.payRollComponentId = row.payRollComponentId;
        this.timeStamp = row.timeStamp;
        this.payRollComponent = 'PAYROLLCOMPONENT.EDITPAYROLLCOMPONENT';
        upsertPayRollComponentPopUp.openPopover();
    }


    closeUpsertPayRollComponentPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollComponentPopover.forEach((p) => p.closePopover());
    }

    createPayRollComponentPopupOpen(upsertPayRollComponentPopUp) {
        this.clearForm();
        upsertPayRollComponentPopUp.openPopover();
        this.payRollComponent = 'PAYROLLCOMPONENT.ADDPAYROLLCOMPONENT';
    }

    upsertPayRollComponent(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollComponentModel = this.payRollComponentForm.value;
        if(this.payRollComponentModel.relatedToContributionPercentage == false){
            this.payRollComponentModel.employeeContributionPercentage = null;
            this.payRollComponentModel.employerContributionPercentage = null;
        }
        if (this.payRollComponentId) {
            this.payRollComponentModel.payRollComponentId = this.payRollComponentId;
            this.payRollComponentModel.timeStamp = this.timeStamp;
        }
        this.payRollComponentModel.isVisible = true;

        let sum = (this.payRollComponentModel.employeeContributionPercentage != null? this.payRollComponentModel.employeeContributionPercentage:0)+
        (this.payRollComponentModel.employerContributionPercentage != null? this.payRollComponentModel.employerContributionPercentage:0)

        if(this.payRollComponentModel.relatedToContributionPercentage == true && sum > 100){
            this.toastr.error("", this.translateService.instant("PAYROLLCOMPONENT.SUMPERCENTAGEVALIDATION") );
            this.isAnyOperationIsInprogress = false;
        }
        else if((this.payRollComponentModel.relatedToContributionPercentage == true && sum <= 100) || this.payRollComponentModel.relatedToContributionPercentage != true){
            this.payRollService.upsertPayRollComponent(this.payRollComponentModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertPayRollComponentPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getAllPayRollComponents();
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                }
                this.cdRef.detectChanges();
            });
        }
        
    }

    deletePayRollComponentPopUpOpen(row, deletePayRollComponentPopUp) {
        this.payRollComponentId = row.payRollComponentId;
        this.componentName = row.componentName;
        this.isDeduction = row.isDeduction;
        this.isVariablePay = row.isVariablePay;
        this.isVisible = row.isVisible;
        this.relatedToContributionPercentage = row.relatedToContributionPercentage;
        this.timeStamp = row.timeStamp;
        this.employeeContributionPercentage = row.employeeContributionPercentage;
        this.employerContributionPercentage = row.employerContributionPercentage;
        this.isPayRollComponentArchived = !this.isArchivedTypes;
        deletePayRollComponentPopUp.openPopover();
    }

    deletePayRollComponent() {
        this.isAnyOperationIsInprogress = true;
        this.payRollComponentModel = new PayRollComponentModel();
        this.payRollComponentModel.payRollComponentId = this.payRollComponentId;
        this.payRollComponentModel.componentName = this.componentName;
        this.payRollComponentModel.isDeduction = this.isDeduction;
        this.payRollComponentModel.isVariablePay = this.isVariablePay;
        this.payRollComponentModel.isVisible = this.isVisible;
        this.payRollComponentModel.relatedToContributionPercentage = this.relatedToContributionPercentage;
        this.payRollComponentModel.timeStamp = this.timeStamp;
        this.payRollComponentModel.employeeContributionPercentage = this.employeeContributionPercentage;
        this.payRollComponentModel.employerContributionPercentage = this.employerContributionPercentage;
        this.payRollComponentModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollComponent(this.payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollComponentPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollComponents();
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


    closeDeletePayRollComponentDialog() {
        this.clearForm();
        this.deletePayRollComponentPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }


    chanageContributionPercetageRequired(){
        if(this.payRollComponentForm.get("relatedToContributionPercentage").value == false){
            this.payRollComponentForm.controls["employeeContributionPercentage"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.payRollComponentForm.get("employeeContributionPercentage").updateValueAndValidity();
            this.payRollComponentForm.controls["employerContributionPercentage"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.payRollComponentForm.get("employerContributionPercentage").updateValueAndValidity();
        }
        else{
            this.payRollComponentForm.controls["employeeContributionPercentage"].clearValidators();
            this.payRollComponentForm.get("employeeContributionPercentage").updateValueAndValidity();
            this.payRollComponentForm.controls["employerContributionPercentage"].clearValidators();
            this.payRollComponentForm.get("employerContributionPercentage").updateValueAndValidity();

            this.payRollComponentForm.controls['employeeContributionPercentage'].setValue(null);
            this.payRollComponentForm.controls['employerContributionPercentage'].setValue(null);
        }
    }
} 