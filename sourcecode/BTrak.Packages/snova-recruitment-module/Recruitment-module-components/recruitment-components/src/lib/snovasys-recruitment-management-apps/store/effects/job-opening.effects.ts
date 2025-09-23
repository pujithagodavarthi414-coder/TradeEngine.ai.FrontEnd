import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateJobOpeningItemCompleted, CreateJobOpeningItemFailed, CreateJobOpeningItemTriggered, JobOpeningActionTypes,
     JobOpeningExceptionHandled, LoadJobOpeningItemsCompleted, LoadJobOpeningItemsDetailsFailed, LoadJobOpeningItemsFromCandidatesTriggered,
      LoadJobOpeningItemsTriggered, RefreshJobOpeningList } from '../actions/job-opening.action';
import { JobOpening } from '../../models/jobOpening.model';
import { ToastrService } from 'ngx-toastr';
import { ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class JobOpeningEffects {
    jobOpeingSearch: JobOpening;
    toastrMessage: string;
    isNewJobOpening: boolean;
    isJobOpeningArchived: boolean;

    @Effect()
    loadJobOpening$: Observable<Action> =  this.actions$.pipe(
        ofType<LoadJobOpeningItemsTriggered>(JobOpeningActionTypes.LoadJobOpeningItemsTriggered),
        switchMap(searchAction => {
            this.jobOpeingSearch = searchAction.jobOpeningGet;
            return this.recruitmentService.getJobOpenings(searchAction.jobOpeningGet)
            .pipe(map((jobOpening: any) => {
                if ( jobOpening.success === true) {
                    return new LoadJobOpeningItemsCompleted(jobOpening.data);
                } else {
                    return new LoadJobOpeningItemsDetailsFailed(jobOpening.apiResponseMessages);
                }
            }),
            catchError(error => {
                return of(new JobOpeningExceptionHandled(error));
              })
            );
        })
    );

    @Effect()
    loadJobOpeningFromCandidates$: Observable<Action> =  this.actions$.pipe(
        ofType<LoadJobOpeningItemsFromCandidatesTriggered>(JobOpeningActionTypes.LoadJobOpeningItemsFromCandidatesTriggered),
        switchMap(searchAction => {
            return this.recruitmentService.getJobOpenings(this.jobOpeingSearch)
            .pipe(map((jobOpening: any) => {
                if (jobOpening.success === true) {
                    return new LoadJobOpeningItemsCompleted(jobOpening.data);
                } else {
                    return new LoadJobOpeningItemsDetailsFailed(jobOpening.apiResponseMessages);
                }
            }),
            catchError(error => {
                return of(new JobOpeningExceptionHandled(error));
              })
            );
        })
    );

    @Effect()
    upsertJobOpening$: Observable<Action> = this.actions$.pipe(
        ofType<CreateJobOpeningItemTriggered>(JobOpeningActionTypes.CreateJobOpeningItemTriggered),
        switchMap(searchAction => {
            if (searchAction.jobOpeningUpsert.jobOpeningId === null || searchAction.jobOpeningUpsert.jobOpeningId === ''
             || searchAction.jobOpeningUpsert.jobOpeningId === undefined && (searchAction.jobOpeningUpsert.isArchived === null
                 || searchAction.jobOpeningUpsert.isArchived === undefined || searchAction.jobOpeningUpsert.isArchived === false)) {
                this.toastrMessage = this.translateService.instant('CANDIDATES.JOBADDSUCCESS');
            } else if ( searchAction.jobOpeningUpsert.jobOpeningId  && (searchAction.jobOpeningUpsert.isArchived === null
                 || searchAction.jobOpeningUpsert.isArchived === undefined || searchAction.jobOpeningUpsert.isArchived === false)) {
                this.toastrMessage = this.translateService.instant('CANDIDATES.JOBEDITSUCCESS');
            } else if (searchAction.jobOpeningUpsert.isArchived === true) {
                this.toastrMessage = this.translateService.instant('JOBOPENING.ARCHIVEJOBOPENING');
            }
            return this.recruitmentService.upsertJobOpening(searchAction.jobOpeningUpsert)
            .pipe(map((hiringStatus: any) => {
                if (hiringStatus.success === true) {
                    if (hiringStatus.data.length > 0) {
                        this.toastr.success(this.toastrMessage);
                        return new CreateJobOpeningItemCompleted(hiringStatus.data);
                }
                 } else {
                    return new CreateJobOpeningItemFailed(hiringStatus.apiResponseMessages);
                }
            }),
            catchError(error => {
                return of(new JobOpeningExceptionHandled(error));
              })
            );
        })
    );

    @Effect()
    upsertJobOpeningExceptionHandling$: Observable<Action> = this.actions$.pipe(
      ofType<CreateJobOpeningItemFailed>(JobOpeningActionTypes.CreateJobOpeningItemFailed),
      switchMap(searchAction => {
        return of(new ShowExceptionMessages({
        message: searchAction.errorMessage,
        })
        );
      })
    );

    @Effect()
    upsertHiringStatusSuccessfulAndLoadHiringStatus$: Observable<Action> = this.actions$.pipe(
      ofType<CreateJobOpeningItemCompleted>(JobOpeningActionTypes.CreateJobOpeningItemCompleted),
      switchMap(searchAction => {
            return of(new RefreshJobOpeningList(new JobOpening()));
      })
    );


    @Effect()
    upsertJobOpeningOne$: Observable<Action> = this.actions$.pipe(
      ofType<RefreshJobOpeningList>(JobOpeningActionTypes.RefreshJobOpeningList),
      switchMap(searchAction => {
        return this.recruitmentService.getJobOpenings(searchAction.refreshJobOpening)
        .pipe(map((jobOpening: any) => {
            if (jobOpening.success === true) {
                return new LoadJobOpeningItemsCompleted(jobOpening.data);
            } else {
                return new LoadJobOpeningItemsDetailsFailed(jobOpening.apiResponseMessages);
            }
        }),
        catchError(error => {
            return of(new JobOpeningExceptionHandled(error));
          })
        );
      })
    );

    constructor(
        private actions$: Actions,
        private recruitmentService: RecruitmentService,
        private translateService: TranslateService,
        private toastr: ToastrService,
    ) { }
}
