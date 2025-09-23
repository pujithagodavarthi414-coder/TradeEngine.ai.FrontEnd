import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";
import {
  UserStoryStatusActionTypes,
  LoadUserStoryStatusTriggered,
  LoadUserStoryStatusCompleted
} from "../actions/userStoryStatus.action";
import { WorkFlowService } from "../../services/workFlow.Services";
import { StatusesModel } from "../../models/workflowStatusesModel";

@Injectable()
export class UserStoryStatusEffects {
  @Effect()
  loadUserStoryStatus$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserStoryStatusTriggered>(
      UserStoryStatusActionTypes.LoadUserStoryStatusTriggered
    ),
    switchMap(() => {
      let userStoryStatus = new StatusesModel();
      return this.workflowService.GetAllStatus(userStoryStatus).pipe(
        map((userStoryStatus: any) => {
          // TODO: PLEASE GET RID OF ANY
          return new LoadUserStoryStatusCompleted(userStoryStatus.data);
        })
      );
    })
  );
  constructor(
    private actions$: Actions,
    private workflowService: WorkFlowService
  ) {}
}
