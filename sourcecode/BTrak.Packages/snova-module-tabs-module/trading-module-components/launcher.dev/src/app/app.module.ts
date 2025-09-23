import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { BillingRoutes } from 'trading-module-components/trading-components/src/lib/billing/billing.routing';
import { BillingModule } from 'trading-module-components/trading-components/src/lib/billing/billing.module';
import 'hammerjs';
import "../../../trading-components/src/lib/globaldependencies/helpers/fontawesome-icons";
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
        path: 'module',
        children: BillingRoutes
      }
    ]),
    BrowserModule,
    BillingModule.forChild([]),
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
