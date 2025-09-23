import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DashboardConfiguration } from '../../models/hr-models/dashboard-configuration.model';
import { WorkspaceList } from '../../models/workspaceList';
import { ConstantVariables } from '../../helpers/constant-variables';
import { WidgetService } from '../../services/widget.service';
import { State } from '../../store/reducers';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "dashboard-management",
    templateUrl: `dashboard-management.component.html`
})

export class DashboardManagementComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("configurationEditPopover") configurationEditsPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allViewSelected") private allViewSelected: MatOption;
    @ViewChild("allEditSelected") private allEditSelected: MatOption;
    @ViewChild("allDeleteSelected") private allDeleteSelected: MatOption;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    roleFeaturesIsInProgress$: Observable<boolean>;

    configurationForm: FormGroup;

    configurations = [];
    dashboards: any;
    filterConfigurations: any;
    finalConfigurations: any;
    configurationList: any;
    timeStamp: any;
    dashboardId: any;
    dashboardConfigurationId: any;
    configurationId: string;
    configurationName: string;
    searchText: string = "";
    validationMessage: string;
    rolesDropDown: any[];
    isFiltersVisible: boolean;
    isArchivedTypes = false;
    isThereAnError = false;
    isAnyOperationIsInprogress = false;

    constructor(
        private store: Store<State>, private translateService: TranslateService,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef,
        private widgetService:WidgetService,private masterService:MasterDataManagementService) { super(); }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllRoles();
        // this.getDashboards();
    }

    getDashboardConfigurations() {
        this.isAnyOperationIsInprogress = true;
        const configurationModel = new DashboardConfiguration();
        configurationModel.dashboardConfigurationId = null;
        configurationModel.dashboardId = null;
        this.widgetService.GetDashboardConfigurations(configurationModel).subscribe((response: any) => {
            if (response.success == true) {
                // this.configurations = response.data;
                const allConfigurations = response.data;
                this.makeSuitableData(allConfigurations);
                // this.filterConfigurations = this.configurations;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toastr.error(this.validationMessage);
                this.cdRef.detectChanges();
            }
        });
    }

    getDashboards() {
        const workspacelist = new WorkspaceList();
        workspacelist.workspaceId = "null";
        workspacelist.isHidden = false;
        this.widgetService.GetWorkspaceList(workspacelist).subscribe((response: any) => {
            if (response.success == true) {
                this.dashboards = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getAllRoles() {
        this.masterService.GetallRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
            this.rolesDropDown.forEach((p) => {
                const id = p.roleId.toLowerCase();
                p.roleId = id;
            });
            this.getDashboardConfigurations();
        });
    }

    makeSuitableData(data) {
        if (data && data.length > 0) {
            this.configurations = [];
            data.forEach((item: any) => {
                const defaultRoles = (item.defaultDashboardRoles != null &&
                    item.defaultDashboardRoles != "") ? item.defaultDashboardRoles.split(',') : [];
                let defaultRoleNames;
                if (defaultRoles && defaultRoles.length > 0) {
                    defaultRoleNames = [];
                    defaultRoles.forEach((element) => {
                        const roleIndex = this.rolesDropDown.findIndex(x =>
                            x.roleId.toString().toLowerCase() == element.toString().toLowerCase());
                        if (roleIndex > -1) {
                            defaultRoleNames.push(this.rolesDropDown[roleIndex].roleName);
                        }
                    });
                } else {
                    defaultRoleNames = '';
                }
                const viewRoles = (item.viewRoles != null && item.viewRoles != "") ? item.viewRoles.split(',') : [];
                let viewRoleNames;
                if (viewRoles && viewRoles.length > 0) {
                    viewRoleNames = [];
                    viewRoles.forEach((element) => {
                        const roleIndex = this.rolesDropDown.findIndex((x) =>
                            x.roleId.toString().toLowerCase() == element.toString().toLowerCase());
                        if (roleIndex > -1) {
                            viewRoleNames.push(this.rolesDropDown[roleIndex].roleName);
                        }
                    });
                } else {
                    viewRoleNames = '';
                }
                const editRoles = (item.editRoles != null && item.editRoles != "") ? item.editRoles.split(',') : [];
                let editRoleNames;
                if (editRoles && editRoles.length > 0) {
                    editRoleNames = [];
                    editRoles.forEach((element) => {
                        const roleIndex = this.rolesDropDown.findIndex((x) =>
                            x.roleId.toString().toLowerCase() == element.toString().toLowerCase());
                        if (roleIndex > -1) {
                            editRoleNames.push(this.rolesDropDown[roleIndex].roleName);
                        }
                    });
                } else {
                    editRoleNames = '';
                }
                const deleteRoles = (item.deleteRoles != null && item.deleteRoles != "") ? item.deleteRoles.split(',') : [];
                let deleteRoleNames;
                if (deleteRoles && deleteRoles.length > 0) {
                    deleteRoleNames = [];
                    deleteRoles.forEach((element) => {
                        const roleIndex = this.rolesDropDown.findIndex((x) =>
                            x.roleId.toString().toLowerCase() == element.toString().toLowerCase());
                        if (roleIndex > -1) {
                            deleteRoleNames.push(this.rolesDropDown[roleIndex].roleName);
                        }
                    });
                } else {
                    deleteRoleNames = '';
                }
                this.configurations.push({
                    dashboardConfigurationId: item.dashboardConfigurationId,
                    dashboardId: item.dashboardId,
                    dashboardName: item.dashboardName,
                    defaultDashboardRoles: item.defaultDashboardRoles,
                    defaultDashboardRoleNames: defaultRoleNames.toString(),
                    viewRoles: item.viewRoles,
                    viewRoleNames: viewRoleNames.toString(),
                    editRoles: item.editRoles,
                    editRoleNames: editRoleNames.toString(),
                    deleteRoles: item.deleteRoles,
                    deleteRoleNames: deleteRoleNames.toString(),
                    timeStamp: item.timeStamp
                });
            });
            this.finalConfigurations = this.configurations;
            this.configurationList = this.configurations;
            this.filterConfigurations = this.configurations;
            this.filterByName(this.searchText, false);
        } else {
            this.finalConfigurations = [];
            this.filterConfigurations = [];
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    }

    editConfiguration(data, configurationEditPopover) {
        // this.configurationId = data.dashboardConfigurationId;
        this.timeStamp = data.timeStamp;
        this.dashboardId = data.dashboardId;
        this.dashboardConfigurationId = data.dashboardConfigurationId;
        if (data.defaultDashboardRoles) {
            let roleIds = [];
            roleIds = data.defaultDashboardRoles.toLowerCase().split(',');
            if (this.rolesDropDown && roleIds.length == this.rolesDropDown.length) {
                roleIds.push(0);
                this.configurationForm.controls["defaultDashboardRoleIds"].patchValue(roleIds);
            } else {
                this.configurationForm.controls["defaultDashboardRoleIds"].patchValue(roleIds);
            }
        } else {
            this.configurationForm.controls["defaultDashboardRoleIds"].patchValue(null);
        }
        if (data.viewRoles) {
            let roleIds = [];
            roleIds = data.viewRoles.toLowerCase().split(',');
            if (this.rolesDropDown && roleIds.length == this.rolesDropDown.length) {
                roleIds.push(0);
                this.configurationForm.controls["viewRoleIds"].patchValue(roleIds);
            } else {
                this.configurationForm.controls["viewRoleIds"].patchValue(roleIds);
            }
        } else {
            this.configurationForm.controls["viewRoleIds"].patchValue(null);
        }
        if (data.editRoles) {
            let roleIds = [];
            roleIds = data.editRoles.toLowerCase().split(',');
            if (this.rolesDropDown && roleIds.length == this.rolesDropDown.length) {
                roleIds.push(0);
                this.configurationForm.controls["editRoleIds"].patchValue(roleIds);
            } else {
                this.configurationForm.controls["editRoleIds"].patchValue(roleIds);
            }
        } else {
            this.configurationForm.controls["editRoleIds"].patchValue(null);
        }
        if (data.deleteRoles) {
            let roleIds = [];
            roleIds = data.deleteRoles.toLowerCase().split(',');
            if (this.rolesDropDown && roleIds.length == this.rolesDropDown.length) {
                roleIds.push(0);
                this.configurationForm.controls["deleteRoleIds"].patchValue(roleIds);
            } else {
                this.configurationForm.controls["deleteRoleIds"].patchValue(roleIds);
            }
        } else {
            this.configurationForm.controls["deleteRoleIds"].patchValue(null);
        }
        // this.configurationForm.patchValue(data);
        configurationEditPopover.openPopover();
    }

    upsertConfiguration() {
        this.isAnyOperationIsInprogress = true;
        let configurationModel = new DashboardConfiguration();
        configurationModel = this.configurationForm.value;
        let defaultRoles;
        defaultRoles = configurationModel.defaultDashboardRoleIds;
        if (defaultRoles && defaultRoles.length > 0) {
            const index = defaultRoles.indexOf(0);
            if (index > -1) {
                defaultRoles.splice(index, 1);
            }
        }
        let viewRoles;
        viewRoles = configurationModel.viewRoleIds;
        if (viewRoles && viewRoles.length > 0) {
            const index = viewRoles.indexOf(0);
            if (index > -1) {
                viewRoles.splice(index, 1);
            }
        }
        let editRoles;
        editRoles = configurationModel.editRoleIds;
        if (editRoles && editRoles.length > 0) {
            const index = editRoles.indexOf(0);
            if (index > -1) {
                editRoles.splice(index, 1);
            }
        }
        let deleteRoles;
        deleteRoles = configurationModel.deleteRoleIds;
        if (deleteRoles && deleteRoles.length > 0) {
            const index = deleteRoles.indexOf(0);
            if (index > -1) {
                deleteRoles.splice(index, 1);
            }
        }
        let check = false;

        if (defaultRoles) {
            let newConfigurations = [];
            const dashboardId = this.dashboardId;
            newConfigurations = this.finalConfigurations;
            // tslint:disable-next-line: only-arrow-functions
            newConfigurations = _.filter(newConfigurations, function (s) {
                return !dashboardId.includes(s.dashboardId);
            });
            for (let i = 0; i <= (defaultRoles.length - 1); i++) {
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < newConfigurations.length; j++) {
                    if (newConfigurations[j].defaultDashboardRoles && newConfigurations[j].defaultDashboardRoles.length > 0) {
                        if (newConfigurations[j].defaultDashboardRoles.toLowerCase().indexOf(defaultRoles[i].toLowerCase()) != -1) {
                            check = true;
                            this.toastr.warning(this.translateService.instant(ConstantVariables.DuplicateDashboard));
                            i = defaultRoles.length;
                            this.isAnyOperationIsInprogress = false;
                            break;
                        }
                    }
                }
            }
        }

        if (!check) {
            if (editRoles) {
                if (viewRoles == null || viewRoles.length == 0) {
                    viewRoles = editRoles;
                } else {
                    editRoles.forEach((item) => {
                        if (viewRoles && (viewRoles.indexOf(item) == -1)) {
                            viewRoles.push(item);
                        }
                    });
                }
            }
            if (deleteRoles) {
                if (viewRoles == null || viewRoles.length == 0) {
                    viewRoles = deleteRoles;
                } else {
                    deleteRoles.forEach((item) => {
                        if (viewRoles && (viewRoles.indexOf(item) == -1)) {
                            viewRoles.push(item);
                        }
                    });
                }
            }
            configurationModel.dashboardId = this.dashboardId;
            configurationModel.dashboardConfigurationId = this.dashboardConfigurationId;
            configurationModel.defaultDashboardRoles = defaultRoles != null ? defaultRoles.toString() : null;
            configurationModel.viewRoles = viewRoles != null ? viewRoles.toString() : null;
            configurationModel.editRoles = editRoles != null ? editRoles.toString() : null;
            configurationModel.deleteRoles = deleteRoles != null ? deleteRoles.toString() : null;
            configurationModel.timeStamp = this.timeStamp;
            this.widgetService.UpsertDashboardConfiguration(configurationModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.configurationEditsPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    this.getDashboardConfigurations();
                    const workspacelist = new WorkspaceList();
                    workspacelist.workspaceId = "null";
                    workspacelist.isHidden = false;
                    // this.store.dispatch(new LoadWorkspacesListTriggered(workspacelist));
                    this.isAnyOperationIsInprogress = false;
                } else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                    this.toastr.error(this.validationMessage);
                }
            });
        }
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event, filterFromUi) {
        if (filterFromUi == true) {
            if (event != null) {
                this.searchText = event.target.value.toLowerCase();
                this.searchText = this.searchText.trim();
            } else {
                this.searchText = "";
            }
        } else {
            this.searchText = event;
        }
        const temp = this.filterConfigurations.filter((config) => config.dashboardName.toLowerCase().indexOf(this.searchText) > -1 ||
            config.defaultDashboardRoleNames.toLowerCase().indexOf(this.searchText) > -1 ||
            config.viewRoleNames.toLowerCase().indexOf(this.searchText) > -1 ||
            config.editRoleNames.toLowerCase().indexOf(this.searchText) > -1 ||
            config.deleteRoleNames.toLowerCase().indexOf(this.searchText) > -1);
        this.finalConfigurations = temp;
    }

    clearForm() {
        this.configurationId = null;
        this.timeStamp = null;
        this.dashboardId = null;
        this.dashboardConfigurationId = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.configurationForm = new FormGroup({
            dashboardConfigurationId: new FormControl('', []),
            defaultDashboardRoleIds: new FormControl(null, []),
            canView: new FormControl(0, []),
            canEdit: new FormControl(0, []),
            canDelete: new FormControl(0, []),
            viewRoleIds: new FormControl(null, []),
            editRoleIds: new FormControl(null, []),
            deleteRoleIds: new FormControl(null, [])
        })
    }

    closeUpsertConfigurationDialog() {
        this.configurationEditsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName("", false);
    }

    toggleRolesPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (this.configurationForm.controls["defaultDashboardRoleIds"].value.length === this.rolesDropDown.length) {
            this.allSelected.select();
        }
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            if (this.rolesDropDown.length === 0) {
                this.configurationForm.controls["defaultDashboardRoleIds"].patchValue([]);
            } else {
                this.configurationForm.controls["defaultDashboardRoleIds"].patchValue([
                    ...this.rolesDropDown.map((item) => item.roleId),
                    0
                ]);
            }
        } else {
            this.configurationForm.controls["defaultDashboardRoleIds"].patchValue([]);
        }
    }

    compareSelectedRolesFn(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    toggleViewRolesPerOne() {
        if (this.allViewSelected.selected) {
            this.allViewSelected.deselect();
            return false;
        }
        if (this.configurationForm.controls["viewRoleIds"].value.length === this.rolesDropDown.length) {
            this.allViewSelected.select();
        }
    }

    toggleViewAllRolesSelected() {
        if (this.allViewSelected.selected) {
            if (this.rolesDropDown.length === 0) {
                this.configurationForm.controls["viewRoleIds"].patchValue([]);
            } else {
                this.configurationForm.controls["viewRoleIds"].patchValue([
                    ...this.rolesDropDown.map((item) => item.roleId),
                    0
                ]);
            }
        } else {
            this.configurationForm.controls["viewRoleIds"].patchValue([]);
        }
    }

    compareViewSelectedRolesFn(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    toggleEditRolesPerOne() {
        if (this.allEditSelected.selected) {
            this.allEditSelected.deselect();
            return false;
        }
        if (this.configurationForm.controls["editRoleIds"].value.length === this.rolesDropDown.length) {
            this.allEditSelected.select();
        }
    }

    toggleEditAllRolesSelected() {
        if (this.allEditSelected.selected) {
            if (this.rolesDropDown.length === 0) {
                this.configurationForm.controls["editRoleIds"].patchValue([]);
            } else {
                this.configurationForm.controls["editRoleIds"].patchValue([
                    ...this.rolesDropDown.map((item) => item.roleId),
                    0
                ]);
            }
        } else {
            this.configurationForm.controls["editRoleIds"].patchValue([]);
        }
    }

    compareEditSelectedRolesFn(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    toggleDeleteRolesPerOne() {
        if (this.allDeleteSelected.selected) {
            this.allDeleteSelected.deselect();
            return false;
        }
        if (this.configurationForm.controls["deleteRoleIds"].value.length === this.rolesDropDown.length) {
            this.allDeleteSelected.select();
        }
    }

    toggleDeleteAllRolesSelected() {
        if (this.allDeleteSelected.selected) {
            if (this.rolesDropDown.length === 0) {
                this.configurationForm.controls["deleteRoleIds"].patchValue([]);
            } else {
                this.configurationForm.controls["deleteRoleIds"].patchValue([
                    ...this.rolesDropDown.map((item) => item.roleId),
                    0
                ]);
            }
        } else {
            this.configurationForm.controls["deleteRoleIds"].patchValue([]);
        }
    }

    compareDeleteSelectedRolesFn(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    fitContent(optionalParameters : any) {
        var interval;
        var count = 0;

       if (optionalParameters['popupView']) {     
           
           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                  if ($(optionalParameters['popupViewSelector'] + ' datatable-body').length > 0) {
        
                      $(optionalParameters['popupViewSelector'] + ' datatable-body').height(250);
                      $(optionalParameters['popupViewSelector'] + ' datatable-body').addClass('widget-scroll');
                      
                      clearInterval(interval);
                  }
        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);

        }
    }

}
