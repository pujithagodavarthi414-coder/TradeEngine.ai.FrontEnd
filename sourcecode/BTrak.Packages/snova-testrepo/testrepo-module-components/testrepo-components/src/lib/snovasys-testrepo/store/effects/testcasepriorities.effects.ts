import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import {
    TestCasePriorityActionTypes,
    LoadTestCasePriorityListTriggered,
    LoadTestCasePriorityListCompleted,
    LoadTestCasePriorityListFromCache
} from '../actions/testcasepriorities.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../reducers/index';
import * as testRailReducers from "../reducers/index";

@Injectable()
export class TestCasePriorityEffects {

    constructor(private actions$: Actions, private store$: Store<State>, private testRailService: TestRailService) { }

    @Effect()
    loadtestCasePriorities$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCasePriorityListTriggered>(TestCasePriorityActionTypes.LoadTestCasePriorityListTriggered),
        withLatestFrom(this.store$.pipe(select(testRailReducers.getTestCasePriorityAll))),
        switchMap(([getAction, priorities]) => {
            // if (priorities && priorities.length > 0) {
            //     return of(new LoadTestCasePriorityListFromCache());
            // }
            // else {
                return this.testRailService.GetTestCasePriorities(getAction.dropDownList).pipe(
                    map((testCasePriorities: any) => new LoadTestCasePriorityListCompleted(testCasePriorities.data)),
                );
            //}
        })
    );
}