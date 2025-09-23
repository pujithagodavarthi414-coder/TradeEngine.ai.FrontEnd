import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  Params,
  NavigationEnd
} from "@angular/router";


import { Observable, Subject } from "rxjs";
import { environment } from "../../src/environments/environment";
import { WINDOW } from "./app.module/helpers/window.helper";
import { Actions } from "@ngrx/effects";
import { ThemeService } from './app.module/services/theme.service';
import { LocalStorageProperties } from './app.module/constants/localstorage-properties';
import { AuthenticationService } from './app.module/services/authentication.service';
import { ThemeModel } from './app.module/models/themes.model';
import { map, filter } from 'rxjs/operators';
import info from './app.module/models/modules';


interface IRoutePart {
  title: string,
  breadcrumb: string,
  params?: Params,
  url: string,
  urlSegments: any[]
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, AfterViewInit {
  public routeParts: IRoutePart[];
  themeModel$: Observable<ThemeModel>;
  appTitle = "Snovasys Business Suite";
  pageTitle = "";
  themeModel: ThemeModel;
  public ngDestroyed$ = new Subject();
  details: any;
  selectedAppId: string;
  collectionName: string;
  applicationId: string;
  isUsedLoggedIn: boolean;
  widgetData: any = {};
  widgetData1: any = {};
  widgetData2: any = {};
  formId : string;
  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private themeService: ThemeService,
    translate: TranslateService,
    private authService: AuthenticationService,
    private cookieService: CookieService,
    @Inject(WINDOW) private window: Window
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.collectionName = "DataSet";
    this.selectedAppId = "bb386e02-ca49-4435-b18f-8be69e69fedd";
    this.formId = "c83ec02b-e1a0-473d-8508-519cda513c20";
    console.log(translate);
  
    this.widgetData = {
      filterQuery: null,
      customWidgetQuery: null,
      persistanceId: null,
      isUserLevel: true,
      emptyWidget: null,
      dashboardId: "1b36e6ee-8cd4-faf3-4eb4-f8316a1a6016",
      customWidgetId: "bb386e02-ca49-4435-b18f-8be69e69fedd",
      name: "SG-ANA-PRODUCT MASTER",
      customAppVisualizationId:null,
      visualizationType: null,
      dashboardName: "SG-ANA-PRODUCT MASTER",
      xCoOrdinate: null,
      yCoOrdinate: null,
      isFromGridster: true,
      showVisualization: true,
      submittedFormId: null,
      filterApplied: null,
      dashboardFilters: null,
      isProc: null,
      isApi: null,
      procName: null,
      pivotMeasurersToDisplay: [],
      persistanceJson: null,
      isCustomAppAddOrEditRequire: true,
      isEditable: null,
      filters: null,
      isCustomApp: true
    }
  
    this.applicationId = "d8cc2549-6595-4c1d-a9c4-c6891c12abc4";
  }

  ngOnInit() {
    localStorage.setItem(LocalStorageProperties.Modules, JSON.stringify(info.modules));
    localStorage.setItem("Environment", JSON.stringify(environment));

    const defaultThemeModel = new ThemeModel()
    defaultThemeModel.companyThemeId = "752471EB-94F4-4A33-8C3B-6E0A8D42F0D1";
    defaultThemeModel.companyMiniLogo = "assets/images/Logo-favicon.png";
    defaultThemeModel.companyMainLogo = "assets/images/Main-Logo.png";
    this.themeModel = defaultThemeModel;
    this.themeService.changeTheme(defaultThemeModel);
    this.authService.getThemes().pipe(
      map((response: any) => {
        if (response.success) {
          this.cookieService.set("CompanyTheme", JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.themeModel = response.data;
          localStorage.setItem("Environment", JSON.stringify(environment));
          if (this.themeModel && this.themeModel.companyThemeId !== "00000000-0000-0000-0000-000000000000") {
            this.themeService.changeTheme(this.themeModel);
            this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null);
            this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null);
          } else {
            const themeModel = new ThemeModel()
            themeModel.companyThemeId = "752471EB-94F4-4A33-8C3B-6E0A8D42F0D1";
            themeModel.companyMiniLogo = "assets/images/Logo-favicon.png";
            themeModel.companyMainLogo = "assets/images/Main-Logo.png";
            this.themeModel = themeModel;
            this.themeService.changeTheme(themeModel);
            this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null);
            this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null);
          }
          // this.changeFavIcon();
        }
      }
      )).subscribe();

    this.changePageTitle();
    if (environment.deployedEnvironment === "Production" || environment.deployedEnvironment === "Customer") {
      this.isCompanyExists();
    }
  }

  ngAfterViewInit() {

  }

  generateRouteParts(snapshot: ActivatedRouteSnapshot): IRoutePart[] {
    let routeParts = [] as IRoutePart[];
    if (snapshot) {
      if (snapshot.firstChild) {
        routeParts = routeParts.concat(this.generateRouteParts(snapshot.firstChild));
      }
      if (snapshot.data["title"] && snapshot.url.length) {
        routeParts.push({
          title: snapshot.data["title"],
          breadcrumb: snapshot.data["breadcrumb"],
          url: snapshot.url[0].path,
          urlSegments: snapshot.url,
          params: snapshot.params
        });
      }
    }
    return routeParts;
  }

  changePageTitle() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        const routeParts = this.generateRouteParts(
          this.activeRoute.snapshot
        );
        if (!routeParts.length) {
          return this.title.setTitle(this.appTitle);
        }
        this.pageTitle = routeParts
          .reverse()
          .map((part) => part.title)
          .reduce((partA, partI) => {
            return `${partA} > ${partI}`;
          });
        this.pageTitle += ` | ${this.appTitle}`;
        this.title.setTitle(this.pageTitle);
      });
  }

  changeFavIcon() {
    document.getElementById("shortcut-fav-icon").setAttribute("href", this.themeModel.companyMiniLogo);
  }

  isCompanyExists() {
    this.authService.getCompanyExistsOrNot().subscribe((response: any) => {
      if (response.success === true) {
        if (!response.data) {
          window.open("https://www.snovasys.com", "_self");
        }
      }
    });
  }
}

