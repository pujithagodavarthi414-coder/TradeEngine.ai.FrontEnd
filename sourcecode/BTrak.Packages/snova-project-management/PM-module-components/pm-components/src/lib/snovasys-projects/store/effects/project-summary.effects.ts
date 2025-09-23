import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import {
  ProjectSummaryTriggered,
  ProjectSummaryActionTypes,
  ProjectSummaryCompleted,
  ProjectSummaryLoadFailed,
  ProjectSummaryExceptionHandled
} from "../actions/project-summary.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { ShowValidationMessages } from "../actions/notification-validator.action";

@Injectable()
export class ProjectSummaryEffects {
  @Effect()
  getProjectSummary$: Observable<Action> = this.actions$.pipe(
    ofType<ProjectSummaryTriggered>(
      ProjectSummaryActionTypes.ProjectSummaryTriggered
    ),
    switchMap(searchAction =>
      this.projectGoalsService
        .GetProjectOverViewStatus(searchAction.projectId)
        .pipe(
          map((projects: any) => {
            if(projects.success){
               return new ProjectSummaryCompleted(projects.data)
            }
            else{
              return new ProjectSummaryLoadFailed(projects.apiResponseMessages)
            }
          }
          ),
          catchError(error => of(new ProjectSummaryExceptionHandled(error)))
        )
    )
  );

  @Effect()
  showValidationMessagesForSummaryFailed$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectSummaryLoadFailed>(
      ProjectSummaryActionTypes.ProjectSummaryLoadFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  
  @Effect()
  searchError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ProjectSummaryExceptionHandled>(
      ProjectSummaryActionTypes.ProjectSummaryExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  constructor(
    private actions$: Actions,
    private projectGoalsService: ProjectGoalsService
  ) {}
}
