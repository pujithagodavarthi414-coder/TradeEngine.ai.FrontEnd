import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import {
    MileStoneActionTypes,
    LoadMileStoneTriggered,
    LoadMileStoneCompleted,
    LoadMileStoneListTriggered,
    LoadMileStoneListCompleted,
    LoadTestRunsByMileStoneTriggered,
    LoadTestRunsByMileStoneCompleted,
    MileStoneFailed,
    MileStoneException,
    LoadMileStoneByIdTriggered,
    LoadMileStoneByIdCompleted,
    RefreshMileStonesList,
    MileStoneEditCompletedWithInPlaceUpdate,
    LoadMileStoneDeleteTriggered,
    LoadMileStoneDeleteCompleted
} from '../actions/milestones.actions';
import { TestRailService } from '../../services/testrail.service';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';
import { State } from '../../../../store/reducers/index';
import { MileStoneWithCount } from '../../models/milestone';
import { LoadProjectRelatedCountsTriggered } from '../actions/testrailprojects.actions';

import { CookieService } from "ngx-cookie-service";
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';

@Injectable()
export class MileStoneEffects {
    searchMileStone: MileStoneWithCount;
    mileStoneId: string;
    projectId: string;
    newMileStone: boolean;
    currentLang: boolean = false;
    snackBarMessage: string;
    validationMessages: any[];
    exceptionMessage: any;
    softLabels: SoftLabelConfigurationModel[];
    latestMileStoneData: MileStoneWithCount;

    constructor(private actions$: Actions, private store: Store<State>, private testRailService: TestRailService, private translateService: TranslateService, private softLabePipe: SoftLabelPipe, private cookieService: CookieService) {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));

        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
            this.currentLang = false;
        }
        else {
            this.currentLang = true;
        }
    }

    @Effect()
    loadMileStone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneTriggered>(MileStoneActionTypes.LoadMileStoneTriggered),
        switchMap(getAction => {
            return this.testRailService.UpsertMileStone(getAction.mileStone).pipe(
                map((mileStoneId: any) => {
                    if (mileStoneId.success == true) {
                        this.mileStoneId = mileStoneId.data;
                        this.projectId = getAction.mileStone.projectId;
                        if (getAction.mileStone.milestoneId) {
                            this.newMileStone = false;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForMilestoneEdited);
                            let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                            if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                                this.snackBarMessage = "Version edited successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "버전이 성공적으로 수정되었습니다.";
                            else
                                this.snackBarMessage = "సంస్కరణ సవరించబడింది";
                        }
                        else {
                            this.newMileStone = true;
                            // this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForMilestoneAdded);
                            let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                            if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                                this.snackBarMessage = "Version created successfully";
                            else if (currentCulture == 'ko')
                                this.snackBarMessage = "버전이 성공적으로 생성되었습니다.";
                            else
                                this.snackBarMessage = "సంస్కరణ సృష్టించబడింది";
                        }
                        return new LoadMileStoneCompleted(mileStoneId.data);
                    }
                    else {
                        this.validationMessages = mileStoneId.apiResponseMessages
                        return new MileStoneFailed(mileStoneId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new MileStoneException(err));
                })
            );
        })
    );

    @Effect()
    loadMileStoneCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneCompleted>(MileStoneActionTypes.LoadMileStoneCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    mileStoneDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneDeleteTriggered>(MileStoneActionTypes.LoadMileStoneDeleteTriggered),
        switchMap(getAction => {
            return this.testRailService.DeleteMileStone(getAction.mileStoneDelete).pipe(
                map((mileStoneDeleteId: any) => {
                    if (mileStoneDeleteId.success == true) {
                        this.projectId = getAction.mileStoneDelete.projectId;
                        this.newMileStone = false;
                        // this.snackBarMessage = this.softLabePipe.transform(this.translateService.instant(ConstantVariables.SuccessMessageForMilestoneDeleted), this.softLabels);
                        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined')
                            this.snackBarMessage = "Version deleted successfully";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage = "버전이 성공적으로 삭제되었습니다.";
                        else
                            this.snackBarMessage = "సంస్కరణ తొలగించబడింది";
                        return new LoadMileStoneDeleteCompleted(mileStoneDeleteId.data);
                    }
                    else {
                        this.validationMessages = mileStoneDeleteId.apiResponseMessages
                        return new MileStoneFailed(mileStoneDeleteId.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new MileStoneException(err));
                })
            );
        })
    );

    @Effect()
    loadMileStoneDeleteSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneDeleteCompleted>(MileStoneActionTypes.LoadMileStoneDeleteCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    loadMileStoneDeleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneDeleteCompleted>(MileStoneActionTypes.LoadMileStoneDeleteCompleted),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadMileStoneCompletedSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneCompleted>(MileStoneActionTypes.LoadMileStoneCompleted),
        pipe(
            map(
                () => {
                    this.searchMileStone = new MileStoneWithCount();
                    this.searchMileStone.projectId = this.projectId;
                    this.searchMileStone.milestoneId = this.mileStoneId;
                    this.searchMileStone.isArchived = false;
                    return new LoadMileStoneByIdTriggered(this.searchMileStone);
                }
            )
        )
    );

    @Effect()
    loadMileStoneById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneByIdTriggered>(MileStoneActionTypes.LoadMileStoneByIdTriggered),
        switchMap(getAction => {
            return this.testRailService.GetMileStones(getAction.searchMileStones).pipe(
                map((searchMileStones: any) => {
                    if (searchMileStones.success == true) {
                        this.latestMileStoneData = searchMileStones.data;
                        return new LoadMileStoneByIdCompleted(searchMileStones.data);
                    }
                    else {
                        this.validationMessages = searchMileStones.apiResponseMessages
                        return new MileStoneFailed(searchMileStones.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new MileStoneException(err));
                })
            );
        })
    );

    @Effect()
    loadMileStoneByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneByIdCompleted>(MileStoneActionTypes.LoadMileStoneByIdCompleted),
        pipe(
            map(() => {
                let lang = false;
                let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
                if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
                    lang = false;
                }
                else {
                    lang = true;
                }
                if (this.newMileStone) {
                    // this.snackBarMessage = this.softLabePipe.transform(this.translateService.instant(ConstantVariables.SuccessMessageForMilestoneCreated), this.softLabels);
                    if (!lang)
                        this.snackBarMessage = "Version created successfully";
                    else if (currentCulture == 'ko')
                        this.snackBarMessage = "버전이 성공적으로 생성되었습니다.";
                    else
                        this.snackBarMessage = "సంస్కరణ సృష్టించబడింది";
                    return new RefreshMileStonesList(this.latestMileStoneData[0]);
                }
                else {
                    // this.snackBarMessage = this.softLabePipe.transform(this.translateService.instant(ConstantVariables.SuccessMessageForMilestoneEdited), this.softLabels);
                    if (!lang)
                        this.snackBarMessage = "Version edited successfully";
                        else if (currentCulture == 'ko')
                            this.snackBarMessage = "버전이 성공적으로 수정되었습니다.";
                    else
                        this.snackBarMessage = "సంస్కరణ సవరించబడింది";
                    return new MileStoneEditCompletedWithInPlaceUpdate({
                        mileStoneUpdate: {
                            id: this.latestMileStoneData[0].milestoneId,
                            changes: this.latestMileStoneData[0]
                        }
                    });
                }
            })
        )
    );

    @Effect()
    loadMileStoneByIdCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshMileStonesList>(MileStoneActionTypes.RefreshMileStonesList),
        pipe(
            map(
                () => {
                    return new LoadProjectRelatedCountsTriggered(this.projectId);
                }
            )
        )
    );

    @Effect()
    loadMileStoneList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMileStoneListTriggered>(MileStoneActionTypes.LoadMileStoneListTriggered),
        switchMap(getAction => {
            return this.testRailService.GetMileStones(getAction.getMileStones).pipe(
                map((mileStones: any) => {
                    if (mileStones.success == true)
                        return new LoadMileStoneListCompleted(mileStones.data)
                    else {
                        this.validationMessages = mileStones.apiResponseMessages
                        return new MileStoneFailed(mileStones.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new MileStoneException(err));
                })
            );
        })
    );

    @Effect()
    loadTestRunByMilestone$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTestRunsByMileStoneTriggered>(MileStoneActionTypes.LoadTestRunsByMileStoneTriggered),
        switchMap(getAction => {
            return this.testRailService.GetTestRunsByMilestone(getAction.mileStone).pipe(
                map((mileStone: any) => {
                    if (mileStone.success == true)
                        return new LoadTestRunsByMileStoneCompleted(mileStone.data);
                    else {
                        this.validationMessages = mileStone.apiResponseMessages
                        return new MileStoneFailed(mileStone.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new MileStoneException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForMilestone$: Observable<Action> = this.actions$.pipe(
        ofType<MileStoneFailed>(MileStoneActionTypes.MileStoneFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<MileStoneException>(MileStoneActionTypes.MileStoneException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );
}
