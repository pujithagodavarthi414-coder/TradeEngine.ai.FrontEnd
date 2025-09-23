import { Routes } from "@angular/router";

import { ErrorComponent } from "./error/error.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./forgot-password/reset-password.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SigninComponent } from "./signin/signin.component";
import { GenericSigninComponent } from "./generic-signin/generic-signin.component";
import { PaymentComponent } from './Payments/payment.component';
import { StripePaymentComponent } from './Payments/stripe-payment.component';

export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        redirectTo: "signin",
        pathMatch:"full"
      },
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Signin" }
      },
      {
        path: 'generic-signin',
        component: GenericSigninComponent,
        data: { title: 'Signin' }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot password" }
      },
      {
        path: "reset-password/:id",
        component: ResetPasswordComponent,
        data: { title: "Reset password" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      }
      ,
      {
        path: "payments",
        component: PaymentComponent,
        data: { title: "Payments" }
      }
      ,
      {
        path: "stripe-payments",
        component: StripePaymentComponent,
        data: { title: "Payments" }
      }
      
    ]
  }
];
