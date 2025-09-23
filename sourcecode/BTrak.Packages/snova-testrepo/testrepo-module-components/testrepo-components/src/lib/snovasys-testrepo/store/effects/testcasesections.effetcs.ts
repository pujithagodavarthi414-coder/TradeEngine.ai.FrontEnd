import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import {
    TestCaseSectionActionTypes,
    LoadTestCaseSectionListTriggered,
    LoadTestCaseSectionListCompleted,
    LoadTestCaseSectionListForShiftTriggered,
    LoadTestCaseSectionListForShiftCompleted
} from '../actions/testcasesections.actions';

import { TestRailService } from '../../services/testrail.service';

@Injectable()
export class TestCaseSectionEffects {

    constructor(private actions$: Actions, private testRailService: TestRailService) { }

    @Effect()
    loadtestCaseSections$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseSectionListTriggered>(TestCaseSectionActionTypes.LoadTestCaseSectionListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCaseSections(getAction.suiteId).pipe(
                map((testCaseSections: any) => new LoadTestCaseSectionListCompleted(testCaseSections.data)),
            );
        })
    );

    @Effect()
    loadtestCaseSectionsForShift$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestCaseSectionListForShiftTriggered>(TestCaseSectionActionTypes.LoadTestCaseSectionListForShiftTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestCaseSections(getAction.suiteForShiftId).pipe(
                map((testCaseSections: any) => new LoadTestCaseSectionListForShiftCompleted(testCaseSections.data)),
            );
        })
    );
}