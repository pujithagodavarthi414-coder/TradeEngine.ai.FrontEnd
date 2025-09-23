import { Component, OnInit, ChangeDetectorRef, ViewChildren, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import '../../globaldependencies/helpers/fontawesome-icons';
import { UploadProfileImageModel } from "../models/upload-profile-image-model";
import { State } from "../store/reducers/index";
import * as dashboardModuleReducers from "../store/reducers/index";
import { UserProfileActionTypes, CreateProfileImageTriggered } from "../store/actions/user-profile.action";
import { EmployeeOverView } from "../models/employeeOverview";
import { FormControl, Validators, FormGroup, FormGroupDirective } from "@angular/forms";
import { ProfileModel } from "../models/profile-model";
import { ChangePasswordTriggered, ChangePasswordActionTypes } from "../store/actions/change-password.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { FileResultModel } from '../models/file-result.model';
import { ChangePasswordModel } from '../models/change-password.model';
import { DashboardService } from '../services/dashboard.service';
import { MyProfileService } from '../services/myProfile.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-component-profile-page-others",
    templateUrl: "./profile-page-others.template.html"
})

export class ProfilePageOthersComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("passwordFormDirective") passwordFormDirective: FormGroupDirective;
    @ViewChildren('updatePasswordPopover') changePasswordPopovers;

    selectedUserId: string = "";
    innerWidth: any;
    timeStamp: any;
    isPassword: boolean;
    validationMessage: string;

    isExtension: boolean = true;
    isValidation: boolean = false;
    isSize: boolean = false;
    permission: boolean = false;
    isEdit: boolean = true;
    uploadProfileImageInProgress: boolean;
    loading: boolean = false;

    fileTypes = ['image/jpeg', 'image/jpg']
    fileResultModel: FileResultModel[];
    fileToUpload: File = null;

    fileResultModel$: Observable<FileResultModel[]>;

    upsertUserProfileImageInProgress$: Observable<boolean>;
    UpdateOperationInProgress$: Observable<boolean>;
    changePasswordOperationInProgress$: Observable<boolean>;

    profileDetailsForm: FormGroup;
    changePasswordForm: FormGroup;
    userDetails: EmployeeOverView;
    user = new ProfileModel();
    upsertPassword: ChangePasswordModel;

    public ngDestroyed$ = new Subject();

    constructor(
        private store: Store<State>, private actionUpdates$: Actions,
        private cookieService: CookieService, private route: ActivatedRoute,
        private toastr: ToastrService, private myProfileService: MyProfileService,
        private dashboardService: DashboardService, private cdRef: ChangeDetectorRef
    ) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserProfileActionTypes.CreateProfileImageCompleted),
                tap(() => {
                    this.isExtension = true;
                    this.isValidation = false;
                    this.isSize = false;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserProfileActionTypes.GetUserProfileByIdCompleted),
                tap(() => {
                    this.store.pipe(select(dashboardModuleReducers.getUserProfileDetails)).subscribe(() => {
                        this.cdRef.detectChanges();
                    });
                    this.fileResultModel = null;
                })
            )
            .subscribe();

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
        this.initializeForm();
        this.initializeChangePasswordForm();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.selectedUserId = routeParams.id;
            } else {
                this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            }
            if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
                this.permission = true;
            }
            this.getUserDetailsById();

        })
    }

    getUserDetailsById() {
        this.myProfileService.getEmployeeOverview(this.selectedUserId).subscribe((response: any) => {
            if (response.success == true) {
                this.userDetails = response.data;
                this.timeStamp = response.data.timeStamp;
                this.profileDetailsForm.patchValue(this.userDetails);
                this.userDetails.fullName = response.data.firstName + response.data.surName;
                this.cdRef.detectChanges();
            }
        });
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
        this.changePasswordOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.changePasswordLoading));
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

    uploadProfileImage(fileResultModel) {
        const uploadProfileImageModel = new UploadProfileImageModel();
        uploadProfileImageModel.userId = this.selectedUserId;
        if (this.fileResultModel && fileResultModel) {
            uploadProfileImageModel.profileImage = this.fileResultModel[0].filePath;
            this.userDetails.profileImage = this.fileResultModel[0].filePath;

        } else {
            uploadProfileImageModel.profileImage = null;
            this.userDetails.profileImage = null;
        }
        this.cdRef.detectChanges();
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
        this.uploadProfileImage(null);
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
                    this.uploadProfileImageInProgress = true;
                    this.dashboardService.UploadFile(formData, moduleTypeId)
                        .subscribe((responseData: any) => {
                            this.uploadProfileImageInProgress = false;
                            const success = responseData.success;
                            if (success) {
                                this.fileResultModel = responseData.data;
                                this.uploadProfileImage(responseData.data);
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

    updatePassword(updatePasswordPopover) {
        this.loading = true;
        this.dashboardService.getUserById(this.selectedUserId).subscribe((response: any) => {
            if (response.success == true) {
                this.initializeChangePasswordForm();
                updatePasswordPopover.openPopover();
                this.timeStamp = response.data.timeStamp;
            }
            this.loading = false;
        });
    }

    editUserDetails() {
        this.isEdit = !this.isEdit;
    }

    saveProfileDetailsFormDetails() {
        this.userDetails = this.profileDetailsForm.value;
        this.user.userId = this.selectedUserId;
        this.user.firstName = this.userDetails.firstName;
        this.user.email = this.userDetails.email;
        this.user.mobileNo = this.userDetails.mobileNo;
        this.user.surName = this.userDetails.surName;
        this.user.timeStamp = this.timeStamp;
        this.myProfileService.upsertProfileDetails(this.user).subscribe((response: any) => {
            if (response.success == true) {
                this.isEdit = !this.isEdit;
                this.getUserDetailsById();
            }
        });
    }

    initializeForm() {
        this.profileDetailsForm = new FormGroup({
            firstName: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            surName: new FormControl('', [Validators.required, Validators.maxLength(50)
            ]),
            email: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.email
                ])
            ),
            mobileNo: new FormControl("",
                Validators.compose([
                    Validators.maxLength(20)
                ])
            )
        });
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
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
}
