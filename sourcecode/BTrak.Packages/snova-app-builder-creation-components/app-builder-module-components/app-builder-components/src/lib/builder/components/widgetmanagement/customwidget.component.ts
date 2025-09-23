import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren, EventEmitter, Output, TemplateRef } from "@angular/core";
import { FormGroupDirective, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import {  MatOption } from "@angular/material/core";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { RoleModel } from "../../models/role.model";
import { DashboardFilterModel } from "../../models/dashboard-filter.model";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, Subscription } from "rxjs";
import { CustomHtmlAppModel } from "../../models/custom-html-app.model";
import { CustomQueryHeadersModel } from "../../models/custom-query-headers.model";
import { CustomQueryOutputModel } from "../../models/custom-query-output.model";
import { CustomWidgetsModel } from "../../models/custom-widget.model";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { WidgetService } from "../../services/widget.service";
import { WidgetList } from "../../models/widget-list.model";
import { WidgetsModel } from "../../models/widget.model";
import { RoleManagementService } from "../../services/role-management.service";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";
import { Page } from "../../models/page.model";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: "app-fm-component-custom-widget",
    templateUrl: `customwidget.component.html`
})

export class CustomWidgetManagementComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;   
    @Output() shiftApp = new EventEmitter<any>();
    @ViewChildren("customWidgetPopup") upsertCustomWidgetPopover;
    @ViewChildren("widgetPopup") upsertWidgetPopover;
    @ViewChildren("importWidgetPopup") upsertImportWidgetPopover;
    @ViewChildren("deletewidgetPopup") deletewidgetPopup;
    @ViewChildren("deleteCustomWidgetPopup") deleteCustomWidgetPopup;
    @ViewChildren("viewcustomWidgetPopup") viewcustomWidgetPopup;
    @ViewChild("formDirective") formgroupDirective: FormGroupDirective;
    @ViewChildren("tagsPopup") tagsPopup;
    @ViewChild("createAppDialogComponet") createAppDialogComponet: TemplateRef<any>;
    @ViewChild("customHtmlAppPreviewComponent") customHtmlAppPreviewComponent: TemplateRef<any>;
    @ViewChild("customWidgetPreviewDialogComponent") customWidgetPreviewDialogComponent: TemplateRef<any>;
    searchTextChanged = new Subject<any>();
    subscription: Subscription;
    softLabels: SoftLabelConfigurationModel[];
    roleIds: any[];
    isWidgetArchived: boolean;
    isThereAnError = false;
    isAnyOperationIsInprogress = false;
    isFromTags = false;
    previewInProgress = false;
    isArchived = false;
    widgetId: string;
    validationMessage: string;
    widgetName: string;
    customWidgetModel: CustomWidgetsModel;
    customWidgets: any;
    temp: any;
    widgetQuery: string;
    queryOutputWithFilter: CustomQueryOutputModel;
    filterQuery: string
    searchText: string;
    selectRolesListData$: Observable<RoleModel[]>;
    rolesDropDown: any[];
    selectedRoleIds: string[] = [];
    gridData = { data: [], total: 0 };
    previewGridColumns: CustomQueryHeadersModel[] = [];
    description: string;
    visualizationType: string;
    XCoOrdinate: string;
    YCoOrdinate: string;
    defaultColumns: CustomQueryHeadersModel[];
    customHtmlAppData: any;
    isAddOrEditRequire : boolean = false;
    timeStamp: any;
    widgetForm: FormGroup;
    page = new Page();
    isScrollable: any;
    sortBy: string;
    sortDirection: boolean = true;

    constructor(
        public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private toaster: ToastrService,
        private translateService: TranslateService,
        private masterDataManagementService: MasterDataManagementService,  private roleManagementService: RoleManagementService,private ws: WidgetService) { super(); }

    ngOnInit() {
        super.ngOnInit();
        this.GetAllRoles();
        this.clearForm();
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.getAllWidgets();
        this.getAddOrEditCustomAppIsRequired();
        this.subscription = this.searchTextChanged
        .pipe(debounceTime(800),
              distinctUntilChanged()
         )
        .subscribe(term => {
          this.searchText = term;
          this.getAllWidgets();
        })
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === 'asc')
          this.sortDirection = false;
        else
          this.sortDirection = true;
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.getAllWidgets();
      }
    
    getAllWidgets() {
        this.isAnyOperationIsInprogress = true;
        var widget = new WidgetList();
        widget.widgetId = "null";
        widget.isArchived = this.isArchived;
        widget.pageNumber = this.page.pageNumber + 1;
        widget.pageSize = this.page.size;
        widget.searchText = this.searchText;
        widget.sortBy = this.sortBy;
        widget.sortDirectionAsc = this.sortDirection;
        this.ws.GetAllWidgets(widget).subscribe((response: any) => {
            if (response.success === true) {
                this.customWidgets = response.data;
                this.temp = this.customWidgets;
                this.page.totalElements = response.data.length > 0 ? response.data[0].totalCount : 0;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.isScrollable = true;
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
      }

      GetAllRoles() {
        this.roleManagementService
            .getAllRoles()
            .subscribe((responseData: any) => {
                console.log(responseData);
                this.rolesDropDown = responseData.data;
                this.roleIds = this.rolesDropDown.map(x => x.roleId);
            });
    }
    languagetranslate(widgetname)
    {
        widgetname = widgetname.trim();
        let name = this.translateService.instant("WIDGETNAMES."+widgetname);
        if ( name.indexOf("WIDGETNAMES.") != -1)
        {
            return widgetname;
        }
        else
        {
            return name;
        }
    }
    translatedescription(description)
    {
        if (description == null)
        {
            return null;   
        }
        description = description.trim();
        var name = this.translateService.instant("WIDGETDESCRIPTION." + description);
        if (name.indexOf("WIDGETDESCRIPTION.") != -1) {
            return description;
        }
        else {
            return name;
        }
    }
    translatetags(tags) 
    {
        if (tags == null)
        {
            return null;   
        }
        tags = tags.trim();
        var splitted = tags.split(",");
        let finalstring ='';
        for ( var i = 0 ; i < splitted.length ; i++)
        {
            if ( i != 0)
            {
                finalstring += ", ";
            }
            var name = this.translateService.instant("WIDGETTAGS." + splitted[i]);
            if (name.indexOf("WIDGETTAGS.") != -1) {
                finalstring += splitted[i];
            }
            else {
                finalstring += name;
            }
        }
        return finalstring;   
    }
    translateroles(roles) 
    {
        if (roles == null)
        {
            return null;   
        }
        roles = roles.trim();
        var splitted = roles.split(",");
        let finalstring ='';
        for ( var i = 0 ; i < splitted.length ; i++)
        {
            if ( i != 0)
            {
                finalstring += ", ";
            }
            var name = this.translateService.instant("WIDGETROLES." + splitted[i]);
            if (name.indexOf("WIDGETROLES.") != -1) {
                finalstring += splitted[i];
            }
            else {
                finalstring += name;
            }
        }
        return finalstring;   
    }
    getAddOrEditCustomAppIsRequired(){
        this.masterDataManagementService.getAddOrEditCustomAppIsRequired().subscribe((response: any) => {
            if (response.success === true) {
                this.isAddOrEditRequire = response.data;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getAllWidgets();
      }

    ShiftApp() {
        this.shiftApp.emit('');
    }

    addCustomWidget(isForHtml) {
        let dialogId = "create-app-dialog-componnet";
        const dialogRef = this.dialog.open(this.createAppDialogComponet, {
            width: "90vw",
            height: "90vh",
            id: dialogId,
            data: { appId: this.widgetId, isForHtmlApp: isForHtml,  formPhysicalId: dialogId  }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            if (isReloadRequired === true) {
                this.getAllWidgets();
                this.dialog.closeAll();
            }
        });
    }

    getWidgets() {
        this.isAnyOperationIsInprogress = true;
        const customWidgetModel = new CustomWidgetsModel();
        customWidgetModel.isArchived = this.isArchived;
        this.masterDataManagementService.getCustomWidgets(customWidgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.customWidgets = response.data;
                this.temp = this.customWidgets;
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createWidget(customwidgetPopup) {
        customwidgetPopup.openPopover();
    }

    closeDeleteWidgetPopup() {
        this.clearForm();
        this.deletewidgetPopup.forEach((p) => p.closePopover());
    }

    closeDeleteCustomWidgetPopup() {
        this.clearForm();
        this.deleteCustomWidgetPopup.forEach((p) => p.closePopover());
        this.deletewidgetPopup.forEach((p) => p.closePopover());
    }

    deleteCustomWidget() {
        if (this.customHtmlAppData) {
            this.isAnyOperationIsInprogress = true
            const customHtmlAppModel = new CustomHtmlAppModel();
            customHtmlAppModel.customHtmlAppId = this.customHtmlAppData.widgetId;
            customHtmlAppModel.customHtmlAppName = this.customHtmlAppData.widgetName;
            customHtmlAppModel.description = this.customHtmlAppData.description;
            customHtmlAppModel.htmlCode = this.customHtmlAppData.widgetQuery;
            customHtmlAppModel.isArchived = !this.customHtmlAppData.isArchived;
            customHtmlAppModel.timeStamp = this.customHtmlAppData.timeStamp;
            customHtmlAppModel.selectedRoleIds = this.selectedRoleIds;
            this.masterDataManagementService.upsertCustomHtmlApp(customHtmlAppModel).subscribe((responseData: any) => {
                if (responseData.success == true) {
                    this.getAllWidgets();
                    this.deleteCustomWidgetPopup.forEach((p) => p.closePopover());
                    this.customHtmlAppData = null;
                } else {
                    this.toaster.error(responseData.apiResponseMessages[0].message);
                }
            });
            this.isAnyOperationIsInprogress = false;
        } else {
            this.isAnyOperationIsInprogress = true;
            const customWidgetModel = new CustomWidgetsModel();
            customWidgetModel.customWidgetId = this.widgetId;
            customWidgetModel.customWidgetName = this.widgetName;
            customWidgetModel.isArchived = this.isWidgetArchived;
            customWidgetModel.selectedRoleIds = this.selectedRoleIds;
            customWidgetModel.widgetQuery = this.widgetQuery;
            customWidgetModel.filterQuery = this.filterQuery;
            customWidgetModel.description = this.description;
            customWidgetModel.visualizationType = this.visualizationType;
            customWidgetModel.XCoOrdinate = this.XCoOrdinate;
            customWidgetModel.YCoOrdinate = this.XCoOrdinate;
            customWidgetModel.defaultColumns = this.defaultColumns;
            this.masterDataManagementService.upsertCustomWidget(customWidgetModel).subscribe((response: any) => {
                if (response.success === true) {
                    this.deleteCustomWidgetPopup.forEach((p) => p.closePopover());
                    this.clearForm();
                    this.getAllWidgets();
                } else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                }
            });
        }
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
                this.getAllWidgets();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    upsertImportWidget() {
        this.isAnyOperationIsInprogress = true;
        const widgetModel = new WidgetsModel();
        widgetModel.widgetName = this.widgetName;
        widgetModel.widgetId = this.widgetId;
        widgetModel.timeStamp = this.timeStamp; 
        widgetModel.isCustomWidget = true;
        widgetModel.selectedRoleIds = this.widgetForm.get("selectedRoles").value;
        widgetModel.description = this.widgetForm.get("description").value;
        this.masterDataManagementService.upsertImportWidget(widgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertImportWidgetPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllWidgets();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
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
                this.getAllWidgets();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
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


    clearForm() {
        this.widgetId = null;
        this.validationMessage = null;
        this.widgetName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.customWidgetModel = null;
        this.widgetQuery = null;
        this.filterQuery = null;
        this.selectedRoleIds = null;
        this.description = null;
        this.visualizationType = null;
        this.XCoOrdinate = null;
        this.YCoOrdinate = null;
        this.isFromTags = false;
        this.defaultColumns = [];
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
    }

    closeUpsertWidgetPopup() {
        this.clearForm();
        this.upsertWidgetPopover.forEach((p) => p.closePopover());
    }

    editCustomWidget(row) {
        let dialogId = "create-app-dialog-componnet";
        const dialogRef = this.dialog.open(this.createAppDialogComponet, {
            width: "90vw",
            height: "90vh",
            id: dialogId,
            data: { appId: row.widgetId, isForHtmlApp: row.isHtml, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            if (isReloadRequired === true) {
                this.getAllWidgets();
                dialogRef.close();
                }
            }); 
    }

    deleteCustomWidgetPopUpOpen(row, deletecustomWidgetPopup) {
        if (row.isHtml) {
            this.customHtmlAppData = row;
            this.widgetId = row.widgetId;
            this.widgetName = row.widgetName;
            this.isWidgetArchived = !this.isArchived;
            if (row.roleIds != null) {
                const roleIds = row.roleIds.split(",");
                this.selectedRoleIds = roleIds;
            }
        } else {
            this.widgetId = row.widgetId;
            this.widgetName = row.widgetName;
            this.filterQuery = row.filterQuery;
            this.isWidgetArchived = !this.isArchived;
            this.description = row.description;
            this.widgetQuery = row.widgetQuery;
            this.visualizationType = row.visualizationType;
            this.XCoOrdinate = row.XCoOrdinate;
            this.YCoOrdinate = row.YCoOrdinate;
            this.defaultColumns = row.defaultColumns;
            if (row.roleIds != null) {
                const roleIds = row.roleIds.split(",");
                this.selectedRoleIds = roleIds;
            }
        }
        deletecustomWidgetPopup.openPopover();
    }

    viewWidgetPopUpOpen(row) {
        this.previewInProgress = true;
        this.isAnyOperationIsInprogress = true;
   
        if (row.isHtml) {
            let dialogId = "custom-html-app-preview-component";
            this.dialog.open(this.customHtmlAppPreviewComponent, {
                minWidth: "85vw",
                minHeight: "85vh",
                id: dialogId,
                data: {
                    widgetQuery: row.widgetQuery,
                    fileUrl: row.fileUrls,
                    formPhysicalId: dialogId
                }
            });
        }
        else {
            let dialogId = "custom-widget-preview-component";
            this.dialog.open(this.customWidgetPreviewDialogComponent, {
                minWidth: "85vw",
                minHeight: "85vh",
                height: "70%",
                id: dialogId,
                data: {
                    filterQuery: null,
                    customWidgetQuery: null,
                    persistanceId: row.widgetId,
                    isUserLevel: false,
                    emptyWidget: true,
                    customWidgetId: row.widgetId,
                    xCoOrdinate: null,
                    yCoOrdinate: null,
                    visualizationType: row.visualizationType,
                    pivotMeasurersToDisplay: row.pivotMeasurersToDisplay,
                    workspaceId: null,
                    dashboardId: null,
                    isProc: row.isProc,
                    isApi: row.isApi,
                    procName: row.procName,
                    isForPreview: true,
                    formPhysicalId: dialogId
                }
            });
        }
        this.previewInProgress = false;
        this.isAnyOperationIsInprogress = false;
    }

    tagsPopupOpen(row, tagsPopup) {
        this.isFromTags = true;
        this.widgetId = row.widgetId;
        tagsPopup.openPopover();
    }

    closeTagsPopup(data) {
        if (data === "saved") {
            this.getAllWidgets()
        }
        this.clearForm();
        this.tagsPopup.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        console.log(event);
        // if (event != null) {
        //     this.searchText = event.target.value.toLowerCase();
        //     this.searchText = this.searchText.trim();
        // } else {
        //     this.searchText = "";
        // }
        // const temp = this.temp.filter((widgets) => widgets.widgetName.toLowerCase().indexOf(this.searchText) > -1);
        // this.customWidgets = temp;
        if (this.searchText && this.searchText.length <= 0) return;
        this.isAnyOperationIsInprogress = true;
        this.page.pageNumber = 0;
        this.searchTextChanged.next(this.searchText);
    }

    closeSearch() {
        //this.filterByName(null);
        this.searchText = '';
        this.getAllWidgets();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
      }

      editCustomWidgets(row,importWidgetPopupOpen){
          var r = row;
          this.widgetForm.get("selectedRoles").patchValue([]);
            this.widgetForm.get("description").patchValue(row.description == null ? "" : row.description);
            this.widgetForm.patchValue(row);
            this.widgetId = row.widgetId;
            this.widgetName = row.widgetName;
            importWidgetPopupOpen.openPopover();
            this.timeStamp = row.timeStamp;
            if (row.roleIds != null) {
                const roleIds = row.roleIds.split(",");
                this.widgetForm.get("selectedRoles").patchValue(roleIds);
            }
        }

        closeUpsertImportWidgetPopup() {
            this.clearForm();
            this.upsertImportWidgetPopover.forEach((p) => p.closePopover());
        }

        
        
      
}
