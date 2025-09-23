import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { BoardTypeService } from "../../services/boardType.service";

import {
  WorkflowActionTypes,
  LoadWorkflowTriggered,
  LoadWorkflowCompleted,
  WorkflowExceptionHandled
} from "../actions/workflow-list.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class WorkflowListEffects {
 
  @Effect()
  loadWorkflowList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadWorkflowTriggered>(WorkflowActionTypes.LoadWorkflowTriggered),
    switchMap(() => {
      return this.boardTypeService.GetAllWorkFlows().pipe(
        map((workflows: any) => new LoadWorkflowCompleted(workflows.data)),
        catchError(err => {
          return of(new WorkflowExceptionHandled(err));
        })
      );
    })
  );

  
  @Effect()
  WorkflowExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<WorkflowExceptionHandled>(
      WorkflowActionTypes .WorkflowExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );


  constructor(
    private actions$: Actions,
    private boardTypeService: BoardTypeService
  ) {}
}
