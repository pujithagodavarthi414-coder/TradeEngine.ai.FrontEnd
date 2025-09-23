import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { HRManagementService } from '../../services/hr-management.service';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProfessionalTaxRanges } from '../../models/hr-models/professional-tax-ranges-model';
import * as _moment from 'moment';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Branch } from '../../models/branch';
import { ConstantVariables } from '../../helpers/constant-variables';
import { State } from '../../store/reducers';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-professionaltaxranges',
    templateUrl: './professionaltaxranges.component.html',
})

export class ProfessionaltaxrangesComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertPayGradePopUp") upsertPayGradePopover;
    @ViewChildren("deletePayGradePopUp") deletePayGradePopover;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getProfessionalTaxRanges();
        this.getAllBranches();
    }

    constructor(private store: Store<State>, private hrManagementService: HRManagementService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
        super();
        this.moment = _moment;
    }
    payGradeForm: FormGroup;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isFiltersVisible: boolean;
    isArchived: boolean = false;
    professionaTaxRanges: ProfessionalTaxRanges[];
    payGradeName: string;
    payGradeId: string;
    professionaTaxRange: ProfessionalTaxRanges;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    isPayGradeArchived: boolean = false;
    payGradeEdit: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isDuplicateValue: boolean;
    isNewRange: boolean;
    branches: Branch[];
    activeFrom: Date;
    activeTo: Date;
    minDate = new Date();
    moment: any;

    getProfessionalTaxRanges() {
        this.isAnyOperationIsInprogress = true;

        this.hrManagementService.getTaxRanges().subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;

                this.professionaTaxRanges = response.data;
                this.temp = this.professionaTaxRanges;
                this.filterTaxRanges();
                this.isAnyOperationIsInprogress = false;
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

    getAllBranches() {
        this.isAnyOperationIsInprogress = true;

        var hrBranchModel = new HrBranchModel();
        hrBranchModel.isArchived = this.isArchived;
        this.hrManagementService.getBranches(hrBranchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branches = response.data;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    filterTaxRanges() {

        this.professionaTaxRanges = this.temp.filter(tax => tax.isArchived == this.isArchived);

    }
    closeUpsertTaxRangePopup(formDirective: FormGroupDirective) {

        formDirective.resetForm();
        this.clearForm();

        this.upsertPayGradePopover.forEach((p) => p.closePopover());
    }

    closeDeleteTaxRangePopup() {
        this.isThereAnError = false;
        this.deletePayGradePopover.forEach((p) => p.closePopover());
    }


    createTaxRangePopupOpen(upsertPayGradePopUp) {
        this.isNewRange = true;
        this.isDuplicateValue = false;
        upsertPayGradePopUp.openPopover();
        this.payGradeEdit = this.translateService.instant('TAXRANGE.ADDPROFESSIONALTAXRANGE');
    }

    editTaxRangePopupOpen(row, upsertPayGradePopUp) {
        this.isNewRange = false;
        this.isDuplicateValue = false;
        this.payGradeForm.patchValue(row);
        this.payGradeId = row.id;
        // this.timeStamp = row.timeStamp;
        this.payGradeEdit = this.translateService.instant('TAXRANGE.EDITPROFESSIONALTAXRANGE');
        upsertPayGradePopUp.openPopover();
    }

    deleteTaxRangePopUpOpen(row, deletePayGradePopUp) {

        this.professionaTaxRange = new ProfessionalTaxRanges();
        this.professionaTaxRange.Id = row.id;
        this.professionaTaxRange.FromRange = row.fromRange;
        this.professionaTaxRange.ToRange = row.toRange;
        this.professionaTaxRange.TaxAmount = row.taxAmount;
        this.professionaTaxRange.activeFrom = row.activeFrom;
        this.professionaTaxRange.activeTo = row.activeTo;
        this.professionaTaxRange.IsArchived = !row.isArchived;
        this.professionaTaxRange.branchId = row.branchId;

        deletePayGradePopUp.openPopover();
    }

    upsertTaxRange(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.professionaTaxRange = this.payGradeForm.value;

        this.professionaTaxRange.Id = this.payGradeId;

        this.hrManagementService.upsertProfessionalTaxRanges(this.professionaTaxRange).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getProfessionalTaxRanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
               
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deletePayGrade() {
        this.isAnyOperationIsInprogress = true;
        this.hrManagementService.upsertProfessionalTaxRanges(this.professionaTaxRange).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getProfessionalTaxRanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    changeValue() {
        this.isDuplicateValue = false;
    }

    clearForm() {
        this.payGradeName = null;
        this.payGradeId = null;
        this.professionaTaxRange = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payGradeForm = new FormGroup({
            fromRange: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            toRange: new FormControl(null,
                Validators.compose([

                ])
            ),
            taxAmount: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null,
                Validators.compose([
                ])
            ),
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
        const temp = tempValues.filter(professionaTaxRange => (professionaTaxRange.fromRange == null ? null : professionaTaxRange.fromRange.toString().indexOf(this.searchText) > -1)
            || (professionaTaxRange.toRange == null ? null : professionaTaxRange.toRange.toString().indexOf(this.searchText) > -1)
            || (professionaTaxRange.taxAmount == null ? null : professionaTaxRange.taxAmount.toString().indexOf(this.searchText) > -1)
            || (professionaTaxRange.branchName == null ? null : professionaTaxRange.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (professionaTaxRange.activeFrom == null ? null : this.moment(professionaTaxRange.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (professionaTaxRange.activeTo == null ? null : this.moment(professionaTaxRange.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
        );
        this.professionaTaxRanges = temp;
    }

    closeSearch() {
        this.searchText = "";
        this.filterByName(null);
    }

}
