import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { UploadModule } from '@progress/kendo-angular-upload';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter  } from 'ngx-timeago';
import { TranslateModule } from '@ngx-translate/core';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { SharedModule } from '@progress/kendo-angular-dialog';
import { AvatarModule } from 'ngx-avatar';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectCheckAllComponent } from './components/select-all.component';
import { SendInvoiceComponent } from './components/invoice/send-invoice.component';
import { InvoiceTableComponent } from './components/invoice/invoice-table.component';
import { InvoiceDetailsComponent } from './components/invoice/invoice-details.component';
import { InvoiceDraftinvoiceComponent } from './components/invoice/draft-invoice.component';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { AddInvoiceDialogComponent } from './components/invoice/add-invoice-dialog.component';
import { AddInvoiceComponent } from './components/invoice/add-invoice.component';
import { InvoiceDetailsDialogComponent } from './components/invoice/invoice-details-dialog.component';
import { InvoiceDetailsPreviewComponent } from './components/invoice/invoice-details-preview.component';
import { InvoiceHistoryComponent } from './components/invoice/invoice-history.component';
import { InvoiceStatusComponent } from './components/invoice/invoice-status.component';
import { InvoicesComponent } from './components/invoice/invoices.component';
import { AppBaseComponent } from './components/componentbase';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { SnovasysAvatarModule } from "@snovasys/snova-avatar";
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { NgSelectModule } from "@ng-select/ng-select";
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AssetService } from './services/assets.service';
import { BillingDashboardService } from './services/billing-dashboard.service';
import { ProductivityDashboardService } from './services/productivity-dashboard.service';
import { UserService } from './services/user.service';
import { WidgetService } from './services/widget.service';
import { CookieService } from 'ngx-cookie-service';
import { createCustomElement } from '@angular/elements';
import { AddEstimateDialogComponent } from './components/estimates/add-estimate-dialog.component';
import { EstimateDetailsDialogComponent } from './components/estimates/estimate-details-dialog.component';
import { EstimateDetailsPreviewComponent } from './components/estimates/estimate-details-preview.component';
import { EstimateHistoryComponent } from './components/estimates/estimate-history.component';
import { EstimatesViewComponent } from './components/estimates/estimates-view.component';
import { EstimatesComponent } from './components/estimates/estimates.component';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from '../globaldependencies/pipes/workflowstatus.pipes';
import { AmountDirective } from './pipes/amount.directive';
import { MyIntl } from '@snovasys/snova-app-pipes';
import { InvoicesAreaComponent } from './components/invoice/invoices-area-component';
import { DynamicWidgetComponent } from './components/invoice/dynamic-widget-component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import {CustomFieldsComponentModule} from "@snovasys/snova-custom-fields";
import { BillingWidgetModulesInfo } from './models/invoice-project-model';
import { BiilingwidgetModulesService } from './services/billing-widgets.module.service';
import { AddGroupEComponent } from './components/GroupE/add-groupe.component';
import { MatDividerModule } from '@angular/material/divider';
import { AppYearPickerComponent } from './components/YearPicker/year-picker.component';
import { AppMonthPickerComponent } from './components/YearPicker/month-picker.component';
import { GroupETableComponent } from './components/GroupE/groupe-table.component';
import { ViewGroupEComponent } from './components/GroupE/view-groupE.component';
import { MailEntryGroupEComponent } from './components/GroupE/mail-entry-groupe.component';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { BankAccountComponent } from './components/GroupE/bank-account.component';
import { TwoDigitDecimaNumberDirective } from './pipes/two-digit-decima-number.directive';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ViewHistoryComponent } from './components/GroupE/view-history.component';
import { MessageFieldTypeComponent } from './components/GroupE/message-field-type.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export const appRoutes: Routes = [{ path: "" }];
var components = [InvoiceDraftinvoiceComponent,
  SelectCheckAllComponent, SendInvoiceComponent,
  InvoiceTableComponent, InvoiceDetailsComponent,
  AppBaseComponent, AddInvoiceDialogComponent, SoftLabelPipe, AddInvoiceComponent, InvoiceDetailsPreviewComponent
  , InvoiceHistoryComponent, InvoiceStatusComponent, InvoiceDetailsDialogComponent, InvoicesComponent
  , UtcToLocalTimePipe, FetchSizedAndCachedImagePipe, RemoveSpecialCharactersPipe, UtcToLocalTimeWithDatePipe, WorkflowStatusFilterPipe, AmountDirective
  , AddEstimateDialogComponent,InvoicesAreaComponent,DynamicWidgetComponent, EstimateDetailsDialogComponent, EstimateDetailsPreviewComponent, EstimateHistoryComponent, EstimatesViewComponent,
   EstimatesComponent, AddGroupEComponent, AppYearPickerComponent, AppMonthPickerComponent, GroupETableComponent,ViewGroupEComponent,MailEntryGroupEComponent,BankAccountComponent, TwoDigitDecimaNumberDirective,
   ViewHistoryComponent,MessageFieldTypeComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
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
    FormsModule,
    ReactiveFormsModule,
    CustomFieldsComponentModule,
    DynamicModule,
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
    TranslateModule,
    SatPopoverModule,
    SharedModule,
    AvatarModule,
    MatSlideToggleModule,
    GridModule,
    ExcelModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    NgSelectModule,
    MatDividerModule,
    DropZoneModule,
    NgxDropzoneModule,
    NgxGalleryModule,
    NgxMaskModule.forRoot()
  ],
  declarations: components,
  providers: [AssetService, BillingDashboardService,
    ProductivityDashboardService, UserService, WidgetService, MatSnackBar,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    CookieService, DatePipe, SoftLabelPipe, DecimalPipe
  ],
  exports: components,
  // entryComponents: [InvoiceDraftinvoiceComponent,
  //   SelectCheckAllComponent, SendInvoiceComponent,
  //   InvoiceTableComponent, InvoiceDetailsComponent,
  //   AppBaseComponent, AddInvoiceDialogComponent, AddInvoiceComponent, InvoiceDetailsPreviewComponent
  //   , InvoiceHistoryComponent, InvoiceStatusComponent, InvoiceDetailsDialogComponent, InvoicesComponent,InvoicesAreaComponent,DynamicWidgetComponent
  //   , AddEstimateDialogComponent, EstimateDetailsDialogComponent, EstimateDetailsPreviewComponent, EstimateHistoryComponent, EstimatesViewComponent, EstimatesComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceModule {

  static forChild(config: BillingWidgetModulesInfo): ModuleWithProviders<InvoiceModule> {
    return {
      ngModule: InvoiceModule,
      providers: [
        {provide: BiilingwidgetModulesService, useValue: config }
      ]
    };
  }
  constructor(private injector: Injector) {
    // customElements.define('add-invoice', createCustomElement(AddInvoiceDialogComponent, { injector }));
    // customElements.define('add-invoice', createCustomElement(AddInvoiceComponent, { injector }));
    // customElements.define('app-billing-component-invoice-draftinvoice', createCustomElement(InvoiceDraftinvoiceComponent, { injector }));
    // customElements.define('invoice-details-dialog', createCustomElement(InvoiceDetailsDialogComponent, { injector }));
    // customElements.define('invoice-details-preview', createCustomElement(InvoiceDetailsPreviewComponent, { injector }));
    // customElements.define('app-billing-component-invoice-invoicedetails', createCustomElement(InvoiceDetailsComponent, { injector }));
    // customElements.define('invoice-history', createCustomElement(InvoiceHistoryComponent, { injector }));
    // customElements.define('invoice-status', createCustomElement(InvoiceStatusComponent, { injector }));
    // customElements.define('app-billing-component-invoice-invoicetable', createCustomElement(InvoiceTableComponent, { injector }));
    // customElements.define('invoices', createCustomElement(InvoicesComponent, { injector }));
    // customElements.define('app-billing-component-invoice-sendinvoice', createCustomElement(SendInvoiceComponent, { injector }));
    // customElements.define('app-createschedule', createCustomElement(CreatescheduleComponent, { injector }));
    // customElements.define('app-billing-component-client-schedule-edit', createCustomElement(EditScheduleComponent, { injector }));
    // customElements.define('app-billing-component-client-schedule-viewschedule', createCustomElement(ViewScheduleComponent, { injector }));
  }
}