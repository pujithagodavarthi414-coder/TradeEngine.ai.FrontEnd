import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../constants/constant-variables";
import { LegalEntityModel } from "../models/legal-entity.model";
import { BillingDashboardService } from '../services/billing-dashboard.service';
import { AppBaseComponent } from "./componentbase";
@Component({
    selector: "app-billing-component-legal-entity",
    templateUrl: "legal-entity.component.html"
})
export class LegalEntityComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("legalEntityPopup") upsertLegalEntityPopover;
    @ViewChildren("deleteLegalEntityPopup") deleteLegalEntityPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    legalEntityList: LegalEntityModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    legalEntity: string;
    legalEntityId: string;
    timeStamp: any;
    legalEntityName: string;
    isArchived: boolean;
    isLegalEntityArchived: boolean;
    legalEntityForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    legalEntityModel: LegalEntityModel;
    productList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllLegalEntitys();
    }

    legalEntityChange() {
        this.isArchived = !this.isArchived;
        this.getAllLegalEntitys();
    }

    getAllLegalEntitys() {
        let legalEntity = new LegalEntityModel();
        legalEntity.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllLegalEntities(legalEntity)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.legalEntityList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editLegalEntity(rowDetails, legalEntityPopup) {
        this.legalEntityForm.patchValue(rowDetails);
        this.legalEntityId = rowDetails.legalEntityId;
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
         this.legalEntity = this.translateService.instant("LEGALENTITY.EDITLEGALENTITY");
         legalEntityPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((legalEntity) =>
            (legalEntity.legalEntityName.toLowerCase().indexOf(this.searchText) > -1)));
        this.legalEntityList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createLegalEntity(legalEntityPopup) {
        legalEntityPopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.legalEntity = this.translateService.instant("LEGALENTITY.ADDLEGALENTITY");
    }

    deleteLegalEntityPopUpOpen(row, deleteLegalEntityPopup) {
        this.legalEntityId = row.legalEntityId;
        this.legalEntityName = row.legalEntityName;
        this.timeStamp = row.timeStamp;
        this.isLegalEntityArchived = !this.isArchived;
        deleteLegalEntityPopup.openPopover();
    }

    upsertLegalEntity(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let legalEntity = new LegalEntityModel();
        legalEntity = this.legalEntityForm.value;
        legalEntity.legalEntityName = legalEntity.legalEntityName.trim();
        legalEntity.legalEntityId = this.legalEntityId;
        legalEntity.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertLegalEntity(legalEntity).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertLegalEntityPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllLegalEntitys();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.legalEntityId = null;
        this.validationMessage = null;
        this.legalEntityName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.legalEntityModel = null;
        this.timeStamp = null;
        this.legalEntityForm = new FormGroup({
            legalEntityName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertLegalEntityPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLegalEntityPopover.forEach((p) => p.closePopover());
    }

    closeDeleteLegalEntityPopup() {
        this.clearForm();
        this.deleteLegalEntityPopup.forEach((p) => p.closePopover());
    }

    deleteLegalEntity() {
        this.isAnyOperationIsInprogress = true;
        const legalEntityModel = new LegalEntityModel();
        legalEntityModel.legalEntityId = this.legalEntityId;
        legalEntityModel.legalEntityName = this.legalEntityName;
        legalEntityModel.timeStamp = this.timeStamp;
        legalEntityModel.isArchived = this.isLegalEntityArchived;
        this.BillingDashboardService.upsertLegalEntity(legalEntityModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteLegalEntityPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllLegalEntitys();
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