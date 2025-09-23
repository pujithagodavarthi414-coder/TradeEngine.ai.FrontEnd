import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatExpansionModule } from "@angular/material/expansion";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { DateAdapter } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { EditorModule } from "@tinymce/tinymce-angular";
import { FormioModule } from "angular-formio";
import { NgxPrintModule } from 'ngx-print';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTableModule } from "@angular/material/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ColorPickerModule } from "ngx-color-picker";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { ProjectListComponent } from "./projects/project-list.component";
import { DragulaModule } from "ng2-dragula";
import { ReportingComponent } from "./projects/reporting.component";
import { MembersComponent } from "./projects/members.component";
import { FeatureComponent } from "./projects/feature.component";
import { CreateProjectComponent } from "./projects/createproject.component";
import { ProjectSummaryViewComponent } from "./projects/project-summary-view.component";
import { CreateProjectFeatureComponent } from "./projects/add-project-feature.component";
import { GoalsPageComponent } from "./goals/all-goals.page.component";
import { AdvancedSearchComponent } from "./goals/advanced-search.component";
import {
  TimeagoModule,
} from "ngx-timeago";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserstoryDetailDialogComponent } from "./userStories/userstory-detail-dialog.component";
import { LazyLoadImageModule } from "ng-lazyload-image";
// import { NgxFloatButtonModule } from 'ngx-float-button';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectsDialogComponent } from './dialogs/projects-dialog.component';
import { ArchiveProjectComponent } from "./projects/project-archive.component";
import { TranslateModule } from "@ngx-translate/core";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProjectMemberComponent } from "./projects/projectmember.component";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { HeatmapAllUserStories } from "./reports/heat-map-all-user-stories-in-a-goal.component";
import { HeatMapModule } from "@syncfusion/ej2-angular-heatmap";
import { DevoloperGoalUserstoriesComponent } from "./reports/devoloper-goal-userstories/devoloper-goal-userstories.component";
import { GoalActivityComponent } from "./reports/goal-activity/goal-activity.component";
import { ReportsBoardComponent } from "./boards/reports-board/reports-board.component";
import { AngularSplitModule } from "angular-split";
import { AdvancedSearchFiltersComponent } from "./dialogs/advanced-search-filters.component";
import { GoalUniqueDetailComponent } from "./goals/goal-unique-detail.component";
import { RouterModule } from "@angular/router";
import { TemplatesListComponent } from "../components/templates/templates-list.component";
import { TemplateCreateComponent } from "../components/templates/create-template.component";
import { TemplatesSummaryComponent } from "../components/templates/templates-summary.component";
import { TemplateBoardComponent } from "./boards/template-board.component";
import { TemplateViewStatusComponent } from "./boards/template-view-status.component";
import { TemplatesViewSummaryComponent } from "./boards/templates-view-summary.component";
import { TemplateBrowseBoardComponent } from "../components/templates/templates-browse-board.component";
import { CreateWorkItemComponent } from "../components/templates/create-workitem.component";
import { TemplateWorkItemComponent } from "../components/templates/template-workitem-detail.component";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ProjectSettingsComponent } from "./projects/project-settings.component";
import { MatDatetimepickerModule, DatetimeAdapter, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { MatMomentDatetimeModule, MomentDatetimeAdapter } from "@mat-datetimepicker/moment";
import { GridModule , ExcelModule} from "@progress/kendo-angular-grid";
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { GoalsBrowseBoardComponent } from './goals/goals-browse-board.component';
import { SprintsBrowseBoardComponent } from './sprints/sprints-browse-board.component';
import { GoalListComponent } from './goals/goal-list.component';
import { SprintUserStoriesComponent } from './sprints/sprint-userstories-list.component';
import { SprintsListComponent } from './sprints/sprints-list.component';
import { GoalSummaryLoadingComponent } from './goals/goal-summary-loading.component';
import { GoalSummaryComponent } from './goals/goal-summary.component';
import { GoalCreateComponent } from './goals/goal-create.component';
import { SprintSummaryComponent } from './sprints/sprint-summary.component';
import { SprintSummaryViewComponent } from './sprints/sprint-summary-view.component';
import { GoalArchiveComponent } from './goals/goal-archive.component';
import { GoalParkComponent } from './goals/goal-park.component';
import { EditSprintComponent } from './sprints/edit-sprint.component';
import { SprintsUniqueDetailComponent } from './sprints/sprints-unique-detail.component';
import { SprintWorkitemsComponent } from './sprints/sprint-workitems-list.component';
import { SprintsKanbanBoardComponent } from './boards/sprints-kanban-board.component';
import { UserStoryListComponent } from './userStories/userStory-list.component';
import { KanbanboardComponent } from './boards/kanbanboard.component';
import { ProjectsReportsComponent } from './reports/projects-reports.page';
import { CreateUserStoryComponent } from './userStories/create-user-story.component';
import { KanbanViewStatusComponent } from './boards/kanbanViewStatus.component';
import { KanbanViewSummaryComponent } from './boards/kanban-view-summary.component';
import { AddUserStoryComponent } from './boards/kanbanadduserstory.component';
import { GoalBurnDownChartComponent } from './reports/goal-burn-down-chart.component';
import { GoalReplanHistoryComponent } from './reports/goal-replan-history.component';
import { SelectedGoalActivityComponent } from './reports/selected-goal-activity.component';
import { SprintsReportsBoardComponent } from './reports/sprints-reports-page.component';
import { SelectedSprintActivityComponent } from './reports/selected-sprint-activity.component';
import { SprintReplanHistoryComponent } from './reports/sprint-replan-history.component';
import { SprintBugReportComponent } from './reports/sprints-bug-report.component';
import { BugReportFilterPipe } from '../pipes/bug-report-filter.pipes';
import { ProjectActivityComponent } from './reports/project-activity/project-activity.component';
import { SprintResponsiblePersonfilterPipe } from '../pipes/responsible-person.pipes';
import { SprintFilterPipe } from '../pipes/sprints-filter.pipes';
import { UserStorySummaryComponent } from './userStories/userStory-summary.component';
import { GoalCalenderViewComponent } from './goals/goal-calander-view.component.';
import { SuperagileBoardComponent } from './boards/superagile-board.component';
import { SprintsBoardComponent } from './sprints/sprints-board.component';
import { UserStoryArchiveComponent } from './userStories/userStory-archive.component';
import { UserStoryParkComponent } from './userStories/userStory-park.component';
import { InlineEditUserStoryComponent } from './userStories/inline-edit-userstory.component';
import { UserStoryTagsComponent } from './tags/tags.component';
import { AssigneefilterPipe } from '../pipes/assigneeFilter.pipes';
import { SortByComparatorPipe } from '../pipes/sort-filter.pipes';
import { DependencyUserfilterPipe } from '../pipes/dependencyUserFilter.pipes';
import { AddProjectMemberComponent } from './projects/add-project-member.component';
import { DataFilterPipe } from '../pipes/filter.pipes';
import { SearchFilterPipe } from '../pipes/searchfilter.pipe';
import { UserStoryTagsPipe } from '../pipes/userstory-tags.pipes';
import { BugPriorityFilterPipe } from '../pipes/bugPriorityFilter.pipes';
import { ResultFilterPipe } from '../pipes/result.pipes';
import { WorkItemTypesFilterPipe } from '../pipes/work-item-types.pipes';
import { VersionNameFilterPipe } from '../pipes/versionName.pipe';
import { ComponentFilterPipe } from '../pipes/componentFilter.pipe';
import { UserstoryFilterPipe } from '../pipes/userstoryFilter.pipes';
import { AssigneeCountPipe } from '../pipes/assigneeCount.pipes';
import { ProjectGoalFilterPipe } from '../pipes/goalFilter.pipes';
import { GoalStatusColorFilterPipe } from '../pipes/goalStatus.pipes';
import { GoalResponsiblePersonfilterPipe } from '../pipes/responsiblePersonFilter.pipes';
import { GoalResponsibleFilterPipe } from '../pipes/goalResponsiblePerson.pipes';
import { GoalFilterPipe } from '../pipes/goal-Filter.pipe';
import { GoalTagsPipe } from '../pipes/goal-filter-tags.pipes';
import { SubTasksWorkItemTypesFilterPipe } from '../pipes/subtasks-work-item-types.pipes';
import { SortByGoalPipe } from '../pipes/sortComparator.pipes';
import { ActivityFilterPipe } from '../pipes/activityList.pipes';
import { GoalOrderPipe } from '../pipes/goal-order.pipes';
import { UniqueUserstoryDialogComponent } from './userStories/unique-userstory-dialog.component';
import { UserStoryUniqueDetailComponent } from './userStories/userstory-unique-detail.component';
import { UserStoryHistoryComponent } from './userStories/userstory-history.component';
import { UserStoryLogTimeHistoryComponent } from './userStories/log-time-history.component';
import { UserStorySubTaskListComponent } from './userStories/userstory-subtask-list.component';
import { UserStoryLogTimeComponent } from './userStories/userStoryLogTime.component';
import { UserStoryLinksComponent } from './userStories/user-story-links.component';
import { UserStorySubTaskComponent } from './userStories/userstory-subtask.component';
import { UserStoryLinkFilterPipe } from '../pipes/userstory-link-filter.pipes';
import { SearchSubTasksFilterPipe } from '../pipes/subtasks-status-filter.pipes';
import { UserStorySubTasksTagsPipe } from '../pipes/subtasks-tags-filter.pipes';
import { LinkUserStoryFilterPipe } from '../pipes/link-userstory.pipes';
import { UserStoryNameFilterPipe } from '../pipes/user-story-name-filter.pipes';
import { UserStoryLinkSummaryComponent } from './userStories/user-story-link-summary.component';
import { ArchiveUserStorySummaryComponent } from './userStories/archive-user-story-link.component';
import { CreateUserStoryLinkComponent } from './userStories/create-user-story-link.component';
import { GoalEmployeeTaskBoardViewComponent } from './goals/goal-employee-task-board-view.component';
import { SoftLabelPipe } from '../../globaldependencies/pipes/softlabels.pipes';
import { TimeFilterPipe } from '../../globaldependencies/pipes/timefilter.pipe';
import { CustomFieldHistoryPipe } from '../../globaldependencies/pipes/custom-field-history.pipe';
import { UserStoryHistoryPipe } from '../../globaldependencies/pipes/history.pipe';
import { DeadlineDateToDaysPipe } from '../../globaldependencies/pipes/deadLineDateFilter.pipe';
import { DeadlineDateToIconPipe } from '../../globaldependencies/pipes/deadLineFilterToicon.pipe';
import { TestCaseScenarioEditComponent } from './userStories/testcase-scenario-edit.component';
import { TestCaseScenarioStatusEditComponent } from './userStories/testcase-scenario-status-edit.component';
import { UserStoryBugsComponent } from './userStories/userstory-bugs.component';
import { UserStoryScenarioBugComponent } from './userStories/userstory-scenario-bug.component';
import { UserStoryScenarioHistoryComponent } from './userStories/userstory-scenario-history.component';
import { EstimatedTimeComponent } from './userStories/estimatedtime.component';
import { RemainingSpentTimeComponent } from './userStories/remainingEstimate.component';
import { SpentTimeComponent } from './userStories/spentTime.component';
import { RemoveSpecialCharactersPipe } from '../../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { SnovasysAvatarModule } from "@snovasys/snova-avatar";
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { FetchSizedAndCachedImagePipe } from '../../globaldependencies/pipes/fetchSizedAndCachedImage.pipe';
import { ChipComponent } from './chip.component';
import { UserStoryDetailComponent } from './userStories/userstory-detail.component';
import { RoomTemperatureApiComponent } from './boardTypeApis/room-temperature-api.component';
import { BoardTypeToIconPipe, BoardTypeTooltipPipe } from '../../globaldependencies/pipes/boardTypeToIcon.pipe';
import { EstimatedTimeToHoursPipe } from '../../globaldependencies/pipes/estimatedTime.pipe';
import { SnovasysAppPipesModule } from "@snovasys/snova-app-pipes";
import { TagsFilterPipe } from '../pipes/tagsFilter.pipe';
import { EstimationTimePipe } from '../pipes/estimate-time-filter.pipe';
import { FileNameFromFilePathPipe } from '../pipes/get-file-name-from-file-path.pipe';
import { UtcToLocalTimePipe } from '../pipes/utctolocaltime.pipe';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { UserStoryTestScenarios } from './userStories/userstory-test-scenarios.component';
import { UserStoryTestCaseScenarioComponent } from './userStories/userstory-test-case-scenario.component';
import { AdhocUserstoryDetailDialogComponent } from "./userStories/adhoc-userstory-detail-dialog.component";
import { EstimateTimeRemoval } from "../../globaldependencies/pipes/estimateTimeRemoval.pipe";
import { CronEditorModule } from "cron-editor";
import { DropZoneModule } from "@snovasys/snova-file-uploader";
import { WorkFlowTriggerComponent } from '../../globaldependencies/components/workflow-trigger.component';
import { UserStoriesBasedOnDeveloperComponent } from './reports/user-stories -dependent-on-developer.component';
import { WorkItemDialogComponent } from './userStories/work-item-dailogue.component';
import { UtcToLocalTimeWithDatePipe } from '../../globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { WorkflowStatusFilterPipe } from '../../globaldependencies/pipes/workflowstatus.pipes';
import { AllWorkItemsComponent } from './userStories/all-work-items.component';
import { CreateAdhocWorkComponent } from './adhoc-work/create-adhoc-work.component';
import { AdhocUserStorySummaryComponent } from './adhoc-work/adhoc-userstory-summary.component';
import { AdhocUserStoryParkComponent } from './adhoc-work/adhoc-userstory-park.component';
import { AdhocUserStoryDetailComponent } from './adhoc-work/adhoc-userstory-detail.component';
import { AdhocUserStoryArchiveComponent } from './adhoc-work/adhoc-userstory-archive.component';
import { AdhocUniqueDetailComponent } from './adhoc-work/adhoc-unique-detail.component';
import { AdhocUserStoryTagsComponent } from './adhoc-work/adhoc-tags.component';
import { InlineEditAdhocUserStoryComponent } from './adhoc-work/inline-edit-adhoc-userstory.component';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ViewCustomFieldHistoryComponent } from './customfields/view-custom-field-history.component';
import { CustomFormHistoryComponent } from './customfields/custom-form-history.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, DateTimeAdapter, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { GoogleAnalyticsService } from '../../globaldependencies/services/google-analytics.service';
import { DynamicModule } from '@snovasys/snova-ndc-dynamic';
import { projectModulesInfo } from '../models/projectModulesInfo';
import { ProjectModulesService } from '../services/project.modules.service';
import { TrimDirective } from '../directives/spaces-trim.directive';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MomentUtcDateAdapter } from '../../globaldependencies/helpers/moment-utc-date-adapter';
import { BoardTypesFilter } from '../pipes/boardTypesfilter.pipes';
import { ProjectAuditComponent } from './projects/project-audit.component';
import { AmountDirective } from '../directives/amount.directive';
import { ProjectOrderPipe } from '../pipes/project-order.pipes';
import { WorkItemStatusOrderPipe } from '../pipes/work-item-status.pipe';
import { AllGoalsFilterComponent } from './dialogs/all-goals-filters-dialog.component';
import { ExtraFiltersComponent } from './dialogs/extra-filters.component';
import { GenericTypeStatusComponent } from './generic-type-status.component';
import { GenericDetailComponent } from './userStories/generic-detail.component';
import { AuditUniquePageComponent } from './userStories/audit-unique-page.component';
import { ConductUniquePageComponent } from './userStories/conduct-unique-page.component';
import { ProjectsAppComponent } from './projects/projects-app.component';
import { TrackerScreenshotsComponent } from './dialogs/tracker-screenshots.component';
import { TimeZoneDataPipe } from '../pipes/timeZoneData.pipe';
import { CustomDateTimeAdapter } from '../../globaldependencies/helpers/moment-datetime-adapter';
import { CapacityPlanningReportComponent } from "./reports/capacityplanningreport.component";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { ProjectReportsFiltersComponent } from "./reports/projectreportsfilters.component";
import { ProjectUsageReportComponent } from "./reports/projectusagereport/projectusagereport.component";
import { ProjectUsageReportDrillDownComponent } from "./reports/projectusagereport/projectusagereportdrilldown.component";

import{CovertTimeIntoUtcTime} from '../../globaldependencies/pipes/Utctooffset.pipe'
import { UserSortFilter } from "../pipes/user-sort.pipes";
import { ResourceUsageReportGridComponent } from "./reports/resourceusagereport/resourceusagereportgrid.component";
import { ResourceUsageReportComponent } from "./reports/resourceusagereport/resourceusagereport.component";
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'DD MMM YYYY',
  },
};

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD MMM YYYY HH:mm',
  parseInput: 'DD MMM YYYY HH:mm',
  datePickerInput: 'DD MMM YYYY HH:mm',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };

export const COMPONENTS = [
  ProjectListComponent,
  ReportingComponent,
  MembersComponent,
  FeatureComponent,
  CreateProjectComponent,
  ProjectSummaryViewComponent,
  CreateProjectFeatureComponent,
  ReportsBoardComponent,
  GoalsPageComponent,
  AdvancedSearchComponent,
  ProjectMemberComponent,
  UserstoryDetailDialogComponent,
  ProjectsDialogComponent,
  ArchiveProjectComponent,
  HeatmapAllUserStories,
  DevoloperGoalUserstoriesComponent,
  GoalActivityComponent,
  AdvancedSearchFiltersComponent,
  AllGoalsFilterComponent,
  ExtraFiltersComponent,
  GoalUniqueDetailComponent,
  TemplatesListComponent,
  TemplateCreateComponent,
  TemplatesSummaryComponent,
  TemplateBoardComponent,
  TemplateViewStatusComponent,
  TemplatesViewSummaryComponent,
  TemplateBrowseBoardComponent,
  CreateWorkItemComponent,
  TemplateWorkItemComponent,
  ProjectSettingsComponent,
  GoalsBrowseBoardComponent,
  SprintsBrowseBoardComponent,
  GoalListComponent,
  SprintUserStoriesComponent,
  SprintsListComponent,
  GoalSummaryLoadingComponent,
  SprintWorkitemsComponent,
  GoalSummaryComponent,
  GoalCreateComponent,
  SprintSummaryComponent,
  SprintsKanbanBoardComponent,
  SprintSummaryViewComponent,
  GoalArchiveComponent,
  //AvatarComponent,
  GoalParkComponent,
  //BoardTypeToIconPipe,
  EditSprintComponent,
  SprintsUniqueDetailComponent,
  UserStoryListComponent,
  KanbanboardComponent,
  ProjectsReportsComponent,
  CreateUserStoryComponent,
  KanbanViewStatusComponent,
  KanbanViewSummaryComponent,
  AddUserStoryComponent,
  GoalBurnDownChartComponent,
  GoalReplanHistoryComponent,
  SelectedGoalActivityComponent,
  SprintsReportsBoardComponent,
  SelectedSprintActivityComponent,
  SprintReplanHistoryComponent,
  SprintBugReportComponent,
  BugReportFilterPipe,
  ProjectActivityComponent,
  SprintResponsiblePersonfilterPipe,
  SprintFilterPipe,
  SprintWorkitemsComponent,
  SprintsKanbanBoardComponent,
  UserStorySummaryComponent,
  GoalCalenderViewComponent,
  DeadlineDateToIconPipe,
  SuperagileBoardComponent,
  SprintsBoardComponent,
  UserStoryArchiveComponent,
  UserStoryParkComponent,
  InlineEditUserStoryComponent,
  UserStoryTagsComponent,
  DeadlineDateToDaysPipe,
  TimeFilterPipe,
  AssigneefilterPipe,
  SortByComparatorPipe,
  DependencyUserfilterPipe,
  AddProjectMemberComponent,
  DataFilterPipe,
  SearchFilterPipe,
  UserStoryTagsPipe,
  BugPriorityFilterPipe,
  ResultFilterPipe,
  WorkItemTypesFilterPipe,
  VersionNameFilterPipe,
  ComponentFilterPipe,
  UserstoryFilterPipe,
  AssigneeCountPipe,
  ProjectGoalFilterPipe,
  GoalStatusColorFilterPipe,
  GoalResponsiblePersonfilterPipe,
  GoalResponsibleFilterPipe,
  GoalFilterPipe,
  GoalTagsPipe,
  SubTasksWorkItemTypesFilterPipe,
  SortByGoalPipe,
  ActivityFilterPipe,
  GoalOrderPipe,
  ProjectOrderPipe,
  WorkItemStatusOrderPipe,
  UniqueUserstoryDialogComponent,
  UserStoryUniqueDetailComponent,
  GenericTypeStatusComponent,
  GenericDetailComponent,
  UserStoryHistoryComponent,
  UserStoryLogTimeHistoryComponent,
  UserStorySubTaskListComponent,
  UserStoryLogTimeComponent,
  UserStoryLinksComponent,
  UserStorySubTaskComponent,
  UserStoryHistoryPipe,
  UserStoryLinkFilterPipe,
  SearchSubTasksFilterPipe,
  UserStorySubTasksTagsPipe,
  LinkUserStoryFilterPipe,
  UserStoryNameFilterPipe,
  UserStoryLinkSummaryComponent,
  ArchiveUserStorySummaryComponent,
  CreateUserStoryLinkComponent,
  CustomFieldHistoryPipe,
  TestCaseScenarioEditComponent,
  TestCaseScenarioStatusEditComponent,
  UserStoryBugsComponent,
  UserStoryScenarioBugComponent,
  UserStoryScenarioHistoryComponent,
  GoalEmployeeTaskBoardViewComponent,
  EstimatedTimeComponent,
  RemainingSpentTimeComponent,
  SpentTimeComponent,
  SoftLabelPipe,
  RemoveSpecialCharactersPipe,
  FetchSizedAndCachedImagePipe,
  ChipComponent,
  UserStoryDetailComponent,
  RoomTemperatureApiComponent,
  BoardTypeToIconPipe,
  EstimatedTimeToHoursPipe,
  TagsFilterPipe,
  EstimationTimePipe,
  FileNameFromFilePathPipe,
  UtcToLocalTimePipe,
  UtcToLocalTimeWithDatePipe,
  CovertTimeIntoUtcTime,
  WorkflowStatusFilterPipe,
  UserStoryTestScenarios,
  UserStoryTestCaseScenarioComponent,
  EstimateTimeRemoval,
  BoardTypeTooltipPipe,
  AdhocUserstoryDetailDialogComponent,
  GoalCalenderViewComponent,
  WorkFlowTriggerComponent,
  UserStoriesBasedOnDeveloperComponent,
  WorkItemDialogComponent,
  AllWorkItemsComponent,
  CreateAdhocWorkComponent,
  AdhocUserStorySummaryComponent,
  AdhocUserStoryParkComponent,
  AdhocUserStoryDetailComponent,
  AdhocUserStoryArchiveComponent,
  AdhocUniqueDetailComponent,
  AdhocUserStoryTagsComponent,
  InlineEditAdhocUserStoryComponent,
  AutofocusDirective,
  TrimDirective,
  AmountDirective,
  CustomFormHistoryComponent,
  ViewCustomFieldHistoryComponent,
  BoardTypesFilter,
  ProjectAuditComponent,
  AuditUniquePageComponent,
  ConductUniquePageComponent,
  ProjectsAppComponent,
  TrackerScreenshotsComponent,
  TimeZoneDataPipe,
  UserSortFilter,
  CapacityPlanningReportComponent,
  ResourceUsageReportComponent,
  ProjectReportsFiltersComponent,
  ResourceUsageReportGridComponent,
  ProjectUsageReportComponent,
  ProjectUsageReportDrillDownComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    LayoutModule,
    MatListModule,
    MatGridListModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    NgxDatatableModule,
    MatTabsModule,
    MatFormFieldModule,
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    Ng2GoogleChartsModule,
    MatRadioModule,
    FormsModule,
    NgxPrintModule,
    CronEditorModule,
    MatCheckboxModule,
    MatTableModule,
    EditorModule,
    DragulaModule,
    DropZoneModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HeatMapModule,
    ColorPickerModule,
    MatSlideToggleModule,
    SatPopoverModule,
    TimeagoModule.forChild(),
    DragulaModule.forRoot(),
    LazyLoadImageModule,
    // NgxFloatButtonModule,
    NgSelectModule,
    InfiniteScrollModule,
    Ng2GoogleChartsModule,
    MatAutocompleteModule,
    LayoutModule,
    RouterModule,
    AngularSplitModule,
    MatExpansionModule,
    GridModule,
    MatExpansionModule,
    SnovasysCommentsModule,
    SnovasysAvatarModule,
    SnovasysMessageBoxModule,
    SnovasysAppPipesModule,
    FormioModule,
    SchedulerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DynamicModule,
    ChartsModule,
    ExcelModule,
    DynamicModule.withComponents([])
  ],
  entryComponents: [AllWorkItemsComponent, ExtraFiltersComponent, UserstoryDetailDialogComponent, ProjectsDialogComponent, WorkItemDialogComponent, AllGoalsFilterComponent, AdvancedSearchFiltersComponent, UniqueUserstoryDialogComponent, AdhocUserstoryDetailDialogComponent,
    AllWorkItemsComponent,
    SelectedGoalActivityComponent,
    GoalBurnDownChartComponent,
    GoalReplanHistoryComponent,
    UserStoriesBasedOnDeveloperComponent,
    SprintReplanHistoryComponent,
    SprintBugReportComponent,
    GoalsBrowseBoardComponent,
    GoalUniqueDetailComponent,
    UserStoryUniqueDetailComponent,
    GenericTypeStatusComponent,
    GenericDetailComponent,
    ProjectListComponent,
    SprintsUniqueDetailComponent,
    SelectedSprintActivityComponent,
    UserStoryLogTimeComponent,
    UserStoryLogTimeHistoryComponent, CustomFormHistoryComponent, ProjectsAppComponent,ResourceUsageReportGridComponent,ProjectUsageReportDrillDownComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [BugReportFilterPipe,
    SprintResponsiblePersonfilterPipe,
    SprintFilterPipe,
    DeadlineDateToIconPipe,
    DeadlineDateToDaysPipe,
    SortByComparatorPipe,
    DependencyUserfilterPipe,
    DataFilterPipe,
    SearchFilterPipe,
    UserStoryTagsPipe,
    BugPriorityFilterPipe,
    ResultFilterPipe,
    WorkItemTypesFilterPipe,
    VersionNameFilterPipe,
    ComponentFilterPipe,
    UserstoryFilterPipe,
    AssigneeCountPipe,
    ProjectGoalFilterPipe,
    GoalStatusColorFilterPipe,
    GoalResponsiblePersonfilterPipe,
    GoalResponsibleFilterPipe,
    GoalFilterPipe,
    GoalTagsPipe,
    SubTasksWorkItemTypesFilterPipe,
    SortByGoalPipe,
    ActivityFilterPipe,
    GoalOrderPipe,
    UserStoryHistoryPipe,
    UserStoryLinkFilterPipe,
    SearchSubTasksFilterPipe,
    UserStorySubTasksTagsPipe,
    LinkUserStoryFilterPipe,
    UserStoryNameFilterPipe,
    WorkItemTypesFilterPipe,
    VersionNameFilterPipe,
    ComponentFilterPipe,
    UserstoryFilterPipe,
    UtcToLocalTimeWithDatePipe,
    CovertTimeIntoUtcTime,
    WorkflowStatusFilterPipe,
    CustomFieldHistoryPipe,
    GoalOrderPipe,
    ProjectOrderPipe,
    WorkItemStatusOrderPipe,
    SoftLabelPipe,
    EstimateTimeRemoval,
    DatePipe,
    BoardTypeToIconPipe,
    EstimatedTimeToHoursPipe,
    TagsFilterPipe,
    EstimationTimePipe,
    FileNameFromFilePathPipe,
    UtcToLocalTimePipe,
    BoardTypeTooltipPipe,
    BoardTypesFilter,
    UserSortFilter,
    AllWorkItemsComponent,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-gb' },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: DateTimeAdapter, useClass: CustomDateTimeAdapter},
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    GoogleAnalyticsService
  ]
})
export class ProjectManagementComponentsModule {
  static forChild(config: projectModulesInfo): ModuleWithProviders<ProjectManagementComponentsModule> {
    return {
      ngModule: ProjectManagementComponentsModule,
      providers: [
        { provide: ProjectModulesService, useValue: config }
      ]
    };
  }
}
