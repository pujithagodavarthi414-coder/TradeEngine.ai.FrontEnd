import { Component, Inject, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { RateTagModel } from "../../models/ratetag-model";
import { PayRollService } from "../../services/PayRollService";
import { RateTagConfigurationInsertModel } from '../../models/ratetagconfigurationinputmodel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import { CompanyDetailsModel } from '../../models/company-details-model';
import { CurrencyModel } from '../../models/currency-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { RateTagRoleBranchConfigurationInputModel } from '../../models/ratetagrolebranchconfigurationinputmodel';


// tslint:disable-next-line: interface-name
export interface DialogData {
    roleBranchOrEmployeeInputModel: RateTagRoleBranchConfigurationInputModel;
    //selectedRateTagsList: 
}

@Component({
    selector: "app-ratetag-library",
    templateUrl: "ratetag-library.component.html",
    styles: [`
    .ratetagfor-margin{
        margin-top: -5px;
       }
    `]
})

export class RateTagLibraryComponent {
    @ViewChildren("addRateTagPopUp") addRateTagPopUp;
    
    rateTagInsertDetails: any = new RateTagConfigurationInsertModel();
    isAnyOperationIsInprogress: boolean;
    totalCount: number;
    rateTagData$: Observable<RateTagModel[]>;
    company: CompanyDetailsModel;
    selectedCurrency: CurrencyModel;
    currencyList: any;
    selectedRateTagList: RateTagConfigurationInsertModel[] = [];
    editRateTagDetailsData: RateTagModel;

    constructor(private toastr: ToastrService, public payRollService: PayRollService,
        public dialogRef: MatDialogRef<RateTagLibraryComponent>,private cookieService: CookieService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        this.getCurrencies();
        this.getAllRateTags();
    }
    
    getAllRateTags() {
        this.isAnyOperationIsInprogress = true;
        const rateTagModel = new RateTagModel();
        rateTagModel.isArchived = false;

        if (this.data.roleBranchOrEmployeeInputModel != null) {
            if (this.data.roleBranchOrEmployeeInputModel.employeeId) {
                rateTagModel.employeeId = this.data.roleBranchOrEmployeeInputModel.employeeId;
            }
            else {
                rateTagModel.roleId = this.data.roleBranchOrEmployeeInputModel.roleId;
                rateTagModel.branchId = this.data.roleBranchOrEmployeeInputModel.branchId;
            }
        }
        this.rateTagData$ = this.payRollService.getAllRateTags(rateTagModel) as Observable<RateTagModel[]>;
        this.rateTagData$.subscribe((response: any) => {
            if (response.success == true && response.data && response.data.length > 0) {
                this.rateTagInsertDetails.rateTagDetails = response.data;
                if (this.rateTagInsertDetails.rateTagDetails.length > 0) {
                    this.rateTagInsertDetails.rateTagDetails = this.rateTagInsertDetails.rateTagDetails.filter(x => x.rateTagForNames.toLowerCase() != "remaining time");
                }
                this.totalCount = response.data[0].totalCount
            }
            else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    getCurrencies() {
        this.isAnyOperationIsInprogress = true;
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.payRollService.getCurrencies(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencyList = response.data;
                this.getCompanyDetails();
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getCompanyDetails() {
        this.company = this.cookieService.check(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company && this.company.currencyId) {
            this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
            if (this.selectedCurrency) {
                this.rateTagInsertDetails.rateTagCurrencyId = this.selectedCurrency.currencyId;
            } else {
                this.selectedCurrency = new CurrencyModel();
                this.rateTagInsertDetails.rateTagCurrencyId = ConstantVariables.CurrencyId;
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
        }
        else {
            this.selectedCurrency = new CurrencyModel();
            this.rateTagInsertDetails.rateTagCurrencyId = ConstantVariables.CurrencyId;
            this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        }
    }

    onNoClick(): void {
        this.selectedRateTagList = [];
        this.dialogRef.close();
    }

    onCheckChange(){
        this.selectedRateTagList = this.rateTagInsertDetails.rateTagDetails.filter(x => x.isSelected == true);
    }

    
    addRateTagDetailDetails(editBankDetailsPopover) {
        this.editRateTagDetailsData = null;
        editBankDetailsPopover.openPopover();
    }

    closeUpsertRateTagDetailsPopover() {
        this.addRateTagPopUp.forEach((p) => p.closePopover());
    }
}
