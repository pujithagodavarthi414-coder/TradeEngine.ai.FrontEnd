import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import {
    TestRunUsersActionTypes,
    LoadTestRunUsersListTriggered,
    LoadTestRunUsersListCompleted
} from '../actions/testrunusers.actions';

import { TestRailService } from '../../services/testrail.service';

@Injectable()
export class TestRunUserEffects {

    constructor(private actions$: Actions, private testRailService: TestRailService) { }

    @Effect()
    loadtestRunUsers$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunUsersListTriggered>(TestRunUsersActionTypes.LoadTestRunUsersListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetUsers(getAction.projectId).pipe(
                map((testRunsList: any) => new LoadTestRunUsersListCompleted(testRunsList.data)),
            );
        })
    );
}