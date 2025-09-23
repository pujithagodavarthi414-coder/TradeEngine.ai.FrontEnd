import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TaxAllowanceModel } from '../models/TaxAllowanceModel';
import { PayRollService } from '../services/PayRollService'
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { PayRollComponentModel } from '../models/PayRollComponentModel';
import * as moment_ from 'moment';
const moment = moment_;
import { TaxAllowanceTypeModel } from '../models/taxallowancetypemodel';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';
import { CompanyRegistrationModel } from '../models/company-registration-model';

@Component({
    selector: 'app-taxallowance',
    templateUrl: `taxallowance.component.html`
})

export class TaxAllowanceComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertTaxAllowancePopUp") upsertTaxAllowancePopover;
    @ViewChildren("deleteTaxAllowancePopUp") deleteTaxAllowancePopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    taxAllowance: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    taxAllowanceName: string;
    timeStamp: any;
    searchText: string;
    taxAllowanceForm: FormGroup;
    taxAllowanceModel: TaxAllowanceModel;
    isTaxAllowanceArchived: boolean = false;
    isVariablePay: boolean;
    componentName: string;
    isArchivedTypes: boolean = false;
    isDeduction: boolean;
    taxAllowances: TaxAllowanceModel[];
    taxAllowanceId: string;
    taxAllowanceTypeId: string;
    isPercentage: boolean;
    maxAmount: number;
    percentageValue: number;
    parentId: string;
    payRollComponentId: string;
    componentId: string;
    toDate: Date;
    fromDate: Date;
    onlyEmployeeMaxAmount: number;
    lowestAmountOfParentSet: boolean;
    metroMaxPercentage: number;
    components: Component[];
    payRollComponents: PayRollComponentModel[];
    taxAllowanceTypes: TaxAllowanceTypeModel[];
    type: number;
    eligibleToUpdate: boolean;
    parentTaxAllowances: any;
    branchList$: Observable<Branch[]>;
    countryId: string;
    parentTaxAllowancesWithCountry: TaxAllowanceTypeModel[];
    countries: any;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllTaxAllowanceTypes();
        this.getComponents();
        this.getCountries();
        this.getPayRollComponents();
        this.getAllTaxAllowances();
        this.getParentTaxAllowances();
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private translateService: TranslateService, private toaster: ToastrService) { super() }

    getCountries() {
        var companymodel = new CompanyRegistrationModel();
        companymodel.isArchived = false;
        this.payRollService.getCountries(companymodel).subscribe((response: any) => {
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

    getComponents() {
        var payRollTemplateModel = new PayRollTemplateModel();
        payRollTemplateModel.isArchived = this.isArchivedTypes;

        this.payRollService.getAllComponents(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.components = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }


    getParentTaxAllowances() {
        this.isAnyOperationIsInprogress = true;
        var taxAllowanceModel = new TaxAllowanceModel();
        taxAllowanceModel.isArchived = this.isArchivedTypes;
        taxAllowanceModel.isMainPage = true;

        this.payRollService.getAllTaxAllowances(taxAllowanceModel).subscribe((response: any) => {
            if (response.success == true) {
                this.parentTaxAllowances = response.data.filter(x => x.parentId == null);
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    changeParent() {
        var branch = this.taxAllowanceForm.get('countryId').value;
        if (branch == null) {
            this.taxAllowanceForm.controls['parentId'].setValue(null);
            this.toastr.error(this.translateService.instant("TAXSLABS.FIRSTSELECTCOUNTRYMESSAGE"));
        }
    }

    changeCountry(value,ischanged) {
        if(ischanged){
            this.taxAllowanceForm.controls['parentId'].setValue(null);
        }
        
        this.getParentTaxAllowancesWithCountry(value)
    }

    getParentTaxAllowancesWithCountry(countryId) {
        if (countryId != null) {
            this.parentTaxAllowancesWithCountry = this.parentTaxAllowances.filter(x => x.countryId == countryId);
        }
        else {
            this.parentTaxAllowancesWithCountry = this.parentTaxAllowances;
        }

    }

    getAllTaxAllowanceTypes() {
        var payRollTemplateModel = new PayRollTemplateModel();
        payRollTemplateModel.isArchived = this.isArchivedTypes;

        this.payRollService.getAllTaxAllowanceTypes(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.taxAllowanceTypes = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getPayRollComponents() {
        var payRollComponentModel = new PayRollComponentModel();
        payRollComponentModel.isArchived = this.isArchivedTypes;
        payRollComponentModel.isVisible = true;

        this.payRollService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollComponents = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }


    getAllTaxAllowances() {
        this.isAnyOperationIsInprogress = true;
        var taxAllowanceModel = new TaxAllowanceModel();
        taxAllowanceModel.isArchived = this.isArchivedTypes;
        taxAllowanceModel.isMainPage = true;
        this.payRollService.getAllTaxAllowances(taxAllowanceModel).subscribe((response: any) => {
            if (response.success == true) {
                this.taxAllowances = response.data;
                this.temp = this.taxAllowances;
                this.clearForm();
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

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.taxAllowanceId = null;
        this.taxAllowanceName = null;
        this.taxAllowanceTypeId = null
        this.isPercentage = null
        this.maxAmount = null
        this.percentageValue = null
        this.parentId = null
        this.payRollComponentId = null
        this.componentId = null
        this.toDate = null
        this.fromDate = null
        this.onlyEmployeeMaxAmount = null
        this.lowestAmountOfParentSet = null
        this.metroMaxPercentage = null
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.taxAllowanceForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            taxAllowanceTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isPercentage: new FormControl(null,
            ),
            maxAmount: new FormControl(null,
            ),
            percentageValue: new FormControl(null,
                Validators.compose([
                    Validators.max(100)
                ])
            ),
            parentId: new FormControl(null,
            ),
            payRollComponentId: new FormControl(null,
            ),
            componentId: new FormControl(null,
            ),
            toDate: new FormControl(null,
            ),
            fromDate: new FormControl(null,
            ),
            onlyEmployeeMaxAmount: new FormControl(null,
            ),
            lowestAmountOfParentSet: new FormControl(null,
            ),
            metroMaxPercentage: new FormControl(null,
            ),
            type: new FormControl(null,
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
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

        const temp = this.temp.filter(taxAllowances =>
            (taxAllowances.name == null ? null : taxAllowances.name.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.taxAllowanceTypeName == null ? null : taxAllowances.taxAllowanceTypeName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.componentName == null ? null : taxAllowances.componentName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.countryName == null ? null : taxAllowances.countryName.toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.payRollComponentName == null ? null : taxAllowances.payRollComponentName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.maxAmount == null ? null : taxAllowances.maxAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.percentageValue == null ? null : taxAllowances.percentageValue.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.onlyEmployeeMaxAmount == null ? null : taxAllowances.onlyEmployeeMaxAmount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.metroMaxPercentage == null ? null : taxAllowances.metroMaxPercentage.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.parentName == null ? null : taxAllowances.parentName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.fromDate == null ? null : moment(taxAllowances.fromDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxAllowances.toDate == null ? null : moment(taxAllowances.toDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxAllowances.lowestAmountOfParentSet == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxAllowances.lowestAmountOfParentSet == false : null)
        );

        this.taxAllowances = temp;
    }

    editTaxAllowancePopupOpen(row, upsertTaxAllowancePopUp) {
        this.taxAllowanceForm.patchValue(row);
        this.taxAllowanceId = row.taxAllowanceId;
        this.timeStamp = row.timeStamp;
        if (row.payRollComponentId)
            this.type = 1;
        if (row.componentId)
            this.type = 0;
        this.changeCountry(row.countryId,false);
        this.taxAllowance = 'TAXALLOWANCE.EDITTAXALLOWANCE';
        upsertTaxAllowancePopUp.openPopover();
    }


    closeUpsertTaxAllowancePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTaxAllowancePopover.forEach((p) => p.closePopover());
    }

    createTaxAllowancePopupOpen(upsertTaxAllowancePopUp) {
        this.clearForm();
        this.changeCountry(null,false);
        upsertTaxAllowancePopUp.openPopover();
        this.taxAllowance = 'TAXALLOWANCE.ADDTAXALLOWANCE';
    }

    upsertTaxAllowance(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.taxAllowanceModel = this.taxAllowanceForm.value;

        if (this.taxAllowanceModel.parentId == "0")
            this.taxAllowanceModel.parentId = null;

        if (this.taxAllowanceModel.parentId != null)
            this.taxAllowanceModel.lowestAmountOfParentSet = false;

        if (this.taxAllowanceModel.type == 0) {
            this.taxAllowanceModel.payRollComponentId = null;
        }
        else if (this.taxAllowanceModel.type == 1) {
            this.taxAllowanceModel.componentId = null;
        }

        if (this.taxAllowanceId) {
            this.taxAllowanceModel.taxAllowanceId = this.taxAllowanceId;
            this.taxAllowanceModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertTaxAllowance(this.taxAllowanceModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTaxAllowancePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTaxAllowances();
                this.getParentTaxAllowances();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
            this.isAnyOperationIsInprogress = false;
        });
    }
    deleteTaxAllowancePopUpOpen(row, deleteTaxAllowancePopUp) {
        this.taxAllowanceId = row.taxAllowanceId;
        this.taxAllowanceId = row.taxAllowanceId;
        this.taxAllowanceName = row.name;
        this.taxAllowanceTypeId = row.taxAllowanceTypeId;
        this.isPercentage = row.isPercentage;
        this.timeStamp = row.timeStamp;
        this.maxAmount = row.maxAmount;
        this.percentageValue = row.percentageValue;
        this.parentId = row.parentId;
        this.payRollComponentId = row.payRollComponentId;
        this.componentId = row.componentId;
        this.fromDate = row.fromDate;
        this.toDate = row.toDate;
        this.onlyEmployeeMaxAmount = row.onlyEmployeeMaxAmount;
        this.lowestAmountOfParentSet = row.lowestAmountOfParentSet;
        this.metroMaxPercentage = row.metroMaxPercentage;
        this.countryId = row.countryId;
        this.isTaxAllowanceArchived = !this.isArchivedTypes;
        deleteTaxAllowancePopUp.openPopover();
    }

    deleteTaxAllowance() {
        this.isAnyOperationIsInprogress = true;
        this.taxAllowanceModel = new TaxAllowanceModel();
        this.taxAllowanceModel.taxAllowanceId = this.taxAllowanceId;
        this.taxAllowanceModel.name = this.taxAllowanceName;
        this.taxAllowanceModel.taxAllowanceTypeId = this.taxAllowanceTypeId;
        this.taxAllowanceModel.isPercentage = this.isPercentage;
        this.taxAllowanceModel.timeStamp = this.timeStamp;
        this.taxAllowanceModel.maxAmount = this.maxAmount;
        this.taxAllowanceModel.percentageValue = this.percentageValue;
        this.taxAllowanceModel.parentId = this.parentId;
        this.taxAllowanceModel.payRollComponentId = this.payRollComponentId;
        this.taxAllowanceModel.componentId = this.componentId;
        this.taxAllowanceModel.fromDate = this.fromDate;
        this.taxAllowanceModel.toDate = this.toDate;
        this.taxAllowanceModel.onlyEmployeeMaxAmount = this.onlyEmployeeMaxAmount;
        this.taxAllowanceModel.lowestAmountOfParentSet = this.lowestAmountOfParentSet;
        this.taxAllowanceModel.metroMaxPercentage = this.metroMaxPercentage;
        this.taxAllowanceModel.countryId = this.countryId;
        this.taxAllowanceModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertTaxAllowance(this.taxAllowanceModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTaxAllowancePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTaxAllowances();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toaster.error(this.validationMessage);
            }
        });
    }


    closeDeleteTaxAllowanceDialog() {
        this.clearForm();
        this.deleteTaxAllowancePopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    changeType(value) {
        if (value == 0) {
            this.type = 0;
            this.taxAllowanceForm.controls["componentId"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxAllowanceForm.get("componentId").updateValueAndValidity();

            this.taxAllowanceForm.controls["payRollComponentId"].clearValidators();
            this.taxAllowanceForm.get("payRollComponentId").updateValueAndValidity();
        }
        else if (value = 1) {
            this.type = 1;
            this.taxAllowanceForm.controls["payRollComponentId"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxAllowanceForm.get("payRollComponentId").updateValueAndValidity();

            this.taxAllowanceForm.controls["componentId"].clearValidators();
            this.taxAllowanceForm.get("componentId").updateValueAndValidity();
        }
    }

    changePercentageValue(value) {
        if (value) {
            this.taxAllowanceForm.controls["type"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxAllowanceForm.get("type").updateValueAndValidity();
        }
        else {
            this.type = null
            this.taxAllowanceForm.controls['type'].setValue(null);
            this.taxAllowanceForm.controls['componentId'].setValue(null);
            this.taxAllowanceForm.controls['payRollComponentId'].setValue(null);
            this.taxAllowanceForm.controls["type"].clearValidators();
            this.taxAllowanceForm.get("type").updateValueAndValidity();
            this.taxAllowanceForm.controls["componentId"].clearValidators();
            this.taxAllowanceForm.get("componentId").updateValueAndValidity();
            this.taxAllowanceForm.controls["payRollComponentId"].clearValidators();
            this.taxAllowanceForm.get("payRollComponentId").updateValueAndValidity();
        }
    }
} 