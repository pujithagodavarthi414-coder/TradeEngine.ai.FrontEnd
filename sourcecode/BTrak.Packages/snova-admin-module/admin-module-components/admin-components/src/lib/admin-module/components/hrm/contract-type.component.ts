import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { ContractTypeModel } from '../../models/hr-models/contract-type-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-contract-type',
    templateUrl: `contract-type.component.html`

})

export class ContractTypeComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("deleteContractTypePopup") deleteContractTypePopover;
    @ViewChildren("upsertContractTypePopUp") upsertContractTypePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedTypes: boolean = false;
    contractTypes: ContractTypeModel[];
    isThereAnError: boolean;
    validationMessage: string;
    contractTypeId:string;
    contractTypeName:string;
    searchText:string;
    temp:any;
    timeStamp:any;
    contractTypeForm:FormGroup;
    contractTypeModel:ContractTypeModel;
    contract:string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllContractTypes();
    }

    constructor(
        private translateService: TranslateService,
        private hrManagementService: HRManagementService,public snackbar:MatSnackBar,private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    getAllContractTypes() {
        this.isAnyOperationIsInprogress = true;
        var contractTypeModel = new ContractTypeModel();
        contractTypeModel.isArchived = this.isArchivedTypes;

        this.hrManagementService.getContractTypes(contractTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.contractTypes = response.data;
                this.temp=this.contractTypes;
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

    deleteRateTypePopUpOpen(row,deleteContractTypePopup)
    {
        this.contractTypeId=row.contractTypeId;
        this.contractTypeName=row.contractTypeName;
        this.timeStamp=row.timeStamp;
        deleteContractTypePopup.openPopover();
    }

    closeDeleteContractTypeDialog()
    {
        this.deleteContractTypePopover.forEach((p) => p.closePopover());
        this.clearForm();
    }

    deleteContractType()
    {
        this.isAnyOperationIsInprogress = true;
        let contractTypeModel = new ContractTypeModel();
        contractTypeModel.contractTypeId = this.contractTypeId;
        contractTypeModel.contractTypeName = this.contractTypeName;
        contractTypeModel.timeStamp = this.timeStamp;
        contractTypeModel.isArchived = !this.isArchivedTypes;
        this.hrManagementService.upsertContractType(contractTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteContractTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllContractTypes();
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

    editContractTypePopupOpen(row,upsertContractTypePopUp)
    {
        this.contractTypeForm.patchValue(row);
        this.contractTypeId=row.contractTypeId;
        this.timeStamp=row.timeStamp;
        this.contract=this.translateService.instant('CONTRACTTYPE.EDITCONTRACTTYPETITLE');
        upsertContractTypePopUp.openPopover();
    }

    closeUpsertContractTypePopup(formDirective: FormGroupDirective)
    {
        formDirective.resetForm();
        this.upsertContractTypePopover.forEach((p) => p.closePopover());
        this.clearForm();
    }

    upsertContractType(formDirective: FormGroupDirective)
    {
        this.isAnyOperationIsInprogress = true;
        this.contractTypeModel=this.contractTypeForm.value;
        this.contractTypeModel.contractTypeName=this.contractTypeModel.contractTypeName.trim();
        this.contractTypeModel.contractTypeId = this.contractTypeId;
        this.contractTypeModel.timeStamp = this.timeStamp;
        this.hrManagementService.upsertContractType(this.contractTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertContractTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllContractTypes();
              
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createContractType(upsertContractTypePopUp)
    {
        upsertContractTypePopUp.openPopover();
        this.contract=this.translateService.instant('CONTRACTTYPE.ADDCONTRACTTYPETITLE');
    }

    clearForm()
    {
        this.contractTypeId = null;
        this.contractTypeName=null;
        this.validationMessage = null;
        this.contractTypeName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp=null;
        this.searchText = null;
        this.contractTypeForm = new FormGroup({
            contractTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
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
        const temp = this.temp.filter(contractType => contractType.contractTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.contractTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
