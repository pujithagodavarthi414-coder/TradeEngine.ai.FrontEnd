import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { ConductQuestionModel } from "../models/conduct-question.model";

@Component({
    selector: "conduct-questions-subcategory-view",
    templateUrl: "./conduct-questions-subcategory-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductQuestionsSubcategoryViewComponent {
    @Output() selectedCategoryData = new EventEmitter<any>();
    @Output() selectedCategories = new EventEmitter<any>();
    @Output() categoryQuestionsCount = new EventEmitter<any>();

    @Input() subCategory: any;
    @Input() unSelectCategoryId: any;
    @Input() categoryToCheck: any;
    @Input() categorySelected: any;
    @Input() selectAllNone: any;
    @Input() checkFilterQuestions: any;

    @Input("inputMultiCategories")
    set _inputMultiCategories(data: any) {
        if (data) {
            let selectedCategory = new ConductQuestionModel();
            if (this.subCategory.subAuditCategories && this.subCategory.subAuditCategories.length > 0)
                selectedCategory.auditCategoryId = this.subCategory.auditCategoryId;
            else
                selectedCategory.auditCategoryId = data.auditCategoryId;
            selectedCategory.categorySelected = data.categorySelected;
            selectedCategory.categoryCheckBoxClicked = data.categoryCheckBoxClicked;
            selectedCategory.unselectCategory = data.unselectCategory;
            selectedCategory.selectCategory = data.selectCategory;
            this.multiCategories = selectedCategory;
        }
    }

    @Input("categoryCollapse")
    set _categoryCollapse(data: boolean) {
        if (data || data == false) {
            this.categoryCollapse = data;
            if (data == false)
                this.changeView = true;
            else
                this.changeView = false;
        }
    }

    multiCategories: any;
    changeView: boolean = false;
    categoryCollapse: boolean;

    constructor(private cdRef: ChangeDetectorRef) { }

    getSelectedCategoryData(data) {
        this.selectedCategoryData.emit(data);
        this.cdRef.detectChanges();
    }

    getSelectedCategoryId(data) {
        this.selectedCategories.emit(data);
        this.cdRef.detectChanges();
    }

    getMultiCategories(value) {
        this.multiCategories = value;
        this.cdRef.detectChanges();
    }

    getStructure(value) {
        this.changeView = value;
        this.cdRef.detectChanges();
    }

    getCategoryQuestionsCount(value) {
        this.categoryQuestionsCount.emit(value);
    }
}