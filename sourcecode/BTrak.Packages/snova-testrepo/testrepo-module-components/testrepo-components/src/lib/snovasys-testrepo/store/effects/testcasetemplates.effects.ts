import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import {
    TestCaseTemplateActionTypes,
    LoadTestCaseTemplateListTriggered,
    LoadTestCaseTemplateListCompleted,
    LoadTestCaseTemplateListFromCache
} from '../actions/testcasetemplates.actions';

import { TestRailService } from '../../services/testrail.service';
import { State } from '../reducers/index';
import * as testRailReducers from "../reducers/index";

@Injectable()
export class TestCaseTemplateEffects {

    constructor(private actions$: Actions, private store$: Store<State>, private testRailService: TestRailService) { }

    @Effect()
    loadtestCaseTemplates$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseTemplateListTriggered>(TestCaseTemplateActionTypes.LoadTestCaseTemplateListTriggered),
        withLatestFrom(this.store$.pipe(select(testRailReducers.getTestCaseTemplateAll))),
        switchMap(([getAction, templates]) => {
            if (templates && templates.length > 0) {
                return of(new LoadTestCaseTemplateListFromCache());
            }
            else {
                return this.testRailService.GetTestCaseTemplates(getAction.dropDownList).pipe(
                    map((testCaseTemplates: any) => new LoadTestCaseTemplateListCompleted(testCaseTemplates.data)),
                );
            }
        })
    );
}