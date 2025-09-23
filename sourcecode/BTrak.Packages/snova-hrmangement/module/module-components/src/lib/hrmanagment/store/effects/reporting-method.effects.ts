import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { ReportingMethodDetailsModel } from '../../models/repoting-method-details-model';
import { ReportingMethodSearchModel } from '../../models/repoting-method-search-model';

import { ReportingMethodDetailsService } from '../../services/reporting-method.service';

import { ReportingMethodDetailsActionTypes, LoadReportingMethodDetailsTriggered, LoadReportingMethodDetailsCompleted, LoadReportingMethodDetailsFailed, ExceptionHandled } from "../actions/reporting-method.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class ReportingMethodEffects {
  reportingMethodDetailsList: ReportingMethodDetailsModel[];
  reportingMethodDetails: ReportingMethodDetailsModel;
  ReportingMethodSearchResult: ReportingMethodSearchModel;
  ReportingMethodId: string;
  validationMessages: any[];
  toastrMessage: string;
  exceptionMessage: any;

  @Effect()
  loadReportingMethodDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadReportingMethodDetailsTriggered>(ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsTriggered),
    switchMap(searchAction => {
      this.ReportingMethodSearchResult = searchAction.reportingMethodSearchResult;
      return this.reportingMethodDetailsService
        .getReportingMethodDetailsList(searchAction.reportingMethodSearchResult)
        .pipe(map((reportingMethodDetailsList: any) => new LoadReportingMethodDetailsCompleted(reportingMethodDetailsList.data)),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForReportingMethodDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadReportingMethodDetailsFailed>(ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsFailed),
    pipe(
      map(() => {
        return new ShowValidationMessages({
          validationMessages: this.validationMessages, // TODO: Change to proper toast message
        })
      })
    )
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(ReportingMethodDetailsActionTypes.ExceptionHandled),
    pipe(
      map(() => new ShowExceptionMessages({
        message: this.exceptionMessage.message, // TODO: Change to proper toast message
      })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private reportingMethodDetailsService: ReportingMethodDetailsService
  ) { }
}