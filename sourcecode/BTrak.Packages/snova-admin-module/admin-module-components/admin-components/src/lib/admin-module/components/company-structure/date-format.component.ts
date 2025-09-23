import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CompanyManagementService } from '../../services/company-management.service';
import { DateFormatModel } from '../../models/date-format-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-date-format',
    templateUrl: `date-format.component.html`
})

export class DateFormatComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertDateFormatPopUp") upsertDateFormatPopover;
    @ViewChildren("deleteDateFormatPopUp") deleteDateFormatPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllDateFormats();
    }

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private companyManagementService: CompanyManagementService, private snackbar: MatSnackBar) {
        super();
        
        
    }

    dateFormat: DateFormatModel;
    isThereAnError: boolean = false;
    isArchived: boolean = false;
    dateformats: DateFormatModel[];
    dateFormatId: string;
    isAnyOperationIsInprogress: boolean = false;
    dateFormatForm: FormGroup;
    timeStamp: any;
    validationMessage: string;
    isFiltersVisible: boolean;
    isDateFormatArchived: boolean = false;
    dateFormatName: string;
    temp: any;
    searchText: string;
    dateFormats: string;

    getAllDateFormats() {
        this.isAnyOperationIsInprogress = true;

        var dateFormatModel = new DateFormatModel();
        dateFormatModel.isArchived = this.isArchived;

        this.companyManagementService.getDateFormats(dateFormatModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.dateformats = response.data;
                this.temp = this.dateformats;
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

    createDateFormatPopUpOpen(upsertDateFormatPopUp) {
        upsertDateFormatPopUp.openPopover();
        this.dateFormats = this.translateService.instant('DATEFORMAT.ADDDATEFORMAT');
    }

    editDateFormatPopupOpen(row, upsertDateFormatPopUp) {
        this.dateFormatForm.patchValue(row);
        this.dateFormatId = row.dateFormatId;
        this.timeStamp = row.timeStamp;
        this.dateFormats = this.translateService.instant('DATEFORMAT.EDITDATEFORMAT');
        upsertDateFormatPopUp.openPopover();
    }


    deleteDateFormatPopUpOpen(row, deleteDateFormatPopUp) {
        this.dateFormatId = row.dateFormatId;
        this.dateFormatName = row.dateFormatName;
        this.isDateFormatArchived = true;
        this.timeStamp = row.timeStamp;
        deleteDateFormatPopUp.openPopover();
    }

    closeUpsertDateFormatPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDateFormatPopover.forEach((p) => p.closePopover());
        this.validationMessage="";
    }

    closeDeleteDateFormatDialog() {
        this.deleteDateFormatPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.validationMessage="";
    }


    upsertDateFormat(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.dateFormat = this.dateFormatForm.value;
        this.dateFormat.dateFormatName = this.dateFormat.dateFormatName.trim();
        this.dateFormat.timeStamp = this.timeStamp;
        this.dateFormat.dateFormatId = this.dateFormatId;
        this.companyManagementService.upsertDateFormat(this.dateFormat).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertDateFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllDateFormats();
                this.validationMessage="";
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteDateFormat() {
        this.isAnyOperationIsInprogress = true;

        this.dateFormat = new DateFormatModel();
        this.dateFormat.dateFormatId = this.dateFormatId;
        this.dateFormat.timeStamp = this.timeStamp;
        this.dateFormat.dateFormatName = this.dateFormatName;
        this.dateFormat.isArchived = !this.isArchived;

        this.companyManagementService.upsertDateFormat(this.dateFormat).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteDateFormatPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllDateFormats();
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
        this.dateFormatName = null;
        this.dateFormatId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
        this.dateFormat = null;
        this.searchText = null;
        this.dateFormatForm = new FormGroup({
            dateFormatName: new FormControl(null,
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
            var dateFormatModel = new DateFormatModel();
            dateFormatModel.searchText = this.searchText
            dateFormatModel.isArchived = this.isArchived;
            this.companyManagementService.getDateFormats(dateFormatModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.isThereAnError = false;
                    this.dateformats = response.data;
                }
            })
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(dateFormat => dateFormat.dateFormatName.toString().indexOf(this.searchText) > -1);
        this.dateformats = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
