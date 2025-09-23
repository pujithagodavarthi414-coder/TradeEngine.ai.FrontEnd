import { ChangeDetectionStrategy, Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef, ViewChildren, QueryList } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { MatMenuTrigger } from "@angular/material/menu";
import { SatPopover } from "@ncstate/sat-popover";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { SprintActionTypes, ArchiveSprintsTriggered, CompleteSprintsTriggered } from "../../store/actions/sprints.action";
import { takeUntil, tap, map } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { Subject, Observable, combineLatest } from "rxjs";
import { BoardType } from "../../models/boardtypes";
import { LoadBoardTypesTriggered } from "../../store/actions/board-types.action";
import { TranslateService } from "@ngx-translate/core";
import { LoadBoardTypesApiTriggered } from "../../store/actions/board-types-api.action";
import { Router } from "@angular/router";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { TestSuiteList } from '../../models/testsuite';
import { LoadTestSuiteListTriggered } from "@snovasys/snova-testrepo";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as testRailModuleReducers from "@snovasys/snova-testrepo"

@Component({
    selector: "app-sprint-summary-view",
    templateUrl: "sprint-summary-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SprintSummaryViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("sprint")
    set _sprint(data: SprintModel) {
        this.sprint = data;
        this.boardTypeId = this.sprint.boardTypeId;
    }
    @Input("sprintSelected")
    set _sprintSelected(data: boolean) {
        this.sprintSelected = data;
    }
    @Input("userStoriesCount")
    set _userStoriesCount(data: number) {
        this.userStoriesCount = data;
    }
    @Input("isAllGoalsPage")
    set _isAllGoalsPage(data: boolean) {
        this.isAllGoalsPage = data;
    }
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    @ViewChild("deleteSprintPopover") deleteSprintPopUp: SatPopover;
    @ViewChild("editSprintPopover") editSprintPopUp: SatPopover;
    @ViewChild("startSprintPopover") startSprintPopUp: SatPopover;
    @ViewChild("completeSprintPopover") completeSprintPopUp: SatPopover;
    sprintArchiveOperationInProgress$: Observable<boolean>;
    sprintDeleteOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    sprintOperationInProgress$: Observable<any>;
    boardTypes$: Observable<BoardType[]>;
    userStoriesCount: number;
    sprintForm: FormGroup;
    sprintStartForm: FormGroup;
    defaultProfileImage: string = "assets/images/faces/18.png";
    sprint: SprintModel;
    sprintModel: SprintModel;
    boardTypeId: string;
    boardTypeTooltipText: string;
    isEditSprint: boolean;
    isAllGoalsPage: boolean;
    boardView = BoardTypeIds.BoardViewKey;
    sprintSelected: boolean;
    expansionIcon: boolean;
    panelOpenState: boolean;
    isDescriptionValidation: boolean;
    contextMenuPosition = { x: "0px", y: "0px" };
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions, private translateService: TranslateService, 
        private router: Router, private testRailStore: Store<testRailModuleReducers.State>) {
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
                ofType(SprintActionTypes.UpsertSprintsCompleted),
                tap(() => {
                    this.closeSprintPopup();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.CompleteSprintsCompleted),
                tap(() => {
                    this.closeDeletePopup();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
        this.clearStartSprintsForm();
        this.getSoftLabelConfigurations();
        this.sprintArchiveOperationInProgress$ = this.store.pipe(select(projectModuleReducers.deleteSprintLoading));
        this.sprintDeleteOperationInProgress$ = this.store.pipe(select(projectModuleReducers.completeSprintLoading));
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
    }

    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
    }

    togglePanel() {
        this.panelOpenState = !this.panelOpenState;
        this.expansionIcon = !this.expansionIcon;
    }

  

    openContextMenu(event: MouseEvent) {
        event.preventDefault();
        const contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            console.log(event);
            this.contextMenuPosition.x = (event.clientX) + "px";
            this.contextMenuPosition.y = (event.clientY - 30) + "px";
            contextMenu.openMenu();
        }
    }

    navigateToSprintsPage() {
            this.router.navigate([
                "projects/sprint",
                this.sprint.sprintId
            ]);
    }

    closeArchivePopup() {
        this.deleteSprintPopUp.close();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
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
        if(goal.boardTypeUiId == BoardTypeIds.BoardViewKey.toLowerCase()) {
          if(goal.isBugBoard) {
              return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWBUGSTOOLTIP")
          } else {
              if(goal.isSuperAgileBoard) {
                return this.translateService.instant("SPRINTS.SPRINTLISTVIEWTOOLTIP")
              } else {
                return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWTOOLTIP")
              }
          }
        } else {
          if(goal.isBugBoard) {
             return this.translateService.instant("SPRINTS.SPRINTLISTVIEWBUGSTOOLTIP")
          } else {
              if(goal.isSuperAgileBoard) {
                return this.translateService.instant("SPRINTS.SPRINTLISTVIEWTOOLTIP")
              } else {
                return this.translateService.instant("SPRINTS.SPRINTBOARDVIEWTOOLTIP")
              }
          }
        }
      }

    clearStartSprintsForm() {
        this.sprintStartForm = new FormGroup({
            sprintStartDate: new FormControl('', Validators.compose([Validators.required])),
            sprintEndDate: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    editSprintForm() {
        this.isEditSprint = !this.isEditSprint;
        this.store.dispatch(new LoadBoardTypesTriggered());
        this.store.dispatch(new LoadBoardTypesApiTriggered());
        this.store.dispatch(new LoadMemberProjectsTriggered(this.sprint.projectId));
        const testsuite = new TestSuiteList();
        testsuite.projectId = this.sprint.projectId;
        testsuite.isArchived = false;
        this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));
    }

    cancelSprintPopup() {
        this.closeSprintPopup();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    closeSprintPopup() {
        this.isEditSprint = !this.isEditSprint;
        this.editSprintPopUp.close();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
        }
    }

    closeDeletePopup() {
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            contextMenu.closeMenu();
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

    completeSprint() {
        var sprintModel = new SprintModel();
        sprintModel.sprintId = this.sprint.sprintId;
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
        this.store.dispatch(new CompleteSprintsTriggered(sprintModel));
    }
}