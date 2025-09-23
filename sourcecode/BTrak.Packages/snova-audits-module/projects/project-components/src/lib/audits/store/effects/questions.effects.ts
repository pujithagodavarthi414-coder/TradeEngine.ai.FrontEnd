import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from 'rxjs/operators';

import { SnackbarOpen } from '../../dependencies/project-store/actions/snackbar.actions';
import { ShowExceptionMessages } from '../../dependencies/project-store/actions/notification-validator.action';
import * as auditModuleReducer from "../reducers";

import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';

import { State } from '../../dependencies/main-store/reducers/index';
import { QuestionModel } from '../../models/question.model';
import { AuditService } from '../../services/audits.service';
import { QuestionActionTypes, LoadQuestionTriggered, LoadQuestionCompleted, QuestionFailed, QuestionException, LoadQuestionByIdTriggered, LoadQuestionDelete, LoadQuestionByIdCompleted, RefreshQuestionsList, QuestionEditCompletedWithInPlaceUpdate, LoadQuestionListTriggered, LoadQuestionListCompleted, LoadSingleQuestionByIdTriggered, LoadSingleQuestionByIdCompleted, LoadQuestionDeleteTriggered, LoadQuestionDeleteCompleted, LoadQuestionHistoryTriggered, LoadQuestionHistoryCompleted, LoadQuestionViewTriggered, LoadQuestionViewCompleted, LoadQuestionReorderTriggered, LoadQuestionReorderCompleted, LoadQuestionsByFilterForConductsTriggered, LoadQuestionsByFilterForConductsCompleted, LoadQuestionsByCategoryIdForConductsTriggered, LoadQuestionsByCategoryIdForConductsCompleted, LoadCopyOrMoveQuestionsTriggered, LoadCopyOrMoveQuestionsCompleted, LoadMoveQuestionsTriggered, LoadMoveQuestionsCompleted, DeleteMultipleQuestions, LoadQuestionsForConductsTriggered, LoadQuestionsForConductsCompleted, LoadConductQuestionTriggered, LoadConductQuestionCompleted, LoadConductQuestionByIdTriggered, LoadConductQuestionByIdCompleted, LoadInlineConductQuestionCompleted, LoadInlineConductQuestionTriggered, LoadConductQuestionEditCompleted, LoadConductActionTriggered, LoadConductActionCompleted, LoadActionsByQuestionTriggered, LoadActionsByQuestionCompleted, LoadConductActionQuestionByIdTriggered, LoadConductActionQuestionByIdCompleted, LoadConductActionQuestionEditCompleted, LoadConductQuestionViewTriggered, LoadConductQuestionViewCompleted, LoadVersionQuestionListTriggered, LoadVersionQuestionListCompleted, LoadSingleVersionQuestionByIdTriggered, LoadSingleVersionQuestionByIdCompleted } from '../actions/questions.actions';
import { LoadAuditRelatedCountsTriggered, LoadAuditByIdTriggered, LoadMultipleAuditsByIdTriggered, LoadAnotherAuditByIdTriggered } from '../actions/audits.actions';
import { AuditCompliance } from '../../models/audit-compliance.model';
import { AuditCategory } from '../../models/audit-category.model';
import { LoadAuditCategoryListTriggered, LoadAuditCategoryForAnswerByIdTriggered, AuditCategoryActionTypes, LoadAuditCategoryForAnswerByIdCompleted, AuditCategoryFailed, AuditCategoryException, LoadAuditCategoryListCompleted } from '../actions/audit-categories.actions';
import { LoadAuditConductByIdTriggered } from '../actions/conducts.actions';
import { AuditConduct } from '../../models/audit-conduct.model';
import { ProjectGoalsService } from '../../dependencies/services/goals.service';
import { ConstantVariables } from '../../dependencies/constants/constant-variables';
import * as auditManagementReducers from "../reducers";

@Injectable()
export class QuestionEffects {
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    auditCategoryList$: Observable<AuditCategory[]>;

    searchQuestion: QuestionModel;
    latestQuestionData: QuestionModel[];
    latestCategoryData: AuditCategory[];
    auditCategoryList: AuditCategory[];

    exceptionMessage: any;
    auditId: string;
    conductId: string;
    projectId: string;
    auditConductQuestionId: string;
    shiftAuditId: string;
    shiftSourceAuditId: string;
    currentCategoryId: string;
    shiftAppendToCatgeory: string;
    categoryId: string;
    questionId: string;
    deletedQuestionId: string;
    moveQuestionIds: string[];
    newQuestion: boolean;
    isHierarchical: boolean = false;
    isCopy: boolean = false;
    loadBugs: boolean = false;
    isShiftHierarchical: boolean = false;
    archiveQuestion: boolean = false;
    disableAddAndSave: boolean = false;
    isShiftCopy: boolean = false;
    isShiftQuestionsOnly: boolean = false;
    isShiftCategoriesAndParents: boolean = false;
    snackBarMessage: string;
    validationMessages: any[];

    constructor(private actions$: Actions, private softLabePipe: SoftLabelPipe, private auditService: AuditService, private projectGoalsService: ProjectGoalsService, private translateService: TranslateService, private store: Store<State>) {
        this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    @Effect()
    loadQuestions$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionTriggered>(QuestionActionTypes.LoadQuestionTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditQuestion(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = getAction.question.auditId;
                        this.categoryId = getAction.question.auditCategoryId;
                        this.isHierarchical = getAction.question.isHierarchical;
                        this.disableAddAndSave = getAction.question.disableAddAndSave;
                        this.questionId = result.data;
                        if (getAction.question.questionId && getAction.question.isArchived == true || getAction.question.questionId && getAction.question.questionUnarchive == true) {
                            this.newQuestion = false;
                            this.archiveQuestion = true;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditDeleted);
                        }
                        else if (getAction.question.questionId) {
                            this.newQuestion = false;
                            this.archiveQuestion = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                        }
                        else {
                            this.newQuestion = true;
                            this.archiveQuestion = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                        }
                        return new LoadQuestionCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionCompleted>(QuestionActionTypes.LoadQuestionCompleted),
        pipe(
            map(
                () => {
                    if (this.archiveQuestion == false) {
                        let searchQuestion = new QuestionModel();
                        searchQuestion.questionId = this.questionId;
                        searchQuestion.disableAddAndSave = this.disableAddAndSave;
                        searchQuestion.isArchived = false;
                        return new LoadQuestionByIdTriggered(searchQuestion);
                    }
                    else {
                        return new LoadQuestionDelete(this.questionId);
                    }
                })
        )
    );

    @Effect()
    loadQuestionHistory$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionHistoryTriggered>(QuestionActionTypes.LoadQuestionHistoryTriggered),
        switchMap(getAction => {
            return this.auditService.getAuditQuestionHistory(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionHistoryCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionHistoryView$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionViewTriggered>(QuestionActionTypes.LoadQuestionViewTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionViewCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadConductQuestionHistoryView$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionViewTriggered>(QuestionActionTypes.LoadConductQuestionViewTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConductQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadConductQuestionViewCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionsByFilterForConductsTriggered>(QuestionActionTypes.LoadQuestionsByFilterForConductsTriggered),
        switchMap(getAction => {
            return this.auditService.searchQuestionsByFilters(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionsByFilterForConductsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsByCategoryId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionsByCategoryIdForConductsTriggered>(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionsByCategoryIdForConductsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsForConducts$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionsForConductsTriggered>(QuestionActionTypes.LoadQuestionsForConductsTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConductQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionsForConductsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionConduct$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionTriggered>(QuestionActionTypes.LoadConductQuestionTriggered),
        switchMap(getAction => {
            return this.auditService.submitConductQuestion(getAction.question).pipe(
                map((result: any) => {
                    this.questionId = getAction.question.questionId;
                    this.conductId = getAction.question.conductId;
                    this.categoryId = getAction.question.auditCategoryId;
                    if (result.success == true) {
                        this.auditCategoryList$ = this.store.pipe(select(auditModuleReducer.getAuditCategoryList));
                        this.auditCategoryList$.subscribe(result => {
                            this.auditCategoryList = result;
                        });
                        return new LoadConductQuestionCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionConducts$: Observable<Action> = this.actions$.pipe(
        ofType<LoadInlineConductQuestionTriggered>(QuestionActionTypes.LoadInlineConductQuestionTriggered),
        switchMap(getAction => {
            return this.auditService.submitConductQuestion(getAction.question).pipe(
                map((result: any) => {
                    this.questionId = getAction.question.questionId;
                    this.conductId = getAction.question.conductId;
                    this.categoryId = getAction.question.auditCategoryId;
                    if (result.success == true) {
                        this.auditCategoryList$ = this.store.pipe(select(auditModuleReducer.getAuditCategoryList));
                        this.auditCategoryList$.subscribe(result => {
                            this.auditCategoryList = result;
                        });
                        return new LoadInlineConductQuestionCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsConductCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionCompleted>(QuestionActionTypes.LoadConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new AuditCategory();
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.auditCategoryId = this.categoryId;
                    searchQuestion.isArchived = false;
                    return new LoadAuditCategoryForAnswerByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadQuestionsConductCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadInlineConductQuestionCompleted>(QuestionActionTypes.LoadInlineConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new AuditCategory();
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.auditCategoryId = this.categoryId;
                    searchQuestion.isArchived = false;
                    return new LoadAuditCategoryForAnswerByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadAuditCategoryForAnswerList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryForAnswerByIdTriggered>(AuditCategoryActionTypes.LoadAuditCategoryForAnswerByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategories(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        let data = result.data;
                        this.latestCategoryData = data[0];
                        return new LoadAuditCategoryForAnswerByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCategoryByIdCompletedForAnswer$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryForAnswerByIdCompleted>(AuditCategoryActionTypes.LoadAuditCategoryForAnswerByIdCompleted),
        pipe(
            map(() => {
                if (this.latestCategoryData) {
                    let data = this.editDataOfTheCategory(this.latestCategoryData);
                    return new LoadAuditCategoryListCompleted(data);
                }
                else {
                    return new LoadQuestionReorderCompleted();
                }
            })
        )
    );

    @Effect()
    loadQuestionConductCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionCompleted>(QuestionActionTypes.LoadConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new QuestionModel();
                    searchQuestion.questionId = this.questionId;
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.isArchived = false;
                    return new LoadConductQuestionByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadQuestionConductCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadInlineConductQuestionCompleted>(QuestionActionTypes.LoadInlineConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new QuestionModel();
                    searchQuestion.questionId = this.questionId;
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.isArchived = false;
                    return new LoadConductQuestionByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadQuestionConductById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionByIdTriggered>(QuestionActionTypes.LoadConductQuestionByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConductQuestions(getAction.question).pipe(
                map((result: any) => {
                    this.latestQuestionData = result.data;
                    if (result.success == true) {
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.MessageForQuestionSubmitted);
                        return new LoadConductQuestionByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionConductByIdsDone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionByIdCompleted>(QuestionActionTypes.LoadConductQuestionByIdCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadQuestionConductByIdDone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionByIdCompleted>(QuestionActionTypes.LoadConductQuestionByIdCompleted),
        pipe(
            map(() => {
                return new LoadConductQuestionEditCompleted({
                    questionUpdate: {
                        id: this.latestQuestionData[0].questionId,
                        changes: this.latestQuestionData[0]
                    }
                });
            })
        )
    );

    @Effect()
    loadQuestionConductByIdDones$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductQuestionCompleted>(QuestionActionTypes.LoadConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditConduct();
                    searchAudit.conductId = this.conductId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshConduct = true;
                    return new LoadAuditConductByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    loadQuestionConductByIdsDones$: Observable<Action> = this.actions$.pipe(
        ofType<LoadInlineConductQuestionCompleted>(QuestionActionTypes.LoadInlineConductQuestionCompleted),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditConduct();
                    searchAudit.conductId = this.conductId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshConduct = true;
                    return new LoadAuditConductByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    loadAction$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionTriggered>(QuestionActionTypes.LoadConductActionTriggered),
        switchMap(getAction => {
            return this.projectGoalsService.UpsertUserStory(getAction.actionModel).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.questionId = getAction.actionModel.questionId;
                        this.conductId = getAction.actionModel.conductId;
                        this.auditConductQuestionId = getAction.actionModel.auditConductQuestionId;
                        this.loadBugs = getAction.actionModel.loadBugs;
                        this.projectId = getAction.actionModel.auditProjectId;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.MessageForActionSubmitted);
                        return new LoadConductActionCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadActions$: Observable<Action> = this.actions$.pipe(
        ofType<LoadActionsByQuestionTriggered>(QuestionActionTypes.LoadActionsByQuestionTriggered),
        switchMap(getAction => {
            return this.auditService.searchActionsByQuestionId(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditConductQuestionId = getAction.question.auditConductQuestionId;
                        // this.conductId = getAction.actionModel.conductId;
                        return new LoadActionsByQuestionCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadActionDone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionCompleted>(QuestionActionTypes.LoadConductActionCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadActionDones$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionCompleted>(QuestionActionTypes.LoadConductActionCompleted),
        pipe(
            map(
                () => {
                    return new LoadAuditRelatedCountsTriggered(this.projectId);
                })
        )
    );

    @Effect()
    loadActionDoneCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionCompleted>(QuestionActionTypes.LoadConductActionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new QuestionModel();
                    searchQuestion.questionId = this.questionId;
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.isArchived = false;
                    return new LoadConductActionQuestionByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadsActionDoneCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionCompleted>(QuestionActionTypes.LoadConductActionCompleted),
        pipe(
            map(
                () => {
                    let searchQuestion = new AuditConduct();
                    searchQuestion.conductId = this.conductId;
                    searchQuestion.isArchived = false;
                    searchQuestion.canRefreshConduct = true;
                    return new LoadAuditConductByIdTriggered(searchQuestion);
                })
        )
    );

    @Effect()
    loadActionDoneCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionCompleted>(QuestionActionTypes.LoadConductActionCompleted),
        pipe(
            map(
                () => {
                    if (this.loadBugs) {
                        let searchQuestion = new QuestionModel();
                        searchQuestion.auditConductQuestionId = this.auditConductQuestionId;
                        // searchQuestion.conductId = this.conductId;
                        searchQuestion.isArchived = false;
                        return new LoadActionsByQuestionTriggered(searchQuestion);
                    }
                    else {
                        return new LoadQuestionReorderCompleted();
                    }
                })
        )
    );

    @Effect()
    loadActionQuestionConductById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionQuestionByIdTriggered>(QuestionActionTypes.LoadConductActionQuestionByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditConductQuestions(getAction.question).pipe(
                map((result: any) => {
                    this.latestQuestionData = result.data;
                    if (result.success == true) {
                        return new LoadConductActionQuestionByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadActionQuestionConductByIdDone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadConductActionQuestionByIdCompleted>(QuestionActionTypes.LoadConductActionQuestionByIdCompleted),
        pipe(
            map(() => {
                return new LoadConductActionQuestionEditCompleted({
                    questionUpdate: {
                        id: this.latestQuestionData[0].questionId,
                        changes: this.latestQuestionData[0]
                    }
                });
            })
        )
    );

    @Effect()
    loadCopyOrMoveCases$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveQuestionsTriggered>(QuestionActionTypes.LoadCopyOrMoveQuestionsTriggered),
        switchMap(getAction => {
            return this.auditService.copyOrMoveQuestions(getAction.copyOrMoveQuestions).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.isShiftHierarchical = getAction.copyOrMoveQuestions.isHierarchical;
                        this.shiftAuditId = getAction.copyOrMoveQuestions.auditId;
                        this.projectId = getAction.copyOrMoveQuestions.projectId;
                        this.shiftSourceAuditId = getAction.copyOrMoveQuestions.sourceAuditId;
                        this.currentCategoryId = getAction.copyOrMoveQuestions.currentCategoryId;
                        this.shiftAppendToCatgeory = getAction.copyOrMoveQuestions.appendToCategoryId;
                        this.isShiftCopy = getAction.copyOrMoveQuestions.isCopy;
                        this.isShiftQuestionsOnly = getAction.copyOrMoveQuestions.isQuestionsOnly;
                        this.isShiftCategoriesAndParents = getAction.copyOrMoveQuestions.isAllParents;
                        return new LoadCopyOrMoveQuestionsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadCopyOrMoveQuestionsCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveQuestionsCompleted>(QuestionActionTypes.LoadCopyOrMoveQuestionsCompleted),
        pipe(
            map(
                () => {
                    // let searchAudit = new AuditCompliance();
                    // let audits = [];
                    // audits.push(this.shiftAuditId);
                    // audits.push(this.shiftSourceAuditId);
                    // searchAudit.multipleAuditIds = audits;
                    // searchAudit.isArchived = false;
                    // return new LoadMultipleAuditsByIdTriggered(searchAudit);
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.shiftAuditId;
                    searchAudit.projectId = this.projectId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                }
            )
        )
    );

    @Effect()
    loadCopyOrMoveQuestionsCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveQuestionsCompleted>(QuestionActionTypes.LoadCopyOrMoveQuestionsCompleted),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.shiftSourceAuditId;
                    searchAudit.projectId = this.projectId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAnotherAuditByIdTriggered(searchAudit);
                }
            )
        )
    );

    @Effect()
    loadCopyOrMoveQuestionsCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCopyOrMoveQuestionsCompleted>(QuestionActionTypes.LoadCopyOrMoveQuestionsCompleted),
        pipe(
            map(
                () => {
                    if (this.isShiftCategoriesAndParents || (this.isShiftQuestionsOnly && (this.shiftAppendToCatgeory == null || this.shiftAppendToCatgeory == ''))) {
                        let categoryList = new AuditCategory();
                        categoryList.auditId = this.shiftAuditId;
                        return new LoadAuditCategoryListTriggered(categoryList);
                    }
                    else if (this.isShiftQuestionsOnly && this.currentCategoryId && this.shiftAppendToCatgeory == this.currentCategoryId) {
                        let questionSearch = new QuestionModel();
                        questionSearch.auditCategoryId = this.currentCategoryId;
                        questionSearch.isArchived = false;
                        questionSearch.isFilter = false;
                        questionSearch.isHierarchical = this.isShiftHierarchical;
                        return new LoadQuestionListTriggered(questionSearch);
                    }
                    else {
                        return new LoadQuestionReorderCompleted();
                    }
                }
            )
        )
    );

    @Effect()
    loadQuestionById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionByIdTriggered>(QuestionActionTypes.LoadQuestionByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.latestQuestionData = result.data;
                        return new LoadQuestionByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionByIdComplte$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleQuestionByIdTriggered>(QuestionActionTypes.LoadSingleQuestionByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadSingleQuestionByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadSingleVersionQuestionByIdComplete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSingleVersionQuestionByIdTriggered>(QuestionActionTypes.LoadSingleVersionQuestionByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadSingleVersionQuestionByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionDeleteTriggered>(QuestionActionTypes.LoadQuestionDeleteTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditQuestion(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditId = getAction.question.auditId;
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditDeleted);
                        return new LoadQuestionDeleteCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCompletedSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionDeleteCompleted>(QuestionActionTypes.LoadQuestionDeleteCompleted),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                })
        )
    );

    // @Effect()
    // loadQuestionDeleteCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadQuestionDeleteCompleted>(QuestionActionTypes.LoadQuestionDeleteCompleted),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    // @Effect()
    // loadAuditCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadQuestionByIdCompleted>(QuestionActionTypes.LoadQuestionByIdCompleted),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    // @Effect()
    // loadAuditCompleteds$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadQuestionDelete>(QuestionActionTypes.LoadQuestionDelete),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    @Effect()
    loadAuditByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionByIdCompleted>(QuestionActionTypes.LoadQuestionByIdCompleted),
        pipe(
            map(() => {
                if (this.newQuestion) {
                    // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                    return new RefreshQuestionsList(this.latestQuestionData[0]);
                }
                else {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                    return new QuestionEditCompletedWithInPlaceUpdate({
                        questionUpdate: {
                            id: this.latestQuestionData[0].questionId,
                            changes: this.latestQuestionData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadAuditCompletedsSuccessfull$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshQuestionsList>(QuestionActionTypes.RefreshQuestionsList),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    QuestionEditCompletedWithInPlaceUpdates$: Observable<Action> = this.actions$.pipe(
        ofType<QuestionEditCompletedWithInPlaceUpdate>(QuestionActionTypes.QuestionEditCompletedWithInPlaceUpdate),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    loadAuditCompleteSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionDelete>(QuestionActionTypes.LoadQuestionDelete),
        pipe(
            map(
                () => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    return new LoadAuditByIdTriggered(searchAudit);
                })
        )
    );

    @Effect()
    loadQuestionsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionListTriggered>(QuestionActionTypes.LoadQuestionListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadQuestionListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadVersionQuestionsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadVersionQuestionListTriggered>(QuestionActionTypes.LoadVersionQuestionListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditQuestions(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadVersionQuestionListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsMove$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMoveQuestionsTriggered>(QuestionActionTypes.LoadMoveQuestionsTriggered),
        switchMap(getAction => {
            this.moveQuestionIds = getAction.question.questionIds;
            this.isHierarchical = getAction.question.isHierarchical;
            this.isCopy = getAction.question.isCopy;
            return this.auditService.moveQuestionsToCategory(getAction.question).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForQuestionsMoved);
                        return new LoadMoveQuestionsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    loadQuestionsMoveCompleteds$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMoveQuestionsCompleted>(QuestionActionTypes.LoadMoveQuestionsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadQuestionsMoveCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMoveQuestionsCompleted>(QuestionActionTypes.LoadMoveQuestionsCompleted),
        pipe(
            map(
                () => {
                    if (!this.isHierarchical && !this.isCopy)
                        return new DeleteMultipleQuestions(this.moveQuestionIds);
                    else
                        return new LoadQuestionReorderCompleted();
                }
            )
        )
    );

    @Effect()
    reOrderQuestions$: Observable<Action> = this.actions$.pipe(
        ofType<LoadQuestionReorderTriggered>(QuestionActionTypes.LoadQuestionReorderTriggered),
        switchMap(getAction => {
            return this.auditService.reOrderQuestions(getAction.questionIdList).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadQuestionReorderCompleted();
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new QuestionFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new QuestionException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForAudit$: Observable<Action> = this.actions$.pipe(
        ofType<QuestionFailed>(QuestionActionTypes.QuestionFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    @Effect()
    auditExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<QuestionException>(QuestionActionTypes.QuestionException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    editDataOfTheCategory(categoryData) {
        if (this.auditCategoryList && this.auditCategoryList.length > 0) {
            for (let i = 0; i < this.auditCategoryList.length; i++) {
                if (this.auditCategoryList[i].auditCategoryId == categoryData.auditCategoryId) {
                    let categoriesData = [];
                    for (let j = 0; j < this.auditCategoryList.length; j++) {
                        categoriesData.push(Object.assign({}, this.auditCategoryList[j]));
                    }
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryData);
                    tempCategoryData.subAuditCategories = this.auditCategoryList[i].subAuditCategories;
                    categoriesData.splice(i, 1, tempCategoryData);
                    return categoriesData;
                }
                else {
                    let changedData = this.recursiveEditDataOfTheCategory(this.auditCategoryList[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let categoriesList = [];
                        for (let j = 0; j < this.auditCategoryList.length; j++) {
                            categoriesList.push(Object.assign({}, this.auditCategoryList[j]));
                        }
                        categoriesList.splice(i, 1, changedData);
                        return categoriesList;
                    }
                }
            }
        }
    }

    recursiveEditDataOfTheCategory(categoryListData, categoryData) {
        if (categoryListData.subAuditCategories && categoryListData.subAuditCategories.length > 0) {
            for (let i = 0; i < categoryListData.subAuditCategories.length; i++) {
                if (categoryListData.subAuditCategories[i].auditCategoryId == categoryData.auditCategoryId) {
                    let finalCategoryData;
                    finalCategoryData = Object.assign({}, categoryListData);
                    let subCategoriesList = [];
                    for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                        subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                    }
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryData);
                    tempCategoryData.subAuditCategories = categoryListData.subAuditCategories[i].subAuditCategories;
                    subCategoriesList.splice(i, 1, tempCategoryData);
                    finalCategoryData.subAuditCategories = subCategoriesList;
                    return finalCategoryData;
                }
                else {
                    let changedData = this.recursiveEditDataOfTheCategory(categoryListData.subAuditCategories[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let categoryData = Object.assign({}, categoryListData);
                        let subCategoriesList = [];
                        for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                        }
                        subCategoriesList.splice(i, 1, changedData);
                        categoryData.subAuditCategories = subCategoriesList;
                        return categoryData;
                    }
                }
            }
        }
        else {
            return null;
        }
    }
}