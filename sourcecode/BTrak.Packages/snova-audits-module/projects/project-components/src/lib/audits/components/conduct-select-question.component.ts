import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import "../../globaldependencies/helpers/fontawesome-icons";

import { ConductQuestionModel } from "../models/conduct-question.model";

@Component({
    selector: "conduct-select-question",
    templateUrl: "./conduct-select-question.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductSelectQuestionComponent {
    @ViewChild("conductQuestionsTitle") conductQuestionsTitleStatus: ElementRef;

    @Output() selectedQuestion = new EventEmitter<any>();
    @Output() selectedQuestionAllNone = new EventEmitter<any>();
    @Output() unselectCategory = new EventEmitter<any>();
    @Output() checkCategory = new EventEmitter<any>();

    @Input("questionDetails")
    set _questionDetails(data: any) {
        if (data) {
            this.questionDetail = data;
            this.checkSelectedOrNot();
        }
    }

    @Input("selectedCategory")
    set _selectedCategory(data: any) {
        if (data != undefined && data != null && (data.categorySelected == false || data.categorySelected == true)) {
            this.checkQuestionSelectByCategory(data);
        }
    }

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        if (data == true || data == false) {
            if (data && (this.isQuestionSelected == false || this.isQuestionSelected == undefined))
                this.isQuestionSelected = true;
            else if (data == false && this.isQuestionSelected)
                this.isQuestionSelected = false;
        }
    }

    @Input("checkFilterQuestions")
    set _checkFilterQuestions(data: any) {
        if (data && data.length > 0) {
            let selectedQuestions = [];
            selectedQuestions = data;
            if (selectedQuestions.findIndex(x => x.questionId == this.questionDetail.questionId) != -1)
                this.isQuestionSelected = true;
            else
                this.isQuestionSelected = false;
        }
        else if (data != undefined && data.length == 0) {
            this.isQuestionSelected = false;
        }
    }

    selectedQuestionDetails: ConductQuestionModel;

    questionDetail: any;
    casesForAddRun: any;
    isQuestionSelected: boolean;
    showTitleTooltip: boolean = false;

    constructor(public dialog: MatDialog) { }

    checkSelectedOrNot() {
        if (localStorage.getItem('selectedQuestions') != null) {
            let selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
            if (selectedQuestions.findIndex(x => x.questionId == this.questionDetail.questionId) != -1)
                this.isQuestionSelected = true;
            else
                this.isQuestionSelected = false;
        }
    }

    checkQuestionSelectByCategory(data) {
        if (this.questionDetail && data.categorySelected && data.auditCategoryId == this.questionDetail.auditCategoryId && (this.isQuestionSelected == undefined || this.isQuestionSelected == false)) {
            this.isQuestionSelected = true;
            this.changeStatusForQuestion(this.isQuestionSelected);
        }
        else if (this.questionDetail && data.categoryCheckBoxClicked && data.categorySelected == false && data.auditCategoryId == this.questionDetail.auditCategoryId && this.isQuestionSelected) {
            this.isQuestionSelected = false;
        }
    }

    changeStatusForQuestion(value) {
        this.isQuestionSelected = value;
        this.selectedQuestionDetails = new ConductQuestionModel();
        this.selectedQuestionDetails.questionId = this.questionDetail.questionId;
        this.selectedQuestionDetails.auditCategoryId = this.questionDetail.auditCategoryId;
        this.selectedQuestionAllNone.emit(this.selectedQuestionDetails);
    }

    changeStatus(value) {
        this.isQuestionSelected = value;
        this.selectedQuestionDetails = new ConductQuestionModel();
        this.selectedQuestionDetails.questionId = this.questionDetail.questionId;
        this.selectedQuestionDetails.auditCategoryId = this.questionDetail.auditCategoryId;
        this.selectedQuestion.emit(this.selectedQuestionDetails);
        if (this.isQuestionSelected == false) {
            this.unselectCategory.emit(this.questionDetail.auditCategoryId);
        }
        if (this.isQuestionSelected)
            this.checkCategory.emit(this.questionDetail.auditCategoryId);
    }

    checkTitleTooltipStatus() {
        if (this.conductQuestionsTitleStatus.nativeElement.scrollWidth > this.conductQuestionsTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }
}