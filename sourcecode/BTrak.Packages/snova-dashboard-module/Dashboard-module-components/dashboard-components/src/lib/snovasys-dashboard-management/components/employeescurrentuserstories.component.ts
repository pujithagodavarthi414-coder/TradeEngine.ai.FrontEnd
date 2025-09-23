import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, } from '@angular/core';
import { UserStorySearchCriteriaOutputModel } from '../models/user-stories-search-criteria-model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardService } from '../services/dashboard.service';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-employeescurrentuserstories',
  templateUrl: 'employeescurrentuserstories.component.html'
})

export class EmployeesCurrentUserStoriesComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
    }
  }
  @Output() closePopUp = new EventEmitter<any>();

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  employeesCurrentUserStoriesOutputRecords: UserStorySearchCriteriaOutputModel[];
  pageNumber: number;
  pageSize: number;
  searchText: string;
  anyOperationInProgress: boolean;
  count: number;
  sortBy: any;
  sortDirectionAsc: boolean;
  projectId: string;
  UserId: string;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  public ngDestroyed$ = new Subject();

  constructor(
    private dashboardService: DashboardService, private router: Router,
    private cdRef: ChangeDetectorRef, private productivityService: ProductivityDashboardService,
    private toaster: ToastrService) {
    super();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getEntityDropDown();
    this.GetcurrentUserStories();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  GetcurrentUserStories() {
    this.anyOperationInProgress = true;
    var userStorySearchCriteriaInputModel: UserStorySearchCriteriaInputModel;
    userStorySearchCriteriaInputModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaInputModel.dependencyText = "Current working/Backlog User Stories";
    userStorySearchCriteriaInputModel.pageNumber = this.pageNumber + 1;
    userStorySearchCriteriaInputModel.pageSize = 10;
    userStorySearchCriteriaInputModel.sortBy = this.sortBy;
    userStorySearchCriteriaInputModel.sortDirectionAsc = this.sortDirectionAsc;
    userStorySearchCriteriaInputModel.searchText = this.searchText;
    userStorySearchCriteriaInputModel.entityId = this.selectedEntity;
    userStorySearchCriteriaInputModel.projectId = this.projectId;
    this.dashboardService
      .searchUserStories(userStorySearchCriteriaInputModel)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.employeesCurrentUserStoriesOutputRecords = [];
          this.count = 0;
        }
        else {
          this.count = responseData.data[0].totalCount;
          this.employeesCurrentUserStoriesOutputRecords = responseData.data;
          this.count = this.employeesCurrentUserStoriesOutputRecords[0].totalCount;
        }
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      });
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.GetcurrentUserStories();
  }

  search() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.searchText = this.searchText.trim();
    this.pageNumber = 0;
    this.pageSize = 10;
    this.GetcurrentUserStories();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.GetcurrentUserStories();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.GetcurrentUserStories();
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
    if (url) {
      this.router.navigateByUrl('dashboard/profile/' + url + '/overview');
    }
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
    this.GetcurrentUserStories();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = null;
    this.GetcurrentUserStories();
  }
}
