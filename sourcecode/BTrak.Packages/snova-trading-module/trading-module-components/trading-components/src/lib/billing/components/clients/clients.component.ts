import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr'

import { ClientOutPutModel } from '../../models/client-model';

import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ClientContactModel } from '../../models/client-contact.model';
import { ClientSearchInputModel } from '../../models/client-search-input.model';
import { ClientDeleteModel } from '../../models/client-delete-model';
import { PageChangeEvent, GridComponent, GridDataResult, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { ClientExcelService } from '../../services/client-excel.service';
import * as _ from 'underscore';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SelectBranch } from '../../models/select-branch';
import { ConstantVariables } from '../../constants/constant-variables';
import { Page } from '../../models/Page';
import { EntityDropDownModel } from '../../models/entity-dropdown.module';
import { AppBaseComponent } from '../componentbase';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons'
import * as introJs from 'intro.js/intro.js';
import { LocalStorageProperties } from '../../constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LeadSubmissionDetails } from '../../models/lead-submissions.model';
import { MatDialog } from '@angular/material/dialog';
import { ContractPurchaseModel } from '../../models/Contract-purchased';
import { CounterPartyTypesModel } from '../../models/counter-party-types.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ClientsComponent extends AppBaseComponent implements OnInit {
  softLabels: SoftLabelConfigurationModel[];
  public grid: GridComponent;
  completeGridData: GridDataResult;
  gridData: GridDataResult;
  clientDetailsList: ClientOutPutModel[];
  clientAmountDetails: any;
  anyOperationInProgress: boolean = false;
  isOpen: boolean = true;
  selectedValue: string = "0";
  selectBranch: SelectBranch;
  BranchesList: any;
  selectedProject: string = '1';
  isArchived: boolean = false;
  isChecked: boolean = false;
  sortByFilterIsActive: boolean;
  searchIsActive: boolean;
  searchText: string;
  projectsList: Array<object>;
  actionsList = [{ "name": "Import Clients", "id": 1 }, { "name": "Export Clients", "id": 2 }];
  scrollbarH: boolean = false;
  clientsList: ClientOutPutModel[];
  validationMessage: any;
  totalCount: number;
  pageCount: any;
  sortBy: string;
  pageNumber: number = 0;
  sortDirectionAsc: boolean;
  formJson: string;
  formData: any;
  pageSize: number = 0;
  selected = [];
  selectedClients: ClientOutPutModel[] = [];
  emptyClient: ClientOutPutModel[] = [];
  clientId: string;
  branchId: string;
  isHit: boolean;
  clientSearchResult: ClientSearchInputModel = new ClientSearchInputModel();
  page = new Page();
  message: string;
  excelList: any[] = [];
  selectedRowValue: any = [];
  isSelectAll = false;
  projectLabel: string;
  public ngDestroyed$ = new Subject();
  entities: EntityDropDownModel[];
  selectedEntityId: string = '';
  branchName: string;
  productName: string;
  selectedClientDetails: any;
  introJS = new introJs();
  isStartEnable: boolean = false;
  selectedTabIndex: number = 0;
  selectedTab: string;
  isBuyersList: boolean = true;
  isLeadsList: boolean = false;
  isContractList: boolean = false;
  leadSubmissionDetails: LeadSubmissionDetails[] = [];
  leadsLoadingIndicator: boolean = false;
  contractLoadingIndicator: boolean = false;
  leadSearchText: string;
  temp: any;

  isContarctList: boolean = false;
  isSupplierList: boolean = true;
  contractPurchaseDetails: any;
  contractsSubmissionDetails: ContractPurchaseModel[] = [];
  isPurchaseContractList: boolean = false;
  isPurchaseShipemntList: boolean = false;
  queryParams: any = {
    selectedTab: null,
    selectedList: null,
  }
  clientTypeList: CounterPartyTypesModel[] = [];
  selectedList: string;
  userModel: any;
  isClient: boolean;
  constructor(private router: Router, private BillingDashboardService: BillingDashboardService, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
    private TranslateService: TranslateService, private clientExcelService: ClientExcelService, private cdRef: ChangeDetectorRef, public dialog: MatDialog
    , private productivityService: ProductivityDashboardService, private actionUpdates$: Actions, private softLabelPipe: SoftLabelPipe) {
    super();
    let selectedTab = this.getParameterByName('selectedTab') != null ? this.getParameterByName('selectedTab') : '';
    let selectedList = this.getParameterByName('selectedList') != null ? this.getParameterByName('selectedList') : '';
    this.selectedList = selectedList;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.page.pageNumber = 0;
    this.pageSize = 10;
    this.isHit = true;
    this.getClientAmoutDetails();
    // this.recentlyEdiitedClients();
    this.getClientsByFilterContext();
    this.getEntityDropDown();
    this.selectedRowValue = [];
    this.scrollbarH = true;
    this.checkIntroEnable();
    this.formData = null;
    //this.getPurchasedContract();
  }
  getView(textLabel) {
    if (textLabel.toLocaleLowerCase().includes("supplier")) {
      this.selectedTab = "supplier";
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      this.getListView(1);
      // this.getSupplierList()
      this.getClientsByFilterContext();
      this.getPurchasedContract();
      this.cdRef.detectChanges();
    } else if (textLabel.toLocaleLowerCase().includes("buyer")) {
      this.selectedTab = "buyer";
      this.getListView(2);
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      // this.getBuyersList();
      this.getClientsByFilterContext();
      //this.getLeadSubmissions();
      this.cdRef.detectChanges();
    } else {
      this.getListView(3);
      this.selectedTab = textLabel.toLocaleLowerCase();
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      this.queryParams.selectedList = '';
      this.setQueryParams();
      this.getClientsByFilterContext();
      this.cdRef.detectChanges();
    }
    this.queryParams.selectedTab = this.selectedTab;
    this.setQueryParams();
  }

  getListView(number) {
    if (this.selectedList == 'supplierList') {
      this.getSupplierList();
    }
    else if (this.selectedList == 'purchaseContractList') {
      this.getPurchaseContractList()
    }
    else if (this.selectedList == 'shipmentList') {
      this.getPurchaseShipmentList()
    }
    else if (this.selectedList == 'buyersList') {
      this.getBuyersList();
    }
    else if (this.selectedList == 'buyerContractList') {
      this.getBuyerContractList()
    }
    else if (this.selectedList == 'leadsList') {
      this.getLeadsList()
    } else if (number = 1) {
      this.getSupplierList();
    } else if (number = 2) {
      this.getBuyersList();
    }
  }
  ngAfterViewInit() {
    if (this.canAccess_feature_AddOrUpdateClient && (this.canAccess_feature_ManageImportOrExportClient || this.clientsList.length > 0)) {
      this.introJS.setOptions({
        hidePrev: true,
        steps: [
          {
            element: '#client-1',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-1'),
            position: 'bottom'
          },
          {
            element: '#client-2',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-2'),
            position: 'bottom'
          },
          {
            element: '#client-3',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-3'),
            position: 'bottom'
          },
          {
            element: '#client-7',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-7'),
            position: 'bottom'
          },
          {
            element: '#client-6',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-6'),
            position: 'bottom'
          },
          {
            element: '#client-4',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-4'),
            position: 'left'
          },
          {
            element: '#client-5',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-5'),
            position: 'left'
          },
        ]
      });
    }
    else if (this.canAccess_feature_AddOrUpdateClient) {
      this.introJS.setOptions({
        hidePrev: true,
        steps: [
          {
            element: '#client-1',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-1'),
            position: 'bottom'
          },
          {
            element: '#client-2',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-2'),
            position: 'bottom'
          },
          {
            element: '#client-3',
            intro: this.TranslateService.instant('INTROTEXT.CLIENT-3'),
            position: 'bottom'
          },
        ]
      });
    }
  }

  enableIntro() {
    //  this.productivityService.upsertIntroDetails()
    //      .subscribe((responseData: any) => {
    //        if (responseData.success == false) {
    //          this.validationMessage = responseData.apiResponseMessages[0].message;
    //          this.anyOperationInProgress = false;
    //          this.toaster.error(this.validationMessage);
    //        }
    //        else if (responseData.success == true) {
    //          this.isStartEnable = true;
    this.isContarctList = false;
    this.isSupplierList = true;
    this.isPurchaseContractList = false;
    this.isBuyersList = true;
    this.isLeadsList = false;
    this.cdRef.detectChanges();
    this.introJS.start();
    //        }
    //      });
  }
  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    if (this.softLabels && this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.cdRef.markForCheck();
    }
  }

  searchByEntityId(id) {
    this.selectedEntityId = id;
    this.branchName = this.entities.find(x => x.id == id).name;
    // this.entityIsActive = true;
    this.getClientsByFilterContext();
  }

  getClients() {
    this.anyOperationInProgress = true;
    this.clientSearchResult.pageSize = this.pageSize;
    this.clientSearchResult.pageNumber = this.page.pageNumber + 1;
    this.clientSearchResult.searchText = this.searchText;
    this.clientSearchResult.sortBy = this.sortBy;
    this.clientSearchResult.sortDirectionAsc = this.sortDirectionAsc;
    this.clientSearchResult.isArchived = this.isArchived;
    this.BillingDashboardService.getClients(this.clientSearchResult)
      .subscribe((responseData: any) => {
        this.selectedRowValue = [];
        if (responseData.success == false) {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.anyOperationInProgress = false;
          this.page.pageNumber = 0;
          this.pageCount = 0;
          this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        }
        else if (responseData.success == true) {
          this.scrollbarH = true;
          this.anyOperationInProgress = false;
          this.clientsList = responseData.data;
          if (this.selectedRowValue && this.selectedRowValue.length > 0) {
            this.selectedRowValue.forEach((value, index) => {
              const isExists = this.clientsList.find(x => x.clientId == value.clientId);
              if (isExists) {
                this.selected.push(isExists);
                isExists.isArchived = true;
              }
            })
            this.clientsList = [...this.clientsList];
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
          var temp = this.clientsList;
          this.page.totalElements = this.clientsList.length > 0 ? this.clientsList[0].totalCount : 0;
          if (responseData.data.length === 0) {
            this.pageCount = 0;
          }
          else {
            this.pageCount = this.clientsList[0].totalCount;
          }
          if (this.isHit) {
            this.clientDetailsList = temp.slice(0, 3);
            this.isHit = false;
          }
        }
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  exportClients(pageSize) {
    this.clientSearchResult.pageSize = pageSize;
    this.clientSearchResult.pageNumber = 1;
    this.clientSearchResult.sortBy = this.sortBy;
    this.clientSearchResult.sortDirectionAsc = this.sortDirectionAsc;
    this.BillingDashboardService.getClients(this.clientSearchResult)
      .subscribe((responseData: any) => {
        this.selectedRowValue = [];
        if (responseData.success == false) {
        }
        else if (responseData.success == true) {
          this.selectedRowValue = [];
          if (responseData.data.length === 0) {
          }
          else {
            this.excelList = responseData.data;
            this.excelDownload();
          }
        }
      });
  }

  pleaseSelectClient() {
    this.toaster.error(this.TranslateService.instant(ConstantVariables.SELECTCLIENTTOARCHIVE));
  }

  recentlyEdiitedClients() {
    this.BillingDashboardService.recentlyEdiitedClients()
      .subscribe((responseData: any) => {
        if (responseData.success == false) {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.anyOperationInProgress = false;
          this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
        }
        else if (responseData.success == true) {
          this.anyOperationInProgress = false;
          if (responseData.data.length > 0)
            this.clientDetailsList = responseData.data.slice(0, 3);
          else {
            this.clientDetailsList = [];
          }
        }
      });
  }

  goToInvoices() {
    this.router.navigate(['invoices/invoices-area/invoices']);
  }

  resetAllFilters() {
    this.selectedEntityId = "";
    this.searchText = '';
    this.isArchived = false;
    this.branchName = null;
    this.getClientsByFilterContext();
  }

  search(data) {
    this.searchText = data;
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.pageNumber = 0;
    this.pageSize = 10;
    this.getClientsByFilterContext();
  }

  closeSearch() {
    this.searchText = '';
    this.getClientsByFilterContext()
  }

  getClientAmoutDetails() {

  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  archive(isArchived) {
    this.isArchived = isArchived;
    this.page.pageNumber = 0;
    this.getClientsByFilterContext();
  }

  getClientsByFilterContext() {
    this.clientSearchResult.isArchived = this.isArchived;
    this.clientSearchResult.pageNumber = this.page.pageNumber + 1;
    this.isChecked = this.isArchived;
    this.clientSearchResult.clientId = this.clientId;
    this.clientSearchResult.entityId = this.selectedEntityId;
    this.clientSearchResult.searchText = this.searchText;
    this.selectedClients = this.emptyClient;
    this.getClients();
  }

  removeHandler({ dataItem }) {
    var temp = dataItem;
  }

  editClientDetails(row) {
    if (this.canAccess_feature_AddOrUpdateClient || this.canAccess_feature_ManageAddresses || this.canAccess_feature_ViewClientKycHistory) {
      var temp = row;
      this.BillingDashboardService.changeMessage(row.clientId);
      this.router.navigate(['lives/editclientdetails', row.clientId]);
    }
  }

  addClientDetails() {
    this.router.navigate(['lives/addclient']);
  }
  counterPartySettings() {
    this.router.navigate(['lives/counterPartySettings']);
  }

  addedClientspage(data) {
    this.router.navigate(['lives/addedclientspage', data.clientId]);
  }

  singleClientpage(data) {
    if (!this.isArchived)
      this.router.navigate(['lives/addedclientspage', data]);
  }

  onSort(event) {
    this.sortBy = event.field;
    this.page.pageNumber = 0;
    if (event.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.getClients();
  }

  setPage(data) {
    this.page.pageNumber = data.pageNumber;
    this.pageSize = data.pageSize;
    this.sortBy = "CreatedDateTime"
    this.getClients();
  }

  onSelect({ selected }) {
    this.selectedClients.splice(0, this.selectedClients.length);
    this.selectedClients.push(...selected);
    this.selectedRowValue.splice(0, this.selectedRowValue.length);
    this.selectedRowValue.push(...selected);
    this.selected.forEach((value, index) => {
      const isExists = this.selectedRowValue.find(x => x.clientId == value.clientId);
      if (!isExists)
        this.selectedRowValue.push(Object.assign({}, value));
    })
  }

  archiveAll() {
    let idsarr = [];
    let deleteClient = new ClientDeleteModel();
    if (this.selectedClients.length > 0) {
      this.selectedClients.forEach(element => {
        idsarr.push(element.clientId);
      });
      deleteClient.clientId = idsarr;
      deleteClient.isArchived = !this.isArchived;
      this.BillingDashboardService.deleteClient(deleteClient)
        .subscribe((responseData: any) => {
          if (responseData.success == false) {
            this.validationMessage = responseData.apiResponseMessages[0].message;
            this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
          }
          else if (responseData.success == true) {
            if (!this.isArchived) {
              this.snackbar.open(this.softLabelPipe.transform(this.TranslateService.instant(ConstantVariables.CLIENTSARCHIVEDSUCCESSFULLY), this.softLabels), this.TranslateService.instant(ConstantVariables.success), {
                duration: 3000
              });
            }
            else {
              this.snackbar.open(this.softLabelPipe.transform(this.TranslateService.instant(ConstantVariables.CLIENTSUNARCHIVEDSUCCESSFULLY), this.softLabels), this.TranslateService.instant(ConstantVariables.success), {
                duration: 3000
              });
            }
            this.anyOperationInProgress = false;
            if (this.clientsList.length == this.selectedClients.length) {
              this.page.pageNumber = this.page.pageNumber != 0 ? this.page.pageNumber - 1 : 0;
            }
            this.selectedRowValue = [];
            this.getClients();
            this.recentlyEdiitedClients();
            this.selectedClients = [];
          }
        },
          error => {
            this.toaster.error(this.TranslateService.instant(error));
          });
    }
  }

  receiveMessage($event) {
    this.message = $event;
    if (this.message == "success") {

    }
  }

  loadClientDetails() {
    this.getClients();
  }

  exportAsXLSX(): void {
    if (this.selectedRowValue.length > 0) {
      this.clientExcelService.exportAsExcelFile(this.getRequiredColumns(this.selectedRowValue), 'Client');
    }
    else {
      this.exportClients(this.clientDetailsList[0].totalCount);
      //this.clientExcelService.exportAsExcelFile(this.getRequiredColumns(this.excelList), 'Client');
    }
  }

  excelDownload() {
    this.clientExcelService.exportAsExcelFile(this.getRequiredColumns(this.excelList), 'Client');
  }

  getRequiredColumns(dataList) {
    return dataList.map(excelItem =>
    ({
      firstName: excelItem.firstName,
      lastName: excelItem.lastName,
      fullName: excelItem.fullName,
      email: excelItem.email,
      companyName: excelItem.companyName,
      companyWebsite: excelItem.companyWebsite,
      mobileNo: excelItem.mobileNo,
      street: excelItem.street,
      city: excelItem.city,
      zipcode: excelItem.zipcode,
      state: excelItem.state,
      countryName: excelItem.countryName,
      projectName: excelItem.projectName,
      note: excelItem.note
    })
    );
  }

  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  clearArchiveFilter() {
    this.isArchived = false;
    this.archive(this.isArchived);
  }

  clearBranchFilter() {
    this.selectedEntityId = null;
    this.branchName = null;
    this.getClientsByFilterContext();
  }

  changeaction(event) {

  }

  clearProjectFilter() {

  }
  checkIntroEnable() {
    let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
    if (intro) {
      intro.forEach(element => {
        if (element.moduleId == 'ef94a114-b7a0-49b8-b4f7-d99f1e121c4f') {
          if (element.enableIntro == 'True') {
            this.isStartEnable = true;
          }
        }
      });
    }
  }

  onTabClick(event: MatTabChangeEvent) {
    if (event.tab.textLabel.toLocaleLowerCase().includes("supplier")) {
      this.selectedTab = "supplier";
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      this.getListView(1);
      // this.getSupplierList()
      this.getClientsByFilterContext();
      this.getPurchasedContract();
      this.cdRef.detectChanges();
    } else if (event.tab.textLabel.toLocaleLowerCase().includes("buyer")) {
      this.selectedTab = "buyer";
      this.getListView(2);
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      // this.getBuyersList();
      this.getClientsByFilterContext();
      //this.getLeadSubmissions();
      this.cdRef.detectChanges();
    } else {
      this.getListView(3);
      this.selectedTab = event.tab.textLabel.toLocaleLowerCase();
      this.isArchived = false;
      this.searchText = null;
      this.page.pageNumber = 0;
      // this.queryParams.selectedList = '';
      this.setQueryParams();
      this.getClientsByFilterContext();
      this.cdRef.detectChanges();
    }
    this.queryParams.selectedTab = this.selectedTab;
    this.setQueryParams();
  }

  getBuyersList() {
    this.isBuyersList = true;
    this.isLeadsList = false;
    this.isContractList = false;
    // this.queryParams.selectedList = 'buyersList';
    this.queryParams.selectedTab = 'buyer';
    this.setQueryParams();
  }

  getBuyerContractList() {
    this.isBuyersList = false;
    this.isLeadsList = false;
    this.isContractList = true;
    // this.queryParams.selectedList = 'buyerContractList';
    this.queryParams.selectedTab = 'buyer';
    this.setQueryParams();
  }

  getLeadsList() {
    this.isBuyersList = false;
    this.isLeadsList = true;
    this.isContractList = false;
    // this.queryParams.selectedList = 'leadsList';
    this.queryParams.selectedTab = 'buyer';
    this.setQueryParams();
    //this.getLeadSubmissions();
  }

  getPurchaseContractList() {
    this.isPurchaseContractList = true;
    this.isContarctList = false;
    this.isSupplierList = false;
    this.isPurchaseShipemntList = false;
    // this.queryParams.selectedList = 'purchaseContractList';
    this.queryParams.selectedTab = 'supplier';
    this.setQueryParams();
  }
  getPurchaseShipmentList() {
    this.isPurchaseShipemntList = true;
    this.isPurchaseContractList = false;
    this.isContarctList = false;
    this.isSupplierList = false;
    // this.queryParams.selectedList = 'shipmentList';
    this.queryParams.selectedTab = 'supplier';
    this.setQueryParams();
  }
  getContarctList() {
    this.isContarctList = true;
    this.isSupplierList = false;
    this.isPurchaseContractList = false;
    this.isPurchaseShipemntList = false;
    this.getPurchasedContract();
  }
  getSupplierList() {
    this.isContarctList = false;
    this.isPurchaseContractList = false;
    this.isSupplierList = true;
    this.isPurchaseShipemntList = false;
    // this.queryParams.selectedList = 'supplierList';
    this.queryParams.selectedTab = 'supplier';
    this.setQueryParams();
  }

  getLeadSubmissions() {
    let leadSubmissionDetails = new LeadSubmissionDetails();
    leadSubmissionDetails.clientType = "buyer";
    this.leadsLoadingIndicator = true;
    this.BillingDashboardService.getLeadSubmissions(leadSubmissionDetails)
      .subscribe((responseData: any) => {
        this.temp = responseData.data;
        this.leadSubmissionDetails = responseData.data;
        this.leadsLoadingIndicator = false;
        this.cdRef.detectChanges();
      })
  }
  getPurchasedContract() {
    let contractSubmissionDetails = new ContractPurchaseModel();
    this.contractLoadingIndicator = true;
    this.BillingDashboardService.getPurchasedContract(contractSubmissionDetails)
      .subscribe((responseData: any) => {
        this.contractsSubmissionDetails = responseData.data;
        this.contractLoadingIndicator = false;
        this.cdRef.detectChanges();
      })
  }

  filterLeads(event) {
    if (event != null) {
      this.leadSearchText = event.target.value.toLowerCase();
      this.leadSearchText = this.leadSearchText.trim();
    } else {
      this.leadSearchText = "";
    }

    const temp = this.temp.filter(((lead) =>
      (lead.fullName.toLowerCase().indexOf(this.leadSearchText) > -1)));
    this.leadSubmissionDetails = temp;
  }

  closeLeadSearch() {
    this.leadSearchText = null;
    this.filterLeads(this.searchText);
  }

  // openSCoDialog(row) {
  //   const dialogRef = this.dialog.open(ScoListComponent, {
  //     minWidth: "80vw",
  //     height: "90vh",
  //     disableClose: true,
  //     data: { rowData: row }
  //   });
  //   dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
  //   });
  // }

  setQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.queryParams,
        queryParamsHandling: 'merge'
      });
  }

  getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  gotoContractsPage(page) {
    this.router.navigate(['billingmanagement/' + page]);
  }
}
