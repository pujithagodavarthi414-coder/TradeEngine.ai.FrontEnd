import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { AvatarModule } from 'ngx-avatar';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { MomentUtcDateAdapter } from './globaldependencies/helpers/moment-utc-date-adapter';
import { JwtInterceptor } from './globaldependencies/helpers/jwt.interceptor';
import * as payRollReducers from "./Payroll/store/reducers/index";
import * as PayRollModuleEffects from "./Payroll/store/effects/index";
import { PayrollManagementModule } from '../lib/payroll-management.module';

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

@NgModule({
  declarations: [
    CustomAppBaseComponent
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
    PayrollManagementModule,
    MatTabsModule,
    MatSlideToggleModule,
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    StoreModule.forFeature("payRollManagement", payRollReducers.reducers),
    EffectsModule.forFeature(PayRollModuleEffects.allPayRollModuleEffects)
  ],
  entryComponents: [
    //training-matrix
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class ProjectComponentsModule {
  constructor() {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
    
    // customElements.define('app-payrollcomponent', createCustomElement(PayRollComponentComponent, { injector }));
    // customElements.define('app-hr-component-view-roster', createCustomElement(ViewRosterComponent, { injector }));
    // customElements.define('app-hr-component-roster-scheduler', createCustomElement(RosterSchedulerComponent, { injector }));
    // customElements.define('bry-scheduler', createCustomElement(BryntumSchedulerComponent, { injector }));
    // customElements.define('app-hr-component-auto-roster', createCustomElement(AutoRosterComponent, { injector }));
    // customElements.define('app-hr-component-view-template-roster-plans', createCustomElement(ViewAndLoadRosterTemplate, { injector }));
    // customElements.define('scheduler-edit-form', createCustomElement(SchedulerEditFormComponent, { injector }));
    // customElements.define('app-hr-component-view-roster-details', createCustomElement(ViewRosterDetailsComponent, { injector }));

  }
}
