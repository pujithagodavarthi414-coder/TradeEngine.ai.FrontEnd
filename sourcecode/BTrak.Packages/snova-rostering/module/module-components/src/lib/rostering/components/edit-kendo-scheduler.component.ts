import { Component, Output, EventEmitter, Input, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { EditMode } from '@progress/kendo-angular-scheduler';
import { DepartmentModel } from '../models/department-model';
import { EmployeeListModel } from '../models/employee-model';
import { RosterPlan } from '../models/roster-create-plan-model';
import { RosterBasicRequirement } from '../models/roster-basic-model';
import { RosterService } from '../services/roster-service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ShiftWeekModel } from '../models/shift-week-model';
import { CommonService } from '../services/common.service';
import { ConstantVariables } from '../models/constant-variables';
import { of } from 'rxjs';
import { Observable } from "rxjs/Observable"
import { MultiSelectComponent, DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { DateInputCustomFormatPlaceholder } from '@progress/kendo-angular-dateinputs';
import * as moment_ from "moment";
const moment = moment_;

@Component({
    selector: 'scheduler-edit-form',
    encapsulation: ViewEncapsulation.None,
    templateUrl: "edit-kendo-scheduler.component.html",
    styles: [`
        #eventForm {
            max-width: 600px;
        }

        #eventForm .k-datetime-picker-wrapper .k-widget {
            display: inline-block;
            width: 150px;
            margin-right: 15px;
        }

        #eventForm .k-edit-label { width: 17%; }
        #eventForm .k-edit-field { width: 77%; }
    `]
})
export class SchedulerEditFormComponent {
    @ViewChild("employeeList", { static: true }) employeeList: MultiSelectComponent;
    @ViewChild("department", { static: true }) department: DropDownListComponent;
    @ViewChild("shift", { static: true }) shift: DropDownListComponent;

    departments: DepartmentModel[];
    filteredDepartmentList: DepartmentModel[];
    employeeListData: EmployeeListModel[];
    filteredEmployeeList: EmployeeListModel[];
    shiftTimeList: any;
    filteredShiftTimeList: any;
    selectedEmployee: any;
    selectedPlan: any;
    eventDataItem: any;
    editForm: FormGroup;
    isSubmit = of(false);

    @Input()
    public isNew = false;

    @Input()
    public editMode: EditMode;

    @Input()
    public set event(dataItem: any) {
        this.isSubmit = of(false);
        if (dataItem !== undefined) {
            this.department.reset();
            this.shift.reset();
            this.eventDataItem = dataItem;
            if (dataItem.id) {
                this.editForm = new FormGroup({
                    // 'id': dataItem.id,
                    start: new FormControl(dataItem.start, Validators.required),
                    end: new FormControl(dataItem.end, [Validators.required]),
                    startTimezone: new FormControl(dataItem.startTimezone),
                    endTimezone: new FormControl(dataItem.endTimezone),
                    isAllDay: new FormControl(dataItem.isAllDay),
                    title: new FormControl(dataItem.title),
                    description: new FormControl(dataItem.description),
                    employeeId: new FormControl(dataItem.dataItem.map((x) => (x.employeeId || x.actualEmployeeId || x.plannedEmployeeId))),
                    departmentId: new FormControl(""),
                    shiftId: new FormControl("")
                });

                this.selectedEmployee = dataItem.dataItem.map((x) => (x.employeeId || x.actualEmployeeId || x.plannedEmployeeId));
            } else {
                this.editForm = new FormGroup({
                    // 'id': this.getNextId(),
                    start: new FormControl(dataItem.Start, Validators.required),
                    end: new FormControl(dataItem.End, Validators.required),
                    startTimezone: new FormControl(""),
                    endTimezone: new FormControl(""),
                    isAllDay: new FormControl(dataItem.IsAllDay),
                    title: new FormControl(dataItem.title),
                    description: new FormControl(dataItem.description),
                    employeeId: new FormControl(""),
                    departmentId: new FormControl(""),
                    shiftId: new FormControl("")
                });
                this.selectedEmployee = [];
            }
            this.active = true;
        }
    }

    @Input("departments")
    set _departments(data) {
        this.departments = data;
        this.filteredDepartmentList = data;
    }

    @Input("shifts")
    set _shifts(data) {
        this.shiftTimeList = data;
        this.filteredShiftTimeList = data;
    }

    @Input("employeeListDataDetails")
    set _employeeListDataDetails(data) {
        this.employeeListData = [];
        if (data && data.length > 0) {
            data.forEach((value, index) => {
                let employee: any = Object.assign({}, value);
                employee.fullName = value.firstName + " " + value.surName;
                this.employeeListData.push(employee);
            })
            this.filteredEmployeeList = [...this.employeeListData];
        }
    }

    @Input("selectedPlan")
    set _selectedPlan(data) {
        this.selectedPlan = data;
    }

    @Input("dateFormat")
    set _dateFormat(data) {
        if (data) {
            this.dateFormat = data;
        } else {
            this.dateFormat = {};
            this.dateFormat.pattern = ConstantVariables.DateFormat;
        }
    }

    @Input("priorInputData") priorInputData;
    @Input("requestDetails") requestDetails;

    @Output()
    public cancel: EventEmitter<any> = new EventEmitter();

    @Output()
    public save: EventEmitter<any> = new EventEmitter();

    public active = false;
    defaultDepartmentItem: { departmentName: string, departmentId: number } = { departmentName: "Select item...", departmentId: null };
    defaultShiftItem: { shift: string, shiftTimingId: number } = { shift: "Select item...", shiftTimingId: null };
    dateFormat: any;
    public formatPlaceholder: DateInputCustomFormatPlaceholder = {
        day: 'd.',
        month: 'M.',
        year: 'y.',
        hour: 'h.',
        minute: 'm.',
        second: 's.'
    };

    public get isEditingSeries(): boolean {
        return this.editMode === EditMode.Series;
    }

    constructor(public formBuilder: FormBuilder,
        private toastr: ToastrService, private translateService: TranslateService,
        private rosterService: RosterService, private commonService: CommonService) {

        this.dateFormat = {};
        this.dateFormat.pattern = ConstantVariables.DateFormat;
    }

    public onSave(e: MouseEvent): void {
        e.preventDefault();
        this.active = false;

        let startDate = (this.priorInputData && this.priorInputData.startDate.toDate().toDateString()) || this.requestDetails.requiredFromDate;
        let endDate = (this.priorInputData && this.priorInputData.endDate.toDate().toDateString()) || this.requestDetails.requiredToDate;

        if (new Date(startDate) > new Date(this.editForm.value.start) ||
            new Date(endDate) < new Date(this.editForm.value.start)
        ) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterBetweenStartDateAndEndDate));
            return;
        }

        if (this.eventDataItem) {
            this.eventDataItem.start = this.editForm.value.start;
            this.eventDataItem.end = this.editForm.value.end;
            this.eventDataItem.employeeId = this.editForm.value.employeeId;
            this.eventDataItem.departmentId = this.editForm.value.departmentId;
            this.eventDataItem.shiftId = this.editForm.value.shiftId;
            this.save.emit(this.eventDataItem);
        } else {
            this.save.emit(this.editForm.value);
        }
    }

    public onCancel(e: MouseEvent): void {
        e.preventDefault();
        this.department.reset();
        this.shift.reset();
        this.isSubmit = of(false);
        this.active = false;
        this.cancel.emit();
    }

    public departmentChange(department: any, formGroup): void {
        const { shiftId } = formGroup.value;
        this.filteredEmployeeList = Object.assign([], this.employeeListData);
        if (department) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (x.departmentId == department.departmentId));
        }
        if (shiftId) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (x.shiftTimingId == shiftId));
        }
    }

    public shiftChange(shift: any, formGroup): void {
        this.filteredEmployeeList = Object.assign([], this.employeeListData);
        const { departmentId } = formGroup.value;
        if (departmentId) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (x.departmentId == departmentId));
        }
        if (shift) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (x.shiftTimingId == shift.shiftTimingId));
            this.getAllShiftWeek(shift, formGroup);
        }
    }

    getAllShiftWeek(shift, formGroup) {
        const selectedWeektiming = new ShiftWeekModel();
        selectedWeektiming.shiftTimingId = shift.shiftTimingId;
        this.rosterService.getShiftWeek(selectedWeektiming).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    const shiftWeek = response.data;
                    const shift = shiftWeek.find((x) => x.dayOfWeek.toLowerCase() == moment(formGroup.value.start).format("dddd").toLowerCase());
                    if (shift) {
                        const startDate = moment(formGroup.value.start).format('YYYY-MM-DD');
                        let starttime;
                        if (shift.startTime) {
                            starttime = this.commonService.convertUtcToLocal(shift.startTime).format("HH:mm");
                        } else {
                            starttime = ConstantVariables.DefaultStartTime;
                        }

                        let endtime;
                        if (shift.endTime) {
                            endtime = this.commonService.convertUtcToLocal(shift.endTime).format("HH:mm");
                        } else {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEndTimeShouldBeValid));
                            endtime = "23:59";
                        }
                        formGroup.controls["start"].setValue(moment(startDate + " " + starttime).toDate());
                        if (moment.duration(moment(endtime).diff(moment(starttime))).asHours() < 0) {
                            formGroup.controls["end"].setValue(moment(startDate + " " + endtime).add(1, "days").toDate());
                        } else {
                            formGroup.controls["end"].setValue(moment(startDate + " " + endtime).toDate());
                        }
                    } else {
                        this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterNoShiftllocated));
                    }
                }
            }
        });
    }

    onOpen(event) {
        if (this.employeeList) {
            this.employeeList.filterChange.asObservable().subscribe((x) => {
                this.filteredEmployeeList = this.employeeListData.filter((employee) => employee.userName.toLowerCase().includes(x.toLowerCase()));
            });
        }
    }

    onChangeFrom(event) {
        const startdate = this.editForm.controls["start"].value as Date;
        const enddate = this.editForm.controls["end"].value as Date;
        if (startdate.getTime() === startdate.getTime() && startdate >= enddate) {
            this.editForm.controls["end"].setValue(moment(startdate).add(1, "hours").toDate())
        }
    }

    onChangeTo(event) {
        const startdate = this.editForm.controls["start"].value as Date;
        const enddate = this.editForm.controls["end"].value as Date;
        if (enddate.getTime() === enddate.getTime() && startdate >= enddate) {
            this.editForm.controls["start"].setValue(moment(enddate).add(-1, "hours").toDate())
        }
    }

    handleShiftFilter(value) {
        this.filteredShiftTimeList = this.shiftTimeList.filter((s) => s.shift.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    handleDepartmentFilter(value) {
        this.filteredDepartmentList = this.departments.filter((s) => s.departmentName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}
