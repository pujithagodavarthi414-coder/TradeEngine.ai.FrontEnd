import { Component, OnInit } from "@angular/core";
import { FeatureIds } from '../constants/feature-ids';
import * as _ from "underscore";
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Component({
  template: ""
})
export class CustomAppBaseComponent implements OnInit {
  canAccess_feature_ManageRegion: boolean;
  canAccess_feature_AddOrUpdateEmployeeJob: boolean;
  canAccess_feature_ArchiveOrUnarchiveInvoice: boolean;
  canAccess_feature_ManageTimeFormat: boolean;
  canAccess_feature_ViewLeaves: boolean;
  canAccess_feature_ManageTestcaseAutomationType: boolean;
  canAccess_feature_ManagePeakHour: boolean;
  canAccess_feature_ManageEducationLevels: boolean;
  canAccess_feature_MyWork: boolean;
  canAccess_feature_Notifications: boolean;
  canAccess_feature_StatusReporting: boolean;
  canAccess_feature_AddOrUpdateAuditCategory: boolean;
  canAccess_feature_ViewEmployeeContactDetails: boolean;
  canAccess_feature_ManageMasterSettings: boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditReports: boolean;
  canAccess_feature_ViewAuditConducts: boolean;
  canAccess_feature_AddOrUpdateExpense: boolean;
  canAccess_feature_ViewBadgesAssignedToEmployee: boolean;
  canAccess_feature_HrManagement: boolean;
  canAccess_feature_TaxSlabs: boolean;
  canAccess_feature_ViewEmployeeBankDetails: boolean;
  canAccess_feature_MarkDamagedAssest: boolean;
  canAccess_feature_WorkItemsHavingOthersDependency: boolean;
  canAccess_feature_ViewPayrollReports: boolean;
  canAccess_feature_ManageDocumentTemplates: boolean;
  canAccess_feature_ManageAccessibleIpAdresses: boolean;
  canAccess_feature_ManageCompanyIntroducedByOption: boolean;
  canAccess_feature_ManageCompanyLocation: boolean;
  canAccess_feature_ManageDateFormat: boolean;

  canAccess_feature_ManageMainUseCase: boolean;
  canAccess_feature_ManageNumberFormat: boolean;
  canAccess_feature_ManageExpenseCategory: boolean;
  canAccess_feature_ManageMerchant: boolean;
  canAccess_feature_ManageBranch: boolean;
  canAccess_feature_ManageContractType: boolean;
  canAccess_feature_ManageCountry: boolean;
  canAccess_feature_ManageCurrency: boolean;
  canAccess_feature_ManageDepartment: boolean;
  canAccess_feature_ManageDesignation: boolean;
  canAccess_feature_ManageEmploymentType: boolean;
  canAccess_feature_ManageJobCategory: boolean;
  canAccess_feature_ManageLanguages: boolean;
  canAccess_feature_ManageLicenceType: boolean;
  canAccess_feature_ManageMemberships: boolean;
  canAccess_feature_MangeNationalities: boolean;
  canAccess_feature_ManagePaygrade: boolean;
  canAccess_feature_ManagePayFrequency: boolean;
  canAccess_feature_ManagePaymentMethod: boolean;
  canAccess_feature_ManagePaymentType: boolean;
  canAccess_feature_ManageRateType: boolean;
  canAccess_feature_ManageRateSheet: boolean;
  canAccess_feature_ManageReportingMethods: boolean;
  canAccess_feature_ManageShifttiming: boolean;
  canAccess_feature_ManageSkills: boolean;
  canAccess_feature_ManageSoftLabelConfigurations: boolean;
  canAccess_feature_ManageState: boolean;
  canAccess_feature_ManageTimeZone: boolean;
  canAccess_feature_ManageWebhook: boolean;
  canAccess_feature_ManageAppSettings: boolean;
  canAccess_feature_ManageTimeConfigurationSettings: boolean;
  canAccess_feature_ManageFormType: boolean;
  canAccess_feature_ManageTestcaseStatus: boolean;
  canAccess_feature_ManageTestcaseType: boolean;
  canAccess_feature_ManageButtonType: boolean;
  canAccess_feature_ManageFeedBackType: boolean;
  canAccess_feature_ManagePermissionReason: boolean;
  canAccess_feature_BoardTypeApi: boolean;
  canAccess_feature_ManageBoardTypeWorkflow: boolean;
  canAccess_feature_ManageProcessDashboardStatus: boolean;
  canAccess_feature_WorkflowManagement: boolean;
  canAccess_feature_ManageBugPriority: boolean;
  canAccess_feature_ManageGoalReplanType: boolean;
  canAccess_feature_ManageProjectType: boolean;
  canAccess_feature_ManageWorkItemReplanType: boolean;
  canAccess_feature_ManageWorkItemStatus: boolean;
  canAccess_feature_ManageWorkItemSubType: boolean;
  canAccess_feature_ManageWorkItemType: boolean;

  canAccess_feature_ViewTrainingCourses: boolean;
  canAccess_feature_EmployeeSpentTime: boolean;
  canAccess_feature_PayrollCalculationConfigurations: boolean;
  canAccess_feature_AddOrUpdateEmployeeDependentContactDetails: boolean;
  canAccess_feature_ContractPaySettings: boolean;
  canAccess_feature_AddOrUpdateAuditQuestions: boolean;
  canAccess_feature_AddOrUpdateEmployeeSkills: boolean;
  canAccess_feature_ManageExpenseManagement: boolean;
  canAccess_feature_CreateRoster: boolean;
  canAccess_feature_AssignOrUnassignTrainingCourse: boolean;
  canAccess_feature_EmployeeAccountDetails: boolean;
  canAccess_feature_EmployeeLoans: boolean;
  canAccess_feature_AbilityToChat: boolean;
  canAccess_feature_EmployeeWorkAllocation: boolean;
  canAccess_feature_ViewEmployeeShiftDetails: boolean;
  canAccess_feature_ViewEmployeeLanguageDetails: boolean;
  canAccess_feature_ManageMaritalStatuses: boolean;
  canAccess_feature_AddOrUpdateFoodItem: boolean;
  canAccess_feature_ManageHtmltemplate: boolean;
  canAccess_feature_AddOrUpdateAsset: boolean;
  canAccess_feature_AddOrEditEmployeeLoanInstallment: boolean;
  canAccess_feature_AddOrUpdateAuditReports: boolean;
  canAccess_feature_ConfigurePayrollStatus: boolean;
  canAccess_feature_UpsertCompanyDetails: boolean;
  canAccess_feature_ViewEmploymentContractDetails: boolean;
  canAccess_feature_DownloadOrShareInvoice: boolean;
  canAccess_feature_ViewAudit: boolean;
  canAccess_feature_EditMessage: boolean;
  canAccess_feature_ApproveOrRejectLeave: boolean;
  canAccess_feature_SpentTimeDetails: boolean;
  canAccess_feature_ArchiveOrUnarchiveAudit: boolean;
  canAccess_feature_ViewEmployeeWorkExperienceDetails: boolean;
  canAccess_feature_ProfessionalTaxRanges: boolean;
  canAccess_feature_EnableNotifications: boolean;
  canAccess_feature_TdsSettings: boolean;
  canAccess_feature_ViewExpenses: boolean;
  canAccess_feature_EmployeeLogtimeDetailsReport: boolean;
  canAccess_feature_CreditAmount: boolean;
  canAccess_feature_AllGoals: boolean;
  canAccess_feature_AddOrUpdateAssignmentStatus: boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditConduct: boolean;
  canAccess_feature_ViewEmployeeActivityTimeUsage: boolean;
  canAccess_feature_ProcessDashboard: boolean;
  canAccess_feature_ManageTimeSheetManagement: boolean;
  canAccess_feature_ManageCompanySettings: boolean;
  canAccess_feature_AccessTestrepo: boolean;
  canAccess_feature_CanAssignAuditTags: boolean;
  canAccess_feature_AddOrEditLeaveType: boolean;
  canAccess_feature_EveryDayTargetStatus: boolean;
  canAccess_feature_ArchiveProject: boolean;
  canAccess_feature_DirectMessaging: boolean;
  canAccess_feature_ViewStores: boolean;
  canAccess_feature_ApplyLeave: boolean;
  canAccess_feature_ManageInvoiceSchedule: boolean;
  canAccess_feature_AssignAdhocWorkToAllUsers: boolean;
  canAccess_feature_CanChangeVisualisationType: boolean;
  canAccess_feature_AddOrUpdateClient: boolean;
  canAccess_feature_AddOrUpdateInvoice: boolean;
  canAccess_feature_RecentlyPurchasedAssets: boolean;
  canAccess_feature_CanCreateReminders: boolean;
  canAccess_feature_ViewRoles: boolean;
  canAccess_feature_AddOrUpdateMasterQuestionType: boolean;
  canAccess_feature_ManageRelationShip: boolean;
  canAccess_feature_PayrollRun: boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditCategory: boolean;
  canAccess_feature_DragApps: boolean;
  canAccess_feature_ArchiveSubmittedStatusReport: boolean;
  canAccess_feature_CanViewOrganizationChart: boolean;
  canAccess_feature_DeleteCustomFieldsForHrManagement: boolean;
  canAccess_feature_EditPayslip: boolean;
  canAccess_feature_ViewEmployeeCredits: boolean;
  canAccess_feature_FinancialYearConfigurations: boolean;
  canAccess_feature_TestrepoManagement: boolean;
  canAccess_feature_DocumentManagement: boolean;
  canAccess_feature_ApproveEmployeeTaxAllowances: boolean;
  canAccess_feature_ViewEmployeeReportToDetails: boolean;
  canAccess_feature_AddOrEditCustomFieldsForProjectManagement: boolean;
  canAccess_feature_AddOrUpdateStatusReportingConfiguration: boolean;
  canAccess_feature_UserUpload: boolean;
  canAccess_feature_LateEmployee: boolean;
  canAccess_feature_ViewEmployeeLoanInstallment: boolean;
  canAccess_feature_ViewEmployeeMembershipDetails: boolean;
  canAccess_feature_RecentlyAssignedAssets: boolean;
  canAccess_feature_EmployeesCurrentWorkingOrBacklogWorkItems: boolean;
  canAccess_feature_ViewStatusReports: boolean;
  canAccess_feature_ResignationStatus: boolean;
  canAccess_feature_Venue: boolean;
  canAccess_feature_ViewRoomTemperature: boolean;
  canAccess_feature_UpdateFoodOrder: boolean;
  canAccess_feature_CanSubmitCustomFieldsForHrManagement: boolean;
  canAccess_feature_ArchiveOrUnarchiveEstimate: boolean;
  canAccess_feature_ManageLeavesManagement: boolean;
  canAccess_feature_AddOrUpdateChannel: boolean;
  canAccess_feature_ViewForms: boolean;
  canAccess_feature_CanteenManagement: boolean;
  canAccess_feature_ProjectsActivelyRunningGoals: boolean;
  canAccess_feature_AddOrUpdateEmployeeImmigration: boolean;
  canAccess_feature_AlternateSignIn: boolean;
  canAccess_feature_ManageActivityTracker: boolean;
  canAccess_feature_RecentlyDamagedAssets: boolean;
  canAccess_feature_AssetHistory: boolean;
  canAccess_feature_ProjectManagement: boolean;
  canAccess_feature_ManageAppsAndUrls: boolean;
  canAccess_feature_AddOrUpdateEmployeeBankDetails: boolean;
  canAccess_feature_ArchiveForm: boolean;
  canAccess_feature_ShareExpense: boolean;
  canAccess_feature_ManageSystemApps: boolean;
  canAccess_feature_BookingManagement: boolean;
  canAccess_feature_GoalLevelReports: boolean;
  canAccess_feature_ViewEmployeeEducationDetails: boolean;
  canAccess_feature_ManageLeaveStatus: boolean;
  canAccess_feature_ArchiveUser: boolean;
  canAccess_feature_ViewTrackedInformationOfUserstory: boolean;
  canAccess_feature_AddUser: boolean;
  canAccess_feature_LeaveManagement: boolean;
  canAccess_feature_ViewProjects: boolean;
  canAccess_feature_ApproveOrRejectTimesheet: boolean;
  canAccess_feature_RoleManagement: boolean;
  canAccess_feature_CopyOrMoveQuestions: boolean;
  canAccess_feature_ManageCustomFormSubmissions: boolean;
  canAccess_feature_ViewLocations: boolean;
  canAccess_feature_ManageInductionWork: boolean;
  canAccess_feature_ViewAllEmployeeActivityReports: boolean;
  canAccess_feature_DownloadEmployeeSalaryCertificate: boolean;
  canAccess_feature_ManageTestrepoManagement: boolean;
  canAccess_feature_ManageCompanyStructure: boolean;
  canAccess_feature_ViewRecentlyActiveClients: boolean;
  canAccess_feature_ManageRoster: boolean;
  canAccess_feature_EmployeeWorkLogReport: boolean;
  canAccess_feature_DownloadOrShareAuditReports: boolean;
  canAccess_feature_ConfigureWebhooks: boolean;
  canAccess_feature_ManageStoreManagement: boolean;
  canAccess_feature_AddOrUpdateProduct: boolean;
  canAccess_feature_CreateFolder: boolean;
  canAccess_feature_PayrollTemplateConfiguration: boolean;
  canAccess_feature_AssetsAllocatedToMe: boolean;
  canAccess_feature_EmployeeCreditorDetails: boolean;
  canAccess_feature_ApproveEmployeeLoans: boolean;
  canAccess_feature_ViewEmployeeSkillDetails: boolean;
  canAccess_feature_CanViewUsersCanteenSummary: boolean;
  canAccess_feature_WorkAllocation: boolean;
  canAccess_feature_AddPermission: boolean;
  canAccess_feature_ViewTodaysTimesheet: boolean;
  canAccess_feature_CanAssignBadgeToEmployee: boolean;
  canAccess_feature_ViewEmployeeJobDetails: boolean;
  canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails: boolean;
  canAccess_feature_DoChannelChatOnly: boolean;
  canAccess_feature_UpdatePermission: boolean;
  canAccess_feature_Security: boolean;
  canAccess_feature_SubmitStatusReport: boolean;
  canAccess_feature_Audit: boolean;
  canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails: boolean;
  canAccess_feature_BugReport: boolean;
  canAccess_feature_TaxAllowance: boolean;
  canAccess_feature_AssetComment: boolean;
  canAccess_feature_ViewEmployeeDependentContactDetails: boolean;
  canAccess_feature_PurchaseFoodItem: boolean;
  canAccess_feature_ViewTrainingAssignments: boolean;
  canAccess_feature_ViewTimesheetFeed: boolean;
  canAccess_feature_AddOrUpdateEmployeeReportingToDetails: boolean;
  canAccess_feature_PayrollRoleConfiguration: boolean;
  canAccess_feature_DashboardManagement: boolean;
  canAccess_feature_WorkItemsHavingDependencyOnMe: boolean;
  canAccess_feature_AddOrUpdateEmployeeEducationDetails: boolean;
  canAccess_feature_ArchiveRole: boolean;
  canAccess_feature_TimeSheetManagement: boolean;
  canAccess_feature_AddOrUpdateApplications: boolean;
  canAccess_feature_PublishAsDefault: boolean;
  canAccess_feature_ViewMasterQuestionTypes: boolean;
  canAccess_feature_ViewProductDetails: boolean;
  canAccess_feature_DeleteCustomFieldsForProjectManagement: boolean;
  canAccess_feature_ManageAuthorization: boolean;
  canAccess_feature_ManageCustomApps: boolean;
  canAccess_feature_FoodItemsList: boolean;
  canAccess_feature_AddOrUpdateForm: boolean;
  canAccess_feature_ArchiveAdhocWork: boolean;
  canAccess_feature_ManageLeaveSession: boolean;
  canAccess_feature_WorkItemUpload: boolean;
  canAccess_feature_CanApprovePerformance: boolean;
  canAccess_feature_AddOrUpdateLocation: boolean;
  canAccess_feature_ManageRestrictionType: boolean;
  canAccess_feature_ManageLeaveFormula: boolean;
  canAccess_feature_EmployeeWorkItems: boolean;
  canAccess_feature_BillingManagement: boolean;
  canAccess_feature_EditDashboard: boolean;
  canAccess_feature_ViewTrainingMatrix: boolean;
  canAccess_feature_ManageAppFilters: boolean;
  canAccess_feature_ManageLeaveType: boolean;
  canAccess_feature_ArchiveStatusReportConfiguration: boolean;
  canAccess_feature_ResetPassword: boolean;
  canAccess_feature_EditRoster: boolean;
  canAccess_feature_AbilityToCreatePublicProject: boolean;
  canAccess_feature_PayrollMaritalStatusConfiguration: boolean;
  canAccess_feature_AddProject: boolean;
  canAccess_feature_AddOrUpdateEmployeeJobDetails: boolean;
  canAccess_feature_AddOrUpdateAdhocWork: boolean;
  canAccess_feature_ForgotPassword: boolean;
  canAccess_feature_LogTimeReport: boolean;
  canAccess_feature_DeleteDashboard: boolean;
  canAccess_feature_ViewQuestionTypes: boolean;
  canAccess_feature_ViewHistoricalTimesheet: boolean;
  canAccess_feature_WorkItemsWaitingForQaApproval: boolean;
  canAccess_feature_InviteeForSignature: boolean;
  canAccess_feature_AddOrUpdateRole: boolean;
  canAccess_feature_CanCloneAudit: boolean;
  canAccess_feature_ArchiveTrainingCourse: boolean;
  canAccess_feature_PunchCard: boolean;
  canAccess_feature_ManageActivityConfig: boolean;
  canAccess_feature_OrganizationChart: boolean;
  canAccess_feature_DashboardMenuItem: boolean;
  canAccess_feature_FeatureUsageReport: boolean;
  canAccess_feature_ActivityTracker: boolean;
  canAccess_feature_DeleteGoalFilter: boolean;
  canAccess_feature_EmployeePresence: boolean;
  canAccess_feature_ManageProjectManagement: boolean;
  canAccess_feature_ManageField: boolean;
  canAccess_feature_ViewApplicationUsageReports: boolean;
  canAccess_feature_AddOrUpdateTimesheetentry: boolean;
  canAccess_feature_AddOrUpdateEmployeePersonalDetails: boolean;
  canAccess_feature_AddOrUpdateQuestionType: boolean;
  canAccess_feature_ViewFiles: boolean;
  canAccess_feature_AddOrUpdateAuditConduct: boolean;
  canAccess_feature_EmployeePayrollDetails: boolean;
  canAccess_feature_ManageBadges: boolean;
  canAccess_feature_LeaveTypeConfiguration: boolean;
  canAccess_feature_ManagePayrollComponent: boolean;
  canAccess_feature_CanEditOtherEmployeeDetails: boolean;
  canAccess_feature_Authorisation: boolean;
  canAccess_feature_ArchiveExpense: boolean;
  canAccess_feature_ReviewFile: boolean;
  canAccess_feature_HourlyTdsConfiguration: boolean;
  canAccess_feature_ViewEmployeeSalaryDetails: boolean;
  canAccess_feature_ManageGender: boolean;
  canAccess_feature_AppManagement: boolean;
  canAccess_feature_CanPassAnAnnouncement: boolean;
  canAccess_feature_AllFoodOrders: boolean;
  canAccess_feature_AddOrUpdateEmployeeLicenceDetails: boolean;
  canAccess_feature_CanSubmitCustomFieldsForProjectManagement: boolean;
  canAccess_feature_CanViewAuditNonComplainceReport: boolean;
  canAccess_feature_ViewTestrepoReports: boolean;
  canAccess_feature_MyAdhocWork: boolean;
  canAccess_feature_ViewEmployeePersonalDetails: boolean;
  canAccess_feature_ApplyLeaveOnBehalfOfOthers: boolean;
  canAccess_feature_PayrollManagement: boolean;
  canAccess_feature_AddOrUpdateVendor: boolean;
  canAccess_feature_EmployeeWorkingDays: boolean;
  canAccess_feature_BillAmountOnDailyBasis: boolean;
  canAccess_feature_FoodOrdersManagement: boolean;
  canAccess_feature_ArchiveOrUnarchiveAuditQuestions: boolean;
  canAccess_feature_ViewCompanyWideLeaves: boolean;
  canAccess_feature_UnarchiveProject: boolean;
  canAccess_feature_ViewEmployeeImmigrationDetails: boolean;
  canAccess_feature_UpdateUser: boolean;
  canAccess_feature_ViewEmployeeLicenceDetails: boolean;
  canAccess_feature_ParkAdhocWork: boolean;
  canAccess_feature_DeleteLeave: boolean;
  canAccess_feature_ArchiveOrUnarchiveQuestionType: boolean;
  canAccess_feature_SelectLogTimeReport: boolean;
  canAccess_feature_EmployeeIndex: boolean;
  canAccess_feature_RecentIndividualFoodOrders: boolean;
  canAccess_feature_ManageActivityDashboard: boolean;
  canAccess_feature_AssetManagement: boolean;
  canAccess_feature_Chat: boolean;
  canAccess_feature_ManageImportOrExportClient: boolean;
  canAccess_feature_ViewAuditActions: boolean;
  canAccess_feature_GoalsToArchive: boolean;
  canAccess_feature_AddOrUpdateEmployeeLanguages: boolean;
  canAccess_feature_ActivelyRunningGoals: boolean;
  canAccess_feature_AllGoalsWithAdvancedSearch: boolean;
  canAccess_feature_HideDashboard: boolean;
  canAccess_feature_SubmitTimesheet: boolean;
  canAccess_feature_PayrollGenderConfiguration: boolean;
  canAccess_feature_ApproveOrRejectExpense: boolean;
  canAccess_feature_ViewEstimate: boolean;
  canAccess_feature_CanteenPurchasesSummary: boolean;
  canAccess_feature_ViewVendors: boolean;
  canAccess_feature_ViewUsers: boolean;
  canAccess_feature_ViewInvoice: boolean;
  canAccess_feature_LeavesReport: boolean;
  canAccess_feature_AddOrUpdateEmployeeSalaryDetails: boolean;
  canAccess_feature_ViewEmployeeWebAppUsage: boolean;
  canAccess_feature_ViewRoster: boolean;
  canAccess_feature_ManageFeedback: boolean;
  canAccess_feature_OffersCreditedToUsersSummary: boolean;
  canAccess_feature_QaPerformance: boolean;
  canAccess_feature_AllowanceTime: boolean;
  canAccess_feature_AddOrUpdateAudit: boolean;
  canAccess_feature_ManageProjectRolePermissions: boolean;
  canAccess_feature_AddDashboard: boolean;
  canAccess_feature_AddOrUpdateTrainingCourse: boolean;
  canAccess_feature_ResetOthersPassword: boolean;
  canAccess_feature_ManageEmployeeRatesheet: boolean;
  canAccess_feature_AddOrUpdateEmployeeContactDetails: boolean;
  canAccess_feature_ViewAllEmployees: boolean;
  canAccess_feature_LeaveEncashmentSettings: boolean;
  canAccess_feature_ViewEmployeeEmergencyContactDetails: boolean;
  canAccess_feature_ConfigureEmployeePayrollTemplates: boolean;
  canAccess_feature_ViewApplications: boolean;
  canAccess_feature_ConfigureEmployeeTracking: boolean;
  canAccess_feature_UserHistoricalReport: boolean;
  canAccess_feature_ViewUserStatusHistory: boolean;
  canAccess_feature_ManageActivityScreenshots: boolean;
  canAccess_feature_ManageSubscriptionPaidBy: boolean;
  canAccess_feature_ConductForm: boolean;
  canAccess_feature_LateEmployeesCountVsDate: boolean;
  canAccess_feature_AssignAssetsToEmployee: boolean;
  canAccess_feature_EmployeeAttendence: boolean;
  canAccess_feature_ActivityReport: boolean;
  canAccess_feature_DevQuality: boolean;
  canAccess_feature_ApproveRoster: boolean;
  canAccess_feature_ViewFeedback: boolean;
  canAccess_feature_ImminentDeadlines: boolean;
  canAccess_feature_ArchiveMessage: boolean;
  canAccess_feature_ArchiveOrUnarchiveMasterQuestionType: boolean;
  canAccess_feature_RoomTemperature: boolean;
  canAccess_feature_ViewOrManageInvoiceStatus: boolean;
  canAccess_feature_ManagePayrollTemplate: boolean;
  canAccess_feature_ViewAuditReports: boolean;
  canAccess_feature_EditStores: boolean;
  canAccess_feature_ViewAssetsWithAdvancedSearch: boolean;
  canAccess_feature_ViewPermissions: boolean;
  canAccess_feature_Applications: boolean;
  canAccess_feature_CanAnswerQuestions: boolean;
  canAccess_feature_SubmitAudit: boolean;
  canAccess_feature_PayrollBranchConfiguration: boolean;
  canAccess_feature_ConfigurePerformance: boolean;
  canAccess_feature_ViewLiveDashboard: boolean;
  canAccess_feature_AddFoodOrder: boolean;
  canAccess_feature_PayrollRunEmployee: boolean;
  canAccess_feature_ViewEmployeeAppTrackerCompleteReport: boolean;
  canAccess_feature_ManageHrManagement: boolean;
  canAccess_feature_EmployeeTaxAllowanceDetails: boolean;
  canAccess_feature_ViewStatusReportingConfiguration: boolean;
  canAccess_feature_EmployeeBonus: boolean;
  canAccess_feature_AddOrUpdateEmployeeShifts: boolean;
  canAccess_feature_ViewAllAdhocWorks: boolean;
  canAccess_feature_EmployeeResignation: boolean;
  canAccess_feature_AddOrEditCustomFieldsForHrManagement: boolean;
  canAccess_feature_ViewFoodOrders: boolean;
  canAccess_feature_AddOrUpdateEstimate: boolean;
  canAccess_feature_DaysOfWeekConfiguration: boolean;
  canAccess_feature_CanAccessPerformance: boolean;
  canAccess_feature_ViewOverallAuditActivity: boolean;
  canAccess_feature_PayrollFrequency: boolean;
  canAccess_feature_ViewMonthlyPayrollDetails: boolean;
  canAccess_feature_SnapLiveDashboard: boolean;
  canAccess_feature_ViewAuditConductTimelineReport: boolean;
  canAccess_feature_ManageHoliday: boolean;
  canAccess_feature_AddOrUpdateEmploymentContract: boolean;
  canAccess_feature_ViewListOfAssets: boolean;
  canAccess_feature_CanViewAuditComplainceReport: boolean;
  canAccess_feature_ManageDashboards: boolean;
  canAccess_feature_CanViewNumberOfAuditsSubmitted: boolean;
  canAccess_feature_TrainingManagement: boolean;
  canAccess_feature_UploadFiles: boolean;
  canAccess_feature_WorkAllocationSummary: boolean;
  canAccess_feature_AddOrUpdateEmployeeMemberships: boolean;
  canAccess_feature_ViewMyWorkWithAdvancedSearch: boolean;
  canAccess_feature_ViewCompanyDetails: boolean;
  canAccess_feature_ChatFileUpload: boolean;
  canAccess_feature_MyProjectWork: boolean;
  canAccess_feature_DeletePermissions: boolean;
  canAccess_feature_ViewTrainingRecord: boolean;
  canAccess_feature_LinkJobOpeningToCandidate: boolean;
  canAccess_feature_LinkCandidateToJobOpening: boolean;



  // Recruitment
  canAccess_feature_ManageDocumentTypes: boolean;
  canAccess_feature_ManageInterviewRatingTypes: boolean;
  canAccess_feature_ManageHiringStatus: boolean;
  canAccess_feature_ArchiveJobOpening: boolean;
  canAccess_feature_LinkInterviewProcess: boolean;
  canAccess_feature_AddInterviewProcess: boolean;
  canAccess_feature_ViewCandidateDocuments: boolean;
  canAccess_feature_ViewCandidateSkills: boolean;
  canAccess_feature_ViewCandidateJobs: boolean;
  canAccess_feature_ViewJobOpeningStatus: boolean;
  canAccess_feature_AddorEditJobOpeningStatus: boolean;
  canAccess_feature_ArchiveJobOpeningStatus: boolean;
  canAccess_feature_ViewCandidates: boolean;
  canAccess_feature_AddCandidateDetails: boolean;
  canAccess_feature_EditCandidateDetails: boolean;
  canAccess_feature_AddorEditJobOpening: boolean;

  canAccess_feature_ManageCandidateDocuments: boolean;
  canAccess_feature_ManageCancelInterviewSchedule: boolean;
  canAccess_feature_ManageInterviewReschedule: boolean;
  canAccess_feature_AddInterviewSchedule: boolean;
  canAccess_feature_Managesources: boolean;
  canAccess_feature_ManageInterviewType: boolean;
  canAccess_feature_ViewCandidateExperience: boolean;
  canAccess_feature_Viewjobopening: boolean;
  canAccess_feature_ArchiveCandidate: boolean;
  canAccess_feature_ViewCandidateEducationDetails: boolean;
  canAccess_feature_ViewCandidateHistory: boolean;
  canAccess_feature_Addsources: boolean;
  canAccess_feature_ConvertCamdidateToEmployee: boolean;
  canAccess_feature_HiredDocuments: boolean;
  
  

  canAccess_feature_ViewScheduleConfirmation:boolean;
  canAccess_feature_ViewInterviewFeedback:boolean;
  canAccess_feature_SendOfferLetter: boolean;
  canAccess_feature_ViewRecruitmentSchedule: boolean;
  canAccess_feature_ViewCandidateBryntumSchedule: boolean;
  ngOnInit(): void {
    var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_ManageRegion = _.find(roles, function(role: any) {
       return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRegion.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeJob = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeJob.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveInvoice = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewLeaves = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewLeaves.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseAutomationType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseAutomationType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePeakHour = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePeakHour.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEducationLevels = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEducationLevels.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MyWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MyWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Notifications = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Notifications.toString().toLowerCase(); }) != null;
    this.canAccess_feature_StatusReporting = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_StatusReporting.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMasterSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMasterSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditConducts = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditConducts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateExpense = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewBadgesAssignedToEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewBadgesAssignedToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_HrManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_HrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TaxSlabs = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TaxSlabs.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeBankDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeBankDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MarkDamagedAssest = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MarkDamagedAssest.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkItemsHavingOthersDependency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemsHavingOthersDependency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewPayrollReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewPayrollReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDocumentTemplates = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDocumentTemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingCourses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingCourses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeSpentTime = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeSpentTime.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentMethod = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentMethod.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollCalculationConfigurations = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollCalculationConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeDependentContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeDependentContactDetails.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_ContractPaySettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ContractPaySettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditQuestions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeSkills = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeSkills.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreateRoster = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CreateRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLicenceType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLicenceType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignOrUnassignTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssignOrUnassignTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeAccountDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeAccountDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeLoans = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeLoans.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AbilityToChat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AbilityToChat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeWorkAllocation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeWorkAllocation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeShiftDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeShiftDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLanguageDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLanguageDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBranch = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBranch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMaritalStatuses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMaritalStatuses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateFoodItem = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateFoodItem.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageHtmltemplate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageHtmltemplate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateSheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateSheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAsset = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAsset.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditEmployeeLoanInstallment = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditEmployeeLoanInstallment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDateFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDateFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigurePayrollStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigurePayrollStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpsertCompanyDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UpsertCompanyDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmploymentContractDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmploymentContractDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DownloadOrShareInvoice = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DownloadOrShareInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAudit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAudit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditMessage = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditMessage.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectLeave = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectLeave.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SpentTimeDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SpentTimeDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAudit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAudit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBugPriority = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBugPriority.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeWorkExperienceDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeWorkExperienceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProfessionalTaxRanges = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ProfessionalTaxRanges.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EnableNotifications = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EnableNotifications.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TdsSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TdsSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCountry = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCountry.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewExpenses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewExpenses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeLogtimeDetailsReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeLogtimeDetailsReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreditAmount = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CreditAmount.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllGoals = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AllGoals.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAssignmentStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAssignmentStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditConduct = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditConduct.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeActivityTimeUsage = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeActivityTimeUsage.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProcessDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ProcessDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeSheetManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeSheetManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanySettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanySettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AccessTestrepo = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AccessTestrepo.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanAssignAuditTags = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanAssignAuditTags.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditLeaveType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditLeaveType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EveryDayTargetStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EveryDayTargetStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveProject = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DirectMessaging = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DirectMessaging.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewStores = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStores.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApplyLeave = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApplyLeave.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInvoiceSchedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInvoiceSchedule.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignAdhocWorkToAllUsers = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssignAdhocWorkToAllUsers.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePermissionReason = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePermissionReason.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanChangeVisualisationType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanChangeVisualisationType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateClient = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateClient.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateInvoice = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RecentlyPurchasedAssets = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RecentlyPurchasedAssets.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanCreateReminders = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanCreateReminders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaygrade = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaygrade.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRoles = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRoles.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateMasterQuestionType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateMasterQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRelationShip = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRelationShip.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRun = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRun.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DragApps = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveSubmittedStatusReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveSubmittedStatusReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewOrganizationChart = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewOrganizationChart.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteCustomFieldsForHrManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteCustomFieldsForHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditPayslip = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditPayslip.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeCredits = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeCredits.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FinancialYearConfigurations = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_FinancialYearConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TestrepoManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TestrepoManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DocumentManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DocumentManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveEmployeeTaxAllowances = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveEmployeeTaxAllowances.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeReportToDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeReportToDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForProjectManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForProjectManagement.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_AddOrUpdateStatusReportingConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateStatusReportingConfiguration.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_UserUpload = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UserUpload.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LateEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LateEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLoanInstallment = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLoanInstallment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeMembershipDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeMembershipDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RecentlyAssignedAssets = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RecentlyAssignedAssets.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeesCurrentWorkingOrBacklogWorkItems = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeesCurrentWorkingOrBacklogWorkItems.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_ViewStatusReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStatusReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ResignationStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ResignationStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Venue = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Venue.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageButtonType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageButtonType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRoomTemperature = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRoomTemperature.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdateFoodOrder = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UpdateFoodOrder.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCurrency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCurrency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanSubmitCustomFieldsForHrManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveEstimate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeavesManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeavesManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateChannel = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateChannel.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewForms = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewForms.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanteenManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanteenManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProcessDashboardStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProcessDashboardStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProjectsActivelyRunningGoals = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ProjectsActivelyRunningGoals.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeImmigration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeImmigration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AlternateSignIn = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AlternateSignIn.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageActivityTracker = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageActivityTracker.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RecentlyDamagedAssets = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RecentlyDamagedAssets.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDesignation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDesignation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssetHistory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssetHistory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ProjectManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAppsAndUrls = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAppsAndUrls.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemSubType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemSubType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeBankDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeBankDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkflowManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkflowManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveForm = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveForm.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ShareExpense = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ShareExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSystemApps = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSystemApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BookingManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BookingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_GoalLevelReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_GoalLevelReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeEducationDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeEducationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BoardTypeApi = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BoardTypeApi.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeaveStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeaveStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemReplanType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemReplanType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveUser = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveUser.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrackedInformationOfUserstory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrackedInformationOfUserstory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddUser = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddUser.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LeaveManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LeaveManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProjects = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectTimesheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RoleManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RoleManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CopyOrMoveQuestions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CopyOrMoveQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageState = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageState.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCustomFormSubmissions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCustomFormSubmissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewLocations = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewLocations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInductionWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInductionWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAllEmployeeActivityReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAllEmployeeActivityReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DownloadEmployeeSalaryCertificate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DownloadEmployeeSalaryCertificate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestrepoManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestrepoManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageFormType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageFormType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanyStructure = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanyStructure.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRecentlyActiveClients = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRecentlyActiveClients.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRoster = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeWorkLogReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeWorkLogReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DownloadOrShareAuditReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DownloadOrShareAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureWebhooks = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureWebhooks.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageStoreManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageStoreManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateProduct = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateProduct.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CreateFolder = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CreateFolder.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollTemplateConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollTemplateConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssetsAllocatedToMe = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssetsAllocatedToMe.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeCreditorDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeCreditorDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveEmployeeLoans = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveEmployeeLoans.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSkillDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSkillDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewUsersCanteenSummary = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewUsersCanteenSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkAllocation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkAllocation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWebhook = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWebhook.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddPermission = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddPermission.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTodaysTimesheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTodaysTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanAssignBadgeToEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanAssignBadgeToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageReportingMethods = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageReportingMethods.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageFeedBackType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageFeedBackType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeJobDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeJobDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeWorkExperienceDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeWorkExperienceDetails.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_DoChannelChatOnly = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DoChannelChatOnly.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdatePermission = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UpdatePermission.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Security = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Security.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SubmitStatusReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SubmitStatusReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Audit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Audit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeEmergencyContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeEmergencyContactDetails.toString().toLowerCase();
     }) != null;
    this.canAccess_feature_BugReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BugReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TaxAllowance = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TaxAllowance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssetComment = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssetComment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeDependentContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeDependentContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PurchaseFoodItem = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PurchaseFoodItem.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingAssignments = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingAssignments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTimesheetFeed = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTimesheetFeed.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeReportingToDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeReportingToDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRoleConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRoleConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DashboardManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DashboardManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanyLocation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanyLocation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageNumberFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageNumberFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkItemsHavingDependencyOnMe = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemsHavingDependencyOnMe.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeEducationDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeEducationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveRole = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveRole.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TimeSheetManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TimeSheetManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateApplications = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateApplications.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PublishAsDefault = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMasterQuestionTypes = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMasterQuestionTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewProductDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProductDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteCustomFieldsForProjectManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAuthorization = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAuthorization.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMemberships = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMemberships.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCustomApps = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCustomApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FoodItemsList = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_FoodItemsList.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateForm = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateForm.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveAdhocWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeaveSession = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeaveSession.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAccessibleIpAdresses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAccessibleIpAdresses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkItemUpload = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemUpload.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAppSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAppSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanApprovePerformance = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanApprovePerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateLocation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateLocation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRestrictionType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRestrictionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeaveFormula = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeaveFormula.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeWorkItems = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeWorkItems.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BillingManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BillingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingMatrix = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingMatrix.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAppFilters = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAppFilters.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLeaveType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLeaveType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveStatusReportConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveStatusReportConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ResetPassword = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ResetPassword.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditRoster = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AbilityToCreatePublicProject = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AbilityToCreatePublicProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollMaritalStatusConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollMaritalStatusConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddProject = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeJobDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeJobDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEmploymentType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEmploymentType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAdhocWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ForgotPassword = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ForgotPassword.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LogTimeReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LogTimeReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewQuestionTypes = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewQuestionTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewHistoricalTimesheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewHistoricalTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkItemsWaitingForQaApproval = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemsWaitingForQaApproval.toString().toLowerCase(); }) != null;
    this.canAccess_feature_InviteeForSignature = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_InviteeForSignature.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateRole = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateRole.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanCloneAudit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanCloneAudit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PunchCard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PunchCard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageActivityConfig = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageActivityConfig.toString().toLowerCase(); }) != null;
    this.canAccess_feature_OrganizationChart = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_OrganizationChart.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DashboardMenuItem = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DashboardMenuItem.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FeatureUsageReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_FeatureUsageReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ActivityTracker = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ActivityTracker.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteGoalFilter = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteGoalFilter.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeePresence = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeePresence.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayFrequency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayFrequency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageField = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageField.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewApplicationUsageReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewApplicationUsageReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateTimesheetentry = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateTimesheetentry.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeePersonalDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeePersonalDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateQuestionType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewFiles = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewFiles.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAuditConduct = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAuditConduct.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeePayrollDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeePayrollDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBadges = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBadges.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LeaveTypeConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LeaveTypeConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayrollComponent = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayrollComponent.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanEditOtherEmployeeDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanEditOtherEmployeeDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Authorisation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Authorisation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveExpense = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ReviewFile = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ReviewFile.toString().toLowerCase(); }) != null;
    this.canAccess_feature_HourlyTdsConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_HourlyTdsConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeConfigurationSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeConfigurationSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeSalaryDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeSalaryDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDepartment = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDepartment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageContractType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageContractType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGender = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGender.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AppManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AppManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanPassAnAnnouncement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanPassAnAnnouncement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllFoodOrders = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AllFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeLicenceDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeLicenceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewAuditNonComplainceReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewAuditNonComplainceReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTestrepoReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTestrepoReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MyAdhocWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MyAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeePersonalDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeePersonalDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApplyLeaveOnBehalfOfOthers = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApplyLeaveOnBehalfOfOthers.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateVendor = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateVendor.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeWorkingDays = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeWorkingDays.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageJobCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageJobCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BillAmountOnDailyBasis = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BillAmountOnDailyBasis.toString().toLowerCase(); }) != null;
    this.canAccess_feature_FoodOrdersManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_FoodOrdersManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveAuditQuestions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveAuditQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCompanyWideLeaves = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCompanyWideLeaves.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UnarchiveProject = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UnarchiveProject.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeImmigrationDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeImmigrationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UpdateUser = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UpdateUser.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeLicenceDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeLicenceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ParkAdhocWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ParkAdhocWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeleteLeave = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeleteLeave.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveQuestionType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SelectLogTimeReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SelectLogTimeReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeIndex = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeIndex.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RecentIndividualFoodOrders = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RecentIndividualFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageActivityDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageActivityDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssetManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssetManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Chat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Chat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageImportOrExportClient = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageImportOrExportClient.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSoftLabelConfigurations = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSoftLabelConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditActions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditActions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_GoalsToArchive = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_GoalsToArchive.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeLanguages = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeLanguages.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ActivelyRunningGoals = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ActivelyRunningGoals.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllGoalsWithAdvancedSearch = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AllGoalsWithAdvancedSearch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_HideDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_HideDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SubmitTimesheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SubmitTimesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollGenderConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollGenderConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveOrRejectExpense = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveOrRejectExpense.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEstimate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanteenPurchasesSummary = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanteenPurchasesSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewVendors = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewVendors.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewUsers = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewUsers.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBoardTypeWorkflow = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBoardTypeWorkflow.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewInvoice = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewInvoice.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LeavesReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LeavesReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeSalaryDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeSalaryDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeWebAppUsage = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeWebAppUsage.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRoster = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageFeedback = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageFeedback.toString().toLowerCase(); }) != null;
    this.canAccess_feature_OffersCreditedToUsersSummary = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_OffersCreditedToUsersSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_QaPerformance = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_QaPerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AllowanceTime = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AllowanceTime.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAudit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAudit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectRolePermissions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectRolePermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMerchant = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMerchant.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ResetOthersPassword = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ResetOthersPassword.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEmployeeRatesheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEmployeeRatesheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAllEmployees = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAllEmployees.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LeaveEncashmentSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LeaveEncashmentSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGoalReplanType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGoalReplanType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanyIntroducedByOption = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanyIntroducedByOption.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeEmergencyContactDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeEmergencyContactDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeePayrollTemplates = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureEmployeePayrollTemplates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MangeNationalities = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MangeNationalities.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewApplications = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewApplications.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigureEmployeeTracking = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigureEmployeeTracking.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UserHistoricalReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UserHistoricalReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMainUseCase = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMainUseCase.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewUserStatusHistory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewUserStatusHistory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageActivityScreenshots = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageActivityScreenshots.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeZone = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeZone.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLanguages = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLanguages.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSubscriptionPaidBy = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSubscriptionPaidBy.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConductForm = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConductForm.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LateEmployeesCountVsDate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LateEmployeesCountVsDate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignAssetsToEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssignAssetsToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeAttendence = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeAttendence.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ActivityReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ActivityReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DevQuality = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DevQuality.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ApproveRoster = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ApproveRoster.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewFeedback = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewFeedback.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ImminentDeadlines = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ImminentDeadlines.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveMessage = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveMessage.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveOrUnarchiveMasterQuestionType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveOrUnarchiveMasterQuestionType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_RoomTemperature = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_RoomTemperature.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageShifttiming = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageShifttiming.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewOrManageInvoiceStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewOrManageInvoiceStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayrollTemplate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayrollTemplate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditReports = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditReports.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditStores = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditStores.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAssetsWithAdvancedSearch = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAssetsWithAdvancedSearch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewPermissions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewPermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Applications = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Applications.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanAnswerQuestions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanAnswerQuestions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SubmitAudit = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SubmitAudit.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollBranchConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollBranchConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConfigurePerformance = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConfigurePerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSkills = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSkills.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewLiveDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewLiveDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddFoodOrder = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddFoodOrder.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollRunEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollRunEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewEmployeeAppTrackerCompleteReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewEmployeeAppTrackerCompleteReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageHrManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeTaxAllowanceDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeTaxAllowanceDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewStatusReportingConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewStatusReportingConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeBonus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeBonus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeShifts = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeShifts.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAllAdhocWorks = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAllAdhocWorks.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EmployeeResignation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EmployeeResignation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrEditCustomFieldsForHrManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrEditCustomFieldsForHrManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewFoodOrders = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewFoodOrders.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEstimate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEstimate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DaysOfWeekConfiguration = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DaysOfWeekConfiguration.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanAccessPerformance = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanAccessPerformance.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewOverallAuditActivity = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewOverallAuditActivity.toString().toLowerCase(); }) != null;
    this.canAccess_feature_PayrollFrequency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_PayrollFrequency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMonthlyPayrollDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMonthlyPayrollDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SnapLiveDashboard = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SnapLiveDashboard.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewAuditConductTimelineReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewAuditConductTimelineReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageHoliday = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageHoliday.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmploymentContract = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmploymentContract.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewListOfAssets = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewListOfAssets.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewAuditComplainceReport = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewAuditComplainceReport.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDashboards = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDashboards.toString().toLowerCase(); }) != null;
    this.canAccess_feature_CanViewNumberOfAuditsSubmitted = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_CanViewNumberOfAuditsSubmitted.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TrainingManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TrainingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_UploadFiles = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_UploadFiles.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkAllocationSummary = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkAllocationSummary.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateEmployeeMemberships = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateEmployeeMemberships.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewMyWorkWithAdvancedSearch = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewMyWorkWithAdvancedSearch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCompanyDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCompanyDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ChatFileUpload = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ChatFileUpload.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MyProjectWork = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MyProjectWork.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DeletePermissions = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DeletePermissions.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingRecord = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingRecord.toString().toLowerCase(); }) != null;

    this.canAccess_feature_ViewTrainingCourses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingCourses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AssignOrUnassignTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AssignOrUnassignTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingAssignments = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingAssignments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingMatrix = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingMatrix.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateTrainingCourse = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateTrainingCourse.toString().toLowerCase(); }) != null;
    this.canAccess_feature_TrainingManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_TrainingManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddOrUpdateAssignmentStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddOrUpdateAssignmentStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_DragApps = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewTrainingRecord = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewTrainingRecord.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAccessibleIpAdresses = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAccessibleIpAdresses.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanyIntroducedByOption = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanyIntroducedByOption.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCompanyLocation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCompanyLocation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDateFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDateFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMainUseCase = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMainUseCase.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageNumberFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageNumberFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeFormat = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeFormat.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageExpenseCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageExpenseCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMerchant = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMerchant.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBranch = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBranch.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageContractType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageContractType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCountry = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCountry.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCurrency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCurrency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDepartment = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDepartment.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageDesignation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDesignation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEducationLevels = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEducationLevels.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageEmploymentType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageEmploymentType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageJobCategory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageJobCategory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLanguages = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLanguages.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageLicenceType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageLicenceType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageMemberships = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageMemberships.toString().toLowerCase(); }) != null;
    this.canAccess_feature_MangeNationalities = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_MangeNationalities.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaygrade = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaygrade.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePayFrequency = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePayFrequency.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentMethod = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentMethod.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePaymentType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePaymentType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePeakHour = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePeakHour.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRateSheet = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRateSheet.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageRegion = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageRegion.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageReportingMethods = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageReportingMethods.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageShifttiming = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageShifttiming.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSkills = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSkills.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageSoftLabelConfigurations = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageSoftLabelConfigurations.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageState = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageState.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeZone = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeZone.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWebhook = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWebhook.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageAppSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageAppSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTimeConfigurationSettings = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTimeConfigurationSettings.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageFormType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageFormType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseAutomationType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseAutomationType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageTestcaseType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageTestcaseType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageButtonType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageButtonType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageFeedBackType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageFeedBackType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManagePermissionReason = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManagePermissionReason.toString().toLowerCase(); }) != null;
    this.canAccess_feature_BoardTypeApi = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_BoardTypeApi.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBoardTypeWorkflow = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBoardTypeWorkflow.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProcessDashboardStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProcessDashboardStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_WorkflowManagement = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_WorkflowManagement.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageBugPriority = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageBugPriority.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageGoalReplanType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageGoalReplanType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageProjectType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageProjectType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemReplanType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemReplanType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemSubType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemSubType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageWorkItemType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageWorkItemType.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LinkJobOpeningToCandidate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LinkJobOpeningToCandidate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LinkCandidateToJobOpening = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LinkCandidateToJobOpening.toString().toLowerCase(); }) != null;
    
    //Recruitment
    this.canAccess_feature_ManageDocumentTypes = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageDocumentTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInterviewRatingTypes = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInterviewTypes.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageHiringStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageHiringStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveJobOpening = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveJobOpening.toString().toLowerCase(); }) != null;
    this.canAccess_feature_LinkInterviewProcess = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_LinkInterviewProcess.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddInterviewProcess = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddInterviewProcess.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateDocuments = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateDocuments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateSkills = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateSkills.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateJobs = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateJobs.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewJobOpeningStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewJobOpeningStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddorEditJobOpeningStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddorEditJobOpeningStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveJobOpeningStatus = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveJobOpeningStatus.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidates = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidates.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddCandidateDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddCandidateDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_EditCandidateDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_EditCandidateDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddorEditJobOpening = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddorEditJobOpening.toString().toLowerCase(); }) != null;

    this.canAccess_feature_ManageCandidateDocuments = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCandidateDocuments.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageCancelInterviewSchedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageCancelInterviewSchedule.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInterviewReschedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ManageInterviewReschedule.toString().toLowerCase(); }) != null;
    this.canAccess_feature_AddInterviewSchedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_AddInterviewSchedule.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Managesources = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Managesources.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ManageInterviewType = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Manageinterviewtype.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateExperience = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateExperience.toString().toLowerCase(); }) != null;
    this.canAccess_feature_Viewjobopening = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_Viewjobopening.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ArchiveCandidate = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ArchiveCandidate.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateEducationDetails = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateEducationDetails.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateHistory = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateHistory.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ConvertCamdidateToEmployee = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ConvertCamdidateToEmployee.toString().toLowerCase(); }) != null;
    this.canAccess_feature_HiredDocuments = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_HiredDocuments.toString().toLowerCase(); }) != null;
    
    this.canAccess_feature_ViewScheduleConfirmation = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewScheduleConfirmation.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewInterviewFeedback = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewInterviewFeedback.toString().toLowerCase(); }) != null;
    this.canAccess_feature_SendOfferLetter = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_SendOfferLetter.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewRecruitmentSchedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewRecruitmentSchedule.toString().toLowerCase(); }) != null;
    this.canAccess_feature_ViewCandidateBryntumSchedule = _.find(roles, function(role: any) {
      return role.featureId.toLowerCase() == FeatureIds.Feature_ViewCandidateBryntumSchedule.toString().toLowerCase(); }) != null;
  }


  constructor() {
    this.logNavigation();
  }

  protected logError(errorMessage: string) {

  }

  private logNavigation() {
  }
}
