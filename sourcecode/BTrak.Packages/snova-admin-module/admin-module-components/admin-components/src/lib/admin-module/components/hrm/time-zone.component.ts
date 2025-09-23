import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { TimeZoneModel } from '../../models/hr-models/time-zone';

@Component({
    selector: 'app-fm-component-time-zone',
    templateUrl: `time-zone.component.html`

})

export class TimeZoneComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertTimeZonePopUp") upsertTimeZonePopover;
    @ViewChildren("deleteTimeZonePopUp") deleteTimeZonePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    public isArchived: boolean = false;
    timeZones: TimeZoneModel[];
    isAnyOperationIsInprogress: boolean = false;
    timeZoneData: TimeZoneModel;
    timeZoneName: string;
    timeZoneId: string;
    timeZoneOffset: string;
    timeZone: string;
    timeZoneAbbreviation: string;
    countryCode: string;
    countryName: string;
    isThereAnError: boolean = false;
    validationMessage: string;
    timeStamp: any;
    timeZoneForm: FormGroup;
    isFiltersVisible: boolean;
    regionId: string;
    regions: string;
    searchText: string;
    temp: any;
    timeZoneEdit: string;

    constructor(
        private translateService: TranslateService, private timeZoneService: HRManagementService,
        public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllTimeZones();
    }


    getAllTimeZones() {
        this.isAnyOperationIsInprogress = true;

        var timeZoneModel = new TimeZoneModel();
        timeZoneModel.isArchived = this.isArchived;
        this.timeZoneService.getAllTimeZones(timeZoneModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeZones = response.data;
                this.temp = this.timeZones;
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

    upsertTimeZone(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.timeZoneData = this.timeZoneForm.value;
        this.timeZoneData.timeZoneName = this.timeZoneData.timeZoneName.trim();
        this.timeZoneData.timeZoneOffset = this.timeZoneData.timeZoneOffset;
        this.timeZoneData.timeZone = this.timeZoneData.timeZone;
        this.timeZoneData.timeZoneAbbreviation = this.timeZoneData.timeZoneAbbreviation;
        this.timeZoneData.countryCode = this.timeZoneData.countryCode;
        this.timeZoneData.countryName = this.timeZoneData.countryName;
        this.timeZoneData.timeZoneId = this.timeZoneId;
        this.timeZoneData.timeStamp = this.timeStamp;

        this.timeZoneService.upsertTimeZones(this.timeZoneData).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTimeZonePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                formDirective.resetForm();
                this.getAllTimeZones();
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

    deleteTimeZone() {
        this.isAnyOperationIsInprogress = true;

        this.timeZoneData = new TimeZoneModel();
        this.timeZoneData.timeZoneId = this.timeZoneId;
        this.timeZoneData.timeZoneName = this.timeZoneName;
        this.timeZoneData.timeZoneOffset = this.timeZoneOffset;
        this.timeZoneData.timeZone = this.timeZone;
        this.timeZoneData.timeZoneAbbreviation = this.timeZoneAbbreviation;
        this.timeZoneData.countryName = this.countryName;
        this.timeZoneData.countryCode = this.countryCode;
        this.timeZoneData.timeStamp = this.timeStamp;
        this.timeZoneData.isArchived = !this.isArchived;

        this.timeZoneService.upsertTimeZones(this.timeZoneData).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTimeZonePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllTimeZones();
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

    createBranchPopupOpen(upsertTimeZonePopUp) {
        upsertTimeZonePopUp.openPopover();
        this.timeZoneEdit = this.translateService.instant('TIMEZONE.ADDTIMEZONE');
    }

    closeupsertTimeZonePopUp(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTimeZonePopover.forEach((p) => p.closePopover());
    }

    editBranchPopupOpen(row, upsertTimeZonePopUp) {
        this.timeZoneForm.patchValue(row);
        this.timeZoneId = row.timeZoneId;
        this.regionId = row.regionId;
        this.timeZoneName = row.timeZoneName;
        this.timeZoneOffset = row.timeZoneOffset;
        this.timeZone = row.timeZone;
        this.timeZoneAbbreviation = row.timeZoneAbbreviation;
        this.countryCode = row.countryCode;
        this.countryName = row.countryName;
        this.timeZoneEdit = this.translateService.instant('TIMEZONE.EDITTIMEZONE');
        this.timeStamp = row.timeStamp;
        upsertTimeZonePopUp.openPopover();
    }

    deleteTimeZonePopUpOpen(row, deleteTimeZonePopUp) {
        this.timeZoneId = row.timeZoneId;
        this.timeZoneName = row.timeZoneName;
        this.timeZoneOffset = row.timeZoneOffset;
        this.timeZone = row.timeZone;
        this.timeZoneAbbreviation = row.timeZoneAbbreviation;
        this.countryCode = row.countryCode;
        this.countryName = row.countryName;
        this.timeStamp = row.timeStamp;
        this.regionId = row.regionId;
        deleteTimeZonePopUp.openPopover();
    }

    closeDeleteBranchDialog() {
        this.isThereAnError = false;
        this.deleteTimeZonePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.timeZoneId = null;
        this.timeZoneData = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeZoneForm = new FormGroup({
            timeZoneName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            timeZone: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ),
            timeZoneAbbreviation: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(5)
                ])
            ),
            countryCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(5)
                ])
            ),
            countryName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ),
            timeZoneOffset: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(5),
                    Validators.pattern('^(?:Z|[+-](?:2[0-3]|[01][0-9])[0-5][0-9])$')
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
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((timeZone => (timeZone.timeZoneName.toLowerCase().indexOf(this.searchText) > -1)));
        this.timeZones = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
