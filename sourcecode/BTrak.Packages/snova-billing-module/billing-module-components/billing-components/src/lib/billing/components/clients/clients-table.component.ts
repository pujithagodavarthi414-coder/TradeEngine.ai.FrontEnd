import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
import { ClientOutPutModel } from "../../models/client-model";
import { LeadTemplate } from "../../models/lead-template.model";
import { Page } from "../../models/Page";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { BillingManagementService } from "../../services/billing-management.service";
import { AppBaseComponent } from "../componentbase";
import { LeadSubmissionDialogComponent } from "../lead-templates/lead-submission-dialog.component";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ContractSubmissionDialogComponent } from "../client-purchase/contract-dialog.component";
import { ContractPurchaseModel } from "../../models/Contract-purchased";
import { ContractConfigurationModel } from "../../models/purchase-contract";
import { ContractComponent } from "./contract.component";
import { AddLeadDialogComponent } from "../lead-templates/add-lead-dialog.component";
import { PurchaseContractComponentPopup } from "../purchaseContract/purchase-contract-popup.component";
import { Router } from "@angular/router";

@Component({
    selector: 'app-clients-table',
    templateUrl: './clients-table.component.html',
})

export class ClientsTableComponent extends AppBaseComponent implements OnInit {

    softLabels: SoftLabelConfigurationModel[];
    isOpen: boolean = true;

    @Output() setPageEmit = new EventEmitter<any>();
    @Output() onSortEmit = new EventEmitter<any>();
    @Output() onSelectEmit = new EventEmitter<any>();
    @Output() editClientDetailsEmit = new EventEmitter<any>();
    @Output() archiveEmit = new EventEmitter<boolean>();
    @Output() searchEmit = new EventEmitter<any>();
    @Output() closeSearchEmit = new EventEmitter<any>();
    @Output() exportAsXLSXEmit = new EventEmitter<any>();
    @Output() clearBranchFilterEmit = new EventEmitter<any>();
    @Output() clearProjectFilterEmit = new EventEmitter<any>();
    @Output() clearArchiveFilterEmit = new EventEmitter<any>();
    @Output() archiveAllEmit = new EventEmitter<any>();
    @Output() refreshEmit = new EventEmitter<any>();
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
    @ViewChildren("updateClientKycPopup") updateClientKycPopup;

    clientData: ClientOutPutModel = new ClientOutPutModel();
    showLead: boolean = false;
    checkBoxClick: boolean = false;
    clientType: any;
    totalCount: number = 0;

    @Input("pageSize")
    set _pageSize(data: number) {
        if (data) {
            this.pageSize = data;
        }
    }

    @Input("page")
    set _page(data: any) {
        if (data) {
            this.page = data;
        }
    }

    @Input("selectedRowValue")
    set _selectedRowValue(data: any) {
        if (data) {
            this.selectedRowValue = data;
        }
    }
    @Input("clientsList")
    set _clientsList(data: any) {
        if (data) {
            this.clientsList = data;
            // this.clientType = data[0].clientTypeName;
            // if (this.clientType == 'Supplier') {
            //     this.getPurchasedContract();
            // }
            // else {
            //     this.getLeadTemplates();
            // }
            if (this.clientsList && this.clientsList.length > 0) {
                this.totalCount = this.clientsList[0].totalCount;
            }
            else {
                this.totalCount = 0;
            }
        }
    }

    @Input("pageCount")
    set _pageCount(data: any) {
        if (data) {
            this.pageCount = data;
        }
    }

    @Input("isArchived")
    set _isArchived(data: any) {
        if (data) {
            this.isArchived = data;
        }
    }
    @Input("searchText")
    set _searchText(data: any) {
        if (data) {
            this.searchText = data;
        }
    }
    @Input("productName")
    set _productName(data: any) {
        if (data) {
            this.productName = data;
        }
    }
    @Input("branchName")
    set _branchName(data: any) {
        if (data) {
            this.branchName = data;
        }
    }
    @Input("anyOperationInProgress")
    set _anyOperationInProgress(data: any) {
        this.anyOperationInProgress = data;
    }
    @Input("selectedTab")
    set _selectedTab(data: string) {
        if (data) {
            this.selectedTab = data;
            this.isArchived = false;
        }
    }

    pageSize: number;
    page = new Page();
    selectedRowValue: any = [];
    pageCount: any;
    isArchived: boolean;
    anyOperationInProgress: boolean;
    clientsList: ClientOutPutModel[] = [];
    scrollbarH: boolean;
    searchText: boolean
    productName: string;
    selectedTab: string;
    branchName: string;
    templatesList: LeadTemplate[] = [];
    templatesContractList: ContractPurchaseModel[] = [];
    selectedLeadTemplateId: string;
    rowData: any;
    data: any;
    kycLoadingForm: boolean = false;
    constructor(private billingService: BillingManagementService, private toastr: ToastrService, public dialog: MatDialog,
        private dashboardService: BillingDashboardService, private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.getPurchasedContract();

        this.getLeadTemplates();

        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (document.querySelector != null && document.querySelector != undefined && document.querySelector(".formio-loader-wrapper") != null && document.querySelector(".formio-loader-wrapper") != undefined && (document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }
    ngAfterViewInit() {
        if ((document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }
    getLeadTemplates() {
        var leadModel = new LeadTemplate();
        leadModel.isArchived = false;
        this.billingService.getLeadTemplate(leadModel).subscribe((response: any) => {
            if (response.success === true) {
                this.templatesList = response.data;
                this.templatesList.forEach((element) => {
                    if (element.formName.toLocaleLowerCase() == "sgt3") {
                        this.showLead = true;
                    }
                });
            }
        })
    }
    getPurchasedContract() {
        var leadModel = new ContractConfigurationModel();
        leadModel.isArchived = false;
        this.dashboardService.GetPurchaseConfiguration(leadModel).subscribe((response: any) => {
            if (response.success === true) {
                this.templatesContractList = response.data;
                this.templatesContractList.forEach((element) => {
                    if (element.purchaseName.toLocaleLowerCase() == "sgt3") {
                        this.showLead = true;
                    }
                });
            }
        })
    }

    setPage(data) {
        this.setPageEmit.emit(data);
    }

    onSort(data) {
        this.onSortEmit.emit(data);
    }

    editClientDetails(data) {
        if (data.type == "click" && !this.checkBoxClick) {
            this.editClientDetailsEmit.emit(data.row);
        }
        else if (data.type != "checkbox") {
            this.checkBoxClick = false;
        }
    }

    counterPartySettings(data) {
        this.router.navigate(["billingmanagement/counterPartySettings", data.clientId]);
    }

    onSelect(data) {
        this.onSelectEmit.emit(data);
        this.checkBoxClick = true;
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    archive() {
        this.archiveEmit.emit(this.isArchived);
    }

    search() {
        this.searchEmit.emit(this.searchText);
    }

    closeSearch() {
        this.closeSearchEmit.emit();
        this.searchText = null;
    }
    exportAsXLSX() {
        this.exportAsXLSXEmit.emit();
    }

    clearBranchFilter() {
        this.clearBranchFilterEmit.emit();
        this.branchName = null;
    }

    clearProjectFilter() {
        this.clearProjectFilterEmit.emit();
        this.productName = null;
    }

    clearArchiveFilter() {
        this.clearArchiveFilterEmit.emit();
        this.isArchived = false;
    }

    archiveAll() {
        this.archiveAllEmit.emit();
    }
    openPurchaseContractForm(data) {
        const dialogRef = this.dialog.open(PurchaseContractComponentPopup, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: data, isEdit: false }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
            if (isReloadRequired.success == true) {
                this.refreshEmit.emit();
            }
            this.menuTrigger.closeMenu();
        });
    }

    openDialog(value, row): void {
        if (row.clientTypeName == 'Supplier') {
            let index = this.templatesContractList.findIndex(x => x.purchaseName.toLocaleLowerCase() == value.toLocaleLowerCase());
            index = index == -1 ? 0 : index;
            let template;
            if (index > -1) {
                template = this.templatesContractList[index];
            }
            const dialogRef = this.dialog.open(ContractSubmissionDialogComponent, {
                minWidth: "80vw",
                height: "90vh",
                disableClose: true,
                data: { template: template, rowData: this.rowData }
            });
            dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
                if (isReloadRequired.success == true) {
                    this.refreshEmit.emit();
                }
                this.menuTrigger.closeMenu();
            });
        }
        else {
            let template;
            if (this.templatesList && this.templatesList.length > 0) {
                template = this.templatesList[0];
            }
            const dialogRef = this.dialog.open(ContractComponent, {
                height: 'auto',
                width: '600px',
                disableClose: true,
                data: {}
            });
            dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
                if (isReloadRequired.success == true) {
                    this.refreshEmit.emit();
                }
                //this.menuTrigger.closeMenu();
            });
        }
    }

    intializeRowData(rowData) {
        this.rowData = rowData;

        if (rowData.leadFormId) {
            this.selectedLeadTemplateId = rowData.leadFormId;
            //this.openDialog(this.selectedLeadTemplateId);
        }
        else {
            this.selectedLeadTemplateId = null;
        }
    }


    upsertClient(value) {
        if (this.rowData.clientTypeName == "Supplier") {
            this.anyOperationInProgress = true;
            this.clientData.profileImage = this.rowData.profileImage;
            this.clientData.clientId = this.rowData.clientId;
            this.clientData.clientAddressId = this.rowData.clientAddressId;
            this.clientData.clientType = this.rowData.clientType;
            this.clientData.kycDocument = this.rowData.kycDocument;
            this.clientData.clientAddressTimeStamp = this.rowData.clientAddressTimeStamp;
            this.clientData.timeStamp = this.rowData.timeStamp;
            this.clientData.contractFormId = value;
            this.clientData.roleId = this.rowData.roleId;
            this.clientData.firstName = this.rowData.firstName;
            this.clientData.lastName = this.rowData.lastName;
            this.clientData.email = this.rowData.email;
            this.clientData.companyName = this.rowData.companyName;
            this.clientData.countryId = this.rowData.countryId;
            this.clientData.creditLimit = this.rowData.creditLimit;
        }
        else {
            this.anyOperationInProgress = true;
            this.clientData.profileImage = this.rowData.profileImage;
            this.clientData.clientId = this.rowData.clientId;
            this.clientData.clientAddressId = this.rowData.clientAddressId;
            this.clientData.clientType = this.rowData.clientType;
            this.clientData.kycDocument = this.rowData.kycDocument;
            this.clientData.clientAddressTimeStamp = this.rowData.clientAddressTimeStamp;
            this.clientData.timeStamp = this.rowData.timeStamp;
            this.clientData.leadFormId = value;
            this.clientData.roleId = this.rowData.roleId;
            this.clientData.firstName = this.rowData.firstName;
            this.clientData.lastName = this.rowData.lastName;
            this.clientData.email = this.rowData.email;
            this.clientData.companyName = this.rowData.companyName;
            this.clientData.countryId = this.rowData.countryId;
            this.clientData.creditLimit = this.rowData.creditLimit;
        }

        this.dashboardService.addClient(this.clientData).subscribe((result: any) => {
            if (result) {
                this.anyOperationInProgress = false;
                if (result.success == false) {
                }
                else if (result.success == true) {
                    this.refreshEmit.emit();
                    this.anyOperationInProgress = false;
                }
            }
        })

    }

    createLead(rowData) {
        const dialogRef = this.dialog.open(AddLeadDialogComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: rowData }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
        });
    }

    updateClient() {
        let client = this.data;
        client['isVerified'] = true
        this.kycLoadingForm = true;
        this.dashboardService.addClient(client).subscribe((result: any) => {
            if (result.success == true) {
                this.updateClientKycPopup.forEach((p) => p.closePopover());
                this.kycLoadingForm = false;
                this.toastr.success("KYC form verified successfully");
                this.refreshEmit.emit();
            }
            else {
                this.toastr.error(result.apiResponseMessages[0].message);
            }
        })
    }

    openClientPopup(data, updateClientKycPopup) {
        updateClientKycPopup.openPopover();
        this.data = data;
    }

    closeKycPopup() {
        this.updateClientKycPopup.forEach((p) => p.closePopover());
    }
}