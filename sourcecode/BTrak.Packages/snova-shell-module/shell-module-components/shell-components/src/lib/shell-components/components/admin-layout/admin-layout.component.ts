import { Component, OnInit, AfterViewInit, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, ResolveStart, ResolveEnd, NavigationStart, NavigationCancel, NavigationError, Event, } from "@angular/router";
import { Subscription } from "rxjs";
import { MatSidenav } from "@angular/material/sidenav";
import { MediaChange } from "@angular/flex-layout";
import { TranslateService } from "@ngx-translate/core";
// import PerfectScrollbar from 'perfect-scrollbar';
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { filter } from "rxjs/operators";
import { select, Store } from "@ngrx/store";
import { UserDetailsFetchedAfterLogin, AuthenticationActionTypes, UserInitialDetailsFetched } from "../../store/actions/authentication.actions";
import { CookieService } from "ngx-cookie-service";
import { Actions, ofType } from "@ngrx/effects";
import { Location } from "@angular/common";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model"
import { LayoutService } from '../../services/layout.service';
import { UserStory } from '../../models/userStory';
import * as SharedModuleState from "../../store/reducers/index";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CommonService } from '../../services/common-used.service';
import { PubNubAngular } from 'pubnub-angular2';
import { SPINNER } from 'ngx-ui-loader';
import { SignalrService } from "../../services/signalr.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.template.html"
})

export class AdminLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;
  private layoutConfSub: Subscription;
  private routerEventSub: Subscription;
  private mediaSub: Subscription;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  // private sidebarPS: PerfectScrollbar;

  // private bodyPS: PerfectScrollbar;
  // private headerFixedBodyPS: PerfectScrollbar;
  public scrollConfig = {};
  public layoutConf: any = {};
  display: boolean;
  userStories$: Observable<UserStory[]>;
  show: boolean;
  userStories: UserStory[];
  userStory: UserStory;
  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  dashboardPage: boolean;
  bgcolor: any;
  private sub: Subscription;
  userstory = 'userstory';
  loading = false;
  totalLoadingTime: number = 0;
  interval;
  spinnerType = SPINNER.circle;


  constructor(
    private router: Router,
    public translate: TranslateService,
    private layout: LayoutService,
    private store: Store<SharedModuleState.State>,
    private cookieService: CookieService,
    private actionUpdates$: Actions,
    private location: Location,
    private commonService: CommonService,
    private pubnub: PubNubAngular,
    private signalr: SignalrService,
  ) {
    // let conId = sessionStorage.getItem('conectionId');
    // if(!conId) {
      this.signalr.initializeSignalRConnection();
    // }
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let companySettings = localStorage.getItem(LocalStorageProperties.CompanySettings);
    if (!companySettings || companySettings == 'null' || companySettings == "undefined") {
      pubnub.init({
        publishKey: environment.publishKey,
        subscribeKey: environment.subscribeKey
      });
    } else {
      const comSet = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
      var publishKey = comSet.find(i => i.key == "PubnubPublishKey");
      var subscribeKey = comSet.find(i => i.key == "PubnubSubscribeKey")
      if ((publishKey && publishKey.value) && (subscribeKey && subscribeKey.value)) {
        pubnub.init({
          publishKey: publishKey.value,
          subscribeKey: subscribeKey.value
        });
      } else {
        pubnub.init({
          publishKey: environment.publishKey,
          subscribeKey: environment.subscribeKey
        });
      }
    }



    // Close sidenav after route change in mobile
    this.routerEventSub = router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        this.layout.adjustLayout({ route: routeChange.url });
      });

    // Translator init
    let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);

    if (currentCulture === 'null' || currentCulture === 'undefined') {
      currentCulture = 'en';
    }
    translate.use(currentCulture);


    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          this.totalLoadingTime = 0;
          this.startTimer();
          break;
        }

        case event instanceof NavigationEnd: {
          this.loading = false;
          clearInterval(this.interval);
          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    router.events.subscribe(val => {
      if (location.path() != "") {
        if (location.path().includes('/dashboard-management/dashboard/')) {
          this.dashboardPage = true;
          this.bgcolor = 'none';
        }
        else {
          this.dashboardPage = false;
          this.bgcolor = 'beige';
        }
      }
    });

    // if (this.cookieService.check(LocalStorageProperties.UserModel)) {
    //   let data = JSON.parse(this.cookieService.get(LocalStorageProperties.UserModel));
    //   if (data && data != 'null' && data != 'undefined')
    //     this.store.dispatch(new UserDetailsFetchedAfterLogin(data));
    // }

    if ((localStorage.getItem(LocalStorageProperties.UserModel) != null && localStorage.getItem(LocalStorageProperties.UserModel) != undefined)
      && !localStorage.hasOwnProperty(LocalStorageProperties.UserRoleFeatures)) {
      let data = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
      this.store.dispatch(new UserDetailsFetchedAfterLogin(data));
    }

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuthenticationActionTypes.ClearDemoDataCompleted),
        tap((result: any) => {
          if (result && result.companyId) {
            this.getSoftLabels();
          }
        })
      ).subscribe();
  }

  ngOnInit() {
    this.getSoftLabelConfigurations();
    this.layoutConf = this.layout.layoutConf;
    // this.layout.adjustLayout();

    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe(event => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.isModuleLoading = false;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  }

  @HostListener("window:resize", ['$event'])

  onResize(event) {
    this.layout.adjustLayout(event);
  }

  Opened(event) {
    this.display = event;
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  getSoftLabels() {
    let model = new SoftLabelConfigurationModel();
    model.searchText = null;
    this.commonService.getSoftLabels(model).subscribe((response: any) => {
      if (response.success) {
        let data = response.data;
        if (data) {
          localStorage.setItem('SoftLabels', JSON.stringify(data));
        }
      }
    });
  }

  ngAfterViewInit() {
    // this.layoutConfSub = this.layout.layoutConf$.subscribe(change => {
    //   // this.initBodyPS(change)
    // })
  }

  // initBodyPS(layoutConf:any = {}) {
  //   if(layoutConf.navigationPos === 'side' && layoutConf.topbarFixed) {
  //     if (this.bodyPS) this.bodyPS.destroy();
  //     if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
  //     this.headerFixedBodyPS = new PerfectScrollbar('.rightside-content-hold', {
  //       suppressScrollX: true
  //     });
  //     this.scrollToTop('.rightside-content-hold');
  //   } else {
  //     if (this.bodyPS) this.bodyPS.destroy();
  //     if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
  //     this.bodyPS = new PerfectScrollbar('.main-content-wrap', {
  //       suppressScrollX: true
  //     });
  //     this.scrollToTop('.main-content-wrap');
  //   }
  // }
  scrollToTop(selector: string) {
    if (document) {
      let element = <HTMLElement>document.querySelector(selector);
      element.scrollTop = 0;
    }
  }
  ngOnDestroy() {
    if (this.moduleLoaderSub) {
      this.moduleLoaderSub.unsubscribe();
    }
    if (this.layoutConfSub) {
      this.layoutConfSub.unsubscribe();
    }
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  closeSidebar() {
    this.layout.publishLayoutChange({
      sidebarStyle: "closed"
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.totalLoadingTime++;
    }, 1000)
  }
}
