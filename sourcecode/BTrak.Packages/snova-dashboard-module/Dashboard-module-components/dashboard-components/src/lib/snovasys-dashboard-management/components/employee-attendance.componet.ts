import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, } from '@angular/core';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { Store, select } from "@ngrx/store";
import { ToastrService } from 'ngx-toastr';
import * as commonModuleReducers from "../store/reducers/index";
import { State } from "../store/reducers/authentication.reducers";
import { EmployeeAttendance } from '../models/employee-attendance.model';
import { Observable } from 'rxjs';
import { SelectBranch } from '../models/select-branch';
import { SelectBranchModel } from '../models/select-branch-model';
import { TeamMembersListModel } from '../models/line-mangaers-model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { HeatMapDatePipe } from '../pipes/heatmap.date.pipe';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;
import * as $_ from 'jquery';
const $ = $_;
  
@Component({
    selector: 'app-dashBoard-component-employeeAttendance',
    templateUrl: 'employee-attendance.componet.html'
})

export class EmployeeAttendanceComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.teamLeadId = this.dashboardFilters.userId;
            this.getEmployeeAttendanceByDayWise();
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Output() teamLeadData = new EventEmitter<any>();

    selectBranches: SelectBranchModel[];
    selectDepartments: SelectBranchModel[];
    selectDesignations: SelectBranchModel[];
    lineManager: TeamMembersListModel[];
    EmployeeAttendanceData: Object[];
    selectLineManagerfilter: boolean = false;
    date: Date = new Date();
    selectedDate: string = this.date.toISOString();
    names: any;
    selectedYear: number;
    selectedMonth: number;
    monthFilterActive: boolean = true;
    selecteddate: string;
    weekNumber: string;
    isOpen: boolean = true;
    type: string = ConstantVariables.Month;
    roleFeaturesIsInProgress$: Observable<boolean>;
    anyOperationInProgress: boolean;
    dataSource: Object[];
    responseDataDates: any;
    validationMessage: string;
    selectBranchFilterIsActive: boolean = false;
    selectDepartmentFilterIsActive: boolean = false;
    selectDesignationFilterIsActive: boolean = false;
    selectTeamleadFilterIsActive: boolean = false;
    branchId: string;
    departmentId: string;
    selectBranch: any;
    searchText: any = '';
    regionId: any;
    isArchived: any;
    designationId: string;
    searchIsActive: boolean;
    lineManagerFilter: boolean = false;
    teamLeadId: string = null;

    softLabels: SoftLabelConfigurationModel[];
    selectedEntity: string;
    entities: EntityDropDownModel[];

    titleSettings: Object = {
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal',
            fontFamily: 'Segoe UI'
        }
    };
    xAxis: Object = {
        labels: [],
        labelRotation: 45,
        labelIntersectAction: 'None',
        isInversed: true
    };
    yAxis: Object = []
    public legendSettings: Object = {
        visible: true,
    };
    public cellSettings: Object = {
        showLabel: false,
    };
    public showTooltip: boolean = true;

    public paletteSettings: Object = {
        palette: [
            { value: 0, color: '#04FE02', label: 'Present' },
            { value: 1, color: '#FFFF00', label: 'Late' },
            { value: 2, color: '#FF141C', label: 'Record not inserted' },
            { value: 3, color: '#D47BFF', label: 'Sick leave' },
            { value: 4, color: '#FCC6E2', label: 'Casual leave' },
            { value: 5, color: '#D6AC76', label: 'Work from home / On-site' },
            { value: 6, color: '#00FFFF', label: 'Holiday' },
            { value: 7, color: '#C8C8C8', label: 'Inactive /No shift' },
            { value: 8, color: '#D5FF2D', label: 'Night & Morning late ' },
            { value: 9, color: '#fccca9', label: 'Not to be track' },
            { value: 10, color: '#88AAFF', label: 'Week off' },
            { value: 11, color: '#ff6600', label: 'Leave without intimation' },
            { value: 12, color: '#ff3399', label: 'First or second half leave' },
        ],
        type: 'Fixed'
    };
    year: any;

    constructor(
        private heatMapDatePipe: HeatMapDatePipe,
        private store: Store<State>, private hrDashboardService: HrDashboardService,
        private toaster: ToastrService, private productivityService: ProductivityDashboardService,
        private cdRef: ChangeDetectorRef) {
        super();
        this.branchId = null;
        this.designationId = null;
        this.departmentId = null;
        this.getAllBranches();
        this.getdepartment();
        this.getAllDesignations();
        this.getLineManagers();
        this.teamLeadData.emit(null);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getEntityDropDown();
        this.getEmployeeAttendanceByDayWise();
        this.branchId = null;
        this.designationId = null;
        this.departmentId = null;
        this.teamLeadData.emit(null);
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    searchRecords() {
        if (this.searchText) {
            this.searchIsActive = true;
        }
        else {
            this.searchIsActive = false;
        }
        if (this.searchText && this.searchText.trim().length <= 0) return;
        this.searchText = this.searchText.trim();
        this.getEmployeeAttendanceByDayWise();
    }

    closeSearch() {
        this.searchText = '';
        this.searchIsActive = false;
        this.getEmployeeAttendanceByDayWise();
    }

    resetAllFilters() {
        this.date = new Date();
        this.monthFilterActive = true;
        this.selectBranchFilterIsActive = false;
        this.selectDepartmentFilterIsActive = false;
        this.selectLineManagerfilter = false;
        this.selectDesignationFilterIsActive = false;
        this.teamLeadId = null;
        this.lineManagerFilter = false
        this.searchIsActive = false;
        this.selectedDate = this.date.toISOString();
        this.searchText = '';
        this.branchId = null;
        this.designationId = null;
        this.selectedEntity = "";
        this.departmentId = null;
        let employeeOutputModel = new EmployeeAttendance();
        employeeOutputModel.branchId = null
        employeeOutputModel.designationId = null
        employeeOutputModel.departmentId = null
        this.teamLeadData.emit(employeeOutputModel);
        this.getEmployeeAttendanceByDayWise();
    }

    selectedBranchId(selectedBranchId) {
        if (selectedBranchId === "0") {
            this.selectBranchFilterIsActive = false;
            this.branchId = "";
        }
        this.selectBranchFilterIsActive = true;
        this.branchId = selectedBranchId;
        let employeeOutputModel = new EmployeeAttendance();
        employeeOutputModel.branchId = selectedBranchId;
        employeeOutputModel.teamLeadId = this.teamLeadId;
        employeeOutputModel.designationId = this.designationId;
        employeeOutputModel.departmentId = this.departmentId;
        employeeOutputModel.date = this.date;
        this.teamLeadData.emit(employeeOutputModel);
        this.getEmployeeAttendanceByDayWise();
    }

    selectedDepartmentId(selectedDepartmentId) {
        if (selectedDepartmentId === "0") {
            this.selectDepartmentFilterIsActive = false;
            this.departmentId = "";
        }
        this.selectDepartmentFilterIsActive = true;
        this.departmentId = selectedDepartmentId;
        let employeeOutputModel = new EmployeeAttendance();
        employeeOutputModel.departmentId = selectedDepartmentId;
        employeeOutputModel.date = this.date;
        employeeOutputModel.branchId = this.branchId;
        employeeOutputModel.designationId = this.designationId;
        employeeOutputModel.teamLeadId = this.teamLeadId;
        this.teamLeadData.emit(employeeOutputModel);
        this.getEmployeeAttendanceByDayWise();
    }

    selectedLineManagerId(selectedLineManagerId) {
        if (selectedLineManagerId === '0') {
            this.lineManagerFilter = false;
            this.teamLeadId = "";
        }
        this.lineManagerFilter = true;
        this.teamLeadId = selectedLineManagerId;
        let employeeOutputModel = new EmployeeAttendance();
        employeeOutputModel.teamLeadId = selectedLineManagerId;
        employeeOutputModel.branchId = this.branchId;
        employeeOutputModel.date = this.date;
        employeeOutputModel.designationId = this.designationId;
        employeeOutputModel.teamLeadId = this.teamLeadId;
        employeeOutputModel.departmentId = this.departmentId;
        this.teamLeadData.emit(employeeOutputModel);
        this.getEmployeeAttendanceByDayWise();
    }

    selectedDesignationId(selectedDesignationId) {
        if (selectedDesignationId === "0") {
            this.selectDesignationFilterIsActive = false;
            this.designationId = "";
        }
        this.selectDesignationFilterIsActive = true;
        this.designationId = selectedDesignationId;
        let employeeOutputModel = new EmployeeAttendance();
        employeeOutputModel.designationId = selectedDesignationId;
        employeeOutputModel.teamLeadId = this.teamLeadId;
        employeeOutputModel.departmentId = this.departmentId;
        employeeOutputModel.branchId = this.branchId;
        employeeOutputModel.date = this.date;
        this.teamLeadData.emit(employeeOutputModel);
        this.getEmployeeAttendanceByDayWise();
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

    getEmployeeAttendanceByDayWise() {
        this.anyOperationInProgress = true;
        var employeeAttendance = new EmployeeAttendance;
        employeeAttendance.date = moment(this.date).format("YYYY-MM-DD");
        employeeAttendance.branchId = this.branchId;
        employeeAttendance.departmentId = this.departmentId;
        employeeAttendance.designationId = this.designationId;
        employeeAttendance.teamLeadId = this.teamLeadId;
        employeeAttendance.searchText = this.searchText;
        employeeAttendance.entityId = this.selectedEntity;
        this.hrDashboardService.getEmployeeAttendanceByDayWise(employeeAttendance).subscribe((responseData: any) => {
            this.EmployeeAttendanceData = responseData.data;
            this.dataSource = responseData.data.summaryValue;
            let data = responseData.data;
            this.responseDataDates = data.dates && data.dates.length > 0 ? true : false;
            this.yAxis = {
                valueType: "Category",
                labels: this.heatMapDatePipe.transform(responseData.data.dates)
            };
            this.xAxis = {
                valueType: "Category",
                labelRotation: 90,
                labelIntersectAction: 'None',
                isInversed: true,
                labels: responseData.data.names,
            };
            this.anyOperationInProgress = false;
            if (responseData.success == false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.cdRef.detectChanges();
        });
    }


    filterClick() {
        this.isOpen = !this.isOpen;
    }

    getDirection(direction) {
        if (direction === 'left') {
            const day = this.date.getDate();
            const month = 0 + (this.date.getMonth() + 1) - 1;
            const year = this.date.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.date = this.parse(newDate);

        } else {
            const day = this.date.getDate();
            const month = (this.date.getMonth() + 1) + 1;
            const year = 0 + this.date.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.date = this.parse(newDate);
        }
        this.getEmployeeAttendanceByDayWise();
    }

    getAllBranches() {
        this.selectBranch = new SelectBranch();
        this.selectBranch.branchId = this.branchId;
        this.selectBranch.departmentId = this.departmentId;
        this.selectBranch.designationId = this.designationId;
        this.selectBranch.searchText = this.searchText;
        this.selectBranch.regionId = this.regionId;
        this.selectBranch.isArchived = this.isArchived;
        this.hrDashboardService.getAllBranches(this.selectBranch).subscribe((result: any) => {
            this.selectBranches = result.data;
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    getAllDesignations() {
        this.selectBranch = new SelectBranch();
        this.selectBranch.branchId = this.branchId;
        this.selectBranch.departmentId = this.departmentId;
        this.selectBranch.designationId = this.designationId;
        this.selectBranch.searchText = this.searchText;
        this.selectBranch.regionId = this.regionId;
        this.selectBranch.isArchived = this.isArchived;
        this.hrDashboardService.getAlldesignations(this.selectBranch).subscribe((result: any) => {
            this.selectDesignations = result.data;
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    getdepartment() {
        this.selectBranch = new SelectBranch();
        this.selectBranch.branchId = this.branchId;
        this.selectBranch.departmentId = this.departmentId;
        this.selectBranch.designationId = this.designationId;
        this.selectBranch.searchText = this.searchText;
        this.selectBranch.regionId = this.regionId;
        this.selectBranch.isArchived = this.isArchived;
        this.hrDashboardService.getdepartment(this.selectBranch).subscribe((result: any) => {
            this.selectDepartments = result.data;
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    getLineManagers() {
        let searchText = '';
        this.hrDashboardService.getLineManagers(searchText).subscribe((result: any) => {
            this.lineManager = result.data
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    getEntityDropDown() {
        let searchText = "";
        this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    entityValues(name) {
        this.selectedEntity = name;
        this.getEmployeeAttendanceByDayWise();
    }

    fitContent(optionalParameters : any) {

        var interval;
        var count = 0;
    
        if(optionalParameters['gridsterView']){

            interval = setInterval(() => {
                try {

                  if (count > 30) {
                    clearInterval(interval);
                  }

                  count++;

                  if ($(optionalParameters['gridsterViewSelector'] + ' .gridster-noset #widget-scroll-id').length > 0) {
                  
                      $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset #widget-scroll-id').height($(optionalParameters['gridsterViewSelector']).height() - 45);
                      clearInterval(interval);
                  }                 
                  
                } catch (err) {
                  clearInterval(interval);
                }
              }, 100);
            
        }
        else if (optionalParameters['popupView']) {     
            
            interval = setInterval(() => {
                try {
        
                if (count > 30) {
                    clearInterval(interval);
                }        
                count++;
        
                if ($(optionalParameters['popupViewSelector'] + ' .gridster-noset #widget-scroll-id').length > 0) {
                                                    
                    $(optionalParameters['popupViewSelector'] + ' .gridster-noset #widget-scroll-id').css({"height" : "calc(100vh - 400px)" });             
                    clearInterval(interval);
                }
        
                } catch (err) {
                  clearInterval(interval);
                }
            }, 100);   
    
        }
        else if (optionalParameters['individualPageView']) {      
           
            interval = setInterval(() => {
                 try {
         
                   if (count > 30) {
                     clearInterval(interval);
                   }
         
                   count++;
         
                   if ($(optionalParameters['individualPageSelector'] + ' .gridster-noset #widget-scroll-id').length > 0) {
         
                       $(optionalParameters['individualPageSelector'] + ' .gridster-noset #widget-scroll-id').css({"height" : "calc(100vh - 180px)" });                      
                       clearInterval(interval);
                   }
         
                 } catch (err) {
                   clearInterval(interval);
                 }
               }, 100);
         }
      
      }      

}