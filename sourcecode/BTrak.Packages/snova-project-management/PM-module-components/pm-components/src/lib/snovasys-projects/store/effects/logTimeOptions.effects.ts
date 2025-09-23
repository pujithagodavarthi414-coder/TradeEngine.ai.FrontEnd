import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { LogTimeService } from "../../services/logTimeService";
import {
  LogTimeOptionsActions,
  LogTimeOptionsTriggered,
  LogTimeOptionsCompleted,
  userStoryLogTimeActionTypes
} from "../actions/logTimeOptions.action";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../reducers/index";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
@Injectable()
export class LogTimeEffects {
  @Effect()
  loadBoardTypes$: Observable<Action> = this.actions$.pipe(
    ofType<LogTimeOptionsTriggered>(
      userStoryLogTimeActionTypes.LogTimeOptionsTriggered
    ),
    withLatestFrom(this.store$.pipe(select(projectModuleReducers.getlogTimeOptionsAll))),
    switchMap(([_,logTimeOptions]) => { 
      return this.logTimeService.GetAllLogTimeOptions().pipe(
        map((logTimeOptions: any) => {
          var logTimeOptionsList = this.getToolTipsForLogTimeOptions(logTimeOptions.data);
          // TODO: PLEASE GET RID OF ANY
          return new LogTimeOptionsCompleted(logTimeOptionsList);
        })
      );
      
    })
  );
  constructor(
    private actions$: Actions,
    private logTimeService: LogTimeService,
    private store$: Store<State>,
    private translateService: TranslateService
  ) {}

  getToolTipsForLogTimeOptions(logTimeOptions){
    logTimeOptions.forEach(option=>{
      if(option.logTimeOptionId === ConstantVariables.logTimeOptionForSetTo){
           option.logTimeOptionToolTip = 'USERDETAIL.LOGTIMEOPTIONTOOLTIPFORSETTO';
      }
      else if(option.logTimeOptionId === ConstantVariables.logTimeOptionForReducedBy){
        option.logTimeOptionToolTip = 'USERDETAIL.LOGTIMEOPTIONTOOLTIPFORREDUCEBY';
      }
      else if(option.logTimeOptionId === ConstantVariables.logTimeOptionForExistingHours){
        option.logTimeOptionToolTip = 'USERDETAIL.LOGTIMEOPTIONTOOLTIPFORESTIMATEHOURS';
      }
      else{
        option.logTimeOptionToolTip = 'USERDETAIL.LOGTIMEOPTIONTOOLTIPFORADJUSTAUTOMATICALLY';
      }
    })
    return logTimeOptions;
  }
}
