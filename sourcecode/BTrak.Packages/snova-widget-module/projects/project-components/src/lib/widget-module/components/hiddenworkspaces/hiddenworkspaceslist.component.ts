import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewChildren, Output, EventEmitter } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { SoftLabelConfigurationModel } from "../../dependencies/models/softlabels-model";
import { Observable, Subject } from "rxjs";
import { WorkspaceList } from "../../dependencies/models/workspaceList";
import { LoadHiddenWorkspacesListTriggered, LoadUnHideWorkspacesListTriggered } from "../../dependencies/store/actions/Workspacelist.action";
import { State } from "../../dependencies/store/reducers/index";
import * as hiddenWorkspaceModuleReducer from "../../dependencies/store/reducers/index";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

@Component({
    selector: "app-hiddenworkspaceslist",
    templateUrl: "./hiddenworkspaceslist.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HiddenWorkspaceslistComponent extends CustomAppBaseComponent {
    @ViewChildren("unHideWorkspacePopover") unHideWorkspacePopovers;

    @Input("canAccessHideOption")
    set _canAccessHideOption(data: boolean) {
        if (data || data === false) {
            this.canAccessHideOption = data;
            console.log("canAccessHideOption" + this.canAccessHideOption);
            this.loadWorkspacesList();
            this.getWorkspacesList();
        }
    }

    hiddenWorkspacesList$: Observable<WorkspaceList[]>;
    anyOperationInProgress$: Observable<boolean>;
    anyOperationInProgress: boolean;
    public ngDestroyed$ = new Subject();
    @Output() dashboardSelect = new EventEmitter<any>();
    canAccessHideOption = false;
    disableWorkspaceunhide = false;
    loadingCompleted = false;
    showTitleTooltip = false;
    workspacelist: WorkspaceList;
    searchText = "";
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    @ViewChild("description") descriptionStatus: ElementRef;
    hideDashboard: Boolean = false;
    workspaces: any

    constructor(private store: Store<State>) {
        super();
        this.anyOperationInProgress$ = this.store.pipe(select(hiddenWorkspaceModuleReducer.getHiddenListLoading));
        this.anyOperationInProgress$.subscribe(data => this.anyOperationInProgress = data);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.hideDashboard = this.canAccess_feature_HideDashboard;

    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    loadWorkspacesList() {
        this.workspacelist = new WorkspaceList();
        this.workspacelist.workspaceId = "null";
        this.store.dispatch(new LoadHiddenWorkspacesListTriggered(this.workspacelist));
    };

    dashboardSelected(hidePopover, dashboard) {
        if (dashboard.isHidden !== true) {
            this.dashboardSelect.emit(dashboard);
        } else if (this.hideDashboard) {
            this.openUnHideWorkspacePopover(hidePopover, dashboard)
        }
    }

    getWorkspacesList() {
        this.hiddenWorkspacesList$ = this.store.pipe(select(hiddenWorkspaceModuleReducer.getHiddenWorkspaceAll));
        this.hiddenWorkspacesList$.subscribe((data: any) => {
            this.workspaces = data;
        })
    }

    openUnHideWorkspacePopover(hidePopover, workspace) {
        this.workspacelist = new WorkspaceList();
        this.workspacelist.workspaceId = workspace.workspaceId;
        this.workspacelist.workspaceName = workspace.workspaceName;
        this.workspacelist.isHidden = workspace.isHidden;
        this.workspacelist.timeStamp = workspace.timeStamp;
        this.workspacelist.roleIds = workspace.roleIds;
        this.workspacelist.editRoleIds = workspace.editRoleIds;
        this.workspacelist.deleteRoleIds = workspace.deleteRoleIds;
        this.workspacelist.description = workspace.description;
        this.disableWorkspaceunhide = false;
        hidePopover.openPopover();
    }

    closeUnHideWorkspacePopover() {
        this.unHideWorkspacePopovers.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.searchText = "";
    }

    unHideSelectedWorkspace() {
        this.disableWorkspaceunhide = true;
        const workspaceModel = new WorkspaceList();
        workspaceModel.workspaceName = this.workspacelist.workspaceName;
        workspaceModel.workspaceId = this.workspacelist.workspaceId;
        workspaceModel.description = this.workspacelist.description;
        workspaceModel.timeStamp = this.workspacelist.timeStamp;
        workspaceModel.editRoleIds = this.workspacelist.editRoleIds;
        workspaceModel.deleteRoleIds = this.workspacelist.deleteRoleIds;
        workspaceModel.selectedRoleIds = this.workspacelist.roleIds.toString();
        workspaceModel.isHidden = false;
        this.store.dispatch(new LoadUnHideWorkspacesListTriggered(workspaceModel));
        this.dashboardSelect.emit(workspaceModel);
    }

    checkTitleTooltipStatus(description) {
        if (description && description.length > 195) {
            this.showTitleTooltip = true;
        } else {
            this.showTitleTooltip = false;
        }
    }
}
