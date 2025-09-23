// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { catchError, map, switchMap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { GoalsFilterService } from "../../services/goalFilters.service";
// tslint:disable-next-line: ordered-imports
import {
    ArchiveGoalFiltersCompleted, ArchiveGoalFiltersFailed, ArchiveGoalFiltersTriggered, GoalFiltersExceptionHandled, GetGoalFiltersCompleted,
    GetGoalFiltersFailed, GetGoalFiltersTriggered, GoalFiltersActionTypes, UpsertGoalFiltersCompleted, UpsertGoalFiltersFailed,
    UpsertGoalFiltersTriggered
} from "../actions/goal-filters.action";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class GoalFilterEffects {
    toastrMessage: string;
    @Effect()
    upsertGoalFilters$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertGoalFiltersTriggered>(
            GoalFiltersActionTypes.UpsertGoalFiltersTriggered
        ),
        switchMap((goalTriggeredAction) => {
            return this.goalFilterService.upsertGoalFilters(goalTriggeredAction.goalFilterModel).pipe(
                map((response: any) => {
                    if (goalTriggeredAction.goalFilterModel.goalFilterId) {
                        this.toastrMessage = this.translateService.instant("ADVANCEDSEARCH.GOALFILTERUPDATEDSUCCESSFULLY")
                    } else {
                        this.toastrMessage = this.translateService.instant("ADVANCEDSEARCH.GOALFILTERADDEDSUCCESSFULLY")
                    }
                    if (response.success) {
                        return new UpsertGoalFiltersCompleted(response.data)
                    } else {
                        return new UpsertGoalFiltersFailed(response.apiResponseMessages)
                    }
                }),
                catchError((err) => {
                    return of(new GoalFiltersExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    searchGoalFilters$: Observable<Action> = this.actions$.pipe(
        ofType<GetGoalFiltersTriggered>(
            GoalFiltersActionTypes.GetGoalFiltersTriggered
        ),
        switchMap((goalTriggeredAction) => {
            return this.goalFilterService.searchGoalsFiltets(goalTriggeredAction.goalFilterModel).pipe(
                map((response: any) => {
                    if (response.success) {
                        let expectedResult = [];
                        let filteredResult = [];
                        if(response.data.length > 0) {
                            expectedResult = response.data;
                            expectedResult.forEach((data: any)=> {
                                if(data) {
                                    filteredResult.push(data)
                                }
                            })

                        } else {
                            expectedResult = [];
                            filteredResult = [];
                        }
                        return new GetGoalFiltersCompleted(filteredResult);
                    } else {
                        return new GetGoalFiltersFailed(response.apiResponseMessages)
                    }
                }),
                catchError((err) => {
                    return of(new GoalFiltersExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    archiveGoalFilters$: Observable<Action> = this.actions$.pipe(
        ofType<ArchiveGoalFiltersTriggered>(
            GoalFiltersActionTypes.ArchiveGoalFiltersTriggered
        ),
        switchMap((goalTriggeredAction) => {
            return this.goalFilterService.archiveGoalsFiltets(goalTriggeredAction.archivedGoalFilter).pipe(
                map((response: any) => {
                    if (response.success) {
                        return new ArchiveGoalFiltersCompleted(goalTriggeredAction.archivedGoalFilter.goalFilterId)
                    } else {
                        return new ArchiveGoalFiltersFailed(response.apiResponseMessages)
                    }
                }),
                catchError((err) => {
                    return of(new GoalFiltersExceptionHandled(err));
                })
            );
        })
    );

    @Effect()
    GoalFiltersExceptionHandled$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<GoalFiltersExceptionHandled>(
            GoalFiltersActionTypes.GoalFiltersExceptionHandled
        ),
        switchMap((searchAction) => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage // TODO: Change to proper toast message
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForFileUpload$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<UpsertGoalFiltersFailed>(
            GoalFiltersActionTypes.UpsertGoalFiltersFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGoalFilters$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<GetGoalFiltersFailed>(
            GoalFiltersActionTypes.GetGoalFiltersFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveGoalFilters$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<ArchiveGoalFiltersFailed>(
            GoalFiltersActionTypes.ArchiveGoalFiltersFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    upsertProjectFeatureSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertGoalFiltersCompleted>(
            GoalFiltersActionTypes.UpsertGoalFiltersCompleted
        ),
        map(() => new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
        })
        )
    );

    constructor(private actions$: Actions,
        private goalFilterService: GoalsFilterService,
        private translateService: TranslateService) { }

}
