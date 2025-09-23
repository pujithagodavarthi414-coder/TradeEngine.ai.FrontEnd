import { Component, ChangeDetectorRef, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { State } from "../store/reducers/change-password.reducers";
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { EmployeeOverView, EducationDetails, WorkExperienceDetails } from '../models/employeeOverview';
import { CookieService } from 'ngx-cookie-service';
import { MyProfileService } from '../services/myProfile.service';
import { ChangePasswordTriggered, ChangePasswordActionTypes } from '../store/actions/change-password.actions';
import { ToastrService } from 'ngx-toastr';
import * as hrManagementModuleReducer from "../store/reducers/index";
import { select, Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { UserModel } from '../models/user-details.model';
import { ChangePasswordModel } from '../models/change-password.model';
import { EmployeeBadgeModel } from '../models/employee-badge.model';
import { DashboardService } from '../services/dashboard.service';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';
import {SoftLabelPipe} from '../pipes/soft-labels.pipe';
@Component({
    selector: 'app-profile-component-employee-details-overview',
    templateUrl: 'employee-details-overview.component.html'
})

export class EmployeeDetailsOverviewComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("passwordFormDirective") passwordFormDirective: FormGroupDirective;
    @ViewChildren('updatePasswordPopover') changePasswordPopovers;

    employeeDetails: EmployeeOverView;
    educationDetailsList: EducationDetails[];
    workExperienceDetailsList: WorkExperienceDetails[];
    softLabels: SoftLabelConfigurationModel[];

    selectedUserId: string;
    employeeId: string;
    validationMessage: string;
    skills: string[];
    languages: string[];
    reportToEmployeeName: string[];
    isPermission: boolean;
    timeStamp: any;
    upsertPassword: ChangePasswordModel;
    isPassword: boolean;
    changePasswordForm: FormGroup;
    userData$: Observable<UserModel>;
    public ngDestroyed$ = new Subject();
    changePasswordOperationInProgress$: Observable<boolean>;
    loading: boolean;
    badges: EmployeeBadgeModel[] = [];
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    isHrModuleAccess : boolean = false;
    isCanteenModuleAccess : boolean = false;
    isProjectModuleAccess : boolean = false;
    isAssertModuleAccess : boolean = false;
    isTimeSheetModuleAccess : boolean = false;
    isDocumentModuleAccess : boolean = false;
    constructor(
        private myProfileService: MyProfileService, private actionUpdates$: Actions,
        private store: Store<State>,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private cookieService: CookieService,private router: Router,private route: ActivatedRoute,
        private dashboardService: DashboardService, private translateService: TranslateService,private softLabel : SoftLabelPipe) {
        super();
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
        if (this.router.url.split("/")[3]) {
            this.selectedUserId = this.router.url.split("/")[3];
        } else {
            this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
            this.isPermission = true;
        }

        this.route.parent.params.subscribe((params) => {
            if (params["id"] != null && params["id"] !== undefined) {
                if (this.selectedUserId != params["id"]) {
                    this.selectedUserId = params["id"];
                    if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
                        this.isPermission = true;
                    }
                    this.getEmployeeIdByUserId();
                }
              }
            });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ChangePasswordActionTypes.ChangePasswordCompleted),
                tap(() => {
                    this.closePopup();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getEmployeeIdByUserId();
        this.getSoftLabels();
        this.initializeChangePasswordForm();
        if (this.canAccess_feature_ViewBadgesAssignedToEmployee == true && this.employeeId) {
            this.getBadgesAssignedToEmployee();
        }
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#ov-1',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.OV-1'),this.softLabels),
                    position: 'bottom'
                },
                {
                    element: '#ov-2',
                    intro: this.softLabel.transform(this.translateService.instant('INTROTEXT.OV-2'),this.softLabels),
                    position: 'bottom'
                }
            ]
        });
    }
    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getEmployeeIdByUserId() {
        this.dashboardService.getUserById(this.selectedUserId).subscribe((response: any) => {
            if (response.success == true) {
                var selectedUser = this.selectedUserId;
                this.employeeId = response.data.employeeId;
                this.timeStamp = response.data.timeStamp;
                this.getEmployeeOverview(selectedUser);
                this.getBadgesAssignedToEmployee();
            }
        });
    }

    getBadgesAssignedToEmployee() {
        if (this.canAccess_feature_ViewBadgesAssignedToEmployee == true) {
            const badge = new EmployeeBadgeModel();
            badge.userId = this.employeeId;
            badge.isForOverView = true;
            this.dashboardService.getBadgesAssignedToEmployee(badge).subscribe((result: any) => {
                if (result.success === true) {
                    this.badges = result.data;
                    this.cdRef.detectChanges();
                } else {
                    this.toastr.error(result.apiResponseMessages[0].message);
                }
            })
        }
    }

    getEmployeeOverview(selectedUser) {
        this.educationDetailsList = [];
        this.workExperienceDetailsList = [];
        this.languages = [];
        this.skills = [];
        this.reportToEmployeeName = [];
        this.myProfileService.getEmployeeOverview(selectedUser).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeDetails = response.data;
                if (response.data.education != null) {
                    var educationDetailsList = JSON.parse(response.data.education);
                    this.educationDetailsList = educationDetailsList.EmployeeEducation;
                }
                if (response.data.experience != null) {
                    var workExperienceDetailsList = JSON.parse(response.data.experience);
                    this.workExperienceDetailsList = workExperienceDetailsList.EmployeeWorkExperience;
                }
                if (response.data.language != null) {
                    var languages = JSON.parse(response.data.language);
                    this.languages = languages.EmployeeLanguage;
                }
                if (response.data.skill != null) {
                    var skills = JSON.parse(response.data.skill);
                    this.skills = skills.EmployeeSkill;
                }
                if (response.data.reportTo != null) {
                    var reportTo = JSON.parse(response.data.reportTo);
                    this.reportToEmployeeName = reportTo.EmployeeReportTo;
                }
                if (this.multiPage == "true") {
                    this.introStart();
                    this.multiPage = null;
                }
                this.cdRef.detectChanges();
               // this.introStart();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });

    }

    initializeChangePasswordForm() {
        this.changePasswordForm = new FormGroup({
            newPassword: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
                    Validators.maxLength(250)
                ])
            ),
            confirmPassword: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
                    Validators.maxLength(250)
                ])
            )
        })
    }

    updatePassword(updatePasswordPopover) {
        this.loading = true;
        this.dashboardService.getUserById(this.selectedUserId).subscribe((response: any) => {
            if (response.success == true) {
                this.initializeChangePasswordForm();
                updatePasswordPopover.openPopover();
                this.timeStamp = response.data.timeStamp;
            }
        });
        this.loading = false;
    }

    changePassword() {
        if (this.isPassword) {
            return;
        }
        this.upsertPassword = this.changePasswordForm.value;
        this.upsertPassword.type = 1;
        this.upsertPassword.userId = this.selectedUserId;
        this.upsertPassword.timeStamp = this.timeStamp;
        this.upsertPassword.isArchived = false;
        this.store.dispatch(new ChangePasswordTriggered(this.upsertPassword));
        this.changePasswordOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.changePasswordLoading));
    }

    passwordConfirmation() {
        if (this.changePasswordForm.value.newPassword != this.changePasswordForm.value.confirmPassword) {
            this.isPassword = true;
            this.validationMessage = "Passwords should match";
            this.cdRef.detectChanges();
        }
        else {
            this.isPassword = false;
            this.cdRef.detectChanges();
        }
    }

    closePopup() {
        this.passwordFormDirective.resetForm();
        this.changePasswordPopovers.forEach((p) => p.closePopover());
        this.timeStamp = '';
        this.isPassword = false;
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                this.router.navigate(["dashboard/profile/" + this.userId + "/hr-record"], navigationExtras);
            }
            else if (this.isProjectModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3926f534-ede8-4c47-8a44-bfdd2b7f76db') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/user-stories"], navigationExtras);
            }
            else if (this.isCanteenModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('573ec90c-3a0b-4ed8-a744-978f3a16cbe5') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/canteen-purchases"], navigationExtras);
            } 
            else if (this.canAccess_feature_ManageInductionWork && (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/induction-work"], navigationExtras);
            } 
            else if (this.canAccess_feature_ManageExitWork && (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/exit-work"], navigationExtras);
            }
            else if (this.canAccess_feature_CanEditOtherEmployeeDetails && (this.isDocumentModuleAccess =userModules.filter(x =>
                x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/signature-inviations"], navigationExtras);
            }
            else if (this.canAccess_feature_AssignAssetsToEmployee && (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
          });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
}
