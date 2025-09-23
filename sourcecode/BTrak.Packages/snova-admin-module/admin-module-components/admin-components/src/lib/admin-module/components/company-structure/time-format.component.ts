import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CompanyManagementService } from '../../services/company-management.service';
import { TimeFormatModel } from '../../models/time-format-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-time-format',
    templateUrl: `time-format.component.html`

})

export class TimeFormatComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteTimeFormatPopUp") deleteTimeFormatPopover;
    @ViewChildren("upsertTimeFormatPopUp") upsertTimeFormatPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedFormats: boolean = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    timeformats: TimeFormatModel[];
    validationMessage: string;
    timeFormatId: string;
    timeFormatName: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    timeFormatModel: TimeFormatModel;
    TimeFormatForm: FormGroup;
    timeFormat: string;
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllTimeFormats();
    }

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private companyManagementService: CompanyManagementService, private snackbar: MatSnackBar) {
        super();
        
        
    }

    getAllTimeFormats() {
        this.isAnyOperationIsInprogress = true;

        var timeFormatModel = new TimeFormatModel();
        timeFormatModel.isArchived = this.isArchivedFormats;

        this.companyManagementService.getAllTimeFormats(timeFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeformats = response.data;
                this.temp = this.timeformats;
                this.clearForm();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteTimeFormatPopUpOpen(row, deleteTimeFormatPopUp) {
        this.timeFormatId = row.timeFormatId;
        this.timeFormatName = row.timeFormatName;
        this.timeStamp = row.timeStamp;
        deleteTimeFormatPopUp.openPopover();
    }

    closeDeleteTimeFormatPopUp() {
        this.clearForm();
        this.deleteTimeFormatPopover.forEach((p) => p.closePopover());
    }

    deleteTimeFormat() {
        this.isAnyOperationIsInprogress = true;

        this.timeFormatModel = new TimeFormatModel();
        this.timeFormatModel.timeFormatId = this.timeFormatId;
        this.timeFormatModel.timeFormatName = this.timeFormatName;
        this.timeFormatModel.timeStamp = this.timeStamp;
        this.timeFormatModel.isArchived = !this.isArchivedFormats;

        this.companyManagementService.upsertTimeFormat(this.timeFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTimeFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTimeFormats();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            this.cdRef.detectChanges();
        });
    }

    editTimeFormatPopupOpen(row, upsertTimeFormatPopUp) {
        this.TimeFormatForm.patchValue(row);
        this.timeFormatId = row.timeFormatId;
        this.timeStamp = row.timeStamp;
        this.timeFormat = this.translateService.instant('TIMEFORMAT.EDITTIMEFORMATS');
        upsertTimeFormatPopUp.openPopover();
    }

    closeUpsertTimeFormatPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTimeFormatPopover.forEach((p) => p.closePopover());
    }

    upsertTimeFormat(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.timeFormatModel = this.TimeFormatForm.value;
        this.timeFormatModel.timeFormatName = this.timeFormatModel.timeFormatName.trim();
        this.timeFormatModel.timeFormatId = this.timeFormatId;
        this.timeFormatModel.timeStamp = this.timeStamp;

        this.companyManagementService.upsertTimeFormat(this.timeFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTimeFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTimeFormats();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            this.cdRef.detectChanges();
        });
    }

    createTimeFormat(upsertTimeFormatPopUp) {
        upsertTimeFormatPopUp.openPopover();
        this.timeFormat = this.translateService.instant('TIMEFORMAT.ADDTIMEFORMATS');
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.timeStamp = null;
        this.timeFormatName = null;
        this.timeFormatId = null;
        this.searchText = null;
        this.TimeFormatForm = new FormGroup({
            timeFormatName: new FormControl(null,
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

        const temp = this.temp.filter(time => time.timeFormatName.toString().toLowerCase().indexOf(this.searchText) > -1);
        this.timeformats = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
