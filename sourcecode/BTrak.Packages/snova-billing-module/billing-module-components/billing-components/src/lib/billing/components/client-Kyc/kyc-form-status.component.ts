import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ColorPickerService } from "ngx-color-picker";
import { ConstantVariables } from "../../constants/constant-variables";
import { KycStatusModel } from "../../models/kyc-status.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-billing-component-kyc-form-status",
    templateUrl: "kyc-form-status.component.html",
    providers: [ColorPickerService ]
})
export class KycFormStatusComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("kycStatusPopup") upsertKycStatusPopover;
    @ViewChildren("deleteKycStatusPopup") deleteKycStatusPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    kycStatusList: KycStatusModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    kycStatus: string;
    kycStatusId: string;
    timeStamp: any;
    kycStatusName: string;
    statusName: string;
    isArchived: boolean;
    isKycStatusArchived: boolean;
    kycStatusForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    kycStatusModel: KycStatusModel;
    productList: any;
    public color = "";

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllKycStatuss();
    }

    getAllKycStatuss() {
        let kycStatus = new KycStatusModel();
        kycStatus.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllkycStatus(kycStatus)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.kycStatusList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editKycStatus(rowDetails, kycStatusPopup) {
        this.kycStatusForm.patchValue(rowDetails);
        this.kycStatusId = rowDetails.kycStatusId;
        this.color = rowDetails.kycStatusColor;
        this.statusName = rowDetails.statusName;

        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
        this.kycStatus = this.translateService.instant("CLIENTSETTINGS.EDITKYCSTATUS");
         kycStatusPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((kycStatus) =>
            (kycStatus.kycStatusName.toLowerCase().indexOf(this.searchText) > -1)));
        this.kycStatusList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createKycStatus(kycStatusPopup) {
        kycStatusPopup.openPopover();
        this.kycStatus = this.translateService.instant("CLIENTSETTINGS.ADDKYCSTATUS");
    }

    deleteKycStatusPopUpOpen(row, deleteKycStatusPopup) {
        this.kycStatusId = row.kycStatusId;
        this.kycStatusName = row.kycStatusName;
        this.timeStamp = row.timeStamp;
        this.isKycStatusArchived = !this.isArchived;
        deleteKycStatusPopup.openPopover();
    }

    upsertKycStatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let kycStatus = new KycStatusModel();
        kycStatus = this.kycStatusForm.value;
        kycStatus.kycStatusName = kycStatus.kycStatusName.trim();
        if(!this.kycStatusId) {
            kycStatus.statusName = kycStatus.kycStatusName.trim();
        }
        else {
            kycStatus.statusName = this.statusName;
        }
        kycStatus.kycStatusId = this.kycStatusId;
        kycStatus.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertKycStatus(kycStatus).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertKycStatusPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllKycStatuss();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.kycStatusId = null;
        this.validationMessage = null;
        this.kycStatusName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.kycStatusModel = null;
        this.timeStamp = null;
        this.color = "";

        this.kycStatusForm = new FormGroup({
            kycStatusName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            kycStatusColor: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeUpsertKycStatusPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertKycStatusPopover.forEach((p) => p.closePopover());
    }

    closeDeleteKycStatusPopup() {
        this.clearForm();
        this.deleteKycStatusPopup.forEach((p) => p.closePopover());
    }

    deleteKycStatus() {
        this.isAnyOperationIsInprogress = true;
        const kycStatusModel = new KycStatusModel();
        kycStatusModel.kycStatusId = this.kycStatusId;
        kycStatusModel.kycStatusName = this.kycStatusName;
        kycStatusModel.timeStamp = this.timeStamp;
        kycStatusModel.isArchived = this.isKycStatusArchived;
        this.BillingDashboardService.upsertKycStatus(kycStatusModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteKycStatusPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllKycStatuss();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    keyPressAlphabets(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
            return false;
        } else {
            if (/[a-zA-Z\s]/.test(inp)) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }
    }
}