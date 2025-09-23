import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
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

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from "@ngx-translate/core";
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';

import { RosterRoutes } from './roster.routing';

import * as reducers from './store/reducers/index';
import * as RosterManagementEffects from './store/effects/index';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// import { GlobalModule } from "app/global/global.module";
// import { CommonNameModule } from '../../common/common-name.module';

// import { MomentUtcDateAdapter } from '../../shared/directives/moment-utc-date-adapter';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AddRosterComponent } from './components/add-employee-roster.component';
import { ViewRosterComponent } from './containers/view-employee-roster.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { AvatarModule } from 'ngx-avatar';
import { LayoutModule } from '@angular/cdk/layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { RosterSchedulerComponent } from './components/roster-scheduler.component';
import { RosterEmployeeFilterPipe } from './pipes/roster-employee-filter.pipe';
import { BryntumSchedulerComponent } from './components/bryntum-scheduler.component';
import { AutoRosterComponent } from './components/auto-employee-roster.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ViewAndLoadRosterTemplate } from './components/template-employee-roster.component';
import { SchedulerEditFormComponent } from './components/edit-kendo-scheduler.component';
import { ViewRosterDetailsComponent } from './components/view-employee-roster-details.component';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { CookieService } from 'ngx-cookie-service';
import '../globaldependencies/helpers/fontawesome-icons';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { ViewRosterPlanDetailsComponent } from './components/view-employee-roster-plan-details.component';
import { SnovasysMessageBoxModule, SnovasysMessageBoxComponent } from "@snovasys/snova-message-box";
import { SnovasysAppPipesModule, SanitizeHtmlPipe } from "@snovasys/snova-app-pipes";
import { SnovasysAvatarModule, SnovasysAvatarComponent } from "@snovasys/snova-avatar";
import { ConvertUtcToLocalTimePipe } from './pipes/utctolocaltimeconversion.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    // RouterModule.forChild(RosterRoutes),
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    StoreModule.forFeature("rosterManagement", reducers.reducers),
    // StoreModule.forFeature("hrManagement", hrManagementModuleReducer.reducers),
    EffectsModule.forFeature(RosterManagementEffects.RosterManagementModuleEffects),
    // EffectsModule.forFeature(hrManagementModuleEffects.HRManagementModuleEffects),
    SatPopoverModule,
    DigitOnlyModule,
    MatTooltipModule,
    FontAwesomeModule,
    // GlobalModule,
    // CommonNameModule,
    TranslateModule,
    MatAutocompleteModule,
    SchedulerModule,
    DateInputsModule,
    DropDownListModule,
    MatButtonToggleModule,
    GridModule,
    AvatarModule,
    DropDownsModule,
    ButtonsModule,
    DialogsModule,
    MatSlideToggleModule,
    SnovasysMessageBoxModule,
    SnovasysAppPipesModule,
    SnovasysAvatarModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [AddRosterComponent, ViewRosterComponent, RosterSchedulerComponent, BryntumSchedulerComponent,
    AutoRosterComponent, ViewAndLoadRosterTemplate, SchedulerEditFormComponent, ViewRosterDetailsComponent,
    RosterEmployeeFilterPipe, CustomAppBaseComponent, ViewRosterPlanDetailsComponent,
    ConvertUtcToLocalTimePipe, FetchSizedAndCachedImagePipe,
    RemoveSpecialCharactersPipe],

  exports: [],

  // entryComponents: [AutoRosterComponent, ViewAndLoadRosterTemplate, ViewRosterPlanDetailsComponent],

  providers: [
    CurrencyPipe,
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CookieService,

  ]
})

export class RosterModule {

}
