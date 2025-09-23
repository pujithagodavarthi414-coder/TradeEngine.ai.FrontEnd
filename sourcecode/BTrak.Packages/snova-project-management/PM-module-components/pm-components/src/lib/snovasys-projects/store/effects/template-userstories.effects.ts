import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { UpsertTemplatesTriggered, TemplateActionTypes, UpsertTemplatesCompleted, UpsertTemplatesFailed, TemplatesExceptionHandled, GetTemplatessTriggered, GetTemplatesCompleted, GetTemplatesFailed, GetTemplatesByIdTriggered, GetTemplatesByIdCompleted, GetTemplatesByIdFailed, RefreshTemplatesList, UpdateTemplatesField } from "../actions/templates.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { TemplateModel } from "../../models/templates-model";
import { UserStory } from "../../models/userStory";
import { UpsertWorkItemTriggered, WorkItemActionTypes, UpsertWorkItemCompleted, UpsertWorkItemFailed, GetWorkItemsTriggered, GetWorkItemsCompleted, GetWorkItemByIdTriggered, GetWorkItemByIdCompleted, GetWorkItemByIdFailed, RefreshWorkItemList, UpdateWorkItemField, GetWorkItemsFailed, UpsertMultipleWorkItemTriggered, UpsertMultipleWorkItemCompleted, UpsertMultipleWorkItemFailed, GetMultipleWorkitemsByIdTriggered, GetMultipleWorkitemsByIdCompleted, GetMultipleWorkitemsByIdFailed, RefreshMoreWorkItems, TemplateUserStoriesExceptionHandled } from "../actions/template-userstories.action";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class WorkItemEffects {
    toastrMessage: string;
    workitems: UserStory
    workitemId: string;
    templateId: string;
    isNewWorkItem: boolean;
    userStoryIds: string[] = [];
    templateUserStories : UserStory[];
    @Effect()
    upsertworkitem: Observable<Action> = this.actions$.pipe(
        ofType<UpsertWorkItemTriggered>(WorkItemActionTypes.UpsertWorkItemTriggered),
        switchMap(action => {
            if (action.WorkItem.userStoryId) {
                this.isNewWorkItem = false;
            }
            else {
                this.isNewWorkItem = true;
            }
            return this.goalService
                .UpsertUserStory(action.WorkItem)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.workitemId = response.data;
                        this.templateId = action.WorkItem.templateId;
                        return new UpsertWorkItemCompleted(response.data);
                    } else {
                        return new UpsertWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplateUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertMultipleWorkItems: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleWorkItemTriggered>(WorkItemActionTypes.UpsertMultipleWorkItemTriggered),
        switchMap(action => {
            return this.goalService
                .UpsertMultipleUserStoriesSplit(action.WorkItem)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.userStoryIds = response.data;
                        return new UpsertMultipleWorkItemCompleted(response.data);
                    } else {
                        return new UpsertMultipleWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplateUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchsoftLabels: Observable<Action> = this.actions$.pipe(
        ofType<GetWorkItemsTriggered>(WorkItemActionTypes.GetWorkItemsTriggered),
        switchMap(action => {
            this.templateId = action.WorkItemSearch.templateId;
            return this.goalService
                .searchTemplateUserStories(action.WorkItemSearch)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new GetWorkItemsCompleted(response.data);
                    } else {
                        return new GetTemplatesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplateUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSoftLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetWorkItemByIdTriggered>(WorkItemActionTypes.GetWorkItemByIdTriggered),
        switchMap(action => {
            return this.goalService
                .searchTemplateUserStoryById(action.WorkItemId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.workitems = response.data;
                        return new GetWorkItemByIdCompleted(response.data);
                    } else {
                        return new GetWorkItemByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplateUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadsoftLabelById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertWorkItemCompleted>(WorkItemActionTypes.UpsertWorkItemCompleted),
        pipe(
            map(() => {
                return new GetWorkItemByIdTriggered(this.workitemId);
            })
        )
    );

    @Effect()
    loadMultipleWorkItemsById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleWorkItemCompleted>(WorkItemActionTypes.UpsertMultipleWorkItemCompleted),
        pipe(
            map(() => {
                return new GetMultipleWorkitemsByIdTriggered(this.userStoryIds);
            })
        )
    );

    @Effect()
    getMultipleLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetMultipleWorkitemsByIdTriggered>(WorkItemActionTypes.GetMultipleWorkitemsByIdTriggered),
        switchMap(action => {
            var model = new UserStorySearchCriteriaInputModel();
            model.userStoryIds = this.userStoryIds.toString();
            model.templateId = this.templateId;
            return this.goalService
                .searchTemplateUserStories(model)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templateUserStories = response.data;
                        return new GetMultipleWorkitemsByIdCompleted(response.data);
                    } else {
                        return new GetMultipleWorkitemsByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new TemplateUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    InsertMultipleWorkItems$: Observable<Action> = this.actions$.pipe(
        ofType<GetMultipleWorkitemsByIdCompleted>(WorkItemActionTypes.GetMultipleWorkitemsByIdCompleted),
        pipe(
            map(() => {
                return new RefreshMoreWorkItems(this.templateUserStories);
            })
        )
    );

    @Effect()
    UpdatesoftLabelChanges$: Observable<Action> = this.actions$.pipe(
        ofType<GetWorkItemByIdCompleted>(WorkItemActionTypes.GetWorkItemByIdCompleted),
        pipe(
            map(() => {
                if (this.isNewWorkItem) {
                    return new RefreshWorkItemList(this.workitems);
                }
                else {
                    return new UpdateWorkItemField({
                        WorkItemUpdate: {
                            id: this.workitems.userStoryId,
                            changes: this.workitems
                        }
                    });
                }
            })
        )
    );

    @Effect()
    showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertWorkItemFailed>(WorkItemActionTypes.UpsertWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetWorkItemsFailed>(WorkItemActionTypes.GetWorkItemsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetWorkItemByIdFailed>(WorkItemActionTypes.GetWorkItemByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpsertMultipleCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleWorkItemFailed>(WorkItemActionTypes.UpsertMultipleWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    TemplateUserStoriesExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<TemplateUserStoriesExceptionHandled>(WorkItemActionTypes.TemplateUserStoriesExceptionHandled),
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
        private goalService: ProjectGoalsService
    ) { }
}