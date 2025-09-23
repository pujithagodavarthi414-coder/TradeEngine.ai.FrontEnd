import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { WidgetsModel } from '../../models/hr-models/widget-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { RoleModel } from '../../models/hr-models/role-model';

@Component({
    selector: "app-fm-component-widget",
    templateUrl: `widget.component.html`
})

export class WidgetManagementComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("widgetPopup") upsertWidgetPopover;
    @ViewChildren("deletewidgetPopup") deletewidgetPopup;
    @ViewChildren("tagsPopup") tagsPopup;
    // @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("formDirective") formgroupDirective: FormGroupDirective;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<boolean>;
    widgetForm: FormGroup;
    isWidgetArchived: boolean;
    isThereAnError = false;
    isAnyOperationIsInprogress = false;
    isFiltersVisible: boolean;
    isArchived = false;
    widgetId: string;
    description: string;
    validationMessage: string;
    widgetName: string;
    widgetModel: WidgetsModel;
    widgets: any;
    timeStamp: any;
    temp: any;
    searchText: string;
    selectRolesListData$: Observable<RoleModel[]>;
    rolesDropDown: any[];
    roleIds: any[];
    isTagsPage: boolean;
    widgetsDropdown: any[];
    selectedRoleIds: string[] = [];

    constructor(
        private cdRef: ChangeDetectorRef,
        private masterDataManagementService: MasterDataManagementService) 
        { super(); }

    ngOnInit() {
        this.GetAllRoles();
        super.ngOnInit();
        this.getSoftLabels();
        this.getWidgets();
        this.clearForm();
    }

    GetAllRoles() {
        this.masterDataManagementService.GetallRoles()
            .subscribe((responseData: any) => {
                console.log(responseData);
                this.rolesDropDown = responseData.data;
                this.roleIds = this.rolesDropDown.map(x => x.roleId);
            });
    }

    getWidgets() {
        this.searchText = "";
        this.isAnyOperationIsInprogress = true;
        const widgetModel = new WidgetsModel();
        widgetModel.isArchived = this.isArchived;
        this.masterDataManagementService.getWidgets(widgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.widgets = response.data;
                this.temp = this.widgets;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    createWidget(widgetPopup) {
        widgetPopup.openPopover();
    }

    closeUpsertWidgetPopup() {
        this.clearForm();
        this.upsertWidgetPopover.forEach((p) => p.closePopover());
    }

    closeDeleteWidgetPopup() {
        this.clearForm();
        this.deletewidgetPopup.forEach((p) => p.closePopover());
    }

    upsertWidget() {
        this.isAnyOperationIsInprogress = true;
        const widgetModel = new WidgetsModel();
        widgetModel.widgetName = this.widgetName;
        widgetModel.widgetId = this.widgetId;
        widgetModel.timeStamp = this.timeStamp;
        widgetModel.selectedRoleIds = this.widgetForm.get("selectedRoles").value;
        widgetModel.description = this.widgetForm.get("description").value;
        this.masterDataManagementService.upsertWidget(widgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertWidgetPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getWidgets();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteWidget() {
        this.isAnyOperationIsInprogress = true;
        const widgetModel = new WidgetsModel();
        widgetModel.widgetId = this.widgetId;
        widgetModel.widgetName = this.widgetName;
        widgetModel.timeStamp = this.timeStamp;
        widgetModel.description = this.description;
        widgetModel.isArchived = this.isWidgetArchived;
        widgetModel.selectedRoleIds = this.selectedRoleIds;
        this.masterDataManagementService.upsertWidget(widgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletewidgetPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getWidgets();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    clearForm() {
        this.widgetId = null;
        this.validationMessage = null;
        this.widgetName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.description = null;
        this.widgetModel = null;
        this.timeStamp = null;
        this.selectedRoleIds = null;
        this.widgetForm = new FormGroup({
            selectedRoles: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(1000)
                ]))
        });
        if (this.formgroupDirective != null) {
            this.formgroupDirective.resetForm();
        }
    }

    editWidget(row, widgetPopupOpen) {
        this.widgetForm.get("selectedRoles").patchValue([]);
        this.widgetForm.get("description").patchValue(row.description == null ? "" : row.description);
        this.widgetForm.patchValue(row);
        this.widgetId = row.widgetId;
        this.widgetName = row.widgetName;
        widgetPopupOpen.openPopover();
        this.timeStamp = row.timeStamp;
        if (row.roleIds != null) {
            const roleIds = row.roleIds.split(",");
            this.widgetForm.get("selectedRoles").patchValue(roleIds);
        }
    }

    deleteWidgetPopUpOpen(row, deletewidgetPopup) {
        this.widgetId = row.widgetId;
        this.widgetName = row.widgetName;
        this.timeStamp = row.timeStamp;
        this.description = row.description;
        this.isWidgetArchived = !this.isArchived;
        if (row.roleIds != null) {
            const roleIds = row.roleIds.split(",");
            this.selectedRoleIds = roleIds;
        }
        deletewidgetPopup.openPopover();
    }

    tagsPopupOpen(row, tagsPopup) {
        this.widgetId = row.widgetId;
        this.isTagsPage = true;
        tagsPopup.openPopover();
    }

    closeTagsPopup(data) {
        if (data === "saved") {
            this.getWidgets()
        }
        this.isTagsPage = false;
        this.clearForm();
        this.tagsPopup.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter((widgets) => widgets.widgetName.toLowerCase().indexOf(this.searchText) > -1);
        this.widgets = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
