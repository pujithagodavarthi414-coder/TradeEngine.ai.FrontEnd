import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { SprintService } from "../../services/sprints.service";
import { SprintModel } from "../../models/sprints-model";
import { UpsertSprintsTriggered, SprintActionTypes, UpsertSprintsCompleted, UpsertSprintsFailed, SprintsExceptionHandled, GetSprintsTriggered, GetSprintsCompleted, GetSprintsFailed, GetSprintsByIdTriggered, GetSprintsByIdCompleted, GetSprintsByIdFailed, RefreshSprintsList, UpdateSprintsField, ArchiveSprintsTriggered, ArchiveSprintsCompleted, ArchiveSprintsFailed, GetMoreSprintsTriggered, SprintStartTriggered, SprintStartCompleted, SprintStartFailed, ReplanSprintTriggered, ReplanSprintCompleted, UpdateMultipleSprintsTriggered, UpdateMultipleSprintsCompleted, UpdateMultipleSprintsFailed, CompleteSprintsTriggered, CompleteSprintsFailed, CompleteSprintsCompleted, GetUniqueSprintsByIdTriggered, GetUniqueSprintsByIdCompleted, GetUniqueSprintsByIdFailed, GetUniqueSprintsByUniqueIdTriggered, GetAllSprintsTriggered } from "../actions/sprints.action";
import * as _ from "underscore";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ProjectSummaryTriggered } from "../actions/project-summary.action";
import { sprintUpdates } from "../../models/goalUpdates";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class SprintEffects {
    toastrMessage: string;
    sprints: SprintModel;
    isBacklog: boolean;
    sprintId: string;
    isNewSprint: boolean;
    sprintsList: SprintModel[];
    projectId: string;
    sprintUpdates = [];
    @Effect()
    upsertTemplate: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintsTriggered>(SprintActionTypes.UpsertSprintsTriggered),
        switchMap(action => {
            if (action.sprint.sprintId) {
                this.isNewSprint = false;
                this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTUPDATEDSUCCESSFULLY")
            }
            else {
                this.isNewSprint = true;
                this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTADDEDSUCCESSFULLY")
            }
            return this.sprintService
                .upsertSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprintId = response.data;
                        return new UpsertSprintsCompleted(response.data);
                    } else {
                        return new UpsertSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );


    @Effect()
    searchSprints: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintsTriggered>(SprintActionTypes.GetSprintsTriggered),
        switchMap(action => {
            this.isBacklog = action.sprint.isBacklog;
            if (action.sprint.pageNumber == 1) {
                this.sprintsList = [];
            }
            return this.sprintService
                .searchSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprintsList = response.data;
                        return new GetSprintsCompleted(response.data);
                    } else {
                        return new GetSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchAllSprints: Observable<Action> = this.actions$.pipe(
        ofType<GetAllSprintsTriggered>(SprintActionTypes.GetAllSprintsTriggered),
        switchMap(action => {
            this.isBacklog = action.sprint.isBacklog;
            if (action.sprint.pageNumber == 1) {
                this.sprintsList = [];
            }
            return this.sprintService
                .searchAllSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprintsList = response.data;
                        return new GetSprintsCompleted(response.data);
                    } else {
                        return new GetSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    updateSprints: Observable<Action> = this.actions$.pipe(
        ofType<UpdateMultipleSprintsTriggered>(SprintActionTypes.UpdateMultipleSprintsTriggered),
        switchMap(action => {
           var sprints = new SprintModel();
           sprints.sprintIds = action.sprintId;
           sprints.isBacklog = this.isBacklog;
            return this.sprintService
                .searchSprints(sprints)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                    var sprintsList = this.convertGoalsToJson(response.data);
                        return new UpdateMultipleSprintsCompleted({
                            sprintUpdateMultiple: sprintsList
                          })
                    } else {
                        return new UpdateMultipleSprintsCompleted(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchMoreSprints: Observable<Action> = this.actions$.pipe(
        ofType<GetMoreSprintsTriggered>(SprintActionTypes.GetMoreSprintsTriggered),
        switchMap(action => {
            if (action.sprint.pageNumber <= 1) {
                this.sprintsList = [];
            }
            return this.sprintService
                .searchSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var sprintsList = response.data;
                        sprintsList.forEach(sprints => {
                            this.sprintsList.push(sprints);
                        });
                        return new GetSprintsCompleted(this.sprintsList);
                    } else {
                        return new GetSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSprintById: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintsByIdTriggered>(SprintActionTypes.GetSprintsByIdTriggered),
        switchMap(action => {
            return this.sprintService
                .getSprintById(action.sprintId,this.isBacklog, false)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprints = response.data;
                        return new GetSprintsByIdCompleted(response.data);
                    } else {
                        return new GetSprintsByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getUniqueSprintById: Observable<Action> = this.actions$.pipe(
        ofType<GetUniqueSprintsByIdTriggered>(SprintActionTypes.GetUniqueSprintsByIdTriggered),
        switchMap(action => {
            return this.sprintService
                .getSprintById(action.sprintId,this.isBacklog, false)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprints = response.data;
                        return new GetUniqueSprintsByIdCompleted(response.data);
                    } else {
                        return new GetUniqueSprintsByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getUniqueSprintByUniqueId: Observable<Action> = this.actions$.pipe(
        ofType<GetUniqueSprintsByUniqueIdTriggered>(SprintActionTypes.GetUniqueSprintsByUniqueIdTriggered),
        switchMap(action => {
            return this.sprintService
                .getSprintById(action.sprintId,this.isBacklog, true)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.sprints = response.data;
                        return new GetUniqueSprintsByIdCompleted(response.data);
                    } else {
                        return new GetUniqueSprintsByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadSprintById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintsCompleted>(SprintActionTypes.UpsertSprintsCompleted),
        pipe(
            map(() => {
                return new GetSprintsByIdTriggered(this.sprintId);
            })
        )
    );

    @Effect()
    UpdatesoftLabelChanges$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintsByIdCompleted>(SprintActionTypes.GetSprintsByIdCompleted),
        pipe(
            map(() => {
                if (this.isNewSprint) {
                    this.sprintsList.push(this.sprints);
                    return new RefreshSprintsList(this.sprints);
                }
                else {
                    var sprintsList = this.sprintsList;
                    const sprintId = this.sprints.sprintId;
                    const filteredList = _.filter(sprintsList, function (sprint) {
                        return sprintId.toString().includes(sprint.sprintId);
                    })
                    if (filteredList.length > 0) {
                        var idx = this.sprintsList.indexOf(filteredList[0]);
                        if (idx > 0) {
                            this.sprintsList[idx] = this.sprints
                        }
                    }

                    return new UpdateSprintsField({
                        sprintUpdate: {
                            id: this.sprints.sprintId,
                            changes: this.sprints
                        }
                    });
                }
            })
        )
    );

    @Effect()
    deleteTemplate: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintsTriggered>(SprintActionTypes.ArchiveSprintsTriggered),
        switchMap(action => {
            this.projectId = action.sprint.projectId;
            this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTDELETEDSUCCESSFULLY")
            return this.sprintService.archiveSprint(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var sprintsList = this.sprintsList;
                        const filteredList = _.filter(sprintsList, function (sprint) {
                            return action.sprint.sprintId.toString().includes(sprint.sprintId);
                        })
                        if (filteredList.length > 0) {
                            const index = this.sprintsList.indexOf(filteredList[0]);
                            if (index > -1) {
                                this.sprintsList.splice(index, 1);
                            }
                        }

                        return new ArchiveSprintsCompleted(response.data);
                    } else {
                        return new ArchiveSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    completeSprint: Observable<Action> = this.actions$.pipe(
        ofType<CompleteSprintsTriggered>(SprintActionTypes.CompleteSprintsTriggered),
        switchMap(action => {
            this.projectId = action.sprint.projectId;
            this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTCOMPLETEDSUCCESSFULLY")
            return this.sprintService.completeSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var sprintsList = this.sprintsList;
                        const filteredList = _.filter(sprintsList, function (sprint) {
                            return action.sprint.sprintId.toString().includes(sprint.sprintId);
                        })
                        if (filteredList.length > 0) {
                            const index = this.sprintsList.indexOf(filteredList[0]);
                            if (index > -1) {
                                this.sprintsList.splice(index, 1);
                            }
                        }

                        return new CompleteSprintsCompleted(response.data);
                    } else {
                        return new CompleteSprintsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    sprintStart: Observable<Action> = this.actions$.pipe(
        ofType<SprintStartTriggered>(SprintActionTypes.SprintStartTriggered),
        switchMap(action => {
            this.projectId = action.sprint.projectId;
            this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTDELETEDSUCCESSFULLY")
            return this.sprintService.upsertSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var sprintsList = this.sprintsList;
                        const filteredList = _.filter(sprintsList, function (sprint) {
                            return action.sprint.sprintId.toString().includes(sprint.sprintId);
                        })
                        if (filteredList.length > 0) {
                            const index = this.sprintsList.indexOf(filteredList[0]);
                            if (index > -1) {
                                this.sprintsList.splice(index, 1);
                            }
                        }

                        return new SprintStartCompleted(response.data);
                    } else {
                        return new SprintStartFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    projectCount$: Observable<Action> = this.actions$.pipe(
        ofType<SprintStartCompleted>(SprintActionTypes.SprintStartCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    sprintsCount$: Observable<Action> = this.actions$.pipe(
        ofType<CompleteSprintsCompleted>(SprintActionTypes.CompleteSprintsCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    sprintReplan: Observable<Action> = this.actions$.pipe(
        ofType<ReplanSprintTriggered>(SprintActionTypes.ReplanSprintTriggered),
        switchMap(action => {
            this.projectId = action.sprint.projectId;
            this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTDELETEDSUCCESSFULLY")
            return this.sprintService.upsertSprints(action.sprint)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        var sprintsList = this.sprintsList;
                        const filteredList = _.filter(sprintsList, function (sprint) {
                            return action.sprint.sprintId.toString().includes(sprint.sprintId);
                        })
                        if (filteredList.length > 0) {
                            const index = this.sprintsList.indexOf(filteredList[0]);
                            if (index > -1) {
                                this.sprintsList.splice(index, 1);
                            }
                        }

                        return new ReplanSprintCompleted(response.data);
                    } else {
                        return new SprintStartFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new SprintsExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    sprintCount$: Observable<Action> = this.actions$.pipe(
        ofType<ReplanSprintCompleted>(SprintActionTypes.ReplanSprintCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    deleteProjectCount$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintsCompleted>(SprintActionTypes.ArchiveSprintsCompleted),
        pipe(
            map(() => {
                return new ProjectSummaryTriggered(this.projectId);
            })
        )
    );

    @Effect()
    showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintsFailed>(SprintActionTypes.UpsertSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintsFailed>(SprintActionTypes.GetSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCompleteSprint$: Observable<Action> = this.actions$.pipe(
        ofType<CompleteSprintsFailed>(SprintActionTypes.CompleteSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetSprintsByIdFailed>(SprintActionTypes.GetSprintsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForDeleteTemplate$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintsFailed>(SprintActionTypes.ArchiveSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForstartSprint$: Observable<Action> = this.actions$.pipe(
        ofType<SprintStartFailed>(SprintActionTypes.SprintStartFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesFormultipleSprint$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateMultipleSprintsFailed>(SprintActionTypes.UpdateMultipleSprintsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessageSprint$: Observable<Action> = this.actions$.pipe(
        ofType<GetUniqueSprintsByIdFailed>(SprintActionTypes.GetUniqueSprintsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    SprintsExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<SprintsExceptionHandled>(SprintActionTypes.SprintsExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    @Effect()
    upsertSprintArchiveSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveSprintsCompleted>(SprintActionTypes.ArchiveSprintsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toastrMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    upsertSprintCompleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<CompleteSprintsCompleted>(SprintActionTypes.CompleteSprintsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toastrMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    upsertSprintSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertSprintsCompleted>(SprintActionTypes.UpsertSprintsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toastrMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    startSprintSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<SprintStartCompleted>(SprintActionTypes.SprintStartCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.translateService.instant('SPRINTS.SPRINTSTARTEDSUCCESSFULLY'), // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    replanSprintSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<ReplanSprintTriggered>(SprintActionTypes.ReplanSprintTriggered),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.translateService.instant('SPRINTS.SPRINTREPLANNEDSUCCESSFULLY'), // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success),
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    convertGoalsToJson(sprintsList) {
        this.sprintUpdates = [];
        sprintsList.forEach((element) => {
          const goalUpdatesModel = new sprintUpdates();
          goalUpdatesModel.id = element.sprintId;
          goalUpdatesModel.changes = element
          this.sprintUpdates.push(goalUpdatesModel);
        });
        return this.sprintUpdates;
      }



    constructor(
        private actions$: Actions,
        private sprintService: SprintService,
        private translateService: TranslateService
    ) { }
}