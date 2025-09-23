import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as moment_ from 'moment';
const moment = moment_;
import { ToastrService } from 'ngx-toastr';
import { PayRollManagementState } from '../../store/reducers/index';
import { Branch } from '../../models/branch';
import { PayRollService } from '../../services/PayRollService';
import { ContractPaySettingsModel } from '../../models/contractpaysettingsmodel';
import { LoadBranchTriggered } from '../../store/actions/branch.actions';
import { PayRollTemplateModel } from '../../models/PayRollTemplateModel';
import * as branchReducer from '../../store/reducers/index';

@Component({
    selector: 'app-contractpaysettings',
    templateUrl: `contractpaysettings.component.html`
})

export class ContractPaySettingsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertContractPaySettingsPopUp") upsertContractPaySettingsPopover;
    @ViewChildren("deleteContractPaySettingsPopUp") deleteContractPaySettingsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    contractPaySettings: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    contractPaySettingsName: string;
    timeStamp: any;
    searchText: string;
    contractPaySettingsForm: FormGroup;
    contractPaySettingsModel: ContractPaySettingsModel;
    isContractPaySettingsArchived: boolean = false;
    isVariablePay: boolean;
    isArchivedTypes: boolean = false;
    company: string;
    contractPaySettingsId: string;
    employeeContributionPercentage: number;
    employerContributionPercentage: number;
    relatedToContributionPercentage: boolean;
    isVisible: boolean;
    branchList$: Observable<Branch[]>;
    contractPayTypes: any;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllBranches();
        this.getAllContractPayTypes();
        this.getAllContractPaySettings();
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService,
         private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super(); }


    getAllContractPaySettings() {
        this.isAnyOperationIsInprogress = true;
        var contractPaySettingsModel = new ContractPaySettingsModel();
        contractPaySettingsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllContractPaySettings(contractPaySettingsModel).subscribe((response: any) => {
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


    getAllContractPayTypes() {
        this.isAnyOperationIsInprogress = true;
        var contractPayTypeModel = new PayRollTemplateModel();
        contractPayTypeModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllContractPayTypes(contractPayTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.contractPayTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.contractPaySettingsId = null;
        this.contractPaySettingsName = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.contractPaySettingsForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            contractPayTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null,
            ),
            isToBePaid: new FormControl(null
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

        const temp = this.temp.filter(contractPaySettings =>
            (contractPaySettings.branchName == null ? null : contractPaySettings.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (contractPaySettings.contractPayTypeName == null ? null : contractPaySettings.contractPayTypeName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (contractPaySettings.activeFrom != null && moment(contractPaySettings.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (contractPaySettings.activeTo != null && moment(contractPaySettings.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? contractPaySettings.isToBePaid == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? contractPaySettings.isToBePaid == false : null)
        );

        this.company = temp;
    }

    editContractPaySettingsPopupOpen(row, upsertContractPaySettingsPopUp) {
        this.contractPaySettingsForm.patchValue(row);
        this.contractPaySettingsId = row.contractPaySettingsId;
        this.timeStamp = row.timeStamp;
        this.contractPaySettings = 'CONTRACTPAYSETTINGS.EDITCONTRACTPAYSETTINGS';
        upsertContractPaySettingsPopUp.openPopover();
    }


    closeUpsertContractPaySettingsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertContractPaySettingsPopover.forEach((p) => p.closePopover());
    }

    createContractPaySettingsPopupOpen(upsertContractPaySettingsPopUp) {
        this.clearForm();
        upsertContractPaySettingsPopUp.openPopover();
        this.contractPaySettings = 'CONTRACTPAYSETTINGS.ADDCONTRACTPAYSETTINGS';
    }

    upsertContractPaySettings(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.contractPaySettingsModel = this.contractPaySettingsForm.value;
        if (this.contractPaySettingsId) {
            this.contractPaySettingsModel.contractPaySettingsId = this.contractPaySettingsId;
            this.contractPaySettingsModel.timeStamp = this.timeStamp;
        }
        
        this.payRollService.upsertContractPaySettings(this.contractPaySettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertContractPaySettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllContractPaySettings();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    deleteContractPaySettingsPopUpOpen(row, deleteContractPaySettingsPopUp) {
        this.contractPaySettingsModel = row;
        deleteContractPaySettingsPopUp.openPopover();
    }

    deleteContractPaySettings() {
        this.isAnyOperationIsInprogress = true;
        this.contractPaySettingsModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertContractPaySettings(this.contractPaySettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteContractPaySettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllContractPaySettings();
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


    closeDeleteContractPaySettingsDialog() {
        this.clearForm();
        this.deleteContractPaySettingsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 