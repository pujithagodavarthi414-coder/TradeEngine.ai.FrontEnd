import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { RouterModule } from '@angular/router';
import { SnovasysAvatarModule } from  "@thetradeengineorg1/snova-avatar";
import { DynamicModule } from "@thetradeengineorg1/snova-ndc-dynamic";
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { SatPopoverModule } from "@ncstate/sat-popover";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CookieService } from "ngx-cookie-service";
import { ToastrModule } from 'ngx-toastr';
import { PubNubAngular } from 'pubnub-angular2';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { TimeagoModule } from "ngx-timeago";
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from '../globaldependencies/pipes/workflowstatus.pipes';
import { FetchSizedAndCachedImagePipe } from '../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { OrderByPipe } from '../globaldependencies/pipes/orderby-pipe';
import { UtcToLocalTimePipe } from '../globaldependencies/pipes/utctolocaltime.pipe';
import { WINDOW_PROVIDERS } from '../globaldependencies/helpers/window.helper';
import { SanitizeHtmlPipe } from '../globaldependencies/pipes/sanitize.pipe';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { ThemeService } from './services/theme.service';
import { LayoutService } from './services/layout.service';
import * as reducers from "./store/reducers/index";
import * as SharedEffects from "./store/effects/index";
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { HeaderSideComponent } from './components/header-side/header-side.component';
import { HeaderTopComponent } from './components/header-top/header-top.component';
import { MenuComponent } from './components/menu/menu.component';
import { AnnoucementDialogComponent } from './components/notifications/announcement-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SidebarTopComponent } from './components/sidebar-top/sidebar-top.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WorkItemsDialogComponent } from './components/all-work-items-dialog/all-work-items-dialog.component';
import { ShellModulesService } from './services/shell.modules.service';
import { shellModulesInfo } from './models/shellModulesInfo';
import { FeedBackSubmissionComponent } from './components/submit-feedback/submit-feedback.component';
import { FeedTimeComponent } from './components/feed-time/feed-time.component';
import { FeedTimeDialogComponent } from './components/feed-time/feed-time-dialog.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HighLightTextPipe } from '../globaldependencies/pipes/highLightText.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExportConfigurationDialogComponent } from './components/export-import-configuration/export-configuration.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SideBarComponent } from './components/sidenav/side-bar.component';
import { DocumentManagementModule } from "@thetradeengineorg1/snova-document-management";
import { DropZoneModule } from "@thetradeengineorg1/snova-file-uploader";
import { AccountAndBillingComponent } from './components/Payments/account.component';
import { ProductAndServicesComponent } from './components/Payments/product-service.component';
import { CompanyInformationComponent } from './components/Payments/company-information';
import { DocumentComponent } from './components/Payments/document.component';
import { TransactionsComponent } from './components/Payments/transactions.component';
import { PaymentMethodComponent } from './components/Payments/payment-method.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PurchaseMoreLicensesComponent } from './components/Payments/purchase-more-licenses';
import { CompanyPlansComponent } from './components/Payments/company-plans.component';
import { PushNotificationsModule } from 'ng-push-ivy';
import { LiveWelcomePageComponent } from './components/lives/lives-welcome-page';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const dialogMock = {
  close: () => { }
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export const COMPONENTS = [
  AdminLayoutComponent,
  ConfirmationDialogComponent,
  ExportConfigurationDialogComponent,
  HeaderSideComponent,
  HeaderTopComponent,
  MenuComponent,
  AnnoucementDialogComponent,
  NotificationsComponent,
  SidebarTopComponent,
  SidenavComponent,
  RemoveSpecialCharactersPipe,
  CustomAppBaseComponent,
  RemoveSpecialCharactersPipe,
  SoftLabelPipe,
  HighLightTextPipe,
  UtcToLocalTimeWithDatePipe,
  WorkflowStatusFilterPipe,
  FetchSizedAndCachedImagePipe,
  OrderByPipe,
  UtcToLocalTimePipe,
  SanitizeHtmlPipe,
  WorkItemsDialogComponent,
  FeedTimeDialogComponent,
  FeedBackSubmissionComponent,
  FeedTimeComponent,
  SideBarComponent,
  AccountAndBillingComponent,
  ProductAndServicesComponent,
  CompanyInformationComponent,
  DocumentComponent,
  TransactionsComponent,
  PaymentMethodComponent,
  PurchaseMoreLicensesComponent,
  CompanyPlansComponent,
  LiveWelcomePageComponent,
  CompanyInformationComponent,
  
];

@NgModule({
  imports: [
    RouterModule,
    //RouterModule.forChild(PaymentRoutes),
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SatPopoverModule,
    DynamicModule.withComponents([]),
    MatCardModule,
    MatProgressBarModule,
    FontAwesomeModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    OwlDateTimeModule,
    NgxUiLoaderModule,
    MatTabsModule,
    MatTableModule,
    NgxDropzoneModule,
    NgxDatatableModule,
    OwlNativeDateTimeModule,
    TimeagoModule.forRoot(),
    SnovasysAvatarModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    StoreModule.forFeature("sharedManagement", reducers.reducers),
    EffectsModule.forFeature(SharedEffects.allSharedModuleEffects),
    PerfectScrollbarModule,
    MatCheckboxModule,
    NgxDropzoneModule,
    MatBadgeModule,
    PushNotificationsModule,
    DocumentManagementModule,
    DropZoneModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  entryComponents: [WorkItemsDialogComponent, FeedTimeDialogComponent, ConfirmationDialogComponent, ExportConfigurationDialogComponent, PurchaseMoreLicensesComponent],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    RemoveSpecialCharactersPipe,
    SoftLabelPipe,
    HighLightTextPipe,
    UtcToLocalTimeWithDatePipe,
    WorkflowStatusFilterPipe,
    FetchSizedAndCachedImagePipe,
    OrderByPipe,
    UtcToLocalTimePipe,
    DatePipe,
    SanitizeHtmlPipe,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-gb' },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    WINDOW_PROVIDERS,
    GoogleAnalyticsService,
    ThemeService,
    LayoutService,
    PubNubAngular
  ]
})

export class ShellModule {
  constructor() {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }

  static forChild(config: shellModulesInfo): ModuleWithProviders<ShellModule> {
    return {
      ngModule: ShellModule,
      providers: [
        { provide: ShellModulesService, useValue: config }
      ]
    };
  }
}
