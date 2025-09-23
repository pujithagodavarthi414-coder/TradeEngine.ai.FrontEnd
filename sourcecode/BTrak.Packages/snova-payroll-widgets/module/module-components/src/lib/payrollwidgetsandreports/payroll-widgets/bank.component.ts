import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { BankModel } from '../models/bankmodel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { CompanyRegistrationModel } from '../models/company-registration-model';

@Component({
    selector: 'app-bank',
    templateUrl: `bank.component.html`
})

export class BankComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertBankPopUp") upsertBankPopover;
    @ViewChildren("deleteBankPopUp") deleteBankPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    bankName: string;
    timeStamp: any;
    searchText: string;
    bankForm: FormGroup;
    bankModel: BankModel;
    isBankArchived: boolean = false;
    isArchivedTypes: boolean = false;
    bank: BankModel[];
    bankId: string;
    countryId: string;
    editBankData: BankModel;
    
    ngOnInit() {
        super.ngOnInit();
        this.getAllBanks();
    }

    constructor(private payRollService: PayRollService,private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }

    getAllBanks() {
        this.isAnyOperationIsInprogress = true;
        var bankModel = new BankModel();
        bankModel.isArchived = this.isArchivedTypes;
        bankModel.isApp = true;
        this.payRollService.getAllBanks(bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.bank = response.data;
                this.temp = this.bank;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(bank => (bank.bankName == null ? null : bank.bankName.toLowerCase().indexOf(this.searchText) > -1)
            || (bank.countryName == null ? null : bank.countryName.toLowerCase().indexOf(this.searchText) > -1)
            );

        this.bank = temp;
    }

    deleteBankPopUpOpen(row, deleteBankPopUp) {
        this.bankId = row.bankId;
        this.bankName = row.bankName;
        this.countryId = row.countryId;
        this.timeStamp = row.timeStamp;
        this.isBankArchived = !this.isArchivedTypes;
        deleteBankPopUp.openPopover();
    }

    deleteBank() {
        this.isAnyOperationIsInprogress = true;
        this.bankModel = new BankModel();
        this.bankModel.bankId = this.bankId;
        this.bankModel.bankName = this.bankName;
        this.bankModel.countryId = this.countryId;
        this.bankModel.timeStamp = this.timeStamp;
        this.bankModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertBank(this.bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteBankPopover.forEach((p) => p.closePopover());
                this.getAllBanks();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeleteBankDialog() {
        this.deleteBankPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    createBankPopupOpen(upsertBankPopover) {
        this.editBankData = null;
        upsertBankPopover.openPopover();
    }

    editBankPopupOpen(row, upsertBankPopover) {
        this.editBankData = row;
        upsertBankPopover.openPopover();
    }

    closeUpsertBankPopover() {
        this.upsertBankPopover.forEach((p) => p.closePopover());
        this.getAllBanks();
    }
} 