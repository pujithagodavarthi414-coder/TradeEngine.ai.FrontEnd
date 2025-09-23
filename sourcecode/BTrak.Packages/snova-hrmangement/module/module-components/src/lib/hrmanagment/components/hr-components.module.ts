import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule} from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { LightboxModule } from 'ngx-lightbox';
import { DatePipe } from '@angular/common';
import { FormioModule } from "angular-formio"

import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ShiftBranchFilterPipe } from '../pipes/shitBranchFilter.pipes';
import { NgxMaskModule } from 'ngx-mask';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { EmployeeDetailsViewPageComponent } from '../containers/employee-details-view.page';
import { EmployeeDetailsPageComponent } from '../containers/employee-details.page';
import { NgFloatingActionButtonComponent } from './ng-floating-button/ng-floating-action-button.component';
import { NgFloatingActionMenuComponent } from './ng-floating-button/ng-floating-action-menu.component';
import { AddBankDetailsComponent } from './employee/add-bank-details.component';
import { AddContractDetailsComponent } from './employee/add-contract-details.component';
import { AddDependentDetailsComponent } from './employee/add-dependent-details.component';
import { AddImmigrationDetailsComponent } from './employee/add-immigration-details.component';
import { EmployeeImmigrationDetailsComponent } from './employee/employee-immigration-details.component';
import { EmployeeDependentDetailsComponent } from './employee/employee-dependent-details.component';
import { EmployeeWorkExperienceDetailsComponent } from './employee/employee-work-experience-details.component';
import { AddWorkExperienceDetailsComponent } from './employee/add-work-experience-details.component';
import { AddEducationDetailsComponent } from './employee/add-education-details.component';
import { EmployeeEducationDetailsComponent } from './employee/employee-education-details.component';
import { AddLanguageDetailsComponent } from './employee/add-language-details.component';
import { EmployeeLanguageDetailsComponent } from './employee/employee-language-details.component';
import { AddMembershipDetailsComponent } from './employee/add-membership-details.component';
import { AddEmergencyContactsComponent } from './employee/add-emergency-contacts.component';
import { EmployeeMembershipDetailsComponent } from './employee/employee-membership-details.component';
import { AddSkillDetailsComponent } from './employee/add-skill-details.component';
import { EmployeeSkillDetailsComponent } from './employee/employee-skill-details.component';
import { ViewEmployeeContactDetailsComponent } from './employee/view-employee-contact-details.component';
import { ViewEmployeePersonalDetailsComponent } from './employee/view-employee-personal-details.component';
import { EmployeeJobDetailsComponent } from './employee/employee-job-details.component';
import { EmployeeSalaryDetailsComponent } from './employee/employee-salary-details.component';
import { AddSalaryDetailsComponent } from './employee/add-salary-details.component';
import { EmployeeContractDetailsComponent } from './employee/employee-contract-details.component';
import { EmployeeBankDetailsComponent } from './employee/employee-bank-details.component';
import { ViewEmployeeJobDetailsComponent } from './employee/view-employee-job-details';
import { EmployeeLicenseDetailsComponent } from './employee/licence-details.component';
import { EmployeeRateSheetDetailsComponent } from './employee/employee-ratesheet-details.component';
import { ReportToComponent } from './employee/report-to.component';
import { EmployeeQualificationDetailsComponent } from './employee/employee-qualification-details.component';
import { EmployeeShiftDetailsComponent } from './employee/employee-shift-details.component';
import { FetchSizedAndCachedImagePipe } from '../pipes/fetchSizedAndCachedImage.pipe';
import { RemoveSpecialCharactersPipe } from '../pipes/removeSpecialCharacters.pipe';
import { AddLicenceDetailsComponent } from './employee/add-licence-details.component';
import { AddReportToComponent } from './employee/add-report-to.component';
import { AddRateSheetDetailsComponent } from './employee/add-ratesheet-details.component';
import { AnnoucementDialogComponent } from './employee/announcement-dialog.component';
import { DocumentTemplateDetailsComponent } from './employee/document-template-details.component';
import { EmployeeAnnouncementComponent } from './employee/employee-announcement.component';
import { EmployeeBadgeComponent } from './employee/employee-badges.component';
import { EmployeeDetailsHistory } from './employee/employee-details-history';
import { UpsertEmployeePersonalDetailsComponent } from './employee/employee-personal-details.component';
import { EmployeeShiftDialogComponent } from './employee/employee-shift-dialog.component';
import { EmployeeShifViewComponent } from './employee/employee-shift-view-details';
import { OrganizationChartComponent } from './employee/organization-chart.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { NgxDropzoneModule } from "ngx-dropzone";
import { SanitizeHtmlPipe } from '../pipes/sanitize.pipe';
import { UtcToLocalTimePipe } from '../pipes/utctolocaltime.pipe';
import { SelectAllComponent } from './select-all/select-all.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { TimeagoModule } from "ngx-timeago";
import { UtcToLocalTimeWithDatePipe } from '../pipes/utctolocaltimewithdate.pipe';
import { UserManagementComponent } from './usermanagement.component';
import { SnovasysMessageBoxModule } from "@snovasys/snova-message-box";
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { ReminderDialogComponent } from './reminders/reminder-dialog.component';
import { SignatureDialogComponent } from './signature/signature-dialog.component';
import { FileSizePipe } from '../pipes/filesize-pipe';
import { EmployeeContactDetailsComponent } from './employee/employee-contact-details.component';
import { ReminderComponent } from './reminders/reminder.component';
import { SignatureBaseComponent } from './signature/signature-base.component';
import { SignatureInviteeDialogComponent } from './signature/signature-invitee-dialog.component';
import { SignatureComponent } from './signature/signature.component';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SignaturePadModule } from "angular2-signaturepad";
import { EmployeeSignatureComponent } from './signature/employee-signature-invitations.component';
import { CustomFieldsComponentModule } from '@snovasys/snova-custom-fields';
import { SnovasysAvatarModule } from  '@snovasys/snova-avatar';    
import {DropZoneModule} from '@snovasys/snova-file-uploader';
import { TakeHomeAmountDialog } from './employee/takehomeamount-dialog.component';
import '@progress/kendo-ui';
import { MobileNumberDirective } from '../directives/mobile-number.directive';
import { SkillExperienceDirective } from '../directives/skill-experience.directive';
// import { DataBindingService, DiagramAllModule, DiagramModule, HierarchicalTreeService } from '@syncfusion/ej2-angular-diagrams';


export const COMPONENTS = [ShiftBranchFilterPipe, SoftLabelPipe, EmployeeDetailsViewPageComponent, EmployeeDetailsPageComponent,
  NgFloatingActionButtonComponent, NgFloatingActionMenuComponent, AddBankDetailsComponent, AddContractDetailsComponent, AddDependentDetailsComponent,
  AddImmigrationDetailsComponent,
  EmployeeImmigrationDetailsComponent,
  EmployeeDependentDetailsComponent,
  EmployeeWorkExperienceDetailsComponent,
  AddWorkExperienceDetailsComponent,
  AddEducationDetailsComponent,
  EmployeeEducationDetailsComponent,
  AddLanguageDetailsComponent,
  EmployeeLanguageDetailsComponent,
  AddMembershipDetailsComponent,
  AddEmergencyContactsComponent,
  EmployeeMembershipDetailsComponent,
  AddSkillDetailsComponent,
  EmployeeSkillDetailsComponent,
  ViewEmployeeContactDetailsComponent,
  ViewEmployeePersonalDetailsComponent,
  EmployeeJobDetailsComponent,
  EmployeeSalaryDetailsComponent,
  AddSalaryDetailsComponent,
  AddContractDetailsComponent,
  EmployeeContractDetailsComponent,
  EmployeeBankDetailsComponent,
  AddBankDetailsComponent,
  ViewEmployeeJobDetailsComponent,
  EmployeeDetailsViewPageComponent,
  EmployeeLicenseDetailsComponent,
  EmployeeRateSheetDetailsComponent,
  ReportToComponent,
  EmployeeQualificationDetailsComponent,
  EmployeeShiftDetailsComponent,
  FetchSizedAndCachedImagePipe,
  RemoveSpecialCharactersPipe,
  AddLicenceDetailsComponent,
  AddReportToComponent,
  AddRateSheetDetailsComponent,
  AnnoucementDialogComponent,
  DocumentTemplateDetailsComponent,
  EmployeeAnnouncementComponent,
  EmployeeBadgeComponent,
  EmployeeDetailsHistory,
  UpsertEmployeePersonalDetailsComponent,
  EmployeeShiftDialogComponent,
  EmployeeShifViewComponent,
  OrganizationChartComponent,
  SanitizeHtmlPipe,
  UtcToLocalTimePipe,
  SelectAllComponent,
  UtcToLocalTimeWithDatePipe,
  UserManagementComponent,
  TakeHomeAmountDialog,
  ReminderDialogComponent,
  SignatureDialogComponent,
  FileSizePipe,
  EmployeeContactDetailsComponent,
  ReminderComponent,
  SignatureBaseComponent,
  SignatureInviteeDialogComponent,
  SignatureComponent,
  EmployeeSignatureComponent,
  CustomAppBaseComponent,
  MobileNumberDirective,
  SkillExperienceDirective
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
    MatListModule,
    MatGridListModule,
    TranslateModule,
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
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DigitOnlyModule,
    FontAwesomeModule,
    TranslateModule,
    SatPopoverModule,
    MatAutocompleteModule,
    LightboxModule,
    MatDialogModule,
    MatSlideToggleModule,
    GridModule,
    SchedulerModule,
    MatButtonToggleModule,
    NgxMaskModule.forRoot(),
    SnovasysMessageBoxModule,
    NgxGalleryModule,
    NgxDropzoneModule,
    EditorModule,
    TimeagoModule,
    MatSnackBarModule,
    RouterModule,
    SignaturePadModule,
    FormioModule,
    CustomFieldsComponentModule,
    SnovasysAvatarModule,
    DropZoneModule
    // ,DiagramModule,DiagramAllModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents:[EmployeeDetailsViewPageComponent, EmployeeDetailsPageComponent,
    NgFloatingActionButtonComponent, NgFloatingActionMenuComponent, AddBankDetailsComponent, AddContractDetailsComponent, AddDependentDetailsComponent,
    AddImmigrationDetailsComponent,
    EmployeeImmigrationDetailsComponent,
    EmployeeDependentDetailsComponent,
    EmployeeWorkExperienceDetailsComponent,
    AddWorkExperienceDetailsComponent,
    AddEducationDetailsComponent,
    EmployeeEducationDetailsComponent,
    AddLanguageDetailsComponent,
    EmployeeLanguageDetailsComponent,
    AddMembershipDetailsComponent,
    AddEmergencyContactsComponent,
    EmployeeMembershipDetailsComponent,
    AddSkillDetailsComponent,
    EmployeeSkillDetailsComponent,
    ViewEmployeeContactDetailsComponent,
    ViewEmployeePersonalDetailsComponent,
    EmployeeJobDetailsComponent,
    EmployeeSalaryDetailsComponent,
    AddSalaryDetailsComponent,
    AddContractDetailsComponent,
    EmployeeContractDetailsComponent,
    EmployeeBankDetailsComponent,
    AddBankDetailsComponent,
    ViewEmployeeJobDetailsComponent,
    EmployeeDetailsViewPageComponent,
    EmployeeLicenseDetailsComponent,
    EmployeeRateSheetDetailsComponent,
    ReportToComponent,
    EmployeeQualificationDetailsComponent,
    EmployeeShiftDetailsComponent,
    AddLicenceDetailsComponent,
    AddReportToComponent,
    AddRateSheetDetailsComponent,
    AnnoucementDialogComponent,
    DocumentTemplateDetailsComponent,
    EmployeeAnnouncementComponent,
    EmployeeBadgeComponent,
    EmployeeDetailsHistory,
    UpsertEmployeePersonalDetailsComponent,
    EmployeeShiftDialogComponent,
    EmployeeShifViewComponent,
    OrganizationChartComponent,
    SelectAllComponent,
    UserManagementComponent,
    TakeHomeAmountDialog,
    ReminderDialogComponent,
    SignatureDialogComponent,
    EmployeeContactDetailsComponent,
    ReminderComponent,
    SignatureBaseComponent,
    SignatureInviteeDialogComponent,
    SignatureComponent,
    EmployeeSignatureComponent,
    CustomAppBaseComponent],
  providers: [DatePipe, { provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: [] }, SoftLabelPipe, SanitizeHtmlPipe,
    RemoveSpecialCharactersPipe, FetchSizedAndCachedImagePipe,FileSizePipe,
    UtcToLocalTimePipe, UtcToLocalTimeWithDatePipe, CookieService
    // ,HierarchicalTreeService, DataBindingService
  ]
})
export class HrComponentsModule {

}