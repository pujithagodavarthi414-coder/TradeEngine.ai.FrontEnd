import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { UploadModule } from '@progress/kendo-angular-upload';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { FormioModule } from 'angular-formio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { AvatarModule } from 'ngx-avatar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { NgSelectModule } from "@ng-select/ng-select";
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from "ngx-color-picker";
import { EditorModule } from "@tinymce/tinymce-angular";
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { MyIntl } from '@snovasys/snova-app-pipes';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AppStoreDialogComponent } from './app-store/app-store-dialog.component';
import { TableComponent } from './table/table.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { DailogBoxComponent } from './dailog-box/dailog-box.component';
import { ModuleSideListComponent } from './module-side-list/module-side-list.component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { AppBaseComponent } from './constants/componentbase';
import { OverviewComponent } from './overview/overview.component';
import { ChartsModule } from 'ng2-charts';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { DashboardTableComponent } from './dashboard-table/dashboard-table.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { InstanceLevelDashboard } from './instance-level/instance-level-dashboard.component';
import { PalmOilDashboard } from './instance-level/palm-oil/palm-oil-dashboard.component';
import { SunFlowerDashboardComponent } from './instance-level/sunflower-oil/sunflower-oil-dashboard.component';
import { GlycerinDashboardComponent } from './instance-level/glycerin/glycerin-dashboard.component';
import { RicebranDashboardComponent } from './instance-level/ricebran-oil/ricebran-oil-dashboard.component';
import { SoyabeanOilDashboardComponent } from './instance-level/soyabean-oil/soyabean-oil-dashboard.component';
import { ConsolidatedDashboardComponent } from './consolidated/consolidated-dashboard.component';
import { PalmOilConsolidatedDashboard } from './consolidated/palm-oil/palm-oil-consolidated-dashboard.component';
import { SunflowerOilConsolidatedDashboard } from './consolidated/sunflower-oil/sunflower-oil-consolidated-dashboard.component';
import { SoyabeanOilConsolidatedDashboard } from './consolidated/soyabean-oil/soyabean-oil-consolidated-dashboard.component';
import { RicebranOilConsolidatedDashboard } from './consolidated/ricebran-oil/ricebran-oil-consolidated-dashboard.component';
import { GlycerinConsolidatedDashboard } from './consolidated/glycerin/glycerin-consolidated-dashboard.component';
import { CPODashboardComponent } from './vessel-level/cpo-dashboard.component';
import { DailyPositionTableComponent } from './daily-position/daily-position-table.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

export const options: Partial<IConfig> = {
  thousandSeparator: ","
};


var components = [ 
  AppBaseComponent, 
  FetchSizedAndCachedImagePipe, 
  RemoveSpecialCharactersPipe,
  OverviewComponent, 
  AppStoreDialogComponent,
  TableComponent,
  AddModuleComponent,
  DailogBoxComponent,
  ModuleSideListComponent,
  DashboardTableComponent,
  InstanceLevelDashboard,
  PalmOilDashboard,
  SunFlowerDashboardComponent,
  GlycerinDashboardComponent,
  RicebranDashboardComponent,
  SoyabeanOilDashboardComponent,
  ConsolidatedDashboardComponent,
  PalmOilConsolidatedDashboard,
  SunflowerOilConsolidatedDashboard,
  SoyabeanOilConsolidatedDashboard,
  RicebranOilConsolidatedDashboard,
  GlycerinConsolidatedDashboard,
  CPODashboardComponent,
  DailyPositionTableComponent
];


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MatIconModule,
    AvatarModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCheckboxModule,
    FontAwesomeModule,
    RouterModule,
    LayoutModule,
    TooltipModule,
    UploadModule,
    SortableModule,
    MatTooltipModule,
    FormioModule,
    FormsModule,
    OrderModule,
    ReactiveFormsModule,
    TranslateModule,
    SatPopoverModule,
    Ng2GoogleChartsModule,
    SharedModule,
    AvatarModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    GridModule,
    ExcelModule,
    MatButtonToggleModule,
    NgSelectModule,
    MatSnackBarModule,
    NgxDocViewerModule,
    NgxGalleryModule,
    DragulaModule,
    ColorPickerModule,
    EditorModule,
    DynamicModule,
    NgxUiLoaderModule,
    SnovasysAvatarModule,
    MatTableModule,
    DynamicModule.withComponents([]),
    NgxMaskModule.forRoot(options),
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
  ],
  declarations: components,
  bootstrap: [DailyPositionTableComponent],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CookieService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
  exports: components,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class BillingModule {
  static forChild(config: any): ModuleWithProviders<BillingModule> {
    return {
      ngModule: BillingModule,
      providers: [
        {provide: 'TradingModuleLoader', useValue: config}
      ]
    };
  }
}