import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "underscore";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { GenericFormService } from "../services/generic-form.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import {  MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subject } from "rxjs";
import { Actions } from "@ngrx/effects";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { WorkspaceList } from '../../../models/workspace-list.model';
import { SoftLabelConfigurationModel } from '../../../models/softlabels.model';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { TranslateService } from '@ngx-translate/core';
import { WidgetService } from '../../../services/widget.service';
import { Dashboard } from '../../../models/dashboard.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';

@Component({
    selector: "app-resident-details",
    templateUrl: "resident-details.component.html"
})

export class ResidentDetailsComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChild("formio") formio;
    @ViewChild("genericApplicationComponent") genericApplicationComponent: TemplateRef<any>;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Form details";
        }
    }
    formId: string;
    genericFormDetails: any;
    formSrc: any = null;
    selectedDashboard: any = null;
    formData: any = { data: {} };
    isFormLoading = false;
    submittedData: any;
    workspacesList$: Observable<WorkspaceList[]>;
    workspaces: WorkspaceList[];
    public ngDestroyed$ = new Subject();
    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    validationMessage: string;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    oldFormId: string = null;

    // tslint:disable-next-line: max-line-length
    constructor(private toastr: ToastrService, private softLabelPipe: SoftLabelPipe,
        private route: ActivatedRoute, private genericFormService: GenericFormService, private translateService: TranslateService, private widgetService: WidgetService,
        private cdRef: ChangeDetectorRef, public dialog: MatDialog, private actionUpdates$: Actions, private snackbar: MatSnackBar,
        private routes: Router) {
        super();
        this.route.params.subscribe((params) => {
            if (params["formid"] != null && params["formid"] !== undefined) {
                this.formId = params["formid"];
                this.getSubmittedFormData();
            }
        });

        this.routes.events.subscribe((p) => {
            if(p["url"] != null){
                var ValueList = [];
                ValueList = p["url"].split("/");
                var len = ValueList.length;
                if(ValueList[len-1] != this.oldFormId){
                    this.oldFormId = ValueList[len-1];
                    this.formId = this.oldFormId;
                    this.getSubmittedFormData();
                }
            }
        });

    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.loadWorkspaces();
        if (document.querySelector != null && document.querySelector != undefined && document.querySelector(".formio-loader-wrapper") != null && document.querySelector(".formio-loader-wrapper") != undefined && (document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }

    getSoftLabels() {
        this.softLabels = localStorage.getItem(LocalStorageProperties.SoftLabels) ? JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels)) : [];
    }

    getSubmittedFormData() {
        if (this.formId) {
            this.isFormLoading = true;
            let genericFormSubmitted = new GenericFormSubmitted();
            genericFormSubmitted.genericFormSubmittedId = this.formId;
            genericFormSubmitted.isArchived = false;
            this.genericFormService.getSubmittedReportByFormReportId(genericFormSubmitted).subscribe((responses: any) => {
                this.genericFormDetails = responses.data[0];
                const genericFormDetails = responses.data[0].formJson;
                this.formSrc = JSON.parse(this.genericFormDetails.formSrc);
                this.formData.data = JSON.parse(genericFormDetails);
                this.isFormLoading = false;
                if ((document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
                    (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
                }
                this.cdRef.detectChanges();
            });
            this.cdRef.detectChanges();
        }
    }

    ngAfterViewInit() {
        if ((document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }


    loadWorkspaces() {
        if (this.formId) {
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
    }

    navigateToAnalyticsDashboard(workspaceId) {
        this.selectedDashboard = workspaceId;
        if (this.workspaces && this.workspaces.length > 0) {
            this.routes.navigateByUrl("dashboard-management/dashboard/" + workspaceId + '/form/' + this.formId);
            this.cdRef.detectChanges();
        }
    }

    submitFormDetails() {
        const application = new GenericFormSubmitted();
        application.customApplicationId = this.genericFormDetails.customApplicationId;
        application.formJson = JSON.parse(this.genericFormDetails.formSrc);
        application.formData = JSON.stringify(this.formio.formio.data);
        application.formId = this.genericFormDetails.formId;
        application.genericFormName = this.genericFormDetails.formName;
        application.genericFormSubmittedId = this.genericFormDetails.genericFormSubmittedId;
        application.isAbleToLogin = this.genericFormDetails.isAbleToLogin;
        let dialogId = "generic-application-component";
        const dialogRef = this.dialog.open(this.genericApplicationComponent, {
            height: "90%",
            width: "90%",
            id: dialogId,
            data: { application, formPhysicalId: dialogId }
        });
    }

    submitFinished() {
        this.getSubmittedFormData();
    }

    editAppName() {
        if (this.dashboardId) {
            this.isEditAppName = true;
            this.changedAppName = this.dashboardName;
        }
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

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }
}
