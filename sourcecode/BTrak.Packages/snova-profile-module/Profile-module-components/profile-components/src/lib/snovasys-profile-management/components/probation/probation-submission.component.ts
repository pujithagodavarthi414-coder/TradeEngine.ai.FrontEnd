import { Component, OnInit, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { ProbationConfigurationModel } from "../../models/probationConfigurationModel"
import { StatusreportService } from "../../services/statusreport.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ProbationSubmissionModel } from "../../models/probation-submission.model";
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
    selector: "app-profile-probation-submission",
    templateUrl: "./probation-submission.component.html"
})

export class ProbationSubmissionComponent extends CustomAppBaseComponent implements OnInit {
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
    probationId: string;
    inviteeName: string;
    isMainMenu = true;
    formJson: any;
    formData = { data: {} };
    inviteeformData = { data: {} };
    probationConfigurations: ProbationConfigurationModel[] = [];
    probationDetailsId: string;
    probationSubmissions: GridDataResult;
    allProbationSubmissions: any[] = [];
    showUsersList: boolean;
    closedProbations = { data: [], total: 0 };
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
    probationForm = new FormGroup({
        selectedRoles: new FormControl([], [
            Validators.required
        ])
    });
    isManager = false;
    userIds: any[] = [];
    usersDropdown: any[] = [];
    allUserList: any[] = [];
    probations: ProbationSubmissionModel[] = [];
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
        this.probationForm = new FormGroup({
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
        if (this.canAccess_feature_CanAccessProbation == true) {
            this.checkIsManager();
            this.state = {
                skip: 0,
                take: 10
            };
            this.searchText = null;
            this.getProbations();
            this.getProbationConfigurations();
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
        const probationdummy = new ProbationSubmissionModel();
        probationdummy.probationId = this.probationId;
        probationdummy.submissionFrom = 2;
        this.statusreportService.GetProbationDetails(probationdummy).subscribe((response: any) => {
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
        this.getProbations();
    }

    getProbations() {
        this.isAnyOperationIsInprogress = true;
        const probation = new ProbationSubmissionModel();
        probation.isOpen = this.selectedTab == 0 ? true : false;
        probation.isArchived = false;
        probation.ofUserId = this.ofUserId;
        probation.pageSize = this.state.take;
        probation.pageNumber = (this.state.skip / this.state.take) + 1;
        probation.sortBy = this.sortBy;
        probation.searchText = this.searchText;
        probation.sortDirectionAsc = this.sortDirection;
        this.statusreportService.GetProbationSubmissions(probation).subscribe((result: any) => {
            if (result.success === true) {
                this.probations = result.data;
                if(this.probations && this.probations.length > 0) {
                    this.employeeId = this.probations[0].employeeId;
                    this.ofUserName = this.probations[0].ofUserName;
                }
                this.closedProbations = {
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

    getProbationConfigurations() {
        this.isAnyOperationIsInprogress = true;
        const configModel = new ProbationConfigurationModel();
        configModel.isArchived = false;
        configModel.isDraft = false;
        configModel.considerRole = true;
        configModel.ofUserId = this.ofUserId;
        this.statusreportService.GetProbationConfiguration(configModel).subscribe((result: any) => {
            if (result.success === true) {
                this.probationConfigurations = result.data;
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
        this.closedProbations = {
            data: [],
            total: 0
        };
        this.searchText = null;
        this.getProbations();
    }

    selectedMenuMatTab(event) {
        this.isAnyOperationIsInprogress = true;
        this.selectedMenuIndex = event.tab.textLabel == "EMPLOYEE" ? 0 : event.tab.textLabel == "MANAGER" ? 1 :
            event.tab.textLabel == "360" ? 2 : 0;
        this.showInviteeReview = false
        this.getFormSubmissionDetails();
    }

    resumeProbation(row) {
        this.getUsers();
        this.probationId = row.probationId;
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
        const probation = new ProbationSubmissionModel();
        probation.probationId = this.probationId;
        probation.submissionFrom = this.selectedMenuIndex;
        this.statusreportService.GetProbationDetails(probation).subscribe((result: any) => {
            if (result.success === true) {
                if (this.selectedMenuIndex == 2) {
                    this.allProbationSubmissions = [];
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
                            this.probationDetailsId = perform.probationDetailsId;
                        }
                        // tslint:disable-next-line: max-line-length
                        const index = this.usersDropdown.findIndex((p) => p.id.toString().toLowerCase() == perform.submittedBy.toString().toLowerCase());
                        if (index > -1) {
                            this.usersDropdown.splice(index, 1);
                            this.userIds = this.usersDropdown.map(x => x.id);
                        }
                    });
                    this.allUserList = usersData;
                    this.allProbationSubmissions = result.data;
                    this.probationSubmissions = {
                        data: this.allProbationSubmissions,
                        total: this.allProbationSubmissions.length
                    };
                } else {
                    if (result.data.length > 0) {
                        const selectedData = result.data[0];
                        this.isCompleted = selectedData.isCompleted;
                        this.formData = selectedData.formData ? JSON.parse(selectedData.formData) : { data: {} };
                        this.probationDetailsId = selectedData.probationDetailsId;
                    } else {
                        this.isCompleted = false;
                        this.formData = { data: {} };
                        this.probationDetailsId = null;
                    }
                    this.allProbationSubmissions = [];
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
        this.probationForm = new FormGroup({
            selectedRoles: new FormControl([], [
                Validators.required
            ])
        });
    }

    probationConfigurationSelected(selectedId) {
        if (selectedId != "selectone") {
            this.configurationId = selectedId;
            const index = this.probationConfigurations.findIndex((p) =>
                p.configurationId.toString().toLowerCase() == selectedId.toString().toLowerCase());
            if (index > -1) {
                this.formJson = this.probationConfigurations[index].formJson ?
                    JSON.parse(this.probationConfigurations[index].formJson) : Object.assign({}, this.basicForm);
            }
            this.isInvitee = false;
            const probation = new ProbationSubmissionModel();
            probation.configurationId = selectedId;
            probation.probationId = null;
            probation.isOpen = true;
            probation.isShare = false;
            probation.ofUserId = this.ofUserId;
            probation.isArchived = false;
            probation.pdfUrl = null;
            this.statusreportService.UpsertProbationSubmission(probation).subscribe((result: any) => {
                if (result.success === true) {
                    this.probationId = result.data;
                    this.probationDetailsId = null;
                    this.selectedMenuIndex = 0;
                    this.isOpen = true;
                    this.isShare = false;
                    this.isMainMenu = false;
                    this.pdfUrl = null;
                    this.formData = { data: {} };
                    this.getProbations();
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        }
    }

    shareProbation(value) {
        this.isShare = value;
        this.modifyProbation();
    }

    showInviteeForm(row) {
        this.inviteeformData = row.dataItem.formData ? row.dataItem.formData : { data: {} };
        this.isinviteeCompleted = row.dataItem.isCompleted;
        this.inviteeName = row.dataItem.submittedByName;
        this.showInviteeReview = true;
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.inviteeState.sort = sort;
        this.loadinviteeProbations();
    }

    private loadinviteeProbations(): void {
        this.probationSubmissions = {
            data: this.allProbationSubmissions == [] ? [] : orderBy(this.allProbationSubmissions, this.inviteeState.sort),
            total: this.allProbationSubmissions.length
        };
    }

    closeInviteeForm() {
        this.showInviteeReview = false;
    }

    changeOpenReview(value) {
        if (value == true) {
            const probation = new ProbationSubmissionModel();
            probation.isOpen = true;
            probation.isArchived = false;
            probation.ofUserId = this.ofUserId;
            this.statusreportService.GetProbationSubmissions(probation).subscribe((result: any) => {
                if (result.success === true && result.data) {
                    if (result.data.length == 0) {
                        this.isOpen = true;
                        this.getUsers();
                        this.isNavigationRequired = !this.isOpen;
                        this.modifyProbation();
                    } else {
                        this.toastr.warning(this.translateService.instant("PERFORMANCE.CLOSETHEACTIVEREVIEWTOOPENCURRENTREVIEW"));
                    }
                }
            });
        } else {
            this.isOpen = value;
            this.isNavigationRequired = !this.isOpen;
            this.modifyProbation();
        }
    }

    closeSearch() {
        this.searchText = null;
        this.getProbations();
    }

    openDeletePopup(deleteConfigurationPopup, navigatetoMain) {
        this.isNavigationRequired = navigatetoMain;
        deleteConfigurationPopup.openPopover();
    }

    closeDeletePopup() {
        this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
    }

    deleteReview() {
        const probation = new ProbationSubmissionModel();
        probation.configurationId = this.configurationId;
        probation.probationId = this.probationId;
        probation.isOpen = this.isOpen;
        probation.isShare = this.isShare;
        probation.ofUserId = this.ofUserId;
        probation.isArchived = true;
        probation.pdfUrl = this.pdfUrl;
        this.statusreportService.UpsertProbationSubmission(probation).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteConfigurationPopup.forEach((p) => { p.closePopover(); });
                if (this.isNavigationRequired == true) {
                    this.isNavigationRequired = false;
                    this.navigateToMainMenu();
                } else {
                    this.getProbations();
                }
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    modifyProbation() {
        const probation = new ProbationSubmissionModel();
        probation.configurationId = this.configurationId;
        probation.probationId = this.probationId;
        probation.isOpen = this.isOpen;
        probation.isShare = this.isShare;
        probation.ofUserId = this.ofUserId;
        probation.isArchived = false;
        probation.pdfUrl = this.pdfUrl;
        this.statusreportService.UpsertProbationSubmission(probation).subscribe((result: any) => {
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
        this.getProbations();
    }

    downloadPdf(url) {
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.click();
    }

    onDataSubmit(isCompleted) {
        this.isCompleted = isCompleted;
        this.isAnyOperationIsInprogress = true;
        const probation = new ProbationSubmissionModel();
        probation.formData = JSON.stringify(this.formData);
        probation.probationId = this.probationId;
        probation.isCompleted = isCompleted;
        probation.submittedBy = this.submittedBy;
        probation.submissionFrom = this.selectedMenuIndex;
        probation.probationDetailsId = this.probationDetailsId;
        probation.employeeId = this.employeeId;
        probation.ofUserName = this.ofUserName;
        this.statusreportService.UpsertProbationDetails(probation).subscribe((result: any) => {
            if (result.success === true) {
                this.probationDetailsId = result.data;
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
        const users = this.probationForm.get("selectedRoles").value;
        users.forEach((userId) => {
            this.isAnyOperationIsInprogress = true;
            const probation = new ProbationSubmissionModel();
            probation.formData = null;
            probation.probationId = this.probationId;
            probation.ofUserId = this.ofUserId;
            probation.submittedBy = userId;
            probation.submissionFrom = this.selectedMenuIndex;
            probation.probationDetailsId = null;
            probation.ofUserName = this.ofUserName;
            this.statusreportService.UpsertProbationDetails(probation).subscribe((result: any) => {
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
