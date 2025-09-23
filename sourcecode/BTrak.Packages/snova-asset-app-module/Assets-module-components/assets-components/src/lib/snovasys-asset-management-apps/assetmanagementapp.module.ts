import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as AssetManagementEffects from './store/effects/index';
import * as reducers from './store/reducers/index';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { AssetsPreviewComponent } from './component/assets-preview.component';
import { AssetsExcelService } from './services/assets-excel.service';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxMaskModule } from 'ngx-mask';
import { TimeagoModule } from "ngx-timeago";
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { MobileNumberDirective } from './directives/mobile-number.directive';

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
  MobileNumberDirective
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
    StoreModule.forFeature("assetManagement", reducers.reducers),
    EffectsModule.forFeature(AssetManagementEffects.allAssetModuleEffects),
    MatTooltipModule,
    DigitOnlyModule,
    TranslateModule,
    SatPopoverModule,
    PerfectScrollbarModule,
    TimeagoModule.forChild(),
    NgxMaskModule.forRoot(),
  ],
  declarations: [components],
  exports: [components],
  // entryComponents: [AssetsPreviewComponent, AssetsCommentsAndHistoryComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AssetsExcelService,
    SoftLabelPipe,
    RemoveSpecialCharactersPipe,
    FetchSizedAndCachedImagePipe,
    CookieService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})

export class AssetmanagementAppModule { }