import {
  Component,
  OnInit,
  OnDestroy
} from "@angular/core";
import {
  Router, RouterModule,
} from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../../project-components/src/lib/globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.template.html"
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public isModuleLoading: Boolean = false;
  public scrollConfig = {};
  public layoutConf: any = {};
  display: boolean;
  show: boolean;
  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  dashboardPage: boolean;
  bgcolor: any;
  userstory = 'userstory';

  constructor(
    public translate: TranslateService,
    public cookieService: CookieService,
    public router: Router
  ) {

  }

  ngOnInit() {

  }

  onSignout() {
    this.cookieService.deleteAll("/");
    localStorage.removeItem(LocalStorageProperties.SoftLabels);
    localStorage.removeItem(LocalStorageProperties.RoleFeatures);
    this.router.navigate(["/sessions/signin"]);
  }


  scrollToTop(selector: string) {
    if (document) {
      let element = <HTMLElement>document.querySelector(selector);
      element.scrollTop = 0;
    }
  }
  ngOnDestroy() {

  }
  closeSidebar() {

  }
}
