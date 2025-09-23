import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule, DecimalPipe, UpperCasePipe } from '@angular/common';
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
import { ChartsModule } from 'ng2-charts';
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
import { ViewScheduleComponent } from './components/schedule/viewschedule.component';
import { CreatescheduleComponent } from './components/schedule/createschedule/createschedule.component';
import { EditScheduleComponent } from './components/schedule/edit-schedule.component';
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
import { AssetService } from './services/assets.service';
import { BillingDashboardService } from './services/billing-dashboard.service';
import { BillingManagementService } from './services/billing-management.service';
import { ProductivityDashboardService } from './services/productivity-dashboard.service';
import { UserService } from './services/user.service';
import { WidgetService } from './services/widget.service';
import { CookieService } from 'ngx-cookie-service';
import { AddedclientspageComponent } from './components/addedclientspage/addedclientspage.component';
import { ClientKycConfigurationComponent } from './components/client-Kyc/client-kyc-configuration.component';
 
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddClientKycDialogComponent } from './components/client-Kyc/addKycDialog.component';
import { LeadTemplateComponent } from './components/lead-templates/lead-template.component';
import { AddLeadTemplateDialog } from './components/lead-templates/add-lead-template-dialog.component';
import { ClientsTableComponent } from './components/clients/clients-table.component';
import { LeadSubmissionDialogComponent } from './components/lead-templates/lead-submission-dialog.component';
import { PurchaseDialogComponent } from './components/client-purchase/purchaseDialog.component';
import { PurchaseContractComponent } from './components/client-purchase/purchase-configuration.component';
import { ContractSubmissionDialogComponent } from './components/client-purchase/contract-dialog.component';
import { ScoDecisionComponent } from './components/sco/sco-decision.component';
 import { SitesComponent } from './components/invoice-forms/site.component';
import { GRDComponent } from './components/invoice-forms/GRD.component';
import { DecimaNumberDirective } from './directives/decimal-directive';
import { VatComponent } from './components/invoice-forms/vat.component';
import { SolarLogComponent } from './components/invoice-forms/solar-log.component';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { EntryFormFieldComponent } from './components/invoice-forms/entry-form-field.component';
import { ProductTableComponent } from './components/master-table/product-table.component';
import { ScoListComponent } from './components/sco/sco-list.component';
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { GradeComponent } from './components/grade/grade.component';
import { ContractComponent } from './components/clients/contract.component';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { ContractListComponent } from './components/clients/contract-list.component';
import { AddLeadDialogComponent } from './components/lead-templates/add-lead-dialog.component';
import { PaymentTermComponent } from './components/PaymentTerm/payment-term.component';
import { PortDetailsComponent } from './components/PortDetails/port-details.component';
import { LeadsListComponent } from './components/lead-templates/leads-list.component';
import { InvoiceLedger } from './components/invoice-ledger/invoice-ledger.component';
import { PerformaInvoiceComponent } from './components/performa-invoice-component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { CreditLogsListComponent } from './components/credit-logs/credit-logs.component';
import { ConsigneeComponent } from './components/consignee/consignee.component';
import { ConsignerListComponent } from './components/consigner/consigner-list.component';
import { PurchaseContractListComponent } from './components/purchaseContract/purchase-contract.component';
import { PurchaseContractComponentPopup } from './components/purchaseContract/purchase-contract-popup.component';
import { SupplierBlComponent } from './components/bl-List/supplier-bl.component';
import { BlListComponent } from './components/bl-List/bl-list.component';
import { ShipmentExecutionForm } from './components/supplier-process/shipment-execution-form.component';
import { ShipmentExecutionList } from './components/supplier-process/shipment-execution-list.component';
import { VesselComponent } from './components/supplier-process/vessel.component';
import { ShipmentStageTwoForm } from './components/supplier-process/stage-two-process.component';
import { ChaConfirmationMail } from './components/supplier-process/cha-confirmation-mail.component';
import { CreditNoteComponent } from './components/credit-note/credit-note.component';
import { AppMonthPickerComponent } from './components/YearPicker/month-picker.component';
import { AppYearPickerComponent } from './components/YearPicker/year-picker.component';
import { MasterAccountComponent } from './components/master-account/master-account.component';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ExpenseBookingComponent } from './components/expense-booking/expense-booking.component';
import { PaymentReceiptComponent } from './components/payment-receipt/payment-receipt.component';
import { MailCreditNoteComponent } from './components/credit-note/mail-credit-note.component';
import { GridforSitesProjectionComponent } from './components/invoice-forms/grid-sites-projection.component';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { LegalEntityComponent } from './components/legal-entity.component';
import { CounterPartyTypesComponent } from './components/counter-party/counter-party-types-list.component';
import { DragulaModule } from 'ng2-dragula';
import { ShipAddressComponent } from './components/ship-Address/ship-address.component';
import { DocumentsDescriptionComponent } from './components/documents-description/documents-description.component';
import { ReceiptsComponent } from './components/Receipts/receipts.component';
import { KycDetailsSubmissionComponent } from './components/kyc-details-submission.component';
import { CounterPartySettingsComponent } from './components/counter-party-settings/counter-party-settings.component';
import { KycFormStatusComponent } from './components/client-Kyc/kyc-form-status.component';
import { ColorPickerModule } from "ngx-color-picker";
import { ClientKycHistoryComponent } from './components/clients/client-kyc-history.component';
import { ViewFileComponent } from './components/view-file/view-file.component';
import { TemplateConfigComponent } from './components/clients/template-configuration.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TemplateViewDialog } from './components/clients/template-view.component';

export const MY_FORMATS = {
  parse: {
      dateInput: 'DD-MMM-YYYY',
  },
  display: {
      dateInput: 'DD-MMM-YYYY',
      monthYearLabel: 'DD-MMM-YYYY',
  },
};

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
var components = [ClientsComponent, NewclientComponent, CreatescheduleComponent,MobileNumberDirective,ContractListComponent,AddLeadDialogComponent,KycFormStatusComponent,
  SelectCheckAllComponent, ViewScheduleComponent, AddedclientspageComponent,ClientKycConfigurationComponent,AddClientKycDialogComponent,ProductTableComponent,
  EditScheduleComponent, AppBaseComponent, SoftLabelPipe, UtcToLocalTimePipe, FetchSizedAndCachedImagePipe, RemoveSpecialCharactersPipe,ContractComponent,TemplateConfigComponent,
  SitesComponent,GRDComponent,DecimaNumberDirective,VatComponent, SolarLogComponent,EntryFormFieldComponent,ClientsTableComponent,ScoListComponent,GradeComponent,
  LeadTemplateComponent,AddLeadTemplateDialog, LeadSubmissionDialogComponent,PurchaseDialogComponent,PurchaseContractComponent,ContractSubmissionDialogComponent
  ,ScoDecisionComponent,PaymentTermComponent, PortDetailsComponent, LeadsListComponent, InvoiceLedger, PerformaInvoiceComponent, CreditLogsListComponent, PurchaseContractListComponent,
  PurchaseContractComponentPopup,ConsignerListComponent,ConsigneeComponent,ShipmentExecutionForm,ShipmentExecutionList,SupplierBlComponent,BlListComponent,PurchaseContractComponentPopup,ConsignerListComponent,ConsigneeComponent,
  VesselComponent,ShipmentStageTwoForm,ChaConfirmationMail, CreditNoteComponent, AppMonthPickerComponent, AppYearPickerComponent,MasterAccountComponent,ExpenseBookingComponent,PaymentReceiptComponent,MailCreditNoteComponent,GridforSitesProjectionComponent,
    LegalEntityComponent, CounterPartyTypesComponent,ShipAddressComponent,DocumentsDescriptionComponent,ReceiptsComponent,KycDetailsSubmissionComponent,CounterPartySettingsComponent, ClientKycHistoryComponent,ViewFileComponent,TemplateViewDialog
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
    //RouterModule.forChild(BillingRoutes),
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
    NgxMaskModule.forRoot(),
    NgxGalleryModule,
    DragulaModule,
    ColorPickerModule,
    EditorModule
  ],
  declarations: components,
  providers: [ClientExcelService, AssetService, BillingDashboardService, BillingManagementService,GoogleAnalyticsService,
    ClientExcelService, ProductivityDashboardService, UserService, WidgetService, SoftLabelPipe,DecimalPipe, UpperCasePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
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

  }
  // customElements.define('app-billing-component-invoice-newinvoice', createCustomElement(AddnewinvoiceComponent, { injector }));
  // customElements.define('app-clients', createCustomElement(ClientsComponent, { injector }));
  // customElements.define('app-edit-estimate', createCustomElement(EditEstimateComponent, { injector }));
  // customElements.define('add-estimate', createCustomElement(AddEstimateDialogComponent, { injector }));
  // customElements.define('estimate-details-dialog', createCustomElement(EstimateDetailsDialogComponent, { injector }));
  // customElements.define('estimate-details-preview', createCustomElement(EstimateDetailsPreviewComponent, { injector }));
  // customElements.define('estimate-history', createCustomElement(EstimateHistoryComponent, { injector }));
  // customElements.define('estimates-view', createCustomElement(EstimatesViewComponent, { injector }));
  // customElements.define('app-estimates', createCustomElement(EstimatesComponent, { injector }));
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
  // customElements.define('app-new-estimate', createCustomElement(NewEstimateComponent, { injector }));
  // customElements.define('app-newclient', createCustomElement(NewclientComponent, { injector }));
  // customElements.define('app-createschedule', createCustomElement(CreatescheduleComponent, { injector }));
  // customElements.define('app-billing-component-client-schedule-edit', createCustomElement(EditScheduleComponent, { injector }));
  // customElements.define('app-billing-component-client-schedule-viewschedule', createCustomElement(ViewScheduleComponent, { injector }));
 