import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { AssetmanagementAppModule, VendorManagementComponent, LocationManagementComponent, ProductDetailsManagementComponent, RecentlyPurchasedAssetsComponent, RecentlyAssignedAssetsComponent, RecentlyDamagedAssetsComponent, AssetsAllocatedToMeComponent, AssetsCommentsAndHistoryComponent } from "@thetradeengineorg1/snova-asset-app-module";


export class AssetmanagementAppComponentSupplierService {

  static components =  [
    {
        name: "Vendor management",
        componentTypeObject: VendorManagementComponent
    },
    {
        name: "Location management",
        componentTypeObject: LocationManagementComponent
    },
    {
        name: "Product management",
        componentTypeObject: ProductDetailsManagementComponent
    },
    {
        name: "Recently purchased assets",
        componentTypeObject: RecentlyPurchasedAssetsComponent
    },
    {
        name: "Recently assigned assets",
        componentTypeObject: RecentlyAssignedAssetsComponent
    },
    {
        name: "Recently damaged assets",
        componentTypeObject: RecentlyDamagedAssetsComponent
    },
    {
        name: "Assets allocated to me",
        componentTypeObject: AssetsAllocatedToMeComponent
    },
    {
        name: "Assets comments and history",
        componentTypeObject: AssetsCommentsAndHistoryComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    AssetmanagementAppModule
  ],
  entryComponents: [
    AssetsAllocatedToMeComponent,
    RecentlyAssignedAssetsComponent,
    RecentlyPurchasedAssetsComponent,
    RecentlyDamagedAssetsComponent,
    VendorManagementComponent,
    ProductDetailsManagementComponent,
    LocationManagementComponent
  ]
})
export class AssetmanagementAppPackageModule {
  static componentService = AssetmanagementAppComponentSupplierService;
}
