import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { WorkFlowService } from "../../services/workFlow.Services";
import {
  LoadworkflowStatusCompleted,
  LoadworkflowStatusTriggered,
  workFlowStatusActionTypes,
  WorkflowStatusExceptionHandled,
  LoadworkflowStatusCompletedFromCache,
  LoadWorkflowStatusListTriggered
} from "../actions/work-flow-status.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";
import { State } from "../../store/reducers/index";
import * as projectReducers from "../reducers/index";
import * as _ from 'underscore';
import { SearchUserStoriesFailed } from "../actions/userStory.actions";

@Injectable()
export class WorkflowStatusEffects {
  @Effect()
  loadWorkflowStatus$: Observable<Action> = this.actions$.pipe(
    ofType<LoadworkflowStatusTriggered>(
      workFlowStatusActionTypes.LoadworkflowStatusTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectReducers.getworkflowStatusAll))),
    switchMap(([action, workflowStatuses]) => {
      return this.workflowService
        .GetAllWorkFlowStatus(action.workflowStatusModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new LoadworkflowStatusCompleted(userStories.data)
            }
            else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new WorkflowStatusExceptionHandled(err));
          })
        );
    })
  );
  
  @Effect()
  loadWorkflowStatusList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadWorkflowStatusListTriggered>(
      workFlowStatusActionTypes.LoadWorkflowStatusListTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectReducers.getworkflowStatusAll))),
    switchMap(([action, workflowStatuses]) => {
      return this.workflowService
        .GetAllWorkFlowStatus(action.workflowStatusModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new LoadworkflowStatusCompleted(userStories.data)
            }
            else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new WorkflowStatusExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  WorkflowStatusExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<WorkflowStatusExceptionHandled>(
      workFlowStatusActionTypes.WorkflowStatusExceptionHandled
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
    private store$: Store<State>,
    private workflowService: WorkFlowService
  ) { }
}
