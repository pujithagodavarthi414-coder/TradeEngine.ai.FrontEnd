// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action, select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import * as projectModulereducers from "../reducers/index";
// tslint:disable-next-line: ordered-imports
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { ProjectStatusService } from "../../services/projectStatus.service";
import {
  BugPriorityActionTypes,
  // tslint:disable-next-line: ordered-imports
  LoadBugPriorityTypesCompleted,
  LoadBugPriorityTypesFailed,
  LoadBugPriorityTypesTriggered
} from "../actions/bug-priority.action";
import { ShowValidationMessages } from "../actions/notification-validator.action";
import {State} from "../reducers/index";
@Injectable()
export class BugPriorityTypesEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBugPriorityTypesTriggered>(
      BugPriorityActionTypes.LoadBugPriorityTypesTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectModulereducers.getBugPriorityAll))),
    switchMap(([_, bugPriorities]) => {
     
        return this.bugPriorityService
          .GetAllBugPriporities(new BugPriorityDropDownData())
          .pipe(
            // tslint:disable-next-line: no-shadowed-variable
            map((bugPriorities: any) => {
              if (bugPriorities.success) {
                return new LoadBugPriorityTypesCompleted(bugPriorities.data);
              } else {
                return new LoadBugPriorityTypesFailed(bugPriorities.apiResponseMessages);
              }
            })
          );
    })
  );

  @Effect()
  showValidationMessagesForBugPriorities$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadBugPriorityTypesFailed>(
      BugPriorityActionTypes.LoadBugPriorityTypesFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bugPriorityService: ProjectStatusService
  ) {}
}
