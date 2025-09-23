import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { RelationshipDetailsService } from '../../services/relationship-details-service';

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { RelationshipDetailsActionTypes, LoadRelationshipDetailsTriggered, LoadRelationshipDetailsCompleted, ExceptionHandled, LoadRelationshipDetailsFailed } from "../actions/relationship-details.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class RelationshipDetailsEffects {

  @Effect()
  loadRelationshipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRelationshipDetailsTriggered>(RelationshipDetailsActionTypes.LoadRelationshipDetailsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getRelationshipDetailsAll))),
    switchMap(([searchAction, relationshipDetails]) => {
      if (relationshipDetails && relationshipDetails.length > 0) {
        console.log("relationship Details list is already in cache.");
        return empty();
      }
      else {
        return this.relationshipDetailsService
          .getRelationshipDetailsList(searchAction.relationshipDetails)
          .pipe(
            map((relationshipDetailsList: any) => {
              if (relationshipDetailsList.success === true) {
                return new LoadRelationshipDetailsCompleted(relationshipDetailsList.data);
              } else {
                return new LoadRelationshipDetailsFailed(relationshipDetailsList.apiResponseMessages);
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
  showValidationMessagesForRelationshipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRelationshipDetailsFailed>(RelationshipDetailsActionTypes.LoadRelationshipDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(RelationshipDetailsActionTypes.ExceptionHandled),
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
    private relationshipDetailsService: RelationshipDetailsService
  ) { }
}