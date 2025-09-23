import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// import { ConstantVariables } from '../dependencies/constants/constant-variables';

import { QuestionModel } from '../models/question.model';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';

import * as auditModuleReducer from "../store/reducers/index";
import { QuestionActionTypes, LoadSingleQuestionByIdTriggered } from '../store/actions/questions.actions';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'question-preview',
    templateUrl: './question-preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionPreviewComponent extends CustomAppBaseComponent implements OnInit{
    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionDetails = data;
            this.singleQuestionDetails = data;
            this.loadQuestionDetails(this.questionDetails);
            this.questionId = this.questionDetails.questionId;
            this.isFormType = true;
            this.auditId = this.questionDetails.auditId;
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    questionDetails: any;
    singleQuestionDetails: any;
    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();
    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    testCaseMissionFilePath = [];
    testCaseGoalFilePath = [];
    testCaseFilePath = [];
    moduletypeId:number  = 90;
    loadDetails: boolean = false;
    showExploratory: boolean = false;
    showSteps: boolean = false;
    showText: boolean = false;
    hiddenvalue:boolean = false;
    questionId: any ;
    isFormType:any;
    auditId:any;
    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
        super();
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getSingleQuestionLoading));
        this.getSoftLabelConfigurations();
        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadSingleQuestionByIdTriggered),
            tap(() => {
                this.loadDetails = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadSingleQuestionByIdCompleted),
            tap((result: any) => {
                if (result && result.searchQuestions.length > 0) {
                    this.singleQuestionDetails = result.searchQuestions[0];
                    this.loadDetails = true;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        //this.getSoftLabels();
    }

       
getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
}

    getSoftLabels() {
        this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    loadQuestionDetails(caseDetails) {
        let model = new QuestionModel();
        model.auditCategoryId = caseDetails.auditCategoryId;
        model.questionId = caseDetails.questionId;
        model.isArchived = false;
        // if (caseDetails.isForViewHistory)
        //     model.isForViewHistory = true;
        // else
        //     model.isForViewHistory = false;
        this.store.dispatch(new LoadSingleQuestionByIdTriggered(model));
    }

    sanitizeUrl(imgUrl): SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }

    getDescriptionhiddenValue(){
        this.hiddenvalue  = this.hiddenvalue == true ? false : true;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}