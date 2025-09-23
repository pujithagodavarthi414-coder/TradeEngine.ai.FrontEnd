import { Inject, Injectable, OnInit } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "./user.Service";

import { map } from "rxjs/operators";
import { WINDOW } from "../helpers/window.helper";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

/** @dynamic */

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, OnInit {
  authenticated: boolean;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService,
    @Inject(WINDOW) private window: Window) {
    const currentUserId = this.cookieService.get("CurrentUserId");

    if (currentUserId === "null" || currentUserId === "undefined") {
      this.authenticated = false;
    } else {
      this.authenticated = true;
    }
  }

  ngOnInit() { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("authguard - canActivate");

    let currentUserId = this.cookieService.get("CurrentUserId");
    if (currentUserId === "null" || currentUserId === "undefined") {
      currentUserId = null;
    }

    if (currentUserId) {
      {
        const fromLogIn = this.cookieService.check("FromLogIn") ?
          JSON.parse(this.cookieService.get("FromLogIn")) : null;

        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

        if (!fromLogIn) {
          this.cookieService.set("SearchClick", null, null, environment.cookiePath, this.window.location.hostname, false, "Strict");

          this.userService.getLoggedInUser().pipe(
            map((userRecord: any) => {
              console.log(this.window.location.hostname);
              this.cookieService.set("CurrentUserId", userRecord.data.id, null,
                environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.cookieService.set("CompanyName", userRecord.data.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.cookieService.set("CompanyId", userRecord.data.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            }));
        }
        this.cookieService.set("FromLogIn", JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        return true;
      }
    }

    this.router.navigate(["/sessions/signin"], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}
