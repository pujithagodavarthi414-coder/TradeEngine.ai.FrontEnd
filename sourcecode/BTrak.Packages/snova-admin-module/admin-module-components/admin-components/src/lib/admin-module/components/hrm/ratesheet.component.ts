import { Component, OnInit, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { RateSheetForModel } from "../../models/hr-models/ratesheet-for-model";
import { RateSheetModel } from "../../models/hr-models/ratesheet-model";
import { HRManagementService } from "../../services/hr-management.service";
import { CurrencyModel } from "../../models/hr-models/currency-model";
import { CookieService } from "ngx-cookie-service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../../models/Page';
import { CompanyDetailsModel } from '../../models/company-model';
import { CompanyFormats } from '../../helpers/company-formats';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-ratesheet",
    templateUrl: `ratesheet.component.html`
})

export class RateSheetComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteRateSheetPopUp") deleteRateSheetPopUp;
    @ViewChildren("upsertRateSheetPopUp") upsertRateSheetPopUp;

    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    rateSheets: any;
    rateSheetForNames: any;
    validationMessage: string;
    searchText: string;
    rateSheetModel: RateSheetModel;
    rateSheetForm: FormGroup;
    rateSheetHeaderName: any;
    timeStamp: any;
    rateSheetForId: any;
    rateSheetId: any;
    isIndividual: boolean;
    rateSheetsFiltered: any;
    page = new Page();
    sortDirectionAsc: boolean;
    sortBy: string;
    totalCount: number;
    loggedUserDetails: any;
    company: CompanyDetailsModel;
    currencyList: CurrencyModel[];
    selectedCurrency: CurrencyModel;

    constructor(public hrManagementService: HRManagementService,private cookieService: CookieService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef, 
        private hrManagement: HRManagementService) {
        super();
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = CompanyFormats.CurrencyCode;
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.page.pageNumber = 0;
        this.page.size = 5;
        this.getLoggedInUser();
        this.getCurrencyList();
        this.getAllRateSheetForNames();
        this.getAllRateSheets();
    }

    getCurrencyList() {
        // this.store.dispatch(new LoadCurrencyTriggered());
        // this.currencyList$ = this.assetStore.pipe(select(assetModuleReducer.getCurrencyAll));
        // this.currencyList$.subscribe((result) => {
        //     this.currencyList = result;
        // });
        var currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;

        this.hrManagement.getCurrencies(currencyModel).subscribe((response: any) => {
            this.currencyList = response.data;
        });
    }


    getLoggedInUser() {
        this.hrManagement.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUserDetails = responseData.data;
            this.getCompanyDetails(this.loggedUserDetails.companyId);
        });
    }

    getCompanyDetails(companyId: string) {
        // this.commonService.GetCompanyById(companyId).subscribe((response: any) => {           
        this.company = this.cookieService.check(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company) {
            if (this.company && this.company.currencyId) {
                let currency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
                if (currency) {
                    this.selectedCurrency = currency;
                }
            } else {
                this.selectedCurrency = new CurrencyModel();
                this.selectedCurrency.currencyCode = CompanyFormats.CurrencyCode;
            }
        }
        // });
    }

    getAllRateSheetForNames() {
        this.isAnyOperationIsInprogress = true;
        const rateSheetForModel = new RateSheetForModel();
        this.hrManagementService.getAllRateSheetForNames(rateSheetForModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateSheetForNames = response.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getAllRateSheets() {
        this.isAnyOperationIsInprogress = true;
        const rateSheetModel = new RateSheetModel();
        rateSheetModel.isArchived = this.isArchived;
        rateSheetModel.searchText = this.searchText;
        rateSheetModel.pageNumber = this.page.pageNumber + 1;
        rateSheetModel.pageSize = this.page.size;
        rateSheetModel.sortBy = this.sortBy;
        rateSheetModel.sortDirectionAsc = this.sortDirectionAsc;
        this.hrManagementService.getAllRateSheets(rateSheetModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateSheets = response.data;
                this.rateSheetsFiltered = this.rateSheets;
                this.isAnyOperationIsInprogress = false;
                this.totalCount = response.data.length > 0 ? response.data[0].totalCount : 0
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        this.page.pageNumber = 0;
        if (sort.dir === 'asc') {
            this.sortDirectionAsc = true;
        } else {
            this.sortDirectionAsc = false;
        }
        this.getAllRateSheets();
    }

    getArchiveAndUnarchived() {
        this.searchText = "";
        this.page.pageNumber = 0;
        this.getAllRateSheets();
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.rateSheetId = null;
        this.rateSheetForId = null;
        this.isIndividual = false;
        this.rateSheetForm = new FormGroup({
            rateSheetName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            rateSheetForId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isPermanent: new FormControl(null),
            ratePerHour: new FormControl(null,
                Validators.compose([
                    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
                ])
            ),
            ratePerHourMon: new FormControl(null),
            ratePerHourTue: new FormControl(null),
            ratePerHourWed: new FormControl(null),
            ratePerHourThu: new FormControl(null),
            ratePerHourFri: new FormControl(null),
            ratePerHourSat: new FormControl(null),
            ratePerHourSun: new FormControl(null),
            priority: new FormControl(null)
        });
    }

    createRateSheetPopupOpen(upsertRateSheetPopUp) {
        upsertRateSheetPopUp.openPopover();
        this.rateSheetHeaderName = this.translateService.instant("RATESHEET.ADDRATESHEETTITLE");
    }

    editRateSheetPopupOpen(row, upsertRateSheetPopUp) {
        this.rateSheetForm.patchValue(row);
        this.rateSheetHeaderName = this.translateService.instant("RATESHEET.EDITRATESHEETTITLE");
        this.rateSheetId = row.rateSheetId;
        this.timeStamp = row.timeStamp;
        this.setValidator(null);
        upsertRateSheetPopUp.openPopover();
    }

    deleteRateSheetPopUpOpen(row, deleteRateSheetPopUp) {
        this.rateSheetModel = new RateSheetModel();
        this.rateSheetModel = this.mapProperties(this.rateSheetModel, row);
        deleteRateSheetPopUp.openPopover();
    }

    closeUpsertRateSheetPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertRateSheetPopUp.forEach((p) => p.closePopover());
    }

    closeDeleteRateSheetDialog() {
        this.clearForm();
        this.deleteRateSheetPopUp.forEach((p) => p.closePopover());
    }

    upsertRateSheet(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.rateSheetModel = new RateSheetModel();
        this.rateSheetModel = this.mapProperties(this.rateSheetModel, this.rateSheetForm.value);
        this.rateSheetModel.rateSheetName = this.rateSheetModel.rateSheetName.trim();
        this.rateSheetModel.rateSheetId = this.rateSheetId;
        this.rateSheetModel.timeStamp = this.timeStamp;

        this.hrManagementService.upsertRateSheet(this.rateSheetModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertRateSheetPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllRateSheets();
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteRateSheet() {
        this.isAnyOperationIsInprogress = true;
        this.rateSheetModel.isArchived = !this.isArchived;

        this.hrManagementService.upsertRateSheet(this.rateSheetModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteRateSheetPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllRateSheets();
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    mapProperties(targetObject, sourceObject) {
        return Object.assign(targetObject, sourceObject)
    }

    setValidator(inputVal) {
        if (!inputVal) {
            if (this.rateSheetForm.get("ratePerHour").value) {
                this.isIndividual = false;
            }
        } else {
            if (this.rateSheetForm.get("ratePerHour").value) {
                this.isIndividual = false;
            } else {
                this.isIndividual = true;
            }
        }
       if(this.rateSheetForm.get("ratePerHourMon").value && this.rateSheetForm.get("ratePerHourTue").value
       && this.rateSheetForm.get("ratePerHourWed").value && this.rateSheetForm.get("ratePerHourThu").value
       && this.rateSheetForm.get("ratePerHourFri").value && this.rateSheetForm.get("ratePerHourSat").value
       && this.rateSheetForm.get("ratePerHourSun").value && !inputVal){
        this.isIndividual = true;
       }
    }

    setPage(data) {
        this.page.pageNumber = data.offset;
        this.getAllRateSheets();
    }

    filterByName(event) {
        this.getAllRateSheets();
    }

    closeSearch() {
        this.searchText = "";
        this.getAllRateSheets();
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46);
    }
}
