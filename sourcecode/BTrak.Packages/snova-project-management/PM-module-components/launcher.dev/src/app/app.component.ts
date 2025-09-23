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
import { Actions } from "@ngrx/effects";
import { map, filter } from 'rxjs/operators';
import { ThemeModel } from './app.module/models/themes.model';
import { ThemeService } from './app.module/services/theme.service';
import { AuthenticationService } from './app.module/services/authentication.service';
import { WINDOW } from './app.module/helpers/window.helper';
import { LocalStorageProperties } from 'PM-module-components/pm-components/src/lib/globaldependencies/constants/localstorage-properties';


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
  isUsedLoggedIn: boolean;

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
    console.log(translate);
    this.isUsedLoggedIn = localStorage.getItem(LocalStorageProperties.CurrentUserId) ? true : false;
    if (this.isUsedLoggedIn) {
      //this.loadLazyStyles();
    }
  }

  ngOnInit() {

    localStorage.setItem("Environment", JSON.stringify(environment));

    const defaultThemeModel = new ThemeModel()
    defaultThemeModel.companyThemeId = "752471EB-94F4-4A33-8C3B-6E0A8D42F0D1";
    defaultThemeModel.companyMiniLogo = "assets/images/nxus-logo.png";
    defaultThemeModel.companyMainLogo = "assets/images/nxus-logo.png";
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
            themeModel.companyMiniLogo = "assets/images/nxus-logo.png";
            themeModel.companyMainLogo = "assets/images/nxus-logo.png";
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
    if (!this.isUsedLoggedIn) {
     // this.loadLazyStyles();
    }
  }


  loadLazyStyles() {
    this.loadLazyStyleSheets('app-bootstrap-styles');
    this.loadLazyStyleSheets('app-main-styles');
    this.loadLazyStyleSheets('app-lightbox-styles');
    this.loadLazyStyleSheets('app-properties-styles');
    this.loadLazyStyleSheets('app-animate-styles');
    this.loadLazyStyleSheets('app-owl-carousel-styles');
    this.loadLazyStyleSheets('app-owl-default-styles');
    this.loadLazyStyleSheets('app-scheduler-material-styles');
    this.loadLazyStyleSheets('app-bpmn-diagram-styles');
    this.loadLazyStyleSheets('app-bpmn-styles');
    this.loadLazyStyleSheets('app-properties-styles');
    this.loadLazyStyleSheets('app-dmn-diagram-styles');
    this.loadLazyStyleSheets('app-decision-table-controls-styles');
    this.loadLazyStyleSheets('app-decision-table-styles');
    this.loadLazyStyleSheets('app-dmn-js-drd-styles');
    this.loadLazyStyleSheets('app-dmn-js-literal-styles');
    this.loadLazyStyleSheets('app-dmn-js-shared-styles');
    this.loadLazyStyleSheets('app-dmn-styles');
  }

  loadLazyStyleSheets(file) {
    const lazyStyleElement = document.createElement('link');
    lazyStyleElement.rel = 'stylesheet';
    lazyStyleElement.href = file + '.css';
    document.head.appendChild(lazyStyleElement);
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

