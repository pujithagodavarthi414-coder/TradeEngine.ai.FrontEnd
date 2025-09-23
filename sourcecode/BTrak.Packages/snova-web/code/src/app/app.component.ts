import { AfterViewInit, Component, Inject, InjectionToken, OnInit, Renderer2 } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Params,
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  Event
} from "@angular/router";

import { ThemeModel } from "./app.module/models/themes.model";
import { AuthenticationService } from "./app.module/services/authentication.service";
import { ThemeService } from "./app.module/services/theme.service";

import { CookieService } from "ngx-cookie-service";
import { PubNubAngular } from "pubnub-angular2";
import { Observable, Subject } from "rxjs";
import { filter, map, tap, takeUntil } from "rxjs/operators";
// import { environment } from "../../src/environments/environment";
import { WINDOW } from "./app.module/helpers/window.helper";
import { Actions, ofType } from "@ngrx/effects";
import { LocalStorageProperties } from "./app.module/constants/localstorage-properties";
import { TranslateService } from "@ngx-translate/core";
import { info } from '../app/common/constants/modules';
import { ngxZendeskWebwidgetService } from "ngx-zendesk-webwidget";
interface IRoutePart {
  title: string,
  breadcrumb: string,
  params?: Params,
  url: string,
  urlSegments: any[]
}
import { environment } from "environments/environment.prod";
declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit, AfterViewInit {
  public routeParts: IRoutePart[];
  themeModel$: Observable<ThemeModel>;
  appTitle = "";
  pageTitle = "";
  themeModel: ThemeModel;
  public ngDestroyed$ = new Subject();
  details: any;
  isUsedLoggedIn: boolean;
  loading = false;
  totalLoadingTime: number = 0;
  interval;

  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private pubnub: PubNubAngular,
    private authService: AuthenticationService,
    private cookieService: CookieService,
    private actionUpdates$: Actions,
    public translate: TranslateService,
    // private moduleService: ModuleService,
    private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService,
    @Inject(WINDOW) private window: Window
  ) {
    console.log("calling");
    let showGoogleAnalytic: string = environment.isShowGoogleAnalytics.toString();
    if (showGoogleAnalytic === "true") {

      this.appendGaTrackingCode();

      const navEndEvents = router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      );
      navEndEvents.subscribe((event: NavigationEnd) => {
        gtag('config', environment.trackingId, {
          'page_path': "Company Name : " + this.cookieService.get(LocalStorageProperties.CompanyName) + " - Site : " + this.window.location.hostname + " - User : " + this.cookieService.get(LocalStorageProperties.CurrentUserId) + " - Module : " + event.urlAfterRedirects
        });
      });
    }

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          this.totalLoadingTime = 0;
          this.startTimer();
          break;
        }

        case event instanceof NavigationEnd: {
          this.loading = true;
          clearInterval(this.interval);
          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = true;
          break;
        }
        default: {
          break;
        }
      }
    });

    this.isUsedLoggedIn = localStorage.getItem(LocalStorageProperties.CurrentUserId) ? true : false;

    if (this.isUsedLoggedIn) {
      this.loadLazyStyles();
    }

    var currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);

    if (currentUserId) {
      this.getRoleFeatures();
    }

  }

  appendGaTrackingCode() {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
       
        ga('create', '` + environment.trackingId + `', 'auto');
      `;
      document.head.appendChild(script);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }

  ngOnInit() {
    localStorage.setItem(LocalStorageProperties.Modules, JSON.stringify(info.modules));
    localStorage.setItem("Environment", JSON.stringify(environment));
    localStorage.setItem("PageTitle", "Nxus World")
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture) ? this.cookieService.get(LocalStorageProperties.CurrentCulture) : this.cookieService.get(LocalStorageProperties.CurrentCulture);

    if (currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
      currentCulture = 'en';
    }
    this.translate.use(currentCulture);

    const defaultThemeModel = new ThemeModel()
    defaultThemeModel.companyThemeId = "752471EB-94F4-4A33-8C3B-6E0A8D42F0D1";
    defaultThemeModel.companyMiniLogo = "assets/images/nxus-logo.png";
    defaultThemeModel.companyMainLogo = "assets/images/nxus-logo.png";
    this.themeModel = defaultThemeModel;
    this.themeService.changeTheme(defaultThemeModel);
    this.authService.getThemes().pipe(
      map((response: any) => {
        if (this.title == undefined || this.title.getTitle() == "undefined")
          this.title.setTitle(localStorage.getItem(LocalStorageProperties.PageTitle));
        if (response.success) {
          this.cookieService.set("CompanyTheme", JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CurrentCulture, (response.data != null && response.data.defaultLanguage) ? response.data.defaultLanguage : 'en', null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.themeModel = response.data;
          // this.pageTitle = response.data.siteTitle;
          this.appTitle = response.data.siteTitle;
          if (response.data.siteTitle) {
            localStorage.setItem("PageTitle", response.data.siteTitle)
          }
          this.pageTitle = this.pageTitle.replace(undefined, '');
          if (this.appTitle != "" && this.appTitle != null && this.appTitle != undefined)
            this.pageTitle += ` | ${this.appTitle}`;
          this.title.setTitle(this.pageTitle);

          localStorage.setItem("Environment", JSON.stringify(environment));
          if (this.themeModel && this.themeModel.companyThemeId !== "00000000-0000-0000-0000-000000000000") {
            this.themeService.changeTheme(this.themeModel);
            // this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null);
            // this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null);
            this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            localStorage.setItem("DefaultLogin", this.themeModel.defaultLoginWithGoogle);
          } else {
            const themeModel = new ThemeModel()
            themeModel.companyThemeId = "752471EB-94F4-4A33-8C3B-6E0A8D42F0D1";
            themeModel.companyMiniLogo = "assets/images/nxus-logo.png";
            themeModel.companyMainLogo = "assets/images/nxus-logo.png";
            this.themeModel = themeModel;
            this.themeService.changeTheme(themeModel);
            // this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null);
            // this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null);
            this.cookieService.set("CompanyMainLogo", this.themeModel.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set("CompanyMiniLogo", this.themeModel.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            localStorage.setItem("DefaultLogin", null);
          }
          this.changeFavIcon();

          var themeColor = localStorage.getItem('themeColor')
          var helpButton = this.translate.instant("ZENDEXCUSTOMMESSAGES.HELP")
          if (helpButton == 'ZENDEXCUSTOMMESSAGES.HELP') {
            if (currentCulture == 'en') {
              helpButton = "Help";
            }
            else if (currentCulture == 'te') {
              helpButton = "సహాయం";
            } else if (currentCulture == 'ar') {
              helpButton = "مساعدة";
            } else if (currentCulture == 'ko') {
              helpButton = "도움";
            } else {
              helpButton = "Help";
            }
          }

          this._ngxZendeskWebwidgetService.setSettings({
            webWidget: {
              color: { theme: '#EB244F', launcherText: '#ffffff', },
              launcher: {
                label: {
                  '*': helpButton
                }
              }

            }
          })
          let showZendesk: string = environment.isShowZendesk.toString();
          if (showZendesk === "true") {
            this._ngxZendeskWebwidgetService.show();
          }

        }
      }
      )).subscribe();
    if (environment.deployedEnvironment === "Production" || environment.deployedEnvironment === "Customer") {
      this.isCompanyExists();
    }
    this.changePageTitle();
    if (this.title == undefined || this.title.getTitle() == "undefined")
      this.title.setTitle(localStorage.getItem(LocalStorageProperties.PageTitle));
  }

  ngAfterViewInit() {
    if (!this.isUsedLoggedIn) {
      this.loadLazyStyles();
    }
  }

  loadLazyStyles() {
    this.loadLazyStyleSheets('app-bootstrap-styles');
    this.loadLazyStyleSheets('app-main-styles');
    this.loadLazyStyleSheets('app-lightbox-styles');
    this.loadLazyStyleSheets('app-animate-styles');
    this.loadLazyStyleSheets('app-owl-carousel-styles');
    this.loadLazyStyleSheets('app-owl-default-styles');
    this.loadLazyStyleSheets('app-scheduler-material-styles');
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
        if (this.appTitle != "" && this.appTitle != null && this.appTitle != undefined)
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

  startTimer() {
    this.interval = setInterval(() => {
      this.totalLoadingTime++;
    }, 1000)
  }

  getRoleFeatures() {
    this.authService.getAllPermittedRoleFeatures().subscribe((response: any) => {
      if (response.success) {
        let roleFeatures = response.data;
        localStorage.setItem(LocalStorageProperties.RoleFeatures, JSON.stringify(roleFeatures));
      }
    })

  }


}
