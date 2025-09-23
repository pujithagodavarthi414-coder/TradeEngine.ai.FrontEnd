import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, Input } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NativeDateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { BugReportData, BugReportModel } from '../models/bugReportData';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import * as commonModuleReducers from "../store/reducers/index";
import { State } from '../store/reducers/authentication.reducers';
import * as _ from 'underscore';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { UserModel } from '../models/user-details.model';
import { DashboardService } from '../services/dashboard.service';
import { ProjectFeature } from '../models/project-feature.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            return date.toDateString();
        }
    }
}

@Component({
    selector: 'app-dashboard-component-bugReport',
    templateUrl: './bug-report.Component.html',
    encapsulation: ViewEncapsulation.None
})

export class BugReportComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.assigneeId = this.dashboardFilters.userId;
            this.projectId = this.dashboardFilters.projectId;
            this.getAllFeautures(this.projectId);
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels: SoftLabelConfigurationModel[];
    featureSelect: FormControl = new FormControl();
    featureFilter: FormControl = new FormControl();
    @ViewChild('singleSelect') singleSelect: MatSelect;
    selectedDate: string;
    displayFn: any;
    showGoalDetails: boolean = true;
    featureId: string;
    featuresList: ProjectFeature[] = [];
    pageNumber: number = 0;
    companySettingsModel$: Observable<any[]>;
    filteredFeaturesList: Observable<ProjectFeature[]>;
    selectedDateValue: Date = new Date();
    projectsList: any;
    myControl = new FormControl();
    sortBy: string = 'parameterName';
    sortDirectionAsc: boolean = true;
    projectId: string = null;
    assigneeId: string;
    projectFeatureId: string = null;
    showGoalLevel: boolean = true;
    date: Date = new Date();
    pageSize: number = 20;
    anyOperationInProgress: boolean = true;
    bugReport: BugReportData[];
    employeeList: SelectEmployeeDropDownListData[];
    teamLeadsList: SelectEmployeeDropDownListData[];
    public filteredItems: ProjectFeature[];
    validationMessage: string;
    totalCount: number = 0;
    isBugBoardEnable: boolean;
    isOpen: boolean = true;
    isBugReport: Boolean;
    employeeFilterIsActive: boolean = false;
    projectFilterIsActive: boolean;
    featureIsActive: boolean = false;
    dateFilterIsActive: boolean = true;
    showDetailsFilterIsEnable: boolean;
    scrollbarH: boolean;
    public ngDestroyed$ = new Subject();

    selectedEntity: string = "selectNone";
    entities: EntityDropDownModel[];
    constructor(
        private dashboardService: DashboardService, private toaster: ToastrService, private cdRef: ChangeDetectorRef,
        private productivityDashboardService: ProductivityDashboardService, private store: Store<State>) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.isBugReport = this.canAccess_feature_BugReport;
        if (this.isBugReport) {
            this.getAllBugReports();
        }
        this.getAllCompanySettings();
        this.getSoftLabels();
        this.getAllProjects();
        this.getEntityDropDown();
        this.getAllUsers();
    }

    getAllCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel.length > 0) {
            let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
            if (companyResult.length > 0) {
                this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
            }
        }
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        this.cdRef.markForCheck();
    }

    getAllProjects() {
        this.productivityDashboardService.getAllProjects().subscribe((responseData: any) => {
            this.projectsList = responseData.data.filter(app => {
                if (app.isArchived == false) {
                    return app;
                }
            });
        });
    }

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isActive = true;
        this.productivityDashboardService.getAllUsers(userModel).subscribe((responseData: any) => {
            this.employeeList = responseData.data;
            this.teamLeadsList = _.where(this.employeeList, { roleId: '3269ca75-879d-44ba-99e1-a94b8ca80e64' });
            if (responseData.success == false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    onPageChange(data: any) {
        this.pageNumber = data.offset;
        this.pageSize = 20;
        this.getAllBugReports();
    }

    sortChange(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        this.pageNumber = 0;
        if (sort.dir === 'asc')
            this.sortDirectionAsc = true;
        else
            this.sortDirectionAsc = false;
        this.getAllBugReports();
    }

    getBugReportByEmployee(value) {
        this.pageNumber = 0;
        this.assigneeId = value;
        this.getAllBugReports();
        this.employeeFilterIsActive = true;
    }

    getBugReportByProject(projectId) {
        this.projectId = projectId;
        this.pageNumber = 0;
        this.myControl = new FormControl();
        this.projectFeatureId = null;
        this.featureIsActive = false;
        this.getAllFeautures(this.projectId);
        this.getAllBugReports();
        this.projectFilterIsActive = true;
    }

    getDateChange(event: MatDatepickerInputEvent<Date>) {
        this.date = event.target.value;
        this.getAllBugReports();
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    setDatePicker(date) {
        this.selectedDateValue = date;
        this.selectedDate = date;
        const day = this.selectedDateValue.getDate() + 1;
        const month = 0 + (this.selectedDateValue.getMonth() + 1);
        const year = this.selectedDateValue.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.date = this.parse(newDate);
        this.getAllBugReports();
    }

    getBugReport(showDetails) {
        this.showGoalLevel = showDetails;
        this.showDetailsFilterIsEnable = true;
        this.pageNumber = 0;
        this.getAllBugReports();
    }

    public displayNull() {
        return null
    }

    searchBugReportBasedOnFeature() {
        let data = this.featureSelect.value;
        if (data == 0) {
            this.projectFeatureId = null;
            this.projectId = null;
            this.projectFilterIsActive = false;
        }
        this.projectFeatureId = data.projectFeatureId;
        this.projectId = data.projectId;
        this.pageNumber = 1;
        this.pageSize = 20;
        this.sortBy = null;
        this.sortDirectionAsc = true;
        this.getAllBugReports();
    }

    getAllFeautures(projectId) {
        this.filteredItems = [];
        let projectFeatureModel = new ProjectFeature;
        projectFeatureModel.projectId = projectId;
        this.dashboardService.GetAllProjectFeatures(projectFeatureModel).subscribe((responseData: any) => {
            this.featuresList = responseData.data;

            this.filteredFeaturesList = this.myControl.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? (this.filterStates(state)) : this.featuresList.slice())
                );
        })
    }

    filterStates(name: string) {
        return this.featuresList.filter(state => {
            this.projectFeatureId = null;
            this.projectFilterIsActive = false;
            state.projectName.toLowerCase().indexOf(name.toLowerCase()) === 0
        });
    }

    featureSelectionChange(data) {
        this.projectFeatureId = data.projectFeatureId;
        this.pageNumber = 0;
        this.getAllBugReports();
        this.featureIsActive = true;
    }

    getAllBugReports() {
        this.bugReport = [];
        this.totalCount = null;
        this.anyOperationInProgress = true;
        this.scrollbarH = false;
        let bugreports = new BugReportModel();
        bugreports.SelectedDate = this.date;
        bugreports.PageNumber = this.pageNumber + 1;
        bugreports.PageSize = this.pageSize;
        bugreports.SortBy = this.sortBy;
        bugreports.SortDirectionAsc = this.sortDirectionAsc;
        bugreports.ProjectId = this.projectId;
        bugreports.AssigneeId = this.assigneeId;
        bugreports.ProjectFeatureId = this.projectFeatureId;
        bugreports.ShowGoalLevel = this.showGoalLevel;
        bugreports.entityId = this.selectedEntity;
        this.productivityDashboardService.getAllBugReports(bugreports).subscribe((responseData: any) => {
            if (responseData.success == false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            if (responseData.data.length === 0) {
                this.bugReport = null;
                this.totalCount = 0;
            } else {
                this.bugReport = responseData.data;
                this.totalCount = this.bugReport[0].totalCount;
                this.scrollbarH = true;
            }
            this.anyOperationInProgress = false;
            this.cdRef.detectChanges();
        });
        // if (this.scrollbarH = true) {
        //     setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 250);
        // }
    }

    sample() {
        if (this.myControl.value != null) {
            this.filteredItems = this.featuresList.filter(project => (project.projectFeatureName.toLowerCase().indexOf(this.myControl.value) > -1) ||
                (project.projectName.toLowerCase().indexOf(this.myControl.value) > -1))
        }
        if (this.myControl.value == "") {
            this.filteredItems = null;
            this.featureId = '';
            this.projectFeatureId = '';
            this.featureIsActive = false;
        }
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.date = new Date();
        this.selectedDateValue = new Date();
        this.selectedDate = this.date.toISOString();
        this.featureIsActive = false;
        this.employeeFilterIsActive = false;
        this.projectFilterIsActive = false;
        this.projectId = '';
        this.assigneeId = '';
        this.myControl = new FormControl();
        this.projectFeatureId = '';
        this.showGoalLevel = true;
        this.showGoalDetails = true;
        this.showDetailsFilterIsEnable = false;
        this.selectedEntity = "";
        this.sortBy = "parameterName";
        this.sortDirectionAsc = true;
        this.getAllBugReports();
    }

    getEntityDropDown() {
        let searchText = "";
        this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
            this.cdRef.detectChanges();
        });
    }

    entityValues(name) {

        this.selectedEntity = name;
        this.pageNumber = 0;
        this.getAllBugReports();
    }
}
