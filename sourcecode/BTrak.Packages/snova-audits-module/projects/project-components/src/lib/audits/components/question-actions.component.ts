import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from "../store/reducers/index";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from "underscore";

import * as auditModuleReducer from "../store/reducers/index";

// import { AppFeatureBaseComponent } from "../../../shared/components/featurecomponentbase";
import { QuestionModel } from "../models/question.model";

// import { AppBaseComponent } from "app/shared/components/componentbase";
import { QuestionActionTypes, LoadActionsByQuestionTriggered, LoadConductActionTriggered } from "../store/actions/questions.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { UserStory } from "../dependencies/models/userStory";
import { ProjectsService } from "../dependencies/services/Projects.service";
import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SatPopover } from "@ncstate/sat-popover";
@Component({
    selector: "question-actions",
    templateUrl: "question-actions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionActionsComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('addBugPopover') addBugsPopover;
    @ViewChild("bugTitle") bugTitleStatus: ElementRef;    
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    questions: any = [];
    isQuestioinLoading: boolean;
    latestChangedQuestionId: any;
    userStoryName: string;
    myControl = new FormControl();
    @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
    showLinkAction: boolean;
    createActionLink: FormGroup;
    isButtonDisabled: boolean;
    userStories: any;
    addOp: boolean;
    actionRequiredData: any;
    @ViewChild("deleteAction") deleteActionPopover: SatPopover;
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    disableActionDelete: boolean;
    deleteOperationInProgress: boolean;
    allActions: any[] = [];
    @Input("question")
    set _question(data: any) {
        if (data) {
            this.question = data;
            this.loadActions();
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isConductArchived = false;
            else
                this.isConductArchived = true;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
        }
    }

    userStoryBugs$: Observable<QuestionModel[]>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    userStoryData: any;
    question: any;
    selectedConduct: any;
    selectedCaseId: string;
    actionsCount: number = 0;
    showBugs: boolean;
    fromProjects: boolean;
    showTitleTooltip: boolean = false;
    loadBug: boolean = false;
    isBugFromTestRail: boolean = false;
    isConductArchived: boolean = false;
    isConductSubmitted: boolean = false;
    isConductEditable: boolean = false;
    isBugFromUserStory: boolean = true;
    canAddAction: boolean = false;
    isSprintUserStories: boolean;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress: boolean;
    linkUserStoryId: any;
    canLinkAction: any;
    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private projectService: ProjectsService) {
        super();

        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
        this.canAddAction = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAuditAction.toString().toLowerCase(); }) != null;
        this.canLinkAction = _.find(roles, function(role: any) {return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_LinkAndUnlinkActionsToQuestion.toString().toLowerCase(); }) != null;
        this.cdRef.markForCheck();
        

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getActionsByQuestionIdLoading));
        this.selectedCaseId = null;

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadActionsByQuestionCompleted),
            tap(() => {
                this.userStoryBugs$ = this.store.pipe(select(auditModuleReducer.getActionListByQuestionId));
                this.userStoryBugs$.subscribe(result => {
                    this.actionsCount = result.length;
                    if (this.actionsCount == 0)
                        this.showBugs = false;
                    else
                        this.showBugs = true;
                    this.cdRef.markForCheck();
                });
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductActionCompleted),
                tap(() => {
                    this.loadActions();
                    this.showActionInput();
                    this.addOp = false;
                    this.clearForm();
                    this.isButtonDisabled = false;
                    this.showLinkAction = false;
                    this.closeDeleteActionPopover();
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchAllUserStories();
    }

    loadActions() {
        let testCaseSearch = new QuestionModel();
        testCaseSearch.auditConductQuestionId = this.question.auditConductQuestionId;
        // testCaseSearch.conductId = this.selectedConduct.questionId;
        testCaseSearch.isArchived = false;
        this.store.dispatch(new LoadActionsByQuestionTriggered(testCaseSearch));
        this.userStoryBugs$ = this.store.pipe(select(auditModuleReducer.getActionListByQuestionId));
    }

    checkTitleTooltipStatus() {
        if (this.bugTitleStatus.nativeElement.scrollWidth > this.bugTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    openBugPopover(addBugPopover) {
        this.loadBug = true;
        addBugPopover.openPopover();
    }

    closeBugPopover() {
        this.loadBug = false;
        this.addBugsPopover.forEach((p) => p.closePopover());
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    searchAllUserStories() {
        this.anyOperationInProgress = true;
        let userStory = new UserStory();
        userStory.isArchived = false;
        userStory.isAction = true;
        userStory.isExcludeOtherUs = true;
        userStory.isIncludeUnAssigned = true
        userStory.projectId = this.selectedConduct.projectId;
        userStory.searchText = null;
        this.projectService.searchAllWorkItems(userStory)
            .subscribe((result: any) => {
                this.anyOperationInProgress = false;
                this.allActions = result.data;
                this.cdRef.markForCheck();
            })
    }


    searchUserStories(userStoryName) {
        const searchText = this.createActionLink.value.userStoryName;
        this.isButtonDisabled = true;
        this.anyOperationInProgress = true;
        let userStory = new UserStory();
        userStory.isArchived = false;
        userStory.isAction = true;
        userStory.isExcludeOtherUs = true;
        userStory.isIncludeUnAssigned = true
        userStory.projectId = this.selectedConduct.projectId;
        userStory.searchText = searchText;
        this.projectService.searchAllWorkItems(userStory)
            .subscribe((result: any) => {
                this.isButtonDisabled = false;
                this.anyOperationInProgress = false;
                this.userStories = result.data;
                this.cdRef.markForCheck();
            })
    }

    onChangeUserStoryId(linkUserStoryId) {
        const userStoryDetails = this.userStories.find((userStory) => userStory.userStoryId === linkUserStoryId);
        if (userStoryDetails) {
            this.createActionLink.controls["linkUserStoryId"].setValue(linkUserStoryId);
            this.isButtonDisabled = false;
            this.linkUserStoryId = linkUserStoryId;
        } else {
            this.createActionLink.controls["linkUserStoryId"].setValue("");
            this.isButtonDisabled = true;
            this.linkUserStoryId = "";
        }
    }

    closeSearchUserStories() {
        this.userStoryName = "";
        this.createActionLink.controls["userStoryName"].setValue("");
        this.formGroupDirective.reset();
        this.searchUserStories(this.userStoryName);
    }

    displayFn(userStoryId) {
        if (!userStoryId) {
            return "";
        } else {
            const userStoryDetails = this.userStories.find((userStory) => userStory.userStoryId === userStoryId);
            return userStoryDetails.userStoryName;
        }
    }

    showActionInput() {
        this.clearForm();
        this.isButtonDisabled = false;
        this.showLinkAction = !this.showLinkAction;
    }

    clearForm() {
        this.createActionLink = new FormGroup({
            linkUserStoryId: new FormControl(""),
            userStoryName: new FormControl(""),
            //linkUserStoryTypeId: new FormControl("", [Validators.required])
        });
    }

    saveActionLink() {
        this.addOp = true;
        this.isButtonDisabled = true;
        const userStory = this.userStories.find(u => u.userStoryId == this.linkUserStoryId);
        if(userStory && this.linkUserStoryId) {
            userStory.auditConductQuestionId = this.question.auditConductQuestionId;
            userStory.conductId = this.question.conductId;
            userStory.questionId = this.question.questionId;
            userStory.auditProjectId = this.selectedConduct.projectId;
        } else {
            userStory.auditConductQuestionId = null;
            userStory.conductId = this.question.conductId;
            userStory.questionId = null;
        }
        this.store.dispatch(new LoadConductActionTriggered(userStory));
    }

    openArchiveActionPopover(data) {
        this.actionRequiredData = this.allActions.length > 0 ? this.allActions.find(x => x.userStoryId.toLowerCase() == data.userStoryId.toLowerCase()) : data;
        this.cdRef.markForCheck();
        this.deleteActionPopover.open();
      }

      closeDeleteActionPopover() {
        this.deleteOperationInProgress = false;
        this.disableActionDelete = false;
        this.actionRequiredData = null;
        this.deleteActionPopover ? this.deleteActionPopover.isOpen() ? this.deleteActionPopover.close() : null : null;
        this.trigger.closeMenu();
        this.cdRef.markForCheck();
      }

      deleteSelectedAction() {
          this.deleteOperationInProgress = true;
          this.disableActionDelete = true;
          var action = Object.assign({},this.actionRequiredData);
          action.auditConductQuestionId = null;
          action.conductId = this.question.conductId;
          action.questionId = this.question.questionId;
          action.auditProjectId = this.selectedConduct.projectId;
          action.unLinkActionId = this.actionRequiredData.auditConductQuestionId;
          this.store.dispatch(new LoadConductActionTriggered(action));
      }
}