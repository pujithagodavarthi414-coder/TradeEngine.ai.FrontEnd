import { Component, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CookieService } from 'ngx-cookie-service';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatDialogRef } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";

import { EmployeeListModel } from "../models/employee-model";
import { EmployeeBankDetailsModel } from "../models/employee-bank-details-model";

import { EmployeeService } from "../services/employee-service";


import { AddSalaryDetailsComponent } from "../components/employee/add-salary-details.component";
import { AddRateSheetDetailsComponent } from "../components/employee/add-ratesheet-details.component";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-hr-page-employee-details",
    templateUrl: "employee-details.page.template.html"
})

export class EmployeeDetailsPageComponent extends CustomAppBaseComponent {
    @ViewChildren("editSalaryDetailsPopover") editSalaryDetailsPopover;

    editBankDetailsData: EmployeeBankDetailsModel;
    employeeDetails: EmployeeListModel;

    selectedTab: string;
    selectedEmployeeId: string;
    userId: string = '';
    isPermission: boolean = false;
    selectedTabIndex: number;

    constructor(
        private cookieService: CookieService,
        private activatedRoute: ActivatedRoute, private router: Router, private employeeService: EmployeeService,
        public dialogRefSalary: MatDialogRef<AddSalaryDetailsComponent>,
        public dialogRefRateSheet: MatDialogRef<AddRateSheetDetailsComponent>,
        public dialog: MatDialog) {
        super();

        this.activatedRoute.params.subscribe(routeParams => {
            this.selectedEmployeeId = routeParams.id;
        })
    }

    ngOnInit() {
        super.ngOnInit();
        this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeDetails = response.data;
                this.userId = this.employeeDetails.userId;
                if (this.userId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
                    this.isPermission = true;
                }
                this.routeToHrRecordPage();
            }
        });
    }

    routeToHrRecordPage() {
        this.activatedRoute.params.subscribe(params => {
            this.selectedTab = params["tab"];
            if (this.selectedTab === undefined || this.selectedTab === 'personal-details') {
                this.selectedTab = 'personal-details'
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'licence-details') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'emergency-details') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'dependents') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'immigration') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'job') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'salary') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'report-to') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'qualifications') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else if (this.selectedTab === 'memberships') {
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
            else {
                this.selectedTab = 'personal-details';
                this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
            }
        })
    }

    onTabClick(event: MatTabChangeEvent) {
        if (event.tab.textLabel.includes("PersonalDetails")) {
            this.selectedTab = "personal-details";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("LicenceDetails")) {
            this.selectedTab = "licence-details";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("EmergencyContacts")) {
            this.selectedTab = "emergency-details";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Dependents")) {
            this.selectedTab = "dependents";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Immigration")) {
            this.selectedTab = "immigration";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Job")) {
            this.selectedTab = "job";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Salary")) {
            this.selectedTab = "salary";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("ReportTo")) {
            this.selectedTab = "report-to";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Qualifications")) {
            this.selectedTab = "qualifications";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        } else if (event.tab.textLabel.includes("Memberships")) {
            this.selectedTab = "memberships";
            this.router.navigate(["hrmanagment/employeedetails", this.selectedEmployeeId, this.selectedTab]);
        }
    }

    addBankDetailDetailsId(editSalaryDetailsPopover) {
        this.editBankDetailsData = null;
        editSalaryDetailsPopover.openPopover();
    }

    closeUpsertSalaryDetailsPopover() {
        this.editSalaryDetailsPopover.forEach((p) => p.closePopover());
    }

    openDialog(event): void {
        if (event == "salary") {
            this.dialog.open(AddSalaryDetailsComponent, {
                height: 'auto',
                width: '600px',
                disableClose: true,
                data: { employeeId: this.selectedEmployeeId, editSalaryDetailsData: event, isPermission: this.isPermission }
            });
        } else {
            this.dialog.open(AddRateSheetDetailsComponent, {
                height: 'auto',
                width: '1200px',
                disableClose: true,
                data: { employeeId: this.selectedEmployeeId, editRateSheetData: null, isPermission: this.isPermission }
            });
        }
    }
}
