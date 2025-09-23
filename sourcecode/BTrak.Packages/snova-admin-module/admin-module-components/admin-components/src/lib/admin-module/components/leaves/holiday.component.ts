import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { HRManagementService } from '../../services/hr-management.service';
import { TranslateService } from '@ngx-translate/core';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HolidayModel } from '../../models/leaves-models/holiday-model';
import { WeekModel } from '../../models/leaves-models/WeekModel.model';
import { Page } from '../../models/Page';
import { LeavesManagementService } from '../../services/leaves-management.service';
import { CountryModel } from '../../models/hr-models/country-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-holiday',
    templateUrl: `holiday.component.html`

})

export class HolidayComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertHolidayPopUp") upsertHolidayPopover;
    @ViewChildren("upsertWeekOffHolidayPopUp") upsertWeekOffHolidayPopUp;
    @ViewChildren("deleteHolidayPopUp") deleteHolidayPopover;
    @ViewChildren("deleteWeekOffHolidayPopUp") deleteWeekOffHolidayPopover;
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    weekOffArchived: boolean = false;
    isThereAnError: boolean;
    temp: any;
    tempOff: any;
    countries: any;
    branchList: HrBranchModel[];
    timeStamp: any;
    validationMessage: string;
    holidayForm: FormGroup;
    weekOffHolidayForm: FormGroup;
    holidayModel: HolidayModel[];
    weekOffHolidays: HolidayModel[];
    holidayInputModel: HolidayModel;
    weekOffHolidayInputModel: HolidayModel;
    holidayId: string;
    holidayReason: string;
    countryId: string;
    searchText: string;
    holidayDate: Date;
    isweekOffUpsertInProgress: boolean;
    upsertInProgress: boolean;
    holidayEdit: string;
    minDateForEndDate: Date;
    endDateBool: boolean;
    dateFrom: Date;
    dateTo: Date;
    weekOffDays: string;;
    branchId: string;
    weekModel: WeekModel[];
    page = new Page();
    holidayPage = new Page();
    sortBy: string;
    sortDirectionAsc: boolean;
    weekOffSearchText: string;

    constructor(private translateService: TranslateService, private leaveManagementService: LeavesManagementService,
        private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef) { super(); }

    ngOnInit() {
        this.clearForm();
        this.clearWeekOffForm();
        super.ngOnInit();
        this.getAllBranches();
        this.getAllHolidays();
        this.getAllCountries();
     //  this.getAllWeekOffHolidays();
        this.weekModel = [
            { weekName: 'Sunday', weekId: 1 },
            { weekName: 'Monday', weekId: 2 },
            { weekName: 'Tuesday', weekId: 3 },
            { weekName: 'Wednesday', weekId: 4 },
            { weekName: 'Thursday', weekId: 5 },
            { weekName: 'Friday', weekId: 6 },
            { weekName: 'Saturday', weekId: 7 },
        ]
        this.isweekOffUpsertInProgress = true;
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.holidayPage.size = 100;
        this.page.pageNumber = 0;
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    getAllHolidays() {
        this.isAnyOperationIsInprogress = true;

        var holidaysModel = new HolidayModel();
        holidaysModel.isArchived = this.isArchived;
        holidaysModel.pageNumber = this.holidayPage.pageNumber + 1;
        holidaysModel.pageSize = this.holidayPage.size;

        this.leaveManagementService.getAllHolidays(holidaysModel).subscribe((response: any) => {
            if (response.success == true) {
                this.holidayModel = response.data;
                this.temp = this.holidayModel;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            this.clearForm();
        });
    }


    getAllWeekOffHolidays() {
        this.upsertInProgress = false;
        this.isweekOffUpsertInProgress = true;
        var holidaysModel = new HolidayModel();
        holidaysModel.isWeekOff = true;
        holidaysModel.isArchived = this.weekOffArchived;
        holidaysModel.pageNumber = this.page.pageNumber + 1;
        holidaysModel.pageSize = this.page.size;
        holidaysModel.sortDirectionAsc = this.sortDirectionAsc;
        holidaysModel.sortBy = this.sortBy;

        this.leaveManagementService.getAllHolidays(holidaysModel).subscribe((response: any) => {
            if (response.success == true) {
                this.weekOffHolidays = response.data;
                this.tempOff = this.weekOffHolidays;
                this.page.totalElements = response.length > 0 ? response[0].totalCount : 0;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.clearForm();
                this.isweekOffUpsertInProgress = false;
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isweekOffUpsertInProgress = false;
            }
        });
    }


    getAllCountries() {
        this.isAnyOperationIsInprogress = true;

        var countrySearchModel = new CountryModel();

        this.hrManagementService.getCountries(countrySearchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
                this.isAnyOperationIsInprogress = false;
               this.clearForm() ;
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getAllBranches() {
        this.isweekOffUpsertInProgress = true;

        var branchSearchModel = new HrBranchModel();

        this.hrManagementService.getBranches(branchSearchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branchList = response.data;
                this.isweekOffUpsertInProgress = false;
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isweekOffUpsertInProgress = false;
            }
        });
    }

    createHoliday(upsertHolidayPopUp) {
        upsertHolidayPopUp.openPopover();
        this.holidayEdit = this.translateService.instant('HOLIDAY.ADDHOLIDAY');
    }

    createWeekOffHoliday(upsertWeekOffHolidayPopUp) {
        upsertWeekOffHolidayPopUp.openPopover();
        this.holidayEdit = this.translateService.instant('HOLIDAY.ADDHOLIDAY');
    }

    upsertHoliday(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.holidayInputModel = this.holidayForm.value;
        this.holidayInputModel.reason = this.holidayInputModel.reason.toString().trim();
        this.holidayInputModel.holidayId = this.holidayId;
        this.holidayInputModel.timeStamp = this.timeStamp;

        this.leaveManagementService.upsertHoliday(this.holidayInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertHolidayPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.clearWeekOffForm();
                formDirective.resetForm();
                this.getAllHolidays();
                setTimeout(() => this.formDirective.resetForm())
                this.holidayForm.clearValidators();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    upsertWeekOffHoliday(formDirective: FormGroupDirective) {
        this.upsertInProgress = true;
        this.weekOffHolidayInputModel = this.weekOffHolidayForm.value;
        let weekFF = this.weekOffHolidayForm.value.weekOffDays;
        this.weekOffHolidayInputModel.holidayId = this.holidayId;
        this.weekOffHolidayInputModel.isWeekOff = true;
        this.weekOffHolidayInputModel.weekOffDays = weekFF.toString();
        this.weekOffHolidayInputModel.timeStamp = this.timeStamp;

        this.leaveManagementService.upsertHoliday(this.weekOffHolidayInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertWeekOffHolidayPopUp.forEach((p) => p.closePopover());
                this.clearWeekOffForm();
                formDirective.resetForm();
                this.upsertInProgress = false;
                this.getAllWeekOffHolidays();
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.upsertInProgress = false;
            }
        });
    }

    closeUpsertHolidayPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearWeekOffForm();
        this.upsertHolidayPopover.forEach((p) => p.closePopover());
    }

    closeUpsertWeekOffHolidayPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertWeekOffHolidayPopUp.forEach((p) => p.closePopover());
    }

    editHolidayPopupOpen(row, upsertHolidayPopUp) {
        this.holidayForm.patchValue(row);
        this.holidayId = row.holidayId;
        this.timeStamp = row.timeStamp;
        this.holidayEdit = this.translateService.instant('HOLIDAY.EDITHOLIDAY');
        upsertHolidayPopUp.openPopover();
    }

    editweekOffHolidayPopupOpen(row, upsertWeekOffHolidayPopUp) {
        this.weekOffHolidayForm.patchValue(row);
        this.holidayId = row.holidayId;
        this.timeStamp = row.timeStamp;
        this.holidayEdit = this.translateService.instant('HOLIDAY.EDITHOLIDAY');
        upsertWeekOffHolidayPopUp.openPopover();
    }

    deleteHolidayPopUpOpen(row, deleteHolidayPopUp) {
        this.holidayId = row.holidayId;
        this.holidayReason = row.reason;
        this.countryId = row.countryId;
        this.holidayDate = row.date;
        this.timeStamp = row.timeStamp;
        deleteHolidayPopUp.openPopover();
    }

    deleteweekOffHolidayPopUpOpen(row, deleteWeekOffHolidayPopUp) {
        this.holidayId = row.holidayId;
        this.dateFrom = row.dateFrom;
        this.dateTo = row.dateTo;
        this.branchId = row.branchId;
        this.weekOffDays = row.weekOffDays;
        this.timeStamp = row.timeStamp;
        deleteWeekOffHolidayPopUp.openPopover();
    }

    closeDeleteHolidayDialog() {
        this.clearForm();
        this.deleteHolidayPopover.forEach((p) => p.closePopover());
    }

    closeDeleteWeekOffHolidayDialog() {
        this.clearForm();
        this.deleteWeekOffHolidayPopover.forEach((p) => p.closePopover());
    }

    deleteHoliday() {
        this.isAnyOperationIsInprogress = true;
        this.holidayInputModel = new HolidayModel();
        this.holidayInputModel.holidayId = this.holidayId;
        this.holidayInputModel.reason = this.holidayReason;
        this.holidayInputModel.countryId = this.countryId;
        this.holidayInputModel.date = this.holidayDate;
        this.holidayInputModel.timeStamp = this.timeStamp;
        this.holidayInputModel.isArchived = !this.isArchived;

        this.leaveManagementService.upsertHoliday(this.holidayInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteHolidayPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllHolidays();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.clearForm();
            this.clearWeekOffForm();
        });
    }

    deleteweekOffHoliday() {
        this.isweekOffUpsertInProgress = true;
        var holidayWeekOffArchiveModel = new HolidayModel();
        holidayWeekOffArchiveModel.holidayId = this.holidayId;
        holidayWeekOffArchiveModel.dateFrom = this.dateFrom;
        holidayWeekOffArchiveModel.dateTo = this.dateTo;
        holidayWeekOffArchiveModel.weekOffDays = this.weekOffDays.toString();
        holidayWeekOffArchiveModel.branchId = this.branchId;
        holidayWeekOffArchiveModel.isWeekOff = true;
        holidayWeekOffArchiveModel.timeStamp = this.timeStamp;
        holidayWeekOffArchiveModel.isArchived = !this.isArchived;

        this.leaveManagementService.upsertHoliday(holidayWeekOffArchiveModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteWeekOffHolidayPopover.forEach((p) => p.closePopover());
                this.clearWeekOffForm();
                this.getAllWeekOffHolidays();

            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isweekOffUpsertInProgress = false;
            }
        });
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.countryId = null;
        this.validationMessage = null;
        this.holidayId = null;
        this.isThereAnError = false;
        this.holidayReason = null;
        this.holidayDate = null;
        this.searchText = null;
        this.timeStamp = null;
        this.holidayForm = new FormGroup({
            reason: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            date: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    clearWeekOffForm() {
        this.isweekOffUpsertInProgress = false;
        this.countryId = null;
        this.validationMessage = null;
        this.holidayId = null;
        this.isThereAnError = false;
        this.holidayReason = null;
        this.holidayDate = null;
        this.searchText = null;
        this.timeStamp = null;
        this.weekOffHolidayForm = new FormGroup({
            dateFrom: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            dateTo: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            weekOffDays: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),
        })

    }

    startDate() {
        if (this.weekOffHolidayForm.value.dateFrom) {
            this.minDateForEndDate = new Date();
            this.minDateForEndDate.setDate(this.weekOffHolidayForm.value.dateFrom + 7)
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.weekOffHolidayForm.controls["dateTo"].setValue("");
        }
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(holiday => holiday.reason.toLowerCase().indexOf(this.searchText) > -1 || (holiday.countryName.toLowerCase().indexOf(this.searchText) > -1));
        this.holidayModel = temp;
    }

    filterForWeekOff(event) {
        if (event != null) {
            this.weekOffSearchText = event.target.value.toLowerCase();
            this.weekOffSearchText = this.weekOffSearchText.trim();
        }
        else {
            this.weekOffSearchText = "";
        }

        const tempOff = this.tempOff.filter(weekOffHoliday => weekOffHoliday.weekOff.toLowerCase().indexOf(this.weekOffSearchText) > -1 || (weekOffHoliday.branchName.toLowerCase().indexOf(this.weekOffSearchText) > -1));
        this.weekOffHolidays = tempOff;
    }

    closeSearch() {
        this.filterByName(null);
    }

    closeWeekOffSearch() {
        this.filterForWeekOff(null)
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getAllWeekOffHolidays();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir == 'asc')
            this.sortDirectionAsc = true;
        else
            this.sortDirectionAsc = false;
        this.getAllWeekOffHolidays();
    }
}
