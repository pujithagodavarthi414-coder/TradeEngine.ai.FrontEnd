import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { ProjectGoalsService } from "../../services/goals.service";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UpsertSprintWorkItemTriggered, SprintWorkItemActionTypes, UpsertSprintWorkItemCompleted, UpsertSprintWorkItemFailed, SprintUserStoriesExceptionHandled, UpsertMultipleSprintWorkItemTriggered, UpsertMultipleSprintWorkItemCompleted, UpsertMultipleSprintWorkItemFailed, GetSprintWorkItemTriggered, GetSprintWorkItemCompleted, GetSprintWorkItemFailed, GetSprintWorkItemByIdTriggered, GetSprintWorkItemByIdCompleted, GetSprintWorkItemByIdFailed, GetMultipleSprintWorkItemByIdTriggered, GetMultipleSprintWorkItemByIdCompleted, GetMultipleSprintWorkItemByIdFailed, RefreshMoreSprintWorkItem, RefreshSprintWorkItemList, UpdateSprintWorkItemField, UpsertSprintSubTaskCompleted, UpdateMultipleSprintWorkItemField, ArchiveSprintWorkItemTriggred, ArchiveSprintWorkItemCompleted, ArchiveSprintWorkItemFailed, ParkSprintWorkItemTriggred, ParkSprintWorkItemCompleted, ParkSprintWorkItemFailed, GetUniqueSprintWorkItemByIdTriggered, GetUniqueSprintWorkItemByIdCompleted, GetUniqueSprintWorkItemByIdFailed, UpsertWorkItemTagsTriggered, UpsertWorkItemTagsCompleted, UpsertWorkItemTagsFailed, GetSprintWorkItemSubTasksTriggered, GetSprintWorkItemSubTasksCompleted, GetSprintWorkItemSubTasksFailed, InsertSprintWorkItemReplanTriggered, InsertSprintWorkItemReplanCompleted, InsertSprintWorkItemReplanFailed, MoveGoalUserStoryToSprintTriggered, MoveGoalUserStoryToSprintCompleted, MoveGoalUserStoryToSprintFailed, CreateMultiplSprintUserStoriesCompleted, CreateMultipleSprintUserStoriesTriggered, CreateMultipleSprintUserStoriesFailed, UpdateSprintSubTaskUserStoryTriggered, UpdateSprintSubTaskUserStoryCompleted, UpdateSprintSubTaskUserStoryFailed, ReOrderSprintUserStoriesTriggred, ReOrderSprintUserStoriesCompleted, ReOrderSprintUserStoriesFailed, UpdateUserStorySprintCompleted, UpdateUserStorySprintTriggered, UpdateUserStorySprintFailed, ArchiveKanbanSprintsTriggered, ArchiveKanbanSprintsCompleted, ArchiveKanbanSprintsFailed, GetUniqueSprintWorkItemByUniqueIdTriggered } from "../actions/sprint-userstories.action";
import { userStoryUpdates } from "../../models/userStoryUpdates";
import { ArchiveUnArchiveGoalCompleted } from "../actions/goal.actions";
import { RemoveUserStoryFromBacklogList, CreateMultipleUserStoriesSplitCompleted } from "../actions/userStory.actions";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { GetSprintsByIdTriggered, UpdateMultipleSprintsTriggered } from "../actions/sprints.action";
import { InsertAutoLogTimeCompleted } from "../actions/userStory-logTime.action";
import { LoadUserstoryHistoryTriggered } from "../actions/userstory-history.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { TestCase, LoadBugsByUserStoryIdTriggered } from '@snovasys/snova-testrepo';


@Injectable()
export class SprintWorkItemEffects {
    toastrMessage: string;
    workitems: UserStory
    workitemId: string;
    sprintId: string;
    oldSprintId: string;
    isNewWorkItem: boolean;
    userStoryIds: string[] = [];
    templateUserStories: UserStory[];
    userStoryUpdates: userStoryUpdates[] = [];
    searchCriteriaModel: UserStorySearchCriteriaInputModel;
    isUniquePage: boolean;
    isSubTaskPage: boolean;
    isFromSprints: boolean;
    reloadHistoryId: string;
    isSubTasksCalling: boolean;
    isGoalChange: boolean;

    @Effect()
    AutoLogTime$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemByIdCompleted>(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
        pipe(
            map(() => {
                if (this.isFromSprints) {
                    return new ArchiveUnArchiveGoalCompleted()
                } else {
                    return new InsertAutoLogTimeCompleted(this.workitemId)
                }
            }
            )
        )
    );

    @Effect()
    upsertworkitem: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemTriggered>(SprintWorkItemActionTypes.UpsertSprintWorkItemTriggered),
        switchMap(action => {
            if (action.SprintWorkItem.userStoryId) {
                this.isNewWorkItem = false;
            }
            else {
                this.isNewWorkItem = true;
            }
            this.isUniquePage = action.SprintWorkItem.isUniqueDetailsPage;
            this.sprintId = action.SprintWorkItem.sprintId;
            this.isUniquePage = action.SprintWorkItem.isUniqueDetailsPage;
            return this.goalService
                .UpsertUserStory(action.SprintWorkItem)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.reloadHistoryId = response.data;
                        this.sprintId = action.SprintWorkItem.sprintId;
                        if (action.SprintWorkItem.parentUserStoryId) {
                            this.workitemId = action.SprintWorkItem.parentUserStoryId;
                        } else {
                            this.workitemId = response.data;
                        }
                        return new UpsertSprintWorkItemCompleted(response.data);
                    } else {
                        return new UpsertSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertMultipleWorkItems: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleSprintWorkItemTriggered>(SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemTriggered),
        switchMap(action => {
            this.sprintId = action.SprintWorkItem.sprintId;
            return this.goalService
                .UpsertMultipleUserStoriesSplit(action.SprintWorkItem)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        if (action.SprintWorkItem.parentUserStoryId) {
                            this.userStoryIds.push(action.SprintWorkItem.parentUserStoryId)
                            this.workitemId = action.SprintWorkItem.parentUserStoryId;
                            this.isSubTasksCalling = true;
                            return new GetSprintWorkItemByIdTriggered(this.workitemId, true);
                        } else {
                            this.userStoryIds = response.data;
                            this.isSubTasksCalling = false;
                            return new UpsertMultipleSprintWorkItemCompleted(response.data);
                        }
                    } else {
                        return new UpsertMultipleSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    updateMultipleWorkItems: Observable<Action> = this.actions$.pipe(
        ofType<CreateMultipleSprintUserStoriesTriggered>(SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesTriggered),
        switchMap(action => {
            this.sprintId = action.SprintWorkItem.sprintId;
            return this.goalService
                .UpdateMultipleUserStories(action.SprintWorkItem)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        if (action.SprintWorkItem.parentUserStoryIds) {
                            this.userStoryIds = action.SprintWorkItem.parentUserStoryIds
                            return new UpsertSprintSubTaskCompleted(this.userStoryIds);
                        } else {
                            this.userStoryIds = action.SprintWorkItem.UserStoryIds;
                            return new CreateMultiplSprintUserStoriesCompleted(response.data);
                        }
                    } else {
                        return new CreateMultipleSprintUserStoriesFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );
    @Effect()
    updateWorkItemSprint: Observable<Action> = this.actions$.pipe(
        ofType<UpdateUserStorySprintTriggered>(SprintWorkItemActionTypes.UpdateUserStorySprintTriggered),
        switchMap(action => {
            this.sprintId = action.SprintWorkItem.sprintId;
            this.oldSprintId = action.SprintWorkItem.oldSprintId;
            return this.goalService
                .moveUserStoriesToSprint(action.SprintWorkItem.userStoryId, action.SprintWorkItem.sprintId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new UpdateUserStorySprintCompleted(action.SprintWorkItem.userStoryId);
                    } else {
                        return new UpdateUserStorySprintFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    archiveWorkItem$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintWorkItemTriggred>(SprintWorkItemActionTypes.ArchiveSprintWorkItemTriggred),
        switchMap(action => {
            this.isSubTaskPage = action.archiveUserStory.isSubTasksPage;
            this.sprintId = action.archiveUserStory.sprintId;
            return this.goalService
                .archiveUserStory(action.archiveUserStory)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        let parentUserStorySprintId = action.archiveUserStory.parentUserStoryGoalId;
                        if (action.archiveUserStory.parentUserStoryId && ((parentUserStorySprintId == this.sprintId) || !parentUserStorySprintId)) {
                            this.isSubTaskPage = true;
                            this.userStoryIds.push(action.archiveUserStory.parentUserStoryId)
                            return new UpsertSprintSubTaskCompleted(this.userStoryIds);
                        } else {
                            return new ArchiveSprintWorkItemCompleted(response.data);
                        }
                    } else {
                        return new ArchiveSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );


    @Effect()
    loadBugs$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemCompleted>(
            SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted
        ),
        pipe(
            map(() => {
                let bugsCountsModel = new TestCase();
                bugsCountsModel.userStoryId = this.workitemId;
                bugsCountsModel.isArchived = false;
                return new LoadBugsByUserStoryIdTriggered(bugsCountsModel);
            })
        )
    );

    @Effect()
    parkWorkItem$: Observable<Action> = this.actions$.pipe(
        ofType<ParkSprintWorkItemTriggred>(SprintWorkItemActionTypes.ParkSprintWorkItemTriggred),
        switchMap(action => {
            this.isSubTaskPage = action.parkUserStory.isSubTasksPage;
            this.sprintId = action.parkUserStory.sprintId;
            return this.goalService
                .parkUserStory(action.parkUserStory)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        let parentUserStorySprintId = action.parkUserStory.parentUserStoryGoalId;
                        if (action.parkUserStory.parentUserStoryId && ((parentUserStorySprintId == this.sprintId) || !parentUserStorySprintId)) {
                            this.isSubTaskPage = true;
                            this.userStoryIds.push(action.parkUserStory.parentUserStoryId)
                            return new UpsertSprintSubTaskCompleted(this.userStoryIds);
                        } else {
                            return new ParkSprintWorkItemCompleted(response.data);
                        }
                    } else {
                        return new ParkSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchsoftLabels: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemTriggered>(SprintWorkItemActionTypes.GetSprintWorkItemTriggered),
        switchMap(action => {
            this.sprintId = action.WorkItemSearch.sprintId;

            return this.goalService
                .searchSprintUserStories(action.WorkItemSearch)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var userStories = this.convertJSONToUserStories(response.data);
                        return new GetSprintWorkItemCompleted(userStories);
                    } else {
                        return new GetSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchSprintSubTasks: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemSubTasksTriggered>(SprintWorkItemActionTypes.GetSprintWorkItemSubTasksTriggered),
        switchMap(action => {
            this.searchCriteriaModel = action.WorkItemSearch;
            return this.goalService
                .searchSprintUserStories(action.WorkItemSearch)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var userStories = this.convertJSONToUserStories(response.data);
                        return new GetSprintWorkItemSubTasksCompleted(userStories);
                    } else {
                        return new GetSprintWorkItemSubTasksFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSoftLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemByIdTriggered>(SprintWorkItemActionTypes.GetSprintWorkItemByIdTriggered),
        mergeMap(action => {
            this.workitemId = action.WorkItemId;
            this.isFromSprints = action.isFromSprint;
            var isSubTaksPage = localStorage.getItem("isSubTasks");
            if(isSubTaksPage) {
              this.isSubTasksCalling = true;
            } else {
              this.isSubTasksCalling = false;
            }
            return this.goalService
                .searchSprintUserStoryById(action.WorkItemId,null)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var workItem = this.convertJSONToUserStory(response.data);
                        this.workitems = workItem;
                        return new GetSprintWorkItemByIdCompleted(workItem);
                    } else {
                        return new GetSprintWorkItemByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSprintWorkItemById: Observable<Action> = this.actions$.pipe(
        ofType<GetUniqueSprintWorkItemByIdTriggered>(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdTriggered),
        switchMap(action => {
            return this.goalService
                .searchSprintUserStoryById(action.WorkItemId, null)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var workItem = this.convertJSONToUserStory(response.data);
                        return new GetUniqueSprintWorkItemByIdCompleted(workItem);
                    } else {
                        return new GetUniqueSprintWorkItemByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSprintWorkItemByUniqueId: Observable<Action> = this.actions$.pipe(
        ofType<GetUniqueSprintWorkItemByUniqueIdTriggered>(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByUniqueIdTriggered),
        switchMap(action => {
            return this.goalService
                .searchSprintUserStoryById(null,action.WorkItemId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var workItem = this.convertJSONToUserStory(response.data);
                        return new GetUniqueSprintWorkItemByIdCompleted(workItem);
                    } else {
                        return new GetUniqueSprintWorkItemByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertUserStorytags$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertWorkItemTagsTriggered>(
            SprintWorkItemActionTypes.UpsertWorkItemTagsTriggered
        ),
        switchMap(action => {
            return this.goalService
                .upsertUserStoryTags(action.tagsInputModel)
                .pipe(
                    map((result: any) => {
                        if (result.success === true) {
                            if (action.tagsInputModel.parentUserStoryId) {
                                this.userStoryIds.push(action.tagsInputModel.parentUserStoryId)
                                return new UpsertSprintSubTaskCompleted(this.userStoryIds);
                            } else {
                                this.workitemId = result.data;
                                return new UpsertWorkItemTagsCompleted(result.data)
                            }

                        } else {
                            return new UpsertWorkItemTagsFailed(
                                result.apiResponseMessages
                            );
                        }
                    }),
                    catchError(err => {
                        return of(new SprintUserStoriesExceptionHandled(err));
                    })
                );
        })
    );

    @Effect()
    archieKanbanUserStories$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveKanbanSprintsTriggered>(SprintWorkItemActionTypes.ArchiveKanbanSprintsTriggered),
        switchMap(action => {
            this.sprintId = action.archivedkanbanModel.sprintId;
            return this.goalService
                .archiveKanban(action.archivedkanbanModel)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new ArchiveKanbanSprintsCompleted(action.archivedkanbanModel.userStories);
                    } else {
                        return new ArchiveKanbanSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertUserStoryTagsSuccessful: Observable<
        Action
    > = this.actions$.pipe(
        ofType<UpsertWorkItemTagsCompleted>(
            SprintWorkItemActionTypes.UpsertWorkItemTagsCompleted
        ),
        pipe(
            map(() => {
                return new GetSprintWorkItemByIdTriggered(this.workitemId, true);
            })
        )
    );

    @Effect()
    archiveUserStories$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<ArchiveKanbanSprintsCompleted>(
            SprintWorkItemActionTypes.ArchiveKanbanSprintsCompleted
        ),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    loadsoftLabelById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemCompleted>(SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted),
        pipe(
            map(() => {
                return new GetSprintWorkItemByIdTriggered(this.workitemId, true);
            })
        )
    );

    @Effect()
    updateSprintDetail$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemCompleted>(SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted),
        pipe(
            map(() => {
                if (!this.isUniquePage) {
                    return new GetSprintsByIdTriggered(this.sprintId);
                } else {
                    return new ArchiveUnArchiveGoalCompleted();
                }

            })
        )
    );

    @Effect()
    updateSprint$: Observable<Action> = this.actions$.pipe(
        ofType<CreateMultiplSprintUserStoriesCompleted>(SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    updateSprints$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleSprintWorkItemCompleted>(SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemCompleted),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    archiveSprints$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintWorkItemCompleted>(SprintWorkItemActionTypes.ArchiveSprintWorkItemCompleted),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    parkSprints$: Observable<Action> = this.actions$.pipe(
        ofType<ParkSprintWorkItemCompleted>(SprintWorkItemActionTypes.ParkSprintWorkItemCompleted),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    updateMoreSprints$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateUserStorySprintCompleted>(SprintWorkItemActionTypes.UpdateUserStorySprintCompleted),
        pipe(
            map(() => {
                return new UpdateMultipleSprintsTriggered(this.sprintId + ',' + this.oldSprintId);
            })
        )
    );


    @Effect()
    upsertSprints$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintSubTaskCompleted>(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
        pipe(
            map(() => {
                if (!this.isUniquePage) {
                    return new GetSprintsByIdTriggered(this.sprintId);
                } else {
                    return new ArchiveUnArchiveGoalCompleted();
                }

            })
        )
    );


    @Effect()
    loadMultipleWorkItems$: Observable<Action> = this.actions$.pipe(
        ofType<CreateMultiplSprintUserStoriesCompleted>(SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted),
        pipe(
            map(() => {
                this.isNewWorkItem = false;
                return new GetMultipleSprintWorkItemByIdTriggered(this.userStoryIds);
            })
        )
    );

    @Effect()
    reOrder$: Observable<Action> = this.actions$.pipe(
        ofType<ReOrderSprintUserStoriesCompleted>(SprintWorkItemActionTypes.ReOrderSprintUserStoriesCompleted),
        pipe(
            map(() => {
                this.isNewWorkItem = false;
                return new GetMultipleSprintWorkItemByIdTriggered(this.userStoryIds);
            })
        )
    );

    @Effect()
    loadMultipleWorkItemsById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleSprintWorkItemCompleted>(SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemCompleted),
        pipe(
            map(() => {
                this.isNewWorkItem = true;
                return new GetMultipleSprintWorkItemByIdTriggered(this.userStoryIds);
            })
        )
    );

    @Effect()
    getMultipleLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetMultipleSprintWorkItemByIdTriggered>(SprintWorkItemActionTypes.GetMultipleSprintWorkItemByIdTriggered),
        switchMap(action => {
            var model = new UserStorySearchCriteriaInputModel();
            model.userStoryIds = this.userStoryIds.toString();
            model.isArchived = false;
            model.isParked = false;
            model.sprintId = this.sprintId;
            return this.goalService
                .searchSprintUserStories(model)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.templateUserStories = response.data;
                        this.userStoryIds = [];
                        return new GetMultipleSprintWorkItemByIdCompleted(response.data);
                    } else {
                        return new GetMultipleSprintWorkItemByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchSprintWorkItems: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintSubTaskCompleted>(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
        switchMap(action => {
            var searchCriteriaModel = new UserStorySearchCriteriaInputModel();
            searchCriteriaModel.userStoryIds = action.workItemIds.toString();
            searchCriteriaModel.isArchived = false;
            searchCriteriaModel.isParked = false;
            return this.goalService
                .searchSprintUserStories(searchCriteriaModel)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.userStoryIds = [];
                        var userStories = this.convertJSONToUserStories(response.data);
                        var userStoryUpdates = this.convertUserStoriesToJson(userStories);
                        return new UpdateMultipleSprintWorkItemField({
                            userStoryUpdateMultiple: userStoryUpdates
                        });
                    } else {
                        return new GetSprintWorkItemFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintUserStoriesExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    InsertMultipleWorkItems$: Observable<Action> = this.actions$.pipe(
        ofType<GetMultipleSprintWorkItemByIdCompleted>(SprintWorkItemActionTypes.GetMultipleSprintWorkItemByIdCompleted),
        pipe(
            map(() => {
                if (this.isNewWorkItem) {
                    return new RefreshMoreSprintWorkItem(this.templateUserStories);
                } else {
                    var userStories = this.convertJSONToUserStories(this.templateUserStories);
                    var userStoryUpdates = this.convertUserStoriesToJson(userStories);
                    return new UpdateMultipleSprintWorkItemField({
                        userStoryUpdateMultiple: userStoryUpdates
                    });
                }

            })
        )
    );

    @Effect()
    getSubTasks$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintSubTaskCompleted>(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
        pipe(
            map(() => {
                if (this.isSubTaskPage) {
                    return new GetSprintWorkItemSubTasksTriggered(this.searchCriteriaModel);
                }
                else {
                    return new ArchiveUnArchiveGoalCompleted();
                }
            })
        )
    );

    @Effect()
    getSubTasksLoading$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemByIdTriggered>(SprintWorkItemActionTypes.GetSprintWorkItemByIdTriggered),
        pipe(
            map(() => {
                if (this.isSubTasksCalling) {
                    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
                    userStorySearchCriteria.parentUserStoryId = this.workitemId;
                    userStorySearchCriteria.isForUserStoryoverview = true;
                    userStorySearchCriteria.isUserStoryArchived = false;
                    userStorySearchCriteria.isUserStoryParked = false;
                    userStorySearchCriteria.sprintId = this.sprintId;
                    return new GetSprintWorkItemSubTasksTriggered(userStorySearchCriteria);
                }
                else {
                    return new ArchiveUnArchiveGoalCompleted();
                }
            })
        )
    );

    @Effect()
    UpdatesoftLabelChanges$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemByIdCompleted>(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
        pipe(
            map(() => {
                if (this.isNewWorkItem) {
                    return new RefreshSprintWorkItemList(this.workitems);
                }
                else {
                    return new UpdateSprintWorkItemField({
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
    upsertUserStoryReplan$: Observable<Action> = this.actions$.pipe(
        ofType<InsertSprintWorkItemReplanTriggered>(
            SprintWorkItemActionTypes.InsertSprintWorkItemReplanTriggered
        ),
        switchMap(action => {
            this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryReplan)
            return this.goalService
                .UpsertUserStoryReplan(action.userStoryReplan)
                .pipe(
                    map((userUpsertReturnResult: any) => {

                        if (userUpsertReturnResult.success === true) {
                            if (action.userStoryReplan.parentUserStoryId) {
                                this.userStoryIds.push(action.userStoryReplan.parentUserStoryId)
                                return new UpsertSprintSubTaskCompleted(this.userStoryIds);
                            } else {
                                this.workitemId = action.userStoryReplan.userStoryId;
                                return new InsertSprintWorkItemReplanCompleted(userUpsertReturnResult.data);
                            }
                        } else {
                            return new InsertSprintWorkItemReplanFailed(
                                userUpsertReturnResult.apiResponseMessages
                            );
                        }
                    }),
                    catchError(err => {
                        return of(new SprintUserStoriesExceptionHandled(err));
                    })
                );
        })
    );

    @Effect()
    reOrderUserStories: Observable<Action> = this.actions$.pipe(
        ofType<ReOrderSprintUserStoriesTriggred>(
            SprintWorkItemActionTypes.ReOrderSprintUserStoriesTriggred
        ),
        switchMap(searchUserstoriesTriggeredAction => {
            if (searchUserstoriesTriggeredAction.WorkItemId) {
                this.userStoryIds = searchUserstoriesTriggeredAction.WorkItemId.split(',');
            }
            else {
                this.userStoryIds = searchUserstoriesTriggeredAction.workItemIds;
            }
            return this.goalService
                .reOrderUserStories(searchUserstoriesTriggeredAction.workItemIds)
                .pipe(
                    map((reOrderList: any) => {
                        if (reOrderList.success) {

                            return new ReOrderSprintUserStoriesCompleted(this.userStoryIds);

                        } else {
                            return new ReOrderSprintUserStoriesFailed(reOrderList.apiResponseMessages);
                        }
                    }),
                    catchError(err => {
                        return of(new SprintUserStoriesExceptionHandled(err));
                    })
                );
        })
    );


    @Effect()
    moveGoalToSprint$: Observable<Action> = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintTriggered>(
            SprintWorkItemActionTypes.MoveGoalUserStoryToSprintTriggered
        ),
        switchMap(action => {
            this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryReplan)
            this.sprintId = action.sprintId;
            this.isGoalChange = action.isGoalChange;
            return this.goalService
                .moveUserStoriesToSprint(action.WorkItemId, action.sprintId)
                .pipe(
                    map((userUpsertReturnResult: any) => {
                        if (userUpsertReturnResult.success === true) {
                            this.workitemId = action.WorkItemId;
                            this.isNewWorkItem = true;
                            return new MoveGoalUserStoryToSprintCompleted(userUpsertReturnResult.data);
                        } else {
                            return new MoveGoalUserStoryToSprintFailed(
                                userUpsertReturnResult.apiResponseMessages
                            );
                        }
                    }),
                    catchError(err => {
                        return of(new SprintUserStoriesExceptionHandled(err));
                    })
                );
        })
    );

    @Effect()
    upsertUserStoryReplanSuccessfulAndLoadUserStories$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<InsertSprintWorkItemReplanCompleted>(
            SprintWorkItemActionTypes.InsertSprintWorkItemReplanCompleted
        ),
        pipe(
            map(() => {
                return new GetSprintWorkItemByIdTriggered(this.workitemId, true);
            })
        )
    );

    @Effect()
    moveUserStorAndLoadUserStories$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintCompleted>(
            SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted
        ),
        pipe(
            map(() => {
                return new GetSprintWorkItemByIdTriggered(this.workitemId, true);
            })
        )
    );



    @Effect()
    removeUserStoryFromSprint$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintCompleted>(
            SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted
        ),
        pipe(
            map(() => {
                return new RemoveUserStoryFromBacklogList(this.workitemId);
            })
        )
    );

    @Effect()
    updateUserCount$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintCompleted>(
            SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted
        ),
        pipe(
            map(() => {
                if(this.isGoalChange) {
                    return new ArchiveUnArchiveGoalCompleted();
                } else {
                    return new GetSprintsByIdTriggered(this.sprintId);
                }
            })
        )
    );

    @Effect()
    updateUserStorySubTask$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateSprintSubTaskUserStoryTriggered>(
            SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryTriggered
        ),
        switchMap(projectTriggeredAction => {
            this.userStoryIds = projectTriggeredAction.SprintWorkItem.parentUserStoryIds;
            return this.goalService
                .updateSubTaskUserStory(
                    projectTriggeredAction.SprintWorkItem
                )
                .pipe(
                    map((userStories: any) => {
                        if (userStories.success === true) {
                            return new UpdateSprintSubTaskUserStoryCompleted(userStories.data);
                        } else {
                            return new UpdateSprintSubTaskUserStoryFailed(
                                userStories.apiResponseMessages
                            );
                        }
                    }),
                    catchError(err => {
                        return of(new SprintUserStoriesExceptionHandled(err));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemFailed>(SprintWorkItemActionTypes.UpsertSprintWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    updateUserStoryFromSprint$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<UpdateSprintSubTaskUserStoryCompleted>(
            SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryCompleted
        ),
        pipe(
            map(() => {
                return new UpsertSprintSubTaskCompleted(this.userStoryIds);
            })
        )
    );

    @Effect()
    showValidationMessagesForUpdateSubTaskFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateSprintSubTaskUserStoryFailed>(SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemFailed>(SprintWorkItemActionTypes.GetSprintWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForMoveSprintUserStory$: Observable<Action> = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintFailed>(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemByIdFailed>(SprintWorkItemActionTypes.GetSprintWorkItemByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveWorkItem$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintWorkItemFailed>(SprintWorkItemActionTypes.ArchiveSprintWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForParkWorkItem$: Observable<Action> = this.actions$.pipe(
        ofType<ParkSprintWorkItemFailed>(SprintWorkItemActionTypes.ParkSprintWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    moveWorkItemSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<MoveGoalUserStoryToSprintCompleted>(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.translateService.instant('SPRINTS.WORKITEMMOVEDTOSPRINTSUCCESSFULY'), // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    showValidationMessagesForUpsertMultipleCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMultipleSprintWorkItemFailed>(SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForSubTasks$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintWorkItemSubTasksFailed>(SprintWorkItemActionTypes.GetSprintWorkItemSubTasksFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForSprints$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateUserStorySprintFailed>(SprintWorkItemActionTypes.UpdateUserStorySprintFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );



    @Effect()
    showValidationMessagesForMultipleSubTasks$: Observable<Action> = this.actions$.pipe(
        ofType<CreateMultipleSprintUserStoriesFailed>(SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveUserStories$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveKanbanSprintsFailed>(SprintWorkItemActionTypes.ArchiveKanbanSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    SprintUserStoriesExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<SprintUserStoriesExceptionHandled>(SprintWorkItemActionTypes.SprintUserStoriesExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    convertJSONToUserStory(userStory) {
        if (userStory) {
            userStory.subUserStoriesList = [];
            if (userStory && userStory.subUserStories) {
                let featuresListJson = JSON.parse(userStory.subUserStories);
                userStory.subUserStoriesList = featuresListJson.ChildUserStories;
            }
            else {
                userStory.subUserStoriesList = [];
            }
            return userStory;
        }

    }

    convertJSONToUserStories(userStories) {
        userStories.forEach(userStory => {
            if (userStory) {
                userStory.subUserStoriesList = [];
                if (userStory && userStory.subUserStories) {
                    let featuresListJson = JSON.parse(userStory.subUserStories);
                    userStory.subUserStoriesList = featuresListJson.ChildUserStories;
                }
                else {
                    userStory.subUserStoriesList = [];
                }
            }

        })
        return userStories;
    }

    convertUserStoriesToJson(userStories) {
        this.userStoryUpdates = [];
        userStories.forEach(element => {
            var userStoryUpdatesModel = new userStoryUpdates();
            userStoryUpdatesModel.id = element.userStoryId;
            userStoryUpdatesModel.changes = element;
            this.userStoryUpdates.push(userStoryUpdatesModel);
        });
        return this.userStoryUpdates;
    }


    @Effect()
    loadUserStoryHistory$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintWorkItemCompleted>(
            SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted
        ),
        pipe(
            map(() => {
                return new LoadUserstoryHistoryTriggered(this.reloadHistoryId);
            })
        )
    );


    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private goalService: ProjectGoalsService
    ) { }
}