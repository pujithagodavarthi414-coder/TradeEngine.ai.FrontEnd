import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import {
  GetAllMenuItemsCompleted,
  GetAllMenuItemsTriggered,
  MenuItemActionTypes,
  GetAllMenuItemsFailed,
  ExceptionHandled
} from "../actions/menuitems.actions";
import * as sharedReducers from "../reducers/index";
import { State } from "../reducers/index";
import { MenuItemService } from "../../services/feature.service";
import { ShowValidationMessages, ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class MenuItemsEffects {
  @Effect()
  authenticate$: Observable<Action> = this.actions$.pipe(
    ofType<GetAllMenuItemsTriggered>(
      MenuItemActionTypes.GetAllMenuItemsTriggered
    ),
    switchMap(action => {
       return this.menuItemService.getAllApplicableMenuItems().pipe(
          map((allMenuItemModels: any) => {
            if(allMenuItemModels.success){
              return new GetAllMenuItemsCompleted(allMenuItemModels.data);
            }
           else{
            return new GetAllMenuItemsFailed(allMenuItemModels.apiResponseMessages);
           }
          }),
          catchError(error => of(new ExceptionHandled(error)))
        );
    })
  );

  
  @Effect()
  showValidationMessagesForMenuItems$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetAllMenuItemsFailed>(
      MenuItemActionTypes.GetAllMenuItemsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ExceptionHandled>(
      MenuItemActionTypes.ExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );



  constructor(
    private actions$: Actions,
    private menuItemService: MenuItemService,
    private store$: Store<State>
  ) {}
}
