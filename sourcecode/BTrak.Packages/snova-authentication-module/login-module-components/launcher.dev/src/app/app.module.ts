import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SessionsRoutes, SessionsModule } from 'login-module-components/login-components/src/public-api';
import { routerConfig } from './app.routing';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

// import { StripeModule } from "stripe-angular"
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'https://btrak489-development.snovasys.com/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardLayoutComponent
  ],
  
  imports: [
    SessionsModule,
    RouterModule.forRoot(routerConfig),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    //StripeModule.forRoot('sk_test_51HmAScBhbYiQx04hkREtiYOGObvcBiLEE4vVQcqspTknqqPbGvaXcdGzyTcRcBE2NXUA7VTNrEvgJaoZav1diqzZ00vi8CS0SV'),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    HttpClientModule
  ],  
  bootstrap: [AppComponent],
  
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
})
export class AppModule { }
