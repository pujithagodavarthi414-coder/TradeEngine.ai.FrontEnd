import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
    CreateHiringStatusItemCompleted, CreateHiringStatusItemFailed, CreateHiringStatusItemTriggered, HiringStatusActionTypes,
    HiringStatusExceptionHandled, LoadHiringStatusItemsCompleted, LoadHiringStatusItemsDetailsFailed, LoadHiringStatusItemsTriggered
} from '../actions/hiring-status.action';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { TranslateService } from '@ngx-translate/core';
import { HiringStatusUpsertModel } from '../../models/hiringStatusUpsertModel';
import { ToastrService } from 'ngx-toastr';
import { ShowValidationMessages } from '../actions/notification-validator.action';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class HiringStatusEffects {
    hiringStatusSearchResult: HiringStatusUpsertModel;
    @Effect()
    loadHiringStatus$: Observable<Action> = this.actions$.pipe(
        ofType<LoadHiringStatusItemsTriggered>(HiringStatusActionTypes.LoadHiringStatusItemsTriggered),
        switchMap(searchAction => {
            this.hiringStatusSearchResult = searchAction.hiringStatusSearch;
            return this.recruitmentService.getHiringStatus(searchAction.hiringStatusSearch)
                .pipe(map((hiringStatus: any) => {
                    if (hiringStatus.success === true) {
                        return new LoadHiringStatusItemsCompleted(hiringStatus.data);
                    } else {
                        return new LoadHiringStatusItemsDetailsFailed(hiringStatus.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new HiringStatusExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertHiringStatus$: Observable<Action> = this.actions$.pipe(
        ofType<CreateHiringStatusItemTriggered>(HiringStatusActionTypes.CreateHiringStatusItemTriggered),
        switchMap(searchAction => {
            if (searchAction.hiringStatusUpsertModel.hiringStatusId === null
                || searchAction.hiringStatusUpsertModel.hiringStatusId === ''
                || searchAction.hiringStatusUpsertModel.hiringStatusId === undefined) {
                this.toastrMessage = this.translateService.instant(ConstantVariables.Hiringstatusaddedsuccessfully);
            } else if (searchAction.hiringStatusUpsertModel.hiringStatusId) {
                this.toastrMessage = this.translateService.instant(ConstantVariables.Hiringstatusupdatedsuccessfully);
            }
            return this.recruitmentService.upsertHiringStatus(searchAction.hiringStatusUpsertModel)
                .pipe(map((hiringStatus: any) => {
                    if (hiringStatus.success === true) {
                        if (hiringStatus.data.length > 0) {
                            return new CreateHiringStatusItemCompleted(hiringStatus.data);
                        }
                    } else {
                        return new CreateHiringStatusItemFailed(hiringStatus.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        return of(new HiringStatusExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertHiringStatusSuccessfulAndLoadHiringStatus$: Observable<Action> = this.actions$.pipe(
        ofType<CreateHiringStatusItemCompleted>(HiringStatusActionTypes.CreateHiringStatusItemCompleted),
        switchMap(searchAction => {
            this.toastr.success(this.toastrMessage);
            return of(new LoadHiringStatusItemsTriggered(this.hiringStatusSearchResult));
        })
    );

    @Effect()
    upsertHiringStatusExceptionHandledForupsertHiringStatus$: Observable<Action> = this.actions$.pipe(
        ofType<CreateHiringStatusItemFailed>(HiringStatusActionTypes.CreateHiringStatusItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            );
        })
    );

    toastrMessage: string;

    constructor(
        private actions$: Actions,
        private recruitmentService: RecruitmentService,
        private translateService: TranslateService,
        private toastr: ToastrService,
    ) { }
}
