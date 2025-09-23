import { Routes } from '@angular/router';
import { ListOfAssetsPageComponent } from './containers/list-of-assets.page';
import { AssetsDashboardPageComponent } from './containers/assets-dashboard.page';
import { AssetsReportPageComponent } from './containers/assetsReport.page';
import { LocationManagementPageComponent } from './containers/location-management.page';
import { VendorManagementPageComponent } from './containers/vendor-management.page';
import { ProductDetailsManagementComponent } from './component/product-details-management.component';
import { AddAssetComponent } from './component/add-asset.component';
import { AssetsAreaComponent } from './component/assets-area-component';

export const AssetRoutes: Routes = [{
    path: "",
    // component: AssetsAreaComponent, data: { title: 'Assetmanagement' },
    children: [
      { path: '', component: AssetsAreaComponent, data: { title: 'Assetmanagement' } },
      { path: ':tab', component: AssetsAreaComponent, data: { title: 'Assetmanagement' } },
      {
        path: 'assetdashboard',
        component: AssetsDashboardPageComponent,
        data: { title: 'Asset Dashboard', breadcrumb: 'Asset Dashboard' },
      },
      {
        path: 'assetsreport',
        component: AssetsReportPageComponent,
        data: { title: 'Assets Reports', breadcrumb: 'Assets Reports' },
      },
      {
        path: 'listofassets',
        component: AssetsAreaComponent,
        data: { title: 'List of Assets', breadcrumb: 'List of Assets' }
      },
      {
        path: 'listofassets/addasset',
        component: AddAssetComponent,
        data: { title: 'Add Asset', breadcrumb: 'Add Asset' },
      },
      {
        path: 'locationmanagement',
        component: LocationManagementPageComponent,
        data: { title: 'Locations Management', breadcrumb: 'Locations Management' },
      },
      {
        path: 'vendormanagement',
        component: VendorManagementPageComponent,
        data: { title: 'Vendor Management', breadcrumb: 'Vendor Management' },
      },
      {
        path: 'productdetailsmanagement',
        component: ProductDetailsManagementComponent,
        data: { title: 'Product Management', breadcrumb: 'Product Management' },
      }
      
    ]
  }
]
