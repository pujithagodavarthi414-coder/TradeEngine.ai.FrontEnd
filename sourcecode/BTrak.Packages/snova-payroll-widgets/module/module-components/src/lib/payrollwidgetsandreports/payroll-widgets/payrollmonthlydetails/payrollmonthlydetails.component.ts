import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { EmployeeAccountDetailsModel } from "../../models/employeeaccountdetailsmodel";
import { PayRollService } from "../../services/PayRollService";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment_ from 'moment';
const moment = moment_;
import { Moment } from 'moment';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: "app-payrollmonthlydetails",
    templateUrl: "payrollmonthlydetails.component.html",
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class PayRollMonthlyDetailsComponent extends CustomAppBaseComponent {
    employeeAccountDetailsForm: FormGroup;
    isThereAnError: boolean;
    employeeAccountDetailsModel: EmployeeAccountDetailsModel;
    payRollMonthlyDetails: any;
    isAnyOperationIsInprogress: boolean = false;
    validationMessage: string;
    selectedYearMonth: string;
    date = new FormControl();
    @ViewChild(MatDatepicker) picker;

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef) {super()}

    ngOnInit() {
        super.ngOnInit();
        this.selectedYearMonth = moment(new Date()).format("MMM-YYYY").toString();
        this.date.setValue(new Date());
        this.getPayRollMonthlyDetails();        
    }

    monthSelected(normalizedYear: Moment) {
        this.date.setValue(normalizedYear);
        this.selectedYearMonth = moment(normalizedYear.toDate()).format("MMM-YYYY").toString();
        console.log(this.selectedYearMonth);
        this.picker.close();
        this.getPayRollMonthlyDetails();
      }


    getPayRollMonthlyDetails() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.getPayRollMonthlyDetails(this.selectedYearMonth).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollMonthlyDetails= response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
             this.isAnyOperationIsInprogress = false;
             this.cdRef.detectChanges();
        });
    }
}
