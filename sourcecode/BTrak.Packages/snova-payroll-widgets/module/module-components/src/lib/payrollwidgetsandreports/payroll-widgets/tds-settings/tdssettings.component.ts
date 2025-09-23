import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TdsSettingsModel } from '../../models/tdssettingsmodel';
import { PayRollService } from '../../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { PayRollManagementState } from '../../store/reducers/index';
import { LoadBranchTriggered } from '../../store/actions/branch.actions';
import { Branch } from '../../models/branch';
import * as branchReducer from '../../store/reducers/index';

@Component({
    selector: 'app-tdssettings',
    templateUrl: `tdssettings.component.html`
})

export class TdsSettingsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertTdsSettingsPopUp") upsertTdsSettingsPopover;
    @ViewChildren("deleteTdsSettingsPopUp") deleteTdsSettingsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    tdsSettings: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    tdsSettingsName: string;
    timeStamp: any;
    searchText: string;
    tdsSettingsForm: FormGroup;
    tdsSettingsModel: TdsSettingsModel;
    isTdsSettingsArchived: boolean = false;
    isVariablePay: boolean;
    branchId: string;
    isArchivedTypes: boolean = false;
    isTdsRequired: boolean;
    company: string;
    tdsSettingsId: string;
    employeeContributionPercentage: number;
    employerContributionPercentage: number;
    relatedToContributionPercentage: boolean;
    isVisible: boolean;
    branchList$: Observable<Branch[]>;
    
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllBranches();
        this.getAllTdsSettings();
        
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,private toastr: ToastrService) { super() }


    getAllTdsSettings() {
        this.isAnyOperationIsInprogress = true;
        var tdsSettingsModel = new TdsSettingsModel();
        tdsSettingsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllTdsSettings(tdsSettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.company = response.data;
                this.temp = this.company;
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
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.tdsSettingsId = null;
        this.tdsSettingsName = null;
        this.branchId = null;
        this.isTdsRequired = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.tdsSettingsForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isTdsRequired: new FormControl(null,
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

        const temp = this.temp.filter(tdsSettings => 
               (tdsSettings.branchName == null ? null : tdsSettings.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1)  ? tdsSettings.isTdsRequired == true :
                    ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? tdsSettings.isTdsRequired == false: null)
            );

        this.company = temp;
    }

    editTdsSettingsPopupOpen(row, upsertTdsSettingsPopUp) {
        this.tdsSettingsForm.patchValue(row);
        this.tdsSettingsId = row.tdsSettingsId;
        this.timeStamp = row.timeStamp;
        this.tdsSettings = 'TDSSETTINGS.EDITTDSSETTINGS';
        upsertTdsSettingsPopUp.openPopover();
    }


    closeUpsertTdsSettingsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTdsSettingsPopover.forEach((p) => p.closePopover());
    }

    createTdsSettingsPopupOpen(upsertTdsSettingsPopUp) {
        this.clearForm();
        upsertTdsSettingsPopUp.openPopover();
        this.tdsSettings = 'TDSSETTINGS.ADDTDSSETTINGS';
    }

    upsertTdsSettings(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.tdsSettingsModel = this.tdsSettingsForm.value;
      
        if (this.tdsSettingsId) {
            this.tdsSettingsModel.tdsSettingsId = this.tdsSettingsId;
            this.tdsSettingsModel.timeStamp = this.timeStamp;
        }

       this.payRollService.upsertTdsSettings(this.tdsSettingsModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertTdsSettingsPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getAllTdsSettings();
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                }
                this.cdRef.detectChanges();
            });
      
    }

    deleteTdsSettingsPopUpOpen(row, deleteTdsSettingsPopUp) {
        this.tdsSettingsModel = row;
        deleteTdsSettingsPopUp.openPopover();
    }

    deleteTdsSettings() {
        this.isAnyOperationIsInprogress = true;
        this.tdsSettingsModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertTdsSettings(this.tdsSettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTdsSettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTdsSettings();
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


    closeDeleteTdsSettingsDialog() {
        this.clearForm();
        this.deleteTdsSettingsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 