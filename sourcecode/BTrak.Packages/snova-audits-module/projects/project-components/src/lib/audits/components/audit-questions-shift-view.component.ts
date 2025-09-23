import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";

@Component({
    selector: "audit-questions-shift-view",
    templateUrl: "./audit-questions-shift-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditQuestionsShiftViewComponent {
    @Output() selectedCategoryData = new EventEmitter<any>();
    @Output() selectedCategories = new EventEmitter<any>();
    
    @Input() category: any;
    @Input() unSelectCategoryId: any;
    @Input() categoryToCheck: any;
    @Input() categorySelected: any;
    @Input() selectAllNone: any;
    @Input() checkFilterQuestions: any;

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
}