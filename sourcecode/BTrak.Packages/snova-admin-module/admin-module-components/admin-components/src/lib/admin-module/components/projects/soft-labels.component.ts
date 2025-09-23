import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { SatPopover } from "@ncstate/sat-popover";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { MaterSettingService } from '../../services/master-setting.services';
import * as commonModuleReducers from '@thetradeengineorg1/snova-custom-fields';
import { State } from '../../store/reducers';
import { softLabelsActionTypes, GetsoftLabelsTriggered, UpsertsoftLabelTriggered } from '@thetradeengineorg1/snova-custom-fields';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CompanysettingsModel } from '../../models/hr-models/company-model';

@Component({
    selector: "app-pm-component-soft-labels",
    templateUrl: "soft-labels.component.html"
})

export class PMSoftLabelsComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChild('addsoftLabelPopover') softLabelsPopover: SatPopover;
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[] = [];
    anyOperationInProgress$: Observable<boolean>;
    updateOperationInProgress$: Observable<boolean>;
    roleFeaturesIsInProgress$: Observable<boolean>;
    searchText: string;
    isTestTrailEnable: boolean;
    isArchivedTypes: boolean;
    softLabelId: string;
    timeStamp: any;
    softLabelsForm: FormGroup;
    public ngDestroyed$ = new Subject();
    anyOperationInProgress: boolean =false;
    updateOperationInProgress: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
        private masterSettings: MaterSettingService) {
        super();
        this.clearForm();
        this.getSoftLabelConfigurations();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(softLabelsActionTypes.UpsertsoftLabelCompleted),
                tap(() => {
                    this.formDirective.reset();
                    this.softLabelsPopover.close();
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getCompanySettings();
        this.softLabels$ = this.store.pipe(select(commonModuleReducers.getSoftLabelsAll));
        // this.softLabels$.subscribe((result) => {
        //     if (result && result.length > 0) {
        //         localStorage.setItem(LocalStorageProperties.SoftLabels, JSON.stringify(result));
        //     }
        // });
        // this.anyOperationInProgress$ = this.store.pipe(select(commonModuleReducers.loadingSearchSoftLabels));
        this.updateOperationInProgress$ = this.store.pipe(select(commonModuleReducers.createSoftLabelsLoading));
    }

    getCompanySettings() {
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.masterSettings.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {

                let companyResult = response.data.filter(item => item.key.trim() == "EnableTestcaseManagement");
                if (companyResult.length > 0) {
                    this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    editBoardTypeWorkFlowPopover(row, addSoftLabelPopOver) {
        this.softLabelId = row.softLabelConfigurationId;
        this.timeStamp = row.timeStamp;
        this.softLabelsForm.patchValue(row);
        addSoftLabelPopOver.openPopover();
    }

    clearForm() {
        this.softLabelsForm = new FormGroup({
            projectLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            goalLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            userStoryLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            employeeLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            deadlineLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            projectsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            goalsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            userStoriesLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            employeesLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            deadlinesLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            scenarioLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            scenariosLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            runLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            runsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            versionLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            versionsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            testReportLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            testReportsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            estimatedTimeLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            estimationLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            estimationsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            estimateLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            estimatesLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            conductLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            conductsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            actionLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            actionsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            timelineLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditActivityLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditReportLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditReportsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            reportLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            reportsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditAnalyticsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditQuestionLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            auditQuestionsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            clientLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
            clientsLabel: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(50)])),
        })
    }

    getSoftLabelConfigurations() {
        this.anyOperationInProgress = true;
        var softLabelConfigurationModel = new SoftLabelConfigurationModel();
        softLabelConfigurationModel.searchText = this.searchText;
        this.masterSettings.getSoftLabelConfigurations(softLabelConfigurationModel).subscribe((response: any) => {
            this.anyOperationInProgress = false;
            if (response.success == true && response.data.length > 0) {
                this.softLabels = response.data;
                localStorage.setItem(LocalStorageProperties.SoftLabels, JSON.stringify(response.data));   
                this.cdRef.detectChanges();
            }
        });
    }

    updateSoftLabelConfiguration() {
        this.updateOperationInProgress = true;
        var softLabelConfiguration = new SoftLabelConfigurationModel();
        softLabelConfiguration = this.softLabelsForm.value;
        softLabelConfiguration.softLabelConfigurationId = this.softLabelId;
        softLabelConfiguration.timeStamp = this.timeStamp;
        this.masterSettings.upsertSoftLabelConfigurations(softLabelConfiguration).subscribe((response: any) => {
            this.updateOperationInProgress = false;
            if (response.success == true) {
               this.closeDialog();
                this.getSoftLabelConfigurations();
            }
        });
    }

    closeDialog() {
        this.softLabelsPopover.close();
    }

    filterByName(text) {
        this.getSoftLabelConfigurations();
    }

    closeSearch() {
        this.searchText = null;
        this.getSoftLabelConfigurations();
    }
}