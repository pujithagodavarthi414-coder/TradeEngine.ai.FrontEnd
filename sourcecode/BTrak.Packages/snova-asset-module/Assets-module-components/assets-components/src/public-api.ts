import { AssetmanagementModule } from './lib/snovasys-asset-management/assetmanagement.module';
import { LocationManagementPageComponent } from './lib/snovasys-asset-management/containers/location-management.page';
import { ListOfAssetsComponent } from './lib/snovasys-asset-management/component/list-of-assets.components';
import { AssetViewComponent } from './lib/snovasys-asset-management/component/asset-view.component';
import { AssetsReportComponent } from './lib/snovasys-asset-management/component/assets-report.component';
import { AddAssetComponent } from './lib/snovasys-asset-management/component/add-asset.component';
import { DeleteAssetComponent } from './lib/snovasys-asset-management/component/delete-asset.component';
import { AddAssetComments } from './lib/snovasys-asset-management/component/add-asset-comment';
import { VendorManagementPageComponent } from './lib/snovasys-asset-management/containers/vendor-management.page';
import { ListOfAssetsPageComponent } from './lib/snovasys-asset-management/containers/list-of-assets.page';
import { AssetsDashboardPageComponent } from './lib/snovasys-asset-management/containers/assets-dashboard.page';
import { AssetsReportPageComponent } from './lib/snovasys-asset-management/containers/assetsReport.page';
import { ProductManagementComponent } from './lib/snovasys-asset-management/component/product-management.component';
import { AssetsPreviewComponent } from './lib/snovasys-asset-management/component/assets-preview.component';
import { AssetsCommentsAndHistoryComponent } from './lib/snovasys-asset-management/component/assets-comments-and-history.component';
import { ProductDetailsComponent } from './lib/snovasys-asset-management/component/product-details.component';
import { ProductDetailsManagementComponent } from './lib/snovasys-asset-management/component/product-details-management.component';
import { ProductComponent } from './lib/snovasys-asset-management/component/product.component';
import { RecentlyAssignedAssetsComponent } from './lib/snovasys-asset-management/component/recently-assigned-assets.component';
import { RecentlyDamagedAssetsComponent } from './lib/snovasys-asset-management/component/recently-damaged-assets.component';
import { RecentlyPurchasedAssetsComponent } from './lib/snovasys-asset-management/component/recently-purchased-assets.component';
import { SupplierComponent } from './lib/snovasys-asset-management/component/suppliers.component';
import { VendorManagementComponent } from './lib/snovasys-asset-management/component/vendor-management.component';
import { SoftLabelPipe } from './lib/snovasys-asset-management/pipes/softlabel.pipe';
import { RemoveSpecialCharactersPipe } from './lib/globaldependencies/pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './lib/snovasys-asset-management/pipes/fetchSizedAndCachedImage.pipe';
import { CustomAppBaseComponent } from './lib/globaldependencies/components/componentbase';
import { LocationManagementComponent } from './lib/snovasys-asset-management/component/location-management.component';
import { AssetsAllocatedToMeComponent } from './lib/snovasys-asset-management/component/assets-allocated-to-me.component';
import { AssetService } from './lib/snovasys-asset-management/services/assets.service';
import { AssetsExcelService } from './lib/snovasys-asset-management/services/assets-excel.service';
import { ListOfAssetsService } from './lib/snovasys-asset-management/services/list-of-assets.service';
import { LocationManagementService } from './lib/snovasys-asset-management/services/location-management.service';
import { VendorManagementService } from './lib/snovasys-asset-management/services/vendor-management.service';
import { AssetInputModel } from './lib/snovasys-asset-management/models/asset-input-model';
import { PrintAssetsModel } from './lib/snovasys-asset-management/models/print-assets-model';
import { AssetRoutes } from './lib/snovasys-asset-management/assetmanagement.routes';
import { AssetModulesService } from './lib/snovasys-asset-management/services/asset.module.service';

export { AssetmanagementModule };
export { LocationManagementPageComponent }
export { ListOfAssetsComponent }
export { AssetViewComponent }
export { AssetsReportComponent }
export { AddAssetComponent }
export { DeleteAssetComponent }
export { AddAssetComments }
export { VendorManagementPageComponent }
export { ListOfAssetsPageComponent }
export { AssetsDashboardPageComponent }
export { AssetsReportPageComponent }
export { ProductManagementComponent }
export { AssetsPreviewComponent }
export { AssetsCommentsAndHistoryComponent }
export { ProductDetailsComponent }
export { ProductDetailsManagementComponent }
export { ProductComponent }
export { RecentlyAssignedAssetsComponent }
export { RecentlyDamagedAssetsComponent }
export { RecentlyPurchasedAssetsComponent }
export { SupplierComponent }
export { VendorManagementComponent }
export { SoftLabelPipe }
export { RemoveSpecialCharactersPipe }
export { FetchSizedAndCachedImagePipe }
export { CustomAppBaseComponent }
export { LocationManagementComponent }
export { AssetsAllocatedToMeComponent }
export { AssetService }
export { AssetsExcelService }
export { ListOfAssetsService }
export { LocationManagementService }
export { VendorManagementService }
export { AssetInputModel }
export { PrintAssetsModel }
export { AssetRoutes }
export * from './lib/snovasys-asset-management/store/reducers/index';
export * from './lib/snovasys-asset-management/store/actions/assets-assigned-to-me.actions';
export * from './lib/snovasys-asset-management/store/actions/assets.actions';
export * from './lib/snovasys-asset-management/store/actions/assetsCommentsAndHistory.actions';
export * from './lib/snovasys-asset-management/store/actions/assigned-assets.actions';
export * from './lib/snovasys-asset-management/store/actions/currency.actions';
export * from './lib/snovasys-asset-management/store/actions/damaged-assets.actions';
export * from './lib/snovasys-asset-management/store/actions/employee-list.action';
export * from './lib/snovasys-asset-management/store/actions/location.actions';
export * from './lib/snovasys-asset-management/store/actions/product-details.actions';
export * from './lib/snovasys-asset-management/store/actions/product.actions';
export * from './lib/snovasys-asset-management/store/actions/supplier.actions';
export * from './lib/snovasys-asset-management/store/actions/branch.actions';
export * from './lib/snovasys-asset-management/store/actions/soft-labels.actions';
export { CurrencyEffects } from './lib/snovasys-asset-management/store/effects/currency.effects';
export { State as currencyState } from './lib/snovasys-asset-management/store/reducers/currency.reducers';
export { reducer as currencyReducer } from './lib/snovasys-asset-management/store/reducers/currency.reducers';
export { currencyAdapter as currencyAdapter } from './lib/snovasys-asset-management/store/reducers/currency.reducers';
export {AssetModulesService}
