// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, Input, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { Observable, Subject, combineLatest } from "rxjs";
import { SprintModel } from "../../models/sprints-model";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, take, map } from "rxjs/operators";
import { SprintActionTypes, SprintStartTriggered, ArchiveSprintsTriggered, CompleteSprintsTriggered, UpsertSprintsTriggered, GetUniqueSprintsByIdTriggered, GetUniqueSprintsByUniqueIdTriggered } from "../../store/actions/sprints.action";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import * as _ from "underscore";
import { SatPopover } from "@ncstate/sat-popover";
import { UserStory } from "../../models/userStory";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoadBoardTypesTriggered } from "../../store/actions/board-types.action";
import { LoadBoardTypesApiTriggered } from "../../store/actions/board-types-api.action";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { CookieService } from "ngx-cookie-service";
import { ComponentModel } from "@snovasys/snova-comments";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { FileElement } from '../../models/file-element-model';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { TestSuiteList } from '../../models/testsuite';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { MenuItemService } from "../../services/feature.service";
import * as testRailModuleReducer from "@snovasys/snova-testrepo";
import { LoadTestSuiteListTriggered } from '@snovasys/snova-testrepo';
import { ProjectModulesService } from '../../services/project.modules.service';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

const environent = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
    selector: "app-sprints-unique-detail",
    templateUrl: "sprints-unique-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsUniqueDetailComponent extends AppFeatureBaseComponent implements OnInit {

    @Input("Ids")
    set _Ids(Ids) {
        this.sprintId = Ids;
    }

    @ViewChild("editSprintMenuPopover") editSprintMenu: SatPopover;
    @ViewChild("deleteSprintPopover") deleteSprintPopUp: SatPopover;
    @ViewChild("editSprintPopover") editSprintPopUp: SatPopover;
    @ViewChild("startSprintPopover") startSprintPopUp: SatPopover;
    @ViewChild("completeSprintPopover") completeSprintPopUp: SatPopover;
    entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
    canAccess_feature_ViewProjects$: Observable<Boolean>;
    accessViewProjects: Boolean;
    sprintModel$: Observable<SprintModel>;
    anyOperationInprogress$: Observable<boolean>;
    loadingEntityFeatures$: Observable<boolean>;
    startSprintOperationInProgress$: Observable<boolean>;
    sprintArchiveOperationInProgress$: Observable<boolean>;
    sprintOperationInProgress$: Observable<boolean>;
    sprintDeleteOperationInProgress$: Observable<boolean>;
    descriptionLoading$: Observable<boolean>;
    userStoryIsInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    entityRolePermisisons: EntityRoleFeatureModel[];
    sprintStartForm: FormGroup;
    startSprintModel: SprintModel;
    sprintModel: SprintModel;
    selectedDetails: UserStory;
    componentModel: ComponentModel = new ComponentModel();
    fileElement: FileElement;
    userStorySearchCriteria: UserStorySearchCriteriaInputModel;
    sprintId: string;
    description: string;
    isLoading: boolean;
    isPermissionForViewSprints: boolean;
    isPermissionForViewUserstories: boolean;
    isPermissionForViewProjects$: Observable<boolean>;
    refreshUserStoriesCall: boolean;
    minDate: Date;
    isDescriptionValidation: boolean;
    isBoardLayOut: boolean;
    isReportsBoard: boolean;
    isComponentRefresh: boolean;
    showDocuments: boolean;
    showCalendarView: boolean;
    isEditorVisible: boolean;
    showDiv: boolean;
    isSprint: boolean;
    isBacklog: boolean;
    isEditSprint: boolean;
    isListView: boolean;
    isEnableSprintView: boolean;
    isEnableTestRepo: boolean;
    replanTypeId: string;
    injector: any;
    documentStoreComponent: any;
    documentsModuleLoaded: boolean
    public initSettings = {
        plugins: "paste lists advlist",
        branding: false,
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    public ngDestroyed$ = new Subject();

    constructor(
        private store: Store<State>, private route: ActivatedRoute, private testRailStore: Store<testRailModuleReducer.State>,
        private actionUpdates$: Actions, private router: Router, private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        @Inject('ProjectModuleLoader') public projectModulesService: any,
        private ngModuleRef: NgModuleRef<any>, private compiler: Compiler,
        private vcr: ViewContainerRef,
        private translateService: TranslateService, private cookieService: CookieService, private featureService: MenuItemService) {
        super();
        this.injector = this.vcr.injector;
        this.isPermissionForViewUserstories=true;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.GetUniqueSprintsByIdCompleted),
                tap(() => {
                    this.sprintModel$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintById));
                    this.sprintModel$.subscribe((x) => {
                        this.sprintModel = x;
                        if (this.sprintModel) {
                            this.description = this.sprintModel.description;
                            this.isEnableSprintView = this.sprintModel.isEnableSprints;
                            this.isEnableTestRepo = this.sprintModel.isEnableTestRepo;
                            this.refreshUserStoriesCall = true;
                            this.checkPermissionsForSprints();
                            this.refreshSprints();
                            this.getEntityFeatures(this.sprintModel.projectId);
                            if (this.sprintModel.sprintStartDate && this.sprintModel.isReplan) {
                                this.isBacklog = null;
                            } else if (this.sprintModel.sprintStartDate && !this.sprintModel.isReplan) {
                                this.isBacklog = false;
                            } else if (!this.sprintModel.sprintStartDate) {
                                this.isBacklog = true;
                            }
                        }
                    });
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.GetSprintsByIdCompleted),
                tap(() => {
                    this.sprintModel$ = this.store.pipe(select(projectModuleReducers.getSprintById));
                    this.sprintModel$.subscribe((x) => {
                        this.sprintModel = x;
                        this.isEditorVisible = false;
                        if (this.sprintModel) {
                            this.description = this.sprintModel.description;
                            this.isEnableSprintView = this.sprintModel.isEnableSprints;
                            this.isEnableTestRepo = this.sprintModel.isEnableTestRepo;
                            if (this.sprintModel.sprintStartDate && this.sprintModel.isReplan) {
                                this.isBacklog = null;
                            } else if (this.sprintModel.sprintStartDate && !this.sprintModel.isReplan) {
                                this.isBacklog = false;
                            } else if (!this.sprintModel.sprintStartDate) {
                                this.isBacklog = true;
                            }
                            if (localStorage.getItem("boardtypeChanged")) {
                                localStorage.removeItem("boardtypeChanged");
                                this.refreshUserStoriesCall = true;
                                this.selectSprint();
                            } else {
                                this.refreshUserStoriesCall = false;
                            }
                        }
                    });
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.ArchiveSprintsCompleted),
                tap(() => {
                    this.closeArchivePopup();
                    this.router.navigate([
                        "projects/projectstatus",
                        this.sprintModel.projectId,
                        "active-goals"
                    ]);
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
                ofType(SprintActionTypes.CompleteSprintsCompleted),
                tap(() => {
                    this.closeDeletePopup();
                    this.router.navigate([
                        "projects/projectstatus",
                        this.sprintModel.projectId,
                        "active-goals"
                    ]);
                })
            )
            .subscribe();

        if (!this.sprintId) {
            // this.route.params.subscribe((params) => {
            //     this.sprintId = params["id"];
            //     this.getEntityRoleFeatures();
            //     // this.store.dispatch(new EntityRolesByUserIdFetchTriggered(this.sprintId, "sprint", false));
            // });
            combineLatest(this.route.params, this.route.fragment)
                .pipe(map(results => ({ params: results[0], fragment: results[1] })))
                .subscribe(results => {  
                    if(this.sprintId != results.params.id)   {              
                        if (results.fragment) {
                            this.getEntityRoleFeatures(true, results.params.id);
                        } else {
                            this.sprintId = results.params.id;
                            this.getEntityRoleFeatures();
                        }
                    }
                        // this.store.dispatch(new EntityRolesByUserIdFetchTriggered(this.goalId, "goal", false));
                    
                });
            let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
            this.accessViewProjects = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearStartSprintsForm();
        this.getSoftLabelConfigurations();
        //this.loadingEntityFeatures$ = this.store.pipe(select(sharedModuleReducers.getUserEntityFeaturesLoading));
        this.anyOperationInprogress$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintByIdLoading));
        this.sprintArchiveOperationInProgress$ = this.store.pipe(select(projectModuleReducers.deleteSprintLoading));
        this.startSprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.sprintStartLoading));
        this.userStoryIsInProgress$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintWorkItemsLoading));
        this.sprintDeleteOperationInProgress$ = this.store.pipe(select(projectModuleReducers.completeSprintLoading));
        this.sprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.upsertSprintsLoading));
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environent.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    }

    getEntityRoleFeatures(isUnique: boolean = false, uniqueId: string = null) {
        this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
            if (features.success == true) {
                localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
                if(isUnique) {
                    this.store.dispatch(new GetUniqueSprintsByUniqueIdTriggered(uniqueId));
                } else {
                this.store.dispatch(new GetUniqueSprintsByIdTriggered(this.sprintId));
                }
            }
        })
    }

    getEntityFeatures(projectId) {
        this.isLoading = true;
        this.featureService.getAllPermittedEntityRoleFeatures(projectId).subscribe((features: any) => {
            if (features.success == true) {
                this.isLoading = false;
                localStorage.setItem(LocalStorageProperties.EntityRoleFeatures, JSON.stringify(features.data));
            }
        })
    }

    emitReplanType(replanTypeId) {
        this.replanTypeId = replanTypeId;
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    clearStartSprintsForm() {
        this.sprintStartForm = new FormGroup({
            sprintStartDate: new FormControl('', Validators.compose([Validators.required])),
            sprintEndDate: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    handleDescriptionEvent() {
        var editSprintModel = new SprintModel();
        editSprintModel.sprintId = this.sprintModel.sprintId;
        editSprintModel.timeStamp = this.sprintModel.timeStamp;
        editSprintModel.projectId = this.sprintModel.projectId;
        editSprintModel.sprintName = this.sprintModel.sprintName;
        editSprintModel.description = this.description;
        editSprintModel.isReplan = this.sprintModel.isReplan;
        editSprintModel.boardTypeId = this.sprintModel.boardTypeId;
        editSprintModel.testSuiteId = this.sprintModel.testSuiteId;
        editSprintModel.boardTypeApiId = this.sprintModel.boardTypeApiId;
        editSprintModel.version = this.sprintModel.version;
        editSprintModel.sprintEndDate = this.sprintModel.sprintEndDate;
        editSprintModel.sprintStartDate = this.sprintModel.sprintStartDate;
        editSprintModel.sprintResponsiblePersonId = this.sprintModel.sprintResponsiblePersonId;
        this.store.dispatch(new UpsertSprintsTriggered(editSprintModel));
    }

    checkCharactersLength(comments) {
        const description = comments.event.target.textContent.length;
        if (description.length > 800) {
            this.isDescriptionValidation = true;
        } else {
            this.isDescriptionValidation = false;
        }
    }

    cancelDescription() {
        this.isEditorVisible = false;
    }

    descriptionReset() {
        this.description = this.sprintModel.description;
    }

    enableEditor() {
        if (!this.sprintModel.inActiveDateTime && !this.sprintModel.isComplete) {
            this.isEditorVisible = true;
        }
    }


    refreshSprints() {
        if (this.sprintModel.projectId) {
            this.getEntityRolePermissions();
        }
        this.selectSprint();
    }

    redirectPage() {
        this.cookieService.set("selectedProjectsTab", "active-goals");
        this.router.navigate([
            "projects/projectstatus",
            this.sprintModel.projectId,
            "active-goals"
        ]);
    }

    getEntityRolePermissions() {
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        let projectId = this.sprintModel.projectId;
        this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId
        })
        this.checkPermissionsForViewUserStories();

    }

    checkPermissionsForViewUserStories() {
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        let projectId = this.sprintModel.projectId;
        this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId
        })
        const entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
        let featurePermissions = [];
        featurePermissions = this.entityRolePermisisons;
        // tslint:disable-next-line: only-arrow-functions
        const viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
        })
        if (viewUserStoryPermisisonsList.length > 0) {
            this.isPermissionForViewUserstories = true;
        } else {
            this.isPermissionForViewUserstories = false;
        }

    }


    selectSprint() {
        if (this.sprintModel.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase()) {
            this.isBoardLayOut = false;
        } else {
            this.isBoardLayOut = true;
        }
        this.sprintId = this.sprintModel.sprintId;
        const userStorySearchCriteriaTemp = new UserStorySearchCriteriaInputModel();
        userStorySearchCriteriaTemp.sprintId = this.sprintModel.sprintId;
        userStorySearchCriteriaTemp.isArchived = false;
        userStorySearchCriteriaTemp.isParked = false;
        userStorySearchCriteriaTemp.pageNumber = 1;
        userStorySearchCriteriaTemp.refreshUserStoriesCall = this.refreshUserStoriesCall;
        userStorySearchCriteriaTemp.isForUserStoryoverview = true;
        this.userStorySearchCriteria = userStorySearchCriteriaTemp;

    }

    closeArchivePopup() {
        this.deleteSprintPopUp.close();
        this.editSprintMenu.close();
    }

    closeSprintPopup() {
        this.isEditSprint = !this.isEditSprint;
        this.editSprintPopUp.close();
        this.editSprintMenu.close();
    }

    cancelStartSprintPopup() {
        this.startSprintPopUp.close();
        this.editSprintMenu.close();
    }

    closeDeletePopup() {
        this.completeSprintPopUp.close();
        this.editSprintMenu.close();
    }


    changeStartDate() {
        this.minDate = this.sprintStartForm.value.sprintStartDate;
    }

    startSprint() {
        this.isListView = this.sprintModel.boardTypeUiId && this.sprintModel.boardTypeUiId.toUpperCase() === BoardTypeIds.ListViewKey ? true : false;
        if (this.isListView) {
            if (this.sprintModel.userStoriesCount == 0) {
                this.toastr.warning("", this.translateService.instant(ConstantVariables.UserStoriesCountForGoalApproval));
            }
            else if (this.sprintModel.isWarning) {
                this.toastr.warning("", this.translateService.instant('SPRINTS.PLEASEADDESTIMATEDTIMEFORSPRINTWORKITEM'))
            } else {
                this.startSprinttoActive();
            }
        } else {
            this.startSprinttoActive();
        }
    }


    startSprinttoActive() {
        this.startSprintModel = this.sprintStartForm.value;
        this.startSprintModel.sprintId = this.sprintModel.sprintId;
        this.startSprintModel.timeStamp = this.sprintModel.timeStamp;
        this.startSprintModel.projectId = this.sprintModel.projectId;
        this.startSprintModel.sprintName = this.sprintModel.sprintName;
        this.startSprintModel.description = this.sprintModel.description;
        this.startSprintModel.isReplan = this.sprintModel.isReplan;
        this.startSprintModel.boardTypeId = this.sprintModel.boardTypeId;
        this.startSprintModel.testSuiteId = this.sprintModel.testSuiteId;
        this.startSprintModel.boardTypeApiId = this.sprintModel.boardTypeApiId;
        this.startSprintModel.version = this.sprintModel.version;
        this.startSprintModel.sprintResponsiblePersonId = this.sprintModel.sprintResponsiblePersonId;
        this.store.dispatch(new SprintStartTriggered(this.startSprintModel));
    }


    deleteSprint() {
        var sprintModel = new SprintModel();
        sprintModel.sprintId = this.sprintModel.sprintId;
        sprintModel.isArchived = true;
        sprintModel.timeStamp = this.sprintModel.timeStamp;
        sprintModel.sprintName = this.sprintModel.sprintName;
        sprintModel.projectId = this.sprintModel.projectId;
        sprintModel.description = this.sprintModel.description;
        sprintModel.sprintStartDate = this.sprintModel.sprintStartDate;
        sprintModel.sprintEndDate = this.sprintModel.sprintEndDate;
        sprintModel.isReplan = this.sprintModel.isReplan;
        sprintModel.boardTypeId = this.sprintModel.boardTypeId;
        sprintModel.testSuiteId = this.sprintModel.testSuiteId;
        sprintModel.boardTypeApiId = this.sprintModel.boardTypeApiId;
        sprintModel.version = this.sprintModel.version;
        sprintModel.sprintResponsiblePersonId = this.sprintModel.sprintResponsiblePersonId;
        this.store.dispatch(new ArchiveSprintsTriggered(sprintModel));
    }

    completeSprint() {
        var sprintModel = new SprintModel();
        sprintModel.sprintId = this.sprintModel.sprintId;
        sprintModel.timeStamp = this.sprintModel.timeStamp;
        sprintModel.sprintName = this.sprintModel.sprintName;
        sprintModel.projectId = this.sprintModel.projectId;
        sprintModel.description = this.sprintModel.description;
        sprintModel.sprintStartDate = this.sprintModel.sprintStartDate;
        sprintModel.sprintEndDate = this.sprintModel.sprintEndDate;
        sprintModel.isReplan = this.sprintModel.isReplan;
        sprintModel.boardTypeId = this.sprintModel.boardTypeId;
        sprintModel.testSuiteId = this.sprintModel.testSuiteId;
        sprintModel.boardTypeApiId = this.sprintModel.boardTypeApiId;
        sprintModel.version = this.sprintModel.version;
        sprintModel.sprintResponsiblePersonId = this.sprintModel.sprintResponsiblePersonId;
        this.store.dispatch(new CompleteSprintsTriggered(sprintModel));
    }


    editSprintForm() {
        this.store.dispatch(new LoadBoardTypesTriggered());
        this.store.dispatch(new LoadBoardTypesApiTriggered());
        this.store.dispatch(new LoadMemberProjectsTriggered(this.sprintModel.projectId));
        const testsuite = new TestSuiteList();
        testsuite.projectId = this.sprintModel.projectId;
        testsuite.isArchived = false;
        this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));
        this.isEditSprint = !this.isEditSprint;
    }




    checkPermissionsForMatMenu() {
        let featurePermissions = [];
        if (this.entityRolePermisisons.length > 0) {
            featurePermissions = this.entityRolePermisisons;
            let entityFeatureIds: any[];
            entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
            if (featurePermissions.length > 0) {
                const entityTypeFeatureForDeleteSprint = EntityTypeFeatureIds.EntityTypeFeature_DeleteSprint.toString().toLowerCase();
                const entityTypeFeatureForCompletesprint = EntityTypeFeatureIds.EntityTypeFeature_CompleteSprint.toString().toLowerCase();
                const entityFeatureIdForEditSprint = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateSprint.toString().toLowerCase();
                const entityFeatureIdForStartSprint = EntityTypeFeatureIds.EntityTypeFeature_StartSprint.toString().toLowerCase();

                // tslint:disable-next-line: only-arrow-functions
                const deletesprintPermisisonsList = _.filter(featurePermissions, function (permission) {
                    return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeleteSprint)
                })

                // tslint:disable-next-line: only-arrow-functions
                const completeSprintPermisisonsList = _.filter(featurePermissions, function (permission) {
                    return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForCompletesprint)
                })

                // tslint:disable-next-line: only-arrow-functions
                const editSprintPermisisonsList = _.filter(featurePermissions, function (permission) {
                    return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForEditSprint)
                })

                // tslint:disable-next-line: only-arrow-functions
                const startSprintPermisisonsList = _.filter(featurePermissions, function (permission) {
                    return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForStartSprint)
                })

                // tslint:disable-next-line: max-line-length
                if (deletesprintPermisisonsList.length > 0 || completeSprintPermisisonsList.length > 0 || editSprintPermisisonsList.length > 0 || (!this.sprintModel.sprintStartDate && startSprintPermisisonsList.length > 0)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }


    checkPermissionsForSprints() {
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        let projectId = this.sprintModel.projectId;
        this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId
        })
        const entityTypeFeatureForViewSprints = EntityTypeFeatureIds.EntityTypeFeature_ViewSprints.toString().toLowerCase();
        let featurePermissions = [];
        featurePermissions = this.entityRolePermisisons;
        // tslint:disable-next-line: only-arrow-functions
        const viewGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewSprints)
        })
        if (viewGoalPermisisonsList.length > 0) {
            this.isPermissionForViewSprints = true;
        } else {
            this.isPermissionForViewSprints = false;
        }

    }


    selectedUserStoryEvent(event) {
        if (!event.sprintInActiveDateTime && !event.isComplete) {
            this.selectedDetails = event;
            if (window.matchMedia("(max-width: 768px)").matches) {
                this.showDiv = false;
            } else {
                this.showDiv = true;
            }
            if (window.matchMedia("(min-width: 1024px) and (max-width: 1260px)").matches) {
                this.isSprint = true;
            }
        }
    }


    userStoryCloseClicked() {
        this.selectedDetails = null;
    }

    clickBoardEvent(event) {
        this.selectedDetails = null;
        this.isBoardLayOut = event;
        this.isReportsBoard = false;
        this.showCalendarView = false;
        this.showDocuments = false;
    }

    getReportsBoard() {
        this.selectedDetails = null;
        this.isBoardLayOut = false;
        this.isReportsBoard = true;
        this.showDocuments = false;
        this.showCalendarView = false;

    }

    getDocumentStore(event) {
        var loader = this.projectModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function(module: any){ return module.modulePackageName == 'DocumentManagementPackageModule' });
    
        if(!module){
            console.error("No module found for DocumentManagementPackageModule");
        } 
    
        var path = loader[module.modulePackageName];

        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
          .then((moduleFactory: NgModuleFactory<any>) => {
    
            const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
    
            var allComponentsInModule = (<any>componentService).components;
    
            this.ngModuleRef = moduleFactory.create(this.injector);
    
            var componentDetails = allComponentsInModule.find(elementInArray =>
                elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
            );
            this.documentStoreComponent = {};
            this.documentStoreComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            const fileElement = new FileElement();
            if (this.sprintModel.sprintId) {
                fileElement.folderReferenceId = this.sprintModel.sprintId;
            } else {
                fileElement.folderReferenceId = null;
            }
            fileElement.folderReferenceTypeId = ConstantVariables.SprintReferenceTypeId.toLowerCase();
            fileElement.isEnabled = true;
            fileElement.isFromSprints = true;
            this.fileElement = fileElement;
            this.isComponentRefresh = !this.isComponentRefresh;
            this.documentStoreComponent.inputs = {
              sprint: this.sprintModel,
              fileElement: this.fileElement,
              isComponentRefresh: this.isComponentRefresh
            };
    
            this.documentStoreComponent.outputs = {
              getDocumentStore: event => this.getDocumentStore(event),
              getReportsBoard: this.getReportsBoard(),
              eventClicked: event => this.clickBoardEvent(event),
              getCalenderViewClicked: this.getCalenderView()
            }
            this.selectedDetails = null;
            this.isReportsBoard = false;
            this.showDocuments = true;
            this.isBoardLayOut = false;
            this.showCalendarView = false;
            this.documentsModuleLoaded = true;
    
            this.cdRef.detectChanges();
        });
    }

    getCalenderView() {
        this.selectedDetails = null;
        this.isReportsBoard = false;
        this.showDocuments = true;
        this.isBoardLayOut = false;
        this.showCalendarView = true;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}