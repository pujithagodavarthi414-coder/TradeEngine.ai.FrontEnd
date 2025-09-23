import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GoalSearchCriteriaApiInputModel } from '../dependencies/models/goalSearchInput';
import { State } from "../store/reducers/index";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

import { UserStory } from '../dependencies/models/userStory';
import { Branch } from '../dependencies/models/branch';
import { AssetService } from '../dependencies/services/assets.service';
import { EmployeeListModel } from '../dependencies/models/employee-model';
import { EmployeeService } from '../dependencies/services/employee-service';
import { LoadBugPriorityTypesTriggered } from '../dependencies/project-store/actions/bug-priority.action';
import { UserService } from '../dependencies/services/user.Service';
import { BugPriorityDropDownData } from '../dependencies/models/bugPriorityDropDown';
import { QuestionActionTypes, LoadConductActionTriggered } from '../store/actions/questions.actions';
import { ProjectsService } from '../dependencies/services/Projects.service';
import { AuditService } from '../services/audits.service';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { ProjectGoalsService } from '../dependencies/services/goals.service';
import { UserstoryTypeModel } from '../dependencies/models/user-story-type-model';
import * as auditModuleReducer from "../store/reducers/index";
import { ActionCategory } from '../models/action-category.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'conduct-question-action',
    templateUrl: 'conduct-question-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductQuestionActionComponent {
    @Output() closeAction = new EventEmitter<any>();

    @Input("questionData")
    set _questionData(data: any) {
        if (data) {
            this.questionData = data;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            this.projectId = this.selectedConduct.projectId;
            this.getUserList();
        }
    }

    @Input("loadBugs")
    set _loadBugs(data: any) {
        if (data || data == false) {
            this.loadBugs = data;
        }
        else {
            this.loadBugs = false;
        }
        this.initializeBugForm();
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    bugPriorities$: Observable<BugPriorityDropDownData[]>;
    isQuestioinLoading: boolean;
    public ngDestroyed$ = new Subject();
    questionName: string;
    questions: any;
    userStoryScenarioBugForm: FormGroup;

    goalsList = [];
    branchList = [];
    userList = [];
    userStoryTypes = [];
    actionCategories = [];

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    selectedConduct: any;
    questionData: any;
    userStoryData: any;
    usersList: any;
    isValidation: boolean;
    estimatedTime: string;
    projectId: string;
    selectedMember: string;
    bugBoardId: string = "true";
    bugFormDisabled: boolean = false;
    isSprintUserStories: boolean;
    loadBugs: boolean = false;
    minDate = new Date();
    linkconductQuestionId: any;
    constructor(private store: Store<State>, private route: ActivatedRoute, private routes: Router, private actionUpdates$: Actions, private auditService: AuditService, private employeeService: EmployeeService, private userService: UserService, private assetService: AssetService, private masterDataProjectsService: ProjectsService, private cdRef: ChangeDetectorRef, private goalsService: ProjectGoalsService) {
        this.route.params.subscribe(routeParams => {
            if (this.routes.url.includes('projects/projectstatus')) {
                this.projectId = routeParams.id;
                this.getUserList();
            }
        });

        this.searchUserStoryTypes();
        this.getActionCategories();
        // this.getBranchList();
        // this.loadGoals();
        // this.store.dispatch(new LoadBugPriorityTypesTriggered());

        // this.bugPriorities$ = this.store.pipe(select(auditModuleReducer.getBugPriorityAll));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductActionCompleted),
                tap(() => {
                    this.bugFormDisabled = false;
                    this.closeAction.emit('');
                    this.initializeBugForm();
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.QuestionFailed),
                tap(() => {
                    this.bugFormDisabled = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        this.store.dispatch(new LoadBugPriorityTypesTriggered());
        this.bugPriorities$ = this.store.pipe(select(auditModuleReducer.getBugPriorityAll));
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadGoals() {
        let searchGoals = new GoalSearchCriteriaApiInputModel();
        searchGoals.isBugBoard = true;
        searchGoals.goalStatusId = ConstantVariables.ActiveGoalStatusId;
        this.goalsService.searchGoals(searchGoals).subscribe((response: any) => {
            this.goalsList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getBranchList() {
        let branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.assetService.getBranchList(branchSearchResult).subscribe((response: any) => {
            this.branchList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getUserList() {
        let userModel = new EmployeeListModel();
        userModel.isArchived = false;
        userModel.isActive = true;
        userModel.sortBy = "FirstName";
        userModel.sortDirectionAsc = true;
        // this.employeeService.getAllEmployees(userModel).subscribe((response: any) => {
        this.employeeService.getAllProjectMembers(this.projectId).subscribe((response: any) => {
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

    getActionCategories() {
        let category = new ActionCategory();
        category.isArchived = false;
        this.auditService.getActionCategories(category).subscribe((result: any) => {
            if (result.success && result.data && result.data.length > 0) {
                this.actionCategories = result.data;
                this.cdRef.detectChanges();
            }
            else {
                this.actionCategories = [];
                this.cdRef.markForCheck();
            }
        })
    }

    getAssigneeValue(selectedEvent) {
        let usersList = this.userList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.projectMember.id == selectedEvent;
        });
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
            this.cdRef.markForCheck();
        }
    }

    addBugToUserStory() {
        this.bugFormDisabled = true;
        let userStoryDetails = new UserStory();
        var selectUserStoryType = this.userStoryTypes.find(x => x.isAction == true);
        selectUserStoryType == null ? this.userStoryTypes.find(x => x.userStoryTypeName.toLowerCase() == "action") : selectUserStoryType;
        userStoryDetails = this.userStoryScenarioBugForm.value;
        // userStoryDetails.bugCausedUserId = userStoryDetails.ownerUserId;
        if (this.questionData) {
            userStoryDetails.questionId = this.questionData.questionId;
            userStoryDetails.auditConductQuestionId = this.questionData.auditConductQuestionId;
            userStoryDetails.conductId = this.selectedConduct.conductId;
        } else if (this.userStoryScenarioBugForm.value.linkconductQuestionId) {
            const questionDetails = this.questions.find((question) => question.conductQuestionId === this.userStoryScenarioBugForm.value.linkconductQuestionId);
            userStoryDetails.questionId = questionDetails.questionId;
            userStoryDetails.auditConductQuestionId = questionDetails.conductQuestionId;
            userStoryDetails.conductId = questionDetails.conductId;
        }
        else {
            userStoryDetails.isAction = true;
        }
        userStoryDetails.userStoryTypeId = (selectUserStoryType != undefined && selectUserStoryType != null) ? selectUserStoryType.userStoryTypeId : null;
        userStoryDetails.loadBugs = this.loadBugs;
        userStoryDetails.auditProjectId = this.projectId;
        this.store.dispatch(new LoadConductActionTriggered(userStoryDetails));
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    closeActionDialog() {
        this.closeAction.emit('');
    }

    checkDisabled() {
        this.userStoryScenarioBugForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    initializeBugForm() {
        this.selectedMember = null;
        this.userStoryScenarioBugForm = new FormGroup({
            userStoryName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)])),
            viewDescription: new FormControl(false, []),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)])),
            estimatedTime: new FormControl(null, []),
            deadLineDate: new FormControl(null, Validators.compose([Validators.required])),
            branchId: new FormControl(null, []),
            ownerUserId: new FormControl(null, Validators.compose([Validators.required])),
            goalId: new FormControl(null, []),
            bugPriorityId: new FormControl(null, Validators.compose([Validators.required])),
            isForQa: new FormControl(false, []),
            actionCategoryId: new FormControl(null, []),
            conductQuestionName: new FormControl(""),
            linkconductQuestionId: new FormControl("")
        });
    }

    searchUserStoryTypes() {
        var userStoryTypeModel = new UserstoryTypeModel();
        userStoryTypeModel.isArchived = false;
        this.masterDataProjectsService.SearchUserStoryTypes(userStoryTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userStoryTypes = response.data;
            }
        });
    }

    searchQuestions(questionName) {
        this.isQuestioinLoading = true;
        const searchText = this.userStoryScenarioBugForm.value.conductQuestionName;
        this.questionName = searchText;
        this.auditService.getConductQuestionsforActionLinking(this.projectId, this.questionName)
            .subscribe((res: any) => {
                this.isQuestioinLoading = false;
                this.questions = res.data;
                this.cdRef.markForCheck();
            })
    }

    onChangeQuestion(linkconductQuestionId) {
        const questionDetails = this.questions.find((question) => question.conductQuestionId === linkconductQuestionId);
        if (questionDetails) {
            this.userStoryScenarioBugForm.controls["linkconductQuestionId"].setValue(linkconductQuestionId);
            this.bugFormDisabled = false;
            this.linkconductQuestionId = linkconductQuestionId;
        } else {
            this.userStoryScenarioBugForm.controls["linkconductQuestionId"].setValue("");
            this.bugFormDisabled = true;
            this.linkconductQuestionId = "";
        }
    }

    closeSearchQuestions() {
        this.questionName = "";
        this.userStoryScenarioBugForm.controls["conductQuestionName"].setValue("");
        //this.formGroupDirective.reset();
        this.searchQuestions(this.questionName);
    }

    displayFn(conductQuestionId) {
        if (!conductQuestionId) {
            return "";
        } else {
            const questionDetails = this.questions.find((question) => question.conductQuestionId === conductQuestionId);
            return questionDetails.questionName;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}




