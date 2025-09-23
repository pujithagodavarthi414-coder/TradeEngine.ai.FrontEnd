import { OnInit, ViewChildren, ChangeDetectorRef, Component } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import * as _moment from 'moment';
import { Observable } from "rxjs";
import { PeakHourModel, WeekorDay } from "../../models/hr-models/peakhour-model";
import { HRManagementService } from "../../services/hr-management.service";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../../models/Page';

@Component({
    selector: "app-fm-component-peakhour",
    templateUrl: `peakhours.component.html`
})

export class PeakHourComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deletePeakHourPopUp") deletePeakHourPopUp;
    @ViewChildren("upsertPeakHourPopUp") upsertPeakHourPopUp;

    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    peakHours: any;
    validationMessage: string;
    searchText: string;
    peakHourModel: PeakHourModel;
    roleFeaturesIsInProgress$: Observable<boolean>;
    peakHourForm: FormGroup;
    peakHourHeaderName: any;
    timeStamp: any;
    peakHourId: any;
    weekDays = [];
    weekDayType = WeekorDay;
    isWeekRequired = true;
    page = new Page();
    sortDirectionAsc: boolean;
    sortBy: string;
    totalCount: number;
    moment: any;
    weekDaysValidationMessage: string;
    weekDaysValidation: boolean = false;

    constructor(public hrManagementService: HRManagementService, private translateService: TranslateService,
        private toaster: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
        this.moment = _moment;
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.page.pageNumber = 0;
        this.page.size = 5;
        this.getAllPeakHours();
        this.loadWeekDays();
    }

    loadWeekDays() {
        this.weekDays = this.moment.weekdays().map((weekDay) => {
            return {
                weekDayId: weekDay,
                weekDayName: weekDay,
                isChecked: false
            }
        });
    }

    getAllPeakHours() {
        this.isAnyOperationIsInprogress = true;
        const peakHourModel = new PeakHourModel();
        peakHourModel.isArchived = this.isArchived;
        peakHourModel.searchText = this.searchText;
        peakHourModel.pageNumber = this.page.pageNumber + 1;
        peakHourModel.pageSize = this.page.size;
        peakHourModel.sortBy = this.sortBy;
        peakHourModel.sortDirectionAsc = this.sortDirectionAsc;
        this.hrManagementService.getAllPeakHours(peakHourModel).subscribe((response: any) => {
            if (response.success == true) {
                this.peakHours = response.data;
                this.isAnyOperationIsInprogress = false;
                this.totalCount = response.data && response.data.length > 0 ? response.data[0].totalCount : 0
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        this.page.pageNumber = 0;
        if (sort.dir === 'asc') {
            this.sortDirectionAsc = true;
        } else {
            this.sortDirectionAsc = false;
        }
        this.getAllPeakHours();
    }

    getArchiveAndUnarchived() {
        this.searchText = "";
        this.page.pageNumber = 0;
        this.getAllPeakHours();
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.peakHourId = null;
        this.isWeekRequired = true;
        this.weekDays.forEach((value, index) => {
            value.isChecked = false;
        });
        this.peakHourForm = new FormGroup({
            peakHourOn: new FormControl(null),
            peakHourFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            peakHourTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isPeakHour: new FormControl(null)
        });
    }

    createPeakHourPopupOpen(upsertPeakHourPopUp) {
        upsertPeakHourPopUp.openPopover();
        this.peakHourHeaderName = this.translateService.instant("PEAKHOUR.ADDPEAKHOURTITLE");
    }

    editPeakHourPopupOpen(row, upsertPeakHourPopUp) {
        this.peakHourForm.patchValue(row);
        this.weekDays.forEach((value, index) => {
            value.isChecked = false;
        });
        if (row.filterType == this.weekDayType.Week) {
            this.peakHourForm.controls["peakHourOn"].setValue(undefined);
            this.weekDays.find(x => x.weekDayId == row.peakHourOn).isChecked = true;
            this.isWeekRequired = false;
        }
        this.peakHourHeaderName = this.translateService.instant("PEAKHOUR.EDITPEAKHOURTITLE");
        this.peakHourId = row.peakHourId;
        this.timeStamp = row.timeStamp;
        upsertPeakHourPopUp.openPopover();
    }

    deletePeakHourPopUpOpen(row, deletePeakHourPopUp) {
        this.peakHourModel = new PeakHourModel();
        this.peakHourModel = this.mapProperties(this.peakHourModel, row);
        deletePeakHourPopUp.openPopover();
    }

    closeUpsertPeakHourPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPeakHourPopUp.forEach((p) => p.closePopover());
    }

    closeDeletePeakHourDialog() {
        this.clearForm();
        this.deletePeakHourPopUp.forEach((p) => p.closePopover());
    }

    upsertPeakHour(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.peakHourModel = new PeakHourModel();
        this.peakHourModel = this.mapProperties(this.peakHourModel, this.peakHourForm.value);
        this.peakHourModel.peakHourId = this.peakHourId;
        this.peakHourModel.timeStamp = this.timeStamp;
        if (this.weekDays.filter(x => x.isChecked).length > 0) {
            this.peakHourModel.peakHourOn = this.weekDays.filter(x => x.isChecked).map(x => x.weekDayId).join(",");
            this.peakHourModel.filterType = this.weekDayType.Week;
        } else {
            this.peakHourModel.filterType = this.weekDayType.Day;
        }
        if (this.moment.duration(this.moment(this.peakHourModel.peakHourTo).diff(this.moment(this.peakHourModel.peakHourFrom))).asMinutes() < 0) {
            this.validationMessage = this.translateService.instant("PEAKHOUR.PEAKHOURTOLESSTHANFROM");
            this.isAnyOperationIsInprogress = false;
            this.toaster.error(this.validationMessage);
        } else {
            this.hrManagementService.upsertPeakHour(this.peakHourModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertPeakHourPopUp.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getAllPeakHours();
                    this.cdRef.detectChanges();
                } else {
                    this.isThereAnError = true;
                    this.isAnyOperationIsInprogress = false;
                    this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                    this.toaster.error(this.validationMessage);
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    deletePeakHour() {
        this.isAnyOperationIsInprogress = true;
        this.peakHourModel.isArchived = !this.isArchived;

        this.hrManagementService.upsertPeakHour(this.peakHourModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePeakHourPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                this.page.pageNumber = 0;
                this.getAllPeakHours();
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    setValidator(weekday) {
        weekday.isChecked = !weekday.isChecked;
        if (!weekday.isChecked && this.weekDays.filter(x => x.isChecked).length == 0) {
            this.isWeekRequired = true;
        } else {
            this.isWeekRequired = false;
        }
    }

    mapProperties(targetObject, sourceObject) {
        return Object.assign(targetObject, sourceObject)
    }

    setPage(data) {
        this.page.pageNumber = data.offset;
        this.getAllPeakHours();
    }

    filterByName(event) {
        this.getAllPeakHours();
    }

    closeSearch() {
        this.searchText = "";
        this.getAllPeakHours();
    }
}
