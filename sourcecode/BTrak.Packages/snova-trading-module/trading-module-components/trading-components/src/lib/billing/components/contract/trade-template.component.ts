import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import * as _ from "underscore";
import { ActivatedRoute } from "@angular/router";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ToastrService } from "ngx-toastr";
import { TradeTemplateModel } from "../../models/trade-template-model";
import { TemplateConfigModel } from "../../models/template-config-model";
import { TradeTemplateTypeFilterPipe } from "../../pipes/trade-templates-type-filter.pipe";
import { CounterPartySettingsModel } from "../../models/counterparty-settings.model";

@Component({
    selector: "app-trading-trade-template",
    templateUrl: "trade-template.component.html"
})

export class TradeTemplateComponent implements OnInit {
    @Input("clientId")
    set _clientId(data: string) {
        this.clientId = data;
    }
    @Input("templateId")
    set _templateId(data: string) {
        this.templateId = data;
        if (this.templateId) {
            this.selectedTemplateTypeIds = [];
            this.selectedTemplateTypeIds.push(this.templateId);
        }
    }
    @Input("templateName")
    set _templateName(data: string) {
        this.templateName = data;
    }
    @Input("contractTemplatesList")
    set _templatesList(data : any) {
        this.contractTemplatesList = data;
    }
    @Input("keyName")
    set _keyName(data: string) {
        this.keyName = data;
        this.getCounterPartySettings();
    }

    @ViewChild("templateAllSelected") private templateAllSelected: MatOption;
    contractTemplatesList: TradeTemplateModel[] = [];
    counterPartySettings: any[] = [];
    templateTypes: any[] = [];
    clientDetails: any;
    selectedTemplateIds: any[] = [];
    selectedTemplateTypeIds: any[] = [];
    selectedTemplateTypeNames: string;
    contractTemplatesForm: FormGroup;
    selectedContractTemplateNames: string;
    clientId: string;
    templateId: string;
    templateName: string;
    keyName: string;
    anyOperationInProgress: boolean;
    isClientLoadingInProgress: boolean;
    constructor(private billingDashboardService: BillingDashboardService, private route: ActivatedRoute, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private tradeTemplateType: TradeTemplateTypeFilterPipe) {
        this.clearForm();
        //this.getContractTemplatesList();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.clientId = routeParams.id;
            }
        })
    }

    ngOnInit() {

    }

    getCounterPartySettings() {
        this.isClientLoadingInProgress = true;
        let counterPartySettingsModel = new CounterPartySettingsModel();
        counterPartySettingsModel.isArchived = false;
        counterPartySettingsModel.isVisible = true;
        counterPartySettingsModel.clientId = this.clientId;
        counterPartySettingsModel.counterPartysettingsName = this.keyName;
        this.billingDashboardService.getCounterPartySettings(counterPartySettingsModel).subscribe((result: any) => {
            if (result.success) {
                this.isClientLoadingInProgress = false;
                let counterPartySettings = result.data;
                let keyName = this.keyName;
                let filteredList = _.filter(counterPartySettings, function (filter) {
                    return filter.key == keyName
                })
                if (filteredList.length > 0) {
                    this.counterPartySettings = filteredList;
                    this.bindContractTemplates();
                }
                else {
                    this.counterPartySettings = [];
                    this.contractTemplatesForm.controls['tradeTemplateId'].patchValue([]);
                    this.contractTemplatesForm.controls['description'].patchValue('');
                }


            } else {
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    clearForm() {
        this.contractTemplatesForm = new FormGroup({
            tradeTemplateId: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            ),
            description: new FormControl([], [])
        })
    }


    bindContractTemplates() {
        if (this.counterPartySettings && this.contractTemplatesList && this.contractTemplatesList.length > 0) {
            let rowDetails = this.counterPartySettings[0];
            this.selectedTemplateIds = rowDetails && rowDetails.value && rowDetails.value.split(",");
            this.contractTemplatesForm.controls['tradeTemplateId'].patchValue(this.selectedTemplateIds);
            if(rowDetails){
                let description = rowDetails.description;
                this.contractTemplatesForm.controls['description'].patchValue(description);
            }
            else {
                this.contractTemplatesForm.controls['description'].patchValue('');
            }
            
            this.getSelectedContractTemplatesList();
        } else {
            this.contractTemplatesForm.controls['tradeTemplateId'].patchValue([]);
            this.contractTemplatesForm.controls['description'].patchValue('');
        }

    }

    getContractTemplatesList() {
        let kycHistoryModel = new TradeTemplateModel();
        kycHistoryModel.isArchived = false;
        this.billingDashboardService.getTradeTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.contractTemplatesList = responseData.data;
                    this.bindContractTemplates();
                }
            });
    }

    toggleAllTemplatesSelected() {
        let contractTemplatesList = this.tradeTemplateType.transform(this.contractTemplatesList, this.selectedTemplateTypeIds);
        if (this.templateAllSelected.selected) {
            this.contractTemplatesForm.controls.tradeTemplateId.patchValue([
                ...contractTemplatesList.map((item) => item.tradeTemplateId),
                0
            ]);

        } else {
            this.contractTemplatesForm.controls.tradeTemplateId.patchValue([]);
        }
        this.getSelectedContractTemplatesList();
    }

    toggleTemplatePerOne(all) {
        let contractTemplatesList = this.tradeTemplateType.transform(this.contractTemplatesList, this.selectedTemplateTypeIds);
        if (this.templateAllSelected.selected) {
            this.templateAllSelected.deselect();
            this.getSelectedContractTemplatesList();
            return false;
        }
        if (
            this.contractTemplatesForm.controls.tradeTemplateId.value.length ===
            contractTemplatesList.length
        ) {
            this.templateAllSelected.select();
        }
        this.getSelectedContractTemplatesList();
    }


    getSelectedContractTemplatesList() {
        const templateIds = this.contractTemplatesForm.value.tradeTemplateId;
        if (templateIds && templateIds.length > 0) {
            const index = templateIds.indexOf(0);
            if (index > -1) {
                templateIds.splice(index, 1);
            }
            this.selectedTemplateIds = templateIds;
            var contractTemplatesList = this.tradeTemplateType.transform(this.contractTemplatesList, this.selectedTemplateTypeIds);
            if (templateIds && contractTemplatesList && contractTemplatesList.length > 0) {
                var contractTemplates = _.filter(contractTemplatesList, function (status) {
                    return templateIds.toString().includes(status.tradeTemplateId);
                })
                this.selectedContractTemplateNames = contractTemplates.map(x => x.tradeTemplateName).toString();
                this.cdRef.detectChanges();
            }
        } else {
            this.selectedContractTemplateNames = null;
        }

    }


    saveContractTemplates() {
        this.anyOperationInProgress = true;
        let counterPartySettingsModel = new CounterPartySettingsModel();
        counterPartySettingsModel.counterPartysettingsName = this.templateName;
        counterPartySettingsModel.key = this.keyName;
        counterPartySettingsModel.value = this.selectedTemplateIds.toString();
        counterPartySettingsModel.description = this.contractTemplatesForm.value.description;

        counterPartySettingsModel.clientId = this.clientId;
        counterPartySettingsModel.timeStamp = this.counterPartySettings.find((x) => x.key == this.keyName)?.timeStamp;
        counterPartySettingsModel.counterPartySettingsId = this.counterPartySettings.find((x) => x.key == this.keyName)?.counterPartySettingsId;
        counterPartySettingsModel.isArchived = false;
        counterPartySettingsModel.isVisible = true;
        this.billingDashboardService.UpsertCounterPartyDetails(counterPartySettingsModel).subscribe((result: any) => {
            if (result.success) {
                this.anyOperationInProgress = false;
                this.getCounterPartySettings();
                this.toastr.success("", "Saved successfully");
            } else {
                this.anyOperationInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    reset() {
        this.bindContractTemplates();
    }

    compareSelectedContractTemplatesFn(templates, selectedTemplates) {
        if (templates == selectedTemplates) {
            return true;
        } else {
            return false;
        }
    }

    compareSelectedTemplateTypeFn(templateTypes, selectedTemplateTypes) {
        if (templateTypes == selectedTemplateTypes) {
            return true;
        } else {
            return false;
        }
    }
}