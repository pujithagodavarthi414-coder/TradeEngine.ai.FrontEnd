import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { MAT_DATE_FORMATS , DateAdapter } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as RecruitmentManagementEffects from './store/effects/index';
import * as reducers from './store/reducers/index';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentUtcDateAdapter } from '../globaldependencies/helpers/moment-utc-date-adapter';
import { NgxMaskModule } from 'ngx-mask';
import { TimeagoModule } from 'ngx-timeago';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { SnovasysMessageBoxModule } from  '@snovasys/snova-message-box';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';
import { RemoveSpecialCharactersPipe } from '../globaldependencies/pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './pipes/fetchSizedAndCachedImage.pipe';
import { JobOpeningStatusComponent } from './component/job-opening-status.component';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../globaldependencies/intercepter/jwt.interceptor';
import { RecruitmentManagementComponent } from '../snovasys-recruitment-management/component/recruitment-management-component';
import { CandidatesComponent } from '../snovasys-recruitment-management/component/recruitment-candidates.component';
import { JobsListComponent } from '../snovasys-recruitment-management/component/jobs-list.component';
import { JobSummaryComponent } from '../snovasys-recruitment-management/component/job-summary-component';
import { ChipComponent } from '../snovasys-recruitment-management/component/chip.component';
import { JobAssignComponent } from '../snovasys-recruitment-management/component/job-assing-component';
import { InterviewProcessComponent } from '../snovasys-recruitment-management/component/interview-process-component';
import { CandidateListComponent } from '../snovasys-recruitment-management/component/candidate-list.component';
import { SuperagileBoardComponent } from '../snovasys-recruitment-management/component/superagile-board.component';
import { AngularSplitModule } from 'angular-split';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DragulaModule } from 'ng2-dragula';
import { CandidateSummaryComponent } from '../snovasys-recruitment-management/component/candidate-summary.component';
import { CandidateDetailComponent } from '../snovasys-recruitment-management/component/candidate-detail.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, DateTimeAdapter } from 'ng-pick-datetime';
import { SnovasysCommentsModule } from '@snovasys/snova-comments';
import { CronEditorModule } from 'cron-editor';
import { RouterModule, Routes } from '@angular/router';
import { StatusComponent } from './component/source.component';
import { DropZoneModule } from '@snovasys/snova-file-uploader';
import { NgSelectModule } from '@ng-select/ng-select';
import { CandidateHistoryDetailComponent } from '../snovasys-recruitment-management/component/candidate-history.component';
import { CandidateSkillsComponent } from '../snovasys-recruitment-management/component/candidate-skills-detail.component';
import { CandidateEducationComponent } from '../snovasys-recruitment-management/component/candidate-education-detail.component';
import { CandidateDocumentComponent } from '../snovasys-recruitment-management/component/candidate-document.component';
import { CandidateJobDetailComponent } from '../snovasys-recruitment-management/component/candidate-job-detail.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CandidateExperienceComponent } from '../snovasys-recruitment-management/component/candidate-experience-detail.component';
import { ScheduleInterviewComponent } from '../snovasys-recruitment-management/component/schedule-interview.component';
import { InterviewTabComponent } from '../snovasys-recruitment-management/component/interview-tab.component';
import { DocumentTypeComponent } from './component/document-type.component';
import { HiringStatusComponent } from './component/hiring-status.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { InterviewTypeComponent } from './component/interview-type.component';
import {InterviewProcessAppComponent} from './component/interview-process-app.component';
import { RecruitmentRoutes } from '../snovasys-recruitment-management/recruitment.routes';
import { JobUniqueDetailComponent } from '../snovasys-recruitment-management/component/job-unique-detail.component';
import { CandidateJobLinkComponent } from '../snovasys-recruitment-management/component/candidate-link.component';
import { JobCandidateLinkComponent } from '../snovasys-recruitment-management/component/jobjoining-link.component';
import { InterviewSchedulesCalenderViewComponent } from '../snovasys-recruitment-management/component/schedules-calendar.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SkillsListComponent } from '../snovasys-recruitment-management/component/skillview/skills-list.component';
import { SkillsCandidateViewComponent } from '../snovasys-recruitment-management/component/skillview/skills-candidates-view.component';
import { JobStatusFilterPipe, } from '../snovasys-recruitment-management/pipes/jobfilter.pipe';
import { JobStatusColorFilterPipe } from '../snovasys-recruitment-management/pipes/jobStatusColor.pipe';
import { JobResponsibleFilterPipe } from '../snovasys-recruitment-management/pipes/jobResponsiblePerson.pipes';
import { HiringManagerfilterPipe } from '../snovasys-recruitment-management/pipes/hiringManagerFilter.pipes';
import { CustomFieldsComponentModule } from '@snovasys/snova-custom-fields';
import { AssigneefilterPipe } from '../snovasys-recruitment-management/pipes/assigneeFilter.pipe';
import { ManagerFilterPipe } from '../snovasys-recruitment-management/pipes/managerFilter.pipe';
import { SortByComparatorPipe } from '../snovasys-recruitment-management/pipes/soryByComponent.pipe';
import { Time24to12Format } from '../globaldependencies/pipes/time24to12.pipe';
import { InteriviewListComponent } from '../snovasys-recruitment-management/component/interview-list.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { BryntumSchedulerComponent } from '../snovasys-recruitment-management/component/skillview/brytym-view-calender';
import { CandidateUniqueDetailComponent } from '../snovasys-recruitment-management/component/candidate-unique-detail.component';
import { VideoCallCandidateComponent } from '../snovasys-recruitment-management/component/video-call-candidate.component';
import { CreateskillsDetailsComponent } from '../snovasys-recruitment-management/component/create-skills-component';
import { ResumePreviewComponent } from '../snovasys-recruitment-management/component/resume-preview.component';
import { AddcandidatedocumentdetailComponent } from '../snovasys-recruitment-management/component/add-candidate-document.component';
import { AppcandidatepopupsdetailsComponent } from '../snovasys-recruitment-management/component/candidate-popups-component';
import { CandidateViewComponent } from '../snovasys-recruitment-management/component/skillview/candidate-view.component';
import { RecruitmentBryntumViewComponent } from '../snovasys-recruitment-management/component/skillview/brymtum-view-recuitment.component';
import { RatingTypeComponent } from './component/rating-type.component';
import { BasicJobDetailsComponent } from '../snovasys-recruitment-management/component/basic-job-detail.component';
import { CreateJobDetailsComponent } from '../snovasys-recruitment-management/component/create-job-detail.component';
export const appRoutes: Routes = [{ path: '' }];

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
  },
};

const components = [
  RemoveSpecialCharactersPipe,
  JobStatusFilterPipe,
  HiringManagerfilterPipe,
  SortByComparatorPipe,
  AssigneefilterPipe,
  ManagerFilterPipe,
  JobStatusColorFilterPipe,
  JobResponsibleFilterPipe,
  FetchSizedAndCachedImagePipe,
  CustomAppBaseComponent,
  JobOpeningStatusComponent,
  RecruitmentManagementComponent,
  CandidatesComponent,
  InterviewSchedulesCalenderViewComponent,
  SkillsListComponent,
  InteriviewListComponent,
  CandidateUniqueDetailComponent,
  JobsListComponent,
  JobSummaryComponent,
  ChipComponent,
  CreateJobDetailsComponent,
  BasicJobDetailsComponent,
  ResumePreviewComponent,
  CreateskillsDetailsComponent,
  JobAssignComponent,
  InterviewProcessComponent,
  CandidateJobLinkComponent,
  CandidateListComponent,
  SuperagileBoardComponent,
  AddcandidatedocumentdetailComponent,
  AppcandidatepopupsdetailsComponent,
  CandidateDetailComponent,
  CandidateSummaryComponent,
  StatusComponent,
  CandidateHistoryDetailComponent,
  CandidateSkillsComponent,
  CandidateEducationComponent,
  CandidateDocumentComponent,
  CandidateJobDetailComponent,
  CandidateExperienceComponent,
  ScheduleInterviewComponent,
  JobCandidateLinkComponent,
  InterviewTabComponent,
  SkillsCandidateViewComponent,
  JobUniqueDetailComponent,
  DocumentTypeComponent,
  HiringStatusComponent,
  InterviewTypeComponent,
  InterviewProcessAppComponent,
  RatingTypeComponent,
  Time24to12Format,
  RecruitmentBryntumViewComponent,
  CandidateViewComponent,
  BryntumSchedulerComponent,
  VideoCallCandidateComponent
];

@NgModule({
  imports: [
    CommonModule,
    // RouterModule.forChild(RecruitmentRoutes),
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    FontAwesomeModule,
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
    MatButtonToggleModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SnovasysMessageBoxModule,
    SnovasysAvatarModule,
    StoreModule.forFeature('recruitmentManagement', reducers.reducers),
    EffectsModule.forFeature(RecruitmentManagementEffects.allRecuitmentModuleEffects),
    MatTooltipModule,
    DigitOnlyModule,
    TranslateModule,
    SatPopoverModule,
    MatExpansionModule,
    PerfectScrollbarModule,
    AngularSplitModule,
    InfiniteScrollModule,
    MatSlideToggleModule,
    DragulaModule,
    LayoutModule,
    GridModule,
    SchedulerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SnovasysCommentsModule,
    CustomFieldsComponentModule,
    EditorModule,
    CronEditorModule,
    DropZoneModule,
    NgSelectModule,
    TimeagoModule.forChild(),
    NgxMaskModule.forRoot(),
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    NgxDropzoneModule,
    NgxGalleryModule,
    NgxDocViewerModule
  ],
  declarations: [components],
  exports: [components],
  entryComponents: [
    CreateJobDetailsComponent,
    BasicJobDetailsComponent,
    InterviewProcessComponent,
    CandidateJobLinkComponent,
    RecruitmentBryntumViewComponent,
    BryntumSchedulerComponent,
    CustomAppBaseComponent,
    JobOpeningStatusComponent,
    RecruitmentManagementComponent,
    SkillsListComponent,
    InteriviewListComponent,
    InterviewSchedulesCalenderViewComponent,
    CandidatesComponent,
    JobsListComponent,
    JobSummaryComponent,
    ChipComponent,
    CreateskillsDetailsComponent,
    JobAssignComponent,
    InterviewProcessComponent,
    CandidateListComponent,
    SuperagileBoardComponent,
    CandidateViewComponent,
    StatusComponent,
    ScheduleInterviewComponent,
    SkillsCandidateViewComponent,
    JobCandidateLinkComponent,
    InterviewTabComponent,
    AddcandidatedocumentdetailComponent,
    AppcandidatepopupsdetailsComponent,
    DocumentTypeComponent, HiringStatusComponent,
    InterviewTypeComponent,
    InterviewProcessAppComponent,
    RatingTypeComponent,
    JobUniqueDetailComponent,
    CandidateUniqueDetailComponent,
    VideoCallCandidateComponent,
    ResumePreviewComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe,
    RemoveSpecialCharactersPipe,
    FetchSizedAndCachedImagePipe,
    JobStatusFilterPipe,
    AssigneefilterPipe,
    HiringManagerfilterPipe,
    ManagerFilterPipe,
    SortByComparatorPipe,
    JobStatusColorFilterPipe,
    JobResponsibleFilterPipe,
    Time24to12Format,
    CookieService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})
export class RecruitmentmanagementAppModule {
}
