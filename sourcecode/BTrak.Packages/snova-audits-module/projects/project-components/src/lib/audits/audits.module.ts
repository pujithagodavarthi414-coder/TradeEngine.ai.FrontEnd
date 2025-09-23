import { NgModule, ModuleWithProviders, SystemJsNgModuleLoader, NgModuleFactoryLoader } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { QuillModule } from 'ngx-quill';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';

import * as reducers from "./store/reducers/index";
import * as AuditManagementEffects from "./store/effects/index";

import { AuditDashboardViewComponent } from './containers/audit-dashboard-view.component';
import { AuditUniqueDetailComponent } from './components/audit-unique-detail.component';
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { ConductUniqueDetailComponent } from './components/conduct-unique-detail.component';
import { AuditDetailsComponent } from './components/audits-details-app.component';
import { AuditNonComplainceComponent } from './components/audit-non-complaince-app.component';
import { AuditComplainceComponent } from './components/audit-complaince-app.component';
import { AuditConductTimelineView } from './components/audit-conduct-timeline-view-component';
import { SoftLabelPipe } from './dependencies/pipes/softlabels.pipes';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SoftLabelConfigurationModel } from './dependencies/models/softLabels-model';
import { GetsoftLabelsTriggered } from './dependencies/common-store/actions/soft-labels.actions';
import { AuditService } from './services/audits.service';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';
import { TimeagoModule } from 'ngx-timeago';
import { CronEditorModule } from 'cron-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AvatarModule } from 'ngx-avatar';
import { UpsertMasterQuestionTypeComponent } from './components/upsert-master-question-type.component';
import { AuditsViewComponent } from './components/app-audits-view.component';
import { AuditConductsViewComponent } from './components/app-conducts-view.component';
import { AuditReportsViewComponent } from './components/app-audit-reports-view.component';
import { AuditsListViewComponent } from './components/audits-list-view.component';
import { AuditQuestionsListViewComponent } from './components/audit-questions-list-view.component';
import { AuditQuestionEditViewComponent } from './components/audit-question-edit-view.component';
import { AuditCategoryListViewComponent } from './components/audit-category-list-view.component';
import { AuditAddOrEditComponent } from './components/audit-add-or-edit.component';
import { AuditListLoadingComponent } from './components/audit-list-loading.component';
import { AuditItemSummaryComponent } from './components/audit-item-summary.component';
import { AuditNamePipe } from './pipes/audits.pipe';
import { AuditArchivePipe } from './pipes/audit-archive.pipe';
import { AuditCategoriesViewComponent } from './components/audit-categories-view.component';
import { AuditCategoryAddOrEditComponent } from './components/audit-category-add-or-edit.component';
import { AuditCategoryOperationsComponent } from './components/audit-category-operations.component';
import { ConductsListViewComponent } from './components/conducts-list-view.component';
import { ConductItemSummaryComponent } from './components/conduct-item-summary.component';
import { ConductAddOrEditComponent } from './components/conduct-add-or-edit.component';
import { QuestionCaseComponent } from './components/question-case.component';
import { AuditQuestionDetailsComponent } from './components/audit-question-details.component';
import { QuestionPreviewComponent } from './components/question-preview.component';
import { HierarchicalQuestionsComponent } from './components/hierarchical-questions.component';
import { QuestionsCopyMoveComponent } from './components/questions-copy-move.component';
import { AuditCategoryListShiftComponent } from './components/audit-category-list-shift.component';
import { AuditQuestionsShiftViewComponent } from './components/audit-questions-shift-view.component';
import { AuditQuestionsSubCategoriesShiftViewComponent } from './components/audit-questions-subcategories-shift-view.component';
import { AuditQuestionsSubcategoriesShiftComponent } from './components/audit-questions-subcategories-shift.component';
import { AuditSelectQuestionViewComponent } from './components/audit-select-question-view.component';
import { AuditSelectQuestionComponent } from './components/audit-select-question.component';
import { ConductQuestionsListComponent } from './components/conduct-questions-list.component';
import { ConductQuestionsViewComponent } from './components/conduct-questions-view.component';
import { ConductQuestionsSubcategoryViewComponent } from './components/conduct-questions-subcategory-view.component';
import { ConductQuestionsSubcategoriesComponent } from './components/conduct-questions-subcategories.component';
import { ConductSelectQuestionViewComponent } from './components/conduct-select-question-view.component';
import { ConductSelectQuestionComponent } from './components/conduct-select-question.component';
import { ConductCompletedPipe } from './pipes/conduct-completed.pipe';
import { AddAuditReportComponent } from './components/add-audit-report.component';
import { AuditReportsListComponent } from './components/audit-reports-list.component';
import { AuditReportItemSummaryComponent } from './components/audit-report-item-summary.component';
import { DetailedAuditReportViewComponent } from './components/detailed-audit-report-view.component';
import { ReportQuestionComponent } from './components/report-question.component';
import { AuditReportHierarchyQuestionsComponent } from './components/audit-report-hierarchy-questions.component';
import { ReportQuestionDetailsComponent } from './components/report-question-details.component';
import { ReportQuestionConductComponent } from './components/report-question-conduct.component';
import { AddAuditActionsViewComponent } from './components/app-audit-actions-view.component';
import { AddAuditActivityViewComponent } from './components/app-audit-activity-view.component';
import { AudiOverallActivityComponent } from './components/audit-overall-activity.component';
import { ConductCategoryListViewComponent } from './components/conduct-category-list-view.component';
import { ConductQuestionsListViewComponent } from './components/conduct-questions-list-view.component';
import { ConductQuestionOperationComponent } from './components/conduct-question-operation.component';
import { QuestionsFilterComponent } from './components/questions-filter.component';
import { UtcToLocalTimePipe } from './dependencies/pipes/utctolocaltime.pipe';
import { RemoveSpecialCharactersPipe } from './dependencies/pipes/removeSpecialCharacters.pipe';
import { AvatarComponent } from '../globaldependencies/components/avatar.component';
import { QuestionHistoryComponent } from './components/question-history.component';
import { FetchSizedAndCachedImagePipe } from './dependencies/pipes/fetchSizedAndCachedImage.pipe';
import { ConductCategoriesViewComponent } from './components/conduct-categories-view.component';
import { QuestionConductCaseComponent } from './components/question-conduct-case.component';
import { HierarchicalConductQuestionsComponent } from './components/hierarchical-conduct-questions.component';
import { ConductCategoryOperationsComponent } from './components/conduct-category-operations.component';
import { QuestionConductComponent } from './components/question-conduct.component';
import { ConductQuestionActionComponent } from './components/conduct-question-action.component';
import { QuestionActionsComponent } from './components/question-actions.component';
import { AuditConductBryntumSchedulerComponent } from './components/audit-conduct-bryntum-scheduler.component';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { NonComplaintAuditPreviewComponent } from './components/non-complaint-audit-details-preview.component';
import { UpsertQuestionTypeDialogComponent } from './components/upsert-question-type-dialog.component';
import { SubmittedAuditPreviewComponent } from './components/submitted-audit-details-preview.component';
import { UpsertQuestionTypeComponent } from './components/upsert-question-type.component';
import { QuestionTypeComponent } from './components/question-type.component';
import { MasterQuestionTypeComponent } from './components/master-question-type.component';
import { AuditModulesService } from './services/audit.modules.service';
import { auditModulesInfo } from './models/auditModulesInfo';
import { AuditSelectQuestionsForSchedule } from './components/audit-select-questions-schedule.component';
import { DropZoneModule } from "@snovasys/snova-file-uploader";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AppStoreDialogComponent } from './containers/app-store-dialog.component';
import { AuditTagsPipe } from './pipes/audit-tags.pipe';
import { QuestionEstimatedTimeComponent } from './components/question-estimated-time.component';
import { AuditTimeFilterPipe } from './pipes/time-filter.pipe';
import { AuditPriorityViewComponent } from './components/audit-pripority-view.component';
import { AuditImpactViewComponent } from './components/audit-impact-view.component';
export { AuditRoutes } from './audits.routing';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormioModule } from 'angular-formio';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import '@progress/kendo-ui';
import { ChartsModule } from "@progress/kendo-angular-charts";
import { GaugesModule } from "@progress/kendo-angular-gauges";
import { ExcelModule, PDFModule } from "@progress/kendo-angular-grid";
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { WorkFlowBpmnComponent } from '../components/workflow-bpmn.component';
import { CustomFieldsComponentModule } from '@snovasys/snova-custom-fields';
import { QuestionConductHistoryComponent } from './components/question-conduct-history.component';
import { AuditCustomFieldComponent } from './components/audit-custom-field.component';
import { WorkFlowSelectionComponent } from './components/workflow-selection/workflow-selection.component';
import { WorkFlowTriggerDialogComponent } from './components/workflow-trigger/workflow-trigger-dialog.component';
import { AppFeatureBaseComponent } from '../globaldependencies/components/featurecomponentbase';
import { RouterModule } from '@angular/router';
import { AuditVersionUniqueDialogComponent } from './components/audit-version-unique-dialog.component';
import { AuditVersionUniqueDetailComponent } from './components/audit-version-unique-detail.component';
import { AuditVersionCategoryListViewComponent } from './components/audit-version-category-list-view.component';
import { AuditVersionCategoriesViewComponent } from './components/audit-version-categories-view.component';
import { AuditVersionCategoryOperationsComponent } from './components/audit-version-category-operations.component';
import { AuditVersionQuestionsListViewComponent } from './components/audit-version-questions-list-view.component';
import { QuestionVersionCaseComponent } from './components/question-version-case.component';
import { HierarchicalVersionQuestionsComponent } from './components/hierarchical-version-questions.component';
import { AuditVersionQuestionDetailsComponent } from './components/audit-version-question-details.component';
import { QuestionVersionPreviewComponent } from './components/question-version-preview.component';
import { ActionCategoryComponent } from './components/action-category.component';
import { AuditRiskComponent } from './components/audit-risk.component';
import { AuditsCustomFieldsComponent } from './components/audits-customfields.component';
import { AuditRatingComponent } from './components/audit-rating.component';
// import { ProjectPackageModule } from 'projects/launcher.dev/src/app/packageModules/project-management-package.module';


export const MY_FORMATS = {
    parse: {
        dateInput: "DD-MMM-YYYY"
    },
    display: {
        dateInput: "DD-MMM-YYYY",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "DD-MMM-YYYY",
        monthYearA11yLabel: "MMMM YYYY"
    }
};

const components = [AuditDashboardViewComponent,
    AuditUniqueDetailComponent,
    AuditDetailsComponent,
    AuditNonComplainceComponent,
    AuditComplainceComponent,
    ConductUniqueDetailComponent,
    AuditConductTimelineView,
    AuditPriorityViewComponent,AuditImpactViewComponent,
    AuditsViewComponent, AuditConductsViewComponent, AuditReportsViewComponent, AuditsListViewComponent,
    AuditQuestionsListViewComponent, AuditQuestionEditViewComponent, AuditCategoryListViewComponent, AuditAddOrEditComponent,
    AuditListLoadingComponent, AuditItemSummaryComponent, AuditNamePipe, AuditTagsPipe, AuditArchivePipe, AuditCategoriesViewComponent,
    AuditCategoryAddOrEditComponent, AuditCategoryOperationsComponent, ConductsListViewComponent, ConductItemSummaryComponent,
    ConductAddOrEditComponent, AuditSelectQuestionsForSchedule,
    QuestionCaseComponent, AuditQuestionDetailsComponent, QuestionPreviewComponent,AuditCustomFieldComponent,
    HierarchicalQuestionsComponent, QuestionsCopyMoveComponent, AuditCategoryListShiftComponent, AuditQuestionsShiftViewComponent,
    AuditQuestionsSubCategoriesShiftViewComponent, AuditQuestionsSubcategoriesShiftComponent, AuditSelectQuestionViewComponent,
    AuditSelectQuestionComponent, ConductQuestionsListComponent, ConductQuestionsViewComponent, ConductQuestionsSubcategoryViewComponent,
    ConductQuestionsSubcategoriesComponent, ConductSelectQuestionViewComponent, ConductSelectQuestionComponent, ConductCompletedPipe,
    AddAuditReportComponent, AuditReportsListComponent, AuditReportItemSummaryComponent,
    DetailedAuditReportViewComponent, ReportQuestionComponent, AuditReportHierarchyQuestionsComponent, ReportQuestionDetailsComponent,
    ReportQuestionConductComponent, UpsertMasterQuestionTypeComponent, AddAuditActionsViewComponent, AddAuditActivityViewComponent,
    AudiOverallActivityComponent,
    SoftLabelPipe,
    ConductCategoryListViewComponent,
    ConductQuestionsListViewComponent, ConductQuestionOperationComponent, QuestionsFilterComponent,
    UtcToLocalTimePipe, RemoveSpecialCharactersPipe, AvatarComponent, QuestionHistoryComponent, QuestionConductHistoryComponent,
    FetchSizedAndCachedImagePipe, ConductCategoriesViewComponent, QuestionConductCaseComponent, HierarchicalConductQuestionsComponent, ConductCategoryOperationsComponent,
    QuestionConductComponent,
    ConductQuestionActionComponent,
    QuestionActionsComponent,
    AuditConductBryntumSchedulerComponent,
    CustomAppBaseComponent,
    AppFeatureBaseComponent,
    NonComplaintAuditPreviewComponent,
    UpsertQuestionTypeDialogComponent,
    SubmittedAuditPreviewComponent,
    UpsertQuestionTypeComponent,
    QuestionTypeComponent,
    QuestionEstimatedTimeComponent,
    AuditTimeFilterPipe,
    MasterQuestionTypeComponent,AppStoreDialogComponent,
    WorkFlowBpmnComponent,
    WorkFlowSelectionComponent,
    WorkFlowTriggerDialogComponent,
    AuditVersionUniqueDialogComponent,
    AuditVersionUniqueDetailComponent, AuditVersionCategoryListViewComponent, AuditVersionCategoriesViewComponent, AuditVersionCategoryOperationsComponent,
    AuditVersionQuestionsListViewComponent, QuestionVersionCaseComponent, HierarchicalVersionQuestionsComponent, AuditVersionQuestionDetailsComponent, QuestionVersionPreviewComponent,
    ActionCategoryComponent, AuditRiskComponent, AuditsCustomFieldsComponent, AuditRatingComponent]

@NgModule({
    imports: [
        CommonModule,
        // ProjectPackageModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        FontAwesomeModule,
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
        MatDialogModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MatPaginatorModule,
        MatRadioModule,
        MatTooltipModule,
        MatStepperModule,
        EditorModule,
        AngularSplitModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatTableModule,
        // QuillModule,
        StoreModule.forFeature("auditManagement", reducers.reducers),
        EffectsModule.forFeature(AuditManagementEffects.allAuditModuleEffects),
        RouterModule,
        SatPopoverModule,
        TranslateModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatAutocompleteModule,
        SnovasysCommentsModule,
        SnovasysMessageBoxModule,
        GridModule,
        LayoutModule,
        NgSelectModule,
        DragulaModule,
        DragulaModule.forRoot(),
        TimeagoModule.forChild(),
        CronEditorModule,
        NgxMaterialTimepickerModule,
        AvatarModule,
        DynamicModule,
        DynamicModule.withComponents([]),
        DropZoneModule,
        NgxDropzoneModule,
        FormioModule,
        ChartsModule, 
        DropDownListModule,
        GaugesModule,
        ExcelModule,
        PDFModule,
        TreeViewModule,
        CustomFieldsComponentModule
    ],
    declarations: components,
    exports: components,
    providers: [
        SoftLabelPipe,
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentUtcDateAdapter },
        // {
        //     provide: DateAdapter,
        //     useClass: MomentDateAdapter,
        //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        // },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        DatePipe,
        AuditService,
        SoftLabelPipe,
        UtcToLocalTimePipe,
        RemoveSpecialCharactersPipe,
        FetchSizedAndCachedImagePipe,
        CurrencyPipe,
        AuditTimeFilterPipe
    ],
    // entryComponents: [
    //     QuestionsCopyMoveComponent,
    //     AuditDetailsComponent,
    //     AuditNonComplainceComponent,
    //     AuditComplainceComponent,
    //     ConductCategoryListViewComponent,
    //     ConductQuestionsListViewComponent,
    //     ConductQuestionOperationComponent,
    //     QuestionsFilterComponent,
    //     AvatarComponent,
    //     QuestionHistoryComponent,
    //     QuestionConductHistoryComponent,
    //     ConductCategoriesViewComponent,
    //     QuestionConductCaseComponent,
    //     HierarchicalConductQuestionsComponent,
    //     ConductCategoryOperationsComponent,
    //     QuestionConductComponent,
    //     ConductQuestionActionComponent,
    //     QuestionActionsComponent,
    //     AuditConductBryntumSchedulerComponent,
    //     UpsertQuestionTypeDialogComponent,
    //     UpsertQuestionTypeComponent,
    //     QuestionTypeComponent,
    //     MasterQuestionTypeComponent,
    //     AuditConductTimelineView,
    //     AuditsViewComponent,
    //     AuditConductsViewComponent,
    //     AuditReportsViewComponent,
    //     AddAuditActivityViewComponent,
    //     AppStoreDialogComponent,
    //     AuditPriorityViewComponent,
    //     AuditImpactViewComponent,
    //     WorkFlowBpmnComponent,
    //     WorkFlowSelectionComponent,
    //     WorkFlowTriggerDialogComponent,
    //     AuditCustomFieldComponent,
    //     AddAuditActionsViewComponent,
    //     AuditUniqueDetailComponent,
    //     ConductUniqueDetailComponent,
    //     AuditVersionUniqueDialogComponent,
    //     ActionCategoryComponent,
    //     AuditRiskComponent,
    //     AuditRatingComponent,
    //     SubmittedAuditPreviewComponent,
    //     NonComplaintAuditPreviewComponent
    // ]
})

export class SnovaAuditsModule {
    constructor() {
        var configurations = new SoftLabelConfigurationModel();
        new GetsoftLabelsTriggered(configurations);
        const themeBaseColor = localStorage.getItem('themeColor');
        document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
    }

    static forChild(config: auditModulesInfo): ModuleWithProviders<SnovaAuditsModule> {
        return {
            ngModule: SnovaAuditsModule,
            providers: [
                { provide: AuditModulesService, useValue: config }
            ]
        };
    }
}
