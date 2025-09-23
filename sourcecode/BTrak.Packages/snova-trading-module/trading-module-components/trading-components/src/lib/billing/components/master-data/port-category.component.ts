import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ColorPickerService } from "ngx-color-picker";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { ContractStatusModel } from "../../models/contract-status.model";
import { PortCategoryModel } from "../../models/port-category.model";
import { RFQStatusModel } from "../../models/rfq-status.model";
import { VesselConfirmationStatusModel } from "../../models/vessel-confirmation-statusmodel";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-trading-port-category",
    templateUrl: "port-category.component.html"
})
export class PortCategoryComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("upsertPortCategoryPopup") upsertPortCategoryPopup;
    @ViewChildren("deletePortCategoryPopup") deletePortCategoryPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    // contractStatusList: VesselConfirmationStatusModel[] = [];
    portCategoryList: any;
    isAnyOperationIsInprogress: boolean = false;
    contractStatus: string;
    editStatus: string;
    contractStatusId: string;
    timeStamp: any;
    contractStatusName: string;
    statusName: string;
    isArchived: boolean = false;
    isPortCategoryArchived: boolean;
    portCategoryForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    contractStatusModel: VesselConfirmationStatusModel;
    productList: any;
    rowDetails: any;
    public color = "";

    constructor(private billingDashboardService: BillingDashboardService, private translateService: TranslateService,private toastr: ToastrService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllPortCategory();
    }

    toggleArchive() {
        this.getAllPortCategory();
    }

    getAllPortCategory() {
        let portCategory = {};
        portCategory["isArchived"] = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.billingDashboardService.getAllPortCategory(portCategory)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.portCategoryList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editPortCategory(rowDetails, portCategoryPopup) {
        this.portCategoryForm.patchValue(rowDetails);
        this.editStatus = "Edit Port Category";
        portCategoryPopup.openPopover();
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
            (contractStatus.name.toLowerCase().indexOf(this.searchText) > -1)));
        this.portCategoryList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createContractStatus(contractStatusPopup) {
        contractStatusPopup.openPopover();
        this.timeStamp = null;
        this.editStatus = "Add Port Category";
    }

    deletePortCategoryPopUpOpen(row, deletePortCategoryPopup) {
        this.rowDetails = row;
        this.timeStamp = row.timeStamp;
        this.isPortCategoryArchived = !this.isArchived;
        deletePortCategoryPopup.openPopover();
    }

    upsertPortCategory(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var portCategory = new PortCategoryModel();
        portCategory = this.portCategoryForm.value;
        portCategory.timeStamp = this.timeStamp;
        this.billingDashboardService.upsertPortCategory(portCategory).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPortCategoryPopup.forEach((p) => p.closePopover());
                if(this.timeStamp == null) {
                    this.toastr.success("Prot Category created successfully");
                } else {
                    this.toastr.success("Prot Category updated successfully");
                }
                this.clearForm();
                formDirective.resetForm();
                this.getAllPortCategory();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;

        this.portCategoryForm = new FormGroup({
            id: new FormControl(null,
                Validators.compose([])
            ),
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertPortCategoryPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPortCategoryPopup.forEach((p) => p.closePopover());
    }

    closeDeletePortCategoryPopup() {
        this.clearForm();
        this.deletePortCategoryPopup.forEach((p) => p.closePopover());
    }

    deletePortCategory() {
        this.isAnyOperationIsInprogress = true;
        var portCategory = new PortCategoryModel();
        portCategory = this.rowDetails;
        portCategory.timeStamp = this.timeStamp;
        portCategory.isArchived = !this.isArchived
        this.billingDashboardService.upsertPortCategory(portCategory).subscribe((response: any) => {
            if (response.success === true) {
                this.deletePortCategoryPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPortCategory();
                if(!this.isArchived) {
                    this.toastr.success("Prot Category Archived Successfully");
                } else {
                    this.toastr.success("Prot Category UnArchived Successfully");
                }
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}