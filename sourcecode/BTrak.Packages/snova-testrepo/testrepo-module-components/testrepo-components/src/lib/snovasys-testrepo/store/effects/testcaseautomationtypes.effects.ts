import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import {
    TestCaseAutomationActionTypes,
    LoadTestCaseAutomationListTriggered,
    LoadTestCaseAutomationListCompleted,
    LoadTestCaseAutomationListFromCache
} from '../actions/testcaseautomationtypes.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../reducers/index';
import * as testRailReducers from "../reducers/index";

@Injectable()
export class TestCaseAutomationEffects {

    constructor(private actions$: Actions, private store$: Store<State>, private testRailService: TestRailService) { }

    @Effect()
    loadtestCaseAutomations$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseAutomationListTriggered>(TestCaseAutomationActionTypes.LoadTestCaseAutomationListTriggered),
        withLatestFrom(this.store$.pipe(select(testRailReducers.getTestCaseAutomationAll))),
        switchMap(([getAction, automations]) => {
            // if (automations && automations.length > 0) {
            //     return of(new LoadTestCaseAutomationListFromCache());
            // }
            // else {
                return this.testRailService.GetTestCaseAutomationTypes(getAction.dropDownList).pipe(
                    map((testCaseAutomations: any) => new LoadTestCaseAutomationListCompleted(testCaseAutomations.data)),
                );
           // }
        })
    );
}