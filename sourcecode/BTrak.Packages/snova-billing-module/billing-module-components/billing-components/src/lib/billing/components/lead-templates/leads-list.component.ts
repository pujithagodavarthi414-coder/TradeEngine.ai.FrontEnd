import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { ScoModel } from "../../models/sco-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { State } from "@progress/kendo-data-query";
import * as _ from 'underscore';
import { MatOption } from "@angular/material/core";
import { ContractModel } from "../../models/contract.model";
import { MatDialog } from "@angular/material/dialog";
import { AddLeadDialogComponent } from "../lead-templates/add-lead-dialog.component";
import { ToastrService } from "ngx-toastr";
import { LeadContractModel } from "../../models/lead-contract.mdel";
import { ClientOutPutModel } from "../../models/client-model";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { ClientLedgerModel } from "../../models/client-ledger.model";
import { ConstantVariables } from "../../constants/constant-variables";
import { InvoiceLedger } from "../invoice-ledger/invoice-ledger.component";
import { ScoEmailModel } from "../../models/scoEmailModel";
import { AppBaseComponent } from "../componentbase";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {  MatChipInputEvent } from "@angular/material/chips";
@Component({
    selector: "app-billing-component-leads-list",
    templateUrl: "leads-list.component.html"
})
export class LeadsListComponent extends AppBaseComponent implements OnInit {
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChildren("deleteLeadPopup") deleteLeadPopup;
    @ViewChildren("cancelLeadPopup") cancelLeadPopup;
    @ViewChildren("paymentPopup") upsertPaymentPopover;
    @ViewChildren("mailSCOPopover") mailSCOPopover;
    emailForm = new FormGroup({
        to: new FormControl("", [Validators.required]),
        cc: new FormControl("", []),
        bcc: new FormControl("", []),

    });
    selectedTos: any;
    allTos: any[] = [];
    users: any;
    selectedToMails: any;
    leadsList: any;
    temp: any;
    searchText: string;
    state: State = {
        skip: 0,
        take: 10,
    };
    isArchived: boolean = false;
    rowIndex: any;
    contractId: string;
    timeStamp: boolean;
    isLeadArchived: boolean = false;
    rowData: any;
    isInProgress: boolean = false;
    paymentForm: FormGroup;
    selectedDataItem: any = [];
    isAnyOperationIsInprogress: boolean;
    paymentId: any;
    getFilesByReferenceId: boolean = true;
    moduleTypeId = 17;
    isToUploadFiles: boolean = false;
    selectedParentFolderId: null;
    selectedStoreId: null;
    isFileExist: boolean;
    referenceTypeId = ConstantVariables.MasterContractReferenceTypeId;
    isUpload: boolean = true;
    selectedToMobile: any;
    selectedMobileList: any[] = [];
    selectedEmailist: any[] = [];
    selectedSCO: any;
    scoMailUsersList: ScoEmailModel[];
    invoiceAdding: boolean = false;
    shareEmailProgress: boolean = false;
    dataItem: any;
    openPayments: boolean = false;
    sortBy: string;
    sortDirection: boolean = true;
    leadListData: { data: any; total: any; };
    mobileList: string[] = [];
    removable = true;
    count = 0;
    mobileNumber: string;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable: boolean = true;


    constructor(private BillingDashboardService: BillingDashboardService,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog, private toastr: ToastrService,) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getLeadsList();
        this.getAllWareHouseUsers();
    }

    getLeadsList() {
        this.isInProgress = true;
        let leadContractModel = new LeadContractModel();
        leadContractModel.isArchived = this.isArchived;
        leadContractModel.pageNumber = (this.state.skip / this.state.take) + 1;
        leadContractModel.pageSize = this.state.take;
        leadContractModel.sortBy = this.sortBy;
        leadContractModel.sortDirectionAsc = this.sortDirection;
        leadContractModel.searchText = this.searchText;
        this.BillingDashboardService.getAllLeadSusbmissions(leadContractModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.leadsList = responseData.data;
                    this.leadListData = {
                        data: responseData.data,
                        total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                    }
                    this.isInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
this.getLeadsList();
        // const temp = this.temp.filter(((lead) =>
        //     (lead.fullName ? lead.fullName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.uniqueLeadId ? lead.uniqueLeadId.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.buyerName ? lead.buyerName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.salesPersonName ? lead.salesPersonName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.productName ? lead.productName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.gradeName ? lead.gradeName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.statusName ? lead.statusName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.countryName ? lead.countryName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.contractNumber ? lead.contractNumber.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.buyerName ? lead.buyerName.toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.contractQuantity ? lead.contractQuantity.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.remaningQuantity ? lead.remaningQuantity.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.rateOrTon ? lead.rateOrTon.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.leadDate ? lead.leadDate.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.shipmentMonth ? lead.shipmentMonth.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.contractDateFrom ? lead.contractDateFrom.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.contractDateTo ? lead.contractDateTo.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.shipToAddress ? lead.shipToAddress.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.quantityInMT ? lead.quantityInMT.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.vehicleNumberOfTransporter ? lead.vehicleNumberOfTransporter.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.mobileNumberOfTruckDriver ? lead.mobileNumberOfTruckDriver.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.drums ? lead.drums.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.blNumber ? lead.blNumber.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.customPoint ? lead.customPoint.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.exceptionApprovalRequired ? lead.exceptionApprovalRequired.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        //     || (lead.termsOfDelivery ? lead.termsOfDelivery.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        // ));
        // this.leadsList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    deleteLeadPopUpOpen(row, deleteLead) {
        this.contractId = row.contractId;
        this.timeStamp = row.timeStamp;
        this.isLeadArchived = !this.isArchived;
        this.rowData = row;
        deleteLead.openPopover();
    }

    deleteLead() {
        this.isInProgress = true;
        let leadContractModel = new LeadContractModel();
        leadContractModel.timeStamp = this.timeStamp;
        leadContractModel.id = this.rowData.id;
        leadContractModel.salesPersonId = this.rowData.salesPersonId;
        leadContractModel.leadDate = this.rowData.leadDate;
        leadContractModel.contractId = this.rowData.contractId;
        leadContractModel.productId = this.rowData.productId;
        leadContractModel.gradeId = this.rowData.gradeId;
        leadContractModel.quantityInMT = this.rowData.quantityInMT;
        leadContractModel.rateGST = this.rowData.rateGST;
        leadContractModel.paymentTypeId = this.rowData.paymentTypeId;
        leadContractModel.vehicleNumberOfTransporter = this.rowData.vehicleNumberOfTransporter;
        leadContractModel.mobileNumberOfTruckDriver = this.rowData.mobileNumberOfTruckDriver;
        leadContractModel.portId = this.rowData.portId;
        leadContractModel.blNumber = this.rowData.blNumber;
        leadContractModel.exceptionApprovalRequired = this.rowData.exceptionApprovalRequired;
        leadContractModel.isClosed = this.rowData.isClosed;
        leadContractModel.statusId = this.rowData.statusId;
        leadContractModel.shipmentMonth = this.rowData.shipmentMonth;
        leadContractModel.countryOriginId = this.rowData.countryOriginId;
        leadContractModel.termsOfDelivery = this.rowData.termsOfDelivery;
        leadContractModel.customPoint = this.rowData.customPoint;
        leadContractModel.drums = this.rowData.drums;
        leadContractModel.clientId = this.rowData.buyerId;
        leadContractModel.isArchived = this.isLeadArchived;

        this.BillingDashboardService.upertLeadContract(leadContractModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                this.deleteLeadPopup.forEach((p) => p.closePopover());
                this.getLeadsList();
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    closedeleteContractPopUp() {
        this.deleteLeadPopup.forEach((p) => p.closePopover());
    }
    closeCloseLeadPopUp() {
        this.selectedDataItem = null;
        this.cancelLeadPopup.forEach((p) => p.closePopover());
    }

    closeLeadPopUpOpen(dataItem, cancelLeadPopup) {
        this.selectedDataItem = dataItem;
        cancelLeadPopup.openPopover();
    }

    editLeadPopupOpen(rowData) {
        const dialogRef = this.dialog.open(AddLeadDialogComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: rowData, isForPreview: false }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getLeadsList();
        });
    }

    previewLead(rowData) {
        const dialogRef = this.dialog.open(AddLeadDialogComponent, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: rowData, isForPreview: true }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
            this.getLeadsList();
        });
    }
    closeLead(close) {
        this.isInProgress = true;
        let contractModel = new LeadContractModel();
        contractModel = this.selectedDataItem;
        contractModel.isClosed = close;
        contractModel.id = this.selectedDataItem.id;
        this.BillingDashboardService.CloseLead(contractModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                if (close === 0) {
                    this.toastr.success("Lead status updates as closed successfully");
                } else if (close === 1) {
                    this.toastr.success("Lead status updated as lost successfully");
                }
                this.getLeadsList();
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    upsertSco(data) {
        this.isInProgress = true;
        var scoLeadModel = new ClientOutPutModel();
        scoLeadModel.clientId = data.buyerId;
        scoLeadModel.email = data.buyerEmail;
        scoLeadModel.firstName = data.buyerName;
        scoLeadModel.mobileNo = data.mobileNo;
        scoLeadModel.countryCode = data.countryCode;
        scoLeadModel.leadFormId = data.id;
        this.BillingDashboardService.upsertSCO(scoLeadModel).subscribe((response: any) => {
            this.isInProgress = false;
            if (response.success) {
                this.getLeadsList();
                this.toastr.success("SCO Generated Successfully");
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    clearForm() {
        this.paymentForm = new FormGroup({
            PaidAmount: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            invoiceNumber: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
        })
    }
    AddPayment(dataItem, popOver) {
        this.paymentId = null;
        this.openPayments = true;
        this.isUpload = !this.isUpload;
        this.selectedDataItem = dataItem;
        this.dataItem = dataItem;
        if (this.selectedDataItem.invoiceNumber) {
            this.paymentForm.controls["invoiceNumber"].setValue(this.selectedDataItem.invoiceNumber);
        }
        popOver.openPopover();
    }
    AddInvoice(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let invoice = new ClientLedgerModel();
        invoice = this.paymentForm.value;
        invoice.leadId = this.selectedDataItem.id;
        this.BillingDashboardService.UpsertLeadInvoice(invoice).subscribe((response: any) => {
            if (response.success === true) {
                this.paymentId = response.data;
                this.upsertPaymentPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.isToUploadFiles = true;
                formDirective.resetForm();
                this.getLeadsList();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        });
    }
    filesExist(event) {
        this.isFileExist = event;
    }
    viewPayments(dataItem) {
        const dialogRef = this.dialog.open(InvoiceLedger, {
            height: 'auto',
            width: '600px',
            disableClose: true,
            data: { rowData: dataItem }
        });
        dialogRef.afterClosed().subscribe((success: any) => {
        });
    }
    closeUpsertpaymentPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPaymentPopover.forEach((p) => p.closePopover());
        this.openPayments = false;
        this.cdRef.detectChanges();
    }



    getAllWareHouseUsers() {
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllWareHouseUsers()
            .subscribe((responseData: any) => {
                this.users = responseData.data;
                this.allTos = this.users;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }
    opemMailPopup(data, mailPopover, rowIndex) {
        this.selectedSCO = data;
        this.selectedToMails = null;
        this.emailForm = new FormGroup({
            to: new FormControl(null, []),
            cc: new FormControl(null, []),
            bcc: new FormControl(null, []),

        });
        mailPopover.openPopover();
        this.cdRef.markForCheck();
    }
    shareEmail() {
        this.shareEmailProgress = true;
        if(this.mobileList && this.mobileList.length > 0) {
            this.mobileList.forEach((x)=>{
                let scoMailUser = new ScoEmailModel();
                scoMailUser.email = null;
                scoMailUser.mobileNo = x;
                scoMailUser.leadId = this.selectedSCO.id;
                scoMailUser.userId = null;
                this.scoMailUsersList.push(scoMailUser);
            })
        }
        this.BillingDashboardService.sendSCOAcceptanceMail(this.scoMailUsersList).subscribe((result: any) => {
            if (result.success) {
                this.shareEmailProgress = false;
                this.closeSendEmailPopover();
                this.toastr.success("", "Mails and SMS's successfully sent to ware house employees");
            } else {
                this.shareEmailProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    closeSendEmailPopover() {
        this.selectedToMobile = null;
        this.selectedToMails = null;
        this.selectedMobileList= [];
        this.selectedEmailist= [];
        this.mobileList = [];
        this.mobileNumber = null;
        this.mailSCOPopover.forEach((p) => p.closePopover());
    }

    compareSelectedToFn(users: any, selectedusers: any) {
        if (users == selectedusers) {
            return true;
        } else {
            return false;
        }
    }

    getSelectedTos() {

        let tosvalues;
        if (Array.isArray(this.emailForm.value.to))
            tosvalues = this.emailForm.value.to;
        else
            tosvalues = this.emailForm.value.to.split(',');

        const component = tosvalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const tosList = this.allTos;
        const selectedUsersList = _.filter(tosList, function (to) {
            return component.toString().includes(to.id);
        })
        const toNames = selectedUsersList.map((x) => x.fullName);
        this.selectedTos = toNames.toString();
        const toEmails = selectedUsersList.map((x) => x.userName);
        this.selectedEmailist = toEmails;
        this.selectedToMails = toEmails.toString();
        const toMobile = selectedUsersList.map((x) => x.mobileNo);
        this.selectedMobileList = toMobile;
        this.selectedToMobile = toMobile.toString();
        this.scoMailUsersList = [];
        selectedUsersList.forEach(element => {
            var tempModel = new ScoEmailModel();
            tempModel.email = element.userName;
            tempModel.mobileNo = element.mobileNo;
            tempModel.userName = element.fullName;
            tempModel.userId = element.id;
            tempModel.leadId = this.selectedSCO.id;
            this.scoMailUsersList.push(tempModel);
        });
        console.log("selectedUsers", this.scoMailUsersList);
    }

    toggleAllTosSelected() {
        if (this.allSelected.selected) {
            this.emailForm.controls['to'].patchValue([
                0, ...this.allTos.map(item => item.id)
            ]);
        } else {
            this.emailForm.controls['to'].patchValue([]);
        }
        this.getSelectedTos()
    }
    toggleToPerOne(event) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.emailForm.controls['to'].value.length ===
            this.allTos.length
        ) {
            this.allSelected.select();
        }
    }

    downloadFile(file) {
        window.open(file, "_blank");
    }
    numberOnlyWithVal(event, value) {

        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
    
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          if (charCode == 46 && value.toString().includes(".") == false) {
            return true;
          }
          return false;
        }
    
        return true;
    
      }

      selectedRow(e) {
        if(!this.isArchived && (e.dataItem.isScoAccepted || e.dataItem.isClosed)) {
            this.previewLead(e.dataItem)
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getLeadsList();
    }

    
  removeMobileNumber(mobileNumber) {
    const index = this.mobileList.indexOf(mobileNumber);
    if (index >= 0) {
      this.mobileList.splice(index, 1);
    }
    if (this.mobileList.length === 0) {
      this.count = 0;
    }
  }

  addMobileNumber(event: MatChipInputEvent) {
    const inputTags = event.input;
    const userStoryTags = event.value.trim();
    if (userStoryTags != null && userStoryTags != "") {
      let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    //   if (regexpEmail.test(userStoryTags)) {
        this.mobileList.push(userStoryTags);
        this.count++;
    //   } else {
    //     this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
    //   }
    }
    if (inputTags) {
      inputTags.value = " ";
    }
  }
}