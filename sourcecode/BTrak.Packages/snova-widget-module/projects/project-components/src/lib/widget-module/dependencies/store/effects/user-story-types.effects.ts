import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";
import {
  UserStoryTypesActionTypes,
  LoadUserStoryTypesTriggered,
  LoadUserStoryTypesCompleted,
  LoadUserStoryTypesFailed
} from "../actions/user-story-types.action";
import { ProjectStatusService } from "../../services/projectStatus.service";
import { ShowValidationMessages } from "../actions/notification-validator.action";

@Injectable()
export class UserStoryTypesEffects {
  @Effect()
  loadUserStoryTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserStoryTypesTriggered>(
      UserStoryTypesActionTypes.LoadUserStoryTypesTriggered
    ),
    switchMap((userStoryTypesTriggeredAction) => {
      return this.projectService.getAllUserStoryTypes(userStoryTypesTriggeredAction.userStoryTypesModel).pipe(
        map((userStoryStatus: any) => {
          if(userStoryStatus.success){
            return new LoadUserStoryTypesCompleted(userStoryStatus.data);
          }
          else{
            return new LoadUserStoryTypesFailed(userStoryStatus.apiResponseMessages);
          }
          // TODO: PLEASE GET RID OF ANY
        
        })
      );
    })
  );

  @Effect()
  showValidationMessagesForProject$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadUserStoryTypesFailed>(
      UserStoryTypesActionTypes.LoadUserStoryTypesFailed
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
    private projectService: ProjectStatusService
  ) {}
}
