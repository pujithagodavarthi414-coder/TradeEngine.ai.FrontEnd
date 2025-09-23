import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { WorkFlowService } from "../../services/workFlow.Services";
import {
  workflowStatusTransitionActions,
  LoadworkflowStatusTransitionCompleted,
  LoadworkflowStatusTransitionTriggered,
  workFlowStatusTransitionActionTypes,
  WorkflowStatusTransitionExceptionHandled,
  LoadworkflowStatusTransitionFailed
} from "../actions/work-flow-status-transitions.action";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";

@Injectable()
export class WorkflowStatusTransitionEffects {
  @Effect()
  loadWorkflowStatusTransitions$: Observable<Action> = this.actions$.pipe(
    ofType<LoadworkflowStatusTransitionTriggered>(
      workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionTriggered
    ),
    switchMap(searchAction => {
      return this.workflowService
        .GetAllWorkFlowStatusTranitions(searchAction.workflowTransitions)
        .pipe(
          map((workflowStatus: any) => {
             if(workflowStatus.success){
               return  new LoadworkflowStatusTransitionCompleted(workflowStatus.data)
             }
             else{
              return new LoadworkflowStatusTransitionFailed(workflowStatus.apiResponseMessages)
             }
          }),
        catchError(err => {
          return of(new WorkflowStatusTransitionExceptionHandled(err));
        })
      );
    })
  );

  
  @Effect()
  WorkflowStatusTransitionExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<WorkflowStatusTransitionExceptionHandled>(
      workFlowStatusTransitionActionTypes.WorkflowStatusTransitionExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  LoadTransitionsFailed$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadworkflowStatusTransitionFailed>(
      workFlowStatusTransitionActionTypes.LoadworkflowStatusTransitionFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages, // TODO: Change to proper toast message
      })
      )
    })
  );


  constructor(
    private actions$: Actions,
    private workflowService: WorkFlowService
  ) {}
}
