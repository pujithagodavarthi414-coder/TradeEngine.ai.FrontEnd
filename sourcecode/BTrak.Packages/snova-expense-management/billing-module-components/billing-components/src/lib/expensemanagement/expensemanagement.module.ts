import { NgModule, Injector, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ExpenseViewComponent } from '../expensemanagement/components/expenses-view.component';
import { TranslateModule } from '@ngx-translate/core';

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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddExpenseViewComponent } from './components/add-new-expense.component';
import { AddMultipleExpenseViewComponent } from './components/add-multiple-expenses.component';
import { ExpenseDetailsComponent } from './components/expense-details.component';
import { AddExpenseDialogComponent } from './components/add-expense-dialog.component';
import { MyExpensesComponent } from './components/my-expenses.component';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { AppBaseComponent } from './components/componentbase';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { DropZoneModule } from '@thetradeengineorg1/snova-file-uploader';
import { CronEditorModule } from 'cron-editor';
import { SnovasysCommentsModule } from '@thetradeengineorg1/snova-comments';
import {NgxDropzoneModule} from 'ngx-dropzone';
import { AmountDirective } from './pipes/amount.directive';
import { SnovasysAvatarModule } from  '@thetradeengineorg1/snova-avatar';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { MyIntl } from '@thetradeengineorg1/snova-app-pipes';
import { ExpenseAreaComponent } from './components/expenses-area.component';
import { DynamicModule } from '@thetradeengineorg1/snova-ndc-dynamic';
import { ExpenseReportsAndSettingsComponent } from './components/area-reports-settings-component';
import {CustomFieldsComponentModule} from "@thetradeengineorg1/snova-custom-fields";
import { ExpenseModulesService } from "./services/expense.module.service";
import { ExpenseModuleInfo } from "./models/ExpenseModuleInfo";
//import {WidgetService} from '../services/WidgetService'

export const appRoutes: Routes = [{ path: "" }];


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
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    DropZoneModule,
    NgxDropzoneModule,
    MatSnackBarModule,
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
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    RouterModule,
    MatTooltipModule,
    ReactiveFormsModule,
    StoreModule,
    EffectsModule,
    FontAwesomeModule,
    SatPopoverModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    TranslateModule,
    GridModule,
    SnovasysAvatarModule,
    NgSelectModule,
    CronEditorModule,
    ExcelModule,
    PDFModule,
    NgxGalleryModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    CustomFieldsComponentModule,
    DynamicModule,
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),
    SnovasysCommentsModule
    // RouterModule.forChild(ExpenseManagementRoutes)
  ],
  entryComponents: [ExpenseReportsAndSettingsComponent,ExpenseViewComponent, AddExpenseViewComponent, ExpenseDetailsComponent, MyExpensesComponent, AddMultipleExpenseViewComponent, AddExpenseDialogComponent,ExpenseAreaComponent],
  declarations: [ExpenseReportsAndSettingsComponent,ExpenseViewComponent, AddExpenseViewComponent, ExpenseDetailsComponent, MyExpensesComponent, AddMultipleExpenseViewComponent, AddExpenseDialogComponent,ExpenseAreaComponent, SoftLabelPipe, FetchSizedAndCachedImagePipe, AppBaseComponent, RemoveSpecialCharactersPipe, UtcToLocalTimePipe,AmountDirective],
  exports: [
    ExpenseReportsAndSettingsComponent,ExpenseViewComponent, AddExpenseViewComponent, ExpenseDetailsComponent, 
    MyExpensesComponent, AddMultipleExpenseViewComponent, AddExpenseDialogComponent,ExpenseAreaComponent, 
    AppBaseComponent
  ],
  providers: [SoftLabelPipe, RemoveSpecialCharactersPipe, UtcToLocalTimePipe, DatePipe, CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpenseManagementModule {
static forChild(config: ExpenseModuleInfo): ModuleWithProviders<ExpenseManagementModule> {
    return {
      ngModule: ExpenseManagementModule,
      providers: [
        { provide: ExpenseModulesService, useValue: config }
      ]
    };
  }

  constructor(private injector: Injector) {
  //   // customElements.define('app-add-expense-dialog', createCustomElement(AddExpenseDialogComponent, { injector }));
  //   // customElements.define('app-add-multiple-expenses', createCustomElement(AddMultipleExpenseViewComponent, { injector }));
  //   // customElements.define('app-add-new-expense', createCustomElement(AddExpenseViewComponent, { injector }));
  //   // customElements.define('app-expense-details', createCustomElement(ExpenseDetailsComponent, { injector }));
  //   // customElements.define('app-billing-component-expenses', createCustomElement(ExpenseViewComponent, { injector }));
  //   // customElements.define('app-billing-component-my-expenses', createCustomElement(MyExpensesComponent, { injector }));
   }
} 
