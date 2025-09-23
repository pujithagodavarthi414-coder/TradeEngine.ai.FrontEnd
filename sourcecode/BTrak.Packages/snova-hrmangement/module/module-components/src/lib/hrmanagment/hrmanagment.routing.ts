import { Routes } from "@angular/router";

import { UserManagementPageComponent } from "./containers/usermanagement.page";
import { EmployeeDetailsPageComponent } from "./containers/employee-details.page";
import { EmployeeDetailsViewPageComponent } from "./containers/employee-details-view.page";
import { EmployeeLicenseDetailsComponent } from "./components/employee/licence-details.component";
import { AddEmergencyContactsComponent } from "./components/employee/add-emergency-contacts.component";
import { EmployeeDependentDetailsComponent } from "./components/employee/employee-dependent-details.component";
import { EmployeeImmigrationDetailsComponent } from "./components/employee/employee-immigration-details.component";
import { EmployeeJobDetailsComponent } from "./components/employee/employee-job-details.component";
import { EmployeeSalaryDetailsComponent } from "./components/employee/employee-salary-details.component";
import { ReportToComponent } from "./components/employee/report-to.component";
import { EmployeeMembershipDetailsComponent } from "./components/employee/employee-membership-details.component";
import { EmployeeQualificationDetailsComponent } from "./components/employee/employee-qualification-details.component";
import { OrderDashBoardPageComponent } from "./containers/order-dashboard.page";

export const HrmanagmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "usermanagement",
        component: UserManagementPageComponent,
        data: { title: "User Management", breadcrumb: "User Management" }
      },
      // {
      //   path: "allfoodorders",
      //   component: AllFoodOrdersPageComponent,
      //   data: {
      //     title: "Food Order Management", breadcrumb: "Food Order Management"
      //   }
      // },
      {
        path: "orderdashboard",
        component: OrderDashBoardPageComponent,
        data: {
          title: "Food Order Management", breadcrumb: "Food Order Management"
        }
      },
      {
        path: 'employeedetails/:id/:tab',
        component: EmployeeDetailsViewPageComponent,
        data: { title: 'Employee details view', breadcrumb: 'Employee details view' },
        children:
          [
            {
              path: '', component: EmployeeDetailsPageComponent, data: { title: 'Employee details', breadcrumb: 'Employee details' },
              // children: [
              //   {
              //   {
              //     path: 'licence-details', component: EmployeeLicenseDetailsComponent, data: { title: 'Licence details', breadcrumb: 'Licence details' }
              //   },
              //   {
              //     path: 'emergency-details', component: AddEmergencyContactsComponent, data: { title: 'Emergency details', breadcrumb: 'Emergency details' }
              //   },
              //   {
              //     path: 'dependents', component: EmployeeDependentDetailsComponent, data: { title: 'Dependents details', breadcrumb: 'Dependents details' }
              //   },
              //   {
              //     path: 'immigration', component: EmployeeImmigrationDetailsComponent, data: { title: 'Immigration details', breadcrumb: 'Immigration details' }
              //   },
              //   {
              //     path: 'job', component: EmployeeJobDetailsComponent, data: { title: 'Job details', breadcrumb: 'Job details' }
              //   },
              //   {
              //     path: 'salary', component: EmployeeSalaryDetailsComponent, data: { title: 'Salary details', breadcrumb: 'Salary details' }
              //   },
              //   {
              //     path: 'report-to', component: ReportToComponent, data: { title: 'Report to details', breadcrumb: 'Report to details' }
              //   },
              //   {
              //     path: 'qualifications', component: EmployeeQualificationDetailsComponent, data: { title: 'Qualifications', breadcrumb: 'Qualifications' }
              //   },
              //   {
              //     path: 'memberships', component: EmployeeMembershipDetailsComponent, data: { title: 'Membership details', breadcrumb: 'Membership details' }
              //   },
              // ]
            }
          ]
      }
    ]
  }
];