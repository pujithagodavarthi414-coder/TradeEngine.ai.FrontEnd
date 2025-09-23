import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ShiftTimingModel } from '../../models/hr-models/shift-timing-model';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { ShiftExceptionModel } from '../../models/hr-models/shift-exception-model';
import { ShiftWeekModel } from '../../models/hr-models/shift-week-model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment_ from "moment";
const moment = moment_;
import { ConstantVariables } from '../../helpers/constant-variables';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import * as $_ from 'jquery';
import { UtcToLocalTimeWithDatePipe } from '../../../globaldependencies/pipes/utctolocaltimewithdate.pipe';
const $ = $_;

@Component({
    selector: 'app-fm-component-shift-timing',
    templateUrl: `shift-timing.component.html`
})

export class ShiftTimingComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertShiftTimingPopup") upsertShiftTimingPopover;
    @ViewChildren("upsertShiftExceptionPopup") upsertShiftExceptionPopover;
    @ViewChildren("upsertShiftWeekPopup1") upsertShiftWeekPopover1;
    // @ViewChild("upsertShiftWeekPopup") upsertShiftWeekPopover;
    @ViewChildren("deleteShiftTimingPop") deleteShiftTiming;

    @ViewChildren("shiftWeekPopup") shiftWeekPopup;

    @ViewChildren("deleteShiftExceptionPopUp") deleteShiftExceptionPopover;
    @ViewChild('formDirective') formDirective: FormGroupDirective;
    @ViewChild('formDirective2') formDirective2: FormGroupDirective;
    @ViewChild('formDirective3') formDirective3: FormGroupDirective;
    @ViewChild("allDaysSelected") private allDaysSelected: MatOption;
    shiftCloneHighLightId: any;
    cancelBtn: any;
    confirmBtn: any;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels$: SoftLabelConfigurationModel[];
    softLabels: SoftLabelConfigurationModel[];
    branchList: HrBranchModel[];
    shiftTimingsModel: ShiftTimingModel;
    previousState: any;
    shiftTitleName: string;
    branchTitleName: string;
    shiftTimings: ShiftTimingModel[];
    selectedShifttiming: ShiftTimingModel;
    shifttimingModelId: string;
    shiftId: string;
    shifttiming: ShiftTimingModel;
    shift: ShiftTimingModel;
    selectedShiftExceptiontiming: ShiftExceptionModel;
    selectedWeektiming: ShiftWeekModel;
    selectedExceptiontiming: ShiftExceptionModel;
    shiftExceptions: ShiftExceptionModel[];
    shiftWeeks: ShiftWeekModel[];
    isAnyOperationIsInprogress: boolean = false;
    isAnyOperationIsInprogressException: boolean = false;
    isThereAnError: boolean;
    validationMessage: string;
    isArchived: boolean = false;
    shiftTimingForm: FormGroup;
    shiftExceptionForm: FormGroup;
    shiftWeekForm: FormGroup;
    shiftTimingId: string;
    shiftExceptionId: string;
    shiftWeekId: string;
    selectedTimeZone: string;
    timeStamp: any;
    shiftTimingName: string;
    branchI: string;
    shiftTimingFrom: Date;
    shiftTimingTo: Date;
    searchText: string;
    isFiltersVisible: boolean;
    temp: ShiftTimingModel[];
    temp2: ShiftTimingModel[];
    shiftTiming: string;
    isEditShiftTiming: boolean = false;
    shiftOptionsList: any[];
    selectDayId: FormGroup;
    selectedDay: string;
    shiftTimingsId: string;
    shiftWeekTitle: string;
    maxDate = new Date();
    isInitialLoading: boolean = false;
    //exceptionDate = new Date();
    isHide: boolean;
    isAdd: boolean;
    isShow: boolean;
    scrollbarH: boolean = false;
    loadingIndicator: boolean = false;
    scrollbarH2: boolean = false;
    loadingIndicator2: boolean = false;
    shiftHighLightId: string;
    canAccess_feature_ManageShifttiming: Boolean;
    isClone: boolean = false;
    shiftTitleForm = new FormControl("", {
        validators: [Validators.maxLength(50)]
    });
    branchForm = new FormControl("", {
        validators: [Validators.required]
    });
    isDefault: boolean = false;
    branchTitle: string;

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.clearForm();
        if (this.canAccess_feature_ManageShifttiming) {
            this.getAllShiftTiming();
            this.getShiftTimingOptions();
            this.getAllBranches();
        }

        this.isInitialLoading = true;
    }

    constructor(private datePipe: DatePipe, private fb: FormBuilder,
        private translateService: TranslateService, private hrManagementService: HRManagementService,
        private toaster: ToastrService, private cdRef: ChangeDetectorRef,
        private utcTimeZone: UtcToLocalTimeWithDatePipe) {
        super();

    }

    getAllShiftTiming() {
        this.selectedShifttiming = new ShiftTimingModel();
        this.selectedShifttiming.isArchived = this.isArchived;
        this.shifttimingModelId;
        if (this.isArchived != true) {
            this.isHide = true;
        }
        else
            this.isHide = false;

        this.hrManagementService.getShiftTiming(this.selectedShifttiming).subscribe((response: any) => {
            if (response.success == true) {
                this.shiftTimings = response.data;
                this.temp2 = this.shiftTimings;
                console.log(response.data);
                console.log(this.shiftId);

                if (this.isClone == true) {
                    this.shiftHighLightId = this.shiftCloneHighLightId;
                    this.temp = this.shiftTimings.filter(timings => timings.shiftTimingId == this.shiftCloneHighLightId);
                }
                else {
                    this.shiftHighLightId = this.shiftId;
                    this.temp = this.shiftTimings.filter(timings => timings.shiftTimingId == this.shiftId);
                }

                console.log(this.temp);
                this.shifttiming = this.temp[0];

                if (this.shiftTimings.length > 0) {
                    this.isShow = true;
                    if ((this.shiftTimingsModel == null || this.isAdd == true)) {
                        this.selectedShifttiming = this.shiftTimings[0];
                        this.shiftTimingsModel = this.shiftTimings[0];
                        this.shiftId = this.selectedShifttiming.shiftTimingId;
                        this.isAdd = false;
                    }
                    else if (this.isClone == true) {
                        this.selectedShifttiming = this.temp[0];
                    }
                    else {
                        this.selectedShifttiming = this.shiftTimingsModel;
                    }
                    if (this.isInitialLoading == true) {
                        this.getAllShiftWeek(this.selectedShifttiming);
                        this.getAllShiftException(this.selectedShifttiming);
                        this.isInitialLoading = false;
                    }
                    if (this.isClone == true) {
                        //this.selectedShifttiming.shiftTimingId = this.shiftCloneHighLightId;
                        this.getAllShiftWeek(this.selectedShifttiming);
                        this.getAllShiftException(this.selectedShifttiming);
                        console.log(this.shiftWeeks);
                        console.log(this.shiftExceptions);
                        this.isClone = false;
                    }
                    this.cdRef.detectChanges();
                    if (this.shiftTimings.length > 0) {
                        this.isHide = true;
                        this.selectedShiftTimingEdit(this.shiftTimings[0]);
                    }
                    else {
                        this.isHide = false;
                    }
                    if (this.isArchived) {
                        this.shiftTitleForm.disable();
                    }
                    else {
                        this.shiftTitleForm.enable();
                    }
                }
                else {
                    this.isShow = false;
                    this.isHide = false;
                }
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getAllShiftWeek(shiftWeekModel) {
        this.isAnyOperationIsInprogress = true;
        this.cdRef.detectChanges();
        this.selectedWeektiming = new ShiftWeekModel();
        this.selectedWeektiming.shiftTimingId = shiftWeekModel.shiftTimingId;
        this.shiftId = shiftWeekModel.shiftTimingId;
        this.shiftTimingsId = shiftWeekModel.shiftTimingId;
        this.shiftHighLightId = this.shiftTimingsId;
        if (!(shiftWeekModel && shiftWeekModel.startTime)) {
            this.shifttiming = shiftWeekModel;
        }
        this.shiftWeekTitle = this.shifttiming.shift;
        // this.branchTitle = this.shifttiming.branchId;
        // this.branchForm.setValue(shiftWeekModel.branchId);
        this.branchForm.setValue(this.shifttiming.branchId);
        this.isDefault = this.shifttiming.isDefault;

        if (shiftWeekModel && (shiftWeekModel.timeStamp)) {
            this.shiftTimingsModel = shiftWeekModel;
        }

        console.log(this.selectedWeektiming.shiftTimingId);
        this.hrManagementService.getShiftWeek(this.selectedWeektiming).subscribe((response: any) => {
            if (response.success == true) {
                this.shiftWeeks = response.data;
                this.scrollbarH2 = true;
                this.loadingIndicator2 = false;
                this.clearForm();
                this.shiftWeeks = [...this.shiftWeeks];
                this.isAnyOperationIsInprogress = false;
                
                setTimeout(function(){ 
                    $('#table-1' + ' datatable-body').addClass('widget-scroll');                    
                  }, 1000);               
                
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getAllShiftException(shiftWeekModel) {
        this.isAnyOperationIsInprogressException = true;
        this.selectedShiftExceptiontiming = new ShiftExceptionModel();
        this.selectedShiftExceptiontiming.shiftTimingId = shiftWeekModel.shiftTimingId;
        if (shiftWeekModel && (shiftWeekModel.timeStamp)) {
            this.shiftTimingsModel = shiftWeekModel;
            this.previousState = shiftWeekModel;
        }
        if (!(shiftWeekModel && shiftWeekModel.startTime)) {
            this.shifttiming = shiftWeekModel;
        }

        this.hrManagementService.getShiftException(this.selectedShiftExceptiontiming).subscribe((response: any) => {
            if (response.success == true) {
                this.shiftExceptions = response.data;
                this.scrollbarH = true;
                this.loadingIndicator = false;
                this.clearForm();
                this.shiftExceptions = [...this.shiftExceptions];
                this.isAnyOperationIsInprogressException = false;
                 
                setTimeout(function(){                     
                    $('#table-2' + ' datatable-body').addClass('widget-scroll');
                  }, 1000);                 

                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.isAnyOperationIsInprogressException = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getShiftTimingOptions() {
        this.hrManagementService.GetShiftTimingOptions().subscribe((response: any) => {
            if (response.success == true) {
                this.shiftOptionsList = response.data;
                this.clearForm();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }

    deleteShiftTimingPopUpOpen(row, deleteShiftTiming) {
        this.isEditShiftTiming = false;
        this.shiftTimingId = row.shiftTimingId;
        this.timeStamp = row.timeStamp;
        this.shiftTimingName = row.shift;
        this.branchI = row.branchId;
        deleteShiftTiming.openPopover();
    }

    deleteShiftExceptionPopUpOpen(row, deleteShiftExceptionPopUp) {
        this.selectedShiftExceptiontiming = row;
        this.selectedShiftExceptiontiming.isArchived = true;
        deleteShiftExceptionPopUp.openPopover();
    }

    closeshiftTimingPopup() {
        this.clearForm();
        this.deleteShiftTiming.forEach((p) => p.closePopover());
    }

    closeUpsertShiftTimingPopup() {
        this.formDirective.resetForm();
        this.clearForm();
        this.upsertShiftTimingPopover.forEach((p) => p.closePopover());
    }

    closeUpsertShiftExceptionPopup() {
        this.formDirective.resetForm();
        this.clearForm();
        this.upsertShiftExceptionPopover.forEach((p) => p.closePopover());
        this.formDirective2.resetForm();
    }

    closeUpsertShiftWeekPopup() {
        this.formDirective3.resetForm();
        this.clearForm();
        this.shiftWeekPopup.forEach((p) => p.closePopover());
    }

    closeDeleteShiftExceptionDialog() {
        this.isThereAnError = false;
        this.deleteShiftExceptionPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.shiftTimingId = null;
        this.validationMessage = null;
        this.shiftTimingName = null;
        this.branchI = null;
        this.shiftTimingFrom = null;
        this.shiftExceptionId = null;
        this.shiftWeekId = null;
        this.shiftTimingTo = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.isAnyOperationIsInprogressException = false;
        this.selectedShifttiming = null;
        this.timeStamp = null;
        this.searchText = null;
        this.shiftTimingForm = new FormGroup({
            shift: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            shiftTimingOptions: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isDefault: new FormControl(null,
                Validators.compose([
                ])
            ),
        })
        //shift Exception Form group 
        this.shiftExceptionForm = new FormGroup({
            exceptionDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            startTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])

            ),
            deadLine: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            endTime: new FormControl(null,
                Validators.compose([

                ])
            ),
            allowedBreakTime: new FormControl(null,
                Validators.compose([
                    Validators.max(1440)
                ])
            ),
        })
        //shift week Form group 
        this.shiftWeekForm = new FormGroup({
            dayOfWeek: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            startTime: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            deadLine: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            endTime: new FormControl(null,
                Validators.compose([

                ])
            ),
            allowedBreakTime: new FormControl(null,
                Validators.compose([
                    Validators.max(1440)
                ])
            ),
            isPaidBreak: new FormControl(null,
            )
        })
    }

    createShiftTiming(upsertShiftTimingPopup) {
        this.clearForm();
        upsertShiftTimingPopup.openPopover();
        this.isEditShiftTiming == false;
        this.shiftTiming = this.translateService.instant('SHIFTTIMING.ADDSHIFTTIMINGTITLE');
    }

    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
            return null;

        // var temp = '2019-10-11T';
        // var date = temp.toString().concat(inputTime);
        var dateNow = new Date();
        var timeSplit = inputTime.toString().split(":");
        dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
        return moment.utc(dateNow).format("HH:mm");
    }

    upsertShiftTiming() {
        this.isClone = false;
        this.selectedShifttiming = this.shiftTimingForm.value;

        var customApplicationRoleIds = this.shiftTimingForm.value.shiftTimingOptions;
        if (customApplicationRoleIds != null) {
            this.isEditShiftTiming = false;
            let index = customApplicationRoleIds.indexOf(0);
            if (index > -1) {
                customApplicationRoleIds.splice(index, 1);
            }
        }
        this.selectedShifttiming.daysOfWeek = customApplicationRoleIds;
        this.selectedShifttiming.startTime = this.covertTimeIntoUtcTime(this.shiftTimingForm.value.startTime);
        this.selectedShifttiming.endTime = this.covertTimeIntoUtcTime(this.shiftTimingForm.value.endTime);
        this.selectedShifttiming.shiftTimingId = this.shiftTimingId;
        if (this.shiftTimingForm.value.branchId != null) {
            this.selectedShifttiming.branchId = this.shiftTimingForm.value.branchId;
        } else {
            this.selectedShifttiming.branchId = this.branchTitle;
        }

        this.selectedShifttiming.timeStamp = this.timeStamp;
        this.selectedShifttiming.isDefault = this.shiftTimingForm.value.isDefault;


        this.hrManagementService.upsertShiftTiming(this.selectedShifttiming).subscribe((response: any) => {

            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.closeUpsertShiftTimingPopup();
                this.closeshiftTimingPopup();
                this.closeUpsertShiftTimingPopup
                this.clearForm();
                this.formDirective.resetForm();
                this.shifttimingModelId = null;
                this.getAllShiftTiming();
                this.getAllShiftWeek(this.shiftTimingsModel);
                this.getAllShiftException(this.shiftTimingsModel);
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isEditShiftTiming == false;
            this.cdRef.detectChanges();
        });
    }

    createShiftException(upsertShiftExceptionPopup) {
        this.clearForm();
        upsertShiftExceptionPopup.openPopover();
    }

    upsertShiftException(formDirective2: FormGroupDirective) {
        this.isAnyOperationIsInprogressException = true;
        this.selectedExceptiontiming = this.shiftExceptionForm.value;

        this.selectedExceptiontiming.startTime = this.covertTimeIntoUtcTime(this.shiftExceptionForm.value.startTime);
        this.selectedExceptiontiming.endTime = this.covertTimeIntoUtcTime(this.shiftExceptionForm.value.endTime);
        this.selectedExceptiontiming.shiftTimingId = this.shiftTimingsId;
        this.selectedExceptiontiming.shiftExceptionId = this.shiftExceptionId;
        this.selectedExceptiontiming.timeStamp = this.timeStamp;
        this.shifttiming.shiftTimingId = this.shiftTimingsId;
        this.shifttiming.shift = this.shiftWeekTitle;
        this.selectedExceptiontiming.deadLine = this.covertTimeIntoUtcTime(this.shiftExceptionForm.value.deadLine);

        if (this.isClone == true) {
            Object.assign(
                this.shiftExceptions.find(({ shiftExceptionId }) => shiftExceptionId === this.selectedExceptiontiming.shiftExceptionId),
                this.selectedExceptiontiming
            );

            this.shiftExceptions = [...this.shiftExceptions];
            this.closeUpsertShiftExceptionPopup();
            this.clearForm();
            formDirective2.resetForm();

        }
        else {
            this.hrManagementService.upsertShiftException(this.selectedExceptiontiming).subscribe((response: any) => {

                if (response.success == true) {
                    this.closeUpsertShiftExceptionPopup();
                    this.clearForm();
                    formDirective2.resetForm();
                    this.getAllShiftException(this.selectedExceptiontiming);
                    this.isAnyOperationIsInprogressException = false;
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                    this.isAnyOperationIsInprogressException = false;
                }
                this.cdRef.detectChanges();
            });
        }
        this.isAnyOperationIsInprogressException = false;
    }

    createShiftWeek(upsertShiftExceptionPopup) {
        this.clearForm();
        upsertShiftExceptionPopup.openPopover();
        //this.shiftTiming = this.translateService.instant('SHIFTTIMING.ADDSHIFTTIMINGTITLE');
    }

    upsertShiftWeek(formDirective3: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.selectedWeektiming = this.shiftWeekForm.value;
        this.selectedWeektiming.startTime = this.covertTimeIntoUtcTime(this.shiftWeekForm.value.startTime);
        this.selectedWeektiming.endTime = this.covertTimeIntoUtcTime(this.shiftWeekForm.value.endTime);
        this.selectedWeektiming.shiftTimingId = this.shiftTimingsId;
        this.selectedWeektiming.shiftWeekId = this.shiftWeekId;
        this.selectedWeektiming.timeStamp = this.timeStamp;
        this.shifttiming.shiftTimingId = this.shiftTimingsId;
        if (this.isClone != true) {
            this.shifttiming.shift = this.shiftWeekTitle;
            this.shifttiming.branchId = this.branchTitle;
        }

        this.selectedWeektiming.deadLine = this.covertTimeIntoUtcTime(this.shiftWeekForm.value.deadLine);

        if (this.isClone == true) {
            Object.assign(
                this.shiftWeeks.find(({ shiftWeekId }) => shiftWeekId === this.selectedWeektiming.shiftWeekId),
                this.selectedWeektiming
            );

            this.shiftWeeks = [...this.shiftWeeks];

            this.closeUpsertShiftWeekPopup();
        }
        else {

            this.hrManagementService.upsertShiftWeek(this.selectedWeektiming).subscribe((response: any) => {

                if (response.success == true) {
                    this.closeUpsertShiftWeekPopup();
                    this.clearForm();
                    formDirective3.resetForm();
                    this.getAllShiftWeek(this.selectedWeektiming);
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
        }
        this.isAnyOperationIsInprogress = false;
    }

    archiveShiftTiming() {
        this.isAnyOperationIsInprogress = true;
        let selectedShiftTiming = new ShiftTimingModel();
        selectedShiftTiming.shiftTimingId = this.shiftTimingId;
        this.shifttimingModelId = this.shiftTimingId;
        selectedShiftTiming.shift = this.shiftTimingName;
        selectedShiftTiming.branchId = this.branchI;
        selectedShiftTiming.timeStamp = this.timeStamp;
        selectedShiftTiming.isArchived = !this.isArchived;
        this.isAdd = !this.isArchived;
        if (this.shiftId == selectedShiftTiming.shiftTimingId || ((this.shiftTimingsModel) && this.shiftId == this.shiftTimingsModel.shiftTimingId)) {
            this.shiftId = null;
            this.shiftTimingsModel = null;
        }

        this.hrManagementService.upsertShiftTiming(selectedShiftTiming).subscribe((response: any) => {

            if (response.success == true) {
                this.closeshiftTimingPopup();
                this.clearForm();
                this.getAllShiftTiming();
                this.isInitialLoading = true;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    archiveShiftException() {
        let selectedExceptiontiming = new ShiftExceptionModel();
        selectedExceptiontiming = this.selectedShiftExceptiontiming;

        if (this.isClone == true) {
            var indexvalue = this.shiftExceptions.findIndex(({ shiftExceptionId }) => shiftExceptionId === selectedExceptiontiming.shiftExceptionId);

            this.shiftExceptions.splice(indexvalue, 1);

            this.shiftExceptions = [...this.shiftExceptions];

            this.closeDeleteShiftExceptionDialog();
        }
        else {
            this.isAnyOperationIsInprogress = true;

            this.hrManagementService.upsertShiftException(selectedExceptiontiming).subscribe((response: any) => {
                if (response.success == true) {
                    this.closeDeleteShiftExceptionDialog();
                    this.clearForm();
                    this.selectedShiftExceptiontiming.shiftTimingId = this.shiftTimingsId;
                    this.getAllShiftException(this.selectedShiftExceptiontiming);
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);

                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
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

    selectedShiftTimingClone(shiftTiming) {
        this.isClone = true;
        this.getAllShiftWeek(shiftTiming);
        this.getAllShiftException(shiftTiming);
        this.shiftTitleForm.setValue("");
        this.branchForm.setValue("");
        this.isDefault = false;
        this.shiftHighLightId = null;
    }

    selectedShiftTimingEdit(shiftTiming) {
        this.isClone = false;
        this.selectedTimeZone = shiftTiming.timeZoneName,
        this.getAllShiftWeek(shiftTiming);
        this.getAllShiftException(shiftTiming);
        this.shiftTitleForm.setValue(shiftTiming.shift);
        this.branchForm.setValue(shiftTiming.branchId);
        this.isDefault = shiftTiming.isDefault;
    }

    editShiftTimingPopupOpen(shiftName, branch, isDefault) {
        if (shiftName == null || shiftName == '') {
            this.toaster.error("Shift is required");
        }
        else if (branch == null || branch == '') {
            this.toaster.error("Branch is required");
        }
        else {
            this.isEditShiftTiming = true;
            this.shiftTitleName = this.shifttiming.shift;
            this.branchTitleName = this.shifttiming.branchId;
            let shiftTimingModel = new ShiftTimingModel();
            this.shiftId = this.shifttiming.shiftTimingId;
            shiftTimingModel.timeStamp = this.shifttiming.timeStamp;
            shiftTimingModel.branchId = branch;
            shiftTimingModel.shift = shiftName;
            shiftTimingModel.shiftTimingId = this.shifttiming.shiftTimingId;
            shiftTimingModel.isClone = this.isClone;
            if (this.isClone == true) {
                shiftTimingModel.shiftWeekItems = this.shiftWeeks;
                shiftTimingModel.shiftExceptionItems = this.shiftExceptions;
                shiftTimingModel.shiftTimingId = null;
            }
            shiftTimingModel.isDefault = isDefault;

            this.hrManagementService.upsertShiftTiming(shiftTimingModel).subscribe((response: any) => {

                if (response.success == true) {
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                    this.shifttimingModelId = null;
                    this.shiftCloneHighLightId = response.data;
                    this.getAllShiftTiming();
                    this.getAllShiftWeek(this.shifttiming);
                    this.getAllShiftException(this.shifttiming);
                    this.shiftWeekTitle = shiftName;
                    this.branchForm.setValue(branch);

                    // this.branchTitle = branch;
                }
                else {
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                    if (this.isClone != true) {
                        this.shiftWeekTitle = this.shiftTitleName;
                        this.branchForm.setValue(this.branchTitleName);
                    }

                    // this.branchTitle = this.branchTitleName;
                }
                this.isEditShiftTiming == false;
                this.cdRef.detectChanges();
            });
        }
    }

    editShiftExceptionPopupOpen(row, upsertShiftExceptionPopup) {
        // this.isEditShiftTiming = true;
        this.shiftExceptionId = row.shiftExceptionId;
        this.shiftExceptionForm.patchValue(row);
        this.timeStamp = row.timeStamp;
        this.shiftExceptionForm.controls['exceptionDate'].setValue(row.exceptionDate);
        this.shiftExceptionForm.controls['startTime'].setValue(this.datePipe.transform(this.utcToLocal(row.startTime), 'HH:mm'));
        this.shiftExceptionForm.controls['endTime'].setValue(this.datePipe.transform(this.utcToLocal(row.endTime), 'HH:mm'));
        this.shiftExceptionForm.controls['deadLine'].setValue(this.datePipe.transform(this.utcToLocal(row.deadLine), 'HH:mm'));
        this.shiftExceptionForm.controls['allowedBreakTime'].setValue(row.allowedBreakTime);
        upsertShiftExceptionPopup.openPopover();

    }

    edit(row) {
        this.shiftWeekForm.patchValue(row);
        this.shiftWeekId = row.shiftWeekId;
        this.timeStamp = row.timeStamp;
        this.shiftWeekForm.controls['dayOfWeek'].setValue(row.dayOfWeek);
        this.shiftWeekForm.controls['startTime'].setValue(this.datePipe.transform(this.utcToLocal(row.startTime), 'HH:mm'));
        this.shiftWeekForm.controls['endTime'].setValue(this.datePipe.transform(this.utcToLocal(row.endTime), 'HH:mm'));
        this.shiftWeekForm.controls['deadLine'].setValue(this.datePipe.transform(this.utcToLocal(row.deadLine), 'HH:mm'));
        this.shiftWeekForm.controls['allowedBreakTime'].setValue(row.allowedBreakTime);
        // this.upsertShiftWeekPopover.open();
    }

    editShiftWeekPopupOpen(row, upsertShiftWeekPopup) {
        // this.isEditShiftTiming = true;
        this.shiftWeekForm.patchValue(row);
        this.shiftWeekId = row.shiftWeekId;
        this.timeStamp = row.timeStamp;
        this.shiftWeekForm.controls['dayOfWeek'].setValue(row.dayOfWeek);
        this.shiftWeekForm.controls['startTime'].setValue(this.datePipe.transform(this.utcToLocal(row.startTime), 'HH:mm'));
        this.shiftWeekForm.controls['endTime'].setValue(this.datePipe.transform(this.utcToLocal(row.endTime), 'HH:mm'));
        this.shiftWeekForm.controls['deadLine'].setValue(this.datePipe.transform(this.utcToLocal(row.deadLine), 'HH:mm'));
        this.shiftWeekForm.controls['allowedBreakTime'].setValue(row.allowedBreakTime);
        upsertShiftWeekPopup.openPopover();
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp2 = this.temp2.filter(shiftTiming => shiftTiming.shift.toLowerCase().indexOf(this.searchText) > -1);
        this.shiftTimings = temp2;
    }

    closeSearch() {
        this.filterByName(null);
    }


    toggleAllRolesSelected() {
        if (this.allDaysSelected.selected) {
            if (this.shiftOptionsList.length === 0) {
                this.shiftTimingForm.controls['shiftTimingOptions'].patchValue([]);
            }
            else {
                this.shiftTimingForm.controls['shiftTimingOptions'].patchValue([
                    ...this.shiftOptionsList.map(item => item.displayName),
                    0
                ]);
            }
        } else {
            this.shiftTimingForm.controls['shiftTimingOptions'].patchValue([]);
        }
    }

    toggleUserPerOne() {
        if (this.allDaysSelected.selected) {
            this.allDaysSelected.deselect();
            return false;
        }
        if (this.shiftTimingForm.controls['shiftTimingOptions'].value.length === this.shiftOptionsList.length)
            this.allDaysSelected.select();
    }

    compareSelecteddaysFn(shiftOptionsList: any, selectedDay: any) {
        if (shiftOptionsList === selectedDay) {
            return true;
        } else {
            return false;
        }
    }

    getAllBranches() {
        const branchSearchResult = new HrBranchModel();
        branchSearchResult.isArchived = false;
        this.hrManagementService.getBranches(branchSearchResult).subscribe((response: any) => {
            if (response.success == true) {
                this.branchList = response.data;
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

    
  fitContent(optionalParameters : any) {

    if ($(optionalParameters['gridsterViewSelector'] + ' #widget-scroll-id').length > 0) {
              
        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
        var contentHeight = appHeight - 45;                
        $(optionalParameters['gridsterViewSelector'] + ' #widget-scroll-id').height(contentHeight);                
             
        setTimeout(function(){ 
            $('#table-1' + ' datatable-body').addClass('widget-scroll');
            $('#table-2' + ' datatable-body').addClass('widget-scroll');
          }, 1000);

      }
   
  }

  getTimezoneName() {
    const today = new Date();
    const short = today.toLocaleDateString(undefined);
    const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
  
    // Trying to remove date from the string in a locale-agnostic way
    const shortIndex = full.indexOf(short);
    if (shortIndex >= 0) {
      const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
      
      // by this time `trimmed` should be the timezone's name with some punctuation -
      // trim it from both sides
      return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  
    } else {
      // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
      return full;
    }

  }


}