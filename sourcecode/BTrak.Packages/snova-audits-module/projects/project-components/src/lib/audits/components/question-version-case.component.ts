import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { QuestionModel } from '../models/question.model';
import { QuestionActionTypes, LoadQuestionDeleteTriggered } from '../store/actions/questions.actions';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { Router } from '@angular/router';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';


@Component({
    selector: 'question-version-case',
    templateUrl: './question-version-case.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionVersionCaseComponent extends AppFeatureBaseComponent implements OnInit {
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
    set _allQuestionsSelect(data: any) { }

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
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, public dialog: MatDialog, private router: Router, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();

        if (this.router.url.includes('projects/audit')) {
            this.isFromUniquePage = true;
            this.cdRef.markForCheck();
        }

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