import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CurrencyModel } from '../models/currency-model';
import { AssetService } from '../services/assets.service';

@Component({
    selector: 'app-am-component-currency-details',
    templateUrl: `currency-details.html`
})

export class CurrencyComponent extends CustomAppBaseComponent implements OnInit
{
    @ViewChild("upsertCurrencyPopUp") upsertCurrencyPopover;
    @Output() closePopup = new EventEmitter<boolean>();
    
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
        private assetService:AssetService,private cdRef: ChangeDetectorRef){
        super();
        
        
    }

    ngOnInit(){
        this.clearForm();
        super.ngOnInit();
    }
   
    closeUpsertCurrencyPopup(formDirective: FormGroupDirective)
    {
        formDirective.resetForm();
        this.clearForm();
        //this.upsertCurrencyPopover.forEach((p) => p.closePopover());
        this.closePopup.emit(false);
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
        this.assetService.upsertCurrency(this.currencyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closePopup.emit(true);
                this.clearForm();
                formDirective.resetForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
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
                    Validators.maxLength(250)
                ])
            ),
            currencyCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            currencySymbol: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

}
