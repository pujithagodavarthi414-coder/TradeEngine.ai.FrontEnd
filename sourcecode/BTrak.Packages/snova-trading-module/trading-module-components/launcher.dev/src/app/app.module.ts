import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ColorPickerModule } from 'ngx-color-picker';
import { BillingRoutes } from 'trading-module-components/trading-components/src/lib/billing/billing.routing';
import { BillingModule } from 'trading-module-components/trading-components/src/lib/billing/billing.module';
import 'hammerjs';
import { billingModuleInfo } from 'trading-module-components/trading-components/src/lib/billing/models/dashboardFilterModel';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'https://dev-btrak514.nxusworld.com/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot([]),
    RouterModule.forChild([
      {
        path: 'lives',
        children: BillingRoutes
      }
    ]),
    BrowserModule,
    BrowserAnimationsModule,
    BillingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FlexLayoutModule,
    ColorPickerModule,
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
  providers: [
    {provide: 'TradingModuleLoader', useValue: {
      // modules: [
          // {
          //     path: "appStoreComponents",
          //     moduleName: "AppStoreModule",
          //     modulePackageName: "AppStorePacakgeModule",
          //     moduleLazyLoadingPath: "trading-module-components/launcher.dev/src/app/packageModules/appStore-package.module",
          //     description: "App store",
          //     apps: [
          //         {
          //             displayName: "app store",
          //             componentName: "AppStoreComponent",
          //             inputs: []
          //         },
          //         {
          //             displayName: "Widget list",
          //             componentName: "WidgetslistComponent",
          //             inputs: []
          //         }
          //     ]
          // },
          // {
          //     path: "tradingWidgetComponents",
          //     moduleName: "BillingModule",
          //     modulePackageName: "TradingWidgetPackageModule",
          //     moduleLazyLoadingPath: "trading-module-components/launcher.dev/src/app/packageModules/trading-widget.module#TradingWidgetPackageModule",
          //     description: "trading widget components module description",
          //     apps: [
          //         {
          //             displayName: "Independent Smallholder Certification",
          //             componentName: "SmallHolderApplication",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Certified SHFs North Sumatra",
          //             componentName: "CertifiedSHFsNorthSumateraComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Certified SHFs Jambi",
          //             componentName: "CertifiedSHFsJambiComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Certified SHFs Riau",
          //             componentName: "CertifiedSHFsRiauComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Ffb Productivity - Phase 1 Jambi",
          //             componentName: "FFBProductivityJambiComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Ffb Productivity - Phase 1 Riau",
          //             componentName: "FFBProductivityRiauComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Ffb Productivity - Phase 1 North Sumatra",
          //             componentName: "FFBProductivityNorthSumatraComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Ffb Productivity Phase 01",
          //             componentName: "FFBProductivityImporvementTableComponent",
          //             inputs: ["dashboardFilters"]
          //         },
          //         {
          //             displayName: "Increment in SHFs earnings Phase 1",
          //             componentName: "IncrementInSmallholdersEarningsComponent",
          //             inputs: ["dashboardFilters"]
          //         }
          //     ]
          // },
          // {
            modules:{
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "trading-module-components/launcher.dev/src/app/packageModules/widget-package.module",
            description: "widget",
            apps: [
                {
                    displayName: "Custom Widget",
                    componentName: "WidgetsgridsterComponent",
                    inputs: []
                },
                {
                    displayName: "Custom apps view",
                    componentName: "CustomAppsListViewComponent",
                    inputs: []
                },
                {
                    displayName: "hidden workspaces list",
                    componentName: "HiddenWorkspaceslistComponent",
                    inputs: []
                }
            ]
          }
        // }
      // ]
    }
  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
