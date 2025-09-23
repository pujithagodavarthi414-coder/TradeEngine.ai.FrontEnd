import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { BankModel } from '../models/bankmodel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { CompanyRegistrationModel } from '../models/company-registration-model';

@Component({
    selector: 'app-add-bank',
    templateUrl: `add-bank.component.html`
})

export class AddBankComponent extends CustomAppBaseComponent implements OnInit {

    @Input("editBanks")
    set editBanks(data: BankModel) {
        this.clearBankForm();
        if (!data) {
            this.bankDetails = null;
            this.bankId = null;
            this.bankTitle = 'BANK.ADDBANK';
        } else {
            this.bankDetails = data;
            this.bankId = data.bankId;
            this.timeStamp = data.timeStamp;
            this.bankTitle = 'BANK.EDITBANK';
            this.bankForm.patchValue(data);
        }
    }

    @Output() closePopup = new EventEmitter<string>();
    
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
    percentage: number;
    bankTitle: string;
    countryId: string;
    countries: any;
    bankDetails: BankModel;
    
    ngOnInit() {
        this.clearBankForm();
        super.ngOnInit();
        this.getCountries();
    }

    constructor(private payRollService: PayRollService,private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }


    getCountries() {
        var companymodel = new CompanyRegistrationModel();
        companymodel.isArchived = false;
        this.payRollService.getCountries(companymodel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getAllBanks() {
        this.isAnyOperationIsInprogress = true;
        var bankModel = new BankModel();
        bankModel.isArchived = this.isArchivedTypes;
        bankModel.isApp = true;
        this.payRollService.getAllBanks(bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.bank = response.data;
                this.temp = this.bank;
                this.closePopup.emit("");
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.cdRef.detectChanges();
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    clearBankForm() {
        this.bankId = null;
        this.bankName = null;
        this.countryId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.bankForm = new FormGroup({
            bankName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeUpsertBankPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.bankId) {
            this.bankForm.patchValue(this.bankDetails);
        } else {
            this.clearBankForm();
        }
        this.closePopup.emit("");
    }

    upsertBank(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.bankModel = this.bankForm.value;
        if (this.bankId) {
            this.bankModel.bankId = this.bankId;
            this.bankModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertBank(this.bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.getAllBanks();
                this.closeUpsertBankPopup(formDirective); 
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }
} 