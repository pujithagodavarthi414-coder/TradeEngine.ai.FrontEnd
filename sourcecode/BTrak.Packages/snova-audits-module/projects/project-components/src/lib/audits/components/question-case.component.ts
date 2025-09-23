import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { QuestionModel } from '../models/question.model';
import { QuestionActionTypes, LoadQuestionDeleteTriggered } from '../store/actions/questions.actions';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { Router } from '@angular/router';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';


@Component({
    selector: 'question-case',
    templateUrl: './question-case.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionCaseComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('deleteCasePopover') deleteCasesPopover;
    @ViewChild("questionTitle") questionTitleStatus: ElementRef;
    @Output() questionPreview = new EventEmitter<any>();
    @Output() questionsSelected = new EventEmitter<any>();
    @Output() questionSelection = new EventEmitter<any>();

    @Input() questionSelected: boolean;

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data) {
            this.selectedAudit = data;
            if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
        }
    }

    @Input("questionDetails")
    set _questionDetails(data: any) {
        if (data)
            this.questionDetail = data;
    }

    @Input("allQuestionsSelect")
    set _allQuestionsSelect(data: any) {
        if (data && data.categoryCheckBoxClicked && data.categorySelected && (this.isQuestionSelected == false || this.isQuestionSelected == undefined))
            this.changeSelectStatus(true);
        else if (data && data.categoryCheckBoxClicked && data.categorySelected == false && this.isQuestionSelected)
            this.changeSelectStatus(false);
    }

    public ngDestroyed$ = new Subject();

    deleteCase: any;
    searchTestSuite: any;
    questionDetail: any;
    selectedAudit: any;
    width: any;

    disableDeleteTestCase: boolean = false;
    showTitleTooltip: boolean = false;
    isAuditArchived: boolean = false;
    isQuestionSelected: boolean = false;
    isFromUniquePage: boolean = false;

    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();
    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, public dialog: MatDialog, private router: Router, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();

        if (this.router.url.includes('projects/audit')) {
            this.isFromUniquePage = true;
            this.cdRef.markForCheck();
        }

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionDeleteCompleted),
            tap(() => {
                if (this.deleteCase != undefined && this.deleteCase.questionId == this.questionDetail.questionId) {
                    this.disableDeleteTestCase = false;
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.QuestionFailed),
            tap(() => {
                this.disableDeleteTestCase = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    previewQuestion(qustionData) {
        let data = {
            questionData: qustionData,
            upsertQuestion: false,
            previewQuestion: true
        };
        this.questionPreview.emit(data);
    }

    editQuestion(qustionData) {
        let data = {
            questionData: qustionData,
            upsertQuestion: true,
            previewQuestion: false,
            auditCategoryId: null
        };
        this.questionPreview.emit(data);
    }

    deleteCases(questionDetail, deleteCasePopover) {
        deleteCasePopover.openPopover();
        this.deleteCase = new QuestionModel();
        this.deleteCase = Object.assign({}, questionDetail);
        this.deleteCase.isArchived = true;
    }

    removeTestCase() {
        this.disableDeleteTestCase = true;
        this.store.dispatch(new LoadQuestionDeleteTriggered(this.deleteCase));
    }

    closeDeleteCaseDialog() {
        this.deleteCasesPopover.forEach((p) => p.closePopover());
    }

    changeSelectStatus(value) {
        this.isQuestionSelected = value;
        this.questionSelection.emit(this.questionDetail.questionId);
    }

    changeStatus(value) {
        this.isQuestionSelected = value;
        this.questionsSelected.emit(this.questionDetail.questionId);
    }

    checkTitleTooltipStatus() {
        if (this.questionTitleStatus.nativeElement.scrollWidth > this.questionTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    goToProfilePage(userId) {
        this.router.navigateByUrl('dashboard/profile/' + userId + '/overview');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}