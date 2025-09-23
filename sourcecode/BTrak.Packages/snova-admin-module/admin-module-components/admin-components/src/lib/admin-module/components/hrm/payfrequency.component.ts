import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { PayfrequencyModel } from '../../models/hr-models/payfrequency-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-payfrequency",
    templateUrl: `payfrequency.component.html`

})

export class PayfrequencyComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("payfrequencyPopup") upsertPayfrequencyPopover;
    @ViewChildren("deletepayfrequencyPopup") deletepayfrequencyPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isFiltersVisible: boolean;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    payfrequency: PayfrequencyModel[];
    isThereAnError = false;
    validationMessage: string;
    payfrequencyForm: FormGroup;
    timeStamp: any;
    payFrequencyId: string;
    payFrequencyName: string;
    searchText: string;
    temp: any;
    payfrequencyModel: PayfrequencyModel;
    isPayfrequencyArchived: boolean;
    payfrequencyEdit: string;

    constructor(
        private translateService: TranslateService,
        private hrManagement: HRManagementService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getPayFrequency();
    }

    getPayFrequency() {
        this.isAnyOperationIsInprogress = true;
        const payfrequencyModel = new PayfrequencyModel();
        payfrequencyModel.isArchived = this.isArchived;
        this.hrManagement.getPayFrequency(payfrequencyModel).subscribe((response: any) => {
            if (response.success === true) {
                this.payfrequency = response.data;
                this.temp = this.payfrequency;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    upsertPayFrequency(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let payfrequencyModel = new PayfrequencyModel();
        payfrequencyModel = this.payfrequencyForm.value;
        payfrequencyModel.payFrequencyName = payfrequencyModel.payFrequencyName.trim();
        payfrequencyModel.payFrequencyId = this.payFrequencyId;
        payfrequencyModel.timeStamp = this.timeStamp;
        this.hrManagement.upsertPayFrequency(payfrequencyModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPayfrequencyPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getPayFrequency();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.payFrequencyId = null;
        this.validationMessage = null;
        this.payFrequencyName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.payfrequencyModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.payfrequencyForm = new FormGroup({
            payFrequencyName: new FormControl(null,
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

    createPayfrequency(payfrequencyPopup) {
        payfrequencyPopup.openPopover();
        this.payfrequencyEdit = this.translateService.instant("PAYFREQUENCY.ADDPAYFREQUENCYTITLE");
    }

    closeUpsertPayfrequencyPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayfrequencyPopover.forEach((p) => p.closePopover());
    }

    editPayfrequency(row, payfrequencyPopup) {
        this.payfrequencyForm.patchValue(row);
        this.payFrequencyId = row.payFrequencyId;
        payfrequencyPopup.openPopover();
        this.payfrequencyEdit = this.translateService.instant("PAYFREQUENCY.EDITPAYFREQUENCY");
        this.timeStamp = row.timeStamp;
    }

    deletePayfrequencyPopUpOpen(row, deletepayfrequencyPopup) {
        this.payFrequencyId = row.payFrequencyId;
        this.payFrequencyName = row.payFrequencyName;
        this.timeStamp = row.timeStamp;
        this.isPayfrequencyArchived = !this.isArchived;
        deletepayfrequencyPopup.openPopover();
    }

    deletePayfrequency() {
        this.isAnyOperationIsInprogress = true;
        const payfrequencyModel = new PayfrequencyModel();
        payfrequencyModel.payFrequencyId = this.payFrequencyId;
        payfrequencyModel.payFrequencyName = this.payFrequencyName;
        payfrequencyModel.timeStamp = this.timeStamp;
        payfrequencyModel.isArchived = this.isPayfrequencyArchived;
        this.hrManagement.upsertPayFrequency(payfrequencyModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletepayfrequencyPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getPayFrequency();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeletePayfrequencyPopup() {
        this.clearForm();
        this.deletepayfrequencyPopup.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((payfrequency) => (payfrequency.payFrequencyName.toLowerCase().indexOf(this.searchText) > -1)));
        this.payfrequency = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
