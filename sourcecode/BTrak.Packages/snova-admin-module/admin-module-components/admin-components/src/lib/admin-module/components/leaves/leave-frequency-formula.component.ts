import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LeaveFormulaModel } from '../../models/leaves-models/leave-formula-model';
import { LeavesManagementService } from '../../services/leaves-management.service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';

@Component({
    selector: "app-fm-component-leave-frequency-formula",
    templateUrl: `leave-frequency-formula.component.html`
})

export class LeaveFormulaComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteFormulaPopUp") deleteLeaveFormulaPopover;
    @ViewChildren("upsertFormulaPopUp") upsertLeaveFormulaPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    leaveFormulaForm: FormGroup;
    isFiltersVisible = false;
    isArchived = false;
    isThereAnError = false;
    leaveFormulaId: string;
    validationMessage: string;
    searchText: string;
    leaveFormula: LeaveFormulaModel;
    isAnyOperationIsInprogress = false;
    leaveFormulas: any;
    timeStamp: any;
    temp: any;
    noOfDays: number;
    noOfLeaves: number;
    salaryTypeId: string;
    formula: string;
    addOrEditFormulaTitle: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllLeaveFormulas();
    }
    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private leavesManagementService: LeavesManagementService) { super(); }

    getAllLeaveFormulas() {
        this.isAnyOperationIsInprogress = true;

        let leaveFormulaModel = new LeaveFormulaModel();
        leaveFormulaModel.isArchived = this.isArchived;

        this.leavesManagementService.getAllLeaveFormulas(leaveFormulaModel).subscribe((response: any) => {
            if (response.success == true) {
                this.leaveFormulas = response.data;
                this.temp = this.leaveFormulas;
                this.clearForm();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deleteFormulaPopUpOpen(row, deleteLeaveFormulaPopUp) {
        this.leaveFormulaId = row.leaveFormulaId;
        this.timeStamp = row.timeStamp;
        this.salaryTypeId = row.salaryTypeId;
        this.noOfLeaves = row.noOfLeaves;
        this.noOfDays = row.noOfDays;
        this.formula = row.formula;
        deleteLeaveFormulaPopUp.openPopover();
    }

    closeDeleteFormulaDialog() {
        this.clearForm();
        this.deleteLeaveFormulaPopover.forEach((p) => p.closePopover());
    }

    upsertFormula(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.leaveFormula = this.leaveFormulaForm.value;
        this.leaveFormula.leaveFormulaId = this.leaveFormulaId;
        this.leaveFormula.timeStamp = this.timeStamp;

        this.leaveFormula.formula = this.leaveFormula.noOfLeaves.toString() + "*" + this.leaveFormula.noOfDays.toString();
        this.leavesManagementService.upsertLeaveFormula(this.leaveFormula).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertLeaveFormulaPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllLeaveFormulas();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deleteFormula() {
        this.isAnyOperationIsInprogress = true;
        this.leaveFormula = new LeaveFormulaModel();
        this.leaveFormula.leaveFormulaId = this.leaveFormulaId;
        this.leaveFormula.noOfDays = this.noOfDays;
        this.leaveFormula.noOfLeaves = this.noOfLeaves;
        this.leaveFormula.salaryTypeId = this.salaryTypeId;
        this.leaveFormula.timeStamp = this.timeStamp;
        this.leaveFormula.formula = this.formula;
        this.leaveFormula.isArchived = !this.isArchived;

        this.leavesManagementService.upsertLeaveFormula(this.leaveFormula).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteLeaveFormulaPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllLeaveFormulas();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    editFormulaPopupOpen(row, upsertLeaveFormulaPopUp) {
        this.leaveFormulaForm.patchValue(row);
        this.leaveFormulaId = row.leaveFormulaId;
        this.timeStamp = row.timeStamp;
        this.formula = row.formula;
        this.addOrEditFormulaTitle = this.translateService.instant("LEAVEFORMULA.EDITLEAVEFORMULA");
        upsertLeaveFormulaPopUp.openPopover();
    }

    closeUpsertFormulaPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLeaveFormulaPopover.forEach((p) => p.closePopover());
    }

    createFormulaPopupOpen(upsertLeaveFormulaPopUp) {
        upsertLeaveFormulaPopUp.openPopover();
        this.addOrEditFormulaTitle = this.translateService.instant("LEAVEFORMULA.ADDLEAVEFORMULA");
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.leaveFormula = null;
        this.leaveFormulaId = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.formula = null;
        this.noOfDays = null;
        this.noOfLeaves = null;
        this.salaryTypeId = null;
        this.leaveFormulaForm = new FormGroup({
            noOfLeaves: new FormControl(null,
                Validators.compose([Validators.required, Validators.min(1)])),
            noOfDays: new FormControl(null,
                Validators.compose([Validators.required]))
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((leaveFormula) => (leaveFormula.noOfDays.toString().toLowerCase().indexOf(this.searchText) > -1) ||
            (leaveFormula.formula.toString().toLowerCase().indexOf(this.searchText) > -1) ||
            (leaveFormula.noOfLeaves.toString().toLowerCase().indexOf(this.searchText) > -1));
        this.leaveFormulas = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
