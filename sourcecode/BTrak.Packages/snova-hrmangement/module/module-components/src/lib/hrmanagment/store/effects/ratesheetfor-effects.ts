import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { RateSheetForDetailsActionTypes, ExceptionHandled, GetRateSheetForFailed, GetRateSheetForTriggered, GetRateSheetForCompleted } from "../actions/ratesheetfor-actions";
import { RateSheetForModel } from '../../models/ratesheet-for-model';
import { HRManagementService } from '../../services/hr-management.service';

@Injectable()
export class RateSheetForDetailsEffects {
    rateSheetFor: RateSheetForModel;
    rateSheetForList: RateSheetForModel[];
    rateSheetForDetailsSearchResult: RateSheetForModel;
    rateSheetForId: string;
    employeeId: string;
    totalCount: number;
    isNewRateSheetForDetails: boolean;
    toasterMessage: string;

    @Effect()
    loadRateSheetForDetails$: Observable<Action> = this.actions$.pipe(
        ofType<GetRateSheetForTriggered>(RateSheetForDetailsActionTypes.GetRateSheetForTriggered),
        switchMap(searchAction => {
            this.rateSheetForDetailsSearchResult = searchAction.rateSheetForDetailsSearchResult;
            return this.hrManagementService
                .getAllRateSheetForNames(searchAction.rateSheetForDetailsSearchResult)
                .pipe(map((rateSheetForDetailsList: any) => {
                    if (rateSheetForDetailsList.success === true) {
                        if (rateSheetForDetailsList.data.length > 0) {
                            this.totalCount = rateSheetForDetailsList.data[0].totalCount;
                        }
                        return new GetRateSheetForCompleted(rateSheetForDetailsList.data);
                    } else {
                        return new GetRateSheetForFailed(rateSheetForDetailsList.apiResponseMessage);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private hrManagementService: HRManagementService
    ) { }

}
