import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { HRManagementService } from '../../services/hr-management.service';
import { TranslateService } from '@ngx-translate/core';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../helpers/constant-variables';
import { SpecificDayModel } from '../../models/specificday-model';
import * as _moment from 'moment';

@Component({
    selector: 'app-fm-component-specificDay',
    templateUrl: `specificDay.component.html`

})

export class SpecificDayComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertSpecificDayPopUp") upsertSpecificDayPopover;
    @ViewChildren("deleteSpecificDayPopUp") deleteSpecificDayPopover;
 
    specificDayText: any;
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
    specificDayForm: FormGroup;
    weekOffSpecificDayForm: FormGroup;
    specificDayModel: SpecificDayModel[];
    specificDayInputModel: SpecificDayModel;
    specificDayId: string;
    specificDayReason: string;
    searchText: string;
    specificDayDate: Date;
    upsertInProgress: boolean;
    dateFrom: Date;
    moment:any;

    constructor(private translateService: TranslateService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef) {
        super();
        this.moment = _moment;
     }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllSpecificDays();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    getAllSpecificDays() {
        this.isAnyOperationIsInprogress = true;
        var specificDaysModel = new SpecificDayModel();
        specificDaysModel.isArchived = this.isArchived;
        this.hrManagementService.getAllSpecificDays(specificDaysModel).subscribe((response: any) => {
            if (response.success == true) {
                this.specificDayModel = response.data;
                this.temp = this.specificDayModel;
                this.clearForm();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createSpecificDay(upsertSpecificDayPopUp) {
        upsertSpecificDayPopUp.openPopover();
        this.specificDayText = this.translateService.instant('SPECIFICDAY.ADDSPECIFICDAY');
    }

    upsertSpecificDay(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.specificDayInputModel = this.specificDayForm.value;
        this.specificDayInputModel.reason = this.specificDayInputModel.reason.toString().trim();
        this.specificDayInputModel.specificDayId = this.specificDayId;
        this.specificDayInputModel.timeStamp = this.timeStamp;
        this.hrManagementService.upsertSpecificDay(this.specificDayInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertSpecificDayPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllSpecificDays();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeUpsertSpecificDayPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertSpecificDayPopover.forEach((p) => p.closePopover());
    }

    editSpecificDayPopupOpen(row, upsertSpecificDayPopUp) {
        this.specificDayForm.patchValue(row);
        this.specificDayId = row.specificDayId;
        this.timeStamp = row.timeStamp;
        this.specificDayText = this.translateService.instant('SPECIFICDAY.EDITSPECIFICDAY');
        upsertSpecificDayPopUp.openPopover();
    }

    deleteSpecificDayPopUpOpen(row, deleteSpecificDayPopUp) {
        this.specificDayId = row.specificDayId;
        this.specificDayReason = row.reason;
        this.specificDayDate = row.date;
        this.timeStamp = row.timeStamp;
        deleteSpecificDayPopUp.openPopover();
    }

    closeDeleteSpecificDayDialog() {
        this.clearForm();
        this.deleteSpecificDayPopover.forEach((p) => p.closePopover());
    }

    deleteSpecificDay() {
        this.isAnyOperationIsInprogress = true;
        this.specificDayInputModel = new SpecificDayModel();
        this.specificDayInputModel.specificDayId = this.specificDayId;
        this.specificDayInputModel.reason = this.specificDayReason;
        this.specificDayInputModel.date = this.specificDayDate;
        this.specificDayInputModel.timeStamp = this.timeStamp;
        this.specificDayInputModel.isArchived = !this.isArchived;

        this.hrManagementService.upsertSpecificDay(this.specificDayInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteSpecificDayPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllSpecificDays();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.specificDayId = null;
        this.isThereAnError = false;
        this.specificDayReason = null;
        this.specificDayDate = null;
        this.searchText = null;
        this.timeStamp = null;
        this.specificDayForm = new FormGroup({
            reason: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            date: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(specificDay => specificDay.reason.toLowerCase().indexOf(this.searchText) > -1 
                                   || (specificDay.date == null? null :
                                     this.moment(specificDay.date).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1));
        this.specificDayModel = temp;
    }


    closeSearch() {
        this.filterByName(null);
    }
}
