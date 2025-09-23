import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ChangeDetectorRef, EventEmitter, Output } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStory } from "../../models/userStory";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';


@Component({
    selector: "app-pm-sprints-kanban-board",
    templateUrl: "sprints-kanban-board.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsKanbanBoardComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("sprintSearchCriteriaModel")
    set _sprintSearchCriteriaModel(data: UserStorySearchCriteriaInputModel) {
        this.sprintSearchCriteriaModel = data;
    }
    @Input("sprint")
    set _sprint(data: SprintModel) {
        this.sprint = data;
        this.ownerUserList = null;
    }
    @Input("isBoardLayOut") isBoardLayOut: boolean;
    @Input("isUniquePage") isUniquePage: boolean;
    @Output() eventClicked = new EventEmitter<boolean>();
    @Output() getReportsBoard = new EventEmitter<boolean>();
    @Output() getDocumentStore = new EventEmitter<string>();
    @Output() selectedUserStory = new EventEmitter<UserStory>();
    @Output() getCalenderViewClicked = new EventEmitter<boolean>();
    @Output() emitReplanTypeId = new EventEmitter<string>();
    sprintSearchCriteriaModel: UserStorySearchCriteriaInputModel;
    sprint: SprintModel;
    ownerUserList: string;
    goalReplanId: string;
    constructor(private store: Store<State>, private cdRef: ChangeDetectorRef) {
        super();
    }
    ngOnInit() {
        super.ngOnInit();
    }

    boardChange(event) {
        this.eventClicked.emit(event);
    }

    getDocumentView(event) {
        this.getDocumentStore.emit("");
    }

    getCalenderView(event) {
        this.getCalenderViewClicked.emit(true);
    }


    reportsBoardClicked() {
        this.getReportsBoard.emit(true);
    }

    handleSelectedUserStory(userStory) {
        this.selectedUserStory.emit(userStory);
    }

    filterOwnerList(ownerId) {
      this.ownerUserList = ownerId;
    }

    selectReplanType(event) {
        this.goalReplanId = event;
        this.emitReplanTypeId.emit(event);
    }

}