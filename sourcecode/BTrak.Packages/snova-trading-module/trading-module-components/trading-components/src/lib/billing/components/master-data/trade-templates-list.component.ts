import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { TradeTemplateModel } from "../../models/trade-template-model";
import { TemplateConfigModel } from "../../models/template-config-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { AppBaseComponent } from "../componentbase";
import * as formUtils from 'formiojs/utils/formUtils.js';
@Component({
    selector: "app-trading-component-trade-template-list",
    templateUrl: "trade-templates-list.component.html"
})
export class TradeTemplateListComponent extends AppBaseComponent implements OnInit {
    @ViewChild("AddTradeTemplateDialog") templateConfigDialog: TemplateRef<any>;
    @ViewChildren("deleteTemplatePopUp") deleteTemplatePopover;
    isInProgress: boolean = false;
    temp: any;
    tradeTemplatesList: TradeTemplateModel[] = [];
    tradeTemplatesListData: any;
    state: State = {
        skip: 0,
        take: 20,
    };
    public basicForm = { components: [] };
    rowDetails: any;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    searchText: string;
    templateTypes: any;
    formOutput: any;
    tradeTemplateFormJson : any;

    constructor(private billingService: BillingDashboardService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog,) {
        super();
        this.getTradeTypes();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getTradeTemplates();
    }

    getTradeTemplates() {
        this.isInProgress = true;
        let kycHistoryModel = new TradeTemplateModel();
        kycHistoryModel.isArchived = this.isArchived;
        this.billingService.getTradeTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.tradeTemplatesList = responseData.data;
                    this.isInProgress = false;
                    if (this.tradeTemplatesList && this.templateTypes && this.tradeTemplatesList.length > 0 && this.templateTypes.length > 0) {
                        this.tradeTemplatesList.forEach((element) => {
                            let index = this.templateTypes.findIndex((x) => x.templateTypeId.toLowerCase() == element.fields.TemplateTypeId.toLowerCase());
                            if (index > -1) {
                                element.templateTypeName = this.templateTypes[index].templateTypeName;
                            }
                        })
                    }
                    this.tradeTemplatesListData = {
                        data: this.tradeTemplatesList,
                        total: this.tradeTemplatesList.length
                    }
                    this.cdRef.detectChanges();
                }
                else {
                    this.tradeTemplatesListData = {
                        data: [],
                        total: 0,
                    }
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    getTradeTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.billingService.getTemplateTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
            });
    }

    editTradePopupOpen(row, isPreview) {
        let dialogId = "trade-template-dialog";
        const dialogRef = this.dialog.open(this.templateConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                row: row,
                templateTypes: this.templateTypes,
                dialogId: dialogId,
                isPreview: isPreview
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getTradeTemplates();
            this.cdRef.detectChanges();
        });
    }

    deleteCountryPopUpOpen(rowDetails, popUp) {
        this.rowDetails = rowDetails;
        this.tradeTemplateFormJson = this.rowDetails.fields.TradeTemplateJson ? JSON.parse(this.rowDetails.fields.TradeTemplateJson) : Object.assign({}, this.basicForm);
        this.updateComponents();
        popUp.openPopover();
    }


    deleteTradeTemplate() {
        this.isAnyOperationIsInprogress = true;
        var addTemplateModel = new TradeTemplateModel();
        addTemplateModel.tradeTemplateFormJson = this.rowDetails.fields.TradeTemplateJson;
        addTemplateModel.tradeTemplateId = this.rowDetails.tradeTemplateId;
        addTemplateModel.templateTypeId = this.rowDetails.fields.TemplateTypeId;
        addTemplateModel.tradeTemplateName = this.rowDetails.tradeTemplateName;
        addTemplateModel.isArchived = !this.isArchived;
        var formKeys = [];
        formUtils.eachComponent(this.formOutput.components, function (component) {
            formKeys.push({ key: component.key, label: component.label, type: component.type });
        }, false);
        if(this.isArchived == false || this.isArchived == null) {
            addTemplateModel.formKeys = JSON.stringify(formKeys);
        }
        this.billingService.upsertTradeTemplate(addTemplateModel).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success) {
                this.deleteTemplatePopover.forEach((p) => p.closePopover());
                this.getTradeTemplates();

            } else {
                this.toastr.error("", response.apiResponseMessages[0].message)
            }
        })
    }

    updateComponents() {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (this.tradeTemplateFormJson.components) {
            let components = this.tradeTemplateFormJson.components;
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

        const temp = this.temp.filter(((tradeTemplate) =>
            (tradeTemplate?.tradeTemplateName.toLowerCase().indexOf(this.searchText) > -1)
            || (tradeTemplate["templateTypeName"] && tradeTemplate["templateTypeName"].toLowerCase().indexOf(this.searchText) > -1)
        ));
        this.tradeTemplatesList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}