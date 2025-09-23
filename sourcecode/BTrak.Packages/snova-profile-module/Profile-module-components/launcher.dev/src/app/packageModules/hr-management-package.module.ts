import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { HrmanagmentModule, AddEmergencyContactsComponent, DocumentTemplateDetailsComponent, EmployeeAnnouncementComponent, EmployeeBadgeComponent, EmployeeBankDetailsComponent, EmployeeContactDetailsComponent, EmployeeDependentDetailsComponent, EmployeeDetailsHistory, EmployeeEducationDetailsComponent, EmployeeImmigrationDetailsComponent, EmployeeJobDetailsComponent, EmployeeLanguageDetailsComponent, EmployeeMembershipDetailsComponent, UpsertEmployeePersonalDetailsComponent, EmployeeRateSheetDetailsComponent, EmployeeSalaryDetailsComponent, EmployeeShiftDetailsComponent, EmployeeSkillDetailsComponent, EmployeeWorkExperienceDetailsComponent, EmployeeLicenseDetailsComponent, OrganizationChartComponent, ReportToComponent, UserManagementComponent } from "@thetradeengineorg1/snova-hrmangement";

export class HrmanagementComponentSupplierService {

  static components =  [
    {
        name: "Employee emergency contact details",
        componentTypeObject: AddEmergencyContactsComponent
    },
    {
        name: "Document Templates",
        componentTypeObject: DocumentTemplateDetailsComponent
    },
    {
        name: "Announcements",
        componentTypeObject: EmployeeAnnouncementComponent
    },
    {
        name: "Employee badges earned",
        componentTypeObject: EmployeeBadgeComponent
    },
    {
        name: "Employee bank details",
        componentTypeObject: EmployeeBankDetailsComponent
    },
    {
        name: "Employee contact details",
        componentTypeObject: EmployeeContactDetailsComponent
    },
    {
        name: "Employee dependent details",
        componentTypeObject: EmployeeDependentDetailsComponent
    },
    {
        name: "Employee history",
        componentTypeObject: EmployeeDetailsHistory
    },
    {
        name: "Employee education details",
        componentTypeObject: EmployeeEducationDetailsComponent
    },
    {
        name: "Employee immigration details",
        componentTypeObject: EmployeeImmigrationDetailsComponent
    },
    {
        name: "Employee job details",
        componentTypeObject: EmployeeJobDetailsComponent
    },
    {
        name: "Employee language details",
        componentTypeObject: EmployeeLanguageDetailsComponent
    },
    {
        name: "Employee membership details",
        componentTypeObject: EmployeeMembershipDetailsComponent
    },
    {
        name: "Employee personal details",
        componentTypeObject: UpsertEmployeePersonalDetailsComponent
    },
    {
        name: "Employee rate sheet",
        componentTypeObject: EmployeeRateSheetDetailsComponent
    },
    {
        name: "Employee salary details",
        componentTypeObject: EmployeeSalaryDetailsComponent
    },
    {
        name: "Employee shift details",
        componentTypeObject: EmployeeShiftDetailsComponent
    },
    {
        name: "Employee skill details",
        componentTypeObject: EmployeeSkillDetailsComponent
    },
    {
        name: "Employee work experience details",
        componentTypeObject: EmployeeWorkExperienceDetailsComponent
    },
    {
        name: "Employee identification details",
        componentTypeObject: EmployeeLicenseDetailsComponent
    },
    {
        name: "Organization chart",
        componentTypeObject: OrganizationChartComponent
    },
    {
        name: "Employee report to",
        componentTypeObject: ReportToComponent
    },
    {
        name: "User management",
        componentTypeObject: UserManagementComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    HrmanagmentModule
  ]
})
export class HrmanagmentPackageModule {
  static componentService = HrmanagementComponentSupplierService;
}
