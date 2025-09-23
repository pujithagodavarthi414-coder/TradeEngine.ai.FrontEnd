// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action, select, Store } from "@ngrx/store";
import { Observable, of, empty } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { ConsideredHours } from "../../models/consideredHours";
import { ConsideredHoursService } from "../../services/consideredHours.service";
import {
  ConsideredHoursActionTypes,
  // tslint:disable-next-line: ordered-imports
  LoadConsideredHoursExceptionHandled,
  LoadConsideredHoursCompleted,
  LoadConsideredHoursTriggered
} from "../actions/consider-hours.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";
import * as projectModulereducers from "../reducers/index";
import { ArchiveUnArchiveGoalCompleted } from '../actions/goal.actions';

@Injectable()
export class ConsiderHoursEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadConsideredHoursTriggered>(
      ConsideredHoursActionTypes.LoadConsideredHoursTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectModulereducers.getConsiderHoursAll))),
    switchMap((_, consideredHours) => {
      
        return this.considerHoursService.GetAllConsideredHours(new ConsideredHours()).pipe(
          map((user: any) => new LoadConsideredHoursCompleted(user.data)),
          catchError((err) => {
            return of(new LoadConsideredHoursExceptionHandled(err));
          })
        );
      
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadConsideredHoursExceptionHandled>(
      ConsideredHoursActionTypes.LoadConsideredHoursExceptionHandled
    ),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<projectModulereducers.State>,
    private considerHoursService: ConsideredHoursService
  ) { }
}
