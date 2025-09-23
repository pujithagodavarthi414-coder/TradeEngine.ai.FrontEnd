import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { UpsertTemplatesTriggered, TemplateActionTypes, UpsertTemplatesCompleted, UpsertTemplatesFailed, TemplatesExceptionHandled, GetTemplatessTriggered, GetTemplatesCompleted, GetTemplatesFailed, GetTemplatesByIdTriggered, GetTemplatesByIdCompleted, GetTemplatesByIdFailed, RefreshTemplatesList, UpdateTemplatesField, InsertDuplicateTemplateTriggered, InsertDuplicateTemplateCompleted, InsertGoalTemplateTriggered, InsertGoalTemplateCompleted, InsertGoalTemplateFailed, ArchiveTemplatesTriggered, ArchiveTemplatesCompleted, ArchiveTemplatesFailed } from "../actions/templates.action";
import { TemplatesService } from "../../services/templates.service";
import { TemplateModel } from "../../models/templates-model";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { ProjectSummaryTriggered } from '../actions/project-summary.action';


@Injectable()
export class TemplateEffects {
    toastrMessage: string;
    templates: TemplateModel
    templateId: string;
    isNewTemplate: boolean;
    projectId: string;
    @Effect()
    upsertTemplate: Observable<Action> = this.actions$.pipe(
        ofType<UpsertTemplatesTriggered>(TemplateActionTypes.UpsertTemplatesTriggered),
        switchMap(action => {
            this.projectId = action.template.projectId;
            if (action.template.templateId) {
                this.isNewTemplate = false;
            }
            else {
                this.isNewTemplate = true;
            }
            return this.templatesService
                .upsertTemplates(action.template)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templateId = response.data;
                        return new UpsertTemplatesCompleted(response.data);
                    } else {
                        return new UpsertTemplatesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );
    
    @Effect()
    insertDuplicateTemplate: Observable<Action> = this.actions$.pipe(
        ofType<InsertDuplicateTemplateTriggered>(TemplateActionTypes.InsertDuplicateTemplateTriggered),
        switchMap(action => {
            this.projectId = action.template.projectId;
            return this.templatesService.insertDuplicateTemplate(action.template)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templateId = response.data;
                        return new InsertDuplicateTemplateCompleted(response.data);
                    } else {
                        return new UpsertTemplatesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    insertGoalDuplicateTemplate: Observable<Action> = this.actions$.pipe(
        ofType<InsertGoalTemplateTriggered>(TemplateActionTypes.InsertGoalTemplateTriggered),
        switchMap(action => {
            return this.templatesService.insertGoalTemplate(action.templateId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templateId = response.data;
                        return new InsertGoalTemplateCompleted(response.data);
                    } else {
                        return new InsertGoalTemplateFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchsoftLabels: Observable<Action> = this.actions$.pipe(
        ofType<GetTemplatessTriggered>(TemplateActionTypes.GetTemplatesTriggered),
        switchMap(action => {
            return this.templatesService
                .searchTemplates(action.template)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new GetTemplatesCompleted(response.data);
                    } else {
                        return new GetTemplatesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSoftLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetTemplatesByIdTriggered>(TemplateActionTypes.GetTemplatesByIdTriggered),
        switchMap(action => {
            return this.templatesService
                .getTemplateById(action.templateId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templates = response.data;
                        return new GetTemplatesByIdCompleted(response.data);
                    } else {
                        return new GetTemplatesByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadsoftLabelById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertTemplatesCompleted>(TemplateActionTypes.UpsertTemplatesCompleted),
        pipe(
            map(() => {
                return new GetTemplatesByIdTriggered(this.templateId);
            })
        )
    );

    @Effect()
    loadprojectsTemplatesCount$: Observable<Action> = this.actions$.pipe(
        ofType<InsertDuplicateTemplateCompleted>(TemplateActionTypes.InsertDuplicateTemplateCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    loadprojectsCount$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertTemplatesCompleted>(TemplateActionTypes.UpsertTemplatesCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    UpdatesoftLabelChanges$: Observable<Action> = this.actions$.pipe(
        ofType<GetTemplatesByIdCompleted>(TemplateActionTypes.GetTemplatesByIdCompleted),
        pipe(
            map(() => {
                if (this.isNewTemplate) {
                    return new RefreshTemplatesList(this.templates);
                }
                else {
                    return new UpdateTemplatesField({
                        templateUpdate: {
                            id: this.templates.templateId,
                            changes: this.templates
                        }
                    });
                }
            })
        )
    );

    @Effect()
    deleteTemplate: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveTemplatesTriggered>(TemplateActionTypes.ArchiveTemplatesTriggered),
        switchMap(action => {
            this.projectId = action.template.projectId;
            return this.templatesService.archiveTemplates(action.template)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new ArchiveTemplatesCompleted(response.data);
                    } else {
                        return new ArchiveTemplatesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplatesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadTemplatesCount$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveTemplatesCompleted>(TemplateActionTypes.ArchiveTemplatesCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );


    @Effect()
    showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertTemplatesFailed>(TemplateActionTypes.UpsertTemplatesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetTemplatesFailed>(TemplateActionTypes.GetTemplatesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetTemplatesByIdFailed>(TemplateActionTypes.GetTemplatesByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGoalTemplate$: Observable<Action> = this.actions$.pipe(
        ofType<InsertGoalTemplateFailed>(TemplateActionTypes.InsertGoalTemplateFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForDeleteTemplate$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveTemplatesFailed>(TemplateActionTypes.ArchiveTemplatesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    TemplatesExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<TemplatesExceptionHandled>(TemplateActionTypes.TemplatesExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private templatesService: TemplatesService
    ) { }
}