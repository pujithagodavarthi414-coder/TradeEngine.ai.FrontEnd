import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from "ngx-toastr";
import { ClientOutPutModel } from "../../models/client-model";
import { LeadTemplate } from "../../models/lead-template.model";
import { Page } from "../../models/Page";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { BillingManagementService } from "../../services/billing-management.service";
import { AppBaseComponent } from "../componentbase";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ContractPurchaseModel } from "../../models/Contract-purchased";
import { ContractConfigurationModel } from "../../models/purchase-contract";
import { Router } from "@angular/router";
import { ContractTemplateModel } from "../../models/contract-template";
import { TemplateConfigModel } from "../../models/template-config-model";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, State } from "@progress/kendo-data-query";
import { ClientDeleteModel } from "../../models/client-delete-model";

@Component({
    selector: 'app-clients-table',
    templateUrl: './clients-table.component.html',
})

export class ClientsTableComponent extends AppBaseComponent implements OnInit {

    softLabels: SoftLabelConfigurationModel[];
    isOpen: boolean = false;

    @Output() setPageEmit = new EventEmitter<any>();
    @Output() onSortEmit = new EventEmitter<any>();
    @Output() onSelectEmit = new EventEmitter<any>();
    @Output() editClientDetailsEmit = new EventEmitter<any>();
    @Output() archiveEmit = new EventEmitter<boolean>();
    @Output() searchEmit = new EventEmitter<any>();
    @Output() loadClientDetails = new EventEmitter<any>();
    @Output() closeSearchEmit = new EventEmitter<any>();
    @Output() exportAsXLSXEmit = new EventEmitter<any>();
    @Output() clearBranchFilterEmit = new EventEmitter<any>();
    @Output() clearProjectFilterEmit = new EventEmitter<any>();
    @Output() clearArchiveFilterEmit = new EventEmitter<any>();
    @Output() archiveAllEmit = new EventEmitter<any>();
    @Output() refreshEmit = new EventEmitter<any>();
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
    @ViewChildren("updateClientKycPopup") updateClientKycPopup;
    @ViewChildren("upsertContractPopUp") upsertContractPopover;
    @ViewChildren("archiveClientPopUp") archiveClientPopUps;
    clientListData: GridDataResult = {
        data: [],
        total: 0
    };
    clientData: ClientOutPutModel = new ClientOutPutModel();
    showLead: boolean = false;
    checkBoxClick: boolean = false;
    clientType: any;
    totalCount: number = 0;
    isGetClientInprogress: boolean;
    clientDetails: any;
    selectedTemplateIds: string;
    selectedClient: any;
    isArchiveLoading : boolean;
    isTemplatesLoading: boolean;
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
                this.clientListData = {
                    data: this.clientsList,
                    total: this.clientsList.length > 0 ? this.totalCount : 0,
                }
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
            this.selectedTab = data.toLocaleLowerCase();
            this.isArchived = false;
        }
    }
    state: State = {
        skip: 0,
        take: 10,
    };
    public sort: SortDescriptor[] = [
        {
            field: "createdDateTime",
            dir: "asc",
        }
    ];

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
    contractTemplatesList: ContractTemplateModel[] = [];
    selectedTemplateList: ContractTemplateModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    selectedTemplateId: string;
    contractPopupOpened: boolean = false;
    selectedClientId: string;
    selectedTermsAndConditions: string;
    termsConditions: any;
    templateTypes: any = [];
    public color: any = "";
    sortBy: string;
    sortDirection: boolean = true;

    constructor(private billingService: BillingManagementService, private toastr: ToastrService, public dialog: MatDialog,
        private dashboardService: BillingDashboardService, private router: Router, private cdRef: ChangeDetectorRef,
        private BillingDashboardService: BillingDashboardService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.getPurchasedContract();
        //this.getContractTypes();
        //this.getAllTemplateConfigs();

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

    getAllTemplateConfigs() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.dashboardService.getAllTemplateConfigurations(templateConfig)
            .subscribe((responseData: any) => {
                this.termsConditions = responseData.data;
            });
    }

    getContractTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.dashboardService.getContractTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
            });
    }

    getContractTemplates() {
        this.isTemplatesLoading = true;
        let kycHistoryModel = new ContractTemplateModel();
        // this.color = kycHistoryModel.formBgColor;
        kycHistoryModel.isArchived = false;
        kycHistoryModel.templateIds = this.selectedTemplateIds;
        this.dashboardService.getContractTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                this.isTemplatesLoading = false;
                if (responseData.success) {
                    this.contractTemplatesList = responseData.data;
                    this.cdRef.detectChanges();
                }
            });
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

    dataStateChange(data) {
        this.state = data;
        let pageChange: any = {};
        pageChange.pageNumber = (this.state.skip / this.state.take);
        pageChange.pageSize = this.state.take;
        this.setPageEmit.emit(pageChange);
    }



    openOptionsMenu(dataItem) {
        this.selectedClient = dataItem;
    }

    editClientDetails(data) {
        if (data.type == "click" && !this.checkBoxClick && !this.contractPopupOpened) {
            this.editClientDetailsEmit.emit(data.row);
        }
        else if (data.type != "checkbox") {
            this.checkBoxClick = false;
        }
    }

    counterPartySettings() {
        this.router.navigate(["lives/counterPartySettings", this.selectedClient.clientId]);
    }

    onSelect(data) {
        this.onSelectEmit.emit(data);
        this.checkBoxClick = true;
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    archive() {
        this.isArchived = !this.isArchived;
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
        let idsarr = [];
        let deleteClient = new ClientDeleteModel();
        if (this.selectedClient) {
            idsarr.push(this.selectedClient.clientId);
        };
        deleteClient.clientId = idsarr;
        deleteClient.isArchived = this.isArchived ? false : true;
        this.isArchiveLoading = true;
        this.BillingDashboardService.deleteClient(deleteClient).subscribe((response : any) => {
            this.isArchiveLoading = false;
            if(response.success) {
               this.closeArchivePopUp();
               this.loadClientDetails.emit();
               this.closePopup();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })

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

    closePopUp() {
        this.contractPopupOpened = false;
        this.upsertContractPopover.forEach((p) => p.closePopover());
        this.selectedTemplateList = [];
        this.selectedTemplateId = null;
    }

    createContract(data, upsertContractPopUp) {
        this.contractPopupOpened = true;
        this.clientDetails = data;
        this.selectedClientId = data.clientId;
        if (data.contractTemplateId && data.contractTemplateId.length > 0) {
            this.selectedTemplateIds = data.contractTemplateId.toString();
            this.getContractTemplates();
        }
        else {
            this.selectedTemplateList = [];
        }
        // this.selectedTemplateList = this.contractTemplatesList;
        upsertContractPopUp.openPopover();
    }

    archivePopUpOpen(popup) {
        popup.openPopover();
    }

    selectedRow(event) {
        this.editClientDetailsEmit.emit(event.dataItem);
    }

    closeArchivePopUp() {
        this.archiveClientPopUps.forEach((p) => p.closePopover());
        this.closePopup();
    }

    closePopup() {
        this.menuTrigger.closeMenu();
    }

    sortChange(event) {
        let events = event[0];
        let sortingEvent : any = {};
        if(events.field == 'name') {
            sortingEvent.field = 'Name'
        } else if(events.field == 'kpiName') {
            sortingEvent.field = 'KYC'
        }else if(events.field == 'country') {
            sortingEvent.field = 'CountryName'
        }else if(events.field == 'kycCompleted') {
            sortingEvent.field = 'Status'
        }else {
            sortingEvent.field = 'CreatedDateTime'
        }
        sortingEvent.dir = events.dir;
        this.onSortEmit.emit(sortingEvent);
    }
}