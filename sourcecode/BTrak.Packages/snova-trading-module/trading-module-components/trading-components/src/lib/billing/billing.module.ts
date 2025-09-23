import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
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
import { FlexLayoutModule } from '@angular/flex-layout';
// import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { UploadModule } from '@progress/kendo-angular-upload';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { FormioModule } from 'angular-formio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
//import { TimeagoModule } from 'ngx-timeago';
import { TranslateModule } from '@ngx-translate/core';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { AvatarModule } from 'ngx-avatar';
import { NgxDropzoneModule } from 'ngx-dropzone';
// import { RouterModule } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { BillingRoutes } from './billing.routing';
import { NewclientComponent } from './components/newclient/newclient.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectCheckAllComponent } from './components/select-all.component';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ClientExcelService } from './services/client-excel.service';
import { createCustomElement } from '@angular/elements';
import { AppBaseComponent } from './components/componentbase';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { SnovasysAvatarModule } from "@snovasys/snova-avatar";
import { SnovasysMessageBoxModule } from '@snovasys/snova-message-box';
import { NgSelectModule } from "@ng-select/ng-select";
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BillingDashboardService } from './services/billing-dashboard.service';
import { BillingManagementService } from './services/billing-management.service';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AddedclientspageComponent } from './components/addedclientspage/addedclientspage.component';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientsTableComponent } from './components/clients/clients-table.component';
import { DecimaNumberDirective } from './directives/decimal-directive';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { CreditLogsListComponent } from './components/credit-logs/credit-logs.component';
import { AppMonthPickerComponent } from './components/YearPicker/month-picker.component';
import { AppYearPickerComponent } from './components/YearPicker/year-picker.component';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { DragulaModule } from 'ng2-dragula';
import { DocumentsDescriptionComponent } from './components/documents-description/documents-description.component';
import { KycDetailsSubmissionComponent } from './components/kyc-details-submission.component';
import { CounterPartySettingsComponent } from './components/counter-party-settings/counter-party-settings.component';
import { ColorPickerModule } from "ngx-color-picker";
import { ClientKycHistoryComponent } from './components/clients/client-kyc-history.component';
import { ViewFileComponent } from './components/view-file/view-file.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { FileUploadService } from './services/fileUpload.service';
import { HRManagementService } from './services/hr-management.service';
import { ProductivityDashboardService } from './services/productivity-dashboard.service';
import { EmailTemplateComponent } from './components/clients/email-template-configuration';
import { ContractStatusComponent } from './components/master-data/contract-status.component';
import { InvoiceStatusComponent } from './components/master-data/invoice-status.component';
import { ContractTemplateListComponent } from './components/contract/contract-template-list.component';
import { AddContractTemplateDialog } from './components/contract/add-contract-template.component';
// import { AcceptorRejectContractComponent } from './components/PurchaseContract/accept-reject-contract.component';
import { ToleranceComponent } from './components/master-data/tolerance.component';
import { PaymentConditionComponent } from './components/master-data/payment-condition.component';
import { TradeTemplateListComponent } from './components/master-data/trade-templates-list.component';
import { AddTradeTemplateDialog } from './components/master-data/add-trade-templates.component';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { MyIntl } from '@snovasys/snova-app-pipes';
import { RFQStatusComponent } from './components/master-data/rfq-status.component';
import { TwoDigitDecimaNumberDirective } from '../globaldependencies/directives/decimal-number-directive';
import { TradeTemplatesPipe } from './pipes/trade-contracts-filter.pipe';
import { UserFilterPipe } from './pipes/user-filter.pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ProductFilterPipe } from './pipes/products-list-filter.pipe';
import { ContractTemplateComponent } from './components/contract/contract-template.component';
import { TradeTemplateComponent } from './components/contract/trade-template.component';
import { TradeTemplatesFilterPipe } from './pipes/trade-templates-filter.pipe';
import { TradeTemplateTypeFilterPipe } from './pipes/trade-templates-type-filter.pipe';
import { ContractTemplateTypeFilterPipe } from './pipes/contract-templates-filter.pipe';
import { TradeTemplatesXs13Pipe } from './pipes/trade-template-xs13-filter.pipe';
import { VesselConfirmationStatusComponent } from './components/master-data/vessel-confirmation-status.component';
import { BlFilterPipe } from './pipes/bl-filter.pipe';
import { PortCategoryComponent } from './components/master-data/port-category.component';
import { SortByComparatorPipe } from './pipes/sort-filter.pipe';
import { ContractSideListComponent } from './components/contract/contract-side-list.component';
import { ProgramViewComponent } from './components/lives/program/program-view.component';
import { LivesSearchComponent } from './components/lives/lives-search/lives-search.component';
import { KpiTableViewComponent } from './components/lives/program/kpi-table.component';
import { AddKpiDialogComponent } from './components/lives/program/add-kpi-dialog.component';
import { BugetTableViewComponent } from './components/lives/program/budget-table-view.component';
import { AddBudgetDialogComponent } from './components/lives/program/add-budget-dialog.component';
import { ValidationComponent } from './components/lives/validators/validation.component';
import { ValidatorsPageComponent } from './components/lives/validators/validators-page.component';
import { ProgressTableViewComponent } from './components/lives/program/progress-table-view.component';
import { AddProgressDialogComponent } from './components/lives/program/add-progress-dialog.component';
import { ObjectAndBackgroundSmileComponent } from './components/lives/smile-program/objective-background-smile.component';
import { SmileLevelTwoComponent } from './components/lives/smile-program/smile-level2.component';
import { ProgramComponent } from './components/work/program-component';
import { SmileBudgetBreakDownComponent } from './components/lives/smile-program/smile-budget-breakdown.component';
import { AddValidationComponent } from './components/lives/validators/add-validation.component';
import { CollaborationTableComponent } from './components/lives/collaboration/collaboration-table-component';
import { AddCollaborationComponent } from './components/lives/collaboration/add-collaboration-component';
import { LiveWelcomePageComponent } from './components/lives/lives-welcome-page';
import { LivesManagementService } from './services/lives-management.service';
import { ProgressViewComponent } from './components/lives/progress/progress-view.component';
import { ProgressKPI1Component } from './components/lives/progress/progress-kp1.component';
import { ProgressKPI2Component } from './components/lives/progress/progress-kp2.component';
import { ProgressKPI3Component } from './components/lives/progress/progress-kpi3.component';
import { SummaryTableViewComponent } from './components/lives/Summary/summary-table-view.component';
import { SmallHolderApplication } from './components/apps/small-holder-app.component';
import { InsertSpacePipe } from './pipes/insert-space.pipe';
import { CertifiedSHFsNorthSumateraComponent } from './components/lives/overview/certified-shfs/certifed-shs-north-sumatra.component';
import { OverviewComponent } from './components/lives/overview/overview.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { CertifiedSHFsJambiComponent } from './components/lives/overview/certified-shfs/certifed-shs-jambi.component';
import { CertifiedSHFsRiauComponent } from './components/lives/overview/certified-shfs/certifed-shs-riau.component';
import { FFBProductivityJambiComponent } from './components/lives/overview/Ffb-productivity/ffb-productivity-jambi.component';
import { FFBProductivityRiauComponent } from './components/lives/overview/Ffb-productivity/ffb-productivity-riau.component';
import { FFBProductivityNorthSumatraComponent } from './components/lives/overview/Ffb-productivity/ffb-productivity-north-sumatra.component';
import { FFBProductivityImporvementTableComponent } from './components/lives/overview/Ffb-productivity/ffb-productivity-imporvement-table.component';
import { IncrementInSmallholdersEarningsComponent } from './components/lives/overview/Shfs-earnings/increment-smallholders-earnings.component';
import { WidgetService } from './services/widget.service';
import { billingModuleInfo } from './models/dashboardFilterModel';
import { TradingModulesService } from './services/trading.module.service';
import { AppStoreDialogComponent } from './components/lives/overview/app-store/app-store-dialog.component';
import { RouterModule } from '@angular/router';
import { WebPageViewComponent } from './components/lives/overview/web-page-viewer.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

// export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
var components = [ClientsComponent, NewclientComponent, MobileNumberDirective,
  SelectCheckAllComponent, AddedclientspageComponent, EmailTemplateComponent, InvoiceStatusComponent, AppBaseComponent, SoftLabelPipe, UtcToLocalTimePipe, FetchSizedAndCachedImagePipe, RemoveSpecialCharactersPipe,
  DecimaNumberDirective, ClientsTableComponent, CreditLogsListComponent, ContractStatusComponent, AppMonthPickerComponent, AppYearPickerComponent, DocumentsDescriptionComponent, KycDetailsSubmissionComponent, CounterPartySettingsComponent, ClientKycHistoryComponent, ViewFileComponent,
  ContractTemplateListComponent, AddContractTemplateDialog,
  ToleranceComponent, PaymentConditionComponent, TradeTemplateListComponent, AddTradeTemplateDialog, RFQStatusComponent,
  BlFilterPipe, UserFilterPipe, TradeTemplatesXs13Pipe,
  TwoDigitDecimaNumberDirective, TradeTemplatesPipe, ProductFilterPipe,
  ContractTemplateComponent, TradeTemplateComponent, TradeTemplatesFilterPipe, TradeTemplateTypeFilterPipe, ContractTemplateTypeFilterPipe, VesselConfirmationStatusComponent,
  PortCategoryComponent, SortByComparatorPipe, ContractSideListComponent, ProgramViewComponent, LivesSearchComponent, KpiTableViewComponent, AddKpiDialogComponent, ValidationComponent, ValidatorsPageComponent, AddValidationComponent,
  BugetTableViewComponent, AddBudgetDialogComponent, ProgressTableViewComponent, AddProgressDialogComponent, ObjectAndBackgroundSmileComponent, SmileLevelTwoComponent,
  ProgramComponent, SmileBudgetBreakDownComponent, CollaborationTableComponent, AddCollaborationComponent, LiveWelcomePageComponent, ProgressViewComponent, ProgressKPI1Component,
  ProgressKPI2Component, ProgressKPI3Component, SummaryTableViewComponent,SmallHolderApplication, InsertSpacePipe, CertifiedSHFsNorthSumateraComponent,WebPageViewComponent, OverviewComponent, 
  CertifiedSHFsJambiComponent, CertifiedSHFsRiauComponent, FFBProductivityJambiComponent, FFBProductivityRiauComponent, FFBProductivityNorthSumatraComponent, FFBProductivityImporvementTableComponent,
  IncrementInSmallholdersEarningsComponent, AppStoreDialogComponent
];


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
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
    // RouterModule.forChild(BillingRoutes),
    LayoutModule,
    TooltipModule,
    UploadModule,
    SortableModule,
    MatTooltipModule,
    FormioModule,
    FormsModule,
    OrderModule,
    ReactiveFormsModule,
    //TimeagoModule.forChild(),
    TranslateModule,
    SatPopoverModule,
    Ng2GoogleChartsModule,
    SharedModule,
    AvatarModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    GridModule,
    ExcelModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    NgSelectModule,
    MatSnackBarModule,
    DropZoneModule,
    NgxDocViewerModule,
    NgxMaskModule.forRoot(),
    NgxGalleryModule,
    DragulaModule,
    ColorPickerModule,
    EditorModule,
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
  ],
  declarations: components,
  providers: [LivesManagementService, ClientExcelService, BillingDashboardService, BillingManagementService, GoogleAnalyticsService,
    ClientExcelService, UserService, WidgetService, SoftLabelPipe, DecimalPipe, FileUploadService, HRManagementService, ProductivityDashboardService,
    TradeTemplateTypeFilterPipe,
    ContractTemplateTypeFilterPipe, BlFilterPipe,
    SortByComparatorPipe,InsertSpacePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CookieService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },

  ],
  exports: components,

  // entryComponents:[],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class BillingModule {
  static forChild(config: billingModuleInfo): ModuleWithProviders<BillingModule> {
    return {
      ngModule: BillingModule,
      providers: [
        {provide: TradingModulesService, useValue: config },
        {provide: 'TradingModuleLoader', useValue: config}
      ]
    };
  }
}