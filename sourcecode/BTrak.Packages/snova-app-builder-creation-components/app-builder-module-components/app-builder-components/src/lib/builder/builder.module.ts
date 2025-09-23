import { CommonModule, DatePipe } from "@angular/common";
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { DecimalPipe } from '@angular/common';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DragulaModule } from "ng2-dragula";
import { AvatarModule } from "ngx-avatar";
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxGalleryModule } from "ngx-gallery-9";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { TimeagoModule } from "ngx-timeago";
import '@progress/kendo-ui';
import { CreateAppDialogComponet } from './components/widgetmanagement/create-app-dialog.component';
import { CustomSubqueryTableComponent } from './components/widgetmanagement/custom-subquery-table.component';
import { CustomAppDrillDownComponent } from './components/widgetmanagement/custom-app-drilldown.component';
import { AddCustomWidgetComponent } from './components/widgetmanagement/addcustomwidget.component';
import { AddCustomHtmlAppComponent } from './components/widgetmanagement/add-custom-html-app.component';
import { NewProcessWidgetComponent } from './components/widgetmanagement/new-process-app.component';
import { CustomHtmlAppDetailsComponent } from './components/widgetmanagement/custom-html-app-details.component';
import { ProcessAppComponent } from './components/widgetmanagement/process-app-details.component';
import { CustomWidgetTableComponent } from './components/widgetmanagement/custom-widget-table-component';
import { CustomAppTagsComponent } from './components/widgetmanagement/tags.component';
import { sentencePipe } from './pipes/sentence-case.pipe';
import { CustomWidgetQueryBuilderComponent } from './components/widgetmanagement/customwidget-querybuilder.component';
import { CronEditorModule } from "cron-editor";
import { TagsFilterPipe } from './pipes/tagsFilter.pipe';
import { QueryBuilderModule } from 'angular2-query-builder';
import { htmlAppDropZone } from './components/widgetmanagement/html-app-drop-zone.component';
import { CalendarChartComponent } from './components/widgetmanagement/calendar-chart.component';
import { FileSizePipe } from './pipes/filesize-pipe';
import { ChartsModule } from "@progress/kendo-angular-charts";
import { GaugesModule } from "@progress/kendo-angular-gauges";
import { ExcelModule, GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { CustomAppFilterComponent } from './components/widgetmanagement/app-custom-filter.component';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { GenericformComponent } from './components/genericform/genericform.component';
import { EditFormDataComponent } from './components/genericform/edit-form-data/edit-form-data.component';
import { GenericFormsViewComponent } from './components/genericform/genericforms-view/genericforms-view.component';
import { GenericFormApplicationComponent } from './components/genericform/generic-form-application.component';
import { GenericFormImportDialogComponent } from './components/genericform/genericform-imports-dialog';
import { GenericApplicationComponent } from './components/genericform/generic-application/generic-application.component';
import { ViewformComponent } from './components/genericform/create-form/viewform.component';
import { FormCreatorComponent } from './components/genericform/create-form/form-creator.component';
import { MessageBoxComponent } from './components/genericform/create-form/message-box.component';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { NgMessageTemplateDirective } from './components/genericform/create-form/message-box.directive';
import { FormioModule } from 'angular-formio';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { OrderModule } from 'ngx-order-pipe';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { DynamicModule } from '@thetradeengineorg1/snova-ndc-dynamic';
import { CustomWidgetManagementComponent } from './components/widgetmanagement/customwidget.component';
import { SelectAllComponent } from './components/widgetmanagement/select-all.component';
import { CustomHtmlAppPreviewComponent } from './components/widgetmanagement/custom-html-app-preview.component';
import { CustomWidgetPreviewDialogComponent } from './components/widgetmanagement/customWidget-preview-dialog';
import { builderModulesInfo } from './models/builderModulesInfo';
import { BuilderModulesService } from './services/builder.modules.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CustomApplicationComponent } from './components/genericform/custom-application/custom-application.component';
import { ResidentDetailsHistoryComponent } from './components/genericform/resident-apps/resident-details-history.component';
import { ResidentAppComponent } from './components/genericform/resident-apps/resident-app.component';
import { ResidentDetailsComponent } from './components/genericform/resident-apps/resident-details.component';
import { ObservationsTypeComponent } from './components/genericform/resident-apps/observations-app.component';
import { ResidentObservationsComponent } from './components/genericform/resident-apps/resident-observations-app.component';
import { CustomFormsComponent, ViewCustomFormComponent, CustomFieldsComponent, CustomFieldsComponentModule } from '@thetradeengineorg1/snova-custom-fields';
import { FormTypeDialogComponent } from './components/genericform/create-form/form-type-dialog.component';
import { ApplicationComponent } from './components/genericform/public-url/application.component';
import { ApplicationDialogComponent } from './components/genericform/public-url/application-dialog.component';
import { GenericStatusComponent } from './components/generic-status/generic-status.component';
import { WorkFlowSelectionComponent } from './components/workflow-selection/workflow-selection.component';
import { WorkFlowTriggerDialogComponent } from './components/workflow-trigger/workflow-trigger-dialog.component';
import { WorkFlowGenericCreationComponent } from './components/genericform/custom-application/workflow-generic-creation.component';
import { HeatMapAllModule } from '@syncfusion/ej2-angular-heatmap';
import { ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { ColorPickerModule } from "ngx-color-picker";
import { UtcToLocalTimePipe } from "../globaldependencies/pipes/utctolocaltime.pipe";
import { VideoCallJoinComponent } from "./components/genericform/public-url/video-call-join.component";
import { SnovasysCommentsModule } from "@thetradeengineorg1/snova-comments";
import { CreateformsComponent } from "./components/genericform/create-form/createforms.component";
import { HtmlDesignerComponent } from "./components/html-designer/html-designer.component";
import { AddLevelDialogComponet } from "./components/widgetmanagement/add-level.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { CustomApplicationTableComponent } from "./components/genericform/custom-application-table.component";
import { DocumentEditorAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { ToolbarModule, TabModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ComboBoxModule, DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SliderModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { WebPageViewComponent } from "./components/html-viewer/web-page-viewer.component";
import { BoxChartComponent } from "./components/genericform/box-chart/box-chart.component";
import { PreviewComponent } from "./components/genericform/preview/preview.component";
import { EmissionComponent } from "./components/emission/emission.component";
import { WorkFlowBpmnComponent } from "./components/genericform/custom-application/workflow-bpmn.component";
import { SubmitFormTriggerComponent } from "./components/widgetmanagement/submit-form-trigger.component";
import { SearchFilterPipe } from "./pipes/search-filter.pipe";
import { ShareCustomAppComponent } from "./components/widgetmanagement/share-custom-app.component";
import { WebPageViewUnAuthComponent } from "./components/html-viewer-unauth/web-page-viewer-unauth.component";
import { EmailConfigurationComponent } from "./components/widgetmanagement/email-configuration.component";
import { UserSearchFilterPipe } from "./pipes/user-search-filter.pipe";
import { CustomAppRecordsExcelUploaderComponent } from "./components/custom-app-records-excel-uploader/custom-app-records-excel-uploader";
import { GenericFormRecordHistoryComponent } from "./components/genericform/custom-application/generic-form-record-history.component";
import { UserFilterPipe } from "./pipes/user-filter.pipe";
import { TimeZonePipe } from "./pipes/timezone.pipe";

@NgModule({
  imports: [
    StoreModule,
    EffectsModule,
    TranslateModule,
    EditorModule,
    ToastrModule,
    HttpClientModule,
    GaugesModule,
    CommonModule,
    ExcelModule,
    GridModule,
    PDFModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    StoreModule,
    EffectsModule,
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
    MatProgressSpinnerModule,
    MatTableModule,
    CustomFieldsComponentModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SatPopoverModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    AvatarModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxMaterialTimepickerModule,
    DragulaModule,
    NgxGalleryModule,
    ChartsModule,
    PDFExportModule,
    DragulaModule.forRoot(),
    TimeagoModule.forRoot(),
    CronEditorModule,
    MatAutocompleteModule,
    QueryBuilderModule,
    MatSnackBarModule,
    RouterModule,
    FormioModule,
    DropDownListModule,
    OrderModule,
    DynamicModule.withComponents([]),
    HeatMapAllModule, ChartAllModule,
    SnovasysCommentsModule,
    DocumentEditorAllModule,
    DocumentEditorContainerModule,
    ToolbarModule,
    TabModule,
    DropDownListModule,
    ComboBoxModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    SliderModule,
    NumericTextBoxModule,
    ColorPickerModule,
    TreeViewModule,
    DialogModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    sentencePipe,
    TagsFilterPipe,
    ApplicationComponent,
    ApplicationDialogComponent,
    FileSizePipe,
    UtcToLocalTimePipe,
    RemoveSpecialCharactersPipe,
    CustomAppTagsComponent,
    CustomWidgetQueryBuilderComponent,
    AddCustomWidgetComponent,
    AddCustomHtmlAppComponent,
    NewProcessWidgetComponent,
    CreateAppDialogComponet,
    ProcessAppComponent,
    FormTypeDialogComponent,
    CustomHtmlAppDetailsComponent,
    CustomSubqueryTableComponent,
    CustomAppDrillDownComponent,
    CustomWidgetTableComponent,
    htmlAppDropZone,
    CalendarChartComponent,
    CustomAppFilterComponent,
    WorkFlowBpmnComponent,
    AvatarComponent,
    CustomAppBaseComponent,
    MessageBoxComponent,
    GenericformComponent,
    EditFormDataComponent,
    GenericFormsViewComponent,
    GenericFormApplicationComponent,
    GenericFormImportDialogComponent,
    GenericApplicationComponent,
    ViewformComponent,
    FormCreatorComponent,
    NgMessageTemplateDirective,
    SoftLabelPipe,
    CustomWidgetManagementComponent,
    SelectAllComponent,
    CustomHtmlAppPreviewComponent,
    CustomWidgetPreviewDialogComponent,
    CustomApplicationComponent,
    ResidentDetailsComponent,
    ResidentAppComponent,
    ResidentDetailsHistoryComponent,
    ObservationsTypeComponent,
    ResidentObservationsComponent,
    WorkFlowSelectionComponent,
    GenericStatusComponent,
    WorkFlowTriggerDialogComponent,
    WorkFlowGenericCreationComponent,
    VideoCallJoinComponent,
    CreateformsComponent,
    HtmlDesignerComponent,
    AddLevelDialogComponet,
    CustomApplicationTableComponent,
    WebPageViewComponent,
    WebPageViewUnAuthComponent,
    CreateformsComponent,
    PreviewComponent,
    BoxChartComponent,
    EmissionComponent,
    SubmitFormTriggerComponent,
    SearchFilterPipe,
    ShareCustomAppComponent,
    EmailConfigurationComponent,
    UserSearchFilterPipe,
    CustomAppRecordsExcelUploaderComponent,
    GenericFormRecordHistoryComponent,
    UserFilterPipe,
    TimeZonePipe
  ],
  exports:[  
    AddCustomWidgetComponent,
    CustomAppDrillDownComponent,
    AddCustomHtmlAppComponent,
    NewProcessWidgetComponent,
    ProcessAppComponent,
    CustomHtmlAppDetailsComponent,
    CustomWidgetTableComponent,
    CustomWidgetManagementComponent,
    CustomApplicationComponent,
    GenericFormsViewComponent,
    FormTypeDialogComponent,
    FormCreatorComponent,
    ResidentDetailsComponent,
    ResidentAppComponent,
    ResidentDetailsHistoryComponent,
    ObservationsTypeComponent,
    ResidentObservationsComponent,
    ApplicationComponent,
    ApplicationDialogComponent,
    GenericStatusComponent,
    WorkFlowSelectionComponent,
    GenericStatusComponent,
    WorkFlowTriggerDialogComponent,
    WorkFlowGenericCreationComponent,
    VideoCallJoinComponent,
    CreateformsComponent,
    AddLevelDialogComponet,
    CustomApplicationTableComponent,
    WebPageViewComponent,
    WebPageViewUnAuthComponent,
    EmissionComponent,
    SubmitFormTriggerComponent,
    ShareCustomAppComponent,
    EmailConfigurationComponent,
    UserSearchFilterPipe,
    CustomAppRecordsExcelUploaderComponent,
    GenericFormRecordHistoryComponent,
    UserFilterPipe,
    TimeZonePipe
  ],
  
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    SoftLabelPipe, NgMessageTemplateDirective,
    sentencePipe,
    TagsFilterPipe,
    UtcToLocalTimePipe,
    FileSizePipe,
    RemoveSpecialCharactersPipe,
    DatePipe,
    DecimalPipe,
    SearchFilterPipe,
    UserSearchFilterPipe,
    UserFilterPipe,
    TimeZonePipe
    ],
  entryComponents: [
    CustomAppTagsComponent,
    AddCustomWidgetComponent,
    AddCustomHtmlAppComponent,
    NewProcessWidgetComponent,
    CreateAppDialogComponet,
    ProcessAppComponent,
    FormTypeDialogComponent,
    CustomHtmlAppDetailsComponent,
    CustomSubqueryTableComponent,
    CustomAppDrillDownComponent,
    CustomWidgetTableComponent,
    CustomWidgetQueryBuilderComponent,
    ApplicationDialogComponent,
    htmlAppDropZone,
    CalendarChartComponent,
    CustomAppFilterComponent,
    MessageBoxComponent,
    WorkFlowBpmnComponent,
    AvatarComponent,
    CustomAppBaseComponent,
    GenericformComponent,
    EditFormDataComponent,
    GenericFormsViewComponent,
    GenericFormApplicationComponent,
    GenericFormImportDialogComponent,
    GenericApplicationComponent,
    ViewformComponent,
    FormCreatorComponent,
    CustomWidgetManagementComponent,
    SelectAllComponent,
    CustomHtmlAppPreviewComponent,
    CustomWidgetPreviewDialogComponent,
    CustomApplicationComponent,
    ResidentDetailsComponent,
    ResidentAppComponent,
    ResidentDetailsHistoryComponent,
    ObservationsTypeComponent,
    ResidentObservationsComponent,
    CustomFormsComponent,
    ViewCustomFormComponent,
    CustomFieldsComponent,
    WorkFlowSelectionComponent,
    GenericStatusComponent,
    WorkFlowTriggerDialogComponent,
    WorkFlowGenericCreationComponent,
    HtmlDesignerComponent,
    AddLevelDialogComponet,
    WebPageViewComponent,
    WebPageViewUnAuthComponent,
    SubmitFormTriggerComponent,
    ShareCustomAppComponent,
    GenericFormRecordHistoryComponent
    ]
})
export class AppBuilderModule {
  static forChild(config: builderModulesInfo): ModuleWithProviders<AppBuilderModule> {
    return {
      ngModule: AppBuilderModule,
      providers: [
        {provide: BuilderModulesService, useValue: config }
      ]
    };
  }
}
