import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { UserStorySearchCriteriaOutputModel } from '../models/user-stories-search-criteria-model';
import { Subject } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { DashboardService } from '../services/dashboard.service';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-dashboard-component-userstoriesotherdependency',
  templateUrl: 'user-stories-other-dependency.component.html',
})

export class UserStoriesOtherDependencyComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  userStoriesDependencyOnOthersOutputModel: UserStorySearchCriteriaOutputModel[];
  pageNumber: number;
  pageSize: number;
  searchText: string;
  anyOperationInProgress: boolean;
  count: number;
  sortBy: any;
  sortDirectionAsc: boolean;
  searchDependency: string;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  public ngDestroyed$ = new Subject();

  constructor(
    private dashboardService: DashboardService, private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService) {
    super();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getEntityDropDown();
    if (this.canAccess_feature_WorkItemsHavingOthersDependency) {
      this.getUserstoriesDependencyOnOthers();
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    this.cdRef.markForCheck();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getUserstoriesDependencyOnOthers();
  }

  getUserstoriesDependencyOnOthers() {
    this.anyOperationInProgress = true;
    const userStorySearchCriteriaInputModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaInputModel.pageNumber = this.pageNumber + 1;
    userStorySearchCriteriaInputModel.dependencyText = "DependencyOnOthers";
    userStorySearchCriteriaInputModel.pageSize = 10;
    userStorySearchCriteriaInputModel.searchText = this.searchText;
    userStorySearchCriteriaInputModel.sortBy = this.sortBy;
    userStorySearchCriteriaInputModel.entityId = this.selectedEntity;
    userStorySearchCriteriaInputModel.sortDirectionAsc = this.sortDirectionAsc;
    userStorySearchCriteriaInputModel.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
    this.dashboardService.searchUserStories(userStorySearchCriteriaInputModel)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.userStoriesDependencyOnOthersOutputModel = [];
          this.count = 0;
        }
        else {
          this.count = responseData.data[0].totalCount;
          this.userStoriesDependencyOnOthersOutputModel = responseData.data;
          this.count = this.userStoriesDependencyOnOthersOutputModel[0].totalCount;
        }
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      });
  }

  search() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.searchText = this.searchText.trim();
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getUserstoriesDependencyOnOthers();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.getUserstoriesDependencyOnOthers();
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
    this.getUserstoriesDependencyOnOthers();
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
    this.getUserstoriesDependencyOnOthers();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = null;
    this.getUserstoriesDependencyOnOthers();
  }
}
