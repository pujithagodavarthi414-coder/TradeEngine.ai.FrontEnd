import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { CounterPartyTypesModel } from "../../models/counter-party-types.model";
import { LegalEntityModel } from "../../models/legal-entity.model";
import { TemplateConfigModel } from "../../models/template-config-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
import * as _ from "underscore";
export interface DialogData {
    templateConfiguration: string;
}
@Component({
    selector: "app-billing-component-template-configuration",
    templateUrl: "template-configuration.component.html"
})
export class TemplateConfigComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("templateConfigPopup") upsertTemplateConfigPopover;
    @ViewChildren("deleteTemplateConfigPopup") deleteTemplateConfigPopup;
    @ViewChild("viewTemplateDialog") viewTemplateDialog: TemplateRef<any>;
    @ViewChild("templateAllSelected") private templateAllSelected: MatOption;
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    templateConfigList: TemplateConfigModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    templateConfig: string;
    templateConfigId: string;
    timeStamp: any;
    templateTypes: any;
    templateConfigurationName: string;
    isArchived: boolean;
    isTemplateConfigArchived: boolean;
    templateConfigForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    templateConfigModel: TemplateConfigModel;
    productList: any;
    legalEntityList: LegalEntityModel[] = [];
    clientTypeList: any[] = [];
    legalEntityId: string;
    clientTypeId: string;
    contractTypeIds: string;
    selectedContractTypeIds: any[] = [];
    selectedContractTypeNames: string;
    templateConfiguration: string;
    public initSettings = {
        plugins: "paste lists advlist",
        branding: false,
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };
    openForm: boolean = false;
    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog) {
        super();
        this.getContractTypes();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllTemplateConfigs();

    }

    getContractTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.BillingDashboardService.getContractTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
            });
    }

    getAllTemplateConfigs() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllTemplateConfigurations(templateConfig)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.templateConfigList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    getAllLegalEntitys() {
        let legalEntity = new LegalEntityModel();
        legalEntity.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllLegalEntities(legalEntity)
            .subscribe((responseData: any) => {
                this.legalEntityList = responseData.data;
            });
    }

    getclientTypeList() {
        let counterPartyTypesModel = new CounterPartyTypesModel();
        counterPartyTypesModel.isArchived = false;
        this.BillingDashboardService.getCounterPartyTypes(counterPartyTypesModel)
            .subscribe((responseData: any) => {
                this.clientTypeList = responseData.data;
            });
    }


    editTemplateConfig(rowDetails, templateConfigPopup) {
        this.openForm = true;
        this.selectedContractTypeIds = rowDetails.contractTypeIds && rowDetails.contractTypeIds.split(",");
        this.templateConfigForm.controls['templateConfigurationName'].patchValue(rowDetails.templateConfigurationName);
        this.templateConfigForm.controls['contractTypeIds'].patchValue(this.selectedContractTypeIds);
        this.templateConfigForm.controls['templateConfiguration'].patchValue(rowDetails.templateConfiguration);
        this.templateConfiguration = rowDetails.templateConfiguration;
        this.templateConfigId = rowDetails.templateConfigurationId;
        if(this.selectedContractTypeIds && this.selectedContractTypeIds.length > 0) {
            this.getContractTemplatesList();
        }
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
        this.templateConfig = this.translateService.instant("TEMPLATECONFIGURATION.EDITTEMPLATECONFIGURATION");
        templateConfigPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((templateConfig) =>
            (templateConfig.templateConfigurationName.toLowerCase().indexOf(this.searchText) > -1)));
        this.templateConfigList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createTemplateConfig(templateConfigPopup) {
        this.openForm = true;
        templateConfigPopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.templateConfig = this.translateService.instant("TEMPLATECONFIGURATION.ADDTEMPLATECONFIGURATION");
    }

    deleteTemplateConfigPopUpOpen(row, deleteTemplateConfigPopup) {
        this.templateConfigId = row.templateConfigurationId;
        this.templateConfigurationName = row.templateConfigurationName;
        this.templateConfiguration = row.templateConfiguration;
        this.legalEntityId = row.legalEntityId;
        this.clientTypeId = row.clientTypeId;
        this.contractTypeIds = row.contractTypeId;
        this.timeStamp = row.timeStamp;
        this.isTemplateConfigArchived = !this.isArchived;
        deleteTemplateConfigPopup.openPopover();
    }

    upsertTemplateConfig(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let templateConfig = new TemplateConfigModel();
        templateConfig = this.templateConfigForm.value;
        templateConfig.templateConfigurationName = templateConfig.templateConfigurationName.trim();
        templateConfig.templateConfigurationId = this.templateConfigId;
        templateConfig.templateConfiguration = this.templateConfiguration;
        if (this.selectedContractTypeIds.length > 0) {
            templateConfig.contractTypeIds = this.selectedContractTypeIds.toString();
        }
        templateConfig.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertTemplateConfiguration(templateConfig).subscribe((response: any) => {
            if (response.success === true) {
                // this.upsertTemplateConfigPopover.forEach((p) => p.closePopover());
                // this.clearForm();
                // formDirective.resetForm();
                this.closeUpsertTemplateConfigPopup(formDirective);
                this.getAllTemplateConfigs();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.templateConfigId = null;
        this.validationMessage = null;
        this.templateConfigurationName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.templateConfigModel = null;
        this.timeStamp = null;
        this.templateConfiguration = null;
        this.legalEntityId = null;
        this.selectedContractTypeIds = [];
        this.selectedContractTypeNames = null;
        this.clientTypeId = null;
        this.contractTypeIds = null;
        this.templateConfigForm = new FormGroup({
            templateConfigurationName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            templateConfiguration: new FormControl(null,
                Validators.compose([
                ])
            ),
            contractTypeIds: new FormControl([],
                Validators.compose([
                    Validators.required,
                ])
            )
        })
    }

    closeUpsertTemplateConfigPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTemplateConfigPopover.forEach((p) => p.closePopover());
        this.openForm = false;
    }

    closeDeleteTemplateConfigPopup() {
        this.clearForm();
        this.deleteTemplateConfigPopup.forEach((p) => p.closePopover());
    }

    deleteTemplateConfig() {
        this.isAnyOperationIsInprogress = true;
        const templateConfigModel = new TemplateConfigModel();
        templateConfigModel.templateConfigurationId = this.templateConfigId;
        templateConfigModel.templateConfigurationName = this.templateConfigurationName;
        templateConfigModel.timeStamp = this.timeStamp;
        templateConfigModel.isArchived = this.isTemplateConfigArchived;
        templateConfigModel.templateConfiguration = this.templateConfiguration;
        templateConfigModel.legalEntityId = this.legalEntityId;
        templateConfigModel.clientTypeId = this.clientTypeId;
        templateConfigModel.contractTypeIds = this.contractTypeIds;
        this.BillingDashboardService.upsertTemplateConfiguration(templateConfigModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteTemplateConfigPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTemplateConfigs();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    openView(dataItem) {
        let dialogId = "template-configuration-dialog";
        const dialogRef = this.dialog.open(this.viewTemplateDialog, {
            id: dialogId,
            maxWidth: "80vw",
            width: "75%",
            disableClose: true,
            data: { templateConfiguration: dataItem.templateConfiguration, dialogId: dialogId, dataItem: dataItem }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
        });
    }

    toggleAllTemplatesSelected() {
        if (this.templateAllSelected.selected) {
            this.templateConfigForm.controls.contractTypeIds.patchValue([
                ...this.templateTypes.map((item) => item.contractTypeId),
                0
            ]);

        } else {
            this.templateConfigForm.controls.contractTypeIds.patchValue([]);
        }
        this.getContractTemplatesList();
    }

    toggleTemplatePerOne(all) {
        if (this.templateAllSelected.selected) {
            this.templateAllSelected.deselect();
            return false;
        }
        if (
            this.templateConfigForm.controls.contractTypeIds.value.length ===
            this.templateTypes.length
        ) {
            this.templateAllSelected.select();
        }
        this.getContractTemplatesList();
    }

    getContractTemplatesList() {
        const templateIds = this.templateConfigForm.value.contractTypeIds;
        const index = templateIds.indexOf(0);
        if (index > -1) {
            templateIds.splice(index, 1);
        }
        this.selectedContractTypeIds = templateIds;
        var contractTemplatesList = this.templateTypes;
        if (templateIds && contractTemplatesList && contractTemplatesList.length > 0) {
            var contractTemplates = _.filter(contractTemplatesList, function (status) {
                return templateIds.toString().includes(status.contractTypeId);
            })
            this.selectedContractTypeNames = contractTemplates.map(x => x.contractTypeName).toString();
        }
    }

    compareSelectedContractTypesFn(contractTypes, selectedContractTypes) {
        if (contractTypes == selectedContractTypes) {
            return true;
        } else {
            return false;
        }
    }

    bindGetContractTypes(contractTypeIds) {
        if (!contractTypeIds) {
            return "";
        } else {
            let contractTypes = this.templateTypes;
            let filteredList = _.filter(contractTypes, function (filter) {
                return contractTypeIds.toString().includes(filter.contractTypeId)
            })
            if (filteredList.length > 0) {
                let contractTypeNames = filteredList.map(x => x.contractTypeName);
                let contractNamesString = contractTypeNames.toString();
                return contractNamesString;
            } else {
                return "";
            }
        }
    }
    omit_special_char(event) {
      var inp = String.fromCharCode(event.keyCode);
      // Allow only alpahbets
      if (/[a-zA-Z]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
}