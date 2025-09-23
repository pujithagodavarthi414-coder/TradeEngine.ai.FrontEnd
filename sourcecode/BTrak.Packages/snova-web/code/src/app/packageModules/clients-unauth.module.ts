import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BillingModule,BillingRoutes } from '@thetradeengineorg1/snova-billing-module';


@NgModule({
  imports: [
    BillingModule,
    RouterModule.forChild(BillingRoutes),
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [],
  entryComponents: []
})

export class ClientsUnAuthModule { }
