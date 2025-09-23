import { Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetModel } from '../models/reset-password-model';
import { UserService } from '../auth/user.Service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  isThereAnError: boolean = false;
  isAnyOperationInprogress: boolean = false;
  isPasswordChangeInprogress: boolean = false;
  isLinkExpired: boolean = false;
  isPasswordMatch: boolean = false;
  validationMessage: string;
  resetForm: FormGroup;
  resetGuid: string;
  id: any;
  companyMainLogo: string;
  resetPasswordModel: ResetModel;
  applicationVersion = "";
  siteUrl: any;
  isResetPassword: boolean = false;

  constructor(
    private resetPasswordService: UserService, private route: ActivatedRoute,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService) {
    this.route.params.subscribe(routeParams => {
      if (routeParams.id)
        this.resetGuid = routeParams.id;
    });
  }

  ngOnInit() {
    this.getTheme();
    this.initializeChangePasswordForm();
    this.resetPassword();
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.applicationVersion = (environment && environment.version) ? environment.version : "";
  }

  ngAfterViewInit() {
    this.id = setInterval(() => {
      this.setCompanyLogo();
    }, 1000);
  }

  setCompanyLogo() {
    this.companyMainLogo = this.cookieService.get("CompanyMainLogo");
    this.cdRef.markForCheck();
  }

  changePassword() {
    this.isPasswordChangeInprogress = true;

    if (this.isPasswordMatch) {
      return;
    }
    this.resetPasswordModel = this.resetForm.value;
    this.resetPasswordModel.resetGuid = this.resetGuid;
    this.resetPasswordService.reset(this.resetPasswordModel).subscribe((response: any) => {
      if (response.success == true) {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isLinkExpired = true;
        this.isResetPassword = true;
        this.initializeChangePasswordForm();
        this.toastr.success("Password updated successfully!");
      }
      else {
        this.isResetPassword = false;
        this.isThereAnError = true;
        this.isPasswordChangeInprogress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  resetPassword() {
    this.isAnyOperationInprogress = true;
    this.resetPasswordService.expired(this.resetGuid).subscribe((response: any) => {
      if (response.success == true) {
        if (response.data == true) {
          this.isLinkExpired = response.data;
          this.isResetPassword = false;
          this.isThereAnError = false;
          this.validationMessage = null;
          this.isAnyOperationInprogress = false;
        }
      }
      else {
        this.isResetPassword = false;
        this.isThereAnError = true;
        this.isAnyOperationInprogress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    });
  }

  getTheme() {
    this.authenticationService.getThemes().subscribe((response: any) => {
      if (response.success) {
        this.siteUrl = response.data.registrerSiteAddress;
        this.companyMainLogo = response.data.companyMainLogo;
        this.cdRef.detectChanges();
      }
    });
  }
  passwordConfirmation() {
    if (this.resetForm.value.newPassword != this.resetForm.value.confirmPassword) {
      this.isPasswordMatch = true;
      this.validationMessage = "Passwords should match";
      this.cdRef.detectChanges();
    }
    else {
      this.isPasswordMatch = false;
      this.cdRef.detectChanges();
    }
  }

  initializeChangePasswordForm() {
    this.isPasswordChangeInprogress = false;
    this.resetForm = new FormGroup({
      newPassword: new FormControl('',
        Validators.compose([
          Validators.pattern('((?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\\W).{8,50})'),
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(8),

        ])
      ),
      confirmPassword: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(8),
        ])
      )
    })
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}