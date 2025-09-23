import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { PayRollService } from '../../services/PayRollService';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { PayRollBandsModel } from '../../models/payrollbandsmodel';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { PayRollComponentModel } from '../../models/PayRollComponentModel';

@Component({
    selector: 'app-payrollbands',
    templateUrl: `payrollbands.component.html`
})

export class PayRollBandsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollBandsPopUp") upsertPayRollBandsPopover;
    @ViewChildren("deletePayRollBandsPopUp") deletePayRollBandsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollBandsText: string;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollBandName: string;
    timeStamp: any;
    searchText: string;
    payRollBandsForm: FormGroup;
    payRollBandsModel: PayRollBandsModel;
    isPayRollBandsArchived: boolean = false;
    isVariablePay: boolean;
    componentName: string;
    isArchivedTypes: boolean = false;
    isDeduction: boolean;
    payRollBands: string;
    payRollBandId: string;
    employeeContributionPercentage: number;
    employerContributionPercentage: number;
    relatedToContributionPercentage: boolean;
    isVisible: boolean;
    isBands: boolean;
    moment: any;
    parentPayRollBandsWithCountry: PayRollBandsModel[];
    parentPayRollBands: PayRollBandsModel[];
    countries: any;
    payRollComponents: any;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCountries();
        this.getPayRollComponents();
        this.getAllPayRollBands();
        this.getParentPayRollBands();
    }

    constructor(private payRollService: PayRollService,
        private snackbar: MatSnackBar, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
        super()
        this.moment = _moment;
    }


    getAllPayRollBands() {
        this.isAnyOperationIsInprogress = true;
        var payRollBandsModel = new PayRollBandsModel();
        payRollBandsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollBands(payRollBandsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollBands = response.data;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }

    getPayRollComponents() {
        this.isAnyOperationIsInprogress = true;
        var payRollComponentModel = new PayRollComponentModel();
        payRollComponentModel.isArchived = false;
        payRollComponentModel.isBands = true;
        this.payRollService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollComponents = response.data;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getParentPayRollBands() {
        this.isAnyOperationIsInprogress = true;
        let payRollBandsModel = new PayRollBandsModel();
        payRollBandsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollBands(payRollBandsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.parentPayRollBands = response.data.filter(x => x.parentId == null && x.isArchived != true);
                this.parentPayRollBandsWithCountry = this.parentPayRollBands;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getCountries() {
        var payRollBandsmodel = new CompanyRegistrationModel();
        payRollBandsmodel.isArchived = false;
        this.payRollService.getCountries(payRollBandsmodel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollBandsForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            fromRange: new FormControl(null,
            ),
            toRange: new FormControl(null,
            ),
            percentage: new FormControl(null,
            ),
            activeFrom: new FormControl(null,
            ),
            activeTo: new FormControl(null,
            ),
            parentId: new FormControl(null,
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            payRollComponentId: new FormControl(null,
            ),
            minAge: new FormControl(null,
            ),
            maxAge: new FormControl(null,
            ),
            forMale: new FormControl(null,
            ),
            forFemale: new FormControl(null,
            ),
            handicapped: new FormControl(null,
            ),
            isMarried: new FormControl(null,
            ),
            order: new FormControl(null,
            )
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

        const temp = this.temp.filter(payRollBandsModel => ((payRollBandsModel.name.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.parentName == null ? null : payRollBandsModel.parentName.toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.countryName == null ? null : payRollBandsModel.countryName.toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.order == null ? null : payRollBandsModel.order.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.toRange == null ? null : payRollBandsModel.toRange.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.fromRange == null ? null : payRollBandsModel.fromRange.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.percentage == null ? null : payRollBandsModel.percentage.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.minAge != null && payRollBandsModel.minAge.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.maxAge != null && payRollBandsModel.maxAge.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('male'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.forMale == true :
                ('female'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.forMale != true : null)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.handicapped == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.handicapped != true : null)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.isMarried == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? payRollBandsModel.isMarried != true : null)
            || (payRollBandsModel.activeFrom != null && this.moment(payRollBandsModel.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollBandsModel.activeTo != null && this.moment(payRollBandsModel.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)));

        this.payRollBands = temp;
    }

    editPayRollBandsPopupOpen(row, upsertPayRollBandsPopUp) {
        this.payRollBandsForm.patchValue(row);
        if(row.forMale == true){
            this.payRollBandsForm.controls["forMale"].setValue("true");
        }
        else if(row.forFemale == true){
            this.payRollBandsForm.controls["forMale"].setValue("false");
        }
        this.payRollBandId = row.payRollBandId;
        this.timeStamp = row.timeStamp;
        this.changeCountry(row.countryId, false)
        this.changeParent(row.parentId);
        this.payRollBandsText = 'PAYROLLBANDS.EDITPAYROLLBAND';
        upsertPayRollBandsPopUp.openPopover();
    }


    closeUpsertPayRollBandsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollBandsPopover.forEach((p) => p.closePopover());
    }

    createPayRollBandsPopupOpen(upsertPayRollBandsPopUp) {
        this.clearForm();
        upsertPayRollBandsPopUp.openPopover();
        this.payRollBandsText = 'PAYROLLBANDS.ADDPAYROLLBAND';
    }

    upsertPayRollBands(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollBandsModel = this.payRollBandsForm.value;
        if (this.payRollBandId) {
            this.payRollBandsModel.payRollBandId = this.payRollBandId;
            this.payRollBandsModel.timeStamp = this.timeStamp;
        }
        if(this.payRollBandsForm.value.forMale == "true"){
            this.payRollBandsModel.forMale = true;
            this.payRollBandsModel.forFemale = false;
        }
        else if(this.payRollBandsForm.value.forMale == "false"){
            this.payRollBandsModel.forFemale = true;
            this.payRollBandsModel.forMale = false;
        }
        else{
            this.payRollBandsModel.forFemale = null;
            this.payRollBandsModel.forMale = null;
        }

        if (this.payRollBandsModel.parentId == '0') {
            this.payRollBandsModel.parentId = null;
        }
        if (this.payRollBandsModel.parentId != null) {
            this.payRollBandsModel.order = null;
            this.payRollBandsModel.activeFrom = null;
            this.payRollBandsModel.activeTo = null;
            this.payRollBandsModel.minAge = null;
            this.payRollBandsModel.maxAge = null;
            this.payRollBandsModel.forMale = null;
            this.payRollBandsModel.forFemale = null;
            this.payRollBandsModel.handicapped = null;
            this.payRollBandsModel.payRollComponentId = null;
        }
        if (this.payRollBandsModel.parentId == null) {
            this.payRollBandsModel.fromRange = null;
            this.payRollBandsModel.toRange = null;
            this.payRollBandsModel.percentage = null;
        }

        if (((this.payRollBandsModel.minAge != null || this.payRollBandsModel.maxAge != null) && this.payRollBandsModel.handicapped == true)
            || ((this.payRollBandsModel.minAge != null || this.payRollBandsModel.maxAge != null) && this.payRollBandsModel.isMarried == true)
            || ((this.payRollBandsModel.minAge != null || this.payRollBandsModel.maxAge != null) && this.payRollBandsModel.forMale != null)
            || (this.payRollBandsModel.forMale != null && this.payRollBandsModel.handicapped == true)
            || (this.payRollBandsModel.forMale != null && this.payRollBandsModel.isMarried == true)
            || (this.payRollBandsModel.handicapped == true && this.payRollBandsModel.isMarried == true)) {
            this.payRollBandsForm.controls["minAge"].setValue(null);
            this.payRollBandsForm.controls["maxAge"].setValue(null);
            this.payRollBandsForm.controls["forMale"].setValue(null);
            this.payRollBandsForm.controls["forFemale"].setValue(null);
            this.payRollBandsForm.controls["handicapped"].setValue(null);
            this.payRollBandsForm.controls["isMarried"].setValue(null);
            this.isAnyOperationIsInprogress = false;
            this.toastr.error(this.translateService.instant("PAYROLLBANDS.PLEASEENTERANYONEOFAGEORGENDERORHANDICAPPEDORMARRIED"));
        }
        else {
            this.payRollService.upsertPayRollBands(this.payRollBandsModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertPayRollBandsPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getParentPayRollBands();
                    this.getAllPayRollBands();
                }
                else {
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    deletePayRollBandsPopUpOpen(row, deletePayRollBandsPopUp) {
        this.payRollBandsModel = row;
        this.isPayRollBandsArchived = !this.isArchivedTypes;
        this.payRollBandsModel.isArchived = !this.isArchivedTypes;
        deletePayRollBandsPopUp.openPopover();
    }

    deletePayRollBands() {
        this.isAnyOperationIsInprogress = true;

        this.payRollService.upsertPayRollBands(this.payRollBandsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.deletePayRollBandsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollBands();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeletePayRollBandsDialog() {
        this.clearForm();
        this.deletePayRollBandsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    changeCountry(value, isChanged) {
        if (isChanged) {
            this.payRollBandsForm.controls['parentId'].setValue(null);
        }

        this.getParentTaxSlabsWithCountry(value)
    }

    getParentTaxSlabsWithCountry(countryId) {
        if (countryId != null) {
            this.parentPayRollBandsWithCountry = this.parentPayRollBands.filter(x => x.countryId == countryId);
        }
        else {
            this.parentPayRollBandsWithCountry = this.parentPayRollBands;
        }
    }

    checkValidations() {
        var payRollBand = this.payRollBandsForm.value;

        if ((payRollBand.toRange != null && payRollBand.fromRange > payRollBand.toRange) || (payRollBand.maxAge != null && payRollBand.minAge > payRollBand.maxAge)
            || (payRollBand.activeTo != null && new Date(payRollBand.activeFrom) > new Date(payRollBand.activeTo))) {
            this.isAnyOperationIsInprogress = true;
            this.isThereAnError = true;
            if ((payRollBand.toRange != null && payRollBand.fromRange > payRollBand.toRange)) {
                this.validationMessage = this.translateService.instant("TAXSLABS.FROMRANGESHOULDNOTBELESSTHANTORANGE");
            } else if (payRollBand.maxAge != null && payRollBand.minAge > payRollBand.maxAge) {
                this.validationMessage = this.translateService.instant("TAXSLABS.MINAGESHOULDNOTBELESSTHANMAXAGE");
            } else {
                this.validationMessage = this.translateService.instant("TAXSLABS.ACTIVEFROMSHOULDNOTBELESSTHANACTIVETO");
            }
        } else {
            this.isAnyOperationIsInprogress = false;
            this.isThereAnError = false;
        }
    }

    changeParent(value) {
        var country = this.payRollBandsForm.get('countryId').value;
        if (country == null) {
            this.payRollBandsForm.controls['parentId'].setValue(null);
            this.toastr.error(this.translateService.instant("PAYROLLBANDS.FIRSTSELECTCOUNTRYMESSAGE"));
        }
        else if (value == null || value == 0) {
            this.payRollBandsForm.controls["order"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.payRollBandsForm.get("order").updateValueAndValidity();
            this.payRollBandsForm.controls["activeFrom"].setValidators(Validators.compose([
                Validators.required
            ]));

            this.payRollBandsForm.get("activeFrom").updateValueAndValidity();

            this.payRollBandsForm.controls["payRollComponentId"].setValidators(Validators.compose([
                Validators.required
            ]));

            this.payRollBandsForm.get("payRollComponentId").updateValueAndValidity();

            this.payRollBandsForm.controls["percentage"].clearValidators();
            this.payRollBandsForm.get("percentage").updateValueAndValidity();

            this.payRollBandsForm.controls["fromRange"].clearValidators();
            this.payRollBandsForm.get("fromRange").updateValueAndValidity();
        }
        else {
            this.payRollBandsForm.controls["percentage"].setValidators(Validators.compose([
                Validators.required,
                Validators.max(100)
            ]));
            this.payRollBandsForm.get("percentage").updateValueAndValidity();

            this.payRollBandsForm.controls["fromRange"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.payRollBandsForm.get("fromRange").updateValueAndValidity();

            this.payRollBandsForm.controls["order"].clearValidators();
            this.payRollBandsForm.get("order").updateValueAndValidity();
            this.payRollBandsForm.controls["activeFrom"].clearValidators();
            this.payRollBandsForm.get("activeFrom").updateValueAndValidity();
            this.payRollBandsForm.controls["payRollComponentId"].clearValidators();
            this.payRollBandsForm.get("payRollComponentId").updateValueAndValidity();
        }
    }

    changeAge() {
        if (this.payRollBandsForm.get("minAge").value != null || this.payRollBandsForm.get("maxAge").value != null) {
            this.payRollBandsForm.controls["forMale"].setValue(null);
        }
    }

    changeHandicaped() {
        if (this.payRollBandsForm.get("handicapped").value == true) {
            this.payRollBandsForm.controls["forMale"].setValue(null);
        }
    }

    changeMarried() {
        if (this.payRollBandsForm.get("isMarried").value == true) {
            this.payRollBandsForm.controls["forMale"].setValue(null);
        }
    }
} 