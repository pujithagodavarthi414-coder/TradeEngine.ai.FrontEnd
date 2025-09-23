import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import {
    TestCaseStatusActionTypes,
    LoadTestCaseStatusListTriggered,
    LoadTestCaseStatusListCompleted,
    LoadTestCaseStatusListFromCache
} from '../actions/testcaseStatuses.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../reducers/index';
import * as testRailReducers from "../reducers/index";

@Injectable()
export class TestCaseStatusEffects {

    constructor(private actions$: Actions, private store$: Store<State>, private testRailService: TestRailService) { }

    @Effect()
    loadtestCaseStatuses$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseStatusListTriggered>(TestCaseStatusActionTypes.LoadTestCaseStatusListTriggered),
        withLatestFrom(this.store$.pipe(select(testRailReducers.getTestCaseStatusAll))),
        switchMap(([getAction, Statuses]) => {
            if (Statuses && Statuses.length > 0) {
                return of(new LoadTestCaseStatusListFromCache());
            }
            else {
                return this.testRailService.GetTestCaseStatus(getAction.dropDownList).pipe(
                    map((testCaseStatuses: any) => new LoadTestCaseStatusListCompleted(testCaseStatuses.data)),
                );
            }
        })
    );
}