import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { ToleranceModel } from "../../models/tolerance.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-trading-component-tolerance",
    templateUrl: "tolerance.component.html"
})
export class ToleranceComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("tolerancePopup") upsertTolerancePopover;
    @ViewChildren("deleteTolerancePopup") deleteTolerancePopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    toleranceList: ToleranceModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    tolerance: string;
    toleranceId: string;
    timeStamp: any;
    toleranceName: string;
    isArchived: boolean;
    isToleranceArchived: boolean;
    toleranceForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    toleranceModel: ToleranceModel;
    productList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllTolerances();
    }

    getAllTolerances() {
        let tolerance = new ToleranceModel();
        tolerance.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllTolerances(tolerance)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.toleranceList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }


    editTolerance(rowDetails, tolerancePopup) {
        this.toleranceForm.patchValue(rowDetails);
        this.toleranceId = rowDetails.toleranceId;
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
         this.tolerance = this.translateService.instant("TOLERANCE.EDITTOLERANCE");
         tolerancePopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((tolerance) =>
            (tolerance.toleranceName.toLowerCase().indexOf(this.searchText) > -1)));
        this.toleranceList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createTolerance(tolerancePopup) {
        tolerancePopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.tolerance = this.translateService.instant("TOLERANCE.CREATETOLERANCE");
    }

    deleteTolerancePopUpOpen(row, deleteTolerancePopup) {
        this.toleranceId = row.toleranceId;
        this.toleranceName = row.toleranceName;
        this.timeStamp = row.timeStamp;
        this.isToleranceArchived = !this.isArchived;
        deleteTolerancePopup.openPopover();
    }

    upsertTolerance(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let tolerance = new ToleranceModel();
        tolerance = this.toleranceForm.value;
        tolerance.toleranceName = tolerance.toleranceName.trim();
        tolerance.toleranceId = this.toleranceId;
        tolerance.timeStamp = this.timeStamp;
        this.BillingDashboardService.upsertTolerance(tolerance).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertTolerancePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTolerances();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.toleranceId = null;
        this.validationMessage = null;
        this.toleranceName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.toleranceModel = null;
        this.timeStamp = null;
        this.toleranceForm = new FormGroup({
            toleranceName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    closeUpsertTolerancePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTolerancePopover.forEach((p) => p.closePopover());
    }

    closeDeleteTolerancePopup() {
        this.clearForm();
        this.deleteTolerancePopup.forEach((p) => p.closePopover());
    }

    deleteTolerance() {
        this.isAnyOperationIsInprogress = true;
        const toleranceModel = new ToleranceModel();
        toleranceModel.toleranceId = this.toleranceId;
        toleranceModel.toleranceName = this.toleranceName;
        toleranceModel.timeStamp = this.timeStamp;
        toleranceModel.isArchived = this.isToleranceArchived;
        this.BillingDashboardService.upsertTolerance(toleranceModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteTolerancePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTolerances();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}