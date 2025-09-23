import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line:ordered-imports
import { Actions } from "@ngrx/effects";
// tslint:disable-next-line:ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:ordered-imports
import { Observable, Subject } from "rxjs";
import * as _ from "underscore";
import { TemplateModel } from "../../models/templates-model";
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line:ordered-imports
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { GetWorkItemsTriggered } from "../../store/actions/template-userstories.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-pm-component-templateviewstatus",
    templateUrl: "template-view-status.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class TemplateViewStatusComponent implements OnInit {
    @Input("template")
    set _template(data: TemplateModel) {
        this.template = data;
    }

    @Input("userStorySearchCriteria")
    set _userStorySearchCriteria(data: UserStorySearchCriteriaInputModel) {
        this.userStorySearchCriteria = data;
        if (this.userStorySearchCriteria.refreshUserStoriesCall) {
            this.store.dispatch(new GetWorkItemsTriggered(this.userStorySearchCriteria));
        }
    }
    @ViewChild("addKanbanUserStory") addUserStoryPopUp: SatPopover;
    @Output() selectUserStory = new EventEmitter<UserStory>();
    userStories$: Observable<UserStory[]>;
    anyOperationInProgress$: Observable<boolean>;
    createUserstoryLoading$: Observable<boolean>;
    getUserStoriesLoading$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    userStoryId: string;
    isVisible: boolean;
    UserstoryLoader = Array;
    UserstoryLoaderCount = 3;
    userStorySearchCriteria: UserStorySearchCriteriaInputModel;
    template: TemplateModel;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>) {
    }
    ngOnInit() {
        this.getSoftLabelConfigurations();
        this.createUserstoryLoading$ = this.store.pipe(
            select(projectModuleReducer.upsertTemplatesLoading)
        );

        this.getUserStoriesLoading$ = this.store.pipe(
            select(projectModuleReducer.getWorkItemsLoading)
        );

        this.userStories$ = this.store.pipe(select(projectModuleReducer.getWorkItemsAll));
    }
    closeAddPoUp() {
        this.addUserStoryPopUp.close();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    handleClickEvent(userStory) {
        this.userStoryId = userStory.userStoryId;
        this.selectUserStory.emit(userStory);
    }

    addNewUserStory(openPopUp) {
        openPopUp.openPopover();
    }

    
  openNewUserStory(isVisible) {
    this.isVisible = isVisible;
  }
}
