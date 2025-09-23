import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { rootProdRouterConfig } from './app.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SessionsModule } from "@snovasys/snova-authentication-module";
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from './app.module/services/theme.service';
import { LayoutService } from './app.module/services/layout.service';
import { WINDOW_PROVIDERS } from './app.module/helpers/window.helper';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from "ngx-perfect-scrollbar";
import { JwtInterceptor } from '../../../pm-components/src/lib/globaldependencies/intercepter/jwt.interceptor';
import { GoogleAnalyticsService } from '../../../pm-components/src/lib/globaldependencies/services/google-analytics.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropZoneModule } from '@snovasys/snova-file-uploader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://test-btrak502.nxusworld.com/assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SessionsModule,
    RouterModule.forRoot(rootProdRouterConfig, {
      useHash: false
    }),  
    BrowserModule,
    FlexLayoutModule,
    BrowserModule,
    PerfectScrollbarModule,
    FormsModule,
    HttpClientModule,
    DropZoneModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000
    })
    
  ],
  entryComponents:[],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService,
    ThemeService,
    LayoutService,
    GoogleAnalyticsService,
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
 }
