import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State, process, orderBy } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { ClientLedgerModel } from "../../models/client-ledger.model";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { SearchFileModel } from "../../models/search-file.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
export interface DialogData {
    rowData: any;
}
@Component({
    selector: "app-invoice-ledger-component",
    templateUrl: "invoice-ledger.component.html"
})

export class InvoiceLedger{
    
    @ViewChildren("ledgerPopup") upsertledgerPopover;

    @Input("dataItem")
    set _dataItem(data: any) {
        if (data) {
            this.rowData = data;
            this.GetLeadPayments();
        }
    }

    state: State = {
        skip: 0,
        take: 10,
    };
    searchText: string;
    temp: any;
    ledgers: ClientLedgerModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    timeStamp: any;
    isArchived: boolean;
    paymentForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    clientData: any;
    ledgerList: any;
    getFilesByReferenceId:boolean = true;
    moduleTypeId = 17;
    isToUploadFiles: boolean = false;
    selectedParentFolderId: null;
    selectedStoreId: null;
    isFileExist: boolean;
    referenceTypeId = ConstantVariables.MasterContractReferenceTypeId;
    ledgerId: any;
    isUpload: boolean=true;
    uploadedFiles: any;
    rowData: any;

    constructor(private BillingDashboardService: BillingDashboardService, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<InvoiceLedger>, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
                    this.rowData = this.data.rowData;
        if (this.data.rowData) {
            this.GetLeadPayments();
        }
    }

    ngOnInit() {
        this.clearForm();
        // this.getClients();
    }

    GetLeadPayments() {
        let ledger = new ClientLedgerModel();
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.GetLeadPayments(this.rowData.id)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.ledgers = responseData.data;
                if(this.ledgers.length>0){
                    this.ledgerList = {
                        data: this.ledgers.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.ledgers.length
                    }
                } else{
                    this.ledgerList = {
                        data: [],
                        total: 0
                    }
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    
    getClients() {
        let clientSearchInputModel = new ClientSearchInputModel();
        clientSearchInputModel.isArchived = false;
        clientSearchInputModel.clientType = 'Buyer';
        this.BillingDashboardService.getClients(clientSearchInputModel)
            .subscribe((responseData: any) => {
                this.clientData = responseData.data;
            })
    }

    CreateClientCredits(ledgerPopup) {
        this.ledgerId=null;
        this.isUpload = !this.isUpload;
        ledgerPopup.openPopover();
    }

    UpsertLeadInvoice(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let ledger = new ClientLedgerModel();
        ledger = this.paymentForm.value;
        ledger.leadId=this.rowData.id;
        this.BillingDashboardService.UpsertLeadInvoice(ledger).subscribe((response: any) => {
            if (response.success === true) {
                this.ledgerId = response.data;
                this.upsertledgerPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.isToUploadFiles = true;
                formDirective.resetForm();
                this.GetLeadPayments();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
    filesExist(event) {
        this.isFileExist = event;
    }

    editLedger(dataItem, ledgerPopup) {
        this.ledgerId = dataItem.ledgerId;
        this.isUpload = !this.isUpload;
        this.paymentForm.patchValue(dataItem);
        ledgerPopup.openPopover();
     }

    clearForm() {
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
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

    closeUpsertLedgerPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertledgerPopover.forEach((p) => p.closePopover());
        this.cdRef.detectChanges();
    }

    getUploadedFilesDetails(referenceId) {
        const searchFolderModel = new SearchFileModel();
        searchFolderModel.referenceId = referenceId;
        searchFolderModel.referenceTypeId = this.referenceTypeId;
        searchFolderModel.isArchived = false;
        searchFolderModel.sortDirectionAsc = true;
        this.BillingDashboardService.getFiles(searchFolderModel).subscribe((result: any) => {
            if (result.success) {
                this.uploadedFiles = result.data;
                if(this.uploadedFiles.length==0){
                    this.toastr.error("Invoice not uploaded");
                } else{
                this.uploadedFiles.forEach(element => {
                    this.downloadFile(element);
                });
            }
            }
            this.cdRef.detectChanges();
        });
    }
    downloadFile(file) {
        const parts = file.filePath.split("/");
        const loc = parts.pop();
        if (file.fileExtension == ".pdf") {
            this.downloadPdf(file.filePath);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.download = loc.split(".")[0] +
                "-File" + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.BillingDashboardService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = "data:application/pdf;base64," + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + "-File.pdf";
            downloadLink.click();
        })
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.ledgers = orderBy(this.ledgers, this.state.sort);
        }
        this.ledgerList = {
            data: this.ledgers.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.ledgers.length
        }
    }
    onNoClick() {
        this.dialogRef.close();
    }
}