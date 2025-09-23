import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from "@ngx-translate/core";
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';

import { HrmanagmentRoutes } from './hrmanagment.routing';
import { AddattachmentsComponent } from './addattachments/addattachments.component';
import { HrComponentsModule } from './components/hr-components.module';
import { UserManagementPageComponent } from './containers/usermanagement.page';
import { OrderDashBoardPageComponent } from './containers/order-dashboard.page';

import * as reducers from './store/reducers/index';
import * as HRManagementEffects from './store/effects/index';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/helpers/jwt.interceptor';
import { CustomFieldsComponentModule } from '@snovasys/snova-custom-fields';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import '@progress/kendo-ui';
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
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    RouterModule,
    HrComponentsModule,
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    StoreModule.forFeature("hrManagement", reducers.reducers),
    EffectsModule.forFeature(HRManagementEffects.HRManagementModuleEffects),
    SatPopoverModule,
    DigitOnlyModule,
    MatTooltipModule,
    FontAwesomeModule,
    TranslateModule,
    MatAutocompleteModule,
    GridModule,
    SchedulerModule,
    DateInputsModule,
    DropDownListModule,
    MatButtonToggleModule,
    SnovasysMessageBoxModule,
    CustomFieldsComponentModule,
    SnovasysAvatarModule,
    DropZoneModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [AddattachmentsComponent, UserManagementPageComponent,
    OrderDashBoardPageComponent],

  exports: [],

  entryComponents: [],

  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
})

export class HrmanagmentModule {

}