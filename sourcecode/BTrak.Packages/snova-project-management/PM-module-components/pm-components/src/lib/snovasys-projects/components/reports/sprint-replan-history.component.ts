import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from "rxjs";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { Actions, ofType } from '@ngrx/effects';
import { tap } from "rxjs/operators";
import { SprintModel } from "../../models/sprints-model";
import { LoadSprintReplanHistoryItemsTriggered, SprintReplanHistoryActionTypes } from "../../store/actions/sprint-replan-history.action";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-pm-component-sprint-replan-history",
    templateUrl: "sprint-replan-history.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class SprintReplanHistoryComponent {
    @Output() closePopUp = new EventEmitter<any>();
    Offset: string;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.sprintId = this.dashboardFilters.sprintId;
            this.projectId = this.dashboardFilters.projectId;
            this.getSprintHistory();
        }
    }
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    companySettingsModel$: Observable<any[]>;
    activityHistory$: Observable<any[]>;
    isAnyOperationIsInprogress$: Observable<boolean>
    dashboardFilters: DashboardFilterModel;
    sprint: SprintModel;
    sprintId: string;
    projectId: string;
    isOpen: boolean = false;
    companySettingsIsInProgress: boolean;
    data: any;
    validationMessage: string;
    goalReplanValue: any = null;
    description: any;
    isReplan: any = 0;
    isNextDisable: boolean = true;
    isPreviousDisable: boolean = false;
    OriginalGoalReplanValue: any;
    message: boolean = false;
    initialData: any = 0;
    loading: boolean = false;
    isSprintsEnable: boolean;

    public ngDestroyed$ = new Subject();


    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>, private actionUpdates$: Actions, private router: Router) {
        this.actionUpdates$
            .pipe(
                ofType(SprintReplanHistoryActionTypes.LoadSprintReplanHistoryItemsCompleted),
                tap(() => {
                    this.activityHistory$ = this.store.pipe(select(projectModuleReducer.getSprintReplanHistoryAll));
                    this.activityHistory$.subscribe(result => {
                        this.data = result[0];
                        if (this.data.maxReplanCount)
                            this.initialData = this.data.maxReplanCount;
                        this.cdRef.detectChanges();
                        this.description = this.data.userStoriesDescrptions;
                        if (this.data.sprintReplanCount)
                            this.message = false;
                        else {
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

            this.getSoftLabels();
            this.getCompanySettings();
    }

    ngOnInit() {
        this.getSoftLabels();
        this.getSprintHistory();
        this.getCompanySettings();
        this.Offset=String (-(new Date().getTimezoneOffset()));
    }

    
    getCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel.length > 0) {
            let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
            if (sprintResult.length > 0) {
                this.isSprintsEnable = sprintResult[0].value == "1" ? true : false;
            }
        }
      }

    getSoftLabels() {
       this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
    

    getSprintHistory() {
        if(!this.sprintId) {
            return;
         }
        this.loading = true;
        localStorage.setItem('sprintId', this.sprintId);
        localStorage.setItem('goalReplanValue', this.goalReplanValue);
        this.store.dispatch(new LoadSprintReplanHistoryItemsTriggered(this.sprintId, this.goalReplanValue));
        this.isAnyOperationIsInprogress$ = this.store.pipe(select(projectModuleReducer.getSprintReplanHistoryLoading))
    }


    previousReplan() {
        if (this.goalReplanValue == this.OriginalGoalReplanValue)
            this.isNextDisable = false;
        this.isReplan = this.isReplan + 1;
        this.goalReplanValue = this.goalReplanValue - 1;
        this.getSprintHistory();
        if (this.goalReplanValue == 1)
            this.isPreviousDisable = true;
        else
            this.isPreviousDisable = false;
    }

    nextReplan() {
        if (this.goalReplanValue == 1)
            this.isPreviousDisable = false;
        this.goalReplanValue = this.goalReplanValue + 1;
        this.isReplan = this.isReplan + 1;
        this.getSprintHistory();
        if (this.goalReplanValue == this.OriginalGoalReplanValue)
            this.isNextDisable = true;
        else
            this.isNextDisable = false;
    }

    check() {
        if (this.goalReplanValue == 1) {
            this.isNextDisable = true;
            this.isPreviousDisable = true;
        }
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.router.navigateByUrl('/projects');
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
        localStorage.removeItem('sprintId');
        localStorage.removeItem('goalReplanValue');
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