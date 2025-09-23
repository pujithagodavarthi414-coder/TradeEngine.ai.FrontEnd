import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as SharedState from "../store/reducers/index";
import { CustomFormsComponent } from "./custom-form.component";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Dashboard } from '../models/dashboard';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { CustomFieldService } from '../servicces/custom-field.service';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
    selector: "app-hr-custom-fields",
    templateUrl: "custom-fields-app.component.html"
})

export class CustomFieldAppComponent extends CustomAppBaseComponent implements OnInit {
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
            this.dashboardName = "Custom fields";
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
        if (this.dashboardFilters && this.dashboardFilters.userId && this.dashboardFilters.userId !== "") {
            this.referenceId = this.dashboardFilters.userId;
        } else if (this.userIdFromRoute) {
            this.referenceId = this.userIdFromRoute;
        } else {
            this.referenceId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
    }

    isreload: string;
    dashboardFilters: DashboardFilterModel;
    referenceId: string;
    referenceTypeId: string;
    dashboardId: string;
    moduleTypeId = 4;
    isEditAppName = false;
    changedAppName: string;
    dashboardName: string;
    validationMessage: string;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    userIdFromRoute: string = null;

    constructor(
        sharedStore: Store<SharedState.State>,
        public dialog: MatDialog,
        private softLabelPipe: SoftLabelPipe,
        public toaster: ToastrService,
        public snackbar: MatSnackBar,
        private cookieService: CookieService,
        private router: Router,
        public cdRef: ChangeDetectorRef,
        public widgetService: CustomFieldService,
        public translateService: TranslateService) {
        super();
        this.moduleTypeId = 4;
        this.referenceId = "940C1666-DF7F-4796-BEA3-3AB0D8911A0A";
        this.referenceTypeId = "940C1666-DF7F-4796-BEA3-3AB0D8911A0A"
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.router.url.includes("profile") && this.router.url.split("/")[3]) {
            this.userIdFromRoute = this.router.url.split("/")[3];
        }
        if (this.userIdFromRoute) {
            this.referenceId = this.userIdFromRoute
        }
    }

    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: "62%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            data: {
                moduleTypeId: this.moduleTypeId,
                referenceId: this.referenceId,
                referenceTypeId: this.referenceTypeId,
                customFieldComponent: null,
                isButtonVisible: true
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        formsDialog.componentInstance.closeMatDialog.subscribe(() => {
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
            this.cdRef.detectChanges();
            // this.dialog.closeAll();
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
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success),
                            { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = "";
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toaster.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toaster.warning("", message);
        }
    }

    keyUpFunction(event) {
        if (event.keyCode === 13) {
            this.updateAppName();
        }
    }
}
