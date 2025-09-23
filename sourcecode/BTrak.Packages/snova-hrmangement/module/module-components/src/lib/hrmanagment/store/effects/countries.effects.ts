import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadCountryListItemsTriggered, CountryListActionTypes, LoadCountryListItemsCompleted, ExceptionHandled, LoadCountryListItemsFailed } from "../actions/countries.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class CountryListEffects {

  @Effect()
  loadCountryList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCountryListItemsTriggered>(CountryListActionTypes.LoadCountryListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getCountryAll))),
    switchMap(([searchAction]) => {
      return this.countryService
        .getAllCountries(searchAction.countryListSearchResult)
        .pipe(
          map((countryList: any) => {
            if (countryList.success === true) {
              return new LoadCountryListItemsCompleted(countryList.data)
            } else {
              return new LoadCountryListItemsFailed(countryList.apiResponseMessages)
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForCountryList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCountryListItemsFailed>(CountryListActionTypes.LoadCountryListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForCountryList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(CountryListActionTypes.ExceptionHandled),
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
    private countryService: EmployeeService
  ) { }
}