import { Component, OnInit, ViewChildren, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { PayRollService } from '../services/PayRollService';
import * as moment_ from 'moment';
const moment = moment_;
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyRegistrationModel } from '../models/company-registration-model';

@Component({
    selector: 'app-payrolltemplate',
    templateUrl: `payrolltemplate.component.html`
})

export class PayRollTemplateComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("deletePayRollTemplatePopUp") deletePayRollTemplatePopover;
    @Output() closePopUp = new EventEmitter<any>();

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollTemplate: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollName: string;
    timeStamp: any;
    searchText: string;
    payRollTemplateForm: FormGroup;
    payRollTemplateModel: PayRollTemplateModel;
    isPayRollTemplateArchived: boolean = false;
    islastWorkingDay: boolean;
    payRollShortName: string;
    isArchivedTypes: boolean = false;
    isRepeatInfinitly: boolean;
    payRollTemplates: string;
    payRollTemplateId: string;
    infinitlyRunDate: Date;
    currencies: any;
    currencyId: string;

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,private router: Router,private toastr: ToastrService,) { super() }

         

    ngOnInit() {
        super.ngOnInit();
        this.getAllPayRollTemplates();   
        this.getCurrencies();
        
    }

    getCurrencies() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.payRollService.getCurrencies(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencies = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getAllPayRollTemplates() {
        this.isAnyOperationIsInprogress = true;
        var payRollTemplateModel = new PayRollTemplateModel();
        payRollTemplateModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollTemplates = response.data;
                this.temp = this.payRollTemplates;
                this.cdRef.detectChanges();
                this.isAnyOperationIsInprogress = false
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
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

        const temp = this.temp.filter(payRollTemplates => 
               (payRollTemplates.payRollName == null ? null : payRollTemplates.payRollName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollTemplates.infinitlyRunDate == null ? null : moment(payRollTemplates.infinitlyRunDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollTemplates.payRollShortName == null ? null : payRollTemplates.payRollShortName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollTemplates.currencyName == null ? null : payRollTemplates.currencyName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1)  ? payRollTemplates.isRepeatInfinitly == true :
                   ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollTemplates.isRepeatInfinitly == false: null)
               || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1)  ? payRollTemplates.islastWorkingDay == true :
                   ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollTemplates.islastWorkingDay == false: null));

        this.payRollTemplates = temp;
    }

    editPayRollTemplatePopupOpen(row) {
        this.payRollTemplateId = row.payRollTemplateId;
        this.router.navigate(['/payrollmanagement/payrolltemplate',this.payRollTemplateId]);
        this.closePopUp.emit(true);
    }
    createPayRollTemplatePopupOpen() {
        this.router.navigate(['/payrollmanagement/payrolltemplate']);
        this.closePopUp.emit(true);
    }

    deletePayRollTemplatePopUpOpen(row, deletePayRollTemplatePopUp) {
        this.payRollTemplateId = row.payRollTemplateId;
        this.payRollName = row.payRollName;
        this.payRollShortName = row.payRollShortName;
        this.isRepeatInfinitly = row.isRepeatInfinitly;
        this.islastWorkingDay = row.islastWorkingDay;
        this.timeStamp = row.timeStamp;
        this.infinitlyRunDate = row.infinitlyRunDate;
        this.currencyId = row.currencyId;
        this.isPayRollTemplateArchived = !this.isArchivedTypes;
        this.validationMessage = null
        deletePayRollTemplatePopUp.openPopover();
    }

    deletePayRollTemplate() {
        this.isAnyOperationIsInprogress = true;
        this.payRollTemplateModel = new PayRollTemplateModel();
        this.payRollTemplateModel.payRollTemplateId = this.payRollTemplateId;
        this.payRollTemplateModel.payRollName = this.payRollName;
        this.payRollTemplateModel.payRollShortName = this.payRollShortName;
        this.payRollTemplateModel.isRepeatInfinitly = this.isRepeatInfinitly;
        this.payRollTemplateModel.islastWorkingDay = this.islastWorkingDay;
        this.payRollTemplateModel.timeStamp = this.timeStamp;
        this.payRollTemplateModel.infinitlyRunDate = this.infinitlyRunDate;
        this.payRollTemplateModel.currencyId = this.currencyId;
        this.payRollTemplateModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollTemplate(this.payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollTemplatePopover.forEach((p) => p.closePopover());
                this.getAllPayRollTemplates();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeletePayRollTemplateDialog() {
        this.deletePayRollTemplatePopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 