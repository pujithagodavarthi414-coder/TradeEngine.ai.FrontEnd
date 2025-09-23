import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CompanyManagementService } from '../../services/company-management.service';
import { NumberFormatModel } from '../../models/number-format-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-number-format',
    templateUrl: `number-format.component.html`

})

export class NumberFormatComponent extends CustomAppBaseComponent {

    @ViewChildren("upsertNumberFormatPopup") upsertNumberFormatPopover;
    @ViewChildren("deleteNumberFormatPopUp") deleteNumberFormatPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedTypes: boolean = false;
    numberFormats: NumberFormatModel[];
    isThereAnError: boolean;
    validationMessage: string;
    numberFormatModel: NumberFormatModel;
    numberFormatId: string;
    isFiltersVisible: boolean;
    numberFormatType: string;
    numberFormatForm: FormGroup;
    timeStamp: any;
    temp: any;
    searchText: string;
    numberFormat: any;
    numberFormatEdit:string;
    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private companyManagementService: CompanyManagementService,private snackbar:MatSnackBar) { 
            super();
            
            
         }


    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllNumberFormats();
    }

    getAllNumberFormats() {
        this.isAnyOperationIsInprogress = true;

        let numberformatmodel = new NumberFormatModel();
        numberformatmodel.IsArchived = this.isArchivedTypes;

        this.companyManagementService.getnumberFormats(numberformatmodel).subscribe((response: any) => {
            if (response.success == true) {
                this.numberFormats = response.data;
                this.temp = this.numberFormats;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createNumberFormatPopupOpen(upsertNumberFormatPopup) {
        upsertNumberFormatPopup.openPopover();
        this.numberFormatEdit=this.translateService.instant('NUMBERFORMAT.ADDNUMBERFORMAT');
    }

    upsertNumberFormat(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.numberFormatModel = this.numberFormatForm.value;
        this.numberFormatModel.NumberFormatId = this.numberFormatId;
        this.numberFormatModel.Timestamp = this.timeStamp;

        this.companyManagementService.upsertNumberFormat(this.numberFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertNumberFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllNumberFormats();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    closeUpsertNumberFormatPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertNumberFormatPopover.forEach((p) => p.closePopover());
    }

    closeDeleteNumberFormatDialog() {
        this.clearForm();
        this.deleteNumberFormatPopover.forEach((p) => p.closePopover());
    }

    deleteNumberFormat() {
        this.isAnyOperationIsInprogress = true;

        this.numberFormatModel = new NumberFormatModel();
        this.numberFormatModel.NumberFormatId = this.numberFormatId;
        this.numberFormatModel.NumberFormat = this.numberFormat;
        this.numberFormatModel.IsArchived = !this.isArchivedTypes;
        this.numberFormatModel.Timestamp = this.timeStamp;

        this.companyManagementService.upsertNumberFormat(this.numberFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteNumberFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllNumberFormats();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    editNumberFormat(row, upsertNumberFormatPopup) {
        this.numberFormatForm.patchValue(row);
        this.numberFormatId = row.numberFormatId;
        this.timeStamp = row.timeStamp;
        this.numberFormatEdit=this.translateService.instant('NUMBERFORMAT.EDITNUMBERFORMAT');
        upsertNumberFormatPopup.openPopover();
    }

    deleteNumberFormatPopUpOpen(row, deleteNumberFormatPopUp) {
        this.numberFormatId = row.numberFormatId;
        this.numberFormat = row.numberFormat;
        this.timeStamp = row.timeStamp;
        deleteNumberFormatPopUp.openPopover();
    }

    clearForm() {
        this.numberFormat = null;
        this.numberFormatId = null;
        this.numberFormatType = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.numberFormatForm = new FormGroup({
            numberFormat: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)]))
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

        const temp = this.temp.filter(number => number.numberFormat.toString().indexOf(this.searchText) > -1);
        this.numberFormats = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
