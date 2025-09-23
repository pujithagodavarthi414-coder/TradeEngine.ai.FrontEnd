import { Injector, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { ChartsModule } from 'ng2-charts';
import { CronEditorModule } from "cron-editor";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { TranslateModule } from "@ngx-translate/core";
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

// import { GlobalModule } from "app/global/global.module";
// import { CommonNameModule } from '../../common/common-name.module';

// import { MomentUtcDateAdapter } from '../../shared/directives/moment-utc-date-adapter';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { AvatarModule } from 'ngx-avatar';
import { LayoutModule } from '@angular/cdk/layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { CookieService } from 'ngx-cookie-service';
import '../globaldependencies/helpers/fontawesome-icons';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ConvertUtcToLocalTimePipe } from './pipes/utctolocaltimeconversion.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from './pipes/removeSpecialCharacters.pipe';
import { AddWorkflowComponent } from './components/add-workflow/add-workflow.component';
import { mailCreatorComponent } from './components/mail-creator.component';
import { fieldUpdateCreatorComponent } from './components/field-update.component';
import { addWebhooksComponent } from './components/add-webhooks.component';
import { addCustomFunctionsComponent } from './components/add-customfunctions.component';
import { addChecklistComponent } from './components/add-checklist.component';
import { userTaskComponent } from './components/user-task.component';
import { ServiceTaskComponent } from './components/service-task.component';
import { ScriptTaskComponent } from './components/script-task.component';
import { SendTaskComponent } from './components/workflow-list/send-task.component';
import { ReceiveTaskComponent } from './components/workflow-list/receive-task.component';
import { XorGateWayComponent } from './components/xor-gateway.component';
import { AndGateWayComponent } from './components/and-gateway.component';
import { MessageEventComponent } from './components/message-event.component';
import { TimerEventComponent } from './components/timer-event.component';
import { EventGateWayComponent } from './components/event-gateway.component';
import { ErrorEventComponent } from './components/error-event.component';
import { EscalationEventComponent } from './components/escalation-event.component';
import { SignalEventComponent } from './components/signal-event.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { ActivityService } from './services/activity.service';
import { WorkflowService } from './services/workflow.service';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { WorkflowListComponent } from './components/workflow-list/workflow-list.component';
import { createCustomElement } from '@angular/elements';
import { ErrorListComponent } from './components/list-error/list-error.component';
import { FormFilterPipe } from './pipes/form-filter.pipe';
import { CustomApplicationFilterPipe } from './pipes/custom-application-filter.pipe';
import { AddRecordComponent } from './components/add-record.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MailExtensionComponent } from './components/mail-extensions.component';
import { AddNotificationComponent } from './components/add-notification.component';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'YYYY-MM-DD HH:mm:ss',
  parseInput: 'YYYY-MM-DD HH:mm:ss',
  datePickerInput: 'YYYY-MM-DD HH:mm:ss',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };
@NgModule({
  imports: [
    CommonModule,
    TreeViewModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    CronEditorModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
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
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    SatPopoverModule,
    DigitOnlyModule,
    MatTooltipModule,
    FontAwesomeModule,
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
    EditorModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [AvatarComponent, AddWorkflowComponent,mailCreatorComponent,fieldUpdateCreatorComponent,addWebhooksComponent, addCustomFunctionsComponent,
    ConvertUtcToLocalTimePipe,FetchSizedAndCachedImagePipe,CustomAppBaseComponent,addChecklistComponent, userTaskComponent, ServiceTaskComponent,ScriptTaskComponent,SendTaskComponent,
    RemoveSpecialCharactersPipe, ReceiveTaskComponent, XorGateWayComponent, AndGateWayComponent,EventGateWayComponent,MessageEventComponent,TimerEventComponent,ErrorEventComponent,
    EscalationEventComponent,SignalEventComponent, ActivityListComponent,WorkflowListComponent,ErrorListComponent, FormFilterPipe,CustomApplicationFilterPipe,
    AddRecordComponent,SearchFilterPipe,MailExtensionComponent,AddNotificationComponent],
  exports: [AddWorkflowComponent],
  entryComponents: [WorkflowListComponent],
  providers: [
    CurrencyPipe,
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    CookieService, DatePipe,
    ActivityService,
    WorkflowService,
    SearchFilterPipe
  ]
})

export class WorkflowWidgetModule {
  constructor(injector: Injector) {
    
}
}
