import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import "../../globaldependencies/helpers/fontawesome-icons";

import { ConductQuestionModel } from "../models/conduct-question.model";
import { QuestionActionTypes } from "../store/actions/questions.actions";

@Component({
    selector: "audit-questions-subcategories-shift",
    templateUrl: "./audit-questions-subcategories-shift.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditQuestionsSubcategoriesShiftComponent {
    @ViewChild("conductQuestionCategoryName") conductQuestionCategoryNameStatus: ElementRef;

    @Output() selectedCategoryData = new EventEmitter<any>();
    @Output() selectedCategories = new EventEmitter<any>();
    @Output() multiCategories = new EventEmitter<any>();
    @Output() changeTreeStructre = new EventEmitter<boolean>();

    @Input("unSelectCategoryId")
    set _unSelectCategoryId(data: any) {
        if (data) {
            this.unSelectCategoryId = data;
            if (this.categoriesData && this.unSelectCategoryId == this.categoriesData.auditCategoryId)
                this.checkToUnselectCategory();
        }
    }

    @Input("categoryToCheck")
    set _categoryToCheck(data: any) {
        if (data) {
            this.categoryToCheck = data;
            if (this.categoriesData && this.categoryToCheck.auditCategoryId == this.categoriesData.auditCategoryId)
                this.checkToSelectCategory();
        }
    }

    @Input("categoryData")
    set _categoryData(data: any) {
        if (data) {
            this.categoriesData = data;
            if (this.categoriesData.subAuditCategories && this.categoriesData.subAuditCategories.length != 0)
                this.isChildsPresent = true;
            else
                this.isChildsPresent = false;
            // this.checkSelectedOrNot();
        }
    }

    @Input("categorySelected")
    set _categorySelected(data: any) {
        if (data) {
            if (this.categoriesData && data == this.categoriesData.auditCategoryId)
                this.isCategorySelectedOrNot = true;
            else
                this.isCategorySelectedOrNot = false;
        }
    }

    @Input("categoryCollapse")
    set _categoryCollapse(data: boolean) {
        if (data || data == false) {
            this.treeStructure = data;
        }
    }

    @Input("inputMultiCategories")
    set _inputMultiCategories(data: any) {
        if (data) {
            if (data.auditCategoryId == this.categoriesData.parentAuditCategoryId && data.categoryCheckBoxClicked && data.categorySelected != this.isCategorySelected) {
                this.checkMultiCategories(data.categorySelected);
            }
            else if (data.auditCategoryId == this.categoriesData.auditCategoryId && data.categoryCheckBoxClicked && data.categorySelected != this.isCategorySelected
                && this.categoriesData.subAuditCategories && this.categoriesData.subAuditCategories.length > 0) {
                this.checkMultiCategories(data.categorySelected);
            }
            else if (data.auditCategoryId != this.categoriesData.auditCategoryId && data.categoryCheckBoxClicked && data.categorySelected == false
                && (this.isCategorySelected == false || this.isCategorySelected == undefined)) {
                if (localStorage.getItem('selectedQuestions') != null && localStorage.getItem('selectedQuestions') != 'undefined') {
                    let selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
                    if (selectedQuestions.findIndex(x => x.auditCategoryId == this.categoriesData.auditCategoryId) != -1) {
                        this.unselectAllQuestionsByChangingParent();
                    }
                }
            }
        }
    }

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        if (data == true || data == false) {
            if (data && (this.isCategorySelected == false || this.isCategorySelected == undefined)) {
                this.isCategorySelected = true;
                this.countQuestionsSelected(this.isCategorySelected, true);
            }
            else if (data == false && this.isCategorySelected) {
                this.isCategorySelected = false;
                this.countQuestionsSelected(this.isCategorySelected, true);
            }
            else if (data == false && (this.isCategorySelected == false || this.isCategorySelected == undefined)) {
                this.isCategorySelected = false;
                this.countQuestionsSelected(this.isCategorySelected, true);
            }
        }
    }

    @Input("checkFilterQuestions")
    set _checkFilterQuestions(data: any) {
        if (data && data.length > 0) {
            let selectedQuestions = [];
            selectedQuestions = data;
            let index = selectedQuestions.findIndex(x => x.auditCategoryId == this.categoriesData.auditCategoryId);
            if (index != -1 && selectedQuestions[index].isChecked) {
                this.isCategorySelected = true;
                this.countQuestionsSelected(this.isCategorySelected, true);
            }
            else {
                this.isCategorySelected = false;
                this.countQuestionsSelected(false, false);
            }
        }
        else if (data != undefined && data.length == 0) {
            this.isCategorySelected = false;
            this.countQuestionsSelected(false, true);
        }
    }

    public ngDestroyed$ = new Subject();

    categoriesData: any;
    unSelectCategoryId: any;
    categoryToCheck: any;
    noOfQuestionsSelected: number = 0;
    isCategorySelected: boolean;
    checkDisable: boolean;
    treeStructure: boolean = false;
    isChildsPresent: boolean = false;
    isCategorySelectedOrNot: boolean = false;
    showTitleTooltip: boolean = false;

    constructor(private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
            tap(() => {
                this.checkDisable = true;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted),
            tap(() => {
                this.checkDisable = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();
    }

    getQuestion() {
        let selectedQuestionDetails = new ConductQuestionModel();
        selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
        selectedQuestionDetails.categorySelected = this.isCategorySelected;
        selectedQuestionDetails.categoryCheckBoxClicked = false;
        selectedQuestionDetails.unselectCategory = false;
        selectedQuestionDetails.selectCategory = false;
        selectedQuestionDetails.unselectAllQuestions = false;
        selectedQuestionDetails.categoriesAllNone = false;
        this.selectedCategoryData.emit(this.categoriesData);
        this.selectedCategories.emit(selectedQuestionDetails);
        this.multiCategories.emit(null);
    }

    checkSelectedOrNot() {
        if (localStorage.getItem('selectedCategories') != 'undefined' && localStorage.getItem('selectedCategories') != null) {
            let selectedCategories = JSON.parse(localStorage.getItem('selectedCategories'));
            if (selectedCategories.indexOf(this.categoriesData.auditCategoryId) != -1) {
                this.isCategorySelected = true;
                this.countQuestionsSelected(this.isCategorySelected, true);
            }
            else {
                this.isCategorySelected = false;
                this.countQuestionsSelected(this.isCategorySelected, false);
            }
        }
    }

    checkToUnselectCategory() {
        if (this.categoriesData && this.unSelectCategoryId && this.unSelectCategoryId == this.categoriesData.auditCategoryId && this.isCategorySelected) {
            this.isCategorySelected = false;
            let selectedQuestionDetails = new ConductQuestionModel();
            selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
            selectedQuestionDetails.categoryCheckBoxClicked = false;
            selectedQuestionDetails.unselectCategory = true;
            selectedQuestionDetails.selectCategory = false;
            selectedQuestionDetails.unselectAllQuestions = false;
            selectedQuestionDetails.categoriesAllNone = false;
            this.selectedCategories.emit(selectedQuestionDetails);
        }
        if (this.categoriesData && this.unSelectCategoryId && this.unSelectCategoryId == this.categoriesData.auditCategoryId) {
            this.countQuestionsSelected(this.isCategorySelected, false);
        }
    }

    checkToSelectCategory() {
        if (this.categoriesData && this.categoryToCheck && this.categoryToCheck.auditCategoryId == this.categoriesData.auditCategoryId && (this.isCategorySelected == undefined || this.isCategorySelected == false)) {
            if (localStorage.getItem('selectedQuestions') != 'undefined' && localStorage.getItem('selectedQuestions') != null) {
                let selectedQuestions = [];
                selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
                let count = 0;
                selectedQuestions.forEach(x => {
                    if (x.auditCategoryId == this.categoryToCheck.auditCategoryId)
                        count = count + 1;
                })
                if (count == this.categoryToCheck.questionsSelected) {
                    this.isCategorySelected = true;
                    this.countQuestionsSelected(this.isCategorySelected, true);
                    let selectedQuestionDetails = new ConductQuestionModel();
                    selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
                    selectedQuestionDetails.categoryCheckBoxClicked = false;
                    selectedQuestionDetails.unselectCategory = false;
                    selectedQuestionDetails.selectCategory = true;
                    selectedQuestionDetails.unselectAllQuestions = false;
                    selectedQuestionDetails.categoriesAllNone = false;
                    this.selectedCategories.emit(selectedQuestionDetails);
                }
                else
                    this.countQuestionsSelected(false, false);
            }
        }
    }

    changeStatus(value) {
        this.isCategorySelected = value;
        this.countQuestionsSelected(value, true);
        let selectedQuestionDetails = new ConductQuestionModel();
        selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
        selectedQuestionDetails.categorySelected = value;
        selectedQuestionDetails.categoryCheckBoxClicked = true;
        selectedQuestionDetails.unselectCategory = false;
        selectedQuestionDetails.selectCategory = false;
        selectedQuestionDetails.unselectAllQuestions = false;
        selectedQuestionDetails.categoriesAllNone = false;
        this.selectedCategories.emit(selectedQuestionDetails);
        this.multiCategories.emit(selectedQuestionDetails);
        this.cdRef.detectChanges();
    }

    checkMultiCategories(value) {
        this.isCategorySelected = value;
        this.countQuestionsSelected(this.isCategorySelected, true);
        let selectedQuestionDetails = new ConductQuestionModel();
        selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
        selectedQuestionDetails.categorySelected = value;
        selectedQuestionDetails.multiCategories = false;
        selectedQuestionDetails.categoryCheckBoxClicked = true;
        selectedQuestionDetails.unselectCategory = false;
        selectedQuestionDetails.selectCategory = false;
        selectedQuestionDetails.unselectAllQuestions = false;
        selectedQuestionDetails.categoriesAllNone = false;
        this.selectedCategories.emit(selectedQuestionDetails);
    }

    unselectAllQuestionsByChangingParent() {
        let selectedQuestionDetails = new ConductQuestionModel();
        selectedQuestionDetails.auditCategoryId = this.categoriesData.auditCategoryId;
        selectedQuestionDetails.categorySelected = false;
        selectedQuestionDetails.multiCategories = false;
        selectedQuestionDetails.categoryCheckBoxClicked = true;
        selectedQuestionDetails.unselectCategory = false;
        selectedQuestionDetails.selectCategory = false;
        selectedQuestionDetails.unselectAllQuestions = true;
        selectedQuestionDetails.categoriesAllNone = false;
        this.selectedCategories.emit(selectedQuestionDetails);
    }

    showTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(false);
    }

    hideTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(true);
    }

    countQuestionsSelected(value, check) {
        if (value && check) {
            this.noOfQuestionsSelected = this.categoriesData.questionsCount;
            this.cdRef.markForCheck();
        }
        else if ((value == undefined || value == false) && check) {
            this.noOfQuestionsSelected = 0;
            this.cdRef.markForCheck();
        }
        else if (check == false) {
            if (localStorage.getItem('selectedQuestions') != 'undefined' && localStorage.getItem('selectedQuestions') != null) {
                let selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
                let count = 0;
                selectedQuestions.forEach(x => {
                    if (x.auditCategoryId == this.categoriesData.auditCategoryId)
                        count = count + 1;
                });
                this.noOfQuestionsSelected = count;
                this.cdRef.markForCheck();
            }
            else {
                this.noOfQuestionsSelected = 0;
                this.cdRef.markForCheck();
            }
        }
    }

    checkTitleTooltipStatus() {
        if (this.conductQuestionCategoryNameStatus.nativeElement.scrollWidth > this.conductQuestionCategoryNameStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        }
        else {
            this.showTitleTooltip = false;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}