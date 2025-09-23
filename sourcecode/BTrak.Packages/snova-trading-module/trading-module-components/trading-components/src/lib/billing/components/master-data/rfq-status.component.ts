import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ColorPickerService } from "ngx-color-picker";
import { ConstantVariables } from "../../constants/constant-variables";
import { ContractStatusModel } from "../../models/contract-status.model";
import { RFQStatusModel } from "../../models/rfq-status.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-trading-component-rfq-status",
    templateUrl: "rfq-status.component.html",
    providers: [ColorPickerService ]
})
export class RFQStatusComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("contractStatusPopup") upsertContractStatusPopover;
    @ViewChildren("deleteContractStatusPopup") deleteContractStatusPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    contractStatusList: RFQStatusModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    contractStatus: string;
    contractStatusId: string;
    timeStamp: any;
    contractStatusName: string;
    statusName: string;
    isArchived: boolean;
    isContractStatusArchived: boolean;
    contractStatusForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    contractStatusModel: RFQStatusModel;
    productList: any;
    public color = "";

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllRFQStatus();
    }

    getAllRFQStatus() {
        let contractStatus = new RFQStatusModel();
        contractStatus.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllRFQStatus(contractStatus)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.contractStatusList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editContractStatus(rowDetails, contractStatusPopup) {
        this.contractStatusForm.patchValue(rowDetails);
        this.contractStatusId = rowDetails.rfqStatusId;
        this.color = rowDetails.rfqStatusColor;
        this.statusName = rowDetails.statusName;

        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
        this.contractStatus = this.translateService.instant("RFQSTATUS.EDITRFQSTATUS");
         contractStatusPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((contractStatus) =>
            (contractStatus.rfqStatusName.toLowerCase().indexOf(this.searchText) > -1)));
        this.contractStatusList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createContractStatus(contractStatusPopup) {
        contractStatusPopup.openPopover();
        this.contractStatus = this.translateService.instant("CLIENTSETTINGS.ADDKYCSTATUS");
    }

    deleteContractStatusPopUpOpen(row, deleteContractStatusPopup) {
        this.contractStatusId = row.contractStatusId;
        this.contractStatusName = row.contractStatusName;
        this.timeStamp = row.timeStamp;
        this.isContractStatusArchived = !this.isArchived;
        deleteContractStatusPopup.openPopover();
    }

    upsertContractStatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let contractStatus = new RFQStatusModel();
        var Status = this.contractStatusForm.value;
        contractStatus.rFQStatusName = Status.rfqStatusName.trim();
        if(!this.contractStatusId) {
            contractStatus.statusName = Status.rfqStatusName.trim();
        }
        else {
            contractStatus.statusName = this.statusName;
        }
        contractStatus.rFQStatusColor = Status.rfqStatusColor.trim();
        contractStatus.rFQStatusId = this.contractStatusId;
        contractStatus.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertRFQStatus(contractStatus).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertContractStatusPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllRFQStatus();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.contractStatusId = null;
        this.validationMessage = null;
        this.contractStatusName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.contractStatusModel = null;
        this.timeStamp = null;
        this.color = "";

        this.contractStatusForm = new FormGroup({
            rfqStatusName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            rfqStatusColor: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeUpsertContractStatusPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertContractStatusPopover.forEach((p) => p.closePopover());
    }

    closeDeleteContractStatusPopup() {
        this.clearForm();
        this.deleteContractStatusPopup.forEach((p) => p.closePopover());
    }

    deleteContractStatus() {
        this.isAnyOperationIsInprogress = true;
        const contractStatusModel = new RFQStatusModel();
        contractStatusModel.rFQStatusId = this.contractStatusId;
        contractStatusModel.rFQStatusName = this.contractStatusName;
        contractStatusModel.timeStamp = this.timeStamp;
        contractStatusModel.isArchived = this.isContractStatusArchived;
        this.BillingDashboardService.upsertRFQStatus(contractStatusModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteContractStatusPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllRFQStatus();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}