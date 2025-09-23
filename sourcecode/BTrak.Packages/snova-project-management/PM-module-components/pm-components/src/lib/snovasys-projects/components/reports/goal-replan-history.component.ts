import { Component, Input, ChangeDetectorRef, EventEmitter, Output } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from "rxjs";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { Actions, ofType } from '@ngrx/effects';
import { tap } from "rxjs/operators";
import { LoadGoalReplanHistoryItemsTriggered, GoalReplanHistoryActionTypes } from "../../store/actions/goal-replan-history.action";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-pm-component-goal-replan-history",
    templateUrl: "goal-replan-history.component.html"
})

export class GoalReplanHistoryComponent {
    @Output() closePopUp = new EventEmitter<any>();
    Offset: string;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.projectId = this.dashboardFilters.projectId;
            this.goalId = this.dashboardFilters.goalId;
            this.getGoalHistory();
        }
    }

    fromCustomApp: boolean = false;
    Ids: string;

    @Input("Ids")
    set _Ids(Ids) {
        this.fromCustomApp = true;
        this.Ids = Ids;
        this.getGoalHistory();
    }

    dashboardFilters: DashboardFilterModel;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    isAnyOperationIsInprogress$: Observable<boolean>
    goal: any;
    isOpen: boolean = false;
    goalId: string = null;
    projectId: string = null;
    data: any;
    validationMessage: string;
    goalReplanValue: any = null;
    description: any;
    isReplan: any = 0;
    isNextDisable: boolean = true;
    isPreviousDisable: boolean = false;
    OriginalGoalReplanValue: any;
    message: boolean = false;
    activityHistory$: Observable<any[]>;
    initialData: any = 0;
    loading: boolean = false;
    goalLabel: string;
    workItemLabel: string;
    projectLabel: string;

    public ngDestroyed$ = new Subject();


    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>, private actionUpdates$: Actions, private router: Router) {
        this.actionUpdates$
            .pipe(
                ofType(GoalReplanHistoryActionTypes.LoadGoalReplanHistoryItemsCompleted),
                tap(() => {
                    this.activityHistory$ = this.store.pipe(select(projectModuleReducer.getGoalReplanHistoryAll));
                    this.activityHistory$.subscribe(result => {
                        this.data = result[0];
                        if (this.data.maxReplanCount) {
                            this.initialData = this.data.maxReplanCount;
                        }
                        this.cdRef.detectChanges();
                        this.description = this.data.userStoriesDescrptions;
                        if (this.data.goalReplanCount) {
                            this.message = false;
                        } else {
                            this.message = true;
                        }
                        if (this.isReplan == 0) {
                            this.OriginalGoalReplanValue = this.data.maxReplanCount;
                            this.goalReplanValue = this.data.maxReplanCount;
                            this.check();
                        }
                        this.loading = false;
                        this.cdRef.detectChanges();
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
        this.Offset=String (-(new Date().getTimezoneOffset()));
    }

    getGoalHistory() {
        if (this.fromCustomApp) {
            this.goalId = this.Ids;
        }
        if (this.goalId == null) {
            return;
        }
        this.loading = true;
        localStorage.setItem('goalId', this.goalId);
        localStorage.setItem('goalReplanValue', this.goalReplanValue);
        this.store.dispatch(new LoadGoalReplanHistoryItemsTriggered(this.goalId, this.goalReplanValue));
        this.isAnyOperationIsInprogress$ = this.store.pipe(select(projectModuleReducer.getGoalReplanHistoryLoading))
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        if (this.softLabels.length > 0) {
            this.projectLabel = this.softLabels[0].projectLabel;
            this.goalLabel = this.softLabels[0].goalLabel;
            this.workItemLabel = this.softLabels[0].userStoryLabel;
            this.cdRef.markForCheck();
        }
    }

    previousReplan() {
        if (this.goalReplanValue == this.OriginalGoalReplanValue) {
            this.isNextDisable = false;
        }
        this.isReplan = this.isReplan + 1;
        this.goalReplanValue = this.goalReplanValue - 1;
        this.getGoalHistory();
        if (this.goalReplanValue == 1) {
            this.isPreviousDisable = true;
        } else {
            this.isPreviousDisable = false;
        }
    }

    nextReplan() {
        if (this.goalReplanValue == 1) {
            this.isPreviousDisable = false;
        }
        this.goalReplanValue = this.goalReplanValue + 1;
        this.isReplan = this.isReplan + 1;
        this.getGoalHistory();
        if (this.goalReplanValue == this.OriginalGoalReplanValue) {
            this.isNextDisable = true;
        } else {
            this.isNextDisable = false;
        }
    }

    check() {
        if (this.goalReplanValue == 1) {
            this.isNextDisable = true;
            this.isPreviousDisable = true;
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
        localStorage.removeItem('goalId');
        localStorage.removeItem('goalReplanValue');
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.router.navigateByUrl('/projects');
    }

    fitContent(optionalParameters: any){
        var interval;
        var count = 0;
        if(optionalParameters['individualPageView']){
          interval = setInterval(() => {
            try{
              if(count > 30){
                clearInterval(interval);
              }
              count++;
              if($(optionalParameters['individualPageSelector'] + ' .goal-replan').length > 0) {
               
                $(optionalParameters['individualPageSelector'] + ' .goal-replan').addClass("goal-replan-history");
                clearInterval(interval);
              }
            }catch(err){
              clearInterval(interval);
            }
          }, 1000);
        }

        if(optionalParameters['gridsterView']){
            interval = setInterval(() => {
              try{
                if(count > 30){
                  clearInterval(interval);
                }
                count++;
                if($(optionalParameters['gridsterViewSelector'] + ' .goal-replan').length > 0) {
                    var appHeight = $(optionalParameters['gridsterViewSelector']).height();

                    var appContentHeight = appHeight - 70;
                    $(optionalParameters['gridsterViewSelector'] + ' #widget-scroll-id').height(appContentHeight); 

                    var historyHeight =  appContentHeight - 250;    
                    historyHeight = (historyHeight <= 100)? 100 : historyHeight;                                                                   
                    $(optionalParameters['gridsterViewSelector'] + ' .goal-replan').height(historyHeight);
                    clearInterval(interval);
                }
              }catch(err){
                clearInterval(interval);
              }
            }, 1000);
          }

    }
    
}