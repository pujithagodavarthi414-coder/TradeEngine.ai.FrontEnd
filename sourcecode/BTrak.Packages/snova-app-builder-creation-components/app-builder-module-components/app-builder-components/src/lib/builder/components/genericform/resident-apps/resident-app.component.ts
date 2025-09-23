import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {  MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { GridComponent, PageChangeEvent } from "@progress/kendo-angular-grid";
import * as formUtils from "formiojs/utils/formUtils.js";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { CustomApplicationModel } from "../models/custom-application-input.model";
import { CustomApplicationKeySearchModel } from "../models/custom-application-key-search.model";
import { CustomApplicationPersistanceModel } from "../models/custom-application-persistance.model";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { GenericFormService } from "../services/generic-form.service";
import { Observable, Subject } from "rxjs";
import { Actions } from "@ngrx/effects";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { WorkspaceList } from '../../../models/workspace-list.model';
import { SoftLabelConfigurationModel } from '../../../models/softlabels.model';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { WidgetService } from '../../../services/widget.service';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { Dashboard } from '../../../models/dashboard.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { Persistance } from '../../../models/persistance.model';

@Component({
    selector: "resident-app-details",
    templateUrl: "./resident-app.component.html"
})

export class ResidentAppComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
            this.persistanceId = data;
            this.getUserPeristance();
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Forms";
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    @ViewChild("genericApplicationComponent") genericApplicationComponent: TemplateRef<any>;

    dashboardFilters: DashboardFilterModel;
    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    persistanceId: string;
    persistanceObject: any = { skip: 0, pageSize: 20, isArchived: false, columns: [], columnsConfig: [] };
    persistanceData: any;
    applicationId: string = null;
    applicationForms: any = [];
    uploadProfileImageInProgress = false;
    customApplicationName: string;
    isFormLoading = true;
    columns: any = [];
    persistColumns = [];
    sortBy = "customApplicationName";
    sortDirection = true;
    isArchived = false;
    recordToArchive = new GenericFormSubmitted();
    selectedform: any = null;
    selectedDashboard: any = null;
    customAppHeaders: any[];
    validationMessage: string;
    anyOperationInProgress = false;
    customApplicationSearchModel: CustomApplicationSearchModel;
    public grid: GridComponent;
    customApplicationList: CustomApplicationModel[] = [];
    persistance: CustomApplicationPersistanceModel;
    customApplicationKeySearchModel: CustomApplicationKeySearchModel;
    public buttonCount = 5;
    public info = true;
    public type: "numeric" | "input" = "numeric";
    public pageSizes = true;
    public previousNext = true;
    importedData: any[];
    selectedFormId: any;
    workspacesList$: Observable<WorkspaceList[]>;
    workspaces: WorkspaceList[];

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    constructor(private routes: Router, public dialog: MatDialog,
        private softLabelPipe: SoftLabelPipe, private toastr: ToastrService, private genericFormService: GenericFormService,
        private cdRef: ChangeDetectorRef, private actionUpdates$: Actions,
        private snackbar: MatSnackBar, private translateService: TranslateService, private widgetService: WidgetService) {
        super();

    }

    ngOnInit() {
        super.ngOnInit();
        this.getCustomApplications();
        this.getSoftLabels();
        this.loadWorkspaces();
    }

    getSoftLabels() {
        this.softLabels = localStorage.getItem(LocalStorageProperties.SoftLabels) ? JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels)) : [];
    }

    getCustomApplications() {
        const customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.sortBy = this.sortBy;
        customApplicationSearchModel.sortDirectionAsc = this.sortDirection;
        customApplicationSearchModel.pageNumber = 1;
        customApplicationSearchModel.pageSize = 10000;
        customApplicationSearchModel.isArchived = false;
        this.isFormLoading = true;
        this.genericFormService.getCustomApplication(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                if (responseData.success === true) {
                    const applicationsList = responseData.data;
                    if (applicationsList != null && applicationsList.length > 0) {
                        applicationsList.forEach((app) => {
                            if (this.customApplicationList.findIndex((p) => p.customApplicationId === app.customApplicationId) < 0) {
                                this.customApplicationList.push(app);
                            }
                        });
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    getRelativeForms(selectedAppId, isFromPersistance) {
        this.applicationId = selectedAppId;
        this.isFormLoading = true;
        this.customApplicationSearchModel = new CustomApplicationSearchModel();
        this.customApplicationSearchModel.customApplicationId = JSON.parse(JSON.stringify(this.applicationId));
        this.genericFormService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
            if (result.success === true) {
                this.applicationForms = result.data;
                this.customApplicationName = result.data[0].customApplicationName;
                this.anyOperationInProgress = false;
                if (isFromPersistance === true) {
                    const index = this.applicationForms.findIndex((p) =>
                        p.formId.toLowerCase() === this.persistance.customFormId.toLowerCase());
                    if (index > -1) {
                        this.selectedForm(this.applicationForms[index], true);
                    }
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.anyOperationInProgress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getUserPeristance() {
        if (this.dashboardId) {
            this.anyOperationInProgress = true;
            const persistanceModel = new CustomApplicationPersistanceModel();
            persistanceModel.dashboardId = this.dashboardId;
            this.genericFormService.getCustomAppDashboardPersistance(persistanceModel).subscribe((result: any) => {
                if (result.success === true) {
                    if (result.data !== null) {
                        this.persistance = new CustomApplicationPersistanceModel();
                        this.persistance = result.data;
                        this.selectedDashboard = this.persistance.dashboardIdToNavigate;
                        // this.getRelativeForms(this.persistance.customApplicationId, true);
                        this.getPersistance(this.persistance.customApplicationId);
                    } else {
                        this.anyOperationInProgress = false;
                    }
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.anyOperationInProgress = false;
                }
                this.cdRef.detectChanges();
            })
        }
    }

    onVisibilityChange(event) {
        let columns = event.columns;
        if (columns && columns.length > 0) {
            // this.columns = [];
            for (let i = 0; i < columns.length; i++) {
                let object = {};
                object['field'] = columns[i].field;
                object['hidden'] = columns[i].hidden;
                let index = this.persistColumns.findIndex(x => x.field == columns[i].field);
                if (index == -1)
                    this.persistColumns.push(object);
                else {
                    this.persistColumns[index].field = columns[i].field;
                    this.persistColumns[index].hidden = columns[i].hidden;
                }
            }
            this.configureHideColumns(this.selectedform);
            this.persistColumns = this.selectedform.columns;
            this.updatePersistanceObject(this.selectedform.skip, this.selectedform.pageSize);
            this.updatePersistance();
        }
    }

    onReorder(e) {
        // const columns = grid.columns;

        // const gridConfig = {
        //     columnsConfig: columns.toArray().map(item => {
        //         return Object.keys(item)
        //             .filter(propName => !propName.toLowerCase()
        //                 .includes('template'))
        //             .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <any>{});
        //     })
        // };

        const reorderedColumn = this.selectedform.columns.splice(e.oldIndex, 1);
        this.selectedform.columns.splice(e.newIndex, 0, ...reorderedColumn);
        this.persistColumns = this.selectedform.columns;
        this.updatePersistanceObject(this.selectedform.skip, this.selectedform.pageSize);
        // this.persistanceObject['columnsConfig'] = grid.columns._results;
        // this.persistanceObject['columnsConfig'] = grid.columns._results;
        this.updatePersistance();
    }

    checkVisibility(fieldName) {
        let index = this.persistColumns.findIndex(x => x.field == fieldName);
        if (index != -1) {
            return this.persistColumns[index].hidden;
        }
        else {
            return false;
        }
    }

    updatePersistanceObject(skip, take) {
        let object = {};
        object['skip'] = skip;
        object['pageSize'] = take;
        object['isArchived'] = this.isArchived;
        object['columns'] = this.persistColumns;
        this.persistanceObject = object;
    }

    updatePersistance() {
        let persistance = new Persistance();
        if (this.persistanceId) {
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = true;
            persistance.persistanceJson = JSON.stringify(this.persistanceObject);
            this.genericFormService.UpsertPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    // this.persistanceId = response.data;
                }
            });
        }
    }

    getPersistance(customApplicationId) {
        if (this.persistanceId) {
            let persistance = new Persistance();
            persistance.referenceId = this.persistanceId;
            persistance.isUserLevel = true;
            this.genericFormService.GetPersistance(persistance).subscribe((response: any) => {
                if (response.success) {
                    if (response.data) {
                        let result = response.data;
                        this.persistanceData = JSON.parse(result.persistanceJson);
                        this.setPersistanceValues(this.persistanceData);
                        this.getRelativeForms(customApplicationId, true);
                    }
                    else {
                        this.getRelativeForms(customApplicationId, true);
                    }
                }
                else {
                    this.getRelativeForms(customApplicationId, true);
                }
            });
        }
        else {
            this.getRelativeForms(customApplicationId, true);
        }
    }

    setPersistanceValues(data) {
        // this.selectedform.skip = data.skip;
        // this.selectedform.pageSize = data.pageSize;
        this.persistColumns = data.columns ? data.columns : [];
        this.isArchived = data.isArchived;
        // let finalList = columns.sort((a, b) => a.orderIndex - b.orderIndex);
        this.cdRef.detectChanges();
    }

    archiveFilterApplied() {
        this.selectedform.pageSize = 10;
        this.selectedform.skip = 0;
        this.updatePersistanceObject(this.selectedform.skip, this.selectedform.pageSize);
        this.updatePersistance();
        this.getAllReportsSubmitted(this.selectedform);
    }

    selectedForm(form, isFromPersistance) {
        this.anyOperationInProgress = true;
        this.selectedform = form;
        this.isArchived = this.persistanceData ? this.persistanceData.isArchived : this.isArchived;
        this.selectedform.gridData = { data: [], total: 0 };
        this.selectedform.pageSize = this.persistanceData ? this.persistanceData.pageSize : 10;
        this.selectedform.skip = this.persistanceData ? this.persistanceData.skip : 0;
        this.selectedform.gridDataResult = { data: [], total: 0 };
        this.isFormLoading = false;
        this.cdRef.detectChanges();
        this.getAllKeys(this.selectedform);
        if (isFromPersistance === false) {
            this.saveUserPersistance(form.formId);
        }
    }

    onDashboardSelected(workspaceId) {
        this.selectedDashboard = workspaceId;
        this.saveUserPersistance(this.selectedform.formId);
    }

    saveUserPersistance(formId) {
        if (this.dashboardId) {
            const persistanceInputModel = new CustomApplicationPersistanceModel();
            persistanceInputModel.customFormId = formId;
            persistanceInputModel.customApplicationId = this.applicationId;
            persistanceInputModel.dashboardId = this.dashboardId;
            persistanceInputModel.dashboardIdToNavigate = this.selectedDashboard;
            this.genericFormService.setCustomAppDashboardPersistance(persistanceInputModel).subscribe((result: any) => {
                if (result.success === true) {
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
        }
    }

    getAllKeys(form) {
        this.anyOperationInProgress = true;
        this.customApplicationKeySearchModel = new CustomApplicationKeySearchModel();
        this.customApplicationKeySearchModel.customApplicationId = this.applicationId;
        this.genericFormService.getFormKeysByFormId(form.formId).subscribe((genericFormKeys: any) => {
            const formAllKeys = genericFormKeys.data;
            this.genericFormService.getCustomApplicationKeys(this.customApplicationKeySearchModel).subscribe((result1: any) => {
                this.anyOperationInProgress = false;
                if (result1.data != null) {
                    const formKeys = result1.data;
                    this.makeColumns(form, formAllKeys, formKeys);
                    this.configureHideAfterColumns(form);
                    // this.reOrderHideColumns(form);
                    this.getAllReportsSubmitted(form);
                }
            });
        });
    }

    makeColumns(form, formAllKeys, formKeys) {
        this.anyOperationInProgress = true;
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
                const formComponents = fromJson["components"];
                formUtils.eachComponent(formComponents, (column) => {
                    if (column["key"] === formKey.key) {
                        const title = column["label"];
                        let isItSelected = true;
                        if (formKeys) {
                            isItSelected = _.find(formKeys, (x: any) => {
                                return x["key"] === formKey.key && x.isDefault;
                            }) != null;
                        }
                        keyColumns.push({ field: "" + formKey.key, title, hidden: !isItSelected, type: "text" });
                    }
                }, false);
            }
        });
        keyColumns.push({ field: "actions", title: "Actions", hidden: false, type: "text" });
        // form.columns = _.sortBy(keyColumns, "title");
        form.columns = keyColumns;
        // this.cdRef.detectChanges();
    }

    getAllReportsSubmitted(form) {
        this.anyOperationInProgress = true;
        this.genericFormService.GetSubmittedReportsByFormId(this.applicationId, form.formId, null, this.isArchived).subscribe((result: any) => {
            this.anyOperationInProgress = false;
            if (result.success === false) {
                const validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
            else {
                form.applicationSubmitted = result.data;
                this.makeDataSetResult(form);
            }
        });
    }

    configureHideColumns(form) {
        if (form.columns) {
            for (let i = 0; i < this.persistColumns.length; i++) {
                let index = form.columns.findIndex(x => x.field == this.persistColumns[i].field);
                if (index != -1) {
                    form.columns[index].hidden = this.persistColumns[i].hidden;
                }
            }
            let hideColumns = [];
            let orderColumns = [];
            for (let i = 0; i < form.columns.length; i++) {
                if (!form.columns[i].hidden) {
                    hideColumns.push(form.columns[i]);
                }
            }
            for (let i = 0; i < form.columns.length; i++) {
                if (form.columns[i].hidden) {
                    orderColumns.push(form.columns[i]);
                }
            }
            // orderColumns = orderColumns.sort((a, b) => a.orderIndex - b.orderIndex);
            hideColumns.push(...orderColumns);
            form.columns = hideColumns;
            this.cdRef.detectChanges();
        }
    }

    configureHideAfterColumns(form) {
        if (form.columns) {
            let value = false;
            if (this.persistColumns && this.persistColumns.length > 0 && form.columns.length == this.persistColumns.length) {
                for (let i = 0; i < this.persistColumns.length; i++) {
                    let index = form.columns.findIndex(x => x.field == this.persistColumns[i].field);
                    if (index != -1) {
                        form.columns[index].hidden = this.persistColumns[i].hidden;
                        value = false;
                    }
                    else {
                        this.persistColumns = [];
                        value = true;
                    }
                }
                if (!value)
                    this.reOrderHideColumns(form);
                else
                    this.makeDefaultColumns(form);
            }
            else {
                this.persistColumns = [];
                this.makeDefaultColumns(form);
            }
        }
    }

    makeDefaultColumns(form) {
        let resultColumns = [];
        for (let i = 0; i < form.columns.length; i++) {
            if (!form.columns[i].hidden) {
                resultColumns.push(form.columns[i]);
            }
        }
        for (let i = 0; i < form.columns.length; i++) {
            if (form.columns[i].hidden) {
                resultColumns.push(form.columns[i]);
            }
        }
        // orderColumns = orderColumns.sort((a, b) => a.orderIndex - b.orderIndex);
        form.columns = resultColumns;
        this.cdRef.detectChanges();
    }

    reOrderHideColumns(form) {
        if (form.columns) {
            let finalColumns = [];
            for (let i = 0; i < this.persistColumns.length; i++) {
                let index = form.columns.findIndex(x => x.field == this.persistColumns[i].field);
                if (index != -1) {
                    finalColumns.push(form.columns[index]);
                }
            }
            form.columns = finalColumns;
            this.cdRef.detectChanges();
        }
    }

    makeDataSetResult(form) {
        this.anyOperationInProgress = true;
        const dataResult = [];
        let appsubmitted = [];
        appsubmitted = form.applicationSubmitted;
        appsubmitted.forEach((genericFormData) => {
            const formJsonData = JSON.parse(genericFormData.formJson);
            formJsonData["genericFormSubmittedId"] = genericFormData.genericFormSubmittedId;
            formJsonData["uniqueNumber"] = genericFormData.uniqueNumber;
            formJsonData["status"] = genericFormData.status;
            dataResult.push(formJsonData);
        });
        form.gridDataResult = { data: dataResult, total: form.applicationSubmitted.length }
        this.loadData(form.gridDataResult, form);
        this.anyOperationInProgress = false;
    }

    pageChange({ skip, take }: PageChangeEvent, form): void {
        form.skip = skip;
        form.pageSize = take;
        this.updatePersistanceObject(skip, take);
        this.updatePersistance();
        this.loadData(form.gridDataResult, form);
    }

    private loadData(gridDataResult, form): void {
        this.anyOperationInProgress = true;
        form.gridData = {
            data: gridDataResult.data.slice(form.skip, form.skip + form.pageSize, form.state),
            total: gridDataResult.data.length
        };
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
    }

    public exportToExcel(grid: GridComponent, form): void {
        this.anyOperationInProgress = true;
        let exportgrid: GridComponent;
        exportgrid = grid;
        exportgrid.data = this.selectedform.gridDataResult.data;
        exportgrid.saveAsExcel();
        this.loadData(this.selectedform.gridDataResult, form);
        this.anyOperationInProgress = false;
    }

    removeHandler() { }

    editHandler(dataItem, form) {
        this.createANewform(this.applicationId, dataItem, form)
    }

    changeArchive(dataItem, form, deleteConfigurationPopup) {
        this.recordToArchive = new GenericFormSubmitted();
        this.recordToArchive.customApplicationId = this.applicationId;
        this.recordToArchive.formJson = JSON.stringify(dataItem);
        this.recordToArchive.formId = form.formId
        this.recordToArchive.genericFormName = form.formName;
        this.recordToArchive.genericFormSubmittedId = dataItem.genericFormSubmittedId;
        this.recordToArchive.isAbleToLogin = form.isAbleToLogin;
        this.recordToArchive.timeStamp = dataItem.timeStamp;
        const genericFormData = new GenericFormSubmitted();
        genericFormData.genericFormSubmittedId = dataItem.genericFormSubmittedId;
        genericFormData.isArchived = this.isArchived;
        this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
            if (responses.success == true && responses.data.length > 0) {
                this.recordToArchive.timeStamp = responses.data[0].timeStamp;
                deleteConfigurationPopup.openPopover();
                this.cdRef.detectChanges();
            }
        });
    }

    cancelArchive() {
        this.recordToArchive = new GenericFormSubmitted();
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    saveArchive() {
        let genericForm = new GenericFormSubmitted();
        genericForm = new GenericFormSubmitted();
        genericForm.formJson = this.recordToArchive.formJson;
        genericForm.customApplicationId = this.recordToArchive.customApplicationId;
        genericForm.formId = this.recordToArchive.formId;
        genericForm.isAbleToLogin = this.recordToArchive.isAbleToLogin;
        genericForm.genericFormSubmittedId = this.recordToArchive.genericFormSubmittedId;
        genericForm.timeStamp = this.recordToArchive.timeStamp;
        genericForm.isArchived = !this.isArchived;
        this.genericFormService.submitGenericApplication(genericForm).subscribe((result: any) => {
            if (result.success == true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                this.snackbar.open(this.translateService.instant('GENERICFORM.UPDATEDSUCCESSFULLY'), "Ok", { duration: 3000 });
                this.archiveFilterApplied();
            } else {
                const validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        })
    }

    createANewform(formId, submittedForm, form) {
        const application = new GenericFormSubmitted();
        application.customApplicationId = formId;
        application.formJson = JSON.parse(form.formJson);
        application.formData = submittedForm;
        application.formId = form.formId
        application.genericFormName = form.formName;
        application.genericFormSubmittedId = submittedForm.genericFormSubmittedId;
        application.isAbleToLogin = form.isAbleToLogin;
        let dialogId = "generic-application-component";
        const dialogRef = this.dialog.open(this.genericApplicationComponent, {
            height: "90%",
            width: "90%",
            id: dialogId,
            data: { application, formPhysicalId: dialogId }
        });
    }

    submitFinished() {
        this.getAllReportsSubmitted(this.selectedform);
    }

    cellClickHandler({ isEdited, dataItem, rowIndex }) {
        this.selectedFormId = dataItem.genericFormSubmittedId;
        if (this.workspaces && this.workspaces.length > 0) {
            if (this.selectedDashboard) {
                this.routes.navigateByUrl("dashboard-management/dashboard/" + this.selectedDashboard + '/form/' + this.selectedFormId);
                this.dialog.closeAll();
            }
            this.cdRef.detectChanges();
        }
    }

    loadWorkspaces() {
        let workspacelist = new WorkspaceList();
        workspacelist.workspaceId = "null";
        workspacelist.isHidden = false;
        this.widgetService.GetWorkspaceList(workspacelist).subscribe((response: any) => {
            if (response.success === true) {
                this.workspaces = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });

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

    filterClick() {

    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    isProfileImage(event) {
        return (event.toLowerCase().trim() == "profile image");
    }
}
