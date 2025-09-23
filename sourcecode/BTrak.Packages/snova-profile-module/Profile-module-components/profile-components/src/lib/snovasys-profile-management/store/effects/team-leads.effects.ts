import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { TeamLeadsActions, TeamLeadsActionTypes, LoadTeamLeadsTriggered, LoadTeamLeadsCompleted, LoadTeamLeadsFailed, ExceptionHandled } from "../actions/teamleads.action";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { TeamLeadsService } from "../../services/teamleads.service";
import { State } from "../reducers/index";
import * as dashboardReducers from "../reducers/index";
import { ShowExceptionMessages } from "../actions/notification-validator.action";

@Injectable()
export class TeamLeadEffects {
  validationMessages: any[];
  exceptionMessage: any;

  constructor(
    private actions$: Actions,
    private teamLeadService: TeamLeadsService,
    private store$: Store<State>
  ) { }

  @Effect()
  loadTeamLeads$: Observable<Action> = this.actions$.pipe(
    ofType<LoadTeamLeadsTriggered>(TeamLeadsActionTypes.LoadTeamLeadsTriggered),
    withLatestFrom(this.store$.pipe(select(dashboardReducers.getTeamLeadsListAll))),
    switchMap(([_, teamLeads]) => {
      return this.teamLeadService
        .getTeamLeadsList()
        .pipe(
          map((teamleads: any) => {
            if (teamleads.success) {
              return new LoadTeamLeadsCompleted(teamleads.data)
            }
            else {
              this.validationMessages = teamleads.apiResponseMessages;
              return new LoadTeamLeadsFailed(teamleads.apiResponseMessages)
            }
          }),
          catchError(err => {

            this.exceptionMessage = err;
            return of(new ExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForLoadingTeamLeads$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadTeamLeadsFailed>(
      TeamLeadsActionTypes.LoadTeamLeadsFailed
    ),
    pipe(
      map(
        () => {
          for (var i = 0; i < this.validationMessages.length; i++) {
            return new ShowExceptionMessages({
              message: this.validationMessages[i].message, // TODO: Change to proper toast message
            })
          }
        }

      )
    )
  );


  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ExceptionHandled>(
      TeamLeadsActionTypes.ExceptionHandled
    ),
    pipe(
      map(
        () =>
          new ShowExceptionMessages({
            message: this.exceptionMessage.message, // TODO: Change to proper toast message
          })
      )
    )
  );
}
