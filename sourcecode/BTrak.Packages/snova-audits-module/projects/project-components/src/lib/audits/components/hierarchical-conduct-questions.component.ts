import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import "../../globaldependencies/helpers/fontawesome-icons";

import * as auditModuleReducer from "../store/reducers/index";

import { QuestionModel } from "../models/question.model";
import { QuestionActionTypes, LoadQuestionReorderTriggered } from "../store/actions/questions.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

// import { AppBaseComponent } from "app/shared/components/componentbase";
// import { ConductQuestionModel } from "../models/conduct-question.model";

@Component({
    selector: "hierarchical-conduct-questions",
    templateUrl: "./hierarchical-conduct-questions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HierarchicalConductQuestionsComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() questionPreview = new EventEmitter<any>();

    @Input("hierarchicalData")
    set _hierarchicalData(data: any) {
        if (data) {
            this.hierarchicalData = data;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
        }
    }

    @Input("questionsData")
    set _questionsData(data: any) {
        if (data) {
            this.questions = data;
            this.questions$ = this.store.pipe(select(auditModuleReducer.getHierarchicalQuestionsForConductsByCategoryId, { auditCategoryId: this.hierarchicalData.auditCategoryId }));
            this.questions$.subscribe(result => {
                //this.questionsCount = result.length;
                this.questionsForLoop = result;
                this.questionsCount = result.filter(i => i.canView == true).length;
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
        }
    }

    questions$: Observable<QuestionModel[]>;

    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    questionsModel = [];
    questionsForLoop: QuestionModel[];
    questions: any;
    hierarchicalData: any;
    questionFromPreview: any;
    selection: any;
    selectedConduct: any;

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
    constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsForConductsTriggered),
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

    getQuestionStatusPreview(data) {
        this.questionPreview.emit(data);
    }

    canViewFilter(data) {
        return data.filter(i => i.canView == true);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}