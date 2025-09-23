import { TimeagoModule } from 'ngx-timeago';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
// import {
// // MatCardModule, MatProgressBarModule, MatFormFieldModule, MatSlideToggleModule, MatTooltipModule, MatIconModule, 
//  // MatDividerModule, MatSnackBarModule, MatInputModule,
  
//   MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter,  MatDialogRef, MAT_DIALOG_DATA, 
  
//  // MatDialog, MatSelectModule, MatDatepickerModule, MatRadioModule, 
//   //MatCheckboxModule, MatAutocompleteModule 
// } from '@angular/material';

import { MAT_DATE_FORMATS,MAT_DATE_LOCALE,DateAdapter } from "@angular/material/core";
import { MatDialogRef ,MAT_DIALOG_DATA} from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';


import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

//   MatMenuModule,
//   MatButtonModule,
//   MatChipsModule,
//   MatListModule,
//   MatGridListModule,
//   MatTableModule,
//   MatStepperModule
// } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RouterModule } from "@angular/router";
import { MatExpansionModule } from "@angular/material/expansion";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { EditorModule } from "@tinymce/tinymce-angular";
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from "ng2-dragula";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ExcelModule, GridModule, PDFModule } from "@progress/kendo-angular-grid";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { TestSuitesCasesAddCaseViewComponent } from "./components/testsuites-addnew-testcase.component";
import { TestsuitecasedetailsviewComponent } from "./components/testsuite-casedetails-view.component";
import { TestRunsComponent } from "./components/testruns.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from "ng-pick-datetime";
import { AvatarModule } from 'ngx-avatar';
import { TestSuitesListComponent } from "./components/testsuites-list.component";
import { TestSuiteItemSummaryComponent } from "./components/testsuite-item-summary.component";
import { TestSuitesViewComponent } from "./components/testsuites-view.component";
import { TestSuitesSectionsListComponent } from "./components/testsuites-sections-list.component";
import { TestSuiteSectionsViewComponent } from "./components/testsuite-sections-view.component";
import { TestSuiteSubSectionViewComponent } from "./components/testsuite-subsection-view.component";
import { TestSuiteSectionOperationsComponent } from "./components/testsuite-section-operations.component";
import { TestSuiteSectionCasesViewComponent } from "./components/testsuite-section-cases-view.component";
import { TestCaseEditComponent } from "./components/testcase-edit.component";
import { TestCasePreviewComponent } from "./components/testcase-preview.component";
import { TestSuitesListLoadingComponent } from "./components/testsuites-list-loading.component";
import { TestSuiteCaseComponent } from "./components/testsuite-case.component";
import { TestrailMileStoneViewComponent } from "./components/milestone-view.component";
import { TestrailMileStoneEditComponent } from "./components/milestone-edit.component";
import { TestRunsViewComponent } from "./components/testruns-view.component";
import { TestRunsListComponent } from "./components/testruns-list.component";
import { TestRunItemSummaryComponent } from "./components/testrun-item-summary.component";
import { TestrailMileStoneBaseComponent } from "./components/milestone-base.component";
import { TestRunsSectionsListComponent } from "./components/testruns-sections-list.component";
import { TestRunSectionsViewComponent } from "./components/testrun-sections-view.component";
import { TestRunSectionSubsectionsComponent } from "./components/testrun-section-subsections.component";
import { TestRunSubsectionViewComponent } from "./components/testrun-subsection-view.component";
import { TestRunSectionCasesViewComponent } from "./components/testrun-section-cases-view.component";
import { TestRunCaseComponent } from "./components/testrun-case.component";
import { TestRunCasesOperationComponent } from "./components/testrun-cases-operation.component";
import { TestSuitesRunsCaseDetailsViewComponent } from "./components/testsuites-runs-casedetails-view.component";
import { TestRunCaseAssignToStatusComponent } from "./components/testrun-case-assignto-status.component";
import { TestRunCaseStatusComponent } from "./components/testrun-case-status.component";
import { TestRunAddNewComponent } from "./components/testrun-add-new.component";
import { TestRunCasesSubsectionsComponent } from "./components/testrun-cases-subsections.component";
import { TestRunCasesViewComponent } from "./components/testrun-cases-view.component";
import { TestRunCasesListComponent } from "./components/testrun-cases-list.component";
import { TestRunCasesSubsectionViewComponent } from "./components/testrun-cases-subsection-view.component";
import { TestRunSelectTestCaseViewComponent } from "./components/testrun-select-test-case-view.component";
import { TestRunSelectCaseComponent } from "./components/testrun-select-case.component";
import { TestRunsListLoadingComponent } from "./components/testruns-list-loading.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MileStonesListLoadingComponent } from "./components/milestone-list-loading.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { TestCasesFilterComponent } from "./components/testcases-filter.component";
import { TestrailNamePipe } from "./pipes/testrail-name-filter.pipe";
import { DateFilterPipe } from "./pipes/testsuite-date-filter.pipe";
import { ReportsViewComponent } from "./components/reports-view.component";
import { ReportsListComponent } from "./components/reports-list.component";
import { ReportItemSummaryComponent } from "./components/report-item-summary.component";
import { ReportsListLoadingComponent } from "./components/reports-list-loading.component";
import { AddReportComponent } from "./components/add-report.component";
import { DetailedReportViewComponent } from "./components/detailed-report-view.component";
import { ReportTestCaseComponent } from "./components/report-test-case.component";
import { ReportTestCasePreviewComponent } from "./components/report-testcase-preview.component";
import { TestcaseStatusHistoryComponent } from "./components/testcase-status-history.component";
import { ReportTestCaseDetailsComponent } from "./components/report-test-case-details.component";
import { MilestoneCompletedPipe } from "./pipes/milestone-completed-filter.pipe";
import { HierarchicalCasesComponent } from "./components/hierarchical-cases.component";
import { SortByPipe } from "./pipes/testrail-sortby.pipe";
import { HierarchicalRunCasesComponent } from "./components/hierarchical-run-cases.component";
import { ReportHierarchyCasesComponent } from "./components/report-hierarchy-cases.component";
import { TestSuiteCasesCopyMoveComponent } from "./components/testsuite-cases-copy-move.component";
import { TestSuiteSectionsListShiftComponent } from "./components/testsuite-sections-list-shift.component";
import { TestSuiteCasesShiftViewComponent } from "./components/testsuite-cases-shift-view.component";
import { TestSuiteCasesSubSectionsShiftViewComponent } from "./components/testsuite-cases-subsections-shift-view.component";
import { TestSuiteCasesSubSectionsShiftComponent } from "./components/testsuite-cases-subsections-shift.component";
import { TestSuiteSelectTestCaseViewComponent } from "./components/testsuite-select-test-case-view.component";
import { TestSuiteSelectCaseComponent } from "./components/testsuite-select-case.component";
import { TestSuiteCasesOperationComponent } from "./components/testsuite-cases-operation.component";
import { TestSuiteCaseHistoryComponent } from "./components/testsuite-case-history.component";
import { DynamicModule } from "ng-dynamic-component";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { SoftLabelPipe } from './pipes/softlabels.pipes';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { ChartsViewComponent } from './components/charts-view.component';
import { TestSuiteEditComponent } from './components/testsuite-edit.component';
import { TestSuiteSectionEditComponent } from './components/testsuite-section-edit.component';
import { EstimationTimePipe } from './pipes/estimate-time-filter.pipe';
import { QaProductivityPopUp } from './containers/qaproductivitypopup.page';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { UtcToLocalTimePipe } from './pipes/utctolocaltime.pipe';
import { FileNameFromFilePathPipe } from './pipes/get-file-name-from-file-path.pipe';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { GoogleAnalyticsService } from './services/google-analytics.service';

import { createCustomElement } from '@angular/elements';

import { QuillModule } from 'ngx-quill';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from "./store/reducers/index";
import * as TestRailManagementEffects from "./store/effects/index";
import { TestraildashboardprojectslistComponent } from './components/testrail-dashboard-projectslist.component';
import { TestrailProjectsDialogComponent } from './components/testrail-projects-dialog.component';
import { CustomAppFeatureBaseComponent } from './constants/featurecomponentbase';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';

import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { ToastrModule } from 'ngx-toastr';
import { TestCaseScenarioBugComponent } from './components/testcase-bug.component';
import { TestRailEstimatedTimeComponent } from './components/estimated-time.component';
import { ResultsFilterPipe } from './pipes/result.pipe';
import { TestRunCaseBugsComponent } from './components/testrun-case-bugs.component';
import { NgxDropzoneModule } from "ngx-dropzone";
import { TestrailRoutes } from './testrail.routing';
import { TestRailService } from './services/testrail.service';
import { testRepoModuleInfo } from './models/testRepoModule.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

export const COMPONENTS = [
  SoftLabelPipe,
  TestSuitesCasesAddCaseViewComponent,
  TestsuitecasedetailsviewComponent,
  TestRunsComponent,
  TestSuitesListComponent,
  TestSuiteItemSummaryComponent,
  TestSuitesViewComponent,
  TestSuitesSectionsListComponent,
  TestSuiteSectionsViewComponent,
  TestSuiteSubSectionViewComponent,
  TestSuiteSectionOperationsComponent,
  TestSuiteSectionCasesViewComponent,
  TestCaseEditComponent,
  TestCasePreviewComponent,
  TestSuitesListLoadingComponent,
  TestSuiteCaseComponent,
  TestrailMileStoneViewComponent,
  TestrailMileStoneEditComponent,
  TestrailMileStoneBaseComponent,
  TestRunsViewComponent,
  TestRunsListComponent,
  TestRunItemSummaryComponent,
  TestrailMileStoneViewComponent,
  TestrailMileStoneEditComponent,
  TestRunsViewComponent,
  TestRunsListComponent,
  TestRunItemSummaryComponent,
  TestRunsSectionsListComponent,
  TestRunSectionsViewComponent,
  TestRunSectionSubsectionsComponent,
  TestRunSubsectionViewComponent,
  TestRunSectionCasesViewComponent,
  TestRunCaseComponent,
  TestRunCasesOperationComponent,
  TestSuitesRunsCaseDetailsViewComponent,
  TestRunCaseAssignToStatusComponent,
  TestRunCaseStatusComponent,
  TestRunAddNewComponent,
  TestRunCasesListComponent,
  TestRunCasesViewComponent,
  TestRunCasesSubsectionsComponent,
  TestRunCasesSubsectionViewComponent,
  TestRunSelectTestCaseViewComponent,
  TestRunSelectCaseComponent,
  TestRunsListLoadingComponent,
  MileStonesListLoadingComponent,
  TestCasesFilterComponent,
  TestrailNamePipe,
  DateFilterPipe,
  ReportsViewComponent,
  ReportsListComponent,
  ReportItemSummaryComponent,
  ReportsListLoadingComponent,
  AddReportComponent,
  DetailedReportViewComponent,
  ReportTestCaseComponent,
  ReportTestCasePreviewComponent,
  TestcaseStatusHistoryComponent,
  ReportTestCaseDetailsComponent,
  MilestoneCompletedPipe,
  HierarchicalCasesComponent,
  SortByPipe,
  HierarchicalRunCasesComponent,
  ReportHierarchyCasesComponent,
  TestSuiteCasesCopyMoveComponent,
  TestSuiteSectionsListShiftComponent,
  TestSuiteCasesShiftViewComponent,
  TestSuiteCasesSubSectionsShiftViewComponent,
  TestSuiteCasesSubSectionsShiftComponent,
  TestSuiteSelectTestCaseViewComponent,
  TestSuiteSelectCaseComponent,
  TestSuiteCasesCopyMoveComponent,
  TestSuiteCasesOperationComponent,
  TestSuiteCaseHistoryComponent,
  ChartsViewComponent,
  TestSuiteEditComponent,
  TestSuiteSectionEditComponent,
  EstimationTimePipe,
  RemoveSpecialCharactersPipe,
  UtcToLocalTimePipe,
  QaProductivityPopUp,
  FileNameFromFilePathPipe,
  FetchSizedAndCachedImagePipe,
  TestrailProjectsDialogComponent,
  TestraildashboardprojectslistComponent,
  CustomAppBaseComponent,
  CustomAppFeatureBaseComponent,
  TestCaseScenarioBugComponent,
  TestRailEstimatedTimeComponent,
  ResultsFilterPipe,
  TestRunCaseBugsComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    FontAwesomeModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    MatTabsModule,
    MatFormFieldModule,
    LayoutModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule,
    MatPaginatorModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule,
    SatPopoverModule,
    EditorModule,
    MatStepperModule,
    TranslateModule,
    MatSlideToggleModule,
    NgSelectModule,
    AngularSplitModule,
    HttpClientModule,
    SnovasysMessageBoxModule,
    DragulaModule,
    AvatarModule,
    NgxDropzoneModule,
    MatAutocompleteModule,
    DragulaModule.forRoot(),
    TimeagoModule,
    TimeagoModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    DropZoneModule,
    SnovasysAvatarModule,
    DynamicModule,
    //DynamicModule.withComponents([
      // TestSuitesViewComponent,
      // TestRunsViewComponent,
      // TestrailMileStoneBaseComponent
    //]),
    NgxDatatableModule,
    QuillModule,
    RouterModule,
    // RouterModule.forChild(TestrailRoutes),
    StoreModule.forFeature("testRailManagement", reducers.reducers),
    EffectsModule.forFeature(TestRailManagementEffects.allTestRailModuleEffects)
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: [
    TestrailProjectsDialogComponent,
    TestSuiteCasesCopyMoveComponent,
    QaProductivityPopUp,
    ChartsViewComponent,
    ReportsViewComponent,
    TestSuitesViewComponent,
    TestRunsViewComponent,
    TestrailMileStoneBaseComponent,
    TestSuiteEditComponent,
    TestSuiteSectionEditComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    TranslateService,
    CookieService,
    SoftLabelPipe,
    TestrailNamePipe,
    DateFilterPipe,
    MilestoneCompletedPipe,
    SortByPipe,
    EstimationTimePipe,
    FetchSizedAndCachedImagePipe,
    RemoveSpecialCharactersPipe,
    UtcToLocalTimePipe,
    FileNameFromFilePathPipe,
    ResultsFilterPipe,
    GoogleAnalyticsService,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-gb' },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class TestrepoModule {
  static forChild(config: testRepoModuleInfo): ModuleWithProviders<TestrepoModule> {
    return {
      ngModule: TestrepoModule,
      providers: [
        { provide: TestRailService, useValue: config }
      ]
    };
  }
  constructor(private injector: Injector) {
    const themeBaseColor = localStorage.getItem('themeColor');
    document.documentElement.style.setProperty('--primary-theme-color', themeBaseColor);
  }
}