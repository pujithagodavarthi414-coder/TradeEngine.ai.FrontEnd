import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';


import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { LightboxModule } from 'ngx-lightbox';
import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { AvatarModule } from 'ngx-avatar';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TimeagoModule } from 'ngx-timeago';
import { RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FormioModule } from 'angular-formio';
import { NgxMaskModule } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { FoodItemsListComponent } from '../canteen/components/food-items-list.component';
import { CanteenPurchaseSummaryComponent } from '../canteen/components/canteen-purchase-summary.component';
import { AddCanteenCreditComponent } from '../canteen/components/add-canteen-credit.component';
import { AddCanteenFoodItemComponent } from '../canteen/components/add-canteen-food-item.component';
import { CreditComponent } from '../canteen/components/credit.component';
import { OffersCreditedComponent } from '../canteen/components/offers-credited-to-users.component';
import { PurchaseFoodItemComponent } from '../canteen/components/purchase-food-item.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from './store/reducers/index';
import * as CanteenEffects from './store/effects/index';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { CookieService } from 'ngx-cookie-service';
import { CanteenManagementPageComponent } from './containers/canteen-management.page';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/helpers/jwt.interceptor';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { CanteenManagementService } from './services/canteen-management.service';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    TranslateModule,
    FlexLayoutModule,
    NgxDatatableModule,
    Ng2GoogleChartsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DigitOnlyModule,
    FontAwesomeModule,
    TranslateModule,
    SatPopoverModule,
    MatAutocompleteModule,
    LightboxModule,
    MatDialogModule,
    MatSlideToggleModule,
    GridModule,
    SchedulerModule,
    MatButtonToggleModule,
    NgxMaskModule.forRoot(),
    SnovasysMessageBoxModule,
    AvatarModule,
    NgxGalleryModule,
    NgxDropzoneModule,
    EditorModule,
    TimeagoModule,
    MatSnackBarModule,
    RouterModule,
    SignaturePadModule,
    FormioModule,
    StoreModule.forFeature("canteen", reducers.reducers),
    EffectsModule.forFeature(CanteenEffects.CanteenModuleEffects),
    SnovasysAvatarModule,

  ],
  declarations: [OffersCreditedComponent, FoodItemsListComponent, CanteenPurchaseSummaryComponent, CustomAppBaseComponent, RemoveSpecialCharactersPipe, CanteenManagementPageComponent, AddCanteenCreditComponent, FetchSizedAndCachedImagePipe, SoftLabelPipe, AddCanteenFoodItemComponent, CreditComponent, OffersCreditedComponent, PurchaseFoodItemComponent,],
  providers: [DatePipe, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: [] }
    , FetchSizedAndCachedImagePipe, SoftLabelPipe, RemoveSpecialCharactersPipe, CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },CanteenManagementService
  ],
  exports: [
    OffersCreditedComponent, FoodItemsListComponent, CanteenPurchaseSummaryComponent, RemoveSpecialCharactersPipe,
     CanteenManagementPageComponent, AddCanteenCreditComponent, FetchSizedAndCachedImagePipe, SoftLabelPipe, 
     AddCanteenFoodItemComponent, CreditComponent, OffersCreditedComponent, PurchaseFoodItemComponent
    ],
  entryComponents:[OffersCreditedComponent, 
    FoodItemsListComponent, 
    CanteenPurchaseSummaryComponent,
    CanteenManagementPageComponent, 
    AddCanteenCreditComponent, AddCanteenFoodItemComponent, CreditComponent, OffersCreditedComponent, PurchaseFoodItemComponent]
})

export class CanteenModule {

}