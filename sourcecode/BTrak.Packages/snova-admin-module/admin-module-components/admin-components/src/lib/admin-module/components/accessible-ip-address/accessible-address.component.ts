import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { AccessibleIpAddressUpsertModel } from '../../models/ipaddress-type-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';

@Component({
    selector: 'custom-app-fm-component-accessible-address',
    templateUrl: `accessible-address.component.html`
})

export class CustomAccessibleIpAddressComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("fromRoute")
    set _fromRoute(data: boolean) {
        if (data || data == false)
            this.isFromRoute = data;
        else
            this.isFromRoute = true;
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertIpAddressesPopUp") upsertIpAddressesPopover;
    @ViewChildren("deleteIpAddressesPopup") deleteIpAddressesPopover;

    isAnyOperationIsInprogress: boolean = true;
    isArchived: boolean = false;
    toastr: any;
    ipAddresses: AccessibleIpAddressUpsertModel[];
    validationMessage: string;
    isFiltersVisible: boolean = false;
    isFromRoute: boolean = false;
    isThereAnError: boolean;
    ipAddressForm: FormGroup;
    IpAddress: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    AccessibleIpAddressesId: string;
    locationName: string;
    loading: boolean = false;
    // roleFeaturesIsInProgress$:Observable<boolean>;
    ipAddress: string;
    ipPattern: string;

    constructor(
        private masterDataManagementService: MasterDataManagementService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef
        , private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getIpAddresses();

        this.ipPattern = "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    }

    getIpAddresses() {
        this.isAnyOperationIsInprogress = true;
        var ipAddressModel = new AccessibleIpAddressUpsertModel();
        ipAddressModel.isArchived = this.isArchived;
        this.masterDataManagementService.getIpAddress(ipAddressModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.clearForm();
                this.ipAddresses = response.data;
                this.temp = this.ipAddresses;
                this.isAnyOperationIsInprogress = false;
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

    createIpAddresses(upsertIpAddressesPopUp) {
        upsertIpAddressesPopUp.openPopover();
        this.ipAddress = this.translateService.instant('IPADDRESSES.ADDIPADDRESSESTITLE');
    }

    closeupsertIpAddressesPopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertIpAddressesPopover.forEach((p) => p.closePopover());
    }

    editIpAddresses(row, upsertIpAddressesPopUp) {
        this.ipAddressForm.patchValue(row);
        this.AccessibleIpAddressesId = row.accessisbleIpAdressesId;
        this.IpAddress = row.ipAddress;
        this.timeStamp = row.timeStamp;
        this.ipAddress = this.translateService.instant('IPADDRESSES.EDITIPADDRESSESTITLE');
        upsertIpAddressesPopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    UpsertIpAddress(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        let IpAddress = new AccessibleIpAddressUpsertModel();
        IpAddress = this.ipAddressForm.value;
        IpAddress.locationName = IpAddress.locationName.toString().trim();
        IpAddress.ipAddress = IpAddress.ipAddress.toString().trim();
        IpAddress.ipAddressId = this.AccessibleIpAddressesId;
        IpAddress.timeStamp = this.timeStamp;

        this.masterDataManagementService.upsertIpAddress(IpAddress).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertIpAddressesPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getIpAddresses();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    clearForm() {
        this.locationName = null;
        this.AccessibleIpAddressesId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.IpAddress = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.ipAddressForm = new FormGroup({
            locationName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            ipAddress: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern(this.ipPattern)
                ])
            ),
        })
    }

    deleteIpAddressesPopupOpen(row, deleteIpAddressesPopup) {
        this.AccessibleIpAddressesId = row.accessisbleIpAdressesId;
        this.locationName = row.locationName;
        this.IpAddress = row.ipAddress;
        this.timeStamp = row.timeStamp;
        deleteIpAddressesPopup.openPopover();
    }

    closedeleteIpAddressesPopup() {
        this.clearForm();
        this.deleteIpAddressesPopover.forEach((p) => p.closePopover());
    }

    deleteIpAddresses() {
        this.isAnyOperationIsInprogress = true;

        let ipAddressesTypeInputModel = new AccessibleIpAddressUpsertModel();
        ipAddressesTypeInputModel.ipAddressId = this.AccessibleIpAddressesId;
        ipAddressesTypeInputModel.locationName = this.locationName;
        ipAddressesTypeInputModel.ipAddress = this.IpAddress;
        ipAddressesTypeInputModel.timeStamp = this.timeStamp;
        ipAddressesTypeInputModel.isArchived = !this.isArchived;

        this.masterDataManagementService.upsertIpAddress(ipAddressesTypeInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteIpAddressesPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getIpAddresses();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
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
        const temp = this.temp.filter(address => (address.locationName.toLowerCase().indexOf(this.searchText) > -1) || (address.ipAddress.toString().indexOf(this.searchText) > -1));

        this.ipAddresses = temp;
    }

    closeSearch() {
        this.searchText = '';
        this.filterByName(null);
    }
}
