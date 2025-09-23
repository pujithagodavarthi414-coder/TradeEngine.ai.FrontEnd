import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { GetAllSprintsTriggered, GetSprintsTriggered, SprintActionTypes } from "../../store/actions/sprints.action";
import { Observable, Subject } from "rxjs";
import { ofType, Actions } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import * as projectModuleReducer from "../../store/reducers/index";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { ProjectMember } from "../../models/projectMember";

@Component({
    selector: "app-pm-sprints-list",
    templateUrl: "sprints-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsListComponent implements OnInit {
    @Input("sprintSearchCriteriaModel")
    set _sprintSearchCriteriaModel(data: SprintModel) {
        this.sprintSearchCriteriaModel = data;
        if (!this.selectedSprintId) {
            if(this.sprintSearchCriteriaModel.isGoalsPage) {
                this.store.dispatch(new GetAllSprintsTriggered(this.sprintSearchCriteriaModel));
            } else {
                this.store.dispatch(new GetSprintsTriggered(this.sprintSearchCriteriaModel));
            }
        }
    }

    @Input("userStoriesCount")
    set _userStoriesCount(data: number) {
        this.userStoriesCount = data;
    }
    @Output() selectSprint = new EventEmitter<Object>();
    @Output() getAllSprintsCount = new EventEmitter<number>();
    sprintsList$: Observable<SprintModel[]>;
    projectMembers$: Observable<ProjectMember[]>;
    sprintModel$: Observable<SprintModel>;
    anyOperationInProgress$: Observable<boolean>;
    sprintModel: SprintModel;
    sprintSearchCriteriaModel: SprintModel;
    selectedSprint: SprintModel;
    sprintsList: SprintModel[] = [];
    selectedSprintId: string;
    selectedResponsiblePersonlist: any[] = [];
    isSelectedMembers: any[] = [];
    isSelected: any[] = [];
    sprintResponsiblePerson: string;
    searchText: string;
    isBoardType: boolean;
    divActivate: boolean;
    userStoriesCount: number;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.GetSprintsCompleted),
                tap(() => {
                    this.sprintsList$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprintsList$.subscribe((x) => this.sprintsList = x);
                    if (this.sprintsList.length > 0) {
                        this.selectedSprintId = this.sprintsList[0].sprintId;
                        this.selectedSprint = this.sprintsList[0];
                        this.getAllSprintsCount.emit(this.sprintsList.length);
                        this.selectSprint.emit({ sprint: this.sprintsList[0], checked: true });
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.ArchiveSprintsCompleted),
                tap(() => {
                    this.sprintsList$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprintsList$.subscribe((x) => this.sprintsList = x);
                    if (this.sprintsList.length > 0) {
                        this.getAllSprintsCount.emit(this.sprintsList.length);
                        if (this.sprintsList[0].sprintId === this.selectedSprintId) {
                            this.selectSprint.emit({ sprint: this.selectedSprint, checked: false });
                        } else {
                            this.selectedSprintId = this.sprintsList[0].sprintId;
                            this.selectSprint.emit({ sprint: this.sprintsList[0], checked: true });
                        }
                    }

                })
            )
            .subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.CompleteSprintsCompleted),
                tap(() => {
                    this.sprintsList$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprintsList$.subscribe((x) => this.sprintsList = x);
                    if (this.sprintsList.length > 0) {
                        this.getAllSprintsCount.emit(this.sprintsList.length);
                        if (this.sprintsList[0].sprintId === this.selectedSprintId) {
                            this.selectSprint.emit({ sprint: this.selectedSprint, checked: false });
                        } else {
                            this.selectedSprintId = this.sprintsList[0].sprintId;
                            this.selectSprint.emit({ sprint: this.sprintsList[0], checked: true });
                        }
                    }

                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.UpdateSprintsField),
                tap(() => {
                    this.sprintModel$ = this.store.pipe(select(projectModuleReducer.getSprintById));
                    this.sprintModel$.subscribe((x) => this.sprintModel = x);
                    if (localStorage.getItem("boardtypeChanged")) {
                        localStorage.removeItem("boardtypeChanged");
                        this.isBoardType = true;
                    } else {
                        this.isBoardType = false;
                    }
                    if (this.sprintModel && this.sprintModel.sprintId === this.selectedSprintId && this.isBoardType) {
                        this.selectSprint.emit({ sprint: this.sprintModel, checked: true });
                    } else if (this.sprintModel && this.sprintModel.sprintId === this.selectedSprintId && !this.isBoardType) {
                        this.selectSprint.emit({ sprint: this.sprintModel, checked: false });
                    }

                })
            )
            .subscribe();
    }
    ngOnInit() {
        this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducer.getSprintsLoading));
        this.projectMembers$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
    }

    getSelectedMember(userId, selectedIndex) {
        const index = this.selectedResponsiblePersonlist.indexOf(userId);
        if (index > -1) {
            this.selectedResponsiblePersonlist.splice(index, 1);
            this.isSelectedMembers[selectedIndex] = false;
        } else {
            this.selectedResponsiblePersonlist.push(userId);
            this.isSelectedMembers[selectedIndex] = true;
        }
        this.sprintResponsiblePerson = this.selectedResponsiblePersonlist.toString();
    }

    getAssigne(userId, isChecked, selectedIndex) {
        if (isChecked) {
            this.selectedResponsiblePersonlist.push(userId);
            this.isSelected[selectedIndex] = true;
        } else {
            const index = this.selectedResponsiblePersonlist.indexOf(userId);
            this.selectedResponsiblePersonlist.splice(index, 1);
            this.isSelected[selectedIndex] = false;
        }
        this.sprintResponsiblePerson = this.selectedResponsiblePersonlist.toString();
    }

    resetAllFilters() {
        this.searchText = null;
        this.isSelectedMembers = [];
        this.selectedResponsiblePersonlist = [];
        this.isSelected = [];
        this.sprintResponsiblePerson = null;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    handleClickOnSprintSummaryComponent(sprint) {
        this.selectedSprintId = sprint.sprintId;
        this.selectedSprint = sprint;
        this.selectSprint.emit({ sprint: sprint, checked: true });
    }

    closeSearch() {
        this.searchText = null;
    }
}