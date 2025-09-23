import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import {
    TestCasesActionTypes,
    LoadTestCaseTypeListTriggered,
    LoadTestCaseTypeListCompleted,
    LoadTestCaseTypeListFromCache
} from '../actions/testcasetypes.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../reducers/index';
import * as testRailReducers from "../reducers/index";

@Injectable()
export class TestCaseTypeEffects {

    constructor(private actions$: Actions, private store$: Store<State>, private testRailService: TestRailService) { }

    @Effect()
    loadtestCaseTypes$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTypeListTriggered>(TestCasesActionTypes.LoadTestCaseTypeListTriggered),
        withLatestFrom(this.store$.pipe(select(testRailReducers.getTestCaseTypeAll))),
        switchMap(([getAction, types]) => {
            // if (types && types.length > 0) {
            //     return of(new LoadTestCaseTypeListFromCache());
            // }
            // else {
                return this.testRailService.GetTestCaseTypes(getAction.dropDownList).pipe(
                    map((testCaseTypes: any) => new LoadTestCaseTypeListCompleted(testCaseTypes.data)),
                );
            //}
        })
    );
}