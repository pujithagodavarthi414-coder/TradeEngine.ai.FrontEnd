import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";


import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadRolesTriggered, RolesListActionTypes, RolesExceptionHandled, LoadRolesCompleted, LoadRolesFailed } from "../actions/roles.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { EmployeeListService } from '../../services/employee-list.service';



@Injectable()
export class RolesEffects {

  @Effect()
  loadRolesList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRolesTriggered>(RolesListActionTypes.LoadRolesTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getRolesAll))),
    switchMap(([searchAction, roles]) => {
      // if (roles && roles.length > 0) {
      //   console.log("Roles list is already in cache.");
      //   return empty();
      // }
      // else {
        return this.employeeService.getRolesForEffects(searchAction.RolesSearchResult)
          .pipe(map((RolesList: any) => {
            if (RolesList.success === true) {
              return new LoadRolesCompleted(RolesList.data);
            } else {
              return new LoadRolesFailed(RolesList.apiResponseMessages);
            }
          }),
            catchError(error => {
              return of(new RolesExceptionHandled(error));
            })
          );
     // }
    })
  );

  @Effect()
  showValidationMessagesForRolesList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRolesFailed>(RolesListActionTypes.LoadRolesFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForRolesList$: Observable<Action> = this.actions$.pipe(
    ofType<RolesExceptionHandled>(RolesListActionTypes.RolesExceptionHandled),
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
    private employeeService: EmployeeListService
  ) { }
}