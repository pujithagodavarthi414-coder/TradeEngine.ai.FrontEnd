import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { FormioModule } from 'angular-formio';
import { EditorModule } from "@tinymce/tinymce-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OrderModule } from 'ngx-order-pipe';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from '@ngx-translate/core';
import { TimeagoModule } from "ngx-timeago";
import { AvatarModule } from 'ngx-avatar';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { StatusReportingDialogComponent } from './components/status-reporting-dialog.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SoftLabelPipe } from './pipes/soft-labels.pipe';
import { StatusReportingComponent } from './components/statusReporting.component';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimeWithDatePipe } from '../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { ConvertUtcToLocalTimePipe } from './pipes/utctolocaltimeconversion.pipe';
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { StatusReportsNamePipe } from './pipes/statusreportsnamefilter.pipe';
import { StatusReportComponent } from './components/statusreport.component';
import { ViewformComponent } from './components/view-form.component';
import { ViewindividualreportsComponent } from './components/viewindividualreports.component';
import { ViewreportsComponent } from './components/viewreports.component';
import { ViewSubmitedReportsComponent } from './components/viewsubmitedreports.component';
import { SanitizeHtmlPipe } from './pipes/sanitize.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { StatusReportsSettingsComponent } from './components/status-reports-settings.component';
import { StatusreportService } from './services/statusreport.service';
import { StatusReportsModuleInfo } from "./models/StatusReportsModuleInfo";
import { StatusReportsModuleService } from './services/statusreports.modules.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

const componentsToInclude = [
  CustomAppBaseComponent,
  SoftLabelPipe,
  StatusReportingDialogComponent,
  StatusReportingComponent,
  ViewformComponent,
  ViewindividualreportsComponent,
  ViewreportsComponent,
  ViewSubmitedReportsComponent,
  AvatarComponent,
  RemoveSpecialCharactersPipe,
  UtcToLocalTimeWithDatePipe,
  ConvertUtcToLocalTimePipe,
  StatusReportsNamePipe,
  StatusReportComponent,
  StatusReportsSettingsComponent,
  SanitizeHtmlPipe];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatAutocompleteModule,
    SnovasysCommentsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    EditorModule,
    MatGridListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTabsModule,
    MatCheckboxModule,
    FontAwesomeModule,
    MatTooltipModule,
    FormioModule,
    FormsModule,
    OrderModule,
    ReactiveFormsModule,
    TimeagoModule.forChild(),
    TranslateModule,
    SatPopoverModule,
    TranslateModule,
    AvatarModule,
    MatSlideToggleModule,
    SnovasysMessageBoxModule,
    MatPaginatorModule,
    DynamicModule
  ],

  declarations: [
    componentsToInclude
  ],
  exports: [componentsToInclude],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe,
    SoftLabelPipe, 
    StatusReportsNamePipe,
    RemoveSpecialCharactersPipe,
    UtcToLocalTimeWithDatePipe,
    ConvertUtcToLocalTimePipe,
    SanitizeHtmlPipe,
    CookieService,
    GoogleAnalyticsService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  entryComponents: [
    StatusReportingDialogComponent,
    StatusReportingComponent,
    ViewformComponent,
    ViewindividualreportsComponent,
    ViewreportsComponent,
    ViewSubmitedReportsComponent,
    StatusReportComponent
  ]
}) 

export class StatusReportsModule {

  static forChild(config: StatusReportsModuleInfo): ModuleWithProviders<StatusReportsModule> {
    return {
      ngModule: StatusReportsModule,
      providers: [
        { provide: StatusReportsModuleService, useValue: config }
      ]
    };
  }
}

