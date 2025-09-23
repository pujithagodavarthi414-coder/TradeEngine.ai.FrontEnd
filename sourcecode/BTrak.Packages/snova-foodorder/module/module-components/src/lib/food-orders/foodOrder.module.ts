import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import {DateAdapter, MAT_DATE_LOCALE,MAT_DATE_FORMATS } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { LightboxModule } from 'ngx-lightbox';
import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { NgxMaskModule } from 'ngx-mask';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { AvatarModule } from 'ngx-avatar';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TimeagoModule } from 'ngx-timeago';
import { RouterModule } from '@angular/router';
import { FormioModule } from 'angular-formio';

import { AddFoodOrderComponent } from '../food-orders/components/add-food-order.component';
import { FoodOrdersStatusComponent } from '../food-orders/components/all-food-orders-status.component';
import { AllFoodOrdersComponent } from '../food-orders/components/all-food-orders.component';
import { DailyBasisOrdersComponent } from '../food-orders/components/bill-amount-on-daily-basis-food-orders.component';
import { RecentFoodOrdersComponent } from '../food-orders/components/recent-individual-food-orders.component';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { FileSizePipe } from './pipes/filesize-pipe';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { CookieService } from 'ngx-cookie-service';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/helpers/jwt.interceptor';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from './store/reducers/index';
import * as canteenEffects from './store/effects/index';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
export const MY_FORMATS = {
    parse: {
        dateInput: 'DD-MMM-YYYY',
    },
    display: {
        dateInput: 'DD-MMM-YYYY',
        monthYearLabel: 'DD-MMM-YYYY',
    },
};

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
        FormioModule,
        SnovasysAvatarModule,
        DropZoneModule,
        StoreModule.forFeature("foodOrders", reducers.reducers),
        EffectsModule.forFeature(canteenEffects.FoodOrderEffects),
    ],
    declarations: [
        AddFoodOrderComponent,
        FoodOrdersStatusComponent,
        AllFoodOrdersComponent,
        DailyBasisOrdersComponent,
        RecentFoodOrdersComponent, CustomAppBaseComponent, FetchSizedAndCachedImagePipe, FileSizePipe, SoftLabelPipe, RemoveSpecialCharactersPipe, UtcToLocalTimePipe],
    exports: [
        AddFoodOrderComponent,
        FoodOrdersStatusComponent,
        AllFoodOrdersComponent,
        DailyBasisOrdersComponent,
        RecentFoodOrdersComponent
    ],
    entryComponents: [AddFoodOrderComponent,
        FoodOrdersStatusComponent,
        AllFoodOrdersComponent,
        DailyBasisOrdersComponent,
        RecentFoodOrdersComponent, CustomAppBaseComponent
    ],
    providers: [FetchSizedAndCachedImagePipe, FileSizePipe, SoftLabelPipe, DatePipe, RemoveSpecialCharactersPipe, UtcToLocalTimePipe, CookieService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }]
})
export class FoodOrderModule { }