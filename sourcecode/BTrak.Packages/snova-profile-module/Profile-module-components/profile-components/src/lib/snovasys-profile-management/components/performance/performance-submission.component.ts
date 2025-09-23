import { Component, OnInit, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { PerformanceConfigurationModel } from "../../models/performanceConfigurationModel";
import { StatusreportService } from "../../services/statusreport.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { PerformanceSubmissionModel } from "../../models/performance-submission.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as introJs from 'intro.js/intro.js';
import { SoftLabelPipe } from "../../pipes/soft-labels.pipe";

@Component({
    selector: "app-profile-performance-submission",
    templateUrl: "./performance-submission.component.html"
})

export class PerformanceSubmissionComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteConfigurationPopup") deleteConfigurationPopup;
    isAnyOperationIsInprogress: boolean;
    validationMessage: string;
    selectedTab = 0;
    selectedMenuIndex = 0;
    isOpen: boolean;
    isShare: boolean;
    showInviteeReview: boolean;
    ofUserId: string;
    submittedBy: string;
    configurationId: string;
    performanceId: string;
    inviteeName: string;
    isMainMenu = true;
    formJson: any;
    formData = { data: {} };
    inviteeformData = { data: {} };
    performanceConfigurations: PerformanceConfigurationModel[] = [];
    performanceDetailsId: string;
    performanceSubmissions: GridDataResult;
    allPerformanceSubmissions: any[] = [];
    showUsersList: boolean;
    closedPerformances = { data: [], total: 0 };
    sortBy: string;
    pdfUrl: string;
    searchText: string;
    isCompleted = false;
    isinviteeCompleted = false;
    sortDirection: boolean;
    isNavigationRequired: boolean;
    pageable: boolean = false;
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    state: State = {
        skip: 0,
        take: 10,
    };
    inviteeState: State = {
    };
    isOwner = false;
    isInvitee = false;
    performanceForm = new FormGroup({
        selectedRoles: new FormControl([], [
            Validators.required
        ])
    });
    isManager = false;
    userIds: any[] = [];
    usersDropdown: any[] = [];
    allUserList: any[] = [];
    performances: PerformanceSubmissionModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    selectedConfigurationId: string;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    public basicForm = { components: [] };
    employeeId: string;
    ofUserName: string;

    constructor(
        public dialog: MatDialog, private statusreportService: StatusreportService,
        private toastr: ToastrService, public googleAnalyticsService: GoogleAnalyticsService,
        public translateService: TranslateService, private route: ActivatedRoute,
        private cookieService: CookieService, private routes: Router, private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService,private softLabel: SoftLabelPipe) {
        super();
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.ofUserId = this.routes.url.split("/")[3];
        this.performanceForm = new FormGroup({
            selectedRoles: new FormControl([], [
                Validators.required
            ])
        });
        this.submittedBy = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        if (this.ofUserId.toString().toLowerCase() == this.submittedBy.toString().toLowerCase()) {
            this.isOwner = true;
        } else {
            this.isOwner = false;
        }
        this.isMainMenu = true;
        if (this.canAccess_feature_CanAccessPerformance == true) {
            this.checkIsManager();
            this.state = {
                skip: 0,
                take: 10
            };
            this.searchText = null;
            this.getPerformances();
            this.getPerformanceConfigurations();
        }
        this.getUsers();
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#pf-1',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.PF-1'),this.softLabels),
                    position: 'bottom'
                },
                {
                    element: '#pf-2',
                    intro: this.translateService.instant('INTROTEXT.PF-2'),
                    position: 'bottom'
                },
            ]
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getUsers() {
        this.dashboardService.getUsersDropDown('').subscribe((response: any) => {
            this.allUserList = response.data;
            const index = this.allUserList.findIndex((p) => p.id.toString().toLowerCase() == this.ofUserId.toString().toLowerCase());
            if (index > -1) {
                this.allUserList.splice(index, 1);
            }
            this.usersDropdown = this.allUserList;
            this.userIds = this.usersDropdown.map(x => x.id);
        });
    }

    checkIsInvitee() {
        this.isInvitee = false;
        this.cdRef.detectChanges();
        const performancedummy = new PerformanceSubmissionModel();
        performancedummy.performanceId = this.performanceId;
        performancedummy.submissionFrom = 2;
        this.statusreportService.GetPerformanceDetails(performancedummy).subscribe((response: any) => {
            if (response.success === true && response.data && response.data.length > 0) {
                response.data.forEach((p) => {
                    if (p.submittedBy.toString().toLowerCase() == this.submittedBy.toString().toLowerCase()) {
                        this.isInvitee = true;
                        this.cdRef.detectChanges();
                    }
                });
            }
        });
    }

    checkIsManager() {
        this.isManager = false;
        this.dashboardService.GetEmployeeReportToMembers(this.ofUserId).subscribe((result: any) => {
            if (result.success === true && result.data && result.data.length > 0) {
                result.data.forEach((user) => {
                    if ((user.id.toString().toLowerCase() == this.submittedBy.toString().toLowerCase()) && (user.id.toString().toLowerCase() != this.ofUserId.toString().toLowerCase())) {
                        this.isManager = true;
                        this.cdRef.detectChanges();
                    }
                });
            }
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getPerformances();
    }

    getPerformances() {
        this.isAnyOperationIsInprogress = true;
        const performance = new PerformanceSubmissionModel();
        performance.isOpen = this.selectedTab == 0 ? true : false;
        performance.isArchived = false;
        performance.ofUserId = this.ofUserId;
        performance.pageSize = this.state.take;
        performance.pageNumber = (this.state.skip / this.state.take) + 1;
        performance.sortBy = this.sortBy;
        performance.searchText = this.searchText;
        performance.sortDirectionAsc = this.sortDirection;
        this.statusreportService.GetPerformanceSubmissions(performance).subscribe((result: any) => {
            if (result.success === true) {
                this.performances = result.data;
                if(this.performances && this.performances.length > 0) {
                    this.employeeId = this.performances[0].employeeId;
                    this.ofUserName = this.performances[0].ofUserName;
                }
                this.closedPerformances = {
                    data: result.data,
                    total: result.data.length > 0 ? result.data[0].totalCount : 0
                };
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
        });
    }

    getPerformanceConfigurations() {
        this.isAnyOperationIsInprogress = true;
        const configModel = new PerformanceConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = false;
        configModel.considerRole = true;
        configModel.ofUserId = this.ofUserId;
        this.statusreportService.GetPerformanceConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.performanceConfigurations = result.data;
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    selectedMatTab(event) {
        this.selectedTab = event.tab.textLabel == "ACTIVEREVIEWS" ? 0 : event.tab.textLabel == "PASTREVIEWS" ? 1 : 0;
        this.state = {
            skip: 0,
            take: 10
        };
        this.closedPerformances = {
            data: [],
            total: 0
        };
        this.searchText = null;
        this.getPerformances();
    }

    selectedMenuMatTab(event) {
        this.isAnyOperationIsInprogress = true;
        this.selectedMenuIndex = event.tab.textLabel == "EMPLOYEE" ? 0 : event.tab.textLabel == "MANAGER" ? 1 :
            event.tab.textLabel == "360" ? 2 : 0;
        this.showInviteeReview = false
        this.getFormSubmissionDetails();
    }

    resumePerformance(row) {
        this.getUsers();
        this.performanceId = row.performanceId;
        this.configurationId = row.configurationId;
        this.isOpen = row.isOpen;
        this.pdfUrl = row.pdfUrl;
        this.isShare = row.isShare;
        this.formJson = row.formJson ?
            JSON.parse(row.formJson) : Object.assign({}, this.basicForm);
        this.selectedMenuIndex = 0;
        this.isMainMenu = false;
        this.isInvitee = false;
        this.checkIsInvitee();
        this.getFormSubmissionDetails();
    }

    getFormSubmissionDetails() {
        this.isAnyOperationIsInprogress = true;
        const performance = new PerformanceSubmissionModel();
        performance.performanceId = this.performanceId;
        performance.submissionFrom = this.selectedMenuIndex;
        this.statusreportService.GetPerformanceDetails(performance).subscribe((result: any) => {
            if (result.success === true) {
                if (this.selectedMenuIndex == 2) {
                    this.allPerformanceSubmissions = [];
                    this.formData = { data: {} };
                    this.isCompleted = false;
                    const usersData = this.allUserList;
                    this.usersDropdown = this.allUserList;
                    this.userIds = this.usersDropdown.map(x => x.id);
                    result.data.forEach((perform) => {
                        perform.formData = perform.formData ? JSON.parse(perform.formData) : { data: {} };
                        if (perform.submittedBy.toString() == this.submittedBy.toString().toLowerCase()) {
                            this.formData = perform.formData;
                            this.isCompleted = perform.isCompleted;
                            this.performanceDetailsId = perform.performanceDetailsId;
                        }
                        // tslint:disable-next-line: max-line-length
                        const index = this.usersDropdown.findIndex((p) => p.id.toString().toLowerCase() == perform.submittedBy.toString().toLowerCase());
                        if (index > -1) {
                            this.usersDropdown.splice(index, 1);
                            this.userIds = this.usersDropdown.map(x => x.id);
                        }
                    });
                    this.allUserList = usersData;
                    this.allPerformanceSubmissions = result.data;
                    this.performanceSubmissions = {
                        data: this.allPerformanceSubmissions,
                        total: this.allPerformanceSubmissions.length
                    };
                } else {
                    if (result.data.length > 0) {
                        const selectedData = result.data[0];
                        this.isCompleted = selectedData.isCompleted;
                        this.formData = selectedData.formData ? JSON.parse(selectedData.formData) : { data: {} };
                        this.performanceDetailsId = selectedData.performanceDetailsId;
                    } else {
                        this.isCompleted = false;
                        this.formData = { data: {} };
                        this.performanceDetailsId = null;
                    }
                    this.allPerformanceSubmissions = [];
                }
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    openMenu() {
        this.selectedConfigurationId = "selectone";
        this.performanceForm = new FormGroup({
            selectedRoles: new FormControl([], [
                Validators.required
            ])
        });
    }

    performanceConfigurationSelected(selectedId) {
        if (selectedId != "selectone") {
            this.configurationId = selectedId;
            const index = this.performanceConfigurations.findIndex((p) =>
                p.configurationId.toString().toLowerCase() == selectedId.toString().toLowerCase());
            if (index > -1) {
                this.formJson = this.performanceConfigurations[index].formJson ?
                    JSON.parse(this.performanceConfigurations[index].formJson) : Object.assign({}, this.basicForm);
            }
            this.isInvitee = false;
            const performance = new PerformanceSubmissionModel();
            performance.configurationId = selectedId;
            performance.performanceId = null;
            performance.isOpen = true;
            performance.isShare = false;
            performance.ofUserId = this.ofUserId;
            performance.isArchived = false;
            performance.pdfUrl = null;
            this.statusreportService.UpsertPerformanceSubmission(performance).subscribe((result: any) => {
                if (result.success === true) {
                    this.performanceId = result.data;
                    this.performanceDetailsId = null;
                    this.selectedMenuIndex = 0;
                    this.isOpen = true;
                    this.isShare = false;
                    this.isMainMenu = false;
                    this.pdfUrl = null;
                    this.formData = { data: {} };
                    this.getPerformances();
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        }
    }

    sharePerformance(value) {
        this.isShare = value;
        this.modifyPerformance();
    }

    showInviteeForm(row) {
        this.inviteeformData = row.dataItem.formData ? row.dataItem.formData : { data: {} };
        this.isinviteeCompleted = row.dataItem.isCompleted;
        this.inviteeName = row.dataItem.submittedByName;
        this.showInviteeReview = true;
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.inviteeState.sort = sort;
        this.loadinviteePerformances();
    }

    private loadinviteePerformances(): void {
        this.performanceSubmissions = {
            data: this.allPerformanceSubmissions == [] ? [] : orderBy(this.allPerformanceSubmissions, this.inviteeState.sort),
            total: this.allPerformanceSubmissions.length
        };
    }

    closeInviteeForm() {
        this.showInviteeReview = false;
    }

    changeOpenReview(value) {
        if (value == true) {
            const performance = new PerformanceSubmissionModel();
            performance.isOpen = true;
            performance.isArchived = false;
            performance.ofUserId = this.ofUserId;
            this.statusreportService.GetPerformanceSubmissions(performance).subscribe((result: any) => {
                if (result.success === true && result.data) {
                    if (result.data.length == 0) {
                        this.isOpen = true;
                        this.getUsers();
                        this.isNavigationRequired = !this.isOpen;
                        this.modifyPerformance();
                    } else {
                        this.toastr.warning(this.translateService.instant("PERFORMANCE.CLOSETHEACTIVEREVIEWTOOPENCURRENTREVIEW"));
                    }
                }
            });
        } else {
            this.isOpen = value;
            this.isNavigationRequired = !this.isOpen;
            this.modifyPerformance();
        }
    }

    closeSearch() {
        this.searchText = null;
        this.getPerformances();
    }

    openDeletePopup(deleteConfigurationPopup, navigatetoMain) {
        this.isNavigationRequired = navigatetoMain;
        deleteConfigurationPopup.openPopover();
    }

    closeDeletePopup() {
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    deleteReview() {
        const performance = new PerformanceSubmissionModel();
        performance.configurationId = this.configurationId;
        performance.performanceId = this.performanceId;
        performance.isOpen = this.isOpen;
        performance.isShare = this.isShare;
        performance.ofUserId = this.ofUserId;
        performance.isArchived = true;
        performance.pdfUrl = this.pdfUrl;
        this.statusreportService.UpsertPerformanceSubmission(performance).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                if (this.isNavigationRequired == true) {
                    this.isNavigationRequired = false;
                    this.navigateToMainMenu();
                } else {
                    this.getPerformances();
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    modifyPerformance() {
        const performance = new PerformanceSubmissionModel();
        performance.configurationId = this.configurationId;
        performance.performanceId = this.performanceId;
        performance.isOpen = this.isOpen;
        performance.isShare = this.isShare;
        performance.ofUserId = this.ofUserId;
        performance.isArchived = false;
        performance.pdfUrl = this.pdfUrl;
        this.statusreportService.UpsertPerformanceSubmission(performance).subscribe((result: any) => {
            if (result.success === true) {
                if (this.isNavigationRequired == true) {
                    this.isNavigationRequired = false;
                    this.navigateToMainMenu();
                } else {
                    this.isMainMenu = false;
                    this.getFormSubmissionDetails();
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    navigateToMainMenu() {
        this.selectedTab = 0;
        this.isMainMenu = true;
        this.state = {
            skip: 0,
            take: 10
        };
        this.getPerformances();
    }

    downloadPdf(url) {
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.click();
    }

    onDataSubmit(isCompleted) {
        this.isCompleted = isCompleted;
        this.isAnyOperationIsInprogress = true;
        const performance = new PerformanceSubmissionModel();
        performance.formData = JSON.stringify(this.formData);
        performance.performanceId = this.performanceId;
        performance.isCompleted = isCompleted;
        performance.submittedBy = this.submittedBy;
        performance.submissionFrom = this.selectedMenuIndex;
        performance.performanceDetailsId = this.performanceDetailsId;
        performance.employeeId = this.employeeId;
        performance.ofUserName = this.ofUserName;
        this.statusreportService.UpsertPerformanceDetails(performance).subscribe((result: any) => {
            if (result.success === true) {
                this.performanceDetailsId = result.data;
                this.formData = { data: {} };
                this.getFormSubmissionDetails();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    inviteUser() {
        const users = this.performanceForm.get("selectedRoles").value;
        users.forEach((userId) => {
            this.isAnyOperationIsInprogress = true;
            const performance = new PerformanceSubmissionModel();
            performance.formData = null;
            performance.performanceId = this.performanceId;
            performance.ofUserId = this.ofUserId;
            performance.submittedBy = userId;
            performance.submissionFrom = this.selectedMenuIndex;
            performance.performanceDetailsId = null;
            performance.ofUserName = this.ofUserName;
            this.statusreportService.UpsertPerformanceDetails(performance).subscribe((result: any) => {
                if (result.success === true) {
                    this.getFormSubmissionDetails();
                    this.checkIsInvitee();
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        });
    }

    profilePage(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.start().oncomplete(() => {

        });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
}
