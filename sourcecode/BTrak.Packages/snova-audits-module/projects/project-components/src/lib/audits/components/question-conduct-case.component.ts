import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewChild, QueryList } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import * as _ from "underscore";

import * as auditModuleReducer from "../store/reducers/index";
// import * as moment from "moment";
import { QuestionModel } from '../models/question.model';
import { QuestionActionTypes, LoadQuestionDeleteTriggered, LoadInlineConductQuestionTriggered, LoadActionsByQuestionTriggered, LoadConductActionTriggered } from '../store/actions/questions.actions';

// import { ConstantVariables } from "../../../common/constants/constant-variables";
import { SatPopover } from '@ncstate/sat-popover';
import { DatePipe } from '@angular/common';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { Router } from '@angular/router';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';

@Component({
    selector: 'question-conduct-case',
    templateUrl: './question-conduct-case.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionConductCaseComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('scenarioBugsPopover') scenarioBugPopover;
    @ViewChild("questionTitle") questionTitleStatus: ElementRef;
    @ViewChild("updateStatusPopover") updateStatusesPopover: SatPopover;
    @Output() questionPreview = new EventEmitter<any>();
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @Input() questionSelected: boolean;
    fromTimePicker: string;
    addOp: boolean;
    actionRequiredData: any;
    canLinkAction: any;
    @ViewChild("deleteAction") deleteActionPopover: SatPopover;
    //@ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    disableActionDelete: boolean;
    deleteOperationInProgress: boolean;
    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.canConductSubmitted == null || this.selectedConduct.canConductSubmitted == false)
                this.canConductSubmitted = false;
            else
                this.canConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
        }
    }

    @Input("questionDetails")
    set _questionDetails(data: any) {
        if (data)
            this.questionDetail = data;
        if (this.questionDetail.questionResultTime)
            this.intimepicker = this.questionDetail.questionResultTime.toString().substring(0, 5);
        if (this.questionDetail.status == ConstantVariables.Draft) {
            this.status = this.translateService.instant(ConstantVariables.DraftStatus);
        } else if (this.questionDetail.status == ConstantVariables.Submitted) {
            this.status = this.translateService.instant(ConstantVariables.SubmittedStatus);
        } else if (this.questionDetail.status == ConstantVariables.SendFroApproved) {
            this.status = this.translateService.instant(ConstantVariables.SendForApprovalStatus);
        } else if (this.questionDetail.status == ConstantVariables.Approved) {
            this.status = this.translateService.instant(ConstantVariables.ApprovedStatus);
        } else if (this.questionDetail.enableQuestionLevelWorkFlow && !this.questionDetail.status) {
            this.status = this.translateService.instant(ConstantVariables.DraftStatus);
        } else {
            this.status = this.questionDetail.status;
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    searchOperationInProgress$: Observable<boolean>;
    bugsInTestCaseProgress$: Observable<boolean>;
    scenarioBugs$: Observable<QuestionModel[]>;

    public ngDestroyed$ = new Subject();

    questionConductForm: FormGroup;

    questionTypeOptions = [];

    deleteCase: any;
    searchTestSuite: any;
    questionDetail: any;
    selectedConduct: any;
    width: any;
    status: string;
    disableDeleteTestCase: boolean = false;
    showTitleTooltip: boolean = false;
    isAuditArchived: boolean = false;
    isConductEditable: boolean = true;
    isQuestionSelected: boolean = false;
    isConductSubmitted: boolean = false;
    canConductSubmitted: boolean = false;
    disableUpdate: boolean = false;
    loadStatus: boolean = false;
    loadActions: boolean = false;
    isFromUniquePage: boolean = false;

    intimepicker: any;

    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    dateQuestionTypeId = ConstantVariables.DateQuestionTypeId.toLowerCase();
    numericQuestionTypeId = ConstantVariables.NumericQuestionTypeId.toLowerCase();
    textQuestionTypeId = ConstantVariables.TextQuestionTypeId.toLowerCase();
    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();
    timeQuestionTypeId = ConstantVariables.TimeQuestionTypeId.toLowerCase();

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>,
        private actionUpdates$: Actions, public dialog: MatDialog, private router: Router, private cdRef: ChangeDetectorRef
        , private datePipe: DatePipe, private translateService: TranslateService, private softLabelsPipe: SoftLabelPipe) {
        super();

        if (this.router.url.includes('projects/audit')) {
            this.isFromUniquePage = true;
            this.cdRef.markForCheck();
        }
         var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
        this.canLinkAction = _.find(roles, function(role: any) {return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_LinkAndUnlinkActionsToQuestion.toString().toLowerCase(); }) != null;
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getInlineQuestionForConductLoading));
        this.searchOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionByIdForConductLoading));
        this.bugsInTestCaseProgress$ = this.store.pipe(select(auditModuleReducer.getActionsByQuestionIdLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionDeleteCompleted),
            tap(() => {
                if (this.deleteCase != undefined && this.deleteCase.questionId == this.questionDetail.questionId) {
                    this.disableDeleteTestCase = false;
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadActionsByQuestionCompleted),
            tap(() => {
                this.scenarioBugs$ = this.store.pipe(select(auditModuleReducer.getActionListByQuestionId));
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductActionCompleted),
                tap(() => {
                    this.loadBugs();
                    this.addOp = false;
                    this.closeDeleteActionPopover();
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionByIdCompleted),
                tap(() => {
                    this.updateStatusesPopover.close();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.QuestionFailed),
            tap(() => {
                this.disableDeleteTestCase = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    previewQuestion(qustionData, value) {
        if (value == "true") {
            let data = {
                questionData: qustionData,
                conductId: this.selectedConduct.conductId
            };
            this.questionPreview.emit(data);
        }
    }

    openUpdateStatusPopover(value) {
        if (value == "true" && !(!this.isConductEditable || this.isAuditArchived || this.isConductSubmitted)) {
            this.disableUpdate = false;
            this.loadStatus = true;
            this.questionTypeOptions = JSON.parse(this.questionDetail.questionsXml);
            if (this.questionTypeOptions == null)
                this.questionTypeOptions = [];
            this.questionTypeOptions.forEach(x => {
                x.auditConductAnswerId = x.auditConductAnswerId.toLowerCase();
            });
            this.initializeConductForm();
            this.questionConductForm.patchValue(this.questionDetail);
            if (this.questionDetail.masterQuestionTypeId == this.dropdownQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.booleanQuestionTypeId) {
                this.questionConductForm.get('auditConductAnswerId').setValue(this.questionDetail.auditAnswerId);
                this.questionConductForm.get('auditConductAnswerId').setValidators([Validators.required]);
                this.questionConductForm.get('auditConductAnswerId').updateValueAndValidity();
                this.questionConductForm.controls["questionOptionDate"].clearValidators();
                this.questionConductForm.get("questionOptionDate").updateValueAndValidity();
            } else if (this.questionDetail.masterQuestionTypeId == this.dateQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.numericQuestionTypeId ||
                this.questionDetail.masterQuestionTypeId == this.textQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.timeQuestionTypeId) {
                this.questionConductForm.get('questionOptionDate').setValidators([Validators.required]);
                this.questionConductForm.get('questionOptionDate').updateValueAndValidity();
                this.questionConductForm.get('auditConductAnswerId').clearValidators();
                this.questionConductForm.get("auditConductAnswerId").updateValueAndValidity();
                if (this.questionDetail.masterQuestionTypeId == this.dateQuestionTypeId)
                    this.questionConductForm.get('questionOptionDate').setValue(this.questionDetail.questionResultDate);
                else if (this.questionDetail.masterQuestionTypeId == this.textQuestionTypeId)
                    this.questionConductForm.get('questionOptionDate').setValue(this.questionDetail.questionResultText);
                else if (this.questionDetail.masterQuestionTypeId == this.numericQuestionTypeId)
                    this.questionConductForm.get('questionOptionDate').setValue(this.questionDetail.questionResultNumeric);
                else if (this.questionDetail.masterQuestionTypeId == this.timeQuestionTypeId)
                    this.questionConductForm.get('questionOptionDate').setValue(this.questionDetail.questionResultTime);
            }
            this.updateStatusesPopover.open();
        }
        else
            this.loadStatus = false;
    }

    closeUpdateStatusPopover() {
        this.updateStatusesPopover.close();
        this.loadStatus = false;
        this.cdRef.markForCheck();
    }

    submitConductQuestion() {
        this.disableUpdate = true;
        let conductModel = new QuestionModel();
        conductModel = this.questionConductForm.value;
        conductModel.conductAnswerSubmittedId = this.questionDetail.conductAnswerSubmittedId;
        conductModel.conductId = this.questionDetail.conductId;
        conductModel.questionId = this.questionDetail.questionId;
        conductModel.auditConductQuestionId = this.questionDetail.auditConductQuestionId;
        conductModel.auditCategoryId = this.questionDetail.auditCategoryId;
        conductModel.questionOptionDate = null;
        conductModel.enableQuestionLevelWorkFlow = this.questionDetail.enableQuestionLevelWorkFlowInAudit;
        conductModel.questionWorkflowId = this.questionDetail.questionWorkflowId;
        if (this.questionDetail.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId) {
            conductModel.questionOptionDate = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetail.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId) {
            conductModel.questionOptionNumeric = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetail.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId) {
            conductModel.questionOptionText = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetail.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
            conductModel.questionOptionTime = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        }
        this.store.dispatch(new LoadInlineConductQuestionTriggered(conductModel));
    }

    checkSubmit() {
        if (this.questionDetail.masterQuestionTypeId == this.dropdownQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.booleanQuestionTypeId) {
            let value = this.questionConductForm.get('auditConductAnswerId').value;
            if (value)
                return false;
            else
                return true;
        } else if (this.questionDetail.masterQuestionTypeId == this.dateQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.numericQuestionTypeId ||
            this.questionDetail.masterQuestionTypeId == this.textQuestionTypeId || this.questionDetail.masterQuestionTypeId == this.timeQuestionTypeId) {
            let value = this.questionConductForm.get('questionOptionDate').value;
            if (value)
                return false;
            else
                return true;
        }
    }

    checkButtonDisabled() {
        this.questionConductForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    checkTitleTooltipStatus() {
        if (this.questionTitleStatus.nativeElement.scrollWidth > this.questionTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    initializeConductForm() {
        this.questionConductForm = new FormGroup({
            conductAnswerSubmittedId: new FormControl(null, []),
            auditConductAnswerId: new FormControl(null, Validators.compose([Validators.required])),
            questionId: new FormControl(null, []),
            conductId: new FormControl(null, []),
            questionTypeOptionId: new FormControl(null, []),
            answerComment: new FormControl(null, Validators.compose([Validators.maxLength(807)])),
            questionTypeOptionName: new FormControl(null, []),
            viewAnswerComment: new FormControl(false, []),
            timeStamp: new FormControl(null, []),
            questionOptionDate: new FormControl(null, Validators.compose([])),
        })
    }

    loadBugs() {
        let testCaseSearch = new QuestionModel();
        // testCaseSearch.questionId = this.questionDetail.questionId;
        testCaseSearch.auditConductQuestionId = this.questionDetail.auditConductQuestionId;
        // testCaseSearch.conductId = this.selectedConduct.conductId;
        this.store.dispatch(new LoadActionsByQuestionTriggered(testCaseSearch));
        this.scenarioBugs$ = this.store.pipe(select(auditModuleReducer.getActionListByQuestionId));
    }

    openBugsPopover(bugPopover) {
        this.loadBugs();
        this.loadActions = true;
        bugPopover.openPopover();
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    closeBugPopover() {
        this.loadActions = false;
        this.scenarioBugPopover.forEach((p) => p.closePopover());
    }

    truncateTextName(textName) {
        if (textName && textName.length > 10) {
            textName = textName.substring(0, 10) + "..."
        }
        return textName;
    }

    closeintime() {
        this.intimepicker = "";
    }

    closefromTime() {
        this.fromTimePicker = "";
    }

    goToProfilePage(userId) {
        this.router.navigateByUrl('dashboard/profile/' + userId + '/overview');
    }

    openArchiveActionPopover(data) {
        this.actionRequiredData = data;
        this.cdRef.markForCheck();
        this.deleteActionPopover.open();
      }

      closeDeleteActionPopover() {
        this.deleteOperationInProgress = false;
        this.disableActionDelete = false;
        this.actionRequiredData = null;
        this.deleteActionPopover.close();
        this.trigger.closeMenu();
        this.cdRef.markForCheck();
      }

      deleteSelectedAction() {
          this.deleteOperationInProgress = true;
          this.disableActionDelete = true;
          var action = Object.assign({},this.actionRequiredData);
          action.auditConductQuestionId = null;
          action.conductId = null;
          action.questionId = null;
          this.store.dispatch(new LoadConductActionTriggered(action));
      }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}