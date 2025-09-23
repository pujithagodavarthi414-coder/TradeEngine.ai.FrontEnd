import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { ContractTemplateModel } from "../../models/contract-template";
import { TemplateConfigModel } from "../../models/template-config-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { AppBaseComponent } from "../componentbase";
import * as formUtils from 'formiojs/utils/formUtils.js';
@Component({
    selector: "app-trading-component-contract-template-list",
    templateUrl: "contract-template-list.component.html"
})
export class ContractTemplateListComponent extends AppBaseComponent implements OnInit {
    @ViewChild("AddContractTemplateDialog") templateConfigDialog: TemplateRef<any>;
    @ViewChildren("deleteTemplatePopUp") deleteTemplatePopover;
    isInProgress: boolean = false;
    temp: any;
    contractTemplatesList: ContractTemplateModel[] = [];
    state: State = {
        skip: 0,
        take: 20,
    };
    public basicForm = { components: [] };
    rowDetails: any;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    searchText: string;
    termsConditions: any;
    templateTypes: any;
    formOutput : any;
    contractTemplateFormJson : any;

    constructor(private billingService: BillingDashboardService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog,) {
        super();
        this.getAllTemplateConfigs();
        this.getContractTypes();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getContractTemplates();
    }

    getContractTemplates() {
        this.isInProgress = true;
        let kycHistoryModel = new ContractTemplateModel();
        kycHistoryModel.isArchived = this.isArchived;
        this.billingService.getContractTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.contractTemplatesList = responseData.data;
                    this.isInProgress = false;
                    if (this.contractTemplatesList && this.templateTypes && this.contractTemplatesList.length > 0 && this.templateTypes.length > 0) {
                        this.contractTemplatesList.forEach((element) => {
                            let index = this.templateTypes.findIndex((x) => x.contractTypeId.toLowerCase() == element.fields.ContractTypeId.toLowerCase());
                            if (index > -1) {
                                element.contractTypeName = this.templateTypes[index].contractTypeName;
                            }
                        })
                    }
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    getAllTemplateConfigs() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.billingService.getAllTemplateConfigurations(templateConfig)
            .subscribe((responseData: any) => {
                this.termsConditions = responseData.data;
            });
    }

    getContractTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.billingService.getContractTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
            });
    }

    editContractPopupOpen(row, isPreview) { 
        let dialogId = "contract-template-dialog";
        const dialogRef = this.dialog.open(this.templateConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                row: row,
                templateTypes: this.templateTypes,
                termsConditions: this.termsConditions,
                dialogId: dialogId,
                isPreview: isPreview
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getContractTemplates();
            this.cdRef.detectChanges();
        });
    }

    deleteCountryPopUpOpen(rowDetails, popUp) {
        this.rowDetails = rowDetails;
         this.contractTemplateFormJson = this.rowDetails.fields.ContractTemplateJson ? JSON.parse(this.rowDetails.fields.ContractTemplateJson) : Object.assign({}, this.basicForm);
         console.log(this.contractTemplateFormJson);
         this.updateComponents();
        popUp.openPopover();
    }

    updateComponents() {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (this.contractTemplateFormJson.Components) {
            let components = this.contractTemplateFormJson.Components;
            console.log(components);
            if (components && components.length > 0) {
                components.forEach((comp) => {
                    let values = [];
                    let keys = Object.keys(comp);
                    keys.forEach((key) => {
                        values.push(comp[key]);
                        let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                        let idx = keys.indexOf(key);
                        if (idx > -1) {
                            keys[idx] = updatedKeyName;
                        }
                    })
                    var updatedModel = {};
                    for (let i = 0; i < keys.length; i++) {
                        updatedModel[keys[i]] = values[i];
                    }
                    updatedNewComponents.push(updatedModel);
                })
            }
            this.formOutput.components = updatedNewComponents;
        }

    }

    deleteContractTemplate() {
        this.isAnyOperationIsInprogress = true;
        var addTemplateModel = new ContractTemplateModel();
        addTemplateModel.contractTemplateFormJson = this.rowDetails.fields.ContractTemplateJson;
        addTemplateModel.contractTemplateId = this.rowDetails.contractTemplateId;
        addTemplateModel.contractTypeId = this.rowDetails.fields.ContractTypeId;
        addTemplateModel.contractTemplateName = this.rowDetails.contractTemplateName;
        addTemplateModel.termsAndConditionId = this.rowDetails.fields.TermsAndConditionId;
        addTemplateModel.isArchived = !this.isArchived;
        var formKeys = [];
        formUtils.eachComponent(this.formOutput.components, function (component) {
            formKeys.push({ key: component.key, label: component.label, type: component.type });
        }, false);
        if(this.isArchived == false || this.isArchived == null) {
                   addTemplateModel.formKeys = JSON.stringify(formKeys);
        }
      
        this.billingService.upsertContractTemplate(addTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success) {
                this.deleteTemplatePopover.forEach((p) => p.closePopover());
                this.getContractTemplates();

            } else {
                this.toastr.error("", response.apiResponseMessages[0].message)
            }
        })
    }

    closeDeletetemplateDialog() {
        this.deleteTemplatePopover.forEach((p) => p.closePopover());
    }

    filterByName(searchText) {
        if (searchText != null) {
            this.searchText = searchText.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((contractTemplate) =>
            (contractTemplate.contractTemplateName.toLowerCase().indexOf(this.searchText) > -1)
            || (contractTemplate.contractTypeName.toLowerCase().indexOf(this.searchText) > -1)
        ));
        this.contractTemplatesList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}