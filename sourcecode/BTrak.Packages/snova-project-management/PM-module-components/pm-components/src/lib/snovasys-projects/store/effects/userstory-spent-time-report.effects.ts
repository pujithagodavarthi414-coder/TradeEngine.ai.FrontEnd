import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ProjectGoalsService } from "../../services/goals.service";
import {
  LoadSpentTimeReportsTriggered,
  LoadSpentTimeReportsCompleted,
  SpentTimeReportsActionTypes,
  UserStorySpentTimeExceptionHandled
} from "../actions/userstory-spent-time-report.action";

@Injectable()
export class userStorySpentTimeReportsEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSpentTimeReportsTriggered>(
      SpentTimeReportsActionTypes.LoadSpentTimeReportsTriggered
    ),
    switchMap(searchAction => {
      return this.goalService
        .GetUserStorySpentTimeReport(searchAction.spentTimeReport)
        .pipe(
          map((report: any) => new LoadSpentTimeReportsCompleted(report.data)),
          catchError(error => of(new UserStorySpentTimeExceptionHandled(error)))
        );
    })
  );
  constructor(
    private actions$: Actions,
    private goalService: ProjectGoalsService
  ) {}
}
