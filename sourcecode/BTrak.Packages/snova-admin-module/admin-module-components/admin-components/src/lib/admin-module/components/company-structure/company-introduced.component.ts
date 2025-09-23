import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { IntroducedByOptionsModel } from '../../models/introduced-by-option-model';
import { CompanyManagementService } from '../../services/company-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';


@Component({
    selector: 'app-fm-component-company-introduced',
    templateUrl: `company-introduced.component.html`
})

export class CompanyIntroducedByComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertIntroducedByOptionPopUp") upsertIntroducedByOptionPopover;
    @ViewChildren("deleteIntroducedOptionPopUp") deleteIntroducedOptionPopover;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchivedOptions: boolean = false;
    isThereAnError: boolean;
    companyIntroducedOptions: IntroducedByOptionsModel[];
    timeStamp: any;
    validationMessage: string;
    option: string;
    companyIntroducedByOptionId: string;
    introducedByOptionsModel: IntroducedByOptionsModel;
    IntroducedByOptionForm: FormGroup;
    temp: any;
    searchText: string;
    companyIntroaducedOption: string;
    dashboardFilters: DashboardFilterModel;

    constructor(private translateService: TranslateService,
        private companyManagementService: CompanyManagementService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.GetAllIntroducedByOptions();
    }

    GetAllIntroducedByOptions() {
        this.isAnyOperationIsInprogress = true;

        var introducedByOptionsModel = new IntroducedByOptionsModel();
        introducedByOptionsModel.isArchived = this.isArchivedOptions;

        this.companyManagementService.getAllIntroducedByOptions(introducedByOptionsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.companyIntroducedOptions = response.data;
                this.temp = this.companyIntroducedOptions;
                this.clearForm();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    editIntroducedByOption(row, upsertIntroducedByOptionPopUp) {
        this.IntroducedByOptionForm.patchValue(row);
        this.companyIntroducedByOptionId = row.companyIntroducedByOptionId;
        this.timeStamp = row.timeStamp;
        this.companyIntroaducedOption = this.translateService.instant('COMPANYINTRODUCED.EDIT');
        upsertIntroducedByOptionPopUp.openPopover();
    }

    deleteIntroducedOptionPopUpOpen(row, deleteIntroducedOptionPopUp) {
        this.companyIntroducedByOptionId = row.companyIntroducedByOptionId;
        this.option = row.option;
        this.timeStamp = row.timeStamp;
        deleteIntroducedOptionPopUp.openPopover();
    }

    closeDeleteIntroducedOptionPopUp() {
        this.clearForm();
        this.deleteIntroducedOptionPopover.forEach((p) => p.closePopover());
    }

    deleteIntroducedByOption() {
        this.isAnyOperationIsInprogress = true;

        this.introducedByOptionsModel = new IntroducedByOptionsModel();
        this.introducedByOptionsModel.companyIntroducedByOptionId = this.companyIntroducedByOptionId;
        this.introducedByOptionsModel.option = this.option;
        this.introducedByOptionsModel.timeStamp = this.timeStamp;
        this.introducedByOptionsModel.isArchived = !this.isArchivedOptions;

        this.companyManagementService.upsertIntroducedByOption(this.introducedByOptionsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteIntroducedOptionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.GetAllIntroducedByOptions();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    createIntroducedByOption(upsertIntroducedByOptionPopUp) {
        this.companyIntroaducedOption = this.translateService.instant('COMPANYINTRODUCED.ADD');
        upsertIntroducedByOptionPopUp.openPopover();
    }

    closeUpserIntroducedByOptionPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertIntroducedByOptionPopover.forEach((p) => p.closePopover());
    }

    upsertIntroducedByOption(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.introducedByOptionsModel = this.IntroducedByOptionForm.value;
        this.introducedByOptionsModel.companyIntroducedByOptionId = this.companyIntroducedByOptionId;
        this.introducedByOptionsModel.option = this.introducedByOptionsModel.option.trim();
        this.introducedByOptionsModel.timeStamp = this.timeStamp;

        this.companyManagementService.upsertIntroducedByOption(this.introducedByOptionsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertIntroducedByOptionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.GetAllIntroducedByOptions();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.timeStamp = null;
        this.option = null;
        this.companyIntroducedByOptionId = null;
        this.introducedByOptionsModel = null;
        this.searchText = null;
        this.IntroducedByOptionForm = new FormGroup({
            option: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ]))
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(company => company.option.toLowerCase().indexOf(this.searchText) > -1);
        this.companyIntroducedOptions = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
