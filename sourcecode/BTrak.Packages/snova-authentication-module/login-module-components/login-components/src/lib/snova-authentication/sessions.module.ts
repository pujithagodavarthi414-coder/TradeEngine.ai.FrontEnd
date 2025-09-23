import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";

import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { AuthGuard } from "./auth/auth.guard";
import { ErrorComponent } from "./error/error.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./forgot-password/reset-password.component";
import { WINDOW_PROVIDERS } from "./helpers/window.helper";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SigninComponent } from "./signin/signin.component";
import { GenericSigninComponent } from "./generic-signin/generic-signin.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CookieService } from 'ngx-cookie-service';
import { UnAuthGuard } from './auth/unauth.guard';
import { SessionsRoutes } from './sessions.routing';
// import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from "angularx-social-login"
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PaymentComponent } from './Payments/payment.component';
import { StripePaymentComponent } from './Payments/stripe-payment.component';
import { NotificationDialog } from "./dialogs/push-notification/notifications-dialog";
import { PushNotificationsModule } from 'ng-push-ivy';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { ThemeService } from "./auth/theme.service";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

// export function getAuthServiceConfigs() {
//   let config = new AuthServiceConfig([
//     {
//       id: GoogleLoginProvider.PROVIDER_ID,
//       provider: new GoogleLoginProvider("649948039644-84r79k6962a4t6lb47orgkdppcgb7b6m.apps.googleusercontent.com")
//     }
//   ]);
//   return config;
// }

@NgModule({
  imports: [
    PushNotificationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule,
    // SocialLoginModule,
    FontAwesomeModule,
    MatSelectModule,
    MatDialogModule,
    SnovasysMessageBoxModule,
    
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    // RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [
    NotificationDialog,
    ForgotPasswordComponent,
    SigninComponent,
    GenericSigninComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    ErrorComponent,
    AuthLayoutComponent,
    PaymentComponent,
    StripePaymentComponent,
  ],
  providers: [
    WINDOW_PROVIDERS,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard,
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: getAuthServiceConfigs
    // },
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider("649948039644-84r79k6962a4t6lb47orgkdppcgb7b6m.apps.googleusercontent.com")
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // },
    UnAuthGuard,
    CookieService,
    TranslateService,
    ThemeService
  ],
  entryComponents: [NotificationDialog],
})

export class SessionsModule {
}
