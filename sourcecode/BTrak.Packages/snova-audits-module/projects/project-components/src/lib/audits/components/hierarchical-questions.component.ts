import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import "../../globaldependencies/helpers/fontawesome-icons";

import * as auditModuleReducer from "../store/reducers/index";

import { QuestionModel } from "../models/question.model";
import { QuestionActionTypes, LoadQuestionReorderTriggered } from "../store/actions/questions.actions";

// import { AppBaseComponent } from "app/shared/components/componentbase";
import { ConductQuestionModel } from "../models/conduct-question.model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import'rxjs/add/operator/do';
import'rxjs/add/operator/switchMap';
import'rxjs/add/operator/takeUntil';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditActionTypes } from '../store/actions/audits.actions';
import { AuditService } from '../services/audits.service';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "hierarchical-questions",
    templateUrl: "./hierarchical-questions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService]
})

export class HierarchicalQuestionsComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() questionPreview = new EventEmitter<any>();
    @Output() questionsSelected = new EventEmitter<any>();
    @Output() questionSelection = new EventEmitter<any>();

    @Input("hierarchicalData")
    set _hierarchicalData(data: any) {
        if (data) {
            this.hierarchicalData = data;
        }
    }

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

    @Input("questionsData")
    set _questionsData(data: any) {
        if (data) {
            this.questions = data;
            this.questions$ = this.store.pipe(select(auditModuleReducer.getHierarchicalQuestionsFilterByCategoryId, { auditCategoryId: this.hierarchicalData.auditCategoryId }));
            this.questions$.subscribe(result => {
                this.questionsCount = result.length;
                this.questionsModel = result;
                this.cdRef.markForCheck();
            });
        }
    }

    @Input("selectedQuestion")
    set _selectedQuestion(data: any) {
        if (data) {
            this.questionFromPreview = data;
            this.handleClick(data);
        }
        else {
            this.questionFromPreview = null;
            this.selectedQuestionId = null;
            this.cdRef.markForCheck();
        }
    }

    @Input("allQuestionsSelect")
    set _allQuestionsSelect(data: any) {
        if (data) {
            this.selection = data;
            if (data.categoryCheckBoxClicked && data.categorySelected && (this.isMultiQuestionsSelected == false || this.isMultiQuestionsSelected == undefined))
                this.isMultiQuestionsSelected = true;
            else if (data.categoryCheckBoxClicked && data.categorySelected == false && this.isMultiQuestionsSelected)
                this.isMultiQuestionsSelected = false;
        }
    }

    questions$: Observable<QuestionModel[]>;
    reOrderOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    questionsModel = [];

    questions: any;
    hierarchicalData: any;
    questionFromPreview: any;
    selection: any;
    selectedAudit: any;

    selectedQuestionId: string;
    questionsCount: number = 0;
    hierarchicalSectionId: string;
    disableAddCase: boolean = false;
    isAuditArchived: boolean = false;
    isAnyOfQuestionsSelected: boolean = false;
    isMultiQuestionsSelected: boolean = false;
    reOrderOperationInProgress: boolean = false;
    totalEstimate: number = 0;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private dragulaService: DragulaService, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private auditService: AuditService, private softLabelsPipe: SoftLabelPipe) {
        super();

        this.reOrderOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsReorderLoading));

        dragulaService.createGroup("questions", {
            revertOnSpill: true
            // removeOnSpill: true
        });

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionListTriggered),
            tap(() => {
                this.questionFromPreview = null;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.QuestionFailed),
                tap(() => {
                    this.disableAddCase = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionByIdTriggered),
            tap(() => {
                this.questionFromPreview = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionReorderCompleted),
            tap(() => {
                this.dragulaService.find('questions').drake.cancel(true);
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadMoveQuestionsCompleted),
            tap(() => {
                this.isMultiQuestionsSelected = false;
                this.isAnyOfQuestionsSelected = false;
                this.selection = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$
        .pipe(
          takeUntil(this.ngDestroyed$),
          ofType(AuditActionTypes.LoadAuditByIdCompleted),
          tap((result: any) => {
              if (result && result.searchAudits.length > 0) {
                  let auditData = result.searchAudits[0];
                  if (this.selectedAudit && this.selectedAudit.auditId == auditData.auditId) {
                      this.selectedAudit = auditData;
                      this.auditService.assignUpdatedAudit(this.selectedAudit);
                      this.cdRef.detectChanges()
                  }
              }
          })
        ).subscribe();

        this.subs.add(this.dragulaService.drag("questions")
            .subscribe(({ el }) => {
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderOperationInProgress = x);
                if (this.reOrderOperationInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                    this.dragulaService.find('questions').drake.cancel(true);
                }
            })
        );

        this.subs.add(this.dragulaService.drop("questions")
            .takeUntil(this.ngDestroyed$)
            .subscribe(({ name, el, target, source, sibling }) => {
                var orderedListLength = target.children.length;
                let orderedTestCaseList = [];
                for (var i = 1; i < orderedListLength; i++) {
                    var questionId = target.children[i].attributes["data-questionid"].value;
                    orderedTestCaseList.push(questionId.toLowerCase());
                }
                this.store.dispatch(new LoadQuestionReorderTriggered(orderedTestCaseList));
            })
        );
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    handleClick(data) {
        this.selectedQuestionId = data.questionId;
        this.cdRef.markForCheck();
    }

    upsertAuditQuestion() {
        let data = {
            questionData: null,
            upsertQuestion: true,
            previewQuestion: false,
            auditCategoryId: this.hierarchicalData.auditCategoryId
        };
        this.questionPreview.emit(data);
    }

    getQuestionPreviewDetails(data) {
        this.questionPreview.emit(data);
    }

    getQuestionSelection(data) {
        this.questionSelection.emit(data);
    }

    getQuestionsSelected(data) {
        this.questionsSelected.emit(data);
    }

    changeStatus(value) {
        this.isMultiQuestionsSelected = value;
        if (value)
            this.isAnyOfQuestionsSelected = true;
        else
            this.isAnyOfQuestionsSelected = false;
        let selections = new ConductQuestionModel();
        selections.categoryCheckBoxClicked = true;
        selections.categorySelected = value;
        this.selection = selections;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
        this.dragulaService.destroy("questions");
    }
}