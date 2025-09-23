import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PayrollRunComponent, PayslipConfirmationDialog, PayRollRunDialog, PayRollRunEmployeeLeaveDetailsDialog } from './Payroll/components/payroll-run/payroll-run.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { 
  PayrollRunEmployeeComponent
} from './Payroll/components/payroll-run-employee/payroll-run-employee.component';
import { PopupModule } from '@progress/kendo-angular-popup';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {FlexModule, FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ProgressBarModule } from "angular-progress-bar";
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RemoveSpecialCharactersPipe } from './Payroll/pipes/removeSpecialCharacters.pipe';
import { CronEditorModule } from "cron-editor";
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { WorkFlowTriggerDialogComponent } from './Payroll/components/workflow/workflow-trigger-dialog.component';
import { PayRollConfigurationComponent } from './Payroll/components/payrollconfiguration.component';
import { PayrollfrequencyComponent } from './Payroll/components/payrollfrequency/payrollfrequency.component';
import { CustomAppBaseComponent } from './globaldependencies/components/componentbase';
import { PayRollTemplateConfigurationComponent } from './Payroll/components/payrolltemplateconfiguartion.component';
import { CookieService } from 'ngx-cookie-service';
import './globaldependencies/helpers/fontawesome-icons'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './globaldependencies/helpers/jwt.interceptor';
import { PayRollRunEmployeeComponentDialog } from './Payroll/components/payroll-run-employee/payroll-run-employee-component-dialog';
import { DialogOverviewExampleDialog1 } from './Payroll/components/payroll-run-employee/payroll-run-employee-dialog';
import { PayRollRunEmployeeComponentHistoryDialog } from './Payroll/components/payroll-run-employee/payroll-run-employee-component-history-dialog';
import * as payRollReducers from "./Payroll/store/reducers/index";
import * as PayRollModuleEffects from "./Payroll/store/effects/index";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from './globaldependencies/helpers/moment-utc-date-adapter';
import { PayRollRunEmployeesDialog } from './Payroll/components/payroll-run/payroll-runemployees.component';
import { FetchSizedAndCachedImagePipe } from './Payroll/pipes/fetchSizedAndCachedImage.pipe';
import { PayRollRunEmployeeComponentYTDDialog } from './Payroll/components/payroll-run-employee/payroll-run-employee-component-ytd-dialog';
import { MobileNumberDirective } from './Payroll/directives/mobile-number.directive';

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
  declarations: [PayrollRunComponent, 
    PayrollRunEmployeeComponent, 
    PayslipConfirmationDialog,
    PayRollRunDialog,
    PayRollRunEmployeeLeaveDetailsDialog,
    PayslipConfirmationDialog,
    PayRollRunEmployeeComponentDialog,
    DialogOverviewExampleDialog1,
    PayRollRunEmployeeComponentHistoryDialog,
    WorkFlowTriggerDialogComponent,
    PayRollConfigurationComponent,
    CustomAppBaseComponent,
    PayrollfrequencyComponent,
    RemoveSpecialCharactersPipe,
    PayRollTemplateConfigurationComponent,
    PayRollRunEmployeesDialog,
    FetchSizedAndCachedImagePipe,
    PayRollRunEmployeeComponentYTDDialog,
    MobileNumberDirective
    ],
  imports: [
    CommonModule,
    GridModule,
    PopupModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    FlexModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    TranslateModule,
    FontAwesomeModule,
    MatCardModule,
    ProgressBarModule,
    SnovasysAvatarModule,    
    StoreModule.forFeature("payRollManagement", payRollReducers.reducers),
    EffectsModule.forFeature(PayRollModuleEffects.allPayRollModuleEffects),
    GridModule,
    MatProgressBarModule,
    MatCheckboxModule,
    SatPopoverModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
    CronEditorModule,
    SnovasysMessageBoxModule,
    MatSlideToggleModule,
    StoreModule.forFeature("payRollManagement", payRollReducers.reducers),
    EffectsModule.forFeature(PayRollModuleEffects.allPayRollModuleEffects)
  ],
  providers:[CookieService,DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  entryComponents: [
    PayrollRunEmployeeComponent,
    PayslipConfirmationDialog,
    PayRollRunDialog,
    PayRollRunEmployeeLeaveDetailsDialog,
    PayRollRunEmployeeComponentDialog,
    DialogOverviewExampleDialog1,
    PayRollRunEmployeeComponentHistoryDialog,
    WorkFlowTriggerDialogComponent,
    PayRollRunEmployeesDialog,
    PayRollRunEmployeeComponentYTDDialog],
})
export class PayrollManagementModule { }

