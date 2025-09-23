import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ChangeDetectorRef, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import * as projectModuleReducer from "../../store/reducers/index";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStory } from "../../models/userStory";
import { Observable } from "rxjs";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { FileElement } from '../../models/file-element-model';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { ProjectModulesService } from '../../services/project.modules.service';
import * as _ from "underscore";
import { WidgetService } from '../../services/widget.service';
import { WorkspaceDashboardFilterModel } from '../../../globaldependencies/models/softlabels-models';
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
import { DocumentStoreComponent } from "@snovasys/snova-document-management";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-pm-sprints-browse-board",
  templateUrl: "sprints-browse-board.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsBrowseBoardComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("sprintSearchCriteriaModel")
  set _sprintSearchCriteriaModel(data: SprintModel) {
    this.sprintSearchCriteriaModel = data;
    this.sprintsCount = 1;
  }
  @Input("isSprint")
  set _isSprint(data: boolean) {
    this.isSprint = data;
  }

  @Input("goalSearchCriteria")
  set _goalSearchCriteria(data: GoalSearchCriteriaInputModel) {
    this.goalSearchCriteria = data;
  }
  goalSearchCriteria: GoalSearchCriteriaInputModel;
  sprintUserStoryIsInProgress$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  activeSprintsCount$: Observable<number>;
  sprintSearchCriteriaModel: SprintModel;
  fileElement: FileElement;
  userStorySearchCriteriaModel: UserStorySearchCriteriaInputModel;
  sprint: SprintModel;
  selectedDetails: UserStory;
  replanTypeId: string;
  referenceId: string;
  referenceTypeId: string;
  sprintId: string;
  showDiv: boolean;
  isSprint: boolean;
  isBacklog: boolean;
  isComponentRefresh: boolean;
  showCalendarView: boolean;
  showDocuments: boolean;
  isBoardLayOut: boolean;
  isReportsBoard: boolean;
  injector: any;
  documentStoreComponent: any;
  documentStoreLoaded: boolean;
  filters: any;
  workspaceDashboardFilterId: string;
  sprintsCount: number;
  UserstoryLoader = Array;
  UserstoryLoaderCount: number = 3;
  userStoriesCount: number;

  constructor(private store: Store<State>,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>, private compiler: Compiler,
    private widgetService: WidgetService,
    private vcr: ViewContainerRef,
    private cdRef: ChangeDetectorRef) {
    super();
    this.injector = this.vcr.injector;
  }
  ngOnInit() {
    super.ngOnInit();
    this.sprintUserStoryIsInProgress$ = this.store.pipe(select(projectModuleReducer.getUniqueSprintWorkItemsLoading));
    this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducer.getSprintsLoading));
    this.activeSprintsCount$ = this.store.pipe(select(projectModuleReducer.activeSprintsCount));
  }

  selectSprint(sprintDetails) {
    this.sprint = sprintDetails.sprint;
    this.getBoardTypesFilter(sprintDetails);
    this.sprintId = this.sprint.sprintId;
    var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaModel.sprintId = this.sprint.sprintId;
    userStorySearchCriteriaModel.pageSize = 1000;
    userStorySearchCriteriaModel.pageNumber = 1;
    userStorySearchCriteriaModel.isArchived = false;
    userStorySearchCriteriaModel.isParked = false;
    userStorySearchCriteriaModel.refreshUserStoriesCall = sprintDetails.checked;

    if(this.goalSearchCriteria) {
      userStorySearchCriteriaModel.isGoalsPage = this.goalSearchCriteria.isGoalsPage;
      userStorySearchCriteriaModel.userStoryStatusIds = this.goalSearchCriteria.userStoryStatusId;
      userStorySearchCriteriaModel.ownerUserIds = this.goalSearchCriteria.ownerUserId;
      userStorySearchCriteriaModel.deadLineDateFrom = this.goalSearchCriteria.deadLineDateFrom;
      userStorySearchCriteriaModel.deadLineDateTo = this.goalSearchCriteria.deadLineDateTo;
      userStorySearchCriteriaModel.sortBy = this.goalSearchCriteria.sortBy;
      userStorySearchCriteriaModel.sortDirection = this.goalSearchCriteria.sortDirection;
      userStorySearchCriteriaModel.includeArchive = this.goalSearchCriteria.isIncludedArchive;
      userStorySearchCriteriaModel.includePark = this.goalSearchCriteria.isIncludedPark;
      userStorySearchCriteriaModel.userStoryTags = this.goalSearchCriteria.workItemTags;
      userStorySearchCriteriaModel.projectIds = this.goalSearchCriteria.projectId;
      userStorySearchCriteriaModel.dependencyUserIds = this.goalSearchCriteria.dependencyUserIds;
      userStorySearchCriteriaModel.bugCausedUserIds = this.goalSearchCriteria.bugCausedUserIds;
      userStorySearchCriteriaModel.versionName = this.goalSearchCriteria.versionName;
      userStorySearchCriteriaModel.projectFeatureIds = this.goalSearchCriteria.projectFeatureIds;
      userStorySearchCriteriaModel.createdDateFrom = this.goalSearchCriteria.createdDateFrom;
      userStorySearchCriteriaModel.createdDateTo = this.goalSearchCriteria.createdDateTo;
      userStorySearchCriteriaModel.updatedDateFrom = this.goalSearchCriteria.updatedDateFrom;
      userStorySearchCriteriaModel.updatedDateTo = this.goalSearchCriteria.updatedDateTo;
      userStorySearchCriteriaModel.userStoryTypeIds = this.goalSearchCriteria.userStoryTypeIds;
      userStorySearchCriteriaModel.userStoryName = this.goalSearchCriteria.userStoryName;
      userStorySearchCriteriaModel.bugPriorityIds = this.goalSearchCriteria.bugPriorityIds;
      userStorySearchCriteriaModel.sprintResponsiblePersonIds = this.goalSearchCriteria.sprintResponsiblePersonId;
      userStorySearchCriteriaModel.sortBy = this.goalSearchCriteria.sortBy;
      userStorySearchCriteriaModel.isActiveSprints = this.goalSearchCriteria.isActiveSprints;
      userStorySearchCriteriaModel.isBacklogSprints = this.goalSearchCriteria.isBacklogSprints;
      userStorySearchCriteriaModel.isReplanSprints = this.goalSearchCriteria.isReplanSprints;
      userStorySearchCriteriaModel.isDeleteSprints = this.goalSearchCriteria.isDeleteSprints;
      userStorySearchCriteriaModel.isCompletedSprints = this.goalSearchCriteria.isCompletedSprints;
      const userStoryArchive = JSON.stringify(this.goalSearchCriteria.isIncludedArchive);
      const userStoryPark = JSON.stringify(this.goalSearchCriteria.isIncludedPark);
      localStorage.setItem("includeArchive", userStoryArchive);
      localStorage.setItem("includePark", userStoryPark);
      if (!this.goalSearchCriteria.isIncludedPark) {
        userStorySearchCriteriaModel.isArchived = false;
      }
      if (!this.goalSearchCriteria.isIncludedArchive) {
        userStorySearchCriteriaModel.isParked = false;
      }
    }

    if (this.sprint.isBugBoard) {
      userStorySearchCriteriaModel.projectId = this.sprint.projectId;
    } else {
      userStorySearchCriteriaModel.projectId = null;
    }

    this.userStorySearchCriteriaModel = userStorySearchCriteriaModel;
    if (this.userStorySearchCriteriaModel.refreshUserStoriesCall) {
      this.selectedDetails = null;
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

  @HostListener("window:resize", ["$event"])
  sizeChange(event) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
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
    this.cdRef.detectChanges();
  }

  getDocumentStore(event) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

    if (!module) {
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
        if (this.sprint.sprintId) {
          fileElement.folderReferenceId = this.sprint.sprintId;
        } else {
          fileElement.folderReferenceId = null;
        }
        fileElement.folderReferenceTypeId = ConstantVariables.SprintReferenceTypeId.toLowerCase();
        fileElement.isEnabled = true;
        fileElement.isFromSprints = true;
        this.fileElement = fileElement;
        this.isComponentRefresh = !this.isComponentRefresh;
        this.documentStoreComponent.inputs = {
          sprint: this.sprint,
          fileElement: this.fileElement,
          isComponentRefresh: this.isComponentRefresh
        };

        this.documentStoreComponent.outputs = {
          getDocumentStore: event => this.getDocumentStore(event),
          getReportsBoard: this.getReportsBoard(),
          eventClicked: event => this.clickBoardEvent(event),
          getCalenderViewClicked: event => this.getCalenderView(event)
        }


        this.selectedDetails = null;
        this.isReportsBoard = false;
        this.showDocuments = true;
        this.isBoardLayOut = false;
        this.showCalendarView = false;
        this.documentStoreLoaded = true;
        this.cdRef.detectChanges();
      });
  }

  getCalenderView(event) {
    this.selectedDetails = null;
    this.isReportsBoard = false;
    this.showDocuments = true;
    this.isBoardLayOut = false;
    this.showCalendarView = true;
    this.cdRef.detectChanges();
  }

  emitReplanType(replanTypeId) {
    this.replanTypeId = replanTypeId;
  }

  getBoardTypesFilter(goalSelected) {
    this.filters = null;
    let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
    workspaceDashboardFilterModel.workspaceDashboardId = this.sprint.sprintId;
    this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data && responseData.data.length > 0) {
            let dashboardFilters = responseData.data[0];
            this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
            this.filters = JSON.parse(dashboardFilters.filterJson);
            this.goalDetailsBinding();
            this.cdRef.detectChanges();
          }
          else {
            this.goalDetailsBinding();
          }
        }
      });
  }

  goalDetailsBinding() {
    if (this.filters) {
      this.isReportsBoard = this.filters.isReportsPage;
      this.showDocuments = this.filters.isDocumentsView;
      this.documentStoreLoaded = this.filters.isDocumentsView;
      if (this.showDocuments) {
        this.getDocumentStore(null);
      }
      this.isBoardLayOut = this.filters.isTheBoardLayoutKanban;
    } else {
      if (this.sprint.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase()) {
        this.isBoardLayOut = false;
      } else {
        this.isBoardLayOut = true;
      }
      this.isReportsBoard = false;
      this.showDocuments = false;
      this.showCalendarView = false;
    }
  }

  getSprintsCount(event) {
    this.sprintsCount = event;
  }

  getWorkItemsCount(event) {
    this.userStoriesCount = event;
    this.cdRef.detectChanges();
  }
}