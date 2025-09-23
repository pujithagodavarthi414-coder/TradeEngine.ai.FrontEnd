import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { CurrencyModel } from '../../models/hr-models/currency-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-currency',
    templateUrl: `currency.component.html`
})

export class CurrencyComponent extends CustomAppBaseComponent implements OnInit
{
    @ViewChildren("deleteCurrencyPopUp") deleteCurrencyPopover;
    @ViewChildren("upsertCurrencyPopUp") upsertCurrencyPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedTypes:boolean=false;
    isThereAnError:boolean;
    validationMessage:string;
    currencies:CurrencyModel[];
    currencyId:string;
    currencyName:string;
    currencyCode:string;
    symbol:string;
    searchText:string;
    temp:any;
    timeStamp:any;
    currencyForm:FormGroup;
    currencyModel:CurrencyModel;
    currency:string;

    constructor(
        private translateService: TranslateService,private hrManagementService:HRManagementService,private snackbar:MatSnackBar,private cdRef: ChangeDetectorRef){
        super();
        
        
    }

    ngOnInit(){
        this.clearForm();
        super.ngOnInit();
        this.getCurrenciesList();
    }
    
    getCurrenciesList()
    {
        this.isAnyOperationIsInprogress=true;

        var currencyModel = new CurrencyModel();
        currencyModel.isArchived = this.isArchivedTypes;

        this.hrManagementService.getCurrencies(currencyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencies = response.data;
                this.temp=this.currencies;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteCurrencyPopUpOpen(row,deleteCurrencyPopUp)
    {
        this.currencyId=row.currencyId;
        this.currencyName=row.currencyName;
        this.currencyCode=row.currencyCode;
        this.symbol=row.currencySymbol;
        this.timeStamp=row.timeStamp;
        deleteCurrencyPopUp.openPopover();
    }

    closeDeleteCurrencyDialog()
    {
        this.clearForm();
        this.deleteCurrencyPopover.forEach((p) => p.closePopover());
    }

    deleteCurrency()
    {
        this.isAnyOperationIsInprogress = true;

        let currencyModel = new CurrencyModel();
        currencyModel.currencyId = this.currencyId;
        currencyModel.currencyName = this.currencyName;
        currencyModel.timeStamp = this.timeStamp;
        currencyModel.currencyCode=this.currencyCode;
        currencyModel.currencySymbol=this.symbol;
        currencyModel.isArchived = !this.isArchivedTypes;

        this.hrManagementService.upsertCurrency(currencyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteCurrencyPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getCurrenciesList();
              
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    editCurrencyPopupOpen(row,upsertCurrencyPopUp)
    {
        this.currencyId=row.currencyId;
        this.timeStamp=row.timeStamp;
        this.currencyForm.patchValue(row);
        this.currency=this.translateService.instant('CURRENCY.EDITCURRENCY');
        upsertCurrencyPopUp.openPopover();
    }

    closeUpsertCurrencyPopup(formDirective: FormGroupDirective)
    {
        formDirective.resetForm();
        this.clearForm();
        this.upsertCurrencyPopover.forEach((p) => p.closePopover());
    }

    upsertCurrency(formDirective: FormGroupDirective)
    {
        this.isAnyOperationIsInprogress = true;
        this.currencyModel=this.currencyForm.value;
        this.currencyModel.currencyName = this.currencyModel.currencyName.trim();
        this.currencyModel.currencyCode = this.currencyModel.currencyCode.trim();
        this.currencyModel.currencySymbol = this.currencyModel.currencySymbol?this.currencyModel.currencySymbol.toString().trim():this.currencyModel.currencySymbol; 
        this.currencyModel.currencyId = this.currencyId;
        this.currencyModel.timeStamp = this.timeStamp;
        this.hrManagementService.upsertCurrency(this.currencyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertCurrencyPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getCurrenciesList();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createCurrencyPopupOpen(upsertCurrencyPopUp)
    {
        upsertCurrencyPopUp.openPopover();
        this.currency=this.translateService.instant('CURRENCY.ADDCURRENCY');
    }

    clearForm()
    {
        this.currencyId = null;
        this.currencyName=null;
        this.currencyCode=null;
        this.symbol=null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp=null;
        this.searchText = null;
        this.currencyForm = new FormGroup({
            currencyName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            currencyCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            currencySymbol: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
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

        const temp = this.temp.filter(currency => (currency.currencyName.toLowerCase().indexOf(this.searchText) > -1)|| (currency.currencyCode.toLowerCase().indexOf(this.searchText) > -1)|| (currency.currencySymbol == null? null : currency.currencySymbol.toLowerCase().indexOf(this.searchText) > -1));
        this.currencies = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
