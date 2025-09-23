import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { VesselModel } from "../../models/vessel.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-billing-component-vessel",
    templateUrl: "vessel.component.html"
})
export class VesselComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("vesselPopup") upsertVesselPopover;
    @ViewChildren("deleteVesselPopup") deleteVesselPopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    vesselList: VesselModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    vessel: string;
    vesselId: string;
    timeStamp: any;
    vesselName: string;
    isArchived: boolean;
    isVesselArchived: boolean;
    vesselForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    vesselModel: VesselModel;
    productList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllVessels();
    }

    getAllVessels() {
        let vessel = new VesselModel();
        vessel.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllVessels(vessel)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.vesselList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editVessel(rowDetails, vesselPopup) {
        this.vesselForm.patchValue(rowDetails);
        this.vesselId = rowDetails.vesselId;
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
         this.vessel = "Edit vessel";
        vesselPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((vessel) =>
            (vessel.vesselName.toLowerCase().indexOf(this.searchText) > -1)));
        this.vesselList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createVessel(vesselPopup) {
        vesselPopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.vessel = "Add Vessel";
    }

    deleteVesselPopUpOpen(row, deleteVesselPopup) {
        this.vesselId = row.vesselId;
        this.vesselName = row.vesselName;
        this.timeStamp = row.timeStamp;
        this.isVesselArchived = !this.isArchived;
        deleteVesselPopup.openPopover();
    }

    upsertVessel(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let vessel = new VesselModel();
        vessel = this.vesselForm.value;
        vessel.vesselName = vessel.vesselName.trim();
        vessel.vesselId = this.vesselId;
        vessel.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertVessel(vessel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertVesselPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllVessels();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.vesselId = null;
        this.validationMessage = null;
        this.vesselName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.vesselModel = null;
        this.timeStamp = null;
        this.vesselForm = new FormGroup({
            vesselName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertVesselPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertVesselPopover.forEach((p) => p.closePopover());
    }

    closeDeleteVesselPopup() {
        this.clearForm();
        this.deleteVesselPopup.forEach((p) => p.closePopover());
    }

    deleteVessel() {
        this.isAnyOperationIsInprogress = true;
        const vesselModel = new VesselModel();
        vesselModel.vesselId = this.vesselId;
        vesselModel.vesselName = this.vesselName;
        vesselModel.timeStamp = this.timeStamp;
        vesselModel.isArchived = this.isVesselArchived;
        this.BillingDashboardService.upsertVessel(vesselModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteVesselPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllVessels();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}