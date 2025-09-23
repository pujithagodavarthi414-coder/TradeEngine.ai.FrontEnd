import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { EmployeeListRouting } from './employeeList.routing';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { EmployeeListComponent } from './components/employee-list.component';
import { EmployeeListPageComponent } from './components/employeeList.page';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/helpers/jwt.interceptor';
import { EmployeeUploadPopupComponent } from './components/employee-upload';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { StoreModule } from '@ngrx/store';
import * as reducers from './store/reducers/index';
import * as HRManagementEffects from './store/effects/index';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InductionConfigurationComponent } from './components/induction-work-items/induction-configuration.component';
import { EmployeeInductionComponent } from './components/induction-work-items/employee-induction.component';
import { InductionWorItemDialogComponent } from './components/induction-work-items/induction-workitem-dialog.component';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { ShiftBranchFilterPipe } from './pipes/shitBranchFilter.pipes';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { AvatarModule } from 'ngx-avatar';
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { MobileNumberDirective } from './directives/mobile-number.directive';
import { CreateEmployeeComponent } from './components/create-employee-component';
import { HrAreaComponent } from './components/hr-area-component';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { HrAreaSettingsComponent } from './components/area-settings.component';
import { documentsComponent } from './components/documents.component';
import { leavesComponent } from './components/leaves.component';
import { payrollComponent } from './components/payroll.component';
import { FormioModule } from 'angular-formio';
import { FormCreatorComponent } from './components/employee-list-form.component/form-creator.component';
import { hrModulesInfo } from './models/hrModulesInfo';
import { employeeModulesInfo } from './models/employee-module-info.model';
import { EmployeeModulesService } from './services/employee_module.service';

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
        ExcelModule,
        NgxChartsModule,
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
        NgxMaterialTimepickerModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
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
        StoreModule.forFeature("employeeList", reducers.reducers),
        EffectsModule.forFeature(HRManagementEffects.EmployeeListEffects),
        AvatarModule,
        MatSnackBarModule,
        SnovasysAvatarModule,
        MatSlideToggleModule,
        DynamicModule,
        FormioModule,
        HttpClientModule 
    ],
    declarations: [HrAreaComponent, FormCreatorComponent, EmployeeListComponent, EmployeeListPageComponent, SoftLabelPipe, EmployeeInductionComponent, MobileNumberDirective,
        InductionConfigurationComponent, ShiftBranchFilterPipe, FetchSizedAndCachedImagePipe, CreateEmployeeComponent,
        InductionWorItemDialogComponent, EmployeeUploadPopupComponent, CustomAppBaseComponent, RemoveSpecialCharactersPipe,HrAreaSettingsComponent,documentsComponent,leavesComponent,payrollComponent],
    exports: [EmployeeListPageComponent, InductionWorItemDialogComponent, HrAreaComponent,HrAreaSettingsComponent, leavesComponent, payrollComponent],
    entryComponents: [EmployeeUploadPopupComponent, InductionWorItemDialogComponent],
    providers: [{ provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: [] },
        SoftLabelPipe, ShiftBranchFilterPipe, RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe, CookieService, GoogleAnalyticsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EmployeeListModule {
    static forChild(config: employeeModulesInfo): ModuleWithProviders<EmployeeListModule> {
        return {
          ngModule: EmployeeListModule,
          providers: [
            {provide: EmployeeModulesService, useValue: config }
          ]
        };
      }
}