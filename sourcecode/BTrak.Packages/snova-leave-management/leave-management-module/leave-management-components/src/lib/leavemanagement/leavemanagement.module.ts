import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { GridModule } from "@progress/kendo-angular-grid";

import { SatPopoverModule } from "@ncstate/sat-popover";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { LeaveApplicabilityComponent } from "./components/leave-applicability.component";
import { LeaveEncashmentComponent } from "./components/leave-encashment.component";
import { LeaveFrequencyComponent } from "./components/leave-frequency.component";
import { LeavesListComponent } from "./components/leave-list.component";
import { NewLeaveTypePageComponent } from "./containers/new-leave-type.page";
import * as LeaveManagementEffects from "./store/effects/index";
import * as reducers from "./store/reducers/index";
import { TimeagoModule } from "ngx-timeago";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ColorPickerModule } from "ngx-color-picker";
import { LeaveHistoryComponent } from './components/leave-history.component';
import { LeaveApplicationDetailsComponent } from './containers/leave-application-details.component';
import { CalendarViewComponent } from './components/calendar-view.component';
import { LeavesDashBoardListComponent } from './containers/leavesdashboard.component';
import { LeaveTypesListComponent } from './components/leave-type-list.component';
import { AppBaseComponent } from '../globaldependencies/components/componentbase';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { SchedulerModule } from "@progress/kendo-angular-scheduler";
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { MyLeavesListComponent } from './components/myleaves-myprofile-component';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { LeaveManagementRoutes } from './leave-management.routing';
import { MessageService } from '@progress/kendo-angular-l10n';
import { ShedularTranslateService } from './services/schedular-translate-service';

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
    FontAwesomeModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    TimeagoModule,
    TranslateModule,
    SatPopoverModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ColorPickerModule,
    SchedulerModule,
    RouterModule,
    //RouterModule.forChild(LeaveManagementRoutes),
    StoreModule.forFeature("leaveManagement", reducers.reducers),
    EffectsModule.forFeature(LeaveManagementEffects.LeaveManagementEffects),
    GridModule,
    LayoutModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    SnovasysCommentsModule,
    DropZoneModule
  ],
  declarations: [NewLeaveTypePageComponent, LeaveApplicabilityComponent
    , LeaveFrequencyComponent, LeaveEncashmentComponent, CalendarViewComponent,
    LeavesListComponent, LeaveHistoryComponent, LeaveApplicationDetailsComponent,
    LeavesDashBoardListComponent, LeaveTypesListComponent, AppBaseComponent,
    MyLeavesListComponent,
    SoftLabelPipe, FetchSizedAndCachedImagePipe, RemoveSpecialCharactersPipe, UtcToLocalTimePipe],
  exports: [
    NewLeaveTypePageComponent, LeaveApplicabilityComponent
    , LeaveFrequencyComponent, LeaveEncashmentComponent, CalendarViewComponent,
    LeavesListComponent, LeaveHistoryComponent, LeaveApplicationDetailsComponent,
    LeavesDashBoardListComponent, LeaveTypesListComponent, AppBaseComponent,
    MyLeavesListComponent
  ],
  entryComponents:[
    NewLeaveTypePageComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MessageService, useClass: ShedularTranslateService },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    SoftLabelPipe, FetchSizedAndCachedImagePipe, RemoveSpecialCharactersPipe, UtcToLocalTimePipe,DatePipe]
})

export class LeaveManagementModule {
}