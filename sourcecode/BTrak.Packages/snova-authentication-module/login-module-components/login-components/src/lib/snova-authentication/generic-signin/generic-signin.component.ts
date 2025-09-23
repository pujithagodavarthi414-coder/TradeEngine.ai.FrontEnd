import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { catchError, map } from "rxjs/operators";

import { Observable, Subject, of } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "../auth/authentication.service";
import { ThemeModel } from '../models/themes.model';
import { WINDOW } from '../helpers/window.helper';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Guid } from "guid-typescript";
import * as _ from "underscore";

/** @dynamic */

@Component({
  selector: "app-generic-signin",
  templateUrl: "./generic-signin.component.html"
})

export class GenericSigninComponent implements OnInit {
  siteUrl: any;
  ngAfterViewInit() { }

  opened = false;
  public show = false;
  themeModel$: Observable<ThemeModel>;
  themeModel: ThemeModel;
  userLoggingIn$: Observable<boolean>;
  userLoggingInError$: Observable<string>;
  companyMainLogo: string = this.cookieService.get('companyMainLogo');
  applicationVersion = "";
  public ngDestroyed$ = new Subject();
  signinForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  userLoggingIn: boolean;
  userLoggingInError: string;
  width: any;
  error = "";
  canViewCreateAccount = false;
  canAccess_feature_AlternateSignIn: Boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    @Inject(WINDOW) private window: Window
  ) {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AlternateSignIn = _.find(roles, function (role) { return role.featureId.toLowerCase() == Guid.parse('67058FD4-7264-4ECB-8E0B-4CEE0E4380CB').toString().toLowerCase(); }) != null;
    this.companyMainLogo = this.cookieService.get('companyMainLogo');
    this.getCompanyTheme();
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_AlternateSignIn = _.find(roles, function (role) { return role.featureId.toLowerCase() == Guid.parse('67058FD4-7264-4ECB-8E0B-4CEE0E4380CB').toString().toLowerCase(); }) != null;
    this.signinForm = new FormGroup({
      userName: new FormControl("", Validators.required)
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard-management";
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.applicationVersion = (environment && environment.version) ? environment.version : "";
  }

  setCompanyLogo() {
    this.companyMainLogo = this.cookieService.get('companyMainLogo');
    this.cdRef.detectChanges();
  }

  getCompanyTheme() {
    this.authenticationService.getThemes()
      .pipe(
        map((response: any) => {
          if (response.success) {
            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
            this.cookieService.set('CompanyTheme', JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.themeModel = response.data;
            this.siteUrl = response.data.registrerSiteAddress;
            if (this.themeModel && this.themeModel.companyThemeId !== "00000000-0000-0000-0000-000000000000") {
              this.companyMainLogo = this.themeModel.companyMainLogo;
              this.cdRef.markForCheck();
            }
            else {
              this.companyMainLogo = "assets/images/Logo-Login.png";
              this.cdRef.markForCheck();
            }
          }
        })
      ).subscribe();
  }

  signin() {
    this.show = false;
    this.userLoggingInError = null;
    this.userLoggingIn = true;
    let userName = this.signinForm.controls["userName"].value;
    this.authenticationService
      .loginNewUser(userName)
      .pipe(
        map((userToken: any) => {
          this.userLoggingIn = false;
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set("CurrentUser", userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyDetails", JSON.stringify(userToken.data.companyDetails), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          localStorage.setItem("RoleFeatures", JSON.stringify(userToken.data.roleFeatures));
          localStorage.setItem("SoftLabels", JSON.stringify(userToken.data.softLabels));
          localStorage.setItem("CompanySettings", JSON.stringify(userToken.data.companySettings));
          localStorage.setItem(LocalStorageProperties.UserReferenceId, userToken.data.usersModel.userReferenceId);
          this.cookieService.set("FromLogIn", JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CurrentUserId", userToken.data.usersModel.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyName", userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set("CompanyId", userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          if (userToken.data.dashboards) {
            localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(userToken.data.dashboards));
          }
          this.cookieService.set(LocalStorageProperties.SearchClick, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          if (userToken.data.defaultDashboardId && userToken.data.defaultDashboardId.workspaceId) {
            this.cookieService.set("DefaultDashboard", userToken.data.defaultDashboardId.workspaceId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          }
          // this.cookieService.set("UserModel", JSON.stringify(userToken.data.usersModel), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          localStorage.setItem("UserModel", JSON.stringify(userToken.data.usersModel));

          this.userLoggingIn = true;
          const defaultDashboardIdForLoggedInUser = this.cookieService.check("DefaultDashboard") ? this.cookieService.get("DefaultDashboard") : null;
          if (!defaultDashboardIdForLoggedInUser) {
            console.log(this.returnUrl);
            this.router.navigate([this.returnUrl]);
          } else if (userToken.data.usersModel.userReferenceId != "null" && userToken.data.usersModel.userReferenceId != null) {
            console.log("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser + "/form/" + userToken.data.usersModel.userReferenceId);
            this.router.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser + "/form/" + userToken.data.usersModel.userReferenceId);
          } else {
            console.log("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser);
            this.router.navigateByUrl("dashboard-management/dashboard/" + defaultDashboardIdForLoggedInUser);
          }
        }),
        catchError((err) => {
          console.log(err);
          this.userLoggingInError = "Error occured while logging in.";
          this.show = true;
          this.userLoggingIn = false;
          this.cdRef.detectChanges();
          return of("Error message.")
        })).subscribe();
  }

  showError() {
    this.show = true;
    this.cdRef.markForCheck();
  }

  navigateToMainScreen() {
    this.router.navigateByUrl('/dashboard-management');
  }

  closeError() {
    this.show = false;
  }
}
