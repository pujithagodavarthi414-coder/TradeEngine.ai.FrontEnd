import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter, ViewChildren, ViewChild, TemplateRef, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, ViewContainerRef, Type, ElementRef, ComponentFactoryResolver } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import cronstrue from 'cronstrue';

import * as auditModuleReducer from "../store/reducers/index";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';

import { AuditCompliance } from "../models/audit-compliance.model";
import * as _ from 'underscore';

import { LoadAuditTriggered, AuditActionTypes } from "../store/actions/audits.actions";
import { CronOptions } from "cron-editor";
import { RecurringCronExpressionModel } from '../dependencies/models/cron-expression-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ToastrService } from 'ngx-toastr';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { JobScheduleModel } from '../models/schedule.model';
import { Guid } from 'guid-typescript';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeListModel } from '../dependencies/models/employee-model';
import { EmployeeService } from '../dependencies/services/employee-service';
import { AuditService } from '../services/audits.service';
import { GenericFormService } from '../../components/genericform/services/generic-form.service';
import { SatPopover } from '@ncstate/sat-popover';
import { WorkflowTrigger } from '../models/workflow-trigger.model';
import { WorkFlowTriggerService } from '../services/workflow-trigger.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { GenericStatusComponent } from "@snovasys/snova-app-builder-creation-components";

@Component({
    selector: "audit-add-or-edit",
    templateUrl: "./audit-add-or-edit.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditAddOrEditComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() closeAudit = new EventEmitter<string>();
    @Output() updatedDescription = new EventEmitter<any>();
    @Output() updatedId = new EventEmitter<string>();
    @ViewChild("addCronExpressionPopUp") addCronExpressionPopUp;
    @ViewChildren("addSchedulesPopUp") addSchedulesPopUp;
    @ViewChild("deleteAuditSchedulerTriggerPopover") deleteAuditSchedulerTriggerPopover;
    @ViewChild("SelectQuestions") SelectQuestions;
    @ViewChildren("workflowTypePopover") workflowTypesPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allKeysSelected") private allKeysSelected: MatOption;
    @ViewChild("addWorkflow") addWorkflowPopup: SatPopover;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;
    @ViewChild("workflowSelectionComponent") workflowSelectionComponent: TemplateRef<any>;
    @Input("editAudit")
    set _editAudit(data: boolean) {
        if (data || data == false)
            this.isEditAudit = data;
        else
            this.isEditAudit = false;
    }

    @Input("defaultWorkflows")
    set _defaultWorkflows(data: any) {
        this.defaultWorkflows = data;
    }

    @Input("audit")
    set _audit(data: AuditCompliance) {
        if (data) {
            this.editAuditData = data;
            this.isEditAudit = true;
            if(this.isEditAudit) {
                if(this.editAuditData.enableWorkFlowForAudit){
                    this.loadedAuditStatus = false;
                    this.loadGenericStatusComponentForAudit('Audits', true);
                }
                if(this.editAuditData.enableWorkFlowForAuditConduct) {
                    this.loadedConductStatus = false;
                    this.loadGenericStatusComponentForConduct('Conduct', true);
                }
                this.getConductUserDropdown();
            }
            this.initializeAuditForm();
            this.auditForm.patchValue(this.editAuditData);
            this.changeRAG(this.editAuditData.isRAG);
            this.schedules = [];
            this.bindSchedulingDetails();
            this.bindAuditDescription();
        }
        else {
            this.editAuditData = null;
        }
    }

    @Input("parentAuditId")
    set _parentAuditId(data: any) {
        if (data) {
            this.parentAuditId = data;
        }
    }

    @Input("fromMain")
    set _fromMain(data: boolean) {
        if (data || data == false) {
            this.fromMain = data;
        }
        else {
            this.fromMain = false;
        }
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress$: Observable<boolean>;
    defaultWorkflows: any;
    public ngDestroyed$ = new Subject();
    auditDescription: any

    projectId: string;

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };


    public cronOptions: CronOptions = {

        formInputClass: "form-control cron-editor-input",
        formSelectClass: "form-control cron-editor-select",
        formRadioClass: "cron-editor-radio",
        formCheckboxClass: "cron-editor-checkbox",
        defaultTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
        use24HourTime: true,
        hideMinutesTab: false,
        hideHourlyTab: false,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: true,
        hideSeconds: true,
        removeSeconds: true,
        removeYears: true
    };

    public schedulingEnds = [{ endType: 'Never', code: 1 },
    { endType: 'ON', code: 2 }
    ]
    workflowSelected: boolean;
    auditForm: FormGroup;
    schedulesForm: FormGroup;
    endDate = new FormControl('', Validators.compose([Validators.required]));
    scheduleType = new FormControl('', Validators.compose([]));
    minDate = new Date();
    dateFormat: any;

    editAuditData: any;

    selectedSchedulingType: string;
    cronExpressionDescription: string;
    public cronExpression = "" + new Date().getMinutes() + " " + new Date().getHours() + " 1/1 * ?";
    cronExpressionId: string;
    cronExpressionTimeStamp: string;
    jobId: string;

    isEditAudit: boolean = false;
    disableAudit: boolean = false;
    isRecurringAudit: boolean = false;
    isEditScheduling: boolean = false;
    fromMain: boolean = false;
    isPaused: boolean = false;
    public isCronDisabled = false;
    userList = [];
    selectedMember: string;
    selectedMemberId: string;
    parentAuditId: string;
    schedules: RecurringCronExpressionModel[] = [];
    gridView: any;
    selectedSchedule: RecurringCronExpressionModel;
    workFlowForAudit: any;
    workFlowForConduct: any;
    selectedWorkflowType: any;
    loadWorkflowType = false;
    validationMessage: string;
    addingWorkflow: boolean;
    workflowTypes = [];
    workFlowList = [{name: 'workflow1'},{name: 'workflow2'}];
    editBpmnWorkflowId: any;
    editBpmnWorkflowXml: any;
    editBpmnWorkflowName: string;
    editBpmnWorkflow = false;
    workflowType3Id = ConstantVariables.WorkflowType3Id;
    workflowType4Id = ConstantVariables.WorkflowType4Id;
    editWorkflowTrigger: string;
    
    triggerItems = [];
    workFlowItems = [];
    workFlowType: any;
    workflowId: string;
    conductWorkFlow: any;
    auditWorkFlow: any
    isAnyOperationIsInprogress: boolean;
    loadedAudit: boolean;
    loadedConduct: boolean;
    loadedConductStatus: boolean;
    loadedAuditStatus: boolean;
    injector: any;
    dashboard: any;
    conductComp: any
    conductWorkFlowId: string;
    auditWorkFlowId: string;
    auditDefaultWorkflowId: string;
    conductDefaultWorkflowId: string;
    questionDefaultWorkflowId: string;
    constructor(private store: Store<State>, private actionUpdates$: Actions, private employeeService: EmployeeService, private auditService: AuditService,
        private toastr: ToastrService, private routes: Router, private route: ActivatedRoute,
        public dialog: MatDialog, private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private genericFormService: GenericFormService, private workFlowTriggerService: WorkFlowTriggerService,
        private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>) {
        super();
        this.injector = this.vcr.injector;

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.getConductUserDropdown();
        this.dateFormat = {};
        this.dateFormat.pattern = ConstantVariables.DateFormat;
        this.initializeAuditForm();
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditByIdCompleted),
                tap(() => {
                    this.closeAuditDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.AuditFailed),
                tap(() => {
                    this.disableAudit = false;
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
        //this.getUserList();
        super.ngOnInit();
    }

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    addOrEditAudit() {
        let inValue = this.auditForm.get('inBoundPercent').value;
        let outValue = this.auditForm.get('outBoundPercent').value;

        if (this.auditForm.value.spanInMonths == 0 && this.auditForm.value.spanInYears == 0 && this.auditForm.value.spanInDays == 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.ConductMinSpanValue));
            return;
        }
        if (!this.checkValue(inValue, outValue)) {
            this.disableAudit = true;
            let auditModel = new AuditCompliance();
            auditModel = this.auditForm.value;
            auditModel.schedulingDetails = [...this.schedules];
            auditModel.auditWorkFlowId = this.isEditAudit ? this.editAuditData.auditWorkFlowId : null;
            auditModel.conductWorkFlowId = this.isEditAudit ? this.editAuditData.conductWorkFlowId : null;
            auditModel.auditDefaultWorkflowId = this.defaultWorkflows ? this.defaultWorkflows.auditDefaultWorkflowId : null;
            auditModel.conductDefaultWorkflowId = this.defaultWorkflows ? this.defaultWorkflows.conductDefaultWorkflowId : null;
            auditModel.questionDefaultWorkflowId = this.defaultWorkflows ? this.defaultWorkflows.questionDefaultWorkflowId : null;
            if(this.workflowSelected) {
                auditModel.auditDefaultWorkflowId = this.auditDefaultWorkflowId;
                auditModel.conductDefaultWorkflowId = this.conductDefaultWorkflowId;
                auditModel.questionDefaultWorkflowId = this.questionDefaultWorkflowId;
                auditModel.auditWorkFlowId = this.auditWorkFlow ? this.auditWorkFlow.workflowId : null;
                auditModel.conductWorkFlowId = this.conductWorkFlow ? this.conductWorkFlow.workflowId : null;
                auditModel.toSetDefaultWorkflows = true;
            }            
            auditModel.isNewAudit = this.isEditAudit ? false : true;
            if (this.fromMain)
                auditModel.fromAuditComponent = true;
            if (!this.isEditAudit)
                auditModel.parentAuditId = this.parentAuditId;
            auditModel.projectId = this.isEditAudit ? this.editAuditData.projectId : this.projectId;
            this.store.dispatch(new LoadAuditTriggered(auditModel));
        }
    }

    closeAuditDialog() {
        this.disableAudit = false;
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedCategories');
        this.closeAudit.emit('');
    }

    checkValidation(event) {
        this.auditForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    initializeAuditForm() {
        this.auditForm = new FormGroup({
            auditId: new FormControl("", []),
            parentAuditId: new FormControl(null, []),
            auditName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
            auditDescription: new FormControl(null, Validators.compose([Validators.maxLength(807)])),
            viewAuditDescription: new FormControl(false, []),
            timeStamp: new FormControl(null, []),
            recurringAudit: new FormControl(false, []),
            isRAG: new FormControl(false, []),
            canLogTime: new FormControl(false, []),
            inBoundPercent: new FormControl(null, []),
            outBoundPercent: new FormControl(null, []),
            responsibleUserId: new FormControl(null, Validators.compose([Validators.required])),
            enableQuestionLevelWorkFlow: new FormControl(false,[]),
            enableWorkFlowForAudit: new FormControl(false,[]),
            enableWorkFlowForAuditConduct: new FormControl(false,[])
        });
        this.initializeScheduleForm();
    }

    initializeScheduleForm() {
        this.schedulesForm = new FormGroup({
            id: new FormControl(null, []),
            expression: new FormControl(null, []),
            expressionDescription: new FormControl(null, []),
            conductStartDate: new FormControl(null, Validators.compose([Validators.required])),
            conductEndDate: new FormControl(null, Validators.compose([Validators.required])),
            spanInYears: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(1)])),
            spanInMonths: new FormControl(0, Validators.compose([Validators.required, Validators.min(0), Validators.max(12)])),
            spanInDays: new FormControl(1, Validators.compose([Validators.required, Validators.min(0), Validators.max(365)])),
            isPaused: new FormControl(false, []),
            responsibleUserId: new FormControl(null, Validators.compose([Validators.required]))
        });
    }

    checkValue(inValue, outValue) {
        if (this.auditForm.get('isRAG').value && inValue != null && outValue != null && inValue >= outValue) {
            return true;
        }
        else
            return false;
    }

    changeRAG(value) {
        if (value) {
            this.auditForm.get('inBoundPercent').setValidators([Validators.required]);
            this.auditForm.get('outBoundPercent').setValidators([Validators.required]);
            // this.auditForm.updateValueAndValidity();
            this.auditForm.get('inBoundPercent').updateValueAndValidity();
            this.auditForm.get('outBoundPercent').updateValueAndValidity();
        }
        else {
            // this.auditForm.get('inBoundPercent').patchValue(null);
            // this.auditForm.get('outBoundPercent').patchValue(null);
            this.auditForm.get('inBoundPercent').clearValidators();
            this.auditForm.get('outBoundPercent').clearValidators();
            this.auditForm.get('inBoundPercent').updateValueAndValidity();
            this.auditForm.get('outBoundPercent').updateValueAndValidity();
            // this.auditForm.updateValueAndValidity();
        }
    }

    recurringAudit(addCronExpressionPopUp, event) {
        if (event.checked == true || event.checked == undefined) {
            this.isRecurringAudit = true;
            this.scheduleType.setValue(1);
            addCronExpressionPopUp.openPopover();
            this.isEditScheduling = true;
            this.auditForm.get('conductStartDate').setValidators([Validators.required]);
            this.auditForm.get('conductStartDate').updateValueAndValidity();
            this.auditForm.get('conductEndDate').setValidators([Validators.required]);
            this.auditForm.get('conductEndDate').updateValueAndValidity();
        }
        else {
            this.isRecurringAudit = false;
            this.isEditScheduling = false;
            this.auditForm.get('conductStartDate').clearValidators();
            this.auditForm.get('conductStartDate').updateValueAndValidity();
            this.auditForm.get('conductEndDate').clearValidators();
            this.auditForm.get('conductEndDate').updateValueAndValidity();
        }
    }

    addRecurringAudit(addCronExpressionPopUp, event) {
        if (event.type == "click") {
            this.initializeScheduleForm();
            this.isRecurringAudit = true;
            this.scheduleType.setValue(1);
            addCronExpressionPopUp.openPopover();
            this.isEditScheduling = true;
            if (this.isEditAudit)
                this.schedulesForm.controls["responsibleUserId"].setValue(this.editAuditData.responsibleUserId);
            // this.auditForm.get('conductStartDate').setValidators([Validators.required]);
            // this.auditForm.get('conductStartDate').updateValueAndValidity();
            // this.auditForm.get('conductEndDate').setValidators([Validators.required]);
            // this.auditForm.get('conductEndDate').updateValueAndValidity();
            event.stopPropagation();
            event.preventDefault();
        }
    }

    editAddSchedulesPopUp(addSchedulesPopUp) {
        addSchedulesPopUp.openPopover();
    }

    closeAddSchedulesPopUp() {
        this.addSchedulesPopUp.forEach((p) => p.closePopover());
        // this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
    }

    editCronExpressionPopup(addCronExpressionPopUp) {
        addCronExpressionPopUp.openPopover();
    }

    closeCronExpressionPopUp() {
        this.addCronExpressionPopUp.closePopover();
        this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
    }

    submitCronExpressionPopUp() {
        if (this.schedulesForm.value.spanInMonths == 0 && this.schedulesForm.value.spanInYears == 0 && this.schedulesForm.value.spanInDays == 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.ConductMinSpanValue));
            return;
        }

        let jobScheduleModel = new RecurringCronExpressionModel();
        if (this.selectedSchedule) {
            let schedule = this.schedules.find(x => x.cronExpressionId == this.selectedSchedule.cronExpressionId);
            if (schedule) {
                schedule.conductEndDate = this.schedulesForm.value.conductEndDate;
                schedule.conductStartDate = this.schedulesForm.value.conductStartDate;
                schedule.cronExpression = this.cronExpression;
                schedule.cronExpressionDescription = cronstrue.toString(this.cronExpression);
                schedule.isIncludeAllQuestions = this.SelectQuestions.addConductForm.value.isIncludeAllQuestions;
                schedule.selectedCategories = this.SelectQuestions.selectedCategories;
                schedule.selectedQuestions = this.SelectQuestions.selectedQuestions;
                schedule.isPaused = this.schedulesForm.value.isPaused;
                schedule.isRecurringWorkItem = true;
                schedule.spanInDays = this.schedulesForm.value.spanInDays;
                schedule.spanInMonths = this.schedulesForm.value.spanInMonths;
                schedule.spanInYears = this.schedulesForm.value.spanInYears;
            }
        } else {
            jobScheduleModel = this.schedulesForm.value;
            if (jobScheduleModel.cronExpressionId) {
                this.schedules = this.schedules.filter(x => x.cronExpressionId != jobScheduleModel.cronExpressionId);
            }
            jobScheduleModel.cronExpressionDescription = cronstrue.toString(this.cronExpression);
            jobScheduleModel.cronExpression = this.cronExpression;
            if (this.SelectQuestions && this.SelectQuestions.addConductForm) {
                jobScheduleModel.isIncludeAllQuestions = this.SelectQuestions.addConductForm.value.isIncludeAllQuestions;
                jobScheduleModel.selectedCategories = this.SelectQuestions.selectedCategories;
                jobScheduleModel.selectedQuestions = this.SelectQuestions.selectedQuestions;
            } else {
                jobScheduleModel.isIncludeAllQuestions = true;
            }
            this.schedules.push(jobScheduleModel);
            this.gridView = {
                data: this.schedules.filter(x => !x.isArchived),
                total: this.schedules.filter(x => !x.isArchived).length
            }
        }
        this.closeCronExpressionPopUp();
    }

    bindSchedule(jobScheduleModel, addCronExpressionPopUp, event) {
        this.isEditScheduling = true;
        localStorage.setItem('selectedQuestions', JSON.stringify(jobScheduleModel.selectedQuestions));
        addCronExpressionPopUp.openPopover();
        this.selectedSchedule = jobScheduleModel;
        this.cronExpression = this.selectedSchedule.cronExpression;
        this.schedulesForm.patchValue(jobScheduleModel);
        event.stopPropagation();
        event.preventDefault();
    }

    removeAuditScheduler() {
        if (this.selectedSchedule && this.selectedSchedule.cronExpressionId) {
            let schedule = this.schedules.find(x => x.cronExpressionId == this.selectedSchedule.cronExpressionId);
            schedule.isArchived = true;
        } else {
            this.schedules = this.schedules.filter(x => x.cronExpression != this.selectedSchedule.cronExpression);
        }
        this.gridView = {
            data: this.schedules.filter(x => !x.isArchived),
            total: this.schedules.filter(x => !x.isArchived).length
        }
        this.cancelAuditSchedulerPopover();
    }

    deleteAuditSchedulerTriggerFn(row, popover) {
        this.selectedSchedule = row;
        this.deleteAuditSchedulerTriggerPopover.openPopover();
    }

    cancelAuditSchedulerPopover() {
        this.deleteAuditSchedulerTriggerPopover.closePopover();
    }

    onEndTypeChanged(event) {
        this.selectedSchedulingType = event.value;
        if (this.selectedSchedulingType == "1") {
            this.endDate.setValue(null);
        } else if (this.selectedSchedulingType == "2") {
            this.endDate.setValue(this.minDate);
        }
    }

    bindSchedulingDetails() {
        if (this.editAuditData.schedulingDetails && this.editAuditData.schedulingDetails.length > 0) {
            this.auditForm.get('recurringAudit').setValue(true);
            this.isRecurringAudit = true;
            // this.cronExpressionDescription = cronstrue.toString(this.editAuditData.cronExpression);
            this.schedules = this.editAuditData.schedulingDetails;
            this.gridView = {
                data: this.schedules.filter(x => !x.isArchived),
                total: this.schedules.filter(x => !x.isArchived).length
            }
        }

        // this.cronExpression = this.editAuditData.cronExpression != null ? this.editAuditData.cronExpression : this.cronExpression;
        // // this.auditForm.get('conductStartDate').setValue(this.editAuditData.conductStartDate);
        // // this.auditForm.get('conductEndDate').setValue(this.editAuditData.conductEndDate);
        // this.cronExpressionId = this.editAuditData.cronExpressionId;
        // this.cronExpressionTimeStamp = this.editAuditData.cronExpressionTimeStamp;
        // this.jobId = this.editAuditData.jobId;
        // this.isPaused = this.editAuditData.isPaused;
        // this.editAuditData.scheduleEndDate == null ? this.scheduleType.setValue(1) : this.scheduleType.setValue(2);
        // this.selectedSchedulingType = this.editAuditData.scheduleEndDate == null ? "1" : "2";
        // this.endDate.setValue(this.editAuditData.scheduleEndDate);
    }

    bindAuditDescription() {
        if(this.editAuditData.auditDescription != null) {
            this.auditForm.get('viewAuditDescription').setValue(true);
            this.cdRef.detectChanges();
        }
    }

    getExpressionDescription(cronExpression) {
        return cronstrue.toString(cronExpression);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    getUserList() {
        let userModel = new EmployeeListModel();
        userModel.isArchived = false;
        userModel.isActive = true;
        userModel.sortBy = "FirstName";
        userModel.sortDirectionAsc = true;
        this.employeeService.getAllEmployees(userModel).subscribe((response: any) => {
            this.userList = response.data;
            // this.cdRef.markForCheck();
            this.cdRef.detectChanges();
        });
    }

    getConductUserDropdown() {
        // this.auditService.getConductUserDropdown("audit").subscribe((result: any) => {
        //     this.userList = result.data;
        //     this.cdRef.markForCheck();
        // })
        var projectId = this.isEditAudit ? this.editAuditData.projectId : this.projectId;
        this.employeeService.getAllProjectMembers(projectId).subscribe((response: any) => {
            if (response.success) {
                this.userList = response.data;
                // this.cdRef.markForCheck();
                this.cdRef.detectChanges();
            }
            else {
                this.userList = [];
                this.cdRef.markForCheck();
            }
        });
    }

    getAssigneeValue(selectedEvent) {
        let usersList = this.userList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.projectMember.id == selectedEvent;
        });
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
            this.selectedMemberId = filteredList.projectMember.id;
            this.cdRef.markForCheck();
        }
    }

    loadGenericStatusComponentForAudit(type, checked) {
        if(this.isEditAudit && this.editAuditData.auditWorkFlowId && !checked) {
            this.editAuditData.auditWorkFlowId = null;
            return;
        }
        this.loadedAuditStatus = false;
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
          console.error(`No modules found`);
          return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function(module: any) {
          var widget = _.find(module.apps, function(app: any) { return app.displayName.toLowerCase() == "generic status" });
          if (widget) {
            return true;
          }
          return false;
        })
        // this.ngModuleFactoryLoader
        //   .load(module.moduleLazyLoadingPath)
        //   .then((moduleFactory: NgModuleFactory<any>) => {
        //     const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
    
        //     var allComponentsInModule = (<any>componentService).components;
    
        //     this.ngModuleRef = moduleFactory.create(this.injector);
    
        //     var componentDetails = allComponentsInModule.find(elementInArray =>
        //       elementInArray.name === "Generic status");
      
            let factory;      
            factory = this.ngModuleFactoryLoader.resolveComponentFactory(GenericStatusComponent);
            
    
            this.dashboard = {};
            this.dashboard.component = factory;
            this.dashboard.inputs = {
                referenceId: this.isEditAudit ? this.editAuditData.auditId : null,
                referenceName: type,
                auditDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.auditDefaultWorkflowId : null,
                conductDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.conductDefaultWorkflowId : null,
                questionDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.questionDefaultWorkflowId : null,
                status: this.isEditAudit ? this.editAuditData.status : 'Draft',
                statusColor: this.isEditAudit ? this.editAuditData.statusColor ? this.editAuditData.statusColor : null : null
            }
            type == 'Conduct' ? this.loadedConductStatus = true : this.loadedAuditStatus = true;
            this.cdRef.detectChanges();
        //   })
    }

    loadGenericStatusComponentForConduct(type, checked) {
        if(this.isEditAudit && this.editAuditData.conductWorkFlowId && !checked) {
            this.editAuditData.conductWorkFlowId = null;
            return;
        }
        this.loadedConductStatus = false;
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
          console.error(`No modules found`);
          return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function(module: any) {
          var widget = _.find(module.apps, function(app: any) { return app.displayName.toLowerCase() == "generic status" });
          if (widget) {
            return true;
          }
          return false;
        })
        // // this.ngModuleFactoryLoader
        // //   .load(module.moduleLazyLoadingPath)
        // //   .then((moduleFactory: NgModuleFactory<any>) => {
        // //     const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
    
        // //     var allComponentsInModule = (<any>componentService).components;
    
        // //     this.ngModuleRef = moduleFactory.create(this.injector);
    
        //     var componentDetails = allComponentsInModule.find(elementInArray =>
        //       elementInArray.name === "Generic status");
      
            let factory;      
            factory = this.ngModuleFactoryLoader.resolveComponentFactory(GenericStatusComponent);
            
    
            this.conductComp = {};
            this.conductComp.component = factory;
            this.conductComp.inputs = {
                referenceId: this.isEditAudit ? this.editAuditData.auditId : null,
                referenceName: type,
                status:  'Draft',
                auditDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.auditDefaultWorkflowId : null,
                conductDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.conductDefaultWorkflowId : null,
                questionDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.questionDefaultWorkflowId : null
            }
            type == 'Conduct' ? this.loadedConductStatus = true : this.loadedAuditStatus = true;
            this.cdRef.detectChanges();
        //   })
    }

    outputs = {
        workFlowSelected : workFlow => {
            if(workFlow.referenceName == 'Audits') {
                this.auditWorkFlow = workFlow.workFlow;
            } else if(workFlow.referenceName == 'Conduct'){
                this.conductWorkFlow = workFlow.workFlow;
            }
            this.auditDefaultWorkflowId = workFlow.data.auditDefaultWorkflowId;
            this.conductDefaultWorkflowId = workFlow.data.conductDefaultWorkflowId;
            this.questionDefaultWorkflowId = workFlow.data.questionDefaultWorkflowId;
            this.workflowSelected = true;
        }
    }

}