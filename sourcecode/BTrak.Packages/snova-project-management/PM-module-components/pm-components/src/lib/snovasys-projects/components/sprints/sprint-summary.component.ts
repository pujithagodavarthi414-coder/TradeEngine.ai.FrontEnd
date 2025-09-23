import { ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import * as _ from "underscore";
import { ArchiveSprintsTriggered, SprintActionTypes, SprintStartTriggered, GetSprintsByIdTriggered } from "../../store/actions/sprints.action";
import { Observable, Subject, combineLatest } from "rxjs";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoadBoardTypesTriggered } from "../../store/actions/board-types.action";
import { TranslateService } from "@ngx-translate/core";
import { LoadBoardTypesApiTriggered } from "../../store/actions/board-types-api.action";

import { SprintWorkItemActionTypes } from "../../store/actions/sprint-userstories.action";
import { UserStory } from "../../models/userStory";
import { ProjectMember } from "../../models/projectMember";
import { ToastrService } from "ngx-toastr";
import { WorkItemUploadPopupComponent } from "../dialogs/work-item-upload.component";
import * as FileSaver from 'file-saver';
import { ProjectGoalsService } from "../../services/goals.service";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";

import { Router } from "@angular/router";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { TestSuiteList } from '../../models/testsuite';
import { LoadTestSuiteListTriggered } from "@snovasys/snova-testrepo";
import * as testRailModuleReducers from "@snovasys/snova-testrepo"
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as  XLSX from "xlsx";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { ProjectFeature } from '../../models/projectFeature';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { LoadBugPriorityTypesTriggered } from '../../store/actions/bug-priority.action';
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';
import { DatePipe } from "@angular/common";
@Component({
    selector: "app-sprint-summary",
    templateUrl: "sprint-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(document:click)": "onClick($event)"
    }
})

export class SprintSummaryComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("sprint")
    set _sprint(data: SprintModel) {
        this.sprint = data;
        this.projectId = this.sprint.projectId;
        this.isBugFilters = this.sprint.isBugBoard;
        if (this.isBugFilters) {
            this.LoadProjectFeature();
            this.store.dispatch(new LoadBugPriorityTypesTriggered());
        }
    }
    @Input("treeStructure")
    set _treeStructure(data: boolean) {
        this.treeStructure = data;
    }
    @Input("selectedSprintId")
    set _selectedSprintId(data: boolean) {
        this.selectedSprintId = data;
    }
    @Input("showHeader")
    set _showHeader(data: boolean) {
        this.showHeader = data;
    }
    @Output() toggleTreeStructure = new EventEmitter<string>();
    @Output() selectedSprint = new EventEmitter<string>();
    @Output() saveMultipleUserStories = new EventEmitter<UserStory>();
    @ViewChild("deleteSprintPopover") deleteSprintPopUp: SatPopover;
    @ViewChild("editSprintPopover") editSprintPopUp: SatPopover;
    @ViewChild("startSprintPopover") startSprintPopUp: SatPopover;
    @ViewChild("updateAssigneePopover") updateAssigneePopUP: SatPopover;
    @ViewChild("updateEstimatedTimePopover") updateEStimatedTimePopUp: SatPopover;
    @ViewChild("fileInput") fileInput: ElementRef;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    projectMembers$: Observable<ProjectMember[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    projectFeature$: Observable<ProjectFeature[]>;
    projectFeatures: ProjectFeature[];
    bugPriorities$: Observable<BugPriorityDropDownData[]>;
    bugPriorities: BugPriorityDropDownData[];
    softLabels: SoftLabelConfigurationModel[];
    sprintArchiveOperationInProgress$: Observable<boolean>;
    sprintOperationInProgress$: Observable<any>;
    startSprintOperationInProgress$: Observable<boolean>;
    createUserstoryinProgress$: Observable<boolean>;
    projectMembers: ProjectMember[];
    sprintStartForm: FormGroup;
    assigneeForm: FormGroup;
    estimatedTimeForm: FormGroup;
    sprint: SprintModel;
    sprintModel: SprintModel;
    contextMenuPosition = { x: "0px", y: "0px" };
    estimatedTime: any;
    selectedMember: string;
    toggleSprintId: string;
    defaultProfileImage: string = "assets/images/faces/18.png";
    isListView: boolean;
    selectedSprintId: boolean;
    treeStructure: boolean;
    isBugFilters: boolean;
    isAssigneeDialog: boolean;
    isEstimatedTimeDialog: boolean;
    clearFormValue: boolean;
    userStoriesCount: number;
    downloadInProgress: boolean;
    toggle: boolean;
    isEditSprint: boolean;
    showHeader: boolean;
    minDate: Date;
    projectId: string;
    boardView = BoardTypeIds.BoardViewKey;
    boardTypeTooltipText: any;
    isDescriptionValidation: boolean;
    public ngDestroyed$ = new Subject();
    accessUploadIcons: Boolean;
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    userStoryTypes: UserStoryTypesModel[];

    constructor(private store: Store<State>, private actionUpdates$: Actions, private translateService: TranslateService,
        private toastr: ToastrService, private testRailStore: Store<testRailModuleReducers.State>
        , private ProjectGoalsService: ProjectGoalsService
        , private dialog: MatDialog
        ,private datePipe: DatePipe
        , private router: Router) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.ArchiveSprintsCompleted),
                tap(() => {
                    this.closeArchivePopup();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.SprintStartCompleted),
                tap(() => {
                    this.cancelStartSprintPopup();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted),
                tap(() => {
                    if (this.isAssigneeDialog) {
                        this.closeAssigneeDialog();
                    } else if (this.isEstimatedTimeDialog) {
                        this.closeEstimatedTimeDialog();
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
                tap(() => {
                    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));
                    this.userStoryTypes$.subscribe(x => this.userStoryTypes = x);
                })
            )
            .subscribe();


    }
    ngOnInit() {
        super.ngOnInit();
        this.searchUserStoryTypes();
        this.clearStartSprintsForm();
        this.clearAssigneeForm();
        this.clearEstimatedTimeForm();
        this.bugPriorities$ = this.store.pipe(
            select(projectModuleReducers.getBugPriorityAll),
            tap((priority) => {
                this.bugPriorities = priority;
            })
        );
        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll),
            tap((types) => {
                this.userStoryTypes = types;
            })
        );
        this.sprintArchiveOperationInProgress$ = this.store.pipe(select(projectModuleReducers.deleteSprintLoading));
        this.startSprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.sprintStartLoading));
        this.createUserstoryinProgress$ = this.store.pipe(select(projectModuleReducers.creatingUserstorySprint));
        const sprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.upsertSprintsLoading));
        const boardTypesOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getBoardTypesLoading));
        const boardTypeApiOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getBoardTypesApiLoading));
        const testSuiteOperationInProgress$ = this.testRailStore.pipe(select(testRailModuleReducers.getTestSuitesListLoading));


        this.sprintOperationInProgress$ = combineLatest(
            sprintOperationInProgress$,
            boardTypesOperationInProgress$,
            boardTypeApiOperationInProgress$,
            testSuiteOperationInProgress$
        ).pipe(
            map(
                ([
                    upsertSprintsLoading,
                    getBoardTypesLoading,
                    getBoardTypesApiLoading,
                    getTestSuitesListLoading
                ]) =>
                    upsertSprintsLoading ||
                    getBoardTypesLoading ||
                    getBoardTypesApiLoading ||
                    getTestSuitesListLoading
            )
        );

        this.projectMembers$ = this.store.pipe(select(projectModuleReducers.getProjectMembersAll));
        this.projectMembers$.subscribe((x) => this.projectMembers = x);

        this.getSoftLabelConfigurations();
        let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures))
        this.accessUploadIcons = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemUpload.toString().toLowerCase(); }) != null;
    }

    LoadProjectFeature() {
        const projectFeature = new ProjectFeature();
        projectFeature.projectId = this.projectId;
        projectFeature.IsDelete = false;
        this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
        this.projectFeature$ = this.store.pipe(
            select(projectModuleReducers.getProjectFeaturesAll),
            // tslint:disable-next-line: no-shadowed-variable
            tap((projectFeature) => {
                this.projectFeatures = projectFeature;
            })
        );
    }


    navigateToSprintsPage() {
        this.router.navigate([
            "projects/sprint",
            this.sprint.sprintId
        ]);
    }

    searchUserStoryTypes() {
        const userStoryTypesModel = new UserStoryTypesModel();
        userStoryTypesModel.isArchived = false;
        this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))
    }

    checkpermissionForSprints() {
        if (this.toggleSprintId == this.sprint.sprintId) {
            return true;
        } else {
            return false;
        }
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    toggleUserStories() {
        this.treeStructure = !this.treeStructure;
        this.toggleSprintId = this.sprint.sprintId;
        this.toggleTreeStructure.emit(this.sprint.sprintId);
    }

    openContextMenu(event: MouseEvent) {
        event.preventDefault();
        const contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            console.log(event);
            this.contextMenuPosition.x = (event.clientX) + "px";
            this.contextMenuPosition.y = (event.clientY - 30) + "px";
            contextMenu.openMenu();
            this.selectedSprint.emit(this.sprint.sprintId);
        }
    }

    boardTypeTooltip(boardTypeId) {
        if (!boardTypeId) {
            return "";
        }

        if (boardTypeId.toUpperCase() === BoardTypeIds.KanbanBugsKey) {
            this.boardTypeTooltipText = this.translateService.instant("BUGBOARD");
        }
        if (boardTypeId.toUpperCase() === BoardTypeIds.KanbanKey) {
            this.boardTypeTooltipText = this.translateService.instant("KANBAN");
        }
        if (boardTypeId.toUpperCase() === BoardTypeIds.SuperAgileKey) {
            this.boardTypeTooltipText = this.translateService.instant("SUPERAGILE");
        }
        if (boardTypeId.toUpperCase() === BoardTypeIds.ApiKey) {
            this.boardTypeTooltipText = this.translateService.instant("APIBOARD");
        }
    }

    checkTooltip(goal) {
        if (goal.boardTypeUiId == BoardTypeIds.BoardViewKey.toLowerCase()) {
            if (goal.isBugBoard) {
                return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWBUGSTOOLTIP")
            } else {
                if (goal.isSuperAgileBoard) {
                    return this.translateService.instant("SPRINTS.SPRINTLISTVIEWTOOLTIP")
                } else {
                    return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWTOOLTIP")
                }
            }
        } else {
            if (goal.isBugBoard) {
                return this.translateService.instant("SPRINTS.SPRINTLISTVIEWBUGSTOOLTIP")
            } else {
                if (goal.isSuperAgileBoard) {
                    return this.translateService.instant("SPRINTS.SPRINTLISTVIEWTOOLTIP")
                } else {
                    return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWTOOLTIP")
                }
            }
        }
    }

    deleteSprint() {
        var sprintModel = new SprintModel();
        sprintModel.sprintId = this.sprint.sprintId;
        sprintModel.isArchived = true;
        sprintModel.timeStamp = this.sprint.timeStamp;
        sprintModel.sprintName = this.sprint.sprintName;
        sprintModel.projectId = this.sprint.projectId;
        sprintModel.description = this.sprint.description;
        sprintModel.sprintStartDate = this.sprint.sprintStartDate;
        sprintModel.sprintEndDate = this.sprint.sprintEndDate;
        sprintModel.isReplan = this.sprint.isReplan;
        sprintModel.boardTypeId = this.sprint.boardTypeId;
        sprintModel.testSuiteId = this.sprint.testSuiteId;
        sprintModel.boardTypeApiId = this.sprint.boardTypeApiId;
        sprintModel.version = this.sprint.version;
        sprintModel.sprintResponsiblePersonId = this.sprint.sprintResponsiblePersonId;
        this.store.dispatch(new ArchiveSprintsTriggered(sprintModel));
    }

    closeArchivePopup() {
        this.deleteSprintPopUp.close();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
        }
    }

    closeSprintPopup() {
        this.editSprintPopUp.close();
        this.isEditSprint = !this.isEditSprint;
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
        }
    }

    clearStartSprintsForm() {
        this.sprintStartForm = new FormGroup({
            sprintStartDate: new FormControl('', Validators.compose([Validators.required])),
            sprintEndDate: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    startSprint() {
        this.isListView = this.sprint.isSuperAgileBoard ? true : false;
        if (this.isListView) {
            if (this.sprint.userStoriesCount == 0) {
                this.toastr.warning("", this.translateService.instant(ConstantVariables.UserStoriesCountForGoalApproval));
            }
            else if (this.sprint.isWarning) {
                this.toastr.warning("", this.translateService.instant('SPRINTS.PLEASEADDESTIMATEDTIMEFORSPRINTWORKITEM'))
            } else {
                this.startSprinttoActive();
            }
        } else {
            this.startSprinttoActive();
        }
    }


    startSprinttoActive() {
        this.sprintModel = this.sprintStartForm.value;
        this.sprintModel.sprintId = this.sprint.sprintId;
        this.sprintModel.timeStamp = this.sprint.timeStamp;
        this.sprintModel.projectId = this.sprint.projectId;
        this.sprintModel.sprintName = this.sprint.sprintName;
        this.sprintModel.sprintStartDatedeadLine =this.covertTimeIntoUtcTime(this.sprintModel.sprintStartDate);
        this.sprintModel.sprintStartDatetimeZoneOffSet = (-(new Date(this.sprint.sprintStartDate).getTimezoneOffset()));
        this.sprintModel.sprintEndDatedeadLine =this.covertTimeIntoUtcTime(this.sprintModel.sprintEndDate);
        this.sprintModel.sprintEndDatetimeZoneOffSet = (-(new Date(this.sprint.sprintEndDate).getTimezoneOffset()));
        this.sprintModel.description = this.sprint.description;
        this.sprintModel.isReplan = this.sprint.isReplan;
        this.sprintModel.boardTypeId = this.sprint.boardTypeId;
        this.sprintModel.testSuiteId = this.sprint.testSuiteId;
        this.sprintModel.boardTypeApiId = this.sprint.boardTypeApiId;
        this.sprintModel.version = this.sprint.version;
        this.sprintModel.sprintResponsiblePersonId = this.sprint.sprintResponsiblePersonId;
        this.store.dispatch(new SprintStartTriggered(this.sprintModel));
    }
    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
          return null;
        return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
      }
    editSprintForm() {
        this.store.dispatch(new LoadBoardTypesTriggered());
        this.store.dispatch(new LoadBoardTypesApiTriggered());
        this.store.dispatch(new LoadMemberProjectsTriggered(this.sprint.projectId));
        const testsuite = new TestSuiteList();
        testsuite.projectId = this.sprint.projectId;
        testsuite.isArchived = false;
        this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));

        this.isEditSprint = !this.isEditSprint;
    }


    onClick(event) {
        if (this.selectedSprintId) {
            this.selectedSprintId = false;
        }
    }

    cancelStartSprintPopup() {
        this.startSprintPopUp.close();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
        }
    }

    changeStartDate() {
        this.minDate = this.sprintStartForm.value.sprintStartDate;
    }

    clearAssigneeForm() {
        this.selectedMember = null;
        this.assigneeForm = new FormGroup({
            ownerUserId: new FormControl("", [])
        });
    }


    clearEstimatedTimeForm() {
        this.estimatedTime = null;
        this.clearFormValue = true;
        this.estimatedTimeForm = new FormGroup({
            estimatedTime: new FormControl("", [])
        });
    }


    getAssigneeValue(selectedEvent) {
        const projectMembers = this.projectMembers;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.find(projectMembers, function (member) {
            return member.projectMember.id === selectedEvent;
        })
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
        }
    }

    updateAssigneeForMultipleUserStories() {
        this.isAssigneeDialog = true;
        this.isEstimatedTimeDialog = false;
        let userStoryModel = new UserStory();
        userStoryModel = this.assigneeForm.value;
        userStoryModel.sprintId = this.sprint.sprintId;
        this.saveMultipleUserStories.emit(userStoryModel);
    }


    updateEstimatedTimeForMultipleUserStories() {
        this.isAssigneeDialog = false;
        this.isEstimatedTimeDialog = true;
        let userStoryModel = new UserStory();
        userStoryModel = this.estimatedTimeForm.value;
        userStoryModel.estimatedTime = Number(this.estimatedTime);
        userStoryModel.sprintId = this.sprint.sprintId;
        this.saveMultipleUserStories.emit(userStoryModel);
    }


    closeAssigneeDialog() {
        let popOver = this.updateAssigneePopUP;
        if (popOver) {
            popOver.close();
        }
    }

    changeEstimatedTime(estimatedTime) {
        this.estimatedTime = estimatedTime;
    }


    closeEstimatedTimeDialog() {
        this.estimatedTime = null;
        let popOver = this.updateEStimatedTimePopUp;
        if (popOver) {
            popOver.close();
        }
    }

    setPaddingForSprints() {
        if (this.sprint.sprintResponsiblePersonId) {
            return "margin-top-unique"
        } else {
            return "margin-top-uniquename"
        }
    }



    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    uploadEventHandler(file, event) {

        if (file != null) {
            //var XLSX = require('xlsx');
            var reader = new FileReader();

            let allProjectMembers = this.projectMembers;
            let allUserStoryTypes = this.userStoryTypes;
            let allBugPriorityTypes = this.bugPriorities;
            let allProjectFeatures = this.projectFeatures;

            let dialog = this.dialog;
            let sprintId = this.sprint.sprintId
            let projectId = this.sprint.projectId;
            let fileTemInput = this.fileInput;
            let isBugFilters = this.isBugFilters;
            let store = this.store;
            reader.onload = function (e: any) {

                let uploadedData = [];
                var bstr = (e != undefined && e.target != undefined) ? e.target.result : "";
                var workBook = XLSX.read(bstr, { type: 'binary' });
                var shtData = workBook.Sheets[workBook.SheetNames[0]];
                var sheetData;
                if (isBugFilters) {
                    sheetData = XLSX.utils.sheet_to_json(shtData, {
                        header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "StoryPoints", "BugPriority", "ProjectComponent", "BugCausedUser", "Version"], raw: false, defval: ''
                    });
                } else {
                    sheetData = XLSX.utils.sheet_to_json(shtData, {
                        header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "StoryPoints", "StoryPoints"], raw: false, defval: ''
                    });
                }
                sheetData.forEach(function (item: any, index) {

                    if (index > 0) {

                        var isAssigneeValid, isItemTypeValid, isBugPriorityTypeValid, isProjectFeatureValid, isBugCausedUserValid;

                        var errorMessage = [];
                        var warningMessage = [];
                        var isWorkitemValid = true;

                        if (item.WorkItem.trim() == "") {
                            errorMessage.push(" The Work item is required.");
                            isWorkitemValid = false;
                        }
                        if (item.WorkItem.length > 800) {
                            errorMessage.push("Work item name cannot exceed 800 characters");
                            isWorkitemValid = false;
                        }

                        if (item.Assignee.toLowerCase().trim() != "") {
                            isAssigneeValid = _.find(allProjectMembers, function (member) {
                                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.Assignee.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isAssigneeValid == undefined) {
                                warningMessage.push(" Given assignee is invalid.");
                            }
                        }

                        if (item.WorkItemType.toLowerCase().trim() != "") {
                            isItemTypeValid = _.find(allUserStoryTypes, function (itemtype) {
                                return itemtype.userStoryTypeName.toLowerCase().trim().replace(/\s/g, '') == item.WorkItemType.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isItemTypeValid == undefined) {
                                warningMessage.push(" Given Work item type is invalid.");
                            }
                        }

                        if (isNaN(Number(item.EstimatedTime.trim()))) {
                            warningMessage.push(" The estimated time is in wrong format.");
                            item.EstimatedTime = null;
                        }
                        else
                            item.EstimatedTime = Number(item.EstimatedTime.trim());

                        if (isNaN(Number(item.StoryPoints && item.StoryPoints.trim()))) {
                            warningMessage.push(" The story points is in wrong format.");
                            item.StoryPoints = null;
                        }
                        else
                            item.StoryPoints = Number(item.StoryPoints.trim());

                        // Check for bug priority
                        if (item.BugPriority && isBugFilters) {
                            isBugPriorityTypeValid = _.find(allBugPriorityTypes, function (itemtype) {
                                return itemtype.priorityName.toLowerCase().trim().replace(/\s/g, '') == item.BugPriority.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isBugPriorityTypeValid == undefined) {
                                warningMessage.push(" Given bug priority is invalid.");

                            }
                        }
                        // Check for project feature
                        if (item.ProjectComponent && isBugFilters) {
                            isProjectFeatureValid = _.find(allProjectFeatures, function (itemtype) {
                                return itemtype.projectFeatureName.toLowerCase().trim().replace(/\s/g, '') == item.ProjectComponent.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isProjectFeatureValid == undefined) {
                                warningMessage.push(" Given project component is invalid.");

                            }
                        }

                        // Check for bug caused user
                        if (item.BugCausedUser && isBugFilters) {
                            isBugCausedUserValid = _.find(allProjectMembers, function (member) {
                                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.BugCausedUser.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isBugCausedUserValid == undefined) {
                                warningMessage.push(" Given bug caused user is invalid.");

                            }
                        }

                        // Check for Version
                        if (item.Version && item.Version.trim() && isBugFilters) {
                        }

                        if (errorMessage.length > 0) {
                            isWorkitemValid = false;
                        } else {
                            isWorkitemValid = true;
                        }

                        var workItemObj = {
                            isWorkitemValid: isWorkitemValid,
                            userStoryName: item.WorkItem.trim(),
                            sprintId: sprintId,
                            projectId: projectId,
                            ownerUserId: isAssigneeValid != undefined ? isAssigneeValid.projectMember.id : "",
                            userStoryTypeId: isItemTypeValid != undefined ? isItemTypeValid.userStoryTypeId : "",
                            bugCausedUserId: isBugCausedUserValid != undefined ? isBugCausedUserValid.projectMember.id : "",
                            projectFeatureId: isProjectFeatureValid != undefined ? isProjectFeatureValid.projectFeatureId : "",
                            bugPriorityId: isBugPriorityTypeValid != undefined ? isBugPriorityTypeValid.bugPriorityId : "",
                            ownerName: item.Assignee,
                            userStoryType: item.WorkItemType,
                            estimatedTime: item.EstimatedTime,
                            bugPriority: item.BugPriority,
                            projectComponent: item.ProjectComponent,
                            bugCausedUser: item.BugCausedUser,
                            isActive: true,
                            sprintEstimatedTime: item.StoryPoints,
                            messages: errorMessage.join(', '),
                            warningMessages: warningMessage.join(', '),
                            versionName: item.Version,
                            RowNumber: item.__rowNum__
                        }
                        uploadedData.push(workItemObj);
                    }
                });
                fileTemInput.nativeElement.value = "";
                const dialogRef = dialog.open(WorkItemUploadPopupComponent, {
                    width: "90%",
                    direction: 'ltr',
                    data: { uploadedData: uploadedData, isFromSprint: true, isBugFilters },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result.success) {

                    }
                });
            };
            if (event.target != undefined)
                reader.readAsBinaryString(event.target.files[0]);
        }
    }

    downloadFile() {
        this.ProjectGoalsService.WorkItemUploadTemplate(true, this.isBugFilters).subscribe((response: any) => {
            var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            FileSaver.saveAs(blob, "WorkItemUploadTemplate.xlsx");
        },
            function (error) {
                this.toastr.error("Template download failed.");
            });
    }

    downloadTasks() {
        this.downloadInProgress = true;
        var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
        userStorySearchCriteria.sprintId = this.sprint.sprintId;
        userStorySearchCriteria.isArchived = false;
        userStorySearchCriteria.isParked = false;
        userStorySearchCriteria.pageNumber = 1;
        userStorySearchCriteria.pageSize = 1000;
        userStorySearchCriteria.refreshUserStoriesCall = true;
        userStorySearchCriteria.projectId = this.projectId;
        this.ProjectGoalsService.DownloadSprintUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
            if (responseData.success == true) {
                let filePath = responseData.data;
                if (filePath.blobUrl) {
                    const parts = filePath.blobUrl.split(".");
                    const fileExtension = parts.pop();

                    if (fileExtension == 'pdf') {
                    } else {
                        const downloadLink = document.createElement("a");
                        downloadLink.href = filePath.blobUrl;
                        downloadLink.download = filePath.fileName
                        downloadLink.click();
                    }
                }
            } else {
                this.toastr.warning("", responseData.apiResponseMessages[0].message);
            }
            this.downloadInProgress = false;
        });
    }

}
