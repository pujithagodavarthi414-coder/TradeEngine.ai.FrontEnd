import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ComponentModel } from "@snovasys/snova-comments";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { SoftLabelPipe } from '../../pipes/soft-labels.pipe';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Dashboard } from '../../models/dashboard.model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
    selector: "app-custom-comments",
    templateUrl: "custom-comments-app.component.html"
})

export class CustomCommentAppComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.referenceId) {
            this.referenceId = data;
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Comments app";
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
    }

    dashboardFilters: DashboardFilterModel;
    referenceId: string;
    moduleTypeId = 79;
    componentModel: ComponentModel = new ComponentModel();
    isEditAppName: boolean = false;
    changedAppName: string;
    dashboardName: string;
    validationMessage: string;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    constructor(
        public dialog: MatDialog,
        private softLabelPipe: SoftLabelPipe,
        public toaster: ToastrService,
        public snackbar: MatSnackBar,
        private cookieService: CookieService,
        public cdRef: ChangeDetectorRef,
        public dashboardService: DashboardService,
        public translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        // setting component model to pass default variable values
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => {
            component.componentModel.commentsCount = commentsCount;
        });
    }
    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.referenceId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.dashboardService.updateDashboardName(dashBoardModel)
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
