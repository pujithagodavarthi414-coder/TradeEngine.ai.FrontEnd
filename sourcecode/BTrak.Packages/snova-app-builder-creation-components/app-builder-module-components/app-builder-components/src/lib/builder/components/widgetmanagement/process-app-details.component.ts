import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { GridComponent, PageChangeEvent } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import * as formUtils from "formiojs/utils/formUtils.js";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { CustomApplicationKeySearchModel } from "../genericform/models/custom-application-key-search.model";
import { CustomApplicationPersistanceModel } from "../genericform/models/custom-application-persistance.model";
import { CustomApplicationSearchModel } from "../genericform/models/custom-application-search.model";
import { GenericFormSubmitted, GenericFormSubmittedSearchInputModel } from "../genericform/models/generic-form-submitted.model";
import { GenericFormService } from "../genericform/services/generic-form.service";
import { Observable, Subject } from "rxjs";
import { WorkspaceList } from "../../models/workspace-list.model";
import { Dashboard } from "../../models/dashboard.model";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { process, State } from "@progress/kendo-data-query";
import { TranslateService } from "@ngx-translate/core";
import { WidgetService } from "../../services/widget.service";
import { DashboardFilterModel } from "../../models/dashboard-filter.model";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { GridSettings } from '../../models/grid-settings.model';
import { Persistance } from '../../models/persistance.model';
import { PersistanceService } from '../../services/persistance.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatOption } from "@angular/material/core";
import { UserService } from "../genericform/services/user.Service";
import { MatChipInputEvent } from "@angular/material/chips";


@Component({
    selector: "process-app-details",
    templateUrl: "process-app-details.component.html"
})

export class ProcessAppComponent extends CustomAppBaseComponent implements OnInit {
    genericFormSubmittedId: any;
    customApplicationId: string;
    rowDetails: any;
    commentText: any;
    shareDialog: any;
    shareDialogId: string;
    loadTable: boolean;
    loadRecords: number;
    sendXlsxReport: boolean = false;
    emailModel: { toEmails: any; fileExtension: string; formName: any; file: string; reportType: string; data: any[]; columns: any[]; isFromProcessApp: boolean; body: any; subject: any; };
    excelDownload: boolean;
    min: number = 10;
    max: number = 99;
    userCompanyIds: any;
    message: any;
    latestRecord: any;
    isRedirectToEmails: boolean;
    @Input("widgetData") set _widgetData(data: any) {
        if (data != null && data != undefined) {
            this.anyOperationInProgress = true;
            if (data.customWidgetId) {
                this.applicationId = data.customWidgetId;
                this.getCustomApplications();
            }
            if (data.dashboardId != null && data.dashboardId !== undefined && data.dashboardId !== this.dashboardId) {
                this.dashboardId = data.dashboardId;
            }
            if (data.dashboardName != null && data.dashboardName !== undefined) {
                this.dashboardName = data.dashboardName;
            }
            if (data.isEntryApp != null && data.isEntryApp !== undefined) {
                this.isEntryApp = data.isEntryApp;
            }
        }
    }
    @ViewChild('shareDialogDocument') shareDialogComponent: TemplateRef<any>;
    @ViewChild('shareApplication') shareApplicationComponent: TemplateRef<any>;
    @ViewChild("genericFormImportDialogComponent") genericFormImportDialogComponent: TemplateRef<any>;
    @ViewChild("createAppDialogComponet") createAppDialogComponet: TemplateRef<any>;
    @ViewChild("genericApplicationComponent") genericApplicationComponent: TemplateRef<any>;
    @ViewChildren("deleteTemplatePopUp") deleteTemplatePopover;
    @ViewChildren("shareFormPopover") sharePopUps;
    @ViewChildren("deleteMultiplePopUp") deleteMultiplePopUp;
    @ViewChild("deleteMultipleRecordsPopUp") deleteMultipleRecordsPopUp: TemplateRef<any>;
    isEntryApp: boolean;
    dashboardFilters: DashboardFilterModel;
    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    applicationId: string = null;
    applicationForms: any = [];
    formKeysList: any[] = [];
    uploadProfileImageInProgress = false;
    isApproveNeeded: boolean;
    customApplicationName: string;
    isShareLoading: boolean;
    isFormLoading = true;
    columns: any = [];
    sortBy = "customApplicationName";
    sortDirection = true;
    emptyWidget = true;
    customAppPersistance: any[] = [];
    selectedform: any = null;
    selectedDashboard: any = null;
    showFilters: boolean = false;
    cursor = 'default';
    records: any = [];
    customAppHeaders: any[];
    validationMessage: string;
    anyOperationInProgress = false;
    customApplicationSearchModel: CustomApplicationSearchModel;
    public grid: GridComponent;
    persistance: CustomApplicationPersistanceModel;
    customApplicationKeySearchModel: CustomApplicationKeySearchModel;
    public buttonCount = 5;
    public info = true;
    public type: "numeric" | "input" = "numeric";
    public pageSizes = true;
    public previousNext = true;
    importedData: any[];
    formsAvailable: any[] = [];
    selectedFormId: any;
    formName: string = null;
    workspacesList$: Observable<WorkspaceList[]>;
    workspaces: WorkspaceList[];
    loggedInUserId: string;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    isAnyOperationIsInprogress: any;
    dataSourceId: string;
    public gridSettings: GridSettings = {
        state: {
            skip: 0,
            take: 10,

            filter: {
                logic: "and",
                filters: []
            }
        },
        gridData: { data: [], total: 0 },
        columnsConfig: []
    };
    isArchived: any;
    public ngDestroyed$ = new Subject();
    toMailsList: string[] = [];
    selectable: boolean = true;
    sharingisinProgress: boolean = false;
    removable = true;
    toMail: string;
    workflowIds: string;
    count: number;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userIds: any;
    selectedUserIds: any;
    usersList: any;
    selectedUserNames: any;
    @ViewChild("allSelected") private allSelected: MatOption;
    selectedUserEmails: any;
    sendReportForm: FormGroup;
    selected = new FormControl(0);
    public initSettings = {
        plugins: 'lists advlist,wordcount,paste',
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
    };
    @ViewChildren("shareReportPopover") shareReportPopovers;
    allowAnnonymous: boolean = false;
    deleteRecordValues = [];
    deleteMultipleRecordsPopupId: string = "delete-multiple-records";
    shareApplicationComp: string = "share-application-dialog";
    showArchivedRecords: boolean = false;
    isRecordLevelPermissionEnabled: boolean;
    recordLevelPermissionFieldName: any;
    conditionalEnum: any;
    customApplicationForm: FormGroup;
    selectedList: any[] = [];
    sharedMessage: any;
    sharedSubject: any;
    config = {
        plugins: 'link, table, preview, advlist, image, searchreplace, code, autolink, lists, autoresize, media',
        default_link_target: '_blank',
        toolbar: 'formatselect | bold italic strikethrough | link image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
        height: 450,
        branding: false,
        table_responsive_width: true,
        image_advtab: true,
        autoresize_bottom_margin: 20,
        relative_urls: 0,
        remove_script_host: 0
    }
    constructor(
        private routes: Router,
        public dialog: MatDialog,
        private softLabelPipe: SoftLabelPipe,
        private toastr: ToastrService,
        private genericFormService: GenericFormService,
        private cdRef: ChangeDetectorRef,
        private persistanceService: PersistanceService,
        private snackbar: MatSnackBar,
        private translateService: TranslateService,
        private widgetService: WidgetService,
        private userService: UserService,
        private cookieService: CookieService

    ) {
        super();
        this.sharingisinProgress = false;
        this.anyOperationInProgress = true;
        this.sendXlsxReport = false;
        this.gridSettings.gridData = { data: [], total: 0 };
       // this.applicationId = "C604A997-5FEB-40BA-9F38-D089359F8F60";
        //this.getCustomApplications();
        this.initializeCustomApplicationForm();
        this.getUsersDropDown();
        this.clearCustomApplicationForm();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.shareGeniricForm("");
        this.getSoftLabels();
        this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
    }

    getSoftLabels() {
        this.softLabels = localStorage.getItem(LocalStorageProperties.SoftLabels) ? JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels)) : [];
    }

    navigateToEdit() {
        let dialogId = "create-app-dialog-componet";
        const dialogRef = this.dialog.open(this.createAppDialogComponet, {
            width: "90vw",
            height: "90vh",
            id: dialogId,
            data: { appId: this.applicationId, fromSearch: false, tag: null, appType: 3, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            if (isReloadRequired === true) {
                this.dialog.closeAll();
            }
        });
    }

    getCustomApplications() {
        const customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.sortBy = this.sortBy;
        customApplicationSearchModel.sortDirectionAsc = this.sortDirection;
        customApplicationSearchModel.pageNumber = 1;
        customApplicationSearchModel.pageSize = 10000;
        customApplicationSearchModel.isArchived = false;
        customApplicationSearchModel.customApplicationId = this.applicationId;
        this.isFormLoading = true;
        this.genericFormService.getCustomApplication(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                if (responseData.success === true) {
                    const applicationsList = responseData.data;
                    this.formsAvailable = applicationsList;

                    this.selected.setValue(0);
                    this.selectedMatTab(0);
                    if (applicationsList != null && applicationsList.length > 0) {
                        this.isRecordLevelPermissionEnabled = applicationsList[0].isRecordLevelPermissionEnabled;
                        this.recordLevelPermissionFieldName = applicationsList[0].recordLevelPermissionFieldName;
                        this.conditionalEnum = applicationsList[0].conditionalEnum;
                        this.isRedirectToEmails = applicationsList[0].isRedirectToEmails;
                        if (applicationsList[0].userIds) {
                            this.selectedList = applicationsList[0].userIds.split(",");
                            this.selectedList = this.selectedList.map(x => x.toLowerCase());
                        }
                        this.sharedMessage = applicationsList[0].approveMessage;
                        this.sharedSubject = applicationsList[0].approveSubject;

                        this.workflowIds = applicationsList[0].workflowIds;
                        this.selectedCustomForm(applicationsList[0]);
                        this.dashboardName = this.dashboardName ? this.dashboardName : applicationsList[0].customApplicationName;
                        this.isApproveNeeded = applicationsList[0].isApproveNeeded;
                        this.allowAnnonymous = applicationsList[0].allowAnnonymous;
                    }
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.isFormLoading = false;
                }

            });
    }

    selectedCustomForm(form) {
        this.anyOperationInProgress = false;
        this.selectedform = form;
        this.formName = this.selectedform.formName;
        this.dataSourceId = this.selectedform.formId;
        this.gridSettings = new GridSettings();
        this.gridSettings = {
            state: {
                skip: 0,
                take: 10,

                filter: {
                    logic: "and",
                    filters: []
                }
            },
            gridData: { data: [], total: 0 },
            columnsConfig: []
        };
        this.loadTable = true;
        this.isFormLoading = false;
        this.cdRef.detectChanges();
        // this.getAllKeys();
    }

    getAllKeys() {
        this.anyOperationInProgress = true;
        this.customApplicationKeySearchModel = new CustomApplicationKeySearchModel();
        this.customApplicationKeySearchModel.customApplicationId = this.applicationId;
        this.genericFormService.getFormKeysByFormId(this.selectedform.formId).subscribe((genericFormKeys: any) => {
            const formAllKeys = genericFormKeys.data;
            this.genericFormService.getCustomApplicationKeys(this.customApplicationKeySearchModel).subscribe((result1: any) => {
                this.anyOperationInProgress = false;
                if (result1.data != null) {
                    const formKeys = result1.data;
                    this.makeColumns(this.selectedform, formAllKeys, formKeys);
                }
            });
        });
    }

    makeColumns(form, formAllKeys, formKeys) {
        const keyColumns = [];
        keyColumns.push({ field: "uniqueNumber", title: "Unique Number", hidden: false, type: "text" });
        keyColumns.push({ field: "Created User", title: "Created User", hidden: false, type: "text" });
        keyColumns.push({ field: "Updated User", title: "Updated User", hidden: false, type: "text" });
        keyColumns.push({ field: "Created Date", title: "Created Date", hidden: false, type: "text" });
        keyColumns.push({ field: "Updated Date", title: "Updated Date", hidden: false, type: "text" });
        keyColumns.push({ field: "status", title: "Status", hidden: false, type: "text" });
        const fromJson = JSON.parse(form.formJson);
        _.forEach(formAllKeys, (formKey: any) => {
            if (fromJson !== undefined && fromJson != null) {
                let updatedNewComponents = [];
                let formComponentsList = [];
                let formComponents = fromJson.Components;
                if (formComponents && formComponents.length > 0) {
                    formComponents.forEach((comp) => {
                        let values = [];
                        let keys = Object.keys(comp);
                        keys.forEach((key) => {
                            values.push(comp[key]);
                            let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                            let idx = keys.indexOf(key);
                            if (idx > -1) {
                                keys[idx] = updatedKeyName;
                            }
                        })
                        var updatedModel = {};
                        for (let i = 0; i < keys.length; i++) {
                            updatedModel[keys[i]] = values[i];
                        }
                        updatedNewComponents.push(updatedModel);
                    })
                    formComponentsList = updatedNewComponents;
                }
                formUtils.eachComponent(formComponentsList, (column) => {
                    if (column["key"] === formKey.key) {
                        const title = column["label"];
                        let isItSelected = true;
                        if (formKeys) {
                            isItSelected = _.find(formKeys, (x: any) => {
                                return x["key"] === formKey.key && x.isDefault;
                            }) != null;
                        }
                        keyColumns.push({ field: "" + formKey.key, title, hidden: !isItSelected, type: "text", format: formKey.format });
                    }
                }, false);
            }
        });

        form.columns = _.sortBy(keyColumns, "title");
        this.getAllReportsSubmitted();
    }


    getAllReportsSubmitted() {
        this.anyOperationInProgress = true;
        let userId = this.isEntryApp ? this.loggedInUserId : null;
        this.genericFormService.GetSubmittedReportsByFormId(this.selectedform.customApplicationId, this.selectedform.formId, userId, null).subscribe((result: any) => {
            this.anyOperationInProgress = false;
            if (result.success === false) {
                const validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
            this.emptyWidget = (result.data && result.data.length > 0) ? false : true;
            this.selectedform.applicationSubmitted = result.data;
            this.loadRecords = this.randomNumber();
            this.makeDataSetResult();
        });
    }

    makeDataSetResult() {
        this.anyOperationInProgress = true;
        const dataResult = [];
        let appsubmitted = [];
        appsubmitted = this.selectedform.applicationSubmitted;
        appsubmitted.forEach((genericFormData) => {
            const formJsonData = JSON.parse(genericFormData.formJson);
            formJsonData["genericFormSubmittedId"] = genericFormData.genericFormSubmittedId;
            formJsonData["uniqueNumber"] = genericFormData.uniqueNumber;
            formJsonData["status"] = genericFormData.status;
            dataResult.push(formJsonData);
        });
        this.selectedform.gridData = { data: dataResult, total: this.selectedform.applicationSubmitted.length };
        // this.gridSettings.columnsConfig = [...this.selectedform.columns];
        this.getPersistance();
        this.anyOperationInProgress = false;
    }


    pageChange({ skip, take }: PageChangeEvent): void {
        this.gridSettings.state.skip = skip;
        this.gridSettings.state.take = take;
        this.loadData(this.gridSettings.state);
    }

    public dataStateChange(state: State): void {
        this.gridSettings.state = state;
        this.gridSettings.gridData = process(this.selectedform.gridData.data, state);
        this.saveGridSettings();
    }

    public onReorder(e: any): void {
        const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
        this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
        this.saveGridSettings();
    }

    public onResize(e: any): void {
        e.forEach((item) => {
            this.gridSettings.columnsConfig.find((col) => col.field === item.column.field).width = item.newWidth;
        });
        this.saveGridSettings();
    }

    public onVisibilityChange(e: any): void {
        e.columns.forEach((column) => {
            this.gridSettings.columnsConfig.find((col) => col.field === column.field).hidden = column.hidden;
        });
        this.saveGridSettings();
    }

    public saveGridSettings(): void {
        if (this.customAppPersistance && this.customAppPersistance.length > 0) {
            const formIndex = this.customAppPersistance.findIndex(p => p.formId == this.selectedform.formId);
            if (formIndex > -1) {
                this.customAppPersistance[formIndex].columnsConfig = this.gridSettings.columnsConfig,
                    this.customAppPersistance[formIndex].state = this.gridSettings.state
            } else {
                const gridConfig = {
                    columnsConfig: this.gridSettings.columnsConfig,
                    state: this.gridSettings.state,
                    formId: this.selectedform.formId
                };
                this.customAppPersistance.push(gridConfig);
            }
        } else {
            const gridConfig = {
                columnsConfig: this.gridSettings.columnsConfig,
                state: this.gridSettings.state,
                formId: this.selectedform.formId
            };
            this.customAppPersistance.push(gridConfig);
        }
        if (this.applicationId) {
            this.savePersistance();
        }
    }

    savePersistance() {
        const persistance = new Persistance();
        if (this.applicationId) {
            persistance.referenceId = this.applicationId;
            persistance.isUserLevel = true;
            persistance.persistanceJson = JSON.stringify(this.customAppPersistance);
            this.persistanceService.UpsertPersistance(persistance).subscribe(() => {
            });
        }
    }

    getPersistance() {
        if (this.applicationId) {
            this.anyOperationInProgress = true;
            const persistance = new Persistance();
            persistance.referenceId = this.applicationId;
            persistance.isUserLevel = true;
            this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    const data = response.data;
                    if (data && data.persistanceJson) {
                        this.anyOperationInProgress = false;
                        var cols = [...this.selectedform.columns];
                        this.customAppPersistance = JSON.parse(data.persistanceJson);
                        const formIndex = this.customAppPersistance.findIndex(p => p.formId == this.selectedform.formId);
                        if (formIndex > -1) {
                            const gridSetting = this.customAppPersistance[formIndex];
                            cols.forEach((x: any) => {
                                var objIndex = gridSetting.columnsConfig.findIndex(y => y.field.toLowerCase() == x.field.toLowerCase());
                                if (objIndex > -1) {
                                    gridSetting.columnsConfig[objIndex].format = x.format;
                                }
                            });
                            this.customAppPersistance[formIndex] = gridSetting;
                        }
                        this.gridSettings = this.mapGridSettings(JSON.parse(JSON.stringify(this.customAppPersistance)));
                        this.cdRef.detectChanges();
                        // this.loadData(this.gridSettings.state);
                    } else {
                        this.anyOperationInProgress = false;
                        this.gridSettings.columnsConfig = [...this.selectedform.columns];
                        this.loadData(this.gridSettings.state);
                    }
                } else {
                    this.anyOperationInProgress = false;
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    public mapGridSettings(gridSettings: any[]) {
        const formIndex = gridSettings.findIndex(p => p.formId == this.selectedform.formId);
        if (formIndex > -1) {
            const gridSetting = gridSettings[formIndex];
            const state = gridSetting.state;
            if (gridSetting.state) {
                this.mapDateFilter(state.filter);
            }

            let gridSettignsNew = new GridSettings();
            gridSettignsNew.state = state;
            gridSettignsNew.formId = this.selectedform.formId;
            gridSettignsNew.columnsConfig = gridSetting.columnsConfig ? gridSetting.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex) : null;
            gridSettignsNew.gridData = state ? process(this.selectedform.gridData.data, state) : null;
            return gridSettignsNew;
        } else {
            let gridSettignsNew = new GridSettings();
            gridSettignsNew.state = {
                skip: 0,
                take: 10,
                filter: {
                    logic: "and",
                    filters: []
                }
            }
            const state = gridSettignsNew.state;
            if (gridSettignsNew.state) {
                this.mapDateFilter(state.filter);
            }
            gridSettignsNew.columnsConfig = [...this.selectedform.columns];
            gridSettignsNew.formId = this.selectedform.formId;
            gridSettignsNew.gridData = state ? process(this.selectedform.gridData.data, state) : null;
            return gridSettignsNew;
        }
    }

    private mapDateFilter = (descriptor: any) => {
        const filters = descriptor.filters || [];

        filters.forEach((filter) => {
            if (filter.filters) {
                this.mapDateFilter(filter);
            }
        });
    }

    private loadData(state: State): void {
        this.gridSettings.gridData = process(this.selectedform.gridData.data, state);
        this.gridSettings.columnsConfig = [...this.selectedform.columns];
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
    }

    removeHandler() { }

    editHandler(dataItem) {
        this.createANewform(this.applicationId, dataItem, true, true);
    }

    createANewform(formId, submittedForm, isEdit, isEditMain) {
        const application = new GenericFormSubmitted();
        application.customApplicationId = formId;
        application.formJson = JSON.parse(this.selectedform.formJson);
        application.formData = submittedForm;
        application.formId = this.selectedform.formId
        application.genericFormName = this.selectedform.formName;
        application.genericFormSubmittedId = submittedForm.genericFormSubmittedId;
        application.isAbleToLogin = this.selectedform.isAbleToLogin;
        let dialogId = "generic-application-component";
        const dialogRef = this.dialog.open(this.genericApplicationComponent, {
            height: "90%",
            width: "90%",
            id: dialogId,
            data: { application, isEdit, isEditMain, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.loadRecords = this.randomNumber();
            this.cdRef.detectChanges();
        })
    }

    submitFinished() {
        //this.getAllReportsSubmitted();
    }

    cellClickHandler({ dataItem }) {
        this.selectedFormId = dataItem.genericFormSubmittedId;
        if (this.selectedDashboard) {
            this.routes.navigateByUrl("dashboard-management/dashboard/" + this.selectedDashboard + '/form/' + this.selectedFormId);
        }
    }


    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.widgetService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = '';
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    filterClick() { }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    isProfileImage(event) {
        return (event.toLowerCase().trim() == "profile image");
    }

    uploadEventHandler(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const formData = new FormData();
            formData.append("file", file);
            this.uploadProfileImageInProgress = true;
            this.genericFormService.ImportFormDataFromExcel(formData, this.applicationId, null)
                .subscribe((responseData: any) => {
                    let data = JSON.stringify(responseData.data);
                    this.uploadProfileImageInProgress = false;
                    const success = responseData.success;
                    if (success) {
                        let dialogId = "generic-form-import-dialog-component";
                        const dialogRef = this.dialog.open(this.genericFormImportDialogComponent, {
                            minWidth: "85vw",
                            height: "90%",
                            id: dialogId,
                            data: { data: data, formPhysicalId: dialogId }
                        });
                        dialogRef.afterClosed().subscribe((result) => {
                            this.saveImportFunctionality(result);
                        })
                    } else {
                        this.toastr.warning("", responseData.apiResponseMessages[0].message);
                    }
                });
        }
    }

    saveImportFunctionality(data) {
        if (data) {
            data.customApplicationId = this.applicationId;
            this.anyOperationInProgress = true;
            this.genericFormService.importValidatedAppData(data)
                .subscribe((responseData: any) => {
                    this.anyOperationInProgress = false;
                    const success = responseData.success;
                    if (success) {
                        // this.getAllReportsSubmitted();
                        this.loadRecords = this.randomNumber();
                        this.cdRef.detectChanges();
                    } else {
                        this.toastr.warning("", responseData.apiResponseMessages[0].message);
                    }
                });
        }
    }

    cancelPopUp() {

    }

    shareGeniricForm() {
        var details = this.customApplicationForm.value;
        let subject : any;
        subject = details.subject;
        let message : any;
        message = this.message;
        let keysList = this.formKeysList;
        let latestRecord = this.latestRecord;
        let formSrc = JSON.parse(latestRecord.formJson);
        let keys = keysList.map(x => x.key);
        keys.forEach((key) => {
          if (subject.includes(key)) {
            subject = subject.replace("##" + key + "##", formSrc[key]);
          }
          if(message.includes(key)){
            message = message.replace("##" + key + "##", formSrc[key]);
          }
        })
        this.isShareLoading = true;
        var moduleModel = new GenericFormSubmittedSearchInputModel();
        moduleModel.customApplicationId = this.applicationId;
        moduleModel.formId = this.selectedform?.formId;
        moduleModel.userIds = details.userIds;
        moduleModel.subject = subject;
        moduleModel.message = message;

        this.genericFormService.shareGenericApplication(moduleModel).subscribe((response: any) => {
            const success = response.success;
            this.isShareLoading = false;
            if (success) {
                this.cancelApplicationPopUp();
                this.snackbar.open("Shared successfully", "", { duration: 3000 });
            }
            else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    initializeCustomApplicationForm() {
        this.sendReportForm = new FormGroup({
            userIds: new FormControl("", []
            ),
            toEmails: new FormControl("", []),
            subject: new FormControl("",
                Validators.compose([
                    Validators.required
                ])),
            body: new FormControl("",
                Validators.compose([
                    Validators.required
                ]))
        })
    }
    removeToMailId(toMail) {
        const index = this.toMailsList.indexOf(toMail);
        if (index >= 0) {
            this.toMailsList.splice(index, 1);
        }
        if (this.toMailsList.length === 0) {
            this.count = 0;
        }
    }

    getUserlistByUserId() {
        const userids = this.sendReportForm.value.userIds;
        const index = userids.indexOf(0);
        if (index > -1) {
            userids.splice(index, 1);
        }
        this.selectedUserIds = userids;
        var usersList = this.usersList;
        if (userids && usersList && usersList.length > 0) {
            var users = _.filter(usersList, function (user) {
                return userids.toString().includes(user.id);
            });
            this.selectedUserNames = users.map(x => x.fullName).toString();
            this.selectedUserEmails = users.map(x => x.email).toString();
        }
    }

    toggleAllUsersSelected() {
        if (this.allSelected.selected) {
            this.sendReportForm.controls.userIds.patchValue([...this.usersList.map((item) => item.id), 0]);

        } else {
            this.sendReportForm.controls.userIds.patchValue([]);
        }
        this.getUserlistByUserId();
    }

    toggleUserPerOne(all) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.sendReportForm.controls.userIds.value.length ===
            this.usersList.length
        ) {
            this.allSelected.select();
        }
        this.getUserlistByUserId();
    }
    addToMailIds(event: MatChipInputEvent) {
        const inputTags = event.input;
        const mailTags = event.value.trim();
        if (mailTags != null && mailTags != "") {
            let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            if (regexpEmail.test(mailTags)) {
                this.toMailsList.push(mailTags);
                this.count++;
            } else {
                // this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
            }
        }
        if (inputTags) {
            inputTags.value = " ";
        }
    }
    getUsersDropDown() {
        this.userService.GetUsersDropDown().subscribe((result: any) => {
            if (result.success === true) {
                this.usersList = result.data;
                this.cdRef.detectChanges();
            } else {
            }

        });
    }

    getFileToSendReport() {
        // this.SendWidgetReportEmail(".xlsx", this.selectedform.formName, "", this.gridSettings.gridData.data, this.gridSettings.columnsConfig);
        var toEmails = this.selectedUserEmails;
        if (this.sendReportForm.value.toEmails != null && this.sendReportForm.value.toEmails != "" && this.sendReportForm.value.toEmails != undefined) {
            toEmails = (((toEmails != null && toEmails != "" && toEmails != undefined) ? toEmails + "," : "") + this.sendReportForm.value.toEmails.toString());
        }
        var body = this.commentText;
        var subject = this.sendReportForm.value.subject.toString();
        var toEmailsList = (toEmails != undefined ? toEmails : "").split(',');
        var reportType = "queryReport";
        var formName = this.selectedform.formName;
        var data = this.records;
        var columns = this.gridSettings.columnsConfig;
        this.emailModel = { toEmails: toEmailsList, fileExtension: ".xlsx", formName, file: "", reportType, data, columns, isFromProcessApp: true, body, subject }
        this.sendXlsxReport = true;
        this.cdRef.detectChanges();
    }
    sendXlsxReportComplete(event) {
        this.sendXlsxReport = false;
        this.toastr.success("Report shared successfully");
        this.sharingisinProgress = false;
        this.closeDialog();
        this.selectedUserEmails = null;
        this.toMailsList = [];
        this.cdRef.detectChanges();
    }
    SendWidgetReportEmail(fileExtension, fileName, file, data, columns) {
        this.sharingisinProgress = true;
        var toEmails = this.selectedUserEmails;
        if (this.sendReportForm.value.toEmails != null && this.sendReportForm.value.toEmails != "" && this.sendReportForm.value.toEmails != undefined) {
            toEmails = (((toEmails != null && toEmails != "" && toEmails != undefined) ? toEmails + "," : "") + this.sendReportForm.value.toEmails.toString());
        }
        var body = this.commentText;
        var subject = this.sendReportForm.value.subject.toString();
        var toEmailsList = (toEmails != undefined ? toEmails : "").split(',');
        var reportType = "queryReport";
        this.widgetService.SendWidgetReportEmail({ toEmails: toEmailsList, fileExtension, fileName, file, reportType, data, columns, isFromProcessApp: true, body, subject }).subscribe((result: any) => {
            if (result.success === true) {
                this.toastr.success("Report shared successfully");
                this.sharingisinProgress = false;
                this.closeDialog();
                this.selectedUserEmails = null;
                this.toMailsList = [];
                this.cdRef.detectChanges();
            } else {
            }
        });
    }
    // deletePopUpOpen(rowDetails, popUp) {
    //     this.rowDetails = rowDetails;
    //     popUp.openPopover();
    // }
    closeDeletetemplateDialog() {
        this.deleteTemplatePopover.forEach((p) => p.closePopover());
    }
    deleteRecord() {
        this.widgetService.deleteDataSetById(this.rowDetails?.genericFormSubmittedId)
            .subscribe((res: any) => {
                if (res.success == true) {
                    //apps.splice(apps.findIndex(a => a.id === itemToBeRemoved.id) , 1);
                    //this.getCustomApplications();
                    this.getAllReportsSubmitted();
                }
                this.closeDeletetemplateDialog();
            })
    }

    closeDialog() {
        //   this.shareReportPopovers.forEach((p) => p.closePopover());
        if (this.shareDialog) {
            this.shareDialog.close();
            this.shareDialog.close({ success: true });
        }
        this.initializeCustomApplicationForm();
    }
    openFilterPopover() {
        //     this.gridData = grid;
        //   shareReportPopover.openPopover();
        let dialogId = "share-template-dialog";
        this.shareDialogId = dialogId;
        let id = setTimeout(() => {
            this.shareDialog = this.dialog.getDialogById(this.shareDialogId);
        }, 1200)
        const dialogRef = this.dialog.open(this.shareDialogComponent, {
            id: dialogId,
            width: "90vw",
            height: "90vh",
            maxWidth: "90vw",
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.cdRef.detectChanges();
        });

    }
    buttonDisabledInProgress(comments) {
        this.commentText = comments.event.target.innerHTML;
        if (this.commentText) {
            this.cdRef.detectChanges();
        }
    }
    exportToExcel(grid: GridComponent, form): void {
        this.excelDownload = true;
    }

    selectedMatTab(event) {
        this.selectedform = this.formsAvailable[event];
        this.formName = this.selectedform.formName;
        this.loadTable = true;
        console.log(this.selectedform);
        console.log(this.formName);
    }
    randomNumber() {
        return Math.round(Math.random() * (this.max - this.min + 1) + this.min);
    }
    syncForm() {
        this.genericFormService.backgroundLookupLink(this.applicationId, this.selectedform.formId, this.userCompanyIds)
            .subscribe((res: any) => {
                this.toastr.success("Syncing of form is progressing, please check after some time!");
            })
    }

    openSharePopUp(popUp) {
        popUp.openPopover();
    }

    closePopUp() {
        this.sharePopUps.forEach((p) => p.closePopover());
    }

    deletePopUpOpen(popUp) {
        popUp.openPopover();
    }

    deleteMultipleRecordsValuesChange(deleteRecords) {
        this.deleteRecordValues = deleteRecords;
    }


    closeDeleteMutipleDialog() {
        if (this.deleteMultiplePopUp) {
            this.deleteMultiplePopUp.forEach((p) => p.closePopover());
        }
    }

    deleteMultipleRecords(archive) {
        var inputModel = {
            GenericFormSubmittedIds: this.deleteRecordValues,
            AllowAnonymous: this.allowAnnonymous,
            Archive: archive
        }
        this.widgetService.deleteMultipleDataSets(inputModel).subscribe((response: any) => {
            if (response.success) {
                if (archive == true) {
                    if (this.deleteRecordValues.length == 1) {
                        this.toastr.success("Record is archived");
                    }
                    else {
                        this.toastr.success("Records are archived");
                    }
                }
                else {
                    if (this.deleteRecordValues.length == 1) {
                        this.toastr.success("Record is deleted");
                    }
                    else {
                        this.toastr.success("Records are deleted");
                    }
                }
                this.closeDeleteMultipleRecordsPopUp()
                this.deleteRecordValues = [];
                this.loadRecords = this.randomNumber();
            } else {
                const validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    unArchiveMultipleRecords() {
        var inputModel = {
            GenericFormSubmittedIds: this.deleteRecordValues,
            AllowAnonymous: this.allowAnnonymous,
            Archive: null
        }
        this.widgetService.unArchiveMultipleDataSets(inputModel).subscribe((response: any) => {
            if (response.success) {
                this.deleteRecordValues = [];
                this.toastr.success("Records are unarchived successfully");
                this.loadRecords = this.randomNumber();
            } else {
                const validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    deleteMultipleRecordsPopUpOpen() {
        const dialogRef = this.dialog.open(this.deleteMultipleRecordsPopUp, {
            minWidth: "auto",
            height: "auto",
            id: this.deleteMultipleRecordsPopupId,
            data: {}
        });

    }

    closeDeleteMultipleRecordsPopUp() {
        this.closeDeleteMutipleDialog();
        let docDialog = this.dialog.getDialogById(this.deleteMultipleRecordsPopupId);
        docDialog.close();

    }
    toggleArchivedRecords(archived) {
        this.deleteRecordValues = [];
        this.showArchivedRecords = archived;
        //this.getAllReportsSubmitted(this.selectedform , null,archived )
        //this.loadRecords = this.randomNumber();
    }

    clearCustomApplicationForm() {
        this.customApplicationForm = new FormGroup({
            userIds: new FormControl([], []),
            message: new FormControl("", []),
            subject: new FormControl("", []),
        })
    }

    patchApplicationForm() {
        this.customApplicationForm = new FormGroup({
            userIds: new FormControl(this.selectedList, []),
            message: new FormControl(this.sharedMessage, []),
            subject: new FormControl(this.sharedSubject, []),
        })
    }

    openShareApplication() {
        this.patchApplicationForm();
        this.message = this.sharedMessage;
        const dialogRef = this.dialog.open(this.shareApplicationComponent, {
            minWidth: "auto",
            height: "auto",
            id: this.shareApplicationComp,
            data: {}
        });
    }

    cancelApplicationPopUp() {
        let dialog = this.dialog.getDialogById(this.shareApplicationComp);
        dialog.close();
    }

    compareSelectedUsersFn(usersList: any, selectedUsers: any) {
        if (usersList === selectedUsers) {
            return true;
        } else {
            return false;
        }
    }

    emitEvent(event) {
        this.latestRecord = event;
    }

    emitFormKeys(event) {
        this.formKeysList = event;
    }

    getExcelReport(event) {
        this.records = event;
    }
}
