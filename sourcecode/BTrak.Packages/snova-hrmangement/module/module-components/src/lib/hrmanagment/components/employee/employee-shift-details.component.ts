import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { Component, Input, ChangeDetectorRef, ViewChildren, ViewChild } from "@angular/core";

import { Store, select } from '@ngrx/store';
import { State } from "../../store/reducers/index";
import { shiftExpansionModel } from '../../models/shiftmodel';
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs";
import { LoadShiftTimingListItemsTriggered } from "../../store/actions/shift-timing.action";
import * as hrManagementModuleReducer from '../../store/reducers/index';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeShiftDialogComponent } from './employee-shift-dialog.component';
import { EmployeeShifViewComponent } from './employee-shift-view-details';
import { CookieService } from 'ngx-cookie-service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { ShiftExceptionModel } from '../../models/shift-exception-model';
import { ShiftWeekModel } from '../../models/shift-week-model';
import { ShiftTimingModel } from '../../models/shift-timing-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EmployeeShift } from '../../models/employeeshift-model';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-hr-component-shift-details',
    templateUrl: 'employee-shift-details.component.html',
})

export class EmployeeShiftDetailsComponent extends CustomAppBaseComponent {

    @ViewChildren("upsertEmployeeShiftPopup") upsertEmployeeShiftPopOver;
    @ViewChildren("deleteEmployeeShiftPopUp") deleteEmployeeShiftPopover;
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isThereAnError: boolean;
    validationMessage: any;
    employeeShifts: any;
    temp2: any;
    temp: any;
    shiftExceptions: ShiftExceptionModel[];
    shiftWeeks: ShiftWeekModel[];
    selectedWeektiming: ShiftWeekModel;
    selectedExceptiontiming: ShiftExceptionModel;
    shiftWeekTitle: string;
    shiftTimingId: string;
    selectEmployeeShiftDropDownListData$: Observable<ShiftTimingModel[]>
    isExpanded: boolean;
    employeeShiftForm: FormGroup;
    isHide: boolean = true;
    isEdit: boolean = false;
    searchText: string = null;
    isOpen: boolean = true;
    fromDate: Date = new Date();
    toDate: Date = new Date();
    minDateForEndDate = new Date();
    minDate = this.fromDate;
    isArchive: boolean = false;
    //minDate2 = new Date(1753, 0, 1);
    endDateBool: boolean = true;
    employeeShift: EmployeeShift;
    scrollbarH: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    loadingIndicator: boolean = false;
    constructor(private store: Store<State>, private hrManagement: HRManagementService,
        private hrManagementService: HRManagementService, private toaster: ToastrService, private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
        private cookieService: CookieService, public datePipe: DatePipe) {
        super();
        this.clearForm();
    }

    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
        }
    }

    @Input('joiningDate')
    set joiningDate(data: any) {
        // this.registeredDateTime = data;
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    permission: boolean = false;
    registeredDateTime: Date;
    employeeId: string;
    isAnyOperationIsInprogress: boolean = false;
    currentlyOpenedShift: number;


    ngOnInit() {
        super.ngOnInit();

        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe((result) => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })

        // this.canAccess_feature_ViewEmployeeShiftDetails$.subscribe((result) => {
        if ((this.canAccess_feature_ViewEmployeeShiftDetails && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            if (this.employeeId && this.employeeId != "") {
                this.getShiftExpansion();
                this.getShiftTimingList();
            } else {
                this.getEmployees();
            }
        }
        //})
        this.getSoftLabelConfigurations();
        this.clearForm();
        this.loadingIndicator = true;
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
                this.getShiftExpansion();
                this.getShiftTimingList();
            }
        });
    }


    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }

    getShiftExpansion() {
        this.isAnyOperationIsInprogress = true;
        var shiftModel = new shiftExpansionModel();
        shiftModel.employeeId = this.employeeId;

        this.hrManagement.getShiftExpansion(shiftModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeShifts = response.data;
                this.temp = this.employeeShifts;
                this.isAnyOperationIsInprogress = false;
                this.scrollbarH = true;

                if (this.employeeShifts.length > 0) {
                    this.isHide = true;
                }
                else {
                    this.isHide = false;
                }
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.loadingIndicator = false;
            this.cdRef.detectChanges();
        });
    }

    upsertEmployeeShift() {
        this.isAnyOperationIsInprogress = true;
        let employeeShift = new EmployeeShift();
        //employeeShift.employeeId = this.employeeId;
        employeeShift = this.employeeShiftForm.value;

        if (this.isEdit == true) {
            employeeShift.timeStamp = this.employeeShift.timeStamp;
            employeeShift.employeeShiftId = this.employeeShift.employeeShiftId;
        }
        employeeShift.employeeId = this.employeeId;
        this.hrManagement.upsertEmployeeShift(employeeShift).subscribe((response: any) => {
            if (response.success == true) {
                //this.employeeShifts = response.data;
                this.closeEmployeeShiftPopup();
                this.clearForm();
                this.getShiftExpansion();

            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);

            }
            this.isAnyOperationIsInprogress = false;
        });

    }

    clearForm() {
        this.shiftTimingId = null;
        this.searchText = null;
        this.minDate = null;
        this.employeeShiftForm = new FormGroup({
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(
            ),
            shiftTimingId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    editEmployeeShiftPopupOpen(row, upsertEmployeeShiftPopup) {
        this.employeeShiftForm.patchValue(row);
        this.minDateForEndDate = this.employeeShiftForm.get('activeFrom').value;
        this.isEdit = true;
        this.employeeShift = row;
        this.endDateBool = false;
        upsertEmployeeShiftPopup.openPopover();

    }

    deleteEmployeeShiftPopUpOpen(row, deleteEmployeeShiftPopover) {
        this.isThereAnError = false;
        this.employeeShift = row;
        this.employeeShift.isArchived = true;
        this.isArchive = true;
        deleteEmployeeShiftPopover.openPopover();
    }


    archiveEmployeeShift() {
        let employeeShiftDetails = new EmployeeShift();
        employeeShiftDetails = this.employeeShift;
        this.hrManagementService.upsertEmployeeShift(employeeShiftDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.closeDeleteEmployeeShiftDialog();
                this.clearForm();
                this.getShiftExpansion();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        });

    }
    getShiftTimingList() {
        var shiftTimingSearchModel = new ShiftTimingModel();
        shiftTimingSearchModel.isArchived = false;
        shiftTimingSearchModel.employeeId = this.employeeId;
        this.store.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
        this.selectEmployeeShiftDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getShiftTimingAll));
        this.cdRef.detectChanges();
    }

    openExpansions(index, shiftTiming) {
        this.shiftTimingId = shiftTiming.shiftTimingId;
        this.currentlyOpenedShift = index;
        // this.getAllShiftWeek();
        // this.getAllShiftException();

    }

    closeExpansions(index) {
        if (this.currentlyOpenedShift === index) {
            this.currentlyOpenedShift = -1;
        }
    }

    closeDeleteEmployeeShiftDialog() {
        this.isThereAnError = false;
        this.employeeShiftForm.reset();
        this.formDirective.resetForm();
        this.deleteEmployeeShiftPopover.forEach((p) => p.closePopover());
    }

    checkIsAccordionOpen(shifttimingId) {
        if (this.shiftTimingId === shifttimingId) {
            this.isExpanded = true;
            this.cdRef.detectChanges();
        }
        else {
            this.isExpanded = false;
            this.cdRef.detectChanges();
        }
    }

    closeEmployeeShiftPopup() {
        this.clearForm();
        this.employeeShiftForm.reset();
        this.formDirective.resetForm();
        this.upsertEmployeeShiftPopOver.forEach((p) => p.closePopover());
    }


    createEmployeeShift(upsertEmployeeShiftPopOver) {
        this.clearForm();
        this.isEdit = false;
        upsertEmployeeShiftPopOver.openPopover();
    }

    onEmployeeView(event) {
        const dialogRef = this.dialog.open(EmployeeShifViewComponent, {
            height: 'auto',
            width: '70%',
            data: { shiftdata: event }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
        });
    }

    onSelect() {
        var date = new Date();
        var activeFrom = this.employeeShiftForm.controls['activeFrom'].value;

        if (new Date(activeFrom).getDate() < date.getDate()) {
            const dialogRef = this.dialog.open(EmployeeShiftDialogComponent, {
                height: 'auto',
                width: '450px',
            });

            dialogRef.afterClosed().subscribe((result: boolean) => {
                console.log('The dialog was closed');
                if (result)
                    this.upsertEmployeeShift();
            });
        }
        else {
            this.upsertEmployeeShift();
        }


    }

    onSelect2() {
        var date = new Date();
        if (new Date(this.employeeShift.activeFrom) < date) {

            const dialogRef = this.dialog.open(EmployeeShiftDialogComponent, {
                height: 'auto',
                width: '450px',
            });

            dialogRef.afterClosed().subscribe((result: boolean) => {
                console.log('The dialog was closed');
                if (result)
                    this.archiveEmployeeShift();
            });

        }
        else {
            this.archiveEmployeeShift();
        }
    }

    dialogueBox() {
        if (this.isEdit == true) {
            this.onSelect()
        }
        else {
            this.upsertEmployeeShift();
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

        const temp2 = this.temp.filter((t => (t.shiftName.toLowerCase().indexOf(this.searchText) > -1) || (this.datePipe.transform(t.activeFrom, 'dd-MMM-yyyy').toString().toLowerCase().indexOf(this.searchText) > -1) 
        || (this.datePipe.transform(t.activeTo, 'dd-MMM-yyyy').toString().toLowerCase().indexOf(this.searchText) > -1)));
        this.employeeShifts = temp2;
    }

    closeSearch() {
        this.filterByName(null);
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.fromDate = new Date();
        this.toDate = new Date();
        this.employeeShifts = this.temp;
    }

    startDate() {
        if (this.employeeShiftForm.value.activeFrom) {
            this.minDateForEndDate = this.employeeShiftForm.value.activeFrom;
            this.endDateBool = false;
        }
        else {
            this.endDateBool = true;
            this.employeeShiftForm.controls['activeTo'].setValue('');
        }
    }
}
