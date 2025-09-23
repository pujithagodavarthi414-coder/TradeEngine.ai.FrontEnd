import { Component, Input, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/authentication.reducers";
import { LiveDashBoardStatusDropDownList } from '../models/liveDashboardDropDownList';
import { LiveDashBoard } from '../models/liveDashboard';
import { LiveDashBoardList } from '../models/liveDashboardList';
import { LiveDashboardService } from '../services/live-dashboard.service';
import * as _ from 'underscore';
import * as commonModuleReducers from "../store/reducers/index";
import { Observable } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { Router } from '@angular/router';
import { LoadProjectsTriggered } from "../store/actions/project.actions";
import * as projectModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { ProjectSearchResult } from '../models/project-search-result.model';
import { SoftLabelPipe } from '../pipes/soft-labels.pipe';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-liveDashboard',
  templateUrl: 'live-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LiveDashBoardComponent extends CustomAppBaseComponent implements OnInit {
  @Output() closePopUp = new EventEmitter<any>();
  Offset: string;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  @ViewChild('myTable') table: any;
  softLabels: SoftLabelConfigurationModel[];
  liveDashBoardData: LiveDashBoardList[];
  anyOperationInProgress: boolean;
  colorDescriptionList: any[] = [{ 'color': '#b7b7b7', 'desc': 'Not applicable' }, { 'color': '#1424b8', 'desc': 'Blocked' }, { 'color': '#ead1dd', 'desc': 'Waiting on dependencies' }, { 'color': '#04fefe', 'desc': 'Process is not started yet' }, { 'color': '#FF141C', 'desc': 'Serious issue. Need urgent attention' }, { 'desc': 'Everything is absolutely spot on', 'color': '#04fe02' }];
  liveDashBoardStatusDropDownList: LiveDashBoardStatusDropDownList[];
  selectedColor: string = '';
  scrollbarH: boolean = false;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  statusDropdown: string;
  accessGoals: Boolean = false;
  accessViewProject: Boolean = false;
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  projectSearchResults: any;

  constructor(private liveDashboardService: LiveDashboardService,
    private toastr: ToastrService,
    private productivityService: ProductivityDashboardService,
    private store: Store<State>,
    private cdRef: ChangeDetectorRef, private router: Router,
    private softLabelPipe: SoftLabelPipe) {
    super();
  }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.getEntityDropDown();
    this.getAllProcessDashboardDetails("");
    this.liveDashboardService
      .getAllProcessDashboardStatuses()
      .subscribe((responseData: any) => {
        this.liveDashBoardStatusDropDownList = responseData.data;
      });
    this.scrollbarH = true;
    this.accessGoals = this.canAccess_feature_AllGoals;
    this.accessViewProject = this.canAccess_feature_ViewProjects;

    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));

    this.projectSearchResults$ = this.store.pipe(
      select(projectModuleReducer.getProjectsAll)
    );

    this.projectSearchResults$.subscribe((result) => {
      this.projectSearchResults = result;
    });
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getProcessDashboardDetails(statusColor: string) {
    if (statusColor == "all") {
      statusColor = "";
    }
    this.selectedColor = statusColor;
    this.getAllProcessDashboardDetails(statusColor);
  }

  updateProcessModel() {
  }

  generateDashboard() {
    this.dashboardScreenshot(LiveDashBoard);
  }

  downloadDashboard() {
  }

  dashboardScreenshot(dashboardData) {
    this.liveDashboardService.getProcessDashboardScreenshotmain(dashboardData)
      .subscribe((responseData: any) => {
        if (responseData.success && responseData.data != undefined && responseData.data > 0) {
          this.toastr.success("", "Snapshot captured successfully");
        }
        else {
          let toastrText = "Add atleast one goal"
          this.toastr.warning("", this.softLabelPipe.transform(toastrText, this.softLabels));
        }
      });
  }

  getGroupRowHeight(group) {
    let style = {};
    style = {
      height: (group.length * 40) + 'px',
      width: '100%'
    };
    return style;
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle() {
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  getAllProcessDashboardDetails(statusColor: string) {
    if (this.canAccess_feature_ViewLiveDashboard) {
      this.anyOperationInProgress = true;
      var projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
      this.liveDashboardService
        .getAllProcessDashboardDetails(statusColor, this.selectedEntity, projectId)
        .subscribe((responseData: any) => {
          if (responseData.success == true) {
            this.liveDashBoardData = responseData.data;
            this.cdRef.detectChanges();
            this.anyOperationInProgress = false;
          }
        },
          error => {
            this.toastr.error("Snovasys Business Suite", error.statusText);
            this.anyOperationInProgress = false;
          }
        )
    }
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllProcessDashboardDetails(this.selectedColor);
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.selectedColor = "";
    this.statusDropdown = "";
    this.getAllProcessDashboardDetails(this.selectedColor);
  }

  redirectToGoal(data) {
    if (data != null && data != undefined && data.goalId != null && data.goalId != undefined && data.goalId != '') {
      if (this.accessGoals && this.accessViewProject && (this.projectSearchResults.filter(item => item.projectId == data.projectId).length > 0)) {
        this.closePopUp.emit(true);
        this.router.navigate(["projects/goal", data.goalId]);
      }
      else
        this.toastr.warning("You don't have permission to access this feature.");
    }
  }
}