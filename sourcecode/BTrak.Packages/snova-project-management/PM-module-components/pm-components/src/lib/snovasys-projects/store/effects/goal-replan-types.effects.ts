import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { BoardTypeService } from "../../services/boardType.service";
import {
  GoalReplanActionsActionTypes,
  LoadGoalReplanActionsTriggered,
  LoadGoalReplanActionsCompleted,
  InsertGoalReplanCompleted,
  InsertGoalReplanTriggered,
  InsertGoalReplanFailed
} from "../actions/goal-replan-types.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { State } from "../reducers/index";
import * as projectReducers from "../reducers/index";
import { GoalReplanModel } from "../../models/goalReplanModel";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';


@Injectable()
export class GoalReplanTypesEffects {
  toastrMessage: string;
  @Effect()
  loadGoalReplanTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadGoalReplanActionsTriggered>(
      GoalReplanActionsActionTypes.LoadGoalReplanActionsTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectReducers.getGoalReplanTypesAll))),
    switchMap(([_, goalReplan]) => {
      
        var goalReplanModel = new GoalReplanModel();
        goalReplanModel.isArchived = false;
        return this.goalService.GetAllGoalReplanTypes(goalReplanModel).pipe(
          map((goalReplan: any) => {
            //TODO: PLEASE GET RID OF ANY
            return new LoadGoalReplanActionsCompleted(goalReplan.data);
          })
        );
      
    })
  );
  @Effect()
  upsertGoalReplan$: Observable<Action> = this.actions$.pipe(
    ofType<InsertGoalReplanTriggered>(
      GoalReplanActionsActionTypes.InsertGoalReplanTriggered
    ),
    switchMap(goalReplanTriggeredAction => {
      if (goalReplanTriggeredAction.goalReplan.isFromSprint) {
        this.toastrMessage = this.translateService.instant("SPRINTS.SPRINTREPLANNEDSUCCESSFULLY")
      } else {
        this.toastrMessage = this.translateService.instant("GOAL.GOALREPLANNEDSUCCESSFULLY")
      }
      return this.goalService
        .insertGoalReplan(goalReplanTriggeredAction.goalReplan)
        .pipe(
          map((goalReplan: any) => {
            if (goalReplan.success === true) {
              return new InsertGoalReplanCompleted(goalReplan);
            }
            else {
              return new InsertGoalReplanFailed(goalReplan.apiResponseMessages);
            }
          })
        );
    })
  );

  @Effect()
  upsertProjectSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<InsertGoalReplanCompleted>(
      GoalReplanActionsActionTypes.InsertGoalReplanCompleted
    ),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: "Goal Replan Started successfully", // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private goalService: ProjectGoalsService,
    private store$: Store<State>,
    private translateService: TranslateService
  ) { }
}
