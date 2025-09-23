import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { State, orderBy } from "@progress/kendo-data-query";
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { InductionModel } from '../../models/induction.model';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { EmployeeListService } from '../../services/employee-list.service';
import './../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-induction-configuration",
    templateUrl: `induction-configuration.component.html`

})

export class InductionConfigurationComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Input() isForDialog = false;
    @ViewChildren("deleteInductionPopUp") deleteInductionPopover;
    @ViewChildren("upsertInductionPopUp") upsertInductionPopover;

    masterDataForm: FormGroup;
    isAnyOperationIsInprogress = false;
    inductionId: string;
    isShow: boolean;
    isThereAnError = false;
    inductionName: string;
    validationMessage: string;
    inductionModel: InductionModel;
    filteredList: InductionModel[];
    InductionForm: FormGroup;
    inductions: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    temp: any;
    searchText: string;
    roleFeaturesIsInProgress$: Observable<boolean>;
    Inductiontype: string;
    pagable: boolean;

    constructor(
        private store: Store<State>, private cdRef: ChangeDetectorRef, private translateService: TranslateService, private employeeService: EmployeeListService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllInductions();
        //this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
    }

    getAllInductions() {
        this.state.skip = 0;
        this.state.take = 10;
        this.searchText = null;
        this.isAnyOperationIsInprogress = true;
        const inductionModel = new InductionModel();
        this.employeeService.getAllInductionConfigurations(inductionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = response.data;
                this.filteredList = response.data;
                this.inductions = {
                    data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
                    total: this.temp.length
                }
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        let inductionsList = this.filteredList;
        if (this.state.sort) {
            inductionsList = orderBy(this.filteredList, this.state.sort);
        }
        this.inductions = {
            data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    deleteInductionPopUpOpen(row, deleteInductionPopUp) {
        this.inductionId = row.inductionId;
        this.inductionName = row.inductionName;
        this.isShow = row.isShow;
        deleteInductionPopUp.openPopover();
    }

    closeDeleteInductionPopUp() {
        this.clearForm();
        this.deleteInductionPopover.forEach((p) => p.closePopover());
    }

    deleteInduction() {
        this.isAnyOperationIsInprogress = true;
        this.inductionModel = new InductionModel();
        this.inductionModel.inductionId = this.inductionId;
        this.inductionModel.isShow = this.isShow;
        this.inductionModel.inductionName = this.inductionName;
        this.inductionModel.isArchived = true;
        this.employeeService.upsertInductionConfiguration(this.inductionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteInductionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllInductions();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeUpsertInductionPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertInductionPopover.forEach((p) => p.closePopover());
    }

    cancelDeleteInduction() {
        this.clearForm();
        this.deleteInductionPopover.forEach((p) => p.closePopover());
    }

    editInductionPopupOpen(row, upsertInductionPopUp) {
        this.InductionForm.patchValue(row);
        this.inductionId = row.inductionId;
        this.Inductiontype = this.translateService.instant("INDUCTION.EDITINDUCTIONCONFIGURATION");
        this.isShow = row.isShow;
        upsertInductionPopUp.openPopover();
    }

    createInductionPopupOpen(upsertInductionPopUp) {
        upsertInductionPopUp.openPopover();
        this.Inductiontype = this.translateService.instant("INDUCTION.ADDINDUCTIONCONFIGURATION");
    }

    upsertInduction(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.inductionModel = this.InductionForm.value;
        this.inductionModel.inductionName = this.inductionModel.inductionName.trim();
        this.inductionModel.isShow = this.isShow;
        this.inductionModel.inductionId = this.inductionId;
        this.employeeService.upsertInductionConfiguration(this.inductionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertInductionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllInductions();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });
    }

    clearForm() {
        this.inductionId = null;
        this.inductionName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.inductionModel = null;
        this.validationMessage = null;
        this.searchText = null;
        this.isShow = false;
        this.InductionForm = new FormGroup({
            inductionName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        this.filteredList = this.temp.filter((induction) => induction.inductionName.toLowerCase().indexOf(this.searchText) > -1);
        let inductionsList = this.filteredList;
        if (this.state.sort) {
            inductionsList = orderBy(this.filteredList, this.state.sort);
        }
        this.inductions = {
            data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.filteredList.length
        }
    }

    closeSearch() {
        this.filterByName(null);
    }
}
