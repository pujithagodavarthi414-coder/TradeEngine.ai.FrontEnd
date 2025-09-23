import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { RecruitmentService } from '../../services/recruitment.service';
import { JobOpeningStatusActionTypes, LoadJobOpeningStatusTriggered, LoadJobOpeningStatusCompleted, ExceptionHandled,
   LoadJobOpeningStatusFailed, CeateJobOpeningStatusTriggered, CreateJobOpeningStatusCompleted, CreateJobOpeningStatusFailed } from '../actions/job-opening-status.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { JobOpeningStatusInputModel } from '../../models/jobOpeningStatusInputModel';

@Injectable()
export class JobOpeningStatusEffects {

  jobOpeingStatusSearch: JobOpeningStatusInputModel;

  @Effect()
  loadJobOpeningStatus$: Observable<Action> = this.actions$.pipe(
    ofType<LoadJobOpeningStatusTriggered>(JobOpeningStatusActionTypes.LoadJobOpeningStatusTriggered),
    switchMap(searchAction => {
      this.jobOpeingStatusSearch = searchAction.jobOpeningStatusSearchResult;
      return this.recruitmentService
        .getJobOpeningStatus(searchAction.jobOpeningStatusSearchResult)
        .pipe(map((jobOpeningStatusList: any) => {
          if (jobOpeningStatusList.success === true) {
            return new LoadJobOpeningStatusCompleted(jobOpeningStatusList.data);
          } else {
            return new LoadJobOpeningStatusFailed(
              jobOpeningStatusList.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForJobOpeningStatus$: Observable<Action> = this.actions$.pipe(
    ofType<LoadJobOpeningStatusFailed>(JobOpeningStatusActionTypes.LoadJobOpeningStatusFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      );
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(JobOpeningStatusActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      );
    })
  );

  @Effect()
  upsertJobOpeningStatus$: Observable<Action> = this.actions$.pipe(
    ofType<CeateJobOpeningStatusTriggered>(JobOpeningStatusActionTypes.CeateJobOpeningStatusTriggered),
    switchMap(searchAction => {
        return this.recruitmentService.upsertJobOpeningStaus(searchAction.jobOpeningStatus)
        .pipe(map((hiringStatus: any) => {
            if (hiringStatus.success === true) {
                if (hiringStatus.data.length > 0) {
                    return new CreateJobOpeningStatusCompleted(hiringStatus.data);
                }
            } else {
                return new CreateJobOpeningStatusFailed(hiringStatus.apiResponseMessages);
            }
        }),
        catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
    upsertJobOpeningStatusSuccessfulAndLoadJobOpeningStatus$: Observable<Action> = this.actions$.pipe(
      ofType<CreateJobOpeningStatusCompleted>(JobOpeningStatusActionTypes.CreateJobOpeningStatusCompleted),
      switchMap(searchAction => {
          return of(new LoadJobOpeningStatusTriggered(this.jobOpeingStatusSearch));
      })
    );

  constructor(
    private actions$: Actions,
    private recruitmentService: RecruitmentService
  ) { }
}
