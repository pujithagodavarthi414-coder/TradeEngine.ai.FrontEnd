import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ReportToSearchModel } from "../../models/report-to-search-model";

import { ReportToService } from "../../services/report-to-service";

import { ReportToActionTypes, LoadReportToTriggered, LoadReportToCompleted, CreateReportToTriggered, CreateReportToCompleted, DeleteReportToCompleted, CreateReportToFailed, GetReportToByIdTriggered, GetReportToByIdCompleted, CreateReportToCompletedWithInPlaceUpdate, RefreshReports, ExceptionHandled, LoadReportToFailed } from "../actions/report-to.actions";
import { ReportToDetailsModel } from '../../models/report-to-details-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
@Injectable()
export class ReportToEffects {
  reportToSearchResult: ReportToSearchModel;
  employeeId: string;
  isNewReportTo: boolean;
  toastrMessage: string;
  totalCount: number;
  reportId: string;
  reportToDetailsData: ReportToDetailsModel;

  @Effect()
  loadReports$: Observable<Action> = this.actions$.pipe(
    ofType<LoadReportToTriggered>(ReportToActionTypes.LoadReportToTriggered),
    switchMap(searchAction => {
      this.reportToSearchResult = searchAction.reportToSearchResult;
      return this.reportToService
        .getAllReports(searchAction.reportToSearchResult)
        .pipe(map((reportToList: any) => {
          if (reportToList.success === true) {
            if (reportToList.data.employeeReportToDetails.length > 0)
              this.totalCount = reportToList.data.employeeReportToDetails[0].totalCount;
            return new LoadReportToCompleted(reportToList.data.employeeReportToDetails);
          } else {
            return new LoadReportToFailed(reportToList.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertReportToDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateReportToTriggered>(ReportToActionTypes.CreateReportToTriggered),
    switchMap(reportToTriggeredAction => {
      if (reportToTriggeredAction.reportTodetails.employeeReportToId === null || reportToTriggeredAction.reportTodetails.employeeReportToId === '' || reportToTriggeredAction.reportTodetails.employeeReportToId === undefined) {
        this.isNewReportTo = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportCreated)
      } else if (
        reportToTriggeredAction.reportTodetails.employeeReportToId !== undefined &&
        reportToTriggeredAction.reportTodetails.isArchived === true
      ) {
        this.isNewReportTo = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportDeleted)
      } else {
        this.isNewReportTo = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForReportUpdated)
      }
      this.employeeId = reportToTriggeredAction.reportTodetails.employeeId;
      return this.reportToService
        .upsertReportTo(reportToTriggeredAction.reportTodetails)
        .pipe(map((reportToDetailId: any) => {
          if (reportToDetailId.success === true) {
            reportToTriggeredAction.reportTodetails.employeeReportToId = reportToDetailId.data;
            this.reportId = reportToDetailId.data;
            if (reportToTriggeredAction.reportTodetails.isArchived) {
              return new DeleteReportToCompleted(this.reportId)
            }
            else {
              return new CreateReportToCompleted(reportToDetailId.data);
            }
          }
          else {
            return new CreateReportToFailed(reportToDetailId.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertReportToDetailsSuccessfulAndLoadreports$: Observable<Action> = this.actions$.pipe(
    ofType<CreateReportToCompleted>(ReportToActionTypes.CreateReportToCompleted),
    switchMap(searchAction => {
      if (this.isNewReportTo) {
        return of(new LoadReportToTriggered(this.reportToSearchResult));
      }
      else
        return of(new GetReportToByIdTriggered(this.reportId));
    })
  );

  @Effect()
  upsertReportToDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateReportToCompleted>(ReportToActionTypes.CreateReportToCompleted),
    pipe(map(() =>
      new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
    )
    )
  );

  @Effect()
  getReportToDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetReportToByIdTriggered>(ReportToActionTypes.GetReportToByIdTriggered),
    switchMap(searchAction => {
      let reportToSearchResult = new ReportToSearchModel();
      reportToSearchResult.employeeId = this.employeeId;
      reportToSearchResult.employeeReportToId = searchAction.reportToDetailId;
      return this.reportToService
        .getReportToById(reportToSearchResult)
        .pipe(map((reportToDetails: any) => {
          this.employeeId = '';
          if (reportToDetails.success === true) {
            reportToDetails.data.totalCount = this.totalCount;
            this.reportToDetailsData = reportToDetails.data;
            return new GetReportToByIdCompleted(reportToDetails.data);
          } else {
            return new CreateReportToFailed(
              reportToDetails.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            this.employeeId = '';
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  deleteReportToDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteReportToCompleted>(ReportToActionTypes.DeleteReportToCompleted),
    pipe(map(() =>
      new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
    )
    )
  );

  @Effect()
  deleteReportToDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteReportToCompleted>(ReportToActionTypes.DeleteReportToCompleted),
    pipe(
      map(() => {
        return new LoadReportToTriggered(this.reportToSearchResult);
      })
    )
  );

  @Effect()
  upsertReportToDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetReportToByIdCompleted>(ReportToActionTypes.GetReportToByIdCompleted),
    switchMap(searchaction => {
      return of(new CreateReportToCompletedWithInPlaceUpdate({
        reportToUpdate: {
          id:  this.reportToDetailsData.employeeReportToId,
          changes:  this.reportToDetailsData
        }
      }));
    })
  );

  @Effect()
  showValidationMessagesForReportToDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateReportToFailed>(ReportToActionTypes.CreateReportToFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForReportToList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadReportToFailed>(ReportToActionTypes.LoadReportToFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(ReportToActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private reportToService: ReportToService,
    private translateService: TranslateService
  ) { }
}