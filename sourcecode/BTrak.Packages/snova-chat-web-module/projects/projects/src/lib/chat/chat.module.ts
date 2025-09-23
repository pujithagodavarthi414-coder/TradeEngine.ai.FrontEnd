import { TimeUsageService } from './services/time-usage.service';

import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from "@angular/core";
import {  Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
//import { SharedModule } from '@progress/kendo-angular-dialog';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//import { NgxDatatableModule } from "@swimlane/ngx-datatable";


import { MatTabsModule } from '@angular/material/tabs';
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
import { MatSidenavModule } from '@angular/material/sidenav';
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
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from "ng2-charts";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { AvatarModule } from 'ngx-avatar';

export { ChatRoutes } from './chat.routing';
//import { ActivityScreenshotsComponent } from './components/activity-screenshots-component';
//import { UtcToLocalTimePipe } from '../globaldependencies/pipes/utctolocaltime.pipe';
//import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
//import { ActivityTimeFilterPipe } from '../globaldependencies/pipes/activityTimeConversion.pipe';
//import { CapitalizeFirstPipe } from '../globaldependencies/pipes/capitalizeFirst.pipe';
//import { SoftLabelPipe } from '../globaldependencies/pipes/softlabels.pipes';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { TimeagoModule } from "ngx-timeago";
//import { TimeUsageComponent } from './components/time-usage.component';
//import { WebsitesAndApplicationsComponent } from './components/websites-and-applications.component';
//import { WebAppUsageComponent } from './components/web-app-usage.component';
//import { TimeUsageDrillDownComponent } from './components/time-usage-drilldown.component';
//import { ScreenshotsComponent } from './components/screenshots-component';
//import { AppUsageReportComponent } from './components/app-usage-report.component';
//import { EmployeeActivityLogDetailsComponent } from './components/employee-activity-log-details.component';
//import { ActivityDashboardPageComponent } from './containers/activitydashboard.page';
//import { FetchSizedAndCachedImagePipe } from '../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
//import { RosterEmployeeFilterPipe } from '../globaldependencies/pipes/roster-employee-filter.pipe';
import "../globaldependencies/helpers/fontawesome-icons"
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { ToastrModule, ToastrService } from 'ngx-toastr';
//import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createCustomElement } from "@angular/elements";
import { ChatComponent } from './components/chat-display/ChatComponent.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { MyFilterPipe } from './components/chat-display/my-filter.pipe';
import { ColleagueSortByPipe } from './components/messenger/colleague-sort-by.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import { PushNotificationsModule } from 'ng-push-ivy';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MentionModule } from 'angular-mentions';
import { RemoveSpecialCharactersPipe } from "./pipes/removeSpecialCharacters.pipe";
import { FetchSizedAndCachedImagePipe } from "./pipes/fetchSizedAndCachedImage.pipe";
import { CreateChannelDialog } from "../chat/dialogs/create-channel/create-channel-dialog";
import { AddMembersToChannelDialog } from "../chat/dialogs/add-members-to-channel/add-members-to-channel";
import { PushNotificationDialog } from "../chat/dialogs/push-notification/push-notifications-dialog";


export const appRoutes: Routes = [{ path: "" }];

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  //return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.co.uk/assets/i18n/', '.json');
}

const avatarColors = ["#f39c12"];
 const components = [ CustomAppBaseComponent,
  PushNotificationDialog,
  CreateChannelDialog,
  AddMembersToChannelDialog,
  RemoveSpecialCharactersPipe,
  FetchSizedAndCachedImagePipe,
  ChatComponent,
  MyFilterPipe,
  ColleagueSortByPipe,
  MessengerComponent,
  AvatarComponent];

@NgModule({
  declarations:components,
  imports: [
    EmojiModule,
    MentionModule,
    PickerModule,
    PushNotificationsModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    //SharedModule,
    FlexLayoutModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    //NgxDatatableModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule,
    MatListModule,
    MatGridListModule,
    ChartsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatSidenavModule,
    SatPopoverModule,
    NgSelectModule,
    MatSlideToggleModule,
     TranslateModule
     //.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
    ,
    AvatarModule,
    TimeagoModule.forRoot(),
    SatPopoverModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    //NgxDatatableModule,
    FontAwesomeModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,

    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NgSelectModule,
    MatSlideToggleModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    AvatarModule.forRoot({
      colors: avatarColors
    })
  ],
  exports: components,
  providers: [DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //TranslateService,
    CookieService,
    //SoftLabelPipe,
    ToastrService,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    TimeUsageService,
    RemoveSpecialCharactersPipe,
    FetchSizedAndCachedImagePipe
  ],

  entryComponents: [AvatarComponent, CreateChannelDialog, AddMembersToChannelDialog, PushNotificationDialog
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SnovaChatModule { 
  constructor(private injector: Injector ) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}
