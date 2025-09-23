import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { CanteenManagementService } from "../../services/canteen-management.service";

import { CanteenBalanceActionTypes, LoadCanteenBalanceTriggered, LoadCanteenBalanceCompleted, ExceptionHandled, LoadCanteenBalanceDetailsFailed } from "../actions/canteen-balance.actions";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class CanteenBalanceEffects {
    exceptionMessage: any;
    @Effect()
    loadCanteenBalanceList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCanteenBalanceTriggered>(CanteenBalanceActionTypes.LoadCanteenBalanceTriggered),
        switchMap(searchAction => {
            return this.canteenManagementService
                .searchCanteenBalance(searchAction.canteenBalanceSearchResult)
                .pipe(map((canteenBalanceList: any) => 
                {
                    if (canteenBalanceList.success === true) {
                      return new LoadCanteenBalanceCompleted(canteenBalanceList.data);
                    } else {
                      return new LoadCanteenBalanceDetailsFailed(canteenBalanceList.apiResponseMessages);
                    }
                  }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(CanteenBalanceActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message, // TODO: Change to proper toast message
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForCanteenBalanceDetailsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCanteenBalanceDetailsFailed>(CanteenBalanceActionTypes.LoadCanteenBalanceDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

    constructor(
        private actions$: Actions,
        private canteenManagementService: CanteenManagementService
    ) { }
}