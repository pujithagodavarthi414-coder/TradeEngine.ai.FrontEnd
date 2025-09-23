import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { PaymentTermModel } from "../../models/payment-term.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-port-details-component",
    templateUrl: "port-details.component.html"
})

export class PortDetailsComponent extends AppBaseComponent implements OnInit {
    
    @ViewChildren("portDetailPopup") upsertPortDetailPopover;
    @ViewChildren("deletePortDetailPopup") deletePortDetailPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    portDetailList: PaymentTermModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    portDetail: string;
    id: string;
    timeStamp: any;
    portDetailName: string;;
    isArchived: boolean;
    isPortDetailArchived: boolean;
    portDetailForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    PortDetailsModel: PaymentTermModel;
    portCategoryList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef) {
                    super();
                    this.isArchived=false;
    }

    ngOnInit() {
       super.ngOnInit();
        this.clearForm();
        this.getAllPortDetails();
        this.getAllPortCategory();
    }

    getAllPortDetails() {
        let portDetail = new PaymentTermModel();
        portDetail.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.GetAllPortDetails(portDetail)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.portDetailList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    getAllPortCategory() {
        let portCategory = {};
        portCategory["isArchived"] = false;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllPortCategory(portCategory)
        .subscribe((responseData: any) => {
            if(responseData.success) {
                this.portCategoryList = responseData.data;
            } else {
                this.portCategoryList = [];
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    
    editPortDetail(rowDetails, portDetailPopup) {
        this.portDetailForm.patchValue(rowDetails);
        this.id = rowDetails.id;
        this.portDetail = this.translateService.instant("PORTDETAIL.EDITPORTDETAIL");
        portDetailPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((portDetail) =>
            (portDetail.name.toLowerCase().indexOf(this.searchText) > -1)));
        this.portDetailList =temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createPortDetail(portDetailPopup) {
        portDetailPopup.openPopover();
        this.portDetail = this.translateService.instant("PORTDETAIL.ADDPORTDETAIL");
    }

    deletePortDetailPopUpOpen(row, deletePortDetailPopup) {
        this.id = row.id;
        this.portDetailName = row.name;
        this.timeStamp = row.timeStamp;
        this.isPortDetailArchived = !this.isArchived;
        deletePortDetailPopup.openPopover();
    }

    upsertPortDetail(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let portDetail = new PaymentTermModel();
        portDetail = this.portDetailForm.value;
        portDetail.name = portDetail.name.trim();
        portDetail.id = this.id;
        portDetail.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertPortDetails(portDetail).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertPortDetailPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPortDetails();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.id = null;
        this.validationMessage = null;
        this.portDetailName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.PortDetailsModel = null;
        this.timeStamp = null;
        this.portDetailForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ), 
            portCategoryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeUpsertPortDetailPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPortDetailPopover.forEach((p) => p.closePopover());
    }

    closeDeletePortDetailPopup() {
        this.clearForm();
        this.deletePortDetailPopup.forEach((p) => p.closePopover());
    }

    deletePortDetail() {
        this.isAnyOperationIsInprogress = true;
        const PortDetailsModel = new PaymentTermModel();
        PortDetailsModel.id = this.id;
        PortDetailsModel.name = this.portDetailName;
        PortDetailsModel.timeStamp = this.timeStamp;
        PortDetailsModel.isArchived = this.isPortDetailArchived;
        this.BillingDashboardService.upsertPortDetails(PortDetailsModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletePortDetailPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPortDetails();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}