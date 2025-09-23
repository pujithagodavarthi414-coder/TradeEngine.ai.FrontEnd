import { NgModule, Injector } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
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
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { DigitOnlyModule } from '@uiowa/digit-only';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';

import { RosterRoutes } from './rostering/roster.routing';

import * as rosterReducers from './rostering/store/reducers/index';
// import * as hrManagementModuleReducer from "../rostering/hrmanagment/store/reducers/index";
// import * as hrManagementModuleEffects from "../rostering/hrmanagment/store/effects";
import * as RosterManagementEffects from './rostering/store/effects';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AddRosterComponent } from './rostering/components/add-employee-roster.component';
import { ViewRosterComponent } from './rostering/containers/view-employee-roster.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { AvatarModule } from 'ngx-avatar';
import { LayoutModule } from '@angular/cdk/layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { RosterSchedulerComponent } from './rostering/components/roster-scheduler.component';
import { RosterEmployeeFilterPipe } from './rostering/pipes/roster-employee-filter.pipe';
import { BryntumSchedulerComponent } from './rostering/components/bryntum-scheduler.component';
import { AutoRosterComponent } from './rostering/components/auto-employee-roster.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ViewAndLoadRosterTemplate } from './rostering/components/template-employee-roster.component';
import { SchedulerEditFormComponent } from './rostering/components/edit-kendo-scheduler.component';
import { ViewRosterDetailsComponent } from './rostering/components/view-employee-roster-details.component';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AvatarComponent } from 'ngx-avatar/lib/avatar.component';
import { CookieService } from 'ngx-cookie-service';
import { MomentUtcDateAdapter } from './globaldependencies/helpers/moment-utc-date-adapter';
import { RosterService } from './rostering/services/roster-service';
import { JwtInterceptor } from './globaldependencies/helpers/jwt.interceptor';
import { reducers, metaReducers } from '../store/reducers/index';
import { ViewRosterPlanDetailsComponent } from './rostering/components/view-employee-roster-plan-details.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

export function HttpLoaderFactory(httpClient: HttpClient) {
  console.log('inside http loader child');
  return new TranslateHttpLoader(httpClient, 'https://btrak489-test.snovasys.com/assets/i18n/', '.json');
}
const dialogMock = {
  close: () => { }
};

@NgModule({
  declarations: [
    //global
    CustomAppBaseComponent,
    AddRosterComponent, ViewRosterComponent, RosterSchedulerComponent, BryntumSchedulerComponent,
    RosterEmployeeFilterPipe,
    AutoRosterComponent, ViewAndLoadRosterTemplate, SchedulerEditFormComponent, ViewRosterDetailsComponent,
  ],
  imports: [
    RouterModule,
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
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NgxDatatableModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    HttpClientModule,
    MatSnackBarModule,

    //training-matrix
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    AvatarModule,
    GridModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    StoreModule.forFeature("rosterManagement", rosterReducers.reducers),
    EffectsModule.forFeature(RosterManagementEffects.RosterManagementModuleEffects)
  ],
  // entryComponents: [
  //   //training-matrix
  //   AddRosterComponent, ViewRosterComponent, RosterSchedulerComponent, BryntumSchedulerComponent,
  //   AutoRosterComponent, ViewAndLoadRosterTemplate, SchedulerEditFormComponent,
  //   ViewRosterDetailsComponent, RosterEmployeeFilterPipe, ViewRosterPlanDetailsComponent
  // ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    RosterService,
    TranslateService,
    CookieService,
    RosterEmployeeFilterPipe,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class ProjectComponentsModule {
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
    
    // customElements.define('app-hr-component-add-roster', createCustomElement(AddRosterComponent, { injector }));
    // customElements.define('app-hr-component-view-roster', createCustomElement(ViewRosterComponent, { injector }));
    // customElements.define('app-hr-component-roster-scheduler', createCustomElement(RosterSchedulerComponent, { injector }));
    // customElements.define('bry-scheduler', createCustomElement(BryntumSchedulerComponent, { injector }));
    // customElements.define('app-hr-component-auto-roster', createCustomElement(AutoRosterComponent, { injector }));
    // customElements.define('app-hr-component-view-template-roster-plans', createCustomElement(ViewAndLoadRosterTemplate, { injector }));
    // customElements.define('scheduler-edit-form', createCustomElement(SchedulerEditFormComponent, { injector }));
    // customElements.define('app-hr-component-view-roster-details', createCustomElement(ViewRosterDetailsComponent, { injector }));

  }
}
