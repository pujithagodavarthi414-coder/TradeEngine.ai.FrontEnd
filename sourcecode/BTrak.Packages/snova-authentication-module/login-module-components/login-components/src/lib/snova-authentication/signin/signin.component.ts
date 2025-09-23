import { ChangeDetectorRef, Component, Inject, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";

import { CookieService } from "ngx-cookie-service";
import { Observable, of, Subject } from "rxjs";
import { AuthenticationService } from "../auth/authentication.service";
import { WINDOW } from "../helpers/window.helper";
import { ThemeModel } from '../models/themes.model';
// import { GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { TranslateService } from "@ngx-translate/core";
import { PushNotificationsService } from 'ng-push-ivy';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialog } from "../dialogs/push-notification/notifications-dialog";
import { Guid } from "guid-typescript";
import * as _ from "underscore";
import { ThemeService } from "../auth/theme.service";
/** @dynamic */

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html"
})

export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  resultSet: any;
  opened = false;
  public show = false;
  showDiv = false;
  themeModel$: Observable<ThemeModel>;
  themeModel: ThemeModel;
  userLoggingIn: boolean;
  userLoggingInError: string;
  companyMainLogo: string;
  applicationVersion = "";
  public ngDestroyed$ = new Subject();
  signinForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  width: any;
  error = "";
  canViewCreateAccount = false;
  companyMiniLogo: string;
  localThemeColor: any;
  isDefaultLogin: boolean;
  id: any;
  empId: any;
  isEmpMonitoring: boolean = false;
  isVerifyCompany: boolean = false;
  siteUrl: any;
  public static Feature_ViewActivityDashboard: Guid = Guid.parse('9CB69D96-A99A-49C6-B158-B58535897610');
  canAccess_feature_ViewActivityDashboard: boolean;
  themeModel1: any;

  constructor(
    private pushNotifications: PushNotificationsService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public translate: TranslateService,
    // private socialAuthService: SocialAuthService,
    private cdRef: ChangeDetectorRef,
    private themeService: ThemeService,
    private authenticationService: AuthenticationService,
    @Inject(WINDOW) private window: Window
  ) {
    this.setDefaultLogin();
    // this.companyMainLogo = this.cookieService.get("CompanyMainLogo");
  }

  ngOnInit() {
    this.showDiv = false
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);

    if (currentCulture === 'null' || currentCulture === 'undefined') {
      currentCulture = 'en';
    }
    this.translate.use(currentCulture);

    this.signinForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard-management";
    let isUserLoggedIn = this.cookieService.get("CurrentUser");
    isUserLoggedIn = isUserLoggedIn == "null" || isUserLoggedIn == "undefined" ? null : isUserLoggedIn;
    if (isUserLoggedIn) {
      this.redirectIfLoggedIn();
    }

    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.applicationVersion = (environment && environment.version) ? environment.version : "";
    this.getTheme();
  }

  ngAfterViewInit() {
    this.id = setInterval(() => {
      this.setCompanyLogo();
      this.setDefaultLogin();
    }, 1000);
  }

  setDefaultLogin() {
    let defaultLoginValue = (localStorage.getItem(LocalStorageProperties.DefaultLogin) != null && localStorage.getItem(LocalStorageProperties.DefaultLogin) != undefined) ? JSON.parse(localStorage.getItem(LocalStorageProperties.DefaultLogin)) : null;
    if (defaultLoginValue == 1) {
      this.isDefaultLogin = true;
    } else {
      this.isDefaultLogin = false;
    }
  }

  setCompanyLogo() {
    this.companyMainLogo = this.cookieService.get("CompanyMainLogo");
    this.cdRef.markForCheck();
  }
  getTheme() {
    this.authenticationService.getThemes().subscribe((response: any) => {
      if (response.success) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.cookieService.set('CompanyTheme', JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.themeModel1 = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;
          this.cookieService.set("CompanyMainLogo", this.themeModel1.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyMiniLogo", this.themeModel1.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.themeService.changeTheme(this.themeModel1);
        this.siteUrl = response.data.registrerSiteAddress;
        this.cdRef.detectChanges();
      }
    });
  }
  getThemeRefresh() {
    this.authenticationService.getThemes().subscribe((response: any) => {
      if (response.success) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.cookieService.set('CompanyTheme', JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.themeModel1 = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;
          this.cookieService.set("CompanyMainLogo", this.themeModel1.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyMiniLogo", this.themeModel1.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.themeService.changeTheme(this.themeModel1);
        this.siteUrl = response.data.registrerSiteAddress;
        this.cdRef.detectChanges();
      }
    });
  }
  gmailLogin() {
    // let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    // this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
    //   console.log("google sign in data : ", userData);
    //   if (userData) {
    //     const userDetails = {
    //       name: userData.name,
    //       userName: userData.email,
    //       image: userData.photoUrl
    //     }
    //     this.authenticationService.loginWithGoogle(userDetails)
    //       .pipe(
    //         map((userToken: any) => {
    //           this.userLoggingIn = false;
    //           var currentCulture = userToken.data.companySettings.find(i => i.key == 'DefaultLanguage');
    //           if (currentCulture && currentCulture.value) {
    //             let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    //             this.cookieService.set(LocalStorageProperties.CurrentCulture, currentCulture.value, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           }
    //           let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    //           this.cookieService.set("CurrentUser", userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           this.cookieService.set("CompanyDetails", JSON.stringify(userToken.data.companyDetails), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           localStorage.setItem("RoleFeatures", JSON.stringify(userToken.data.roleFeatures));
    //           localStorage.setItem("SoftLabels", JSON.stringify(userToken.data.softLabels));
    //           localStorage.setItem("CompanySettings", JSON.stringify(userToken.data.companySettings));
    //           localStorage.setItem(LocalStorageProperties.Branch, userToken.data.usersModel.branchId);
    //           localStorage.setItem(LocalStorageProperties.UserReferenceId, userToken.data.usersModel.userReferenceId);
    //           this.cookieService.set("FromLogIn", JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           this.cookieService.set("CurrentUserId", userToken.data.usersModel.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           this.cookieService.set("CompanyName", userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           this.cookieService.set("CompanyId", userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           localStorage.setItem("UserModel", JSON.stringify(userToken.data.usersModel));
    //           this.cookieService.set("DefaultDashboard", userToken.data.defaultDashboardId ? JSON.stringify(userToken.data.defaultDashboardId.workspaceId) : null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    //           this.setDafaultLanguage();
    //           this.userLoggingIn = true;
    //           this.redirectIfLoggedIn();
    //         }),
    //         catchError((err) => {
    //           console.log(err);
    //           this.resultSet = "";
    //           this.userLoggingInError = "Error occured while logging in.";
    //           this.userLoggingIn = false;
    //           if (err.error != null && err.error.ExceptionMessage == "TrailPeriodExpired") {
    //             this.showDiv = true;
    //             this.show = false;
    //             this.isEmpMonitoring = false;
    //           }
    //           if (err.error != null && err.error.ExceptionMessage == "EMPPeriodExpired") {
    //             this.showDiv = false;
    //             this.show = false;
    //             this.isEmpMonitoring = true;
    //           }
    //           if (err["errorMessage"]) {
    //             const var1 = err["errorMessage"].error.ExceptionMessage;
    //             this.resultSet = var1;
    //             if (this.resultSet.includes("TrailPeriodExpired")) {
    //               this.showDiv = true;
    //               this.show = false;
    //               this.isEmpMonitoring = false;

    //             }
    //             else if (err.error != null && err.error.ExceptionMessage == "EMPPeriodExpired") {
    //               this.showDiv = false;
    //               this.show = false;
    //               this.isEmpMonitoring = true;
    //             }
    //             else {
    //               this.showDiv = false;
    //               this.show = true;
    //               this.resultSet = "";
    //             }
    //           }

    //           return of("Error message.")
    //         })).subscribe();
    //   } else {
    //     this.userLoggingInError = "Error occured while logging in.";
    //     this.show = true;

    //   }
    // });
  }

  setDafaultLanguage() {
    const company = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    let currentCulture = company.lanCode;
    if (currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
      currentCulture = 'en';
    }
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.set(LocalStorageProperties.CurrentCulture, currentCulture, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
  }

  signin() {
    this.showDiv = false;
    let userName = this.signinForm.controls["username"].value.trim();
    const regexp = new RegExp("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
    const test = regexp.test(userName);
    if (!test) {
      userName = userName + "@snovasys.io"
    }

    this.userLoggingIn = true;

    this.authenticationService
      .login(userName, this.signinForm.controls["password"].value)
      .pipe(
        map((userToken: any) => {

          this.userLoggingIn = false;
          var userCurrentCulture = null;
          if (userToken.data != null && userToken.data != undefined && userToken.data !== 'null' && userToken.data !== 'undefined') {
            if (userToken.data.usersModel != null && userToken.data.usersModel != undefined && userToken.data.usersModel !== 'null' && userToken.data.usersModel !== 'undefined') {
              if (userToken.data.usersModel.userLanguage != null && userToken.data.usersModel.userLanguage != undefined && userToken.data.usersModel.userLanguage !== 'null' && userToken.data.usersModel.userLanguage !== 'undefined') {
                userCurrentCulture = userToken.data.usersModel.userLanguage;
              }
            }
          }
          var companyCurrentCulture = null;
          if (userToken.data != null && userToken.data != undefined && userToken.data !== 'null' && userToken.data !== 'undefined') {
            if (userToken.data.companySettings != null && userToken.data.companySettings != undefined && userToken.data.companySettings !== 'null' && userToken.data.companySettings !== 'undefined') {
              var keyfound = userToken.data.companySettings.find(i => i.key == 'DefaultLanguage');
              if (keyfound != null && keyfound != undefined && keyfound !== 'null' && keyfound !== 'undefined') {
                if (keyfound.value != null && keyfound.value != undefined && keyfound.value !== 'null' && keyfound.value !== 'undefined') {
                  companyCurrentCulture = userToken.data.companySettings.find(i => i.key == 'DefaultLanguage');
                }
              }
            }
          }
          //if (currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
          //  var companyCurrentCulture = userToken.data.companySettings.find(i => i.key == 'DefaultLanguage');
          // }
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

          if (userCurrentCulture) {
            this.cookieService.set(LocalStorageProperties.CurrentCulture, userCurrentCulture, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }
          else if (companyCurrentCulture) {
            this.cookieService.set(LocalStorageProperties.CurrentCulture, companyCurrentCulture.value, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }
          else {
            this.cookieService.set(LocalStorageProperties.CurrentCulture, 'en', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }

          var count = this.cookieService.check(LocalStorageProperties.UserLoggedInCount);
          if (count && this.cookieService.get(LocalStorageProperties.UserLoggedInCount) != 'null'
            && this.cookieService.get(LocalStorageProperties.UserLoggedInCount) != 'undefined') {
            if (this.cookieService.get(LocalStorageProperties.UserLoggedInCount) == '1') {
              this.cookieService.set(LocalStorageProperties.UserLoggedInCount, '2', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.cookieService.set(LocalStorageProperties.DisplayWelComeNote, 'true', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            } else if (this.cookieService.get(LocalStorageProperties.UserLoggedInCount) == '2') {
              this.cookieService.set(LocalStorageProperties.UserLoggedInCount, '3', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.cookieService.set(LocalStorageProperties.DisplayWelComeNote, 'false', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            }
          } else {
            this.cookieService.set(LocalStorageProperties.UserLoggedInCount, '1', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.DisplayWelComeNote, 'true', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }
          this.cookieService.set("CurrentUser", userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyDetails", JSON.stringify(userToken.data.companyDetails), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          localStorage.setItem("RoleFeatures", JSON.stringify(userToken.data.roleFeatures));
          localStorage.setItem("SoftLabels", JSON.stringify(userToken.data.softLabels));
          localStorage.setItem("CompanySettings", JSON.stringify(userToken.data.companySettings));
          localStorage.setItem(LocalStorageProperties.Branch, userToken.data.usersModel.branchId);
          localStorage.setItem(LocalStorageProperties.UserReferenceId, userToken.data.usersModel.userReferenceId);
          this.cookieService.set("FromLogIn", JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CurrentUserId", userToken.data.usersModel.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyName", userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyId", userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          // this.cookieService.set("UserModel", JSON.stringify(userToken.data.usersModel), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          localStorage.setItem("UserModel", JSON.stringify(userToken.data.usersModel));
          //this.cookieService.set("UserModel", JSON.stringify(userToken.data.usersModel), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("DefaultDashboard", userToken.data.defaultDashboardId ? JSON.stringify(userToken.data.defaultDashboardId.workspaceId) : null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          localStorage.setItem(LocalStorageProperties.DefaultAppId, userToken.data.defaultAppId);
          localStorage.setItem("RedirectionUrl", userToken.data.companyDetails.reDirectionUrl);
          this.userLoggingIn = true;
          this.getThemeRefresh();
          this.redirectIfLoggedIn();
        }),
        catchError((err) => {
          console.log(err);
          this.resultSet = "";
          this.userLoggingInError = "Error occured while logging in.";
          this.userLoggingIn = false;
          if (err.error != null && err.error.ExceptionMessage == "TrailPeriodExpired") {
            this.showDiv = true;
            this.show = false;
            this.isEmpMonitoring = false;
            this.isVerifyCompany = false;
          }
          if (err.error != null && err.error.ExceptionMessage == "EMPPeriodExpired") {
            this.showDiv = false;
            this.show = false;
            this.isEmpMonitoring = true;
            this.isVerifyCompany = false;
          }
          if (err.error != null && err.error.ExceptionMessage == "IsVerifyFailed") {
            this.showDiv = false;
            this.show = false;
            this.isEmpMonitoring = false;
            this.isVerifyCompany = true;
          }
          if (err["errorMessage"]) {
            const var1 = err["errorMessage"].error.ExceptionMessage;
            this.resultSet = var1;
            if (this.resultSet.includes("TrailPeriodExpired")) {
              this.showDiv = true;
              this.show = false;
              this.isEmpMonitoring = false;

            } else if (this.resultSet.includes("EMPPeriodExpired")) {
              this.showDiv = false;
              this.show = false;
              this.isEmpMonitoring = true;
            }
            else {
              this.showDiv = false;
              this.show = true;
              this.resultSet = "";
            }
          }

          return of("Error message.")
        })).subscribe();
  }
  // showPushNotificationDialog() {
  //   if (this.pushNotifications.permission === 'denied') {
  //     let createChannelDIalogRef = this.dialog.open(NotificationDialog, {
  //       width: '600px',
  //       disableClose: true,
  //     });
  //   }
  // }

  redirectIfLoggedIn() {
    //this.showPushNotificationDialog();
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    let feature_ViewActivityDashboard = '9CB69D96-A99A-49C6-B158-B58535897610';
    this.canAccess_feature_ViewActivityDashboard = _.find(roles, function (role) { return role['featureId'].toLowerCase() == feature_ViewActivityDashboard.toString().toLowerCase(); }) != null;

    const defaultDashboardIdForLoggedInUser = this.cookieService.check("DefaultDashboard") ? JSON.parse(this.cookieService.get("DefaultDashboard")) : null;
    var defaultAppIdForLoggedInUser = localStorage.getItem(LocalStorageProperties.DefaultAppId);

    let reDirectionUrl = (localStorage.getItem(LocalStorageProperties.RedirectionUrl) == "null" || localStorage.getItem(LocalStorageProperties.RedirectionUrl) == "undefined") ? null : localStorage.getItem(LocalStorageProperties.RedirectionUrl);

    const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
    if ((defaultAppIdForLoggedInUser!="null") && this.returnUrl == "/dashboard-management" ) {
        console.log("dashboard-management/widgets/" + defaultAppIdForLoggedInUser);
        this.router.navigateByUrl("dashboard-management/widgets/" + defaultAppIdForLoggedInUser);
    } else if (this.returnUrl == "/dashboard-management" && defaultDashboardIdForLoggedInUser && !reDirectionUrl) {
      if (userReference != "null" && userReference != null) {
        console.log("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser + "/form/" + userReference);
        this.router.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser + "/form/" + userReference);
      } else {
        console.log("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser);
        this.router.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser);
      }
    }
    else if (reDirectionUrl) {
      if (reDirectionUrl == 'activitytracker/activitydashboard/summary') {
        if (this.canAccess_feature_ViewActivityDashboard) {
          this.router.navigateByUrl(reDirectionUrl);
        }
        else {
          this.router.navigateByUrl("/dashboard-management");
        }
      }
      else {
        this.router.navigateByUrl(reDirectionUrl);
      }
    }
    else {
      // console.log("else routing returnUrl", this.returnUrl);
      var url = window.location.origin + this.returnUrl;
      this.router.navigate([this.returnUrl]);
      window.location.assign(url);
    }
  }

  showError() {
    this.show = true;
    this.showDiv = false;
  }

  closeError() {
    this.show = false;
  }

  changeFavIcon() {
    document.getElementById("shortcut-fav-icon").setAttribute("href", this.themeModel.companyMiniLogo);
  }


  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  hide() {
    this.router.navigate(['/sessions/payments']);
  }
}
