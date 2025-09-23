import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { PayGradeModel } from '../../models/hr-models/pay-grade-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-pay-grade",
    templateUrl: `pay-grade.component.html`

})

export class PayGradeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertPayGradePopUp") upsertPayGradePopover;
    @ViewChildren("deletePayGradePopUp") deletePayGradePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    payGradeForm: FormGroup;
    isThereAnError = false;
    isAnyOperationIsInprogress = false;
    isFiltersVisible: boolean;
    isArchived = false;
    payGrades: PayGradeModel[];
    payGradeName: string;
    payGradeId: string;
    payGrade: PayGradeModel;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    isPayGradeArchived = false;
    payGradeEdit: string;

    constructor(
        private snackbar: MatSnackBar,
        private hrManagementService: HRManagementService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayGrades();
    }

    getAllPayGrades() {
        this.isAnyOperationIsInprogress = true;
        const payGradeModel = new PayGradeModel();
        payGradeModel.isArchived = this.isArchived;
        this.hrManagementService.getPayGrades(payGradeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                this.payGrades = response.data;
                this.temp = this.payGrades;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    closeUpsertPayGradePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayGradePopover.forEach((p) => p.closePopover());
    }

    closeDeletePayGradeDialog() {
        this.isThereAnError = false;
        this.deletePayGradePopover.forEach((p) => p.closePopover());
    }

    createPayGradePopupOpen(upsertPayGradePopUp) {
        upsertPayGradePopUp.openPopover();
        this.payGradeEdit = this.translateService.instant("PAYGRADE.ADDPAYGRADETITLE");
    }

    editPayGradePopupOpen(row, upsertPayGradePopUp) {
        this.payGradeForm.patchValue(row);
        this.payGradeId = row.payGradeId;
        this.timeStamp = row.timeStamp;
        this.payGradeEdit = this.translateService.instant("PAYGRADE.EDITPAYGRADETITLE");
        upsertPayGradePopUp.openPopover();
    }

    deletePayGradePopUpOpen(row, deletePayGradePopUp) {
        this.payGradeId = row.payGradeId;
        this.payGradeName = row.payGradeName;
        this.timeStamp = row.timeStamp;
        deletePayGradePopUp.openPopover();
    }

    upsertPayGrade(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payGrade = this.payGradeForm.value;
        this.payGrade.payGradeName = this.payGrade.payGradeName.trim();
        this.payGrade.payGradeId = this.payGradeId;
        this.payGrade.timeStamp = this.timeStamp;
        this.hrManagementService.upsertPayGrade(this.payGrade).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayGrades();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    deletePayGrade() {
        this.isAnyOperationIsInprogress = true;
        this.payGrade = new PayGradeModel();
        this.payGrade.payGradeId = this.payGradeId;
        this.payGrade.payGradeName = this.payGradeName;
        this.payGrade.timeStamp = this.timeStamp;
        this.payGrade.isArchived = !this.isArchived;
        this.hrManagementService.upsertPayGrade(this.payGrade).subscribe((response: any) => {
            if (response.success === true) {
                this.isAnyOperationIsInprogress = false;
                this.deletePayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayGrades();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.payGradeName = null;
        this.payGradeId = null;
        this.payGrade = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payGradeForm = new FormGroup({
            payGradeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((payGrade) => (payGrade.payGradeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.payGrades = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.filterByName(null);
    }
}
