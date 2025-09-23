import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { MainDashboardService } from '../../services/maindashboard.service';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: 'app-projectrunninggoals',
  templateUrl: './projectrunninggoals.component.html'
})

export class ProjectrunninggoalsComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress: boolean = false;
  projectRunningGoalsList: any[];
  validationMessage: string;
  projectId: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open: boolean = true;

  constructor(private mainDashboardService: MainDashboardService,
    private productivityService: ProductivityDashboardService, private toaster: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getEntityDropDown();
    this.GetActivelyRunningProjectGoal();
  }

  GetActivelyRunningProjectGoal() {
    this.anyOperationInProgress = true;
    this.mainDashboardService.getActivelyRunningProjectGoal(this.selectedEntity, this.projectId).subscribe((responseData: any) => {
      if (responseData.data != null) {
        this.anyOperationInProgress = false;
        this.projectRunningGoalsList = responseData.data;
        this.cdRef.detectChanges();
      }
      else {
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      }
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
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.GetActivelyRunningProjectGoal();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.GetActivelyRunningProjectGoal();
  }

  fitContent(optionalParameters: any) {
    var interval;
    if (optionalParameters['gridsterView']) {
      interval = setInterval(() => {
        if ($(optionalParameters['gridsterViewSelector'] + ' .project-goals').length > 0) {
          $(optionalParameters['gridsterViewSelector'] + ' .project-goals').removeClass('app-height-2');
          $(optionalParameters['gridsterViewSelector'] + ' .project-goals').removeClass('no-drag');
          $(optionalParameters['gridsterViewSelector'] + ' .project-goals').height($(optionalParameters['gridsterViewSelector']).height() - 45);
          clearInterval(interval);
        }
      }, 1000);
    }

    if (optionalParameters['popupView']) {
      interval = setInterval(() => {
        if ($(optionalParameters['popupViewSelector'] + ' .project-goals').length > 0) {
          $(optionalParameters['popupViewSelector'] + ' .project-goals').removeClass('app-height-2');
          $(optionalParameters['popupViewSelector'] + ' .project-goals').removeClass('no-drag');
          $(optionalParameters['popupViewSelector'] + ' .project-goals').height($(optionalParameters['popupViewSelector']).height() - 75);
          clearInterval(interval);
        }
      }, 1000);
    }

    if (optionalParameters['individualPageView']) {
      interval = setInterval(() => {
        if ($(optionalParameters['individualPageSelector'] + ' .project-goals').length > 0) {
          $(optionalParameters['individualPageSelector'] + ' .project-goals').removeClass('app-height-2');
          $(optionalParameters['individualPageSelector'] + ' .project-goals').removeClass('no-drag');
          $(optionalParameters['individualPageSelector'] + ' .project-goals').height($(window).height() - 100);
          clearInterval(interval);
        }
      }, 1000);
    }
  }
}
