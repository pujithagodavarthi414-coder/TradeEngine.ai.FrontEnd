import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { DashboardFilterModel } from "../../models/dashboardFilterModel";
import { LeadTemplate } from "../../models/lead-template.model";
import { BillingManagementService } from "../../services/billing-management.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-lead-template",
    templateUrl: "./lead-template.component.html"
})

export class LeadTemplateComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteTemplatePopup") deleteTemplatepOpUps;
    @ViewChild("AddLeadTemplateDialog") templateConfigDialog: TemplateRef<any>;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    dashboardFilters: DashboardFilterModel;
    templatesList: LeadTemplate[] = [];
    leadTemplatesList: GridDataResult = {
        data: [],
        total: 0
    };
    state: State = {
        skip: 0,
        take: 10
    };
    deletetemplatemodel: LeadTemplate;
    isLoading: boolean;
    isDeleteInProgress: boolean;
    timeStamp: any;
    formName: string;
    formjson: string;
    templateId: string;

    constructor(private billingService: BillingManagementService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,public dialog: MatDialog,) {
        super();
        this.getLeadTemplates();

    }
    ngOnInit() {
       super.ngOnInit();
    }

    getLeadTemplates() {
        this.state.skip = 0;
        this.state.take = 10;
        this.isLoading = true;
        var leadModel = new LeadTemplate();
        leadModel.isArchived = false;
        this.billingService.getLeadTemplate(leadModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success === true) {
                this.templatesList = response.data;
                if (this.templatesList.length > 0) {
                    this.leadTemplatesList = {
                        data: this.templatesList.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.templatesList.length
                    }
                } else {
                    this.leadTemplatesList = {
                        data: [],
                        total: 0
                    }
                }
            } else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        })
    }

    openAddNewTemplate(row, isPreview) {
        let dialogId = "unique-template-dialog";
        const dialogRef = this.dialog.open(this.templateConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                formJson: row ? row.formJson : null,
                formName: row ? row.formName : null,
                timeStamp: row ? row.timeStamp : null,
                templateId: row ? row.templateId : null,
                dialogId: dialogId,
                isPreview: isPreview
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getLeadTemplates();
            this.cdRef.detectChanges();
        });
    }

    openDeletePopup(dataItem,deleteTemplatePopUp) {
        this.deletetemplatemodel = dataItem;
        deleteTemplatePopUp.openPopover();
    }

    deleteTemplate() {
        this.isDeleteInProgress = true;
        var deleteTemplateModel = new LeadTemplate();
        deleteTemplateModel.templateId = this.deletetemplatemodel.templateId;
        deleteTemplateModel.formJson = this.deletetemplatemodel.formJson;
        deleteTemplateModel.formName = this.deletetemplatemodel.formName;
        deleteTemplateModel.timeStamp = this.deletetemplatemodel.timeStamp;
        deleteTemplateModel.isArchived = true;
        this.billingService.upsertLeadTemplate(deleteTemplateModel).subscribe((response: any)=> {
            this.isDeleteInProgress = false;
            if(response.success) {
               this.deleteTemplatepOpUps.forEach((p) => { p.closePopover(); });
               this.getLeadTemplates();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        })
    }

    closeDeletePopup() {
        this.deleteTemplatepOpUps.forEach((p) => { p.closePopover(); });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.templatesList = orderBy(this.templatesList, this.state.sort);
        }
        this.leadTemplatesList = {
            data: this.templatesList .slice(this.state.skip, this.state.take + this.state.skip),
            total: this.templatesList .length
        }
    }

}