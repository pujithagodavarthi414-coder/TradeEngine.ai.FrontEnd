import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CanteenModule, CanteenPurchaseSummaryComponent, CreditComponent, FoodItemsListComponent, OffersCreditedComponent } from "@thetradeengineorg1/snova-canteen";


export class CanteenComponentSupplierService {

  static components =  [
    {
        name: "Canteen purchase summary",
        componentTypeObject: CanteenPurchaseSummaryComponent
    },
    {
        name: "Canteen credit",
        componentTypeObject: CreditComponent
    },
    {
        name: "Canteen food items list",
        componentTypeObject: FoodItemsListComponent
    },
    {
        name: "Canteen offers credited",
        componentTypeObject: OffersCreditedComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    CanteenModule
  ]
})
export class CanteenPackageModule {
  static componentService = CanteenComponentSupplierService;
}
