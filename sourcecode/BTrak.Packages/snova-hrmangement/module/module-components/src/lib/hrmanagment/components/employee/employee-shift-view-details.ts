import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ShiftWeekModel } from '../../models/shift-week-model';
import { ShiftExceptionModel } from '../../models/shift-exception-model';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

export interface DialogData {
    shiftdata:any;
}

@Component({
    selector: 'app-hr-component-employee-shift-details-view',
    templateUrl: 'employee-shift-view-details.html'
})

export class EmployeeShifViewComponent{

    shiftWeeks: ShiftWeekModel[];
    selectedWeektiming: ShiftWeekModel;
    selectedExceptiontiming: ShiftExceptionModel;
    shiftWeekTitle: string;
    shiftTimingId: string;
    isAnyOperationIsInprogress: boolean = false;
    currentlyOpenedShift: number;
    isThereAnError: boolean;
    validationMessage: any;
    scrollbarH: boolean = false;
    loadingIndicator: boolean = false;

    constructor(private dialogRef: MatDialogRef<EmployeeShifViewComponent>, private hrManagementService: HRManagementService,private toaster: ToastrService, 
        private cdRef: ChangeDetectorRef,  @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    }

    ngOnInit() {
        this.loadingIndicator = true;
        this.getAllShiftWeek();
    }

    ngAfterViewInit() {
        (document.querySelector('.mat-dialog-padding') as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    getAllShiftWeek() {
            this.isAnyOperationIsInprogress = true;
            this.shiftTimingId = this.shiftTimingId;
            this.selectedWeektiming = new ShiftWeekModel();
            this.shiftWeekTitle=this.data.shiftdata.shiftName ;
            this.selectedWeektiming.shiftTimingId = this.data.shiftdata.shiftTimingId;
            this.hrManagementService.getShiftWeek(this.selectedWeektiming).subscribe((response: any) => {
                if (response.success == true) {
                    this.isAnyOperationIsInprogress = false;
                    this.scrollbarH = true;
                    this.shiftWeeks = response.data;
                    this.cdRef.detectChanges();
                   
                }
                else {                   
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                    this.toaster.error(this.validationMessage);
                }
            });
            this.loadingIndicator = false;
        }

    onClose() {
        this.dialogRef.close(true);
    }

    onNoClick(){
        this.dialogRef.close(false);
    }

}