import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { PerformanceReportModel } from '../../models/performance-report.model';
import { StatusreportService } from '../../services/statusreport.service';
import { PerformanceDialogComponent } from './performanceDialog.component';
import { DatePipe } from '@angular/common';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { DashboardService } from '../../services/dashboard.service';
import { UserModel } from '../../models/user-details.model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    dialog: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-performance-reports',
    templateUrl: `performance-report.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class PerformanceReportsComponent {

    @ViewChild("grid") public grid: GridComponent;
    isAnyOperationIsInProgress: boolean = false;
    data: any;
    selectedEntity: string;
    isOpen: boolean = false;
    entities: EntityDropDownModel[];
    employeeList: any[];
    employeeId: string;
    take: number = 20;
    gridData: any;
    state: State = {
        skip: 0,
        take: 20,
        group: [{
            field: 'performanceName'
        }]
    };

    public group: any[] = [{
        field: 'performanceName'
    }];
    searchText: string;
    public total: any;
    employeeName: string;
    entityName: string;

    constructor(
        private statusReportService: StatusreportService, private dashboardService: DashboardService,
        private router: Router,
        private dialog: MatDialog, private datePipe: DatePipe,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService) { }

    ngOnInit() {
        this.getAllPerformances();
        this.getEntityDropDown();
        this.getAllUsers();
    }

    getAllPerformances() {
        this.isAnyOperationIsInProgress = true;
        const performanceReportModel = new PerformanceReportModel();
        performanceReportModel.entityId = this.selectedEntity;
        performanceReportModel.userId = this.employeeId;
        performanceReportModel.searchText = this.searchText;
        this.statusReportService.GetPerformanceReports(performanceReportModel).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data.length > 0) {
                    response.data.forEach((p) => {
                        // tslint:disable-next-line: max-line-length
                        p.performanceName = p.performanceName + " " + this.datePipe.transform(this.utcToLocal(p.createdDateTime), 'dd-MMM-yyyy HH:mm');
                    })
                    this.total = response.data.length;
                    this.gridData = process(response.data, this.state);
                    this.data = response.data;
                } else {
                    this.data = null;
                }
                this.cdRef.detectChanges();
            }
        });
        this.isAnyOperationIsInProgress = false;
        this.cdRef.detectChanges();
    }

    utcToLocal(date) {
        const localDate = moment.utc(date).local().format();
        return localDate;
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.data, this.state);
    }

    exportToExcel(): void {
        this.state.take = this.data.length;
        this.updateData();
        this.cdRef.detectChanges();
        this.grid.saveAsExcel();
        this.state.take = 20;
        this.updateData();
        this.cdRef.detectChanges();
    }

    updateData() {
        this.state = this.state;
        this.gridData = process(this.data, this.state);
    }

    getEntityDropDown() {
        const searchText = "";
        this.dashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            } else {
                this.entities = responseData.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllUsers() {
        const userModel = new UserModel();
        this.dashboardService.getAllUsers(userModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.employeeList = responseData.data;
            } else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
        })
    }

    closeSearch() {
        this.searchText = null;
        this.getAllPerformances();
    }

    entityValues(id, event) {
        if (id === '0') {
            this.selectedEntity = "";
            if (event == null) {
                this.entityName = event.source.selected._element.nativeElement.innerText.trim();
            } else {
                this.entityName = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else {
            this.selectedEntity = id;
            this.entityName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllPerformances();
    }

    getEmployee(id, event) {
        if (id === '0') {
            this.employeeId = "";
            if (event == null) {
                this.employeeName = null;
            } else {
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else {
            this.employeeId = id;
            const index = this.employeeList.findIndex((p) => p.id.toString().toLowerCase() == id.toString().toLowerCase());
            if (index > -1) {
                this.employeeName = this.employeeList[index].fullName;
            } else {
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            }
        }
        this.getAllPerformances();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.employeeId = null;
        this.selectedEntity = null;
        this.employeeName = null;
        this.searchText = null;
        this.entityName = null;
        this.getAllPerformances();
    }

    closeSearchFilter() {
        this.searchText = null;
        this.getAllPerformances();
    }

    filter() {
        if (this.searchText || this.entityName || this.employeeName) {
            return true;
        } else {
            return false;
        }
    }

    openAddNewConfiguration(row: any, isForConfiguration) {
        const dialogRef = this.dialog.open(PerformanceDialogComponent, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            data: {
                isForConfiguration,
                formData: row.formData,
                formJson: row ? row.formJson : null,
                performanceName: row ? row.configurationName : null,
                timeStamp: null,
                configurationId: null,
                isDraft: false,
                isEdit: false,
                isForApproval: false,
                selectedRoleIds: []
            }
        });
        dialogRef.componentInstance.closeMatDialog.subscribe(() => {
            this.dialog.closeAll();
        });
    }

    goToUserProfile(selectedUserId) {
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }
}
