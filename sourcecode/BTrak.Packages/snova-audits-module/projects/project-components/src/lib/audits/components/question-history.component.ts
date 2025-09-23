import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { DomSanitizer } from '@angular/platform-browser';

import { QuestionModel } from '../models/question.model';

import * as auditModuleReducer from "../store/reducers/index";

import { QuestionActionTypes, LoadSingleQuestionByIdTriggered, LoadQuestionHistoryTriggered } from '../store/actions/questions.actions';
import { QuestionHistoryModel } from '../models/question-history.model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'question-history',
    templateUrl: './question-history.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionHistoryComponent {
    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            this.isFromAudits = false;
        }
        else {
            this.isFromAudits = true;
        }
    }

    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionDetails = data;
            this.loadQuestionHistory(this.questionDetails);
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    questionHistory$: Observable<QuestionHistoryModel[]>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    questionDetails: any;
    selectedConduct: any;
    loadDetails: boolean = false;
    isFromAudits: boolean = false;
    isQuestionViewed: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionHistoryLoading));
        this.getSoftLabelConfigurations();
    }

    ngOnInit() {
       // this.getSoftLabels();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadQuestionHistory(caseDetails) {
        let model = new QuestionModel();
        model.questionId = caseDetails.questionId;
        if (!this.isFromAudits)
            model.conductId = this.selectedConduct.conductId;
        model.isArchived = false;
        this.store.dispatch(new LoadQuestionHistoryTriggered(model));
        this.questionHistory$ = this.store.pipe(select(auditModuleReducer.getQuestionHistory));
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}