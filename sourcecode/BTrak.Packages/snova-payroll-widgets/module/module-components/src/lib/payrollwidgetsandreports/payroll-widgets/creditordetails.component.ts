import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreditorDetailsModel } from '../models/creditordetailsmodel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';
import { BankModel } from '../models/bankmodel';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-creditordetails',
    templateUrl: `creditordetails.component.html`
})

export class CreditorDetailsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertCreditorDetailsPopUp") upsertCreditorDetailsPopover;
    @ViewChildren("deleteCreditorDetailsPopUp") deleteCreditorDetailsPopover;
    @ViewChild("upsertBankPopUp") upsertBankPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    creditorDetails: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    creditorDetailsName: string;
    timeStamp: any;
    searchText: string;
    creditorDetailsForm: FormGroup;
    creditorDetailsModel: CreditorDetailsModel;
    isCreditorDetailsArchived: boolean = false;
    isVariablePay: boolean;
    branchId: string;
    isArchivedTypes: boolean = false;
    taxCalculationTypeId: string;
    company: string;
    creditorDetailsId: string;
    branchList$: Observable<Branch[]>;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifScCode: string;
    bankId: string;
    bankList: BankModel[] = [];
    editBankData: BankModel;
    getBanksIsInprogress: boolean;
    email: string;
    mobileNo: number;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllBanks();
        this.getAllBranches();
        this.getAllCreditorDetails();
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,private translateService: TranslateService) { super() }


    getAllCreditorDetails() {
        this.isAnyOperationIsInprogress = true;
        var creditorDetailsModel = new CreditorDetailsModel();
        creditorDetailsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllEmployeeCreditorDetails(creditorDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.company = response.data;
                this.temp = this.company;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
    }

    getAllBanks() {
        this.getBanksIsInprogress= true;
        var bankModel = new BankModel();
        bankModel.isArchived = this.isArchivedTypes;
        bankModel.isApp = false;
        bankModel.branchId = this.creditorDetailsForm.get("branchId").value;
        this.payRollService.getAllBanks(bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.bankList = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.getBanksIsInprogress= false;
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.creditorDetailsId = null;
        this.creditorDetailsName = null;
        this.branchId = null;
        this.taxCalculationTypeId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isVariablePay = null;
        this.isAnyOperationIsInprogress = false;
        this.creditorDetailsForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            accountName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            accountNumber: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            ifScCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^[A-Za-z]{4}[0-9]{7}$")

                ])
            ),
            bankId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            mobileNo: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            email: new FormControl(null,
                Validators.compose([
                    Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
                    Validators.maxLength(50)
                ])
            ),
            useForPerformaInvoice: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(20)
                ])
            ),
            panNumber: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(20)
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(creditorDetailss =>
            (creditorDetailss.branchName == null ? null : creditorDetailss.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (creditorDetailss.bankName == null ? null : creditorDetailss.bankName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (creditorDetailss.accountName == null ? null : creditorDetailss.accountName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (creditorDetailss.accountNumber == null ? null : creditorDetailss.accountNumber.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (creditorDetailss.ifScCode == null ? null : creditorDetailss.ifScCode.toString().toLowerCase().indexOf(this.searchText) > -1)
        );

        this.company = temp;
    }

    editCreditorDetailsPopupOpen(row, upsertCreditorDetailsPopUp) {
        this.creditorDetailsForm.patchValue(row);
        this.creditorDetailsId = row.employeeCreditorDetailsId;
        this.timeStamp = row.timeStamp;
        this.creditorDetails = 'CREDITORDETAILS.EDITCREDITORDETAILS';
        this.changeBank();
        upsertCreditorDetailsPopUp.openPopover();
    }


    closeUpsertCreditorDetailsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertCreditorDetailsPopover.forEach((p) => p.closePopover());
    }

    createCreditorDetailsPopupOpen(upsertCreditorDetailsPopUp) {
        this.clearForm();
        this.getAllBanks();
        upsertCreditorDetailsPopUp.openPopover();
        this.creditorDetails = 'CREDITORDETAILS.ADDCREDITORDETAILS';
    }

    upsertCreditorDetails(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.creditorDetailsModel = this.creditorDetailsForm.value;
        if (this.creditorDetailsId) {
            this.creditorDetailsModel.employeeCreditorDetailsId = this.creditorDetailsId;
            this.creditorDetailsModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertEmployeeCreditorDetails(this.creditorDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertCreditorDetailsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllCreditorDetails();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deleteCreditorDetailsPopUpOpen(row, deleteCreditorDetailsPopUp) {
        this.creditorDetailsId = row.employeeCreditorDetailsId;
        this.branchId = row.branchId;
        this.bankName = row.bankName;
        this.bankId = row.bankId;
        this.accountName = row.accountName;
        this.accountNumber = row.accountNumber;
        this.ifScCode = row.ifScCode;
        this.timeStamp = row.timeStamp;
        this.isCreditorDetailsArchived = !this.isArchivedTypes;
        this.email = row.email;
        this.mobileNo = row.mobileNo;
        deleteCreditorDetailsPopUp.openPopover();
    }

    deleteCreditorDetails() {
        this.isAnyOperationIsInprogress = true;
        this.creditorDetailsModel = new CreditorDetailsModel();
        this.creditorDetailsModel.employeeCreditorDetailsId = this.creditorDetailsId;
        this.creditorDetailsModel.branchId = this.branchId;
        this.creditorDetailsModel.bankName = this.bankName;
        this.creditorDetailsModel.bankId = this.bankId;
        this.creditorDetailsModel.accountName = this.accountName;
        this.creditorDetailsModel.accountNumber = this.accountNumber;
        this.creditorDetailsModel.ifScCode = this.ifScCode;
        this.creditorDetailsModel.timeStamp = this.timeStamp;
        this.creditorDetailsModel.isArchived = !this.isArchivedTypes;
        this.creditorDetailsModel.email = this.email;
        
        this.payRollService.upsertEmployeeCreditorDetails(this.creditorDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteCreditorDetailsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllCreditorDetails();
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


    closeDeleteCreditorDetailsDialog() {
        this.clearForm();
        this.deleteCreditorDetailsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    changeBank(){
        if(this.creditorDetailsForm.controls["branchId"].value == null)
        {
            this.creditorDetailsForm.controls["bankId"].setValue(null);
            this.toastr.error("", this.translateService.instant("TAXSLABS.FIRSTSELECTBRANCHMESSAGE"));
        }
        else{
            this.getAllBanks();
        }
    }

    createBankPopupOpen(upsertBankPopover) {
        this.editBankData = null;
        upsertBankPopover.openPopover();
    }

    closeUpsertBankPopover() {
        this.upsertBankPopover.closePopover();
        this.getAllBanks();
    }

    onKey(event) {
        if (event.keyCode == 17 || event.keyCode == 32) {
            this.creditorDetailsForm.controls['email'].setValue(this.creditorDetailsForm.controls['email'].value.toString().replace(/\s/g, ''));
        }
    }
} 