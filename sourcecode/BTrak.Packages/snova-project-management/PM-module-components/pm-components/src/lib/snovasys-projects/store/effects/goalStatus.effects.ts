import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import {
  GoalStatusActionTypes,
  LoadGoalStatusTriggered,
  LoadGoalStatusCompleted
} from "../actions/goalStatus.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { Action, select, Store } from "@ngrx/store";
import { State } from "../reducers/index";
import * as projectReducers from "../reducers/index";


@Injectable()
export class GoalStatusEffects {
  @Effect()
  loaGoalStatus$: Observable<Action> = this.actions$.pipe(
    ofType<LoadGoalStatusTriggered>(
      GoalStatusActionTypes.LoadGoalStatusTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectReducers.getgoalStatusAll))),
    switchMap(([_,goalStatus]) => {
    
        return this.projectGoalService.GetAllGoalStatus().pipe(
          map((goalStatus: any) => {
            // TODO: PLEASE GET RID OF ANY
            return new LoadGoalStatusCompleted(goalStatus.data);
          })
        );
      
    })
  );
  constructor(
    private actions$: Actions,
    private projectGoalService: ProjectGoalsService,
    private store$: Store<State>
  ) {}
}
