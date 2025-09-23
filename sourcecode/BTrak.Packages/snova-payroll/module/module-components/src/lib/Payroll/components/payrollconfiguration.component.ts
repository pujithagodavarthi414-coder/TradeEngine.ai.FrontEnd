import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SatPopover } from "@ncstate/sat-popover";
import { CompanyRegistrationModel } from '../models/company-registration-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { PayrollManagementService } from '../services/payroll-management.service';

@Component({
    selector: 'app-payrollconfiguration',
    templateUrl: `payrollconfiguration.component.html`
})

export class PayRollConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollTemplatePopUp") upsertPayRollTemplatePopover;
    @ViewChild("goToBackPagePopover") goToBackPagePopover: SatPopover;
   
    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    roleFeaturesIsInProgress$: Observable<boolean>;
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


    constructor(private payrollManagementService: PayrollManagementService,private activatedRoute: ActivatedRoute,private _location: Location,
        public router: Router) { super() }

    ngOnInit() {
        this.clearForm();
        this.activatedRoute.params.subscribe(routeParams => {
            this.payRollTemplateId = routeParams.id;
            if(this.payRollTemplateId != null){
                this.getAllPayRollTemplates();
            }
           })
        super.ngOnInit();
        this.getCurrencies();
        
        
    }

    getCurrencies() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.payrollManagementService.getCurrencies(companyModel).subscribe((response: any) => {
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
        payRollTemplateModel.payRollTemplateId = this.payRollTemplateId;
        payRollTemplateModel.isArchived = this.isArchivedTypes;
        this.payrollManagementService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                if(response.data[0] != null){
                    this.payRollTemplateForm.patchValue(response.data[0]);
                    this.timeStamp = response.data[0].timeStamp;
                }
                
                this.temp = this.payRollTemplates;
                this.isAnyOperationIsInprogress = false
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }


    clearForm() {
        this.payRollTemplateId = null;
        this.payRollName = null;
        this.payRollShortName = null;
        this.isRepeatInfinitly = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.islastWorkingDay = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollTemplateForm = new FormGroup({
            payRollName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            payRollShortName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            isRepeatInfinitly: new FormControl(null,
            ),
            islastWorkingDay: new FormControl(null,
            ),
            infinitlyRunDate: new FormControl(null,
            ),
            currencyId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    editPayRollTemplatePopupOpen(row, upsertPayRollTemplatePopUp) {
        this.payRollTemplateForm.patchValue(row);
        this.payRollTemplateId = row.payRollTemplateId;
        this.timeStamp = row.timeStamp;
        this.payRollTemplate = 'PAYROLLTEMPLATE.EDITPAYROLLTEMPLATE';
        upsertPayRollTemplatePopUp.openPopover();
    }

    goToBackPage(){
        this._location.back();
    }

    createPayRollTemplatePopupOpen(upsertPayRollTemplatePopUp) {
        this.clearForm();
        upsertPayRollTemplatePopUp.openPopover();
        this.payRollTemplate = 'PAYROLLTEMPLATE.ADDPAYROLLTEMPLATE';
    }

    upsertPayRollTemplate(formDirective: FormGroupDirective) {
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = true;
        this.payRollTemplateModel = this.payRollTemplateForm.value;
        if (this.payRollTemplateId != null)  {
            this.payRollTemplateModel.payRollTemplateId = this.payRollTemplateId;
            this.payRollTemplateModel.timeStamp = this.timeStamp;
        }
        this.payrollManagementService.upsertPayRollTemplate(this.payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollTemplateId = response.data;
                this.getAllPayRollTemplates();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
        });
    }
} 