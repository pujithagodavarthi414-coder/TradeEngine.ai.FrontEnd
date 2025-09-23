import { Inject, Injectable, OnInit } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Guid } from "guid-typescript";
import * as _ from "underscore";

/** @dynamic */

@Injectable({ providedIn: 'root' })

export class UnAuthGuard implements CanActivate, OnInit {
  authenticated: boolean;
  public Feature_ViewActivityDashboard: any = '9CB69D96-A99A-49C6-B158-B58535897610';
  canAccess_feature_ViewActivityDashboard: boolean;
  
  constructor(
    private router: Router,
    private cookieService: CookieService) {

  }

  ngOnInit() { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("un authguard - canActivate");
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));

    let feature_ViewActivityDashboard = '9CB69D96-A99A-49C6-B158-B58535897610';

    let canAccess_feature_ViewActivityDashboard = _.find(roles, function (role) { return role['featureId'].toLowerCase() == feature_ViewActivityDashboard.toString().toLowerCase(); }) != null;
    
    let currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    let reDirectionUrl = this.cookieService.get(LocalStorageProperties.RedirectionUrl);
    if (currentUserId === "null" || currentUserId === "undefined") {
      currentUserId = null;
    }
    console.log("Current User = " + currentUserId);

    if (currentUserId && !reDirectionUrl) {
      if (state.url.includes("generic") || state.url.includes("application/joincall") ||  state.url.includes("kyc") || state.url.includes("webview-unauth")) {
        return true;
      } else {
        console.log("Redirecting to dashboard management");
        this.router.navigate(["/dashboard-management"]);
      }
      return false;
    }
    else if (currentUserId && reDirectionUrl) {
      if (reDirectionUrl == 'activitytracker/activitydashboard/summary') {
        if (canAccess_feature_ViewActivityDashboard) {
          this.router.navigate([reDirectionUrl]);
        }
        else {
          this.router.navigate(["/dashboard-management"]);
        }
      }
      else {
        this.router.navigate([reDirectionUrl]);
      }
      return false;
    }
    return true;
  }
}
