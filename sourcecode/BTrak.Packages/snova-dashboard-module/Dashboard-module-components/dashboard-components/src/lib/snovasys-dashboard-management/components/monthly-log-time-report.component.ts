import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MonthlyLogTime } from '../models/monthly-log-time-module';
import { MonthlyLogTimemodel } from '../models/monthlylogtime';
import { LineManagersModel } from '../models/line-mangaers-model';
import { SelectBranchModel } from '../models/select-branch-model';
import { SelectBranch } from '../models/select-branch';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { HeatMapDatePipe } from '../pipes/heatmap.date.pipe';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: 'app-dashboard-component-monthlylogtimereport',
  templateUrl: './monthly-log-time-report.component.html'
})

export class MonthlyLogTimeReportComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  year: any = 2010;
  lineManager: LineManagersModel[];
  selectBranches: SelectBranchModel[];
  monthlyLogReport: MonthlyLogTime;
  logReport: MonthlyLogTimemodel;
  date: Date = new Date();
  selectBranch: SelectBranch;
  branchFilterIsActive: boolean = false;
  selectManagerFilter: boolean = false;
  monthFilterIsActive: boolean = true;
  branchId: string = '00000000-0000-0000-0000-000000000000';
  lineManagerId: string = null;
  logReports: MonthlyLogTimemodel[];
  userId: string = '';
  selectedYear: number;
  selectedMonth: number;
  selecteddate: string;
  responseDataDates: any;
  isOpen: boolean = true;
  searchText: string;
  regionId: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  isArchived: boolean;
  anyOperationInProgress: boolean;
  searchIsActive: boolean = false;
  dataSource: Object[] = [];
  titleSettings: Object = {
    text: '',
    textStyle: {
      size: '15px',
      fontWeight: '500',
      fontStyle: 'Normal',
      fontFamily: 'Segoe UI'
    }
  };
  xAxis: Object = {
    labels: [],
  };
  yAxis: Object = {
    labels: [],
  };
  public cellSettings: Object = {
    border: {
      width: 1,
      radius: 4,
      color: 'white'
    },
    showLabel: false,
  };
  public paletteSettings: Object = {
    palette: [

      { value: 0, color: '#00FFFF', label: 'Holiday' },
      { value: 1, color: '#88AAFF', label: 'Week off' },
      { value: 2, color: '#1AFC06', label: 'Logtime greater than or equal to spent time' },
      { value: 3, color: '#FC0612', label: 'Logtime less than spent time' },
      { value: 4, color: '#FCC6E2', label: 'Casual leave / Sick leave' },
      { value: 5, color: '#D3D3D3', label: 'Future days / Inactive' },
      { value: 6, color: '#D6AC76', label: 'Work from home / On-site' },
      { value: 7, color: '#ff6600', label: 'Leave without intimation' },
      { value: 8, color: '#ff3399', label: 'First or second half leave' }],
    type: 'Fixed'
  };
  validationMessage: any;
  selectedbranch: string;

  constructor(private hrdashboardservice: HrDashboardService, private toaster: ToastrService,
    private cdRef: ChangeDetectorRef,
    private productivityDashboardService: ProductivityDashboardService,
    private heatMapDatePipe: HeatMapDatePipe) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getLineManagers();
    this.getAllBranches();
    if (this.canAccess_feature_LogTimeReport == true) {
      this.getMonthlyLogTimeReport();
    }
    this.getEntityDropDown();
  }

  getMonthlyReport() {
    this.getMonthlyLogTimeReport();
  }
  resetAllFilters() {
    this.lineManagerId = null;
    this.branchFilterIsActive = false;
    this.selectManagerFilter = false;
    this.monthFilterIsActive = true;
    this.branchId = null;
    this.date = new Date();
    this.selectedbranch = '';
    this.userId = ''
    this.lineManagerId = '';
    this.searchText = '';
    this.selectedEntity = "";
    this.getMonthlyLogTimeReport();
  }

  convertStringToDateFormat(value: any): Date | null {
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

  selectedbranchId(selectedbranchId) {
    if (selectedbranchId === "0") {
      this.branchFilterIsActive = false;
      this.branchId = "";
    }
    this.branchFilterIsActive = true;
    this.branchId = selectedbranchId;
    this.getMonthlyLogTimeReport();
  }

  selectedlineManagerId(selectedlineManagerId) {
    if (selectedlineManagerId === '0') {
      this.selectManagerFilter = false;
      this.lineManagerId = "";
    }
    this.selectManagerFilter = true;
    this.lineManagerId = selectedlineManagerId;
    this.getMonthlyLogTimeReport();
  }

  getMonthlyLogTimeReport() {
    this.anyOperationInProgress = true;
    this.monthlyLogReport = new MonthlyLogTime();
    this.monthlyLogReport.branchId = this.branchId;
    this.monthlyLogReport.lineManagerId = this.lineManagerId;
    this.monthlyLogReport.searchText = this.searchText;
    this.monthlyLogReport.entityId = this.selectedEntity;
    this.monthlyLogReport.SelectedDate = moment(this.date).format("YYYY-MM-DD");
    this.monthlyLogReport.entityId = this.selectedEntity;
    this.hrdashboardservice.getMonthlyLogTimeReport(this.monthlyLogReport).subscribe((result: any) => {
      if (result.success == true) {
        let data = result.data;
        this.responseDataDates = data.dates && data.dates.length > 0 ? true : false;
        if (result.data.length != 0) {
          this.dataSource = result.data.summaryValue;
          this.yAxis = {
            valueType: "Category",
            labels: this.heatMapDatePipe.transform(result.data.dates),
          };
          this.xAxis = {
            valueType: "Category",
            labelRotation: 90,
            labelIntersectAction: 'None',
            isInversed: true,
            labels: result.data.employeeName,
          };
        }
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      } else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getLineManagers() {
    let searchText = '';
    this.hrdashboardservice.getLineManagers(searchText).subscribe((result: any) => {
      if (result.success == true) {
        this.lineManager = result.data;
      }
    })
  }

  selectedsearchText(selectedsearchText) {
    this.searchText = selectedsearchText;
    this.getAllBranches();
  }

  selectedregionId(selectedregionId) {
    this.regionId = selectedregionId;
    this.getAllBranches();
  }

  selectedisArchived(selectedisArchived) {
    this.isArchived = selectedisArchived;
    this.getAllBranches();
  }
  filterClick() {
    this.isOpen = !this.isOpen;
  }


  getAllBranches() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getAllBranches(this.selectBranch).subscribe((result: any) => {
      if (result.success == true) {
        this.selectBranches = result.data;
      }
    })
  }

  getPreviousSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth());
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.monthFilterIsActive = true
    this.getMonthlyLogTimeReport();
  }

  getCurrentSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth() + 2);
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.monthFilterIsActive = true
    this.getMonthlyLogTimeReport();
  }

  searchRecords() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    {
      this.searchIsActive = false;
      this.searchText = this.searchText.trim();
    }
    this.searchIsActive = true;
    this.getMonthlyLogTimeReport()
  }

  closeSearch() {
    this.searchText = '';
    this.getMonthlyLogTimeReport()
  }


  getEntityDropDown() {
    let searchText = "";
    this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === true) {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getMonthlyLogTimeReport()
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