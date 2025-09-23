import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { GradeModel } from "../../models/grade.model";
import { ProductTableModel } from "../../models/product-table.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
@Component({
    selector: "app-billing-component-grade",
    templateUrl: "grade.component.html"
})

export class GradeComponent extends AppBaseComponent implements OnInit {
    
    @ViewChildren("gradePopup") upsertGradePopover;
    @ViewChildren("deleteGradePopup") deleteGradePopup;

    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    temp: any;
    gradeList: GradeModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    grade: string;
    gradeId: string;
    timeStamp: any;
    gradeName: string;productId: any;
    gstCode: any;
;
    isArchived: boolean;
    isGradeArchived: boolean;
    gradeForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    gradeModel: GradeModel;
    productList: any;

    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
                private cdRef: ChangeDetectorRef) {
                    super();
    }

    ngOnInit() {
       super.ngOnInit();
        this.clearForm();
        this.getAllGrades();
        this.getAllProducts();
    }

    getAllGrades() {
        let grade = new GradeModel();
        grade.isArchived = this.isArchived;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllGrades(grade)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.gradeList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    getAllProducts() {
        let product = new ProductTableModel();
        product.isArchived = false;
        this.BillingDashboardService.getProducts(product)
            .subscribe((responseData: any) => {
                this.productList = responseData.data;
            });
    }

    
    editGrade(rowDetails, gradePopup) {
        this.gradeForm.patchValue(rowDetails);
        this.gradeId = rowDetails.gradeId;
        this.grade = this.translateService.instant("BILLINGGRADE.EDITGRADE");
        gradePopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((grade) =>
            (grade.gradeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.gradeList =temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createGrade(gradePopup) {
        gradePopup.openPopover();
        this.grade = this.translateService.instant("BILLINGGRADE.ADDGRADE");
    }

    deleteGradePopUpOpen(row, deleteGradePopup) {
        this.gradeId = row.gradeId;
        this.productId = row.productId;
        this.gradeName = row.gradeName;
        this.gstCode = row.gstCode;
        this.timeStamp = row.timeStamp;
        this.isGradeArchived = !this.isArchived;
        deleteGradePopup.openPopover();
    }

    upsertGrade(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let grade = new GradeModel();
        grade = this.gradeForm.value;
        grade.gradeName = grade.gradeName.trim();
        grade.gradeId = this.gradeId;
        grade.timeStamp = this.timeStamp;
        this.BillingDashboardService.upertGrade(grade).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllGrades();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.gradeId = null;
        this.validationMessage = null;
        this.gradeName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.gradeModel = null;
        this.timeStamp = null;
        this.gradeForm = new FormGroup({
            gradeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            productId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            gstCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(10)
                ])
            )
        })
    }

    closeUpsertGradePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertGradePopover.forEach((p) => p.closePopover());
    }

    closeDeleteGradePopup() {
        this.clearForm();
        this.deleteGradePopup.forEach((p) => p.closePopover());
    }

    deleteGrade() {
        this.isAnyOperationIsInprogress = true;
        const gradeModel = new GradeModel();
        gradeModel.gradeId = this.gradeId;
        gradeModel.productId = this.productId;
        gradeModel.gradeName = this.gradeName;
        gradeModel.gstCode = this.gstCode;
        gradeModel.timeStamp = this.timeStamp;
        gradeModel.isArchived = this.isGradeArchived;
        this.BillingDashboardService.upertGrade(gradeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteGradePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllGrades();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}