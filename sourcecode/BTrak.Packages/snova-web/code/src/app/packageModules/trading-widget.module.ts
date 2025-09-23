import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BillingModule, BillingRoutes, ContractStatusComponent, InvoiceStatusComponent, TradeTemplateListComponent, ToleranceComponent, PaymentConditionComponent, ContractTemplateListComponent, RFQStatusComponent, VesselConfirmationStatusComponent, PortCategoryComponent, SmallHolderApplication,
  CertifiedSHFsNorthSumateraComponent, CertifiedSHFsRiauComponent, CertifiedSHFsJambiComponent, FFBProductivityJambiComponent, FFBProductivityRiauComponent, FFBProductivityNorthSumatraComponent, FFBProductivityImporvementTableComponent, IncrementInSmallholdersEarningsComponent
} from '@thetradeengineorg1/snova-trading-module';

import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentUtcDateAdapter } from "../common/helpers/moment-utc-date-adapter";
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

export class TradingComponentService {

  static components = [
    {
      name: "Contract status",
      componentTypeObject: ContractStatusComponent
    },
    {
      name: "Trade invoice status",
      componentTypeObject: InvoiceStatusComponent
    },
    {
      name: "Tolerances",
      componentTypeObject: ToleranceComponent
    },
    {
      name: "Payment conditions",
      componentTypeObject: PaymentConditionComponent
    },
    {
      name: "Contract templates",
      componentTypeObject: ContractTemplateListComponent
    },
    {
      name: "Document trade templates",
      componentTypeObject: TradeTemplateListComponent
    },
    {
      name: "RFQ status",
      componentTypeObject: RFQStatusComponent
    },
    {
      name: "Vessel Confirmation Status",
      componentTypeObject: VesselConfirmationStatusComponent
    },
    {
      name: "Port Category",
      componentTypeObject: PortCategoryComponent
    },
    {
      name: "Independent Smallholder Certification",
      componentTypeObject: SmallHolderApplication
    },
    {
      name: "Certified SHFs North Sumatra",
      componentTypeObject: CertifiedSHFsNorthSumateraComponent
    },
    {
      name: "Certified SHFs Jambi",
      componentTypeObject: CertifiedSHFsJambiComponent
    },
    {
      name: "Certified SHFs Riau",
      componentTypeObject: CertifiedSHFsRiauComponent
    },
    {
      name: "Ffb Productivity - Phase 1 Jambi",
      componentTypeObject: FFBProductivityJambiComponent
    },
    {
      name: "Ffb Productivity - Phase 1 Riau",
      componentTypeObject: FFBProductivityRiauComponent
    },
    {
      name: "Ffb Productivity - Phase 1 North Sumatra",
      componentTypeObject: FFBProductivityNorthSumatraComponent
    },
    {
      name: "Ffb Productivity Phase 01",
      componentTypeObject: FFBProductivityImporvementTableComponent
    },
    {
      name: "Increment in SHFs earnings Phase 1",
      componentTypeObject: IncrementInSmallholdersEarningsComponent
    }
  ]
}

@NgModule({
  imports: [
    BillingModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: BillingRoutes
      }
    ]),
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
    { provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  entryComponents: []
})

export class TradingWidgetPackageModule {
  static componentService = TradingComponentService;
}
