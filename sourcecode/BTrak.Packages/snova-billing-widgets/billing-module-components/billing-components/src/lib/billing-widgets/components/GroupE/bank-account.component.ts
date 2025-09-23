import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { BankAccountModel } from "../../models/bank-account.model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-bank-accounts",
    templateUrl: "bank-account.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class BankAccountComponent extends AppBaseComponent implements OnInit {
    bankAccountsModel: BankAccountModel[] = [];
    archiveBankAccountModel: BankAccountModel;
    bankAccountModel: GridDataResult;
    isLoading: boolean;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    bankAccountForm: FormGroup;
    timestamp: any;
    bankAccountId: string;
    state: State = {
        skip: 0,
        take: 10
    };
    @ViewChildren("addBankPopUp") bankPopups;
    @ViewChildren("archiveBankPopUp") archiveBankPopups;
    constructor(private siteService: SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getAllBankAccount();
      this.clearForm();

    }
    ngOnInit() {
      super.ngOnInit();
    }

    getAllBankAccount() {
        this.state.take = 10;
        this.state.skip = 0;
        this.isLoading = true;
        var bankAccountmodel = new BankAccountModel();
        bankAccountmodel.isArchived = false;
        this.siteService.getBankAccount(bankAccountmodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.bankAccountsModel = response.data;
                if (this.bankAccountsModel.length > 0) {
                    this.bankAccountModel = {
                        data: this.bankAccountsModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.bankAccountsModel.length
                    }
                } else {
                    this.bankAccountModel = {
                        data: [],
                        total: 0
                    }
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.bankAccountId = null;
        this.timestamp = null;
        this.bankAccountForm = new FormGroup({
            bankAccountName : new FormControl("", [
                Validators.required,
                Validators.maxLength(50)
            ]),
            beneficiaire: new FormControl("", [
                Validators.required,
                Validators.maxLength(50)
            ]),
            banque: new FormControl("", [
                Validators.required,
                Validators.maxLength(50)]),
            iban: new FormControl("", [
                Validators.required,
                Validators.maxLength(50)
            ])
        })
    }

    upsertBankAccount() {
        this.isAddIsInProgress = true;
        var upsertBankAccountModel = new BankAccountModel();
        upsertBankAccountModel = this.bankAccountForm.value;
        upsertBankAccountModel.id = this.bankAccountId;
        upsertBankAccountModel.timeStamp = this.timestamp;
        this.siteService.upsertBankAccount(upsertBankAccountModel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.clearForm();
                this.bankPopups.forEach((p) => { p.closePopover(); });
                this.getAllBankAccount();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.bankPopups.forEach((p) => { p.closePopover(); });
    }

    archiveBank() {
        this.isArchiveInProgress = true;
        var upsertBankAccountModel = new BankAccountModel();
        upsertBankAccountModel = this.archiveBankAccountModel;
        upsertBankAccountModel.id = this.archiveBankAccountModel.id;
        upsertBankAccountModel.isArchived = true;
        this.siteService.upsertBankAccount(upsertBankAccountModel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveBankPopups.forEach((p) => { p.closePopover(); });
                this.getAllBankAccount();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editBankPopUp(dataItem, bankPopUp) {
       this.bankAccountId = dataItem.id;
       this.timestamp = dataItem.timeStamp;
       this.bankAccountForm.patchValue(dataItem);
       bankPopUp.openPopover();
    }

    openBankPopUp(bankPopUp) {
      this.clearForm();
      bankPopUp.openPopover();
    }

    deleteBankPopUp(dataItem, bankPopUp) {
        this.archiveBankAccountModel = dataItem;
        bankPopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.bankAccountsModel = orderBy(this.bankAccountsModel, this.state.sort);
        }
        this.bankAccountModel = {
            data: this.bankAccountsModel .slice(this.state.skip, this.state.take + this.state.skip),
            total: this.bankAccountsModel .length
        }
    }

    closeDeletePopup() {
        this.archiveBankPopups.forEach((p) => { p.closePopover(); });
    }
    
}