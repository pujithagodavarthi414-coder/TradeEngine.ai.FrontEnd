import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";


import { CanteenCreditSearchInputModel } from "../../models/canteen-credit-search-input-model";
import { CanteenBalanceSearchInputModel } from "../../models/canteen-balance-search-model";

import { CanteenManagementService } from "../../services/canteen-management.service";

import { CanteenCreditActionTypes, LoadCanteenCreditsTriggered, LoadCanteenCreditsCompleted, CreateCanteenCreditTriggered, CreateCanteenCreditCompleted, CreateCanteenCreditFailed, ExceptionHandled, LoadCanteenCreditFailed } from "../actions/canteen-credit.actions";
import { LoadCanteenBalanceTriggered } from "../actions/canteen-balance.actions";
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class CanteenCreditEffects {
  canteenCreditsSearchResult: CanteenCreditSearchInputModel;
  toastrMessage: string;
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadCanteenCreditList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCanteenCreditsTriggered>(CanteenCreditActionTypes.LoadCanteenCreditsTriggered),
    switchMap(searchAction => {
      this.canteenCreditsSearchResult = searchAction.canteenCreditSearchResult;
      return this.canteenManagementService
        .searchCanteenCredit(searchAction.canteenCreditSearchResult)
        .pipe(map((canteenCreditList: any) => {
          if(canteenCreditList.success == true)
          return new LoadCanteenCreditsCompleted(canteenCreditList.data);
          else{
          return new LoadCanteenCreditFailed(canteenCreditList.apiResponseMessages);
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
  upsertCanteenCredit$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenCreditTriggered>(CanteenCreditActionTypes.CreateCanteenCreditTriggered),
    switchMap(canteenCreditTriggeredAction => {
      if (canteenCreditTriggeredAction.canteenCredit.canteenCreditId === null || canteenCreditTriggeredAction.canteenCredit.canteenCreditId === '' || canteenCreditTriggeredAction.canteenCredit.canteenCreditId === undefined) {
        this.toastrMessage = canteenCreditTriggeredAction.canteenCredit.amount +" " + this.translateService.instant(ConstantVariables.SuccessMessageForCredited);
      } else {
        this.toastrMessage = canteenCreditTriggeredAction.canteenCredit.amount +" " + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
      }
      return this.canteenManagementService
        .upsertCanteenCredit(canteenCreditTriggeredAction.canteenCredit)
        .pipe(
          map((canteenCreditId: any) => {
            if (canteenCreditId.success === true) {
              return new CreateCanteenCreditCompleted(canteenCreditId);
            } else {
              this.validationMessages = canteenCreditId.apiResponseMessages
              return new CreateCanteenCreditFailed(canteenCreditId.apiResponseMessages);
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
  upsertCanteenCreditSuccessfulAndLoadCanteencredits$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenCreditCompleted>(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
    pipe(
      map(() => {
        return new LoadCanteenCreditsTriggered(this.canteenCreditsSearchResult);
      }),
    )
  );

  @Effect()
  upsertCanteenCreditSuccessfulAndLoadCanteenBalance$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenCreditCompleted>(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
    pipe(
      map(() => {
        let canteenBalance = new CanteenBalanceSearchInputModel();
        canteenBalance.pageSize = 10;
        canteenBalance.pageNumber = 1;
        return new LoadCanteenBalanceTriggered(canteenBalance);
      }),
    )
  );

  @Effect()
  upsertCanteenCreditSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenCreditCompleted>(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: "Success"
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForCanteenCredit$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenCreditFailed>(CanteenCreditActionTypes.CreateCanteenCreditFailed),
    pipe(
      map(() => {
        return new ShowValidationMessages({
          validationMessages: this.validationMessages, // TODO: Change to proper toast message
        })
      })
    )
  );

  @Effect()
    showValidationMessagesForCanteenBalanceDetailsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCanteenCreditFailed>(CanteenCreditActionTypes.LoadCanteenCreditFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForCanteenCredit$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(CanteenCreditActionTypes.ExceptionHandled),
    pipe(
      map(() => new ShowExceptionMessages({
        message: this.exceptionMessage.message, // TODO: Change to proper toast message
      })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private canteenManagementService: CanteenManagementService,
    private translateService: TranslateService
  ) { }
}