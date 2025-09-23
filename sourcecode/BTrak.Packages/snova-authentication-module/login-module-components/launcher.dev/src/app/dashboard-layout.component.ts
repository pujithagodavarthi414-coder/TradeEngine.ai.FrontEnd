import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from 'login-module-components/login-components/src/lib/globaldependencies/constants/localstorage-properties';
import { WINDOW } from 'login-module-components/login-components/src/lib/snova-authentication/helpers/window.helper';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { ThemeModel } from 'login-module-components/login-components/src/lib/snova-authentication/models/themes.model';

@Component({
  selector: 'dashboard-layout.componet',
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {

  constructor(translate: TranslateService, private cookieService: CookieService, @Inject(WINDOW) private window: Window,
  public router: Router

  ) {

  }

  public onSignout(e) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.cookieService.deleteAll(environment.cookiePath);
    this.cookieService.delete("selectedProjectsTab");

    this.cookieService.set(LocalStorageProperties.CurrentCulture, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CurrentUser, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CurrentUserId, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyName, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyId, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.DefaultDashboard, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyDetails, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyTheme, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.SearchClick, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.UserModel, null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    
    localStorage.setItem(LocalStorageProperties.Dashboards, null);

    this.router.navigate(["/sessions/signin"]);
    return false;
  }
}
