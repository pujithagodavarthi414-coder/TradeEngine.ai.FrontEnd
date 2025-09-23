import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { ContractTemplateModel } from "../../models/contract-template";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import * as _ from "underscore";
import { ActivatedRoute } from "@angular/router";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ToastrService } from "ngx-toastr";
import { TemplateConfigModel } from "../../models/template-config-model";
import { ContractTemplateTypeFilterPipe } from "../../pipes/contract-templates-filter.pipe";

@Component({
    selector: "app-trading-contract-template",
    templateUrl: "contract-template.component.html"
})

export class ContractTemplateComponent implements OnInit {
    @ViewChild("templateAllSelected") private templateAllSelected: MatOption;
    @ViewChild("templateTypeAllSelected") private templateTypeAllSelected: MatOption;
    contractTemplatesList: ContractTemplateModel[] = [];
    clientDetails: any;
    templateTypes: any[] = [];
    selectedTemplateIds: any[] = [];
    selectedTemplateTypeIds: any[] = [];
    contractTemplatesForm: FormGroup;
    selectedContractTemplateNames: string;
    selectedContractTemplateTypeNames: string;
    clientId: string;
    anyOperationInProgress: boolean;
    isClientLoadingInProgress: boolean;
    constructor(private billingDashboardService: BillingDashboardService, private route: ActivatedRoute, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private contractTemplateTypeFilterPipe : ContractTemplateTypeFilterPipe) {
        this.clearForm();
        this.getContractTypes();
        this.getContractTemplatesList();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.clientId = routeParams.id;
                this.getClientDetailsById();
            }
        })
    }

    ngOnInit() {

    }

    getContractTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.billingDashboardService.getContractTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
                this.getSelectedContractTemplatesTypeList();
            });
    }

    clearForm() {
        this.contractTemplatesForm = new FormGroup({
            templateTypeId : new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            ),
            contractTemplateId: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    getClientDetailsById() {
        this.isClientLoadingInProgress = true;
        let clientDetails = new ClientSearchInputModel();
        clientDetails.clientId = this.clientId;
        this.billingDashboardService.getClients(clientDetails)
            .subscribe((responseData: any) => {
                this.isClientLoadingInProgress = false;
                if (responseData.success) {
                    if (responseData.data.length > 0) {
                        this.clientDetails = responseData.data[0];
                        this.bindContractTemplates();
                    } else {
                        this.clientDetails = null;
                    }
                } else {
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    bindContractTemplates() {
        if (this.clientDetails && this.contractTemplatesList.length > 0) {
            let rowDetails = this.clientDetails;
            this.selectedTemplateIds = rowDetails.contractTemplateIds && rowDetails.contractTemplateIds.split(",");
            this.contractTemplatesForm.controls['contractTemplateId'].patchValue(this.selectedTemplateIds);
            this.getSelectedContractTemplatesList();
            this.bindContractTypes();
        }
    }

    bindContractTypes() {
        if (this.clientDetails) {
            let templatesList = this.contractTemplatesList;
            let clientDetails = this.clientDetails;
            let filteredList = _.filter(templatesList, function (filter) {
                return clientDetails.contractTemplateIds.includes(filter.contractTemplateId)
            })
            if (filteredList.length > 0) {
                let selectedTemplateIds = filteredList.map(x => x.fields.ContractTypeId);
                selectedTemplateIds = _.uniq(selectedTemplateIds);
                this.selectedTemplateTypeIds = selectedTemplateIds;
                this.contractTemplatesForm.controls['templateTypeId'].patchValue(this.selectedTemplateTypeIds);
                this.getSelectedContractTemplatesTypeList();
            }
        }
    }

    getContractTemplatesList() {
        let kycHistoryModel = new ContractTemplateModel();
        kycHistoryModel.isArchived = false;
        this.billingDashboardService.getContractTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.contractTemplatesList = responseData.data;
                    this.bindContractTemplates();
                    this.bindContractTypes();
                }
            });
    }

    toggleAllTemplatesSelected() {
        let contractTemplatesList = this.contractTemplateTypeFilterPipe.transform(this.contractTemplatesList, this.selectedTemplateTypeIds);
        if (this.templateAllSelected.selected) {
            this.contractTemplatesForm.controls.contractTemplateId.patchValue([
                ...contractTemplatesList.map((item) => item.contractTemplateId),
                0
            ]);

        } else {
            this.contractTemplatesForm.controls.contractTemplateId.patchValue([]);
        }
        this.getSelectedContractTemplatesList();
    }

    toggleTemplatePerOne(all) {
        let contractTemplatesList = this.contractTemplateTypeFilterPipe.transform(this.contractTemplatesList, this.selectedTemplateTypeIds);
        if (this.templateAllSelected.selected) {
            this.templateAllSelected.deselect();
            this.getSelectedContractTemplatesList();
            return false;
        }
        if (
            this.contractTemplatesForm.controls.contractTemplateId.value.length ===
            contractTemplatesList.length
        ) {
            this.templateAllSelected.select();
        }
        this.getSelectedContractTemplatesList();
    }

    toggleAllTemplatesTypeSelected() {
        if (this.templateTypeAllSelected.selected) {
            this.contractTemplatesForm.controls.templateTypeId.patchValue([
                ...this.templateTypes.map((item) => item.contractTypeId),
                0
            ]);

        } else {
            this.contractTemplatesForm.controls.templateTypeId.patchValue([]);
        }
        this.getSelectedContractTemplatesTypeList();
    }

    toggleTemplateTypePerOne(all) {
        if (this.templateTypeAllSelected.selected) {
            this.templateTypeAllSelected.deselect();
            this.getSelectedContractTemplatesList();
            return false;
        }
        if (
            this.contractTemplatesForm.controls.templateTypeId.value.length ===
            this.templateTypes.length
        ) {
            this.templateAllSelected.select();
        }
        this.getSelectedContractTemplatesTypeList();
    }

    getSelectedContractTemplatesList() {
        const templateIds = this.contractTemplatesForm.value.contractTemplateId;
        if(templateIds && templateIds.length > 0) {
            const index = templateIds.indexOf(0);
            if (index > -1) {
                templateIds.splice(index, 1);
            }
            this.selectedTemplateIds = templateIds;
            var contractTemplatesList = this.contractTemplatesList;
            if (templateIds && contractTemplatesList && contractTemplatesList.length > 0) {
                var contractTemplates = _.filter(contractTemplatesList, function (status) {
                    return templateIds.toString().includes(status.contractTemplateId);
                })
                this.selectedContractTemplateNames = contractTemplates.map(x => x.contractTemplateName).toString();
                this.cdRef.detectChanges();
            }
        }
        else {
            this.selectedContractTemplateNames = null;
        }
    }

    getSelectedContractTemplatesTypeList() {
        const templateIds = this.contractTemplatesForm.value.templateTypeId;
        if(templateIds && templateIds.length > 0) {
            const index = templateIds.indexOf(0);
            if (index > -1) {
                templateIds.splice(index, 1);
            }
            this.selectedTemplateTypeIds = templateIds;
            var contractTemplatesList = this.templateTypes;
            if (templateIds && contractTemplatesList && contractTemplatesList.length > 0) {
                var contractTemplates = _.filter(contractTemplatesList, function (status) {
                    return templateIds.toString().includes(status.contractTypeId);
                })
                this.selectedContractTemplateTypeNames = contractTemplates.map(x => x.contractTypeName).toString();
                this.cdRef.detectChanges();
            }
        }
        else {
            this.selectedContractTemplateTypeNames = null;
        }
    }

    saveContractTemplates() {
        this.anyOperationInProgress = true;
        let clientDetails = this.clientDetails;
        clientDetails.isSavingContractTemplates = true;
        if(this.selectedTemplateIds && this.selectedTemplateIds.length > 0) {
            clientDetails.contractTemplateId = this.selectedTemplateIds;
        } else {
            clientDetails.contractTemplateId = [];
        }
        this.billingDashboardService.addClient(clientDetails).subscribe((response : any) => {
            this.anyOperationInProgress = false;
            if(response.success) {
                this.getClientDetailsById();
                this.toastr.success("", 'Contract templates selected successfully');
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    reset() {
        this.bindContractTemplates();
        this.bindContractTypes();
    }

    compareSelectedContractTemplatesFn(templates, selectedTemplates) {
        if (templates == selectedTemplates) {
            return true;
        } else {
            return false;
        }
    }

    compareSelectedContractTemplatesTypeFn(templates, selectedTemplates) {
        if (templates == selectedTemplates) {
            return true;
        } else {
            return false;
        }
    }
}