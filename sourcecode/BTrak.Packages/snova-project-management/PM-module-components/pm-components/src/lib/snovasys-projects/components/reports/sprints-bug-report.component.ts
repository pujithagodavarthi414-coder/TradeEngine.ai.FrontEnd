import { Component, ChangeDetectorRef, Input, ViewChild, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from "@angular/core";
import { GoalLevelReportsService } from "../../services/reports.service";
import { ToastrService } from "ngx-toastr";
import { SatPopover } from "@ncstate/sat-popover";
import { AssigneefilterPipe } from "../../pipes/assigneeFilter.pipes";
import { SprintService } from "../../services/sprints.service";
import { SprintModel } from "../../models/sprints-model";
import { BugReportModel } from "../../models/sprints-bug-report-model";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { BugReportFilterPipe } from "../../pipes/bug-report-filter.pipes";
import { ResultFilterPipe } from "../../pipes/result.pipes";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-pm-component-sprint-bug-report",
    templateUrl: "sprints-bug-report.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class SprintBugReportComponent implements OnInit {
    @Output() closePopUp = new EventEmitter<any>();
    
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.selectedEmployeeId = null;
            this.sprintId = this.dashboardFilters.sprintId;
            this.projectId = this.dashboardFilters.projectId;

            if(this.sprintId){
               this.getSprintsList();
            }

            this.getSprintBugReport();
        }
    }
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    companySettingsModel$: Observable<any[]>;
    softLabels: SoftLabelConfigurationModel[];
    bugReportModel: BugReportModel[];
    sprintsList: SprintModel[];
    dashboardFilters: DashboardFilterModel;
    selectedEmployeeId: string;
    sprintId: string;
    projectId: string;
    companySettingsIsInProgress: boolean;
    anyOperationInProgress: boolean;
    validationMessage: string;
    employeeName: string;
    selectEmployeeFilterIsActive: boolean;
    take: number = 12;
    showFilters: boolean;
    isOpen: boolean;
    isSprintsEnable: boolean;
    isBugBoardEnable: boolean;

    constructor(private reportsService: GoalLevelReportsService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private store: Store<State>,
        private sprintsService: SprintService,
        private assigneeFilterPipe: ResultFilterPipe, private router: Router) {
        this.getSoftLabels();
        this.getCompanySettings();
    }

    ngOnInit() {
        this.getSoftLabels();
        this.selectedEmployeeId = null;
        if (!this.dashboardFilters && !this.sprintId)
            this.getSprintBugReport();
        this.getCompanySettings();
    }


    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel.length > 0) {
            let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
            if (sprintResult.length > 0) {
                this.isSprintsEnable = sprintResult[0].value == "1" ? true : false;
            }
            let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
            if (companyResult.length > 0) {
                this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
            }
        }
    }

    getSprintBugReport() {
        if (!this.sprintId) {
            return;
        }
        this.anyOperationInProgress = true;
        var bugReportModel = new BugReportModel();
        bugReportModel.sprintId = this.sprintId;
        bugReportModel.ownerUserId = this.selectedEmployeeId;
        this.reportsService.getBugReport(bugReportModel).subscribe((response: any) => {
            if (response.success == true) {
                this.bugReportModel = response.data;
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
                this.selectedEmployeeId = null;
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.anyOperationInProgress = false;
                this.toastr.error(this.validationMessage);
            }
        }
        )
    }

    getSprintsList() {
   
        var sprintsModel = new SprintModel();
        sprintsModel.projectId = this.dashboardFilters.projectId;
        sprintsModel.isBacklog = false;
        sprintsModel.allSprints = true;
        
        this.sprintsService.searchSprints(sprintsModel).subscribe((responseData: any) => {     
          this.sprintsList = responseData.data;     
        });
    }

    selectSprintId(sprintId) {
        this.sprintId = sprintId;
        this.selectedEmployeeId = null;
        this.employeeName = null;

        this.getSprintBugReport();               
    }

    selectedEmployeesId(employeeId, event) {
        if (employeeId == "all") {
            this.selectedEmployeeId = "";
            if (event == null)
                this.employeeName = null;
            else
                this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            this.selectEmployeeFilterIsActive = false;
        }
        else {
            this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
            this.selectedEmployeeId = employeeId;
            this.selectEmployeeFilterIsActive = true;
        }
    }

    selectedEmployeesIdFind(employeeId) {
        let filteredUserStories = this.assigneeFilterPipe.transform(this.bugReportModel, employeeId, "bugReport");
        if (filteredUserStories && filteredUserStories.length > 0)
            this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        this.selectedEmployeeId = employeeId;
    }

    resetAllFilters() {
        this.sprintId = this.dashboardFilters.sprintId;
        this.selectedEmployeeId = null;
        this.employeeName = null;
        this.selectEmployeeFilterIsActive = false;
        
        this.getSprintBugReport();        
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.router.navigateByUrl('/projects');
    }

    fitContent(optionalParameters: any){
        var interval;
        var count = 0;
    
        if(optionalParameters['individualPageView']){
          interval = setInterval(() => {
            try{
              if(count > 30){
                clearInterval(interval);
              }
              count++;
              if($(optionalParameters['individualPageSelector'] + ' .projects-list-grid').length > 0) {
                $(optionalParameters['individualPageSelector'] + ' .projects-list-grid').height($(optionalParameters['individualPageSelector']).height() - 55);
                clearInterval(interval);
              }
            }catch(err){
              clearInterval(interval);
            }
          }, 1000);
        }
    
        if (optionalParameters['gridsterView']) {
          interval = setInterval(() => {
            try {
              if (count > 30) {
                clearInterval(interval);
              }
              count++;
              if ($(optionalParameters['gridsterViewSelector'] + ' .projects-list-grid').length > 0) {                  
                  $(optionalParameters['gridsterViewSelector'] + ' .projects-list-grid').height($(optionalParameters['gridsterViewSelector']).height() - 55);
                  clearInterval(interval);
              }
            } catch (err) {
              clearInterval(interval);
            }
          }, 1000);
        }
    
      }
    
}