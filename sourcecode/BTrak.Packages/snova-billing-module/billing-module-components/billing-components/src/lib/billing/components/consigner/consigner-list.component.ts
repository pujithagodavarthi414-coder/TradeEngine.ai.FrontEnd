import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { PaymentTermModel } from "../../models/payment-term.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-consigner-list-component",
    templateUrl: "consigner-list.component.html"
})

export class ConsignerListComponent extends AppBaseComponent implements OnInit {
    
    @ViewChildren("consigneePopup") upsertConsigneePopover;
    @ViewChildren("deleteConsigneePopup") deleteConsigneePopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    consigneeList: PaymentTermModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    consignee: string;
    id: string;
    timeStamp: any;
    consigneeName: string;;
    isArchived: boolean;
    isConsigneeArchived: boolean;
    consigneeForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    ConsigneesModel: PaymentTermModel;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef) {
                    super();
                    this.isArchived=false;
    }

    ngOnInit() {
       super.ngOnInit();
        this.clearForm();
        this.getAllConsignees();
    }

    getAllConsignees() {
        let consignee = new PaymentTermModel();
        consignee.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.GetAllConsigners(consignee)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.consigneeList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    
    editConsignee(rowDetails, consigneePopup) {
        this.consigneeForm.patchValue(rowDetails);
        this.id = rowDetails.id;
        this.consignee = this.translateService.instant("CONSIGNER.EDITCONSIGNER");
        consigneePopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((consignee) =>
            (consignee.name.toLowerCase().indexOf(this.searchText) > -1)));
        this.consigneeList =temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createConsignee(consigneePopup) {
        consigneePopup.openPopover();
        this.consignee = this.translateService.instant("CONSIGNER.ADDCONSIGNER");
    }

    deleteConsigneePopUpOpen(row, deleteConsigneePopup) {
        this.id = row.id;
        this.consigneeName = row.name;
        this.timeStamp = row.timeStamp;
        this.isConsigneeArchived = !this.isArchived;
        deleteConsigneePopup.openPopover();
    }

    upsertConsignee(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let consignee = new PaymentTermModel();
        consignee = this.consigneeForm.value;
        consignee.name = consignee.name.trim();
        consignee.id = this.id;
        consignee.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertConsigner(consignee).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertConsigneePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllConsignees();
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
        this.consigneeName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.ConsigneesModel = null;
        this.timeStamp = null;
        this.consigneeForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            )
        })
    }

    closeUpsertConsigneePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertConsigneePopover.forEach((p) => p.closePopover());
    }

    closeDeleteConsigneePopup() {
        this.clearForm();
        this.deleteConsigneePopup.forEach((p) => p.closePopover());
    }

    deleteConsignee() {
        this.isAnyOperationIsInprogress = true;
        const ConsigneesModel = new PaymentTermModel();
        ConsigneesModel.id = this.id;
        ConsigneesModel.name = this.consigneeName;
        ConsigneesModel.timeStamp = this.timeStamp;
        ConsigneesModel.isArchived = this.isConsigneeArchived;
        this.BillingDashboardService.upsertConsigner(ConsigneesModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteConsigneePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllConsignees();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}