import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { NationalityModel } from '../../models/hr-models/nationality-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-nationality',
    templateUrl: `nationality.component.html`

})

export class NationalityComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertNationalityPopup") upsertNationalityPopup;
    @ViewChildren("deleteNationalityPopup") deleteNationalityPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    nationalityForm: FormGroup;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    nationalities: NationalityModel[];
    nationalityName: string;
    nationalityId: string;
    nationalityModel: NationalityModel;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    nationality: string;
    isNationalityArchived: boolean = false;

    constructor(
        private translateService: TranslateService,
        private snackbar: MatSnackBar, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllNationalities();
    }

    getAllNationalities() {
        this.isAnyOperationIsInprogress = true;

        var nationalityModel = new NationalityModel();
        nationalityModel.isArchived = this.isArchived;

        this.hrManagementService.getAllNationalities(nationalityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.nationalities = response.data;
                this.temp = this.nationalities;
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

    closeUpsertNationalityPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertNationalityPopup.forEach((p) => p.closePopover());
    }

    closeDeleteNationalityDialog() {
        this.isThereAnError = false;
        this.deleteNationalityPopup.forEach((p) => p.closePopover());
    }


    createNationalitPopupOpen(upsertNationalityPopup) {
        upsertNationalityPopup.openPopover();
        this.nationality = this.translateService.instant('NATIONALITY.ADDNATIONALITYTITLE');
    }

    editNationalityPopupOpen(row, upsertNationalityPopup) {
        this.nationalityForm.patchValue(row);
        this.nationalityId = row.nationalityId;
        this.timeStamp = row.timeStamp;
        this.nationality = this.translateService.instant('NATIONALITY.EDITNATIONALITYNAMETITLE');
        upsertNationalityPopup.openPopover();
    }

    deleteNationalityPopupOpen(row, deleteNationalityPopup) {
        this.nationalityId = row.nationalityId;
        this.nationalityName = row.nationalityName;
        this.timeStamp = row.timeStamp;
        deleteNationalityPopup.openPopover();
    }

    upsertNationality(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.nationalityModel = this.nationalityForm.value;
        this.nationalityModel.nationalityName = this.nationalityModel.nationalityName.trim();
        this.nationalityModel.nationalityId = this.nationalityId;
        this.nationalityModel.timeStamp = this.timeStamp;

        this.hrManagementService.upsertNationality(this.nationalityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertNationalityPopup.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllNationalities();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteNationality() {
        this.isAnyOperationIsInprogress = true;

        this.nationalityModel = new NationalityModel();
        this.nationalityModel.nationalityId = this.nationalityId;
        this.nationalityModel.nationalityName = this.nationalityName;
        this.nationalityModel.timeStamp = this.timeStamp;
        this.nationalityModel.isArchived = !this.isArchived;

        this.hrManagementService.upsertNationality(this.nationalityModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.deleteNationalityPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllNationalities();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.nationalityName = null;
        this.nationalityId = null;
        this.nationalityModel = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.nationalityForm = new FormGroup({
            nationalityName: new FormControl(null,
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

        const temp = this.temp.filter((nationality => (nationality.nationalityName.toLowerCase().indexOf(this.searchText) > -1)));
        this.nationalities = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
