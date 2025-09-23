import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FoodOrderModule, FoodOrdersStatusComponent, AllFoodOrdersComponent, DailyBasisOrdersComponent, RecentFoodOrdersComponent } from "@thetradeengineorg1/snova-foodorder";

export class FoodOrderComponentSupplierService {

  static components =  [
    {
        name: "All food orders",
        componentTypeObject: FoodOrdersStatusComponent
    },
    {
        name: "Food order management",
        componentTypeObject: AllFoodOrdersComponent
    },
    {
        name: "Bill amount on daily basis",
        componentTypeObject: DailyBasisOrdersComponent
    },
    {
        name: "Recent individual food orders",
        componentTypeObject: RecentFoodOrdersComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    FoodOrderModule
  ]
})
export class FoodOrderPackageModule {
  static componentService = FoodOrderComponentSupplierService;
}
