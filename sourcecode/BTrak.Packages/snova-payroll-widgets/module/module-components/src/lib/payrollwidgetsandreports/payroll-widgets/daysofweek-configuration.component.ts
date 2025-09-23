import { ChangeDetectorRef, Component, OnInit, ViewChildren, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SearchHourlyTds } from "../models/search-hourly-tdsmodel";
import { PayRollService } from "../services/PayRollService";
import { DaysOfWeekConfiguration } from "../models/daysofweek-configurationmodel";
import { DatePipe } from "@angular/common";
import { PayRollTemplateModel } from "../models/PayRollTemplateModel";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';
import { WeekdayModel } from '../models/weekday-model';
import * as moment_ from 'moment';
import { PartsOfDayModel } from '../models/partsofdaymodel';
const moment = moment_;

@Component({
    selector: 'app-daysofweek-configuration',
    templateUrl: `daysofweek-configuration.component.html`
})

export class DaysOfWeekConfigurationComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertDaysOfWeekConfigurationPopUp") upsertDaysOfWeekConfigurationPopover;
    @ViewChildren("deleteDaysOfWeekPopUp") deleteDaysOfWeekPopover;
    @ViewChild("upsertPartsOfDayPopUp") upsertPartsOfDayPopover;

    branchList$: Observable<Branch[]>;
    searchText: string;
    isArchivedTypes: boolean;
    daysOfWeekData: any;
    deleteDays: any;
    rateSheet: any;
    weekDays: any;
    daysOfweekForm: FormGroup;
    partsOfDayForm: FormGroup;
    validationMessage: string;
    intimepicker: any;
    fromTimePicker: any;
    isAnyOperationIsInprogress: boolean;
    timeStamp: any;
    popOverHeading: string;
    minDate: Date;
    temp: any;
    partsOfDays: any;
    isPartsOfDayIsInprogress: boolean;
    partsOfDayHeading: string = "PARTSOFDAY.ADDPARTSOFDAY";

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.clearPartsOfDayForm();
        this.daysOfWeekData = [];
        this.getAllBranches();
        this.getAllWeekDays();
        this.getAllPartsOfDays();
        this.getDaysOfWeekConfiguration();
    }
    constructor(private store: Store<PayRollManagementState>, private cdRef: ChangeDetectorRef,
        private payRollService: PayRollService, private toastr: ToastrService, private datePipe: DatePipe) { super()
        
    }

    clearPartsOfDayForm(){
        this.isPartsOfDayIsInprogress = false;
        this.partsOfDayForm = new FormGroup({
            partsOfDayName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.daysOfweekForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            daysOfWeekId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            partsOfDayId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            fromTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            toTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null
            ),
            id: new FormControl(null
            )
        })
    }

    intimeshow() {
        if (!this.intimepicker) {
            this.intimepicker = ConstantVariables.DefaultTime;
        }
    }
    closeintime() {
        this.intimepicker = "";
    }

    fromTimeShow() {
        if (!this.fromTimePicker) {
            this.fromTimePicker = ConstantVariables.DefaultTime;;
        }
    }
    closefromTime() {
        this.fromTimePicker = "";
    }

    search(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(data =>
            (data.branchName == null ? null : data.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.partsOfDayName  == null ? null : data.partsOfDayName .toString().toLowerCase().indexOf(this.searchText) > -1)
            || (data.weekDayName == null ? null : data.weekDayName.toString().toLowerCase().indexOf(this.searchText) > -1))
        this.daysOfWeekData = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.search(null);
    }

    createPartsOfDay(upsertPartsOfDayPopUp){
        this.partsOfDayHeading = 'PARTSOFDAY.ADDPARTSOFDAY';
        upsertPartsOfDayPopUp.openPopover();
    }

    createDaysOfWeekPopupOpen(upsertDaysOfWeekConfigurationPopUp) {
        this.popOverHeading = 'PAYROLLBRANCHCONFIGURATION.CREATEDAYOFWEEKCONFIGURATION';
        upsertDaysOfWeekConfigurationPopUp.openPopover();
    }

    editupsertDaysOfWeekPopupOpen(row, upsertDaysOfWeekConfigurationPopUp) {
        this.popOverHeading = 'PAYROLLBRANCHCONFIGURATION.EDITDAYOFWEEKCONFIGURATION';
        let data = {...row};
        data.fromTime = this.datePipe.transform(this.utcToLocal(row.fromTime), 'HH:mm');
        data.toTime = this.datePipe.transform(this.utcToLocal(row.toTime), 'HH:mm');
        this.daysOfweekForm.patchValue(data);
        // this.daysOfweekForm.controls['fromTime'].setValue(this.datePipe.transform(this.utcToLocal(row.fromTime), 'HH:mm'));
        // this.daysOfweekForm.controls['toTime'].setValue(this.datePipe.transform(this.utcToLocal(row.toTime), 'HH:mm'));
        this.timeStamp = row.timeStamp;
        upsertDaysOfWeekConfigurationPopUp.openPopover();
    }

    utcToLocal(utcTime) {
        if (utcTime != null) {
            var temp = '2019-10-11T';
            var date = temp.toString().concat(utcTime);
            const localDate = moment.utc(date).local().format();
            return localDate;
        }
        return null;
    }

    deleteDaysOfWeekPopUpOpen(row, deleteDaysOfWeekPopUp) {
        this.deleteDays = [];
        this.deleteDays = row;
        this.timeStamp = this.deleteDays.timeStamp;
        deleteDaysOfWeekPopUp.openPopover();
    }

    deleteDaysOfWeek() {
        this.isAnyOperationIsInprogress = true;
        var dayOfWeek = new DaysOfWeekConfiguration();
        dayOfWeek.id = this.deleteDays.id;
        dayOfWeek.branchId = this.deleteDays.branchId;
        dayOfWeek.dayOfWeekId = this.deleteDays.daysOfWeekId;
        dayOfWeek.partsOfDayId = this.deleteDays.partsOfDayId;
        dayOfWeek.fromTime = this.covertTimeIntoUtcTime(this.deleteDays.fromTime);
        dayOfWeek.toTime = this.covertTimeIntoUtcTime(this.deleteDays.toTime);
        dayOfWeek.activeFrom = this.deleteDays.activeFrom;
        dayOfWeek.activeTo = this.deleteDays.activeTo;
        dayOfWeek.timeStamp = this.timeStamp;
        if (this.isArchivedTypes) {
            dayOfWeek.isArchived = false;
        } else {
            dayOfWeek.isArchived = true;
        }

        this.payRollService.upsertDayOfWeekConfiguration(dayOfWeek).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                this.getDaysOfWeekConfiguration();
                this.isAnyOperationIsInprogress = false;
                this.closeDeleteDaysOfWeekDialog();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        })
    }

    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
            return null;
        var dateNow = new Date();
        var timeSplit = inputTime.toString().split(":");
        dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
        return moment.utc(dateNow).format("HH:mm");
    }

    closeDeleteDaysOfWeekDialog() {
        this.deleteDays = [];
        this.deleteDaysOfWeekPopover.forEach((p) => p.closePopover());
    }

    closeUpsertDayOfWeekPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDaysOfWeekConfigurationPopover.forEach((p) => p.closePopover());
    }

    closeUpsertPartsOfDayPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearPartsOfDayForm();
        this.upsertPartsOfDayPopover.closePopover();
    }

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
        this.cdRef.detectChanges();
    }

    getAllPartsOfDays() {
        this.isPartsOfDayIsInprogress = true;
        var PartsOfDayModel = new PayRollTemplateModel();
        PartsOfDayModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPartsOfDays(PartsOfDayModel).subscribe((response: any) => {
            if (response.success == true) {
                this.partsOfDays = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isPartsOfDayIsInprogress = false;
        });
    }

    getAllWeekDays() {
        this.weekDays = [];
        var weekdayModel = new WeekdayModel();
        this.payRollService.getAllWeekDays(weekdayModel).subscribe((response: any) => {
            if (response.success == true) {
                this.weekDays = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    getDaysOfWeekConfiguration() {
        this.isAnyOperationIsInprogress = true;
        var searchHourlyTds = new SearchHourlyTds();
        if (this.isArchivedTypes) {
            searchHourlyTds.isArchived = true;
        } else {
            searchHourlyTds.isArchived = false;
        }
        searchHourlyTds.searchText = this.searchText;
        this.payRollService.getDaysOfWeekConfiguration(searchHourlyTds).subscribe((response: any) => {
            if (response.success == true) {
                this.daysOfWeekData = [];
                this.daysOfWeekData = response.data;
                this.temp = this.daysOfWeekData;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    upsertDayOfWeek(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var dayOfWeek = new DaysOfWeekConfiguration();
        dayOfWeek.id = this.daysOfweekForm.value.id;
        dayOfWeek.branchId = this.daysOfweekForm.value.branchId;
        dayOfWeek.dayOfWeekId = this.daysOfweekForm.value.daysOfWeekId;
        dayOfWeek.partsOfDayId = this.daysOfweekForm.value.partsOfDayId;
        dayOfWeek.fromTime = this.covertTimeIntoUtcTime(this.daysOfweekForm.value.fromTime);
        dayOfWeek.toTime = this.covertTimeIntoUtcTime(this.daysOfweekForm.value.toTime);
        dayOfWeek.activeFrom = this.daysOfweekForm.value.activeFrom;
        dayOfWeek.activeTo = this.daysOfweekForm.value.activeTo;
        dayOfWeek.timeStamp = this.timeStamp;

        this.payRollService.upsertDayOfWeekConfiguration(dayOfWeek).subscribe((response: any) => {
            if (response.success == true) {
                formDirective.resetForm();
                this.clearForm();
                this.getDaysOfWeekConfiguration();
                this.isAnyOperationIsInprogress = false;
                this.upsertDaysOfWeekConfigurationPopover.forEach((p) => p.closePopover());
            } else {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        })
    }

    upsertPartsOfDay(formDirective: FormGroupDirective) {
        this.isPartsOfDayIsInprogress = true;
        var partsOfDay = new PartsOfDayModel();
        partsOfDay.partsOfDayName = this.partsOfDayForm.value.partsOfDayName;

        this.payRollService.upsertPartsOfDay(partsOfDay).subscribe((response: any) => {
            if (response.success == true) {
                formDirective.resetForm();
                this.clearPartsOfDayForm();
                this.getAllPartsOfDays();
                this.upsertPartsOfDayPopover.closePopover();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isPartsOfDayIsInprogress = false;
        })
    }
}