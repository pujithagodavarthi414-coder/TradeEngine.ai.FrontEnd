import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { MainDashboardService } from '../../services/maindashboard.service';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "app-employeerunninggoals",
  templateUrl: "./employeerunninggoals.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeerunninggoalsComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
    }
  }

  dashboardFilters: DashboardFilterModel;
  employeeRunningGolasList: any[];
  anyOperationInProgress = false;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  validationMessage: string;
  projectId: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  Ishide: boolean = true;


  constructor(
    private mainDashboardService: MainDashboardService, private productivityService: ProductivityDashboardService, private toaster: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getEntityDropDown();
    this.getActivelyRunningTeamLeadGoals();
  }

  getActivelyRunningTeamLeadGoals() {
    this.anyOperationInProgress = true;
    this.mainDashboardService.getActivelyRunningTeamLeadGoals(this.selectedEntity,this.projectId).subscribe((responseData: any) => {
      if (responseData.data != null) {
        this.employeeRunningGolasList = responseData.data;
        this.anyOperationInProgress = false;
      }
      else {
        this.employeeRunningGolasList = null;
        this.Ishide = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
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
        this.cdRef.detectChanges();
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getActivelyRunningTeamLeadGoals();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getActivelyRunningTeamLeadGoals();
  }

  fitContent(optionalParameters?: any) {
    try {
      if (optionalParameters) {
        var parentElementSelector = '';
        var minHeight = '';
        if (optionalParameters['popupView']) {
          parentElementSelector = optionalParameters['popupViewSelector'];
          minHeight = `calc(90vh - 200px)`;
        }
        else if (optionalParameters['gridsterView']) {
          parentElementSelector = optionalParameters['gridsterViewSelector'];
          minHeight = `${$(parentElementSelector).height() - 40}px`;
        }
        else if (optionalParameters['individualPageView']){
          parentElementSelector = optionalParameters['individualPageSelector'];
          minHeight = `calc(100vh - 100px)`;
        }

        var counter = 0;
        var applyHeight = setInterval(function() {
          if(counter > 10){
            clearInterval(applyHeight);
          }
          counter++;
          if($(parentElementSelector + ' app-employeerunninggoals div.app-height-2').length > 0) {
            $(parentElementSelector + ' app-employeerunninggoals div.app-height-2').css('height', minHeight);
            clearInterval(applyHeight);
          }
        }, 1000);
      }
    }
    catch (err) {
      clearInterval(applyHeight);
      console.log(err);
    }
  }
}
