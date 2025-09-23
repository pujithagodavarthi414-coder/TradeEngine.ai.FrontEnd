import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import {
    MileStoneDropdownActionTypes,
    LoadMileStoneDropdownListTriggered,
    LoadMileStoneDropdownListCompleted
} from '../actions/milestonedropdown.actions';

import { TestRailService } from '../../services/testrail.service';

@Injectable()
export class MileStoneDropdownEffects {

    constructor(private actions$: Actions, private testRailService: TestRailService) { }

    @Effect()
    loadMileStoneDropdownList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneDropdownListTriggered>(MileStoneDropdownActionTypes.LoadMileStoneDropdownListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetMileStoneDropdownList(getAction.projectId).pipe(
                map((mileStoneDropdownList: any) => new LoadMileStoneDropdownListCompleted(mileStoneDropdownList.data)),
            );
        })
    );
}