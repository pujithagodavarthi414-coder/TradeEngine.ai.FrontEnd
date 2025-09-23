import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import {CustomFieldsComponentModule} from "@snovasys/snova-custom-fields";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { LocationManagementPageComponent } from './containers/location-management.page';
import { VendorManagementPageComponent } from './containers/vendor-management.page';
import { ListOfAssetsPageComponent } from './containers/list-of-assets.page';
import { AssetsDashboardPageComponent } from './containers/assets-dashboard.page';
import { AssetsReportPageComponent } from './containers/assetsReport.page';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as AssetManagementEffects from './store/effects/index';
import * as reducers from './store/reducers/index';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ProductManagementComponent } from './component/product-management.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { AssetsPreviewComponent } from './component/assets-preview.component';
import { AssetsExcelService } from './services/assets-excel.service';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxMaskModule } from 'ngx-mask';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from "ngx-timeago";
import { AddAssetComments } from './component/add-asset-comment';
import { ListOfAssetsComponent } from './component/list-of-assets.components';
import { AssetViewComponent } from './component/asset-view.component';
import { AssetsReportComponent } from './component/assets-report.component';
import { AddAssetComponent } from './component/add-asset.component';
import { DeleteAssetComponent } from './component/delete-asset.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { LocationManagementComponent } from './component/location-management.component';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { SoftLabelPipe } from './pipes/softlabel.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { AssetsCommentsAndHistoryComponent } from './component/assets-comments-and-history.component';
import { ProductDetailsComponent } from './component/product-details.component';
import { ProductDetailsManagementComponent } from './component/product-details-management.component';
import { ProductComponent } from './component/product.component';
import { RecentlyAssignedAssetsComponent } from './component/recently-assigned-assets.component';
import { RecentlyDamagedAssetsComponent } from './component/recently-damaged-assets.component';
import { RecentlyPurchasedAssetsComponent } from './component/recently-purchased-assets.component';
import { SupplierComponent } from './component/suppliers.component';
import { VendorManagementComponent } from './component/vendor-management.component';
import { AssetsAllocatedToMeComponent } from './component/assets-allocated-to-me.component';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AssetRoutes } from './assetmanagement.routes';
import { MyIntl } from '@snovasys/snova-app-pipes';
import { getPaginatorIntl } from './mat-paginator-localozation'
import { MyAssetsComponent } from './containers/my-assets-template';
import { AssetsAreaComponent } from './component/assets-area-component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { DynamicWidgetComponent } from './containers/dynamic-widget-view';
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { CurrencyComponent } from './component/currency-details';
import { AssetModulesInfo } from './models/asset-comments';
import { AssetModulesService } from './services/asset.module.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

const components = [
  LocationManagementPageComponent,
  ListOfAssetsComponent,
  AssetViewComponent,
  AssetsReportComponent,
  AddAssetComponent,
  DeleteAssetComponent,
  AddAssetComments,
  VendorManagementPageComponent,
  ListOfAssetsPageComponent,
  AssetsDashboardPageComponent,
  AssetsReportPageComponent,
  ProductManagementComponent,
  AssetsPreviewComponent,
  AssetsCommentsAndHistoryComponent,
  ProductDetailsComponent,
  ProductDetailsManagementComponent,
  ProductComponent,
  RecentlyAssignedAssetsComponent,
  RecentlyDamagedAssetsComponent,
  RecentlyPurchasedAssetsComponent,
  SupplierComponent,
  VendorManagementComponent,
  SoftLabelPipe,
  RemoveSpecialCharactersPipe,
  FetchSizedAndCachedImagePipe,
  CustomAppBaseComponent,
  LocationManagementComponent,
  AssetsAllocatedToMeComponent,
  MyAssetsComponent,AssetsAreaComponent,DynamicWidgetComponent,MobileNumberDirective,
  CurrencyComponent
]

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    CustomFieldsComponentModule,
    StoreModule.forFeature("assetsManagement", reducers.reducers),
    EffectsModule.forFeature(AssetManagementEffects.allAssetModuleEffects),
    MatTooltipModule,
    DigitOnlyModule,
    TranslateModule,
    SatPopoverModule,
    PerfectScrollbarModule,
    DynamicModule,
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
    NgxMaskModule.forRoot(),
    RouterModule
  ],
  declarations: components,
  exports: components,
  entryComponents: [AssetsPreviewComponent,AddAssetComponent],
  
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: MatPaginatorIntl, useValue: getPaginatorIntl() },
    AssetsExcelService,
    SoftLabelPipe,
    RemoveSpecialCharactersPipe,
    FetchSizedAndCachedImagePipe,
    CookieService
  ]
})
export class AssetmanagementModule {
  static forChild(config: AssetModulesInfo): ModuleWithProviders<AssetmanagementModule> {
    return {
      ngModule: AssetmanagementModule,
      providers: [
        { provide: AssetModulesService, useValue: config }
      ]
    };
  }

}