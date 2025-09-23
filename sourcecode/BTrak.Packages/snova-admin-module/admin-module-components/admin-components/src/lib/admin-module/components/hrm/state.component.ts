import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { StateModel } from '../../models/hr-models/state-model';

@Component({
    selector: "app-fm-component-state",
    templateUrl: `state.component.html`

})

export class StateComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("statePopup") upsertStatePopover;
    @ViewChildren("deleteStatePopup") deleteStatePopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isThereAnError: boolean;
    validationMessage: any;
    isArchived = false;
    states: StateModel[];
    stateForm: FormGroup;
    stateModel: StateModel;
    stateId: string;
    stateName: string;
    isFiltersVisible: boolean;
    timeStamp: any;
    temp: any;
    searchText: string;
    isStateArchived: boolean;
    stateEdit: string;

    constructor(
        private translateService: TranslateService,
        private cdRef: ChangeDetectorRef,private hrManagement: HRManagementService,
        private snackbar: MatSnackBar) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getStates();
    }

    getStates() {
        this.isAnyOperationIsInprogress = true;
        const stateModel = new StateModel();
        stateModel.isArchived = this.isArchived;
        this.hrManagement.getStates(stateModel).subscribe((response: any) => {
            if (response.success === true) {
                this.states = response.data;
                this.temp = this.states;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createState(statePopup) {
        statePopup.openPopover();
        this.stateEdit = this.translateService.instant("STATE.ADDSTATE");
    }

    editState(row, statePopup) {
        this.stateForm.patchValue(row);
        this.stateId = row.stateId;
        statePopup.openPopover();
        this.stateEdit = this.translateService.instant("STATE.EDITSTATE");
        this.timeStamp = row.timeStamp;
    }

    closeStatePopup() {
        this.clearForm();
        this.deleteStatePopup.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.stateId = null;
        this.stateName = null;
        this.timeStamp = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.stateModel = null;
        this.searchText = null;
        this.stateForm = new FormGroup({
            stateName: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            )
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteState() {
        this.isAnyOperationIsInprogress = true;
        const stateModel = new StateModel();
        stateModel.stateId = this.stateId;
        stateModel.stateName = this.stateName;
        stateModel.timeStamp = this.timeStamp;
        stateModel.isArchived = this.isStateArchived;
        this.hrManagement.upsertState(stateModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteStatePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getStates();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    upsertState(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let state = new StateModel();
        state = this.stateForm.value;
        state.stateName = state.stateName.trim();
        state.stateId = this.stateId;
        state.timeStamp = this.timeStamp;
        this.hrManagement.upsertState(state).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertStatePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getStates();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeupsertStatePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertStatePopover.forEach((p) => p.closePopover());
    }

    closeStatePopupOpen() {
        this.clearForm();
        this.deleteStatePopup.forEach((p) => p.closePopover());
    }

    deleteStatePopupOpen(row, deleteStatePopup) {
        this.stateId = row.stateId;
        this.stateName = row.stateName;
        this.timeStamp = row.timeStamp;
        this.isStateArchived = !this.isArchived;
        deleteStatePopup.openPopover();
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter((states) => states.stateName.toLowerCase().indexOf(this.searchText) > -1);
        this.states = temp;
    }
    closeSearch() {
        this.filterByName(null);
    }
}
