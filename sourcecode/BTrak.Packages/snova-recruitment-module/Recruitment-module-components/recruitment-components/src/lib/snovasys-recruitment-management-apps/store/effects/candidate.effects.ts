import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { TranslateService } from '@ngx-translate/core';
import {
    CandidateActionTypes, CandidateExceptionHandled, CreateCandidateItemCompleted,
    CreateCandidateItemFailed, CreateCandidateItemTriggered, LoadCandidateItemsCompleted,
    LoadCandidateItemsDetailsFailed, LoadCandidateItemsTriggered, RefreshCandidatesList
} from '../actions/candidate.action';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CandidateEffects {

    candidatesSearch: any;
    toastrMessage: string;

    @Effect()
    loadCandidates$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCandidateItemsTriggered>(CandidateActionTypes.LoadCandidateItemsTriggered),
        switchMap(searchAction => {
            this.candidatesSearch = searchAction.candidateSearch;
            return this.recruitmentService.getCandisates(searchAction.candidateSearch)
                .pipe(map((candidates: any) => {
                    if (candidates.success) {
                        return new LoadCandidateItemsCompleted(candidates.data);
                    } else {
                        return new LoadCandidateItemsDetailsFailed(candidates.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new CandidateExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertCandidates$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCandidateItemTriggered>(CandidateActionTypes.CreateCandidateItemTriggered),
        switchMap(searchAction => {
            if (searchAction.candidateUpsert.candidateId === null
                || searchAction.candidateUpsert.candidateId === '' || searchAction.candidateUpsert.candidateId === undefined) {
                this.toastrMessage = this.translateService.instant('CANDIDATES.CANDIDATEADDEDSUCCESS');
            } else if (searchAction.candidateUpsert.candidateId) {
                this.toastrMessage = this.translateService.instant('CANDIDATES.CANDIDATEEDITSUCCESS');
            }
            return this.recruitmentService.upsertCandidate(searchAction.candidateUpsert)
                .pipe(map((candidates: any) => {
                    if (candidates.success) {
                        this.toastr.success(this.toastrMessage);
                        return new CreateCandidateItemCompleted(candidates.data);
                    } else {
                        this.toastr.error(candidates.apiResponseMessages[0].message);
                        return new CreateCandidateItemFailed(candidates.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new CandidateExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertHiringStatusSuccessfulAndLoadHiringStatus$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCandidateItemCompleted>(CandidateActionTypes.CreateCandidateItemCompleted),
        switchMap(searchAction => {
            return of(new RefreshCandidatesList(this.candidatesSearch));
        })
    );

    @Effect()
    upsertJobOpeningOne$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshCandidatesList>(CandidateActionTypes.RefreshCandidatesList),
        switchMap(searchAction => {
            this.candidatesSearch = searchAction.refreshCandidates;
            return this.recruitmentService.getCandisates(this.candidatesSearch)
                .pipe(map((candidates: any) => {
                    if (candidates.success) {
                        return new LoadCandidateItemsCompleted(candidates.data);
                    } else {
                        return new LoadCandidateItemsDetailsFailed(candidates.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new CandidateExceptionHandled(error));
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
