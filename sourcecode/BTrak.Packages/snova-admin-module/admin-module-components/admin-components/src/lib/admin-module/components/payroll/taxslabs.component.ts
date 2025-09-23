import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HRManagementService } from '../../services/hr-management.service';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TaxSlabs } from '../../models/hr-models/tax-slabs-model';
import * as _moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { State } from '../../store/reducers';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { PayRollTemplateModel, Branch } from '../../models/branch';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { CountryModel } from '../../models/hr-models/country-model';
import { TaxCalculationTypeModel } from '../../models/taxcalculationtypemodel';

@Component({
    selector: 'app-taxslabs',
    templateUrl: './taxslabs.component.html',
})
export class TaxslabsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayGradePopUp") upsertPayGradePopover;
    @ViewChildren("deletePayGradePopUp") deletePayGradePopover;
    @ViewChild("allSelected") private allSelected: MatOption;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getUserCountry();
        this.getCountries();
        this.getTaxSlabs();
        this.getParentTaxSlabs();
        this.getTaxCalculationTypes();
        this.getPayrolltemplates();
    }

    constructor(private store: Store<State>, private hrManagementService: HRManagementService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef,
        private payRollService: MasterDataManagementService, private toastr: ToastrService) {
        super();
        this.moment = _moment;
    }
    taxSlabForm: FormGroup;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    taxSlabs: TaxSlabs[];
    payGradeName: string;
    taxSlabId: string;
    taxSlab: TaxSlabs;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    isPayGradeArchived: boolean = false;
    roleFeaturesIsInProgress$: Observable<boolean>;
    payGradeEdit: string;
    payRollTemplates: PayRollTemplateModel[];
    payRollTemplate: PayRollTemplateModel;
    ismale: boolean = true;
    parentTaxSlabs: TaxSlabs[];
    branchList$: Observable<Branch[]>;
    countryId: string;
    selectedPayRollTemplates: string;
    dropDownPayRollTemplates: PayRollTemplateModel[];
    showIsFlate: boolean;
    countryName: string;
    branches: any;
    moment:any;
    parentTaxSlabsWithBranch: TaxSlabs[];
    countries: any;
    taxCalCulationTypesWithCountry: TaxCalculationTypeModel[];
    taxCalculationTypes: TaxCalculationTypeModel[];

    getCountries() {
        this.isAnyOperationIsInprogress = true;
        const countryModel = new CountryModel();
        countryModel.isArchived = this.isArchived;
        this.hrManagementService.getCountries(countryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.countries = response.data;
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getUserCountry() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.getUserCountry().subscribe((response: any) => {
            if (response.success == true) {
                this.countryName = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getTaxSlabs() {
        this.isAnyOperationIsInprogress = true;
        var taxSlabs = new TaxSlabs();
        this.hrManagementService.getTaxSlabs(taxSlabs).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.taxSlabs = response.data;

                this.temp = this.taxSlabs;
                this.filterSlabs();
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

    getTaxCalculationTypes() {
        this.isAnyOperationIsInprogress = true;
        var taxCalculationTypeModel = new TaxCalculationTypeModel();
        taxCalculationTypeModel.isArchived = false;
        this.payRollService.getTaxCalculationTypes(taxCalculationTypeModel).subscribe((response: any) => {
            this.taxCalculationTypes = [];
            if (response.success == true) {
                this.taxCalculationTypes = response.data;
                this.taxCalCulationTypesWithCountry = this.taxCalculationTypes;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    changeCountry(value,isChanged){
        if(isChanged){
            this.taxSlabForm.controls['parentId'].setValue(null);

            let countryName = null;
            countryName =  this.countries.find(x=> x.countryId == value).countryName;
            if(countryName == 'India'){
                this.showIsFlate = true;
            }
            else{
                this.showIsFlate = false;
            }
        }
       
        this.getParentTaxSlabsWithCountry(value);
        this.getTaxCalCulationTypesWithCountry(value);
    }

    getParentTaxSlabsWithCountry(countryId){
        if(countryId != null){
            this.parentTaxSlabsWithBranch = this.parentTaxSlabs.filter(x => x.countryId == countryId);
        }
        else{
            this.parentTaxSlabsWithBranch = this.parentTaxSlabs;
        }
    }

    getTaxCalCulationTypesWithCountry(countryId){
        if(countryId != null && this.taxCalculationTypes.length > 0){
            this.taxCalCulationTypesWithCountry = this.taxCalculationTypes.filter(x => x.countryId == countryId);
        }
        else{
            this.taxCalCulationTypesWithCountry = this.taxCalculationTypes;
        }
    }

    getParentTaxSlabs() {
        this.isAnyOperationIsInprogress = true;
        var taxSlabs = new TaxSlabs();
        this.hrManagementService.getTaxSlabs(taxSlabs).subscribe((response: any) => {
            if (response.success == true) {
                this.parentTaxSlabs = response.data.filter(x => x.parentId == null && x.isArchived != true);
                this.parentTaxSlabsWithBranch = this.parentTaxSlabs;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterSlabs() {
        this.taxSlabs = this.temp.filter(slab => slab.isArchived == this.isArchived);
    }

    closeUpsertTaxSlabsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayGradePopover.forEach((p) => p.closePopover());
    }

    closeDeleteTaxSlabDialog() {
        this.isThereAnError = false;
        this.deletePayGradePopover.forEach((p) => p.closePopover());
    }

    createTaxSlabPopupOpen(upsertPayGradePopUp) {
        this.showIsFlate = false;
        this.changeCountry(null,false);
        upsertPayGradePopUp.openPopover();
        this.payGradeEdit = this.translateService.instant("TAXSLABS.ADDTAXSLAB");
    }

    editTaxSlabPopupOpen(row, upsertPayGradePopUp) {
        this.taxSlabId = row.taxSlabId;
        this.timeStamp = row.timeStamp;
        this.taxSlab = row;
        
        this.changeCountry(row.countryId,false);
        if (row.countryName == 'India') {
            this.showIsFlate = true;
        }
        else {
            this.showIsFlate = false;
        }
        this.taxSlabForm.patchValue(row);

        if(row.forMale == true){
            this.taxSlabForm.controls["forMale"].setValue("true");
        }
        else if(row.forFemale == true){
            this.taxSlabForm.controls["forMale"].setValue("false");
        }
       
        this.changeParent(row.parentId, upsertPayGradePopUp);

        this.payGradeEdit = this.translateService.instant("TAXSLABS.EDITTAXSLAB");

    }

    deleteTaxSlabPopUpOpen(row, deletePayGradePopUp) {
        this.taxSlab = row;

        this.taxSlab.IsArchived = !row.isArchived;

        deletePayGradePopUp.openPopover();
    }

    upsertTaxSlab(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.taxSlab = this.taxSlabForm.value;
        if(this.taxSlabId){
            this.taxSlab.taxSlabId = this.taxSlabId;
            this.taxSlab.timeStamp = this.timeStamp;
        }

        if(this.taxSlabForm.value.forMale == "true"){
            this.taxSlab.forMale = true;
            this.taxSlab.forFemale = false;
        }
        else if(this.taxSlabForm.value.forMale == "false"){
            this.taxSlab.forFemale = true;
            this.taxSlab.forMale = false;
        }
        else{
            this.taxSlab.forFemale = null;
            this.taxSlab.forMale = null;
        }
        
        if (this.taxSlab.parentId == '0') {
            this.taxSlab.parentId = null;
        }
        if (this.taxSlab.parentId != null) {
            this.taxSlab.order = null;
            this.taxSlab.minAge = null;
            this.taxSlab.maxAge = null;
            this.taxSlab.forMale = null;
            this.taxSlab.forFemale = null;
            this.taxSlab.handicapped = null;
            this.taxSlab.activeFrom = null;
            this.taxSlab.activeTo = null;
            this.taxSlab.payRollTemplateIds = null;
            this.taxSlab.isFlatRate = false;
        }
        if (this.taxSlab.parentId == null) {
            this.taxSlab.fromRange = null;
            this.taxSlab.toRange = null;
            this.taxSlab.taxPercentage = null;
            this.taxSlab.payrollTemplateId = null;
        }

        if (((this.taxSlab.minAge != null || this.taxSlab.maxAge != null) && this.taxSlab.handicapped == true)
            || ((this.taxSlab.minAge != null || this.taxSlab.maxAge != null) && this.taxSlab.forMale != null)
            || (this.taxSlab.forMale != null && this.taxSlab.handicapped == true)) {
            this.taxSlabForm.controls["minAge"].setValue(null);
            this.taxSlabForm.controls["maxAge"].setValue(null);
            this.taxSlabForm.controls["forMale"].setValue(null);
            this.taxSlabForm.controls["handicapped"].setValue(null);
            this.isAnyOperationIsInprogress = false;
            this.toastr.error(this.translateService.instant("TAXSLABS.PLEASEENTERANYONEOFAGEORGENDERORHANDICAPPED"));
        }
        else {
            this.hrManagementService.upsertTaxSlabs(this.taxSlab).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertPayGradePopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getParentTaxSlabs();
                    this.getTaxSlabs();
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

    deleteTaxSlab() {
        this.isAnyOperationIsInprogress = true;

        this.hrManagementService.upsertTaxSlabs(this.taxSlab).subscribe((response: any) => {
            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.deletePayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getTaxSlabs();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    getPayrolltemplates() {
        var payRollTemplateModel = new PayRollTemplateModel();
        this.payRollService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollTemplates = response.data;
                this.dropDownPayRollTemplates = response.data;
            }
            else {
            }
        });
    }

    clearForm() {
        this.payGradeName = null;
        this.taxSlabId = null;
        this.taxSlab = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.selectedPayRollTemplates = null;
        this.taxSlabForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            fromRange: new FormControl(null,
            ),
            toRange: new FormControl(null,
            ),
            taxPercentage: new FormControl(null,
            ),
            activeFrom: new FormControl(null,
            ),
            activeTo: new FormControl(null,
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
            parentId: new FormControl(null,
            ),
            order: new FormControl(null,
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isFlatRate: new FormControl(null
            ),
            taxCalculationTypeId: new FormControl(null
            )
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        debugger;
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const tempValues = this.temp.filter(tax => tax.isArchived == this.isArchived);
        const temp = tempValues.filter((taxSlab => (((taxSlab.name.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.parentName == null ? null : taxSlab.parentName.toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.branchName == null ? null : taxSlab.branchName.toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.order == null ? null : taxSlab.order.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.toRange == null ? null : taxSlab.toRange.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.fromRange == null ? null : taxSlab.fromRange.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.taxPercentage == null ? null : taxSlab.taxPercentage.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.activeFrom != null && this.moment(taxSlab.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.activeTo != null && this.moment(taxSlab.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (taxSlab.minAge != null && taxSlab.minAge.toString().toLowerCase().indexOf(this.searchText) > -1))
            || (taxSlab.maxAge != null && taxSlab.maxAge.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('male'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxSlab.forMale == true :
                ('female'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxSlab.forMale != true : null)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxSlab.handicapped == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? taxSlab.handicapped != true : null) && taxSlab.isArchived == this.isArchived)));
        this.taxSlabs = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.filterByName(null);
    }

    checkValidations() {
        var taxrange = this.taxSlabForm.value;

        if ((taxrange.toRange != null && taxrange.fromRange > taxrange.toRange) || (taxrange.maxAge != null && taxrange.minAge > taxrange.maxAge) || (taxrange.activeTo != null && new Date(taxrange.activeFrom) > new Date(taxrange.activeTo))) {
            this.isAnyOperationIsInprogress = true;
            this.isThereAnError = true;
            if ((taxrange.toRange != null && taxrange.fromRange > taxrange.toRange)) {
                this.validationMessage = this.translateService.instant("TAXSLABS.FROMRANGESHOULDNOTBELESSTHANTORANGE");
            } else if (taxrange.maxAge != null && taxrange.minAge > taxrange.maxAge) {
                this.validationMessage = this.translateService.instant("TAXSLABS.MINAGESHOULDNOTBELESSTHANMAXAGE");
            } else {
                this.validationMessage = this.translateService.instant("TAXSLABS.ACTIVEFROMSHOULDNOTBELESSTHANACTIVETO");
            }
        } else {
            this.isAnyOperationIsInprogress = false;
            this.isThereAnError = false;
        }
    }
    
    changeTaxCalCulationType(){
        var country =  this.taxSlabForm.get('countryId').value;
        if(country == null){
            this.taxSlabForm.controls['parentId'].setValue(null);
            this.toastr.error(this.translateService.instant("TAXSLABS.FIRSTSELECTCOUNTRYMESSAGE"));
        }
    }

    changeParent(value, upsertPayGradePopUp) {
        var branch =  this.taxSlabForm.get('countryId').value;
        if(branch == null){
            this.taxSlabForm.controls['parentId'].setValue(null);
            this.toastr.error(this.translateService.instant("TAXSLABS.FIRSTSELECTCOUNTRYMESSAGE"));
        }
        else if (value == null || value == 0) {
            
            this.taxSlabForm.controls["order"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxSlabForm.controls["activeFrom"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxSlabForm.controls["taxCalculationTypeId"].setValidators(Validators.compose([
                Validators.required
            ]));

            this.taxSlabForm.get("order").updateValueAndValidity();
            this.taxSlabForm.get("activeFrom").updateValueAndValidity();
            this.taxSlabForm.get("taxCalculationTypeId").updateValueAndValidity();

            this.taxSlabForm.controls["taxPercentage"].clearValidators();
            this.taxSlabForm.get("taxPercentage").updateValueAndValidity();

            this.taxSlabForm.controls["fromRange"].clearValidators();
            this.taxSlabForm.get("fromRange").updateValueAndValidity();
        }
        else {
            this.taxSlabForm.controls["taxPercentage"].setValidators(Validators.compose([
                Validators.required,
                Validators.max(100)
            ]));
            this.taxSlabForm.get("taxPercentage").updateValueAndValidity();

            this.taxSlabForm.controls["fromRange"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.taxSlabForm.get("fromRange").updateValueAndValidity();

            this.taxSlabForm.controls["order"].clearValidators();
            this.taxSlabForm.get("order").updateValueAndValidity();
            this.taxSlabForm.controls["activeFrom"].clearValidators();
            this.taxSlabForm.get("activeFrom").updateValueAndValidity();
            this.taxSlabForm.controls["taxCalculationTypeId"].clearValidators();
            this.taxSlabForm.get("taxCalculationTypeId").updateValueAndValidity();
        }
        if (upsertPayGradePopUp) {
            upsertPayGradePopUp.openPopover();
        }
    }

    changeAge() {
        if (this.taxSlabForm.get("minAge").value != null || this.taxSlabForm.get("maxAge").value != null) {
            this.taxSlabForm.controls["forMale"].setValue(null);
        }
    }

    changeHandicaped() {
        if (this.taxSlabForm.get("handicapped").value == true) {
            this.taxSlabForm.controls["forMale"].setValue(null);
        }
    }

    // togglePayRollTemplatePerOne() {
    //     if (this.allSelected.selected) {
    //         this.allSelected.deselect();
    //         return false;
    //     }
    //     if (this.taxSlabForm.get("payRollTemplateIds").value.length === this.payRollTemplates.length) {
    //         this.allSelected.select();
    //     }
    //     this.getPayRollTemplatesList();
    // }

    // toggleAllPayRollTemplatesSelected() {
    //     if (this.allSelected.selected) {
    //         this.taxSlabForm.get("payRollTemplateIds").patchValue([
    //             ...this.payRollTemplates.map((item) => item.payRollTemplateId),
    //             0
    //         ]);
    //     } else {
    //         this.taxSlabForm.get("payRollTemplateIds").patchValue([]);
    //     }
    //     this.getPayRollTemplatesList();
    // }

    // getPayRollTemplatesList() {
    //     const payRollTemplateIds = this.taxSlabForm.get("payRollTemplateIds").value;
    //     const index = payRollTemplateIds.indexOf(0);
    //     if (index > -1) {
    //         payRollTemplateIds.splice(index, 1);
    //     }
    //     const payRollTemplates = this.payRollTemplates;
    //     // tslint:disable-next-line: only-arrow-functions
    //     const payRollTemplatesList = _.filter(payRollTemplates, function (x) {
    //         return payRollTemplateIds.toString().includes(x.payRollTemplateId);
    //     })
    //     const employmentStatusNames = payRollTemplatesList.map((x) => x.payRollName);
    //     this.selectedPayRollTemplates = employmentStatusNames.toString();
    // }
}
