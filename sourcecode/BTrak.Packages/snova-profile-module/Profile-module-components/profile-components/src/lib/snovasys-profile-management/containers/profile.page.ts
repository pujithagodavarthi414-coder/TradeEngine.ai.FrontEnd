import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import '../../globaldependencies/helpers/fontawesome-icons';
import { UploadProfileImageModel } from "../models/upload-profile-image-model";
import { CreateProfileImageTriggered, GetUserProfileByIdTriggered, UserProfileActionTypes } from "../store/actions/user-profile.action";
import { State } from "../store/reducers/index";
import * as dashboardModuleReducers from "../store/reducers/index";
import { PerformanceSubmissionModel } from "../models/performance-submission.model";
import { StatusreportService } from "../services/statusreport.service";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { FileResultModel } from '../models/file-result.model';
import { UserModel } from '../models/user-details.model';
import { DashboardService } from '../services/dashboard.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SignatureModel } from '../models/signature.model';
import { ModuleDetailsModel } from "@thetradeengineorg1/snova-testrepo";
import { ProbationSubmissionModel } from "../models/probation-submission.model";

@Component({
    selector: "app-profile-component-profilepage",
    templateUrl: "./profile.page.template.html"
})

export class ProfilePageComponent extends CustomAppBaseComponent implements OnInit {

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    activeView = "overview";
    selectedUserId = "";
    permission: boolean;
    innerWidth: any;
    productivityIndex: string;
    isExtension = true;
    isValidation = false;
    signatureInvitations: any[] = [];
    isSize = false;
    employeeId: string;
    fileTypes = ['image/jpeg', 'image/jpg', 'image/png']
    fileResultModel: FileResultModel[];
    canSubmitPerformance = false;
    canSubmitProbation = false;
    isManager = false;
    isProbationManager = false;
    fileToUpload: File = null;
    uploadProfileImageInProgress: boolean;
    canAccessPerformance: Boolean;
    canAccessProbation: Boolean;
    fileResultModel$: Observable<FileResultModel[]>;
    userData$: Observable<UserModel>;
    userData: UserModel;
    upsertUserProfileImageInProgress$: Observable<boolean>;
    gettingUserProfileDetailsInProgress$: Observable<boolean>;
    gettingUserProfileDetailsInProgress: boolean;
    public ngDestroyed$ = new Subject();
    companymodulesList: any;
    isHrModuleAccess : boolean = false;
    isRosteringModuleAccess : boolean = false;
    isCanteenModuleAccess : boolean = false;
    isProjectModuleAccess : boolean = false;
    isAssertModuleAccess : boolean = false;
    isTimeSheetModuleAccess : boolean = false;
    isLeavesModuleAccess : boolean = false;
    isDocumentModuleAccess : boolean = false;

    constructor(
        private store: Store<State>, private actionUpdates$: Actions,
        private cookieService: CookieService, private route: ActivatedRoute,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef,
        private dashboardService: DashboardService,
        private statusreportService: StatusreportService) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserProfileActionTypes.GetUserProfileByIdCompleted),
                tap(() => {
                    this.userData$ = this.store.pipe(select(dashboardModuleReducers.getUserProfileDetails));
                    this.userData$.subscribe((result) => {
                        console.log(result);
                    });
                    this.fileResultModel = null;
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserProfileActionTypes.CreateProfileImageCompleted),
                tap(() => {
                    this.isExtension = true;
                    this.isValidation = false;
                    this.isSize = false;
                    this.getUserDetailsById();
                })
            )
            .subscribe();
        this.checkPermission();
    }

    ngOnInit() {
        super.ngOnInit();
        this.canAccessPerformance = this.canAccess_feature_CanAccessPerformance;
        this.canAccessProbation = this.canAccess_feature_CanAccessProbation;
        if (this.canAccessPerformance == true) {
            this.checkCanViewPerformance();
            this.checkIsManager();
        } else {
            this.isManager = false;
            this.canSubmitPerformance = false;
        }
        if(this.canAccessProbation) {
            this.checkCanViewProbation();
            this.checkIsManager();
        }
        else {
            this.isProbationManager = false;
            this.canSubmitProbation = false;
        }
        this.getSoftLabelConfigurations();
        this.getAllCompanyModulesList();
    }

    checkPermission() {
        this.route.params.subscribe((routeParams) => {
            if (routeParams.id) {
                this.selectedUserId = routeParams.id;
            } else {
                this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            }
            if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
                this.permission = true;
                this.checkSignatureInvitations();
            } else {
                this.permission = false;
            }
            this.getUserDetailsById();
            if (this.canAccessPerformance == true) {
                this.checkCanViewPerformance();
                this.checkIsManager();
            }
        })
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    checkCanViewPerformance() {
        this.canSubmitPerformance = false;
        const performance = new PerformanceSubmissionModel();
        performance.isOpen = true;
        performance.isArchived = false;
        performance.ofUserId = this.selectedUserId;
        this.statusreportService.GetPerformanceSubmissions(performance).subscribe((result: any) => {
            if (result.success === true && result.data && result.data.length > 0) {
                const performancedummy = new PerformanceSubmissionModel();
                performancedummy.performanceId = result.data[0].performanceId;
                performancedummy.submissionFrom = 2;
                this.statusreportService.GetPerformanceDetails(performancedummy).subscribe((response: any) => {
                    if (result.success === true && response.data && response.data.length > 0) {
                        response.data.forEach((p) => {
                            if (p.submittedBy.toString().toLowerCase() ==
                                this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) {
                                this.canSubmitPerformance = true;
                            }
                        });
                    }
                });

            }
        });
    }

    checkCanViewProbation() {
        this.canSubmitProbation = false;
        const probation = new ProbationSubmissionModel();
        probation.isOpen = true;
        probation.isArchived = false;
        probation.ofUserId = this.selectedUserId;
        this.statusreportService.GetProbationSubmissions(probation).subscribe((result: any) => {
            if (result.success === true && result.data && result.data.length > 0) {
                const probation = new ProbationSubmissionModel();
                probation.probationId = result.data[0].probationId;
                probation.submissionFrom = 2;
                this.statusreportService.GetProbationDetails(probation).subscribe((response: any) => {
                    if (result.success === true && response.data && response.data.length > 0) {
                        response.data.forEach((p) => {
                            if (p.submittedBy.toString().toLowerCase() ==
                                this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) {
                                this.canSubmitProbation = true;
                            }
                        });
                    }
                });

            }
        });
    }

    checkIsManager() {
        this.isManager = false;
        this.dashboardService.GetEmployeeReportToMembers(this.selectedUserId).subscribe((result: any) => {
            if (result.success === true && result.data && result.data.length > 0) {
                result.data.forEach((user) => {
                    if ((user.id.toString().toLowerCase() == this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase()) && (user.id.toString().toLowerCase() != this.selectedUserId.toString().toLowerCase())) {
                        this.isManager = true;
                        this.isProbationManager = true;
                        this.cdRef.detectChanges();
                    }
                });
            }
        });
    }

    checkSignatureInvitations() {
        this.signatureInvitations = [];
        const signature = new SignatureModel();
        signature.isArchived = false;
        signature.inviteeId = this.selectedUserId;
        this.dashboardService.getSignature(signature).subscribe((result: any) => {
            if (result.success == true && result.data) {
                this.signatureInvitations = result.data;
                this.cdRef.detectChanges();
            }
        })
    }

    getUserDetailsById() {
        this.gettingUserProfileDetailsInProgress = true;
        // this.store.dispatch(new GetUserProfileByIdTriggered(this.selectedUserId));
        // this.gettingUserProfileDetailsInProgress$ = this.store.pipe(select(dashboardModuleReducers.getUserProfileLoading));
        this.dashboardService.getUserById(this.selectedUserId).subscribe((result: any) => {
            if (result.success) {
                this.userData = result.data;
                this.fileResultModel = null;
                this.gettingUserProfileDetailsInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.gettingUserProfileDetailsInProgress = false;
            }
        })
    }

    uploadProfileImage() {
        const uploadProfileImageModel = new UploadProfileImageModel();
        uploadProfileImageModel.userId = this.selectedUserId;
        if (this.fileResultModel) {
            uploadProfileImageModel.profileImage = this.fileResultModel[0].filePath;
        } else {
            uploadProfileImageModel.profileImage = null;
        }
        this.store.dispatch(new CreateProfileImageTriggered(uploadProfileImageModel));
        this.upsertUserProfileImageInProgress$ = this.store.pipe(select(dashboardModuleReducers.getUpsertProfileImageLoading));
    }

    public onPreviousSearchPosition(): void {
        if (window.matchMedia("(max-width: 460px)").matches) {
            const element = document.getElementById("scrollBar");
            element.scrollIntoView(true);
        }
    }

    removePhoto() {
        this.uploadProfileImage();
    }

    uploadEventHandler(files: FileList) {
        const file = files.item(0);
        const moduleTypeId = 1;
        if (file.size > 5514432 && (!this.fileTypes.includes(file.type))) {
            this.isExtension = false;
            this.isValidation = false;
            this.isSize = true;
        } else {
            if (file.size > 5514432) {
                this.isExtension = false;
                this.isSize = false;
                this.isValidation = true;
            } else {
                if (this.fileTypes.includes(file.type)) {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("isFromProfileImage", 'true');
                    this.uploadProfileImageInProgress = true;
                    this.dashboardService.UploadFile(formData, moduleTypeId)
                        .subscribe((responseData: any) => {
                            this.uploadProfileImageInProgress = false;
                            const success = responseData.success;
                            if (success) {
                                this.fileResultModel = responseData.data;
                                this.uploadProfileImage();
                            } else {
                                this.toastr.warning("", responseData.apiResponseMessages[0].message);
                            }
                        });
                } else {
                    this.isExtension = false;
                    this.isSize = false;
                    this.isValidation = false;
                }
            }
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    getAllCompanyModulesList() {
        var moduleDetailsModel = new ModuleDetailsModel();
        moduleDetailsModel.isArchived = false;
        this.dashboardService.getAllCompanyModulesList(moduleDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
                if(userModules){
                  localStorage.removeItem(LocalStorageProperties.UserModules);
                }
                localStorage.setItem(LocalStorageProperties.UserModules, JSON.stringify(response.data));
                this.companymodulesList = response.data;
                this.isProjectModuleAccess = this.companymodulesList.filter(x => 
                    x.moduleId.toLowerCase().includes('3926f534-ede8-4c47-8a44-bfdd2b7f76db') && x.isActive).length > 0
                this.isAssertModuleAccess = this.companymodulesList.filter(x => 
                    x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0
                this.isCanteenModuleAccess = this.companymodulesList.filter(x => 
                    x.moduleId.toLowerCase().includes('573ec90c-3a0b-4ed8-a744-978f3a16cbe5') && x.isActive).length > 0
                this.isTimeSheetModuleAccess = this.companymodulesList.filter(x => 
                        x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0
                this.isLeavesModuleAccess = this.companymodulesList.filter(x => 
                        x.moduleId.toLowerCase().includes('3c10c01f-c571-496c-b7af-2bedd36838b5') && x.isActive).length > 0
                this.isHrModuleAccess = this.companymodulesList.filter(x => 
                        x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0
                this.isDocumentModuleAccess = this.companymodulesList.filter(x => 
                            x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0
                this.isRosteringModuleAccess = this.companymodulesList.filter(x => 
                            x.moduleId.toLowerCase().includes('d8535273-0e2f-4a34-adaf-b8da48a4f90e') && x.isActive).length > 0

                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error("",response.apiResponseMessages[0].message);
                this.cdRef.detectChanges();
            }
        });
    }
}
