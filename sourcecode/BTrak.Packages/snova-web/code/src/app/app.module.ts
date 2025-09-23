import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
  
} from "@angular/common/http";
import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { DateAdapter } from "@angular/material/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  BrowserModule,
} from "@angular/platform-browser";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from "ngx-perfect-scrollbar";
import { SessionsModule } from "@thetradeengineorg1/snova-authentication-module";
import { AppComponent } from "./app.component";
import { JwtInterceptor } from "./app.module/helpers/jwt.interceptor";
import { WINDOW_PROVIDERS } from "./app.module/helpers/window.helper";
import { rootProdRouterConfig } from "./app.routing";
import { CustomRouterStateSerializer, metaReducers, reducers } from "./store/reducers/index";

import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChartsModule } from "ng2-charts";
import { AvatarModule } from "ngx-avatar";
import { NgxPaginationModule } from "ngx-pagination";
import { TimeagoModule } from "ngx-timeago";
import { DynamicModule } from "@thetradeengineorg1/snova-ndc-dynamic";
import { ngxZendeskWebwidgetModule, ngxZendeskWebwidgetConfig } from 'ngx-zendesk-webwidget';
// import {GoogleAnalyticsService} from "./shared/services/google-analytics.service"; 

export function HttpLoaderFactory(httpClient: HttpClient) {
  if (window.location.host.indexOf("localhost") > -1) {
    return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json?v=' + new Date().getTime());
  }
  else {
    if (environment.production) {
      return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json?v=' + environment.version);
    } else {
      return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json?v=' + new Date().getTime());
    }
  }
}

import { OverlayModule } from "@angular/cdk/overlay";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { EffectsModule } from "@ngrx/effects";
import { RouterStateSerializer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { PubNubAngular } from "pubnub-angular2";
import { GoogleAnalyticsService } from "./app.module/services/google-analytics.service";
import { LayoutService } from "./app.module/services/layout.service";
import { ThemeService } from "./app.module/services/theme.service";
import "./common/helpers/fontawesome-icons";
import { environment } from "environments/environment.prod";
import { DatePipe } from "@angular/common";
import { IConfig, NgxMaskModule } from "ngx-mask";
// import { SocialLoginModule } from "angularx-social-login";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


export const options: Partial<IConfig> = {
  thousandSeparator: ","
};
export class ZendeskConfig extends ngxZendeskWebwidgetConfig {
  accountUrl = environment.zendeskAccountUrl;
  beforePageLoad(zE) {
    zE.setLocale('en');
    zE.hide();
    }
  }
export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "LL",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  imports: [
    NgxPaginationModule,
    // SocialLoginModule,
    DynamicModule.withComponents([]),
    ChartsModule,
    NgSelectModule,
    SatPopoverModule,
    AvatarModule,
    TimeagoModule,
    NgxDatatableModule,
    SessionsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot(options),
    StoreModule.forRoot(reducers, { metaReducers }), 
    ngxZendeskWebwidgetModule.forRoot(ZendeskConfig),
    RouterModule.forRoot(rootProdRouterConfig, {
      useHash: false
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: "router"
    }),
    EffectsModule.forRoot([]),
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [AppComponent],
  entryComponents: [],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    { provide: MatDialogRef, useValue: {} },
    PubNubAngular,
    CookieService,
    ThemeService,
    DatePipe,
    LayoutService,
    GoogleAnalyticsService,
    WINDOW_PROVIDERS,
    OverlayModule,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ToastrService
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})

export class AppModule { }
