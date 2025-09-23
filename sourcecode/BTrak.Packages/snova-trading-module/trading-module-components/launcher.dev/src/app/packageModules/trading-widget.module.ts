import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertifiedSHFsJambiComponent, CertifiedSHFsNorthSumateraComponent, CertifiedSHFsRiauComponent, FFBProductivityImporvementTableComponent, FFBProductivityJambiComponent, FFBProductivityNorthSumatraComponent, FFBProductivityRiauComponent, IncrementInSmallholdersEarningsComponent, SmallHolderApplication } from 'project-components/public-api';
// import { SmallHolderApplication } from 'trading-module-components/trading-components/src/lib/billing/components/apps/small-holder-app.component';
// import { CertifiedSHFsNorthSumateraComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/certified-shfs/certifed-shs-north-sumatra.component';
// import { CertifiedSHFsJambiComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/certified-shfs/certifed-shs-jambi.component';
// import { CertifiedSHFsRiauComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/certified-shfs/certifed-shs-riau.component';
// import { FFBProductivityJambiComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/Ffb-productivity/ffb-productivity-jambi.component';
// import { FFBProductivityRiauComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/Ffb-productivity/ffb-productivity-riau.component';
// import { FFBProductivityNorthSumatraComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/Ffb-productivity/ffb-productivity-north-sumatra.component';
// import { FFBProductivityImporvementTableComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/Ffb-productivity/ffb-productivity-imporvement-table.component';
// import { IncrementInSmallholdersEarningsComponent } from 'trading-module-components/trading-components/src/lib/billing/components/lives/overview/Shfs-earnings/increment-smallholders-earnings.component';

export class TradingComponentService {

  static components = [
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
    CommonModule
  ]
})

export class TradingWidgetPackageModule {
  static componentService = TradingComponentService;
}
