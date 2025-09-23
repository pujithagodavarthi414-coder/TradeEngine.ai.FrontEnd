import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadMembershipTriggered, MembershipListActionTypes, ExceptionHandled, LoadMembershipCompleted, LoadMembershipFailed } from "../actions/membership.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class MembershipEffects {

  @Effect()
  loadMembershipList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadMembershipTriggered>(MembershipListActionTypes.LoadMembershipTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getMembershipAll))),
    switchMap(([searchAction, Membership]) => {
      if (Membership && Membership.length > 0) {
        console.log("Employee Membership Levels list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllMembership(searchAction.membershipSearchResult)
          .pipe(map((MembershipList: any) => {
            if (MembershipList.success === true) {
              return new LoadMembershipCompleted(MembershipList.data);
            } else {
              return new LoadMembershipFailed(MembershipList.apiResponseMessages);
            }
          }),
            catchError(error => {
              return of(new ExceptionHandled(error));
            })
          );
      }
    })
  );

  @Effect()
  showValidationMessagesForMembershipList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadMembershipFailed>(MembershipListActionTypes.LoadMembershipFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForMembershipList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(MembershipListActionTypes.ExceptionHandled),
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
    private employeeService: EmployeeService
  ) { }
}