// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { catchError, map, switchMap } from "rxjs/operators";
import { ConfigurationSearchCriteriaInputModel } from "../../models/configurationType";
import { ConfigurationTypeService } from "../../services/configurationType.service";
import {
  ConfigurationTypesActionTypes,
  // tslint:disable-next-line: ordered-imports
  LoadConfigurationTypesExceptionHandled,
  LoadConfigurationTypesCompleted,
  LoadConfigurationTypesTriggered
} from "../actions/configuration-types.action";
import { ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class ConfigurationTypesEffects {
  @Effect()
  loadConfigurationTypess$: Observable<Action> = this.actions$.pipe(
    ofType<LoadConfigurationTypesTriggered>(
      ConfigurationTypesActionTypes.LoadConfigurationTypesTriggered
    ),
    switchMap(() => {
      return this.ConfigurationTypesService.GetAllConfigurationTypes(
        new ConfigurationSearchCriteriaInputModel()
      ).pipe(
        map((user: any) => new LoadConfigurationTypesCompleted(user.data)),
        catchError((err) => {
            return of(new LoadConfigurationTypesExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadConfigurationTypesExceptionHandled>(
      ConfigurationTypesActionTypes.LoadConfigurationTypesExceptionHandled
    ),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private ConfigurationTypesService: ConfigurationTypeService
  ) {}
}
