import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { UserStorySearchCriteriaOutputModel } from '../models/user-stories-search-criteria-model';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import { DashboardService } from '../services/dashboard.service';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-dashboard-component-userstoriesdependencyonme',
  templateUrl: 'user-stories-dependency-on-me.component.html',
})

export class UserStoriesDependencyOnMeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStoriesDependencyOnMeRecords: UserStorySearchCriteriaOutputModel[];
  pageNumber: number;
  pageSize: number;
  count: number;
  sortBy: any;
  sortDirectionAsc: boolean;
  anyOperationInProgress: boolean;
  searchText: any;
  includeArchive: boolean = false;
  searchDependency: string;
  scrollbarH: boolean = false;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  public ngDestroyed$ = new Subject();

  constructor(
    private cdRef: ChangeDetectorRef, private dashboardService: DashboardService,
    private productivityService: ProductivityDashboardService, private toaster: ToastrService) {
    super();
    this.pageSize = 10;
    this.pageNumber = 0;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getEntityDropDown();
    if (this.canAccess_feature_WorkItemsHavingDependencyOnMe) {
      this.getAllDependenciesOnMe();
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    this.cdRef.markForCheck();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getAllDependenciesOnMe();
  }

  getAllDependenciesOnMe() {
    this.anyOperationInProgress = true;
    var userStorySearchCriteriaInputModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaInputModel.dependencyText = "DependencyOnMe";
    userStorySearchCriteriaInputModel.pageNumber = this.pageNumber + 1;
    userStorySearchCriteriaInputModel.pageSize = this.pageSize;
    userStorySearchCriteriaInputModel.searchText = this.searchText;
    userStorySearchCriteriaInputModel.sortBy = this.sortBy;
    userStorySearchCriteriaInputModel.entityId = this.selectedEntity;
    userStorySearchCriteriaInputModel.sortDirectionAsc = this.sortDirectionAsc;
    userStorySearchCriteriaInputModel.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
    this.dashboardService
      .searchUserStories(userStorySearchCriteriaInputModel)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.userStoriesDependencyOnMeRecords = [];
          this.count = 0;
          this.scrollbarH = true;
        }
        else {
          this.count = responseData.data[0].totalCount;
          this.userStoriesDependencyOnMeRecords = responseData.data;
          this.count = this.userStoriesDependencyOnMeRecords[0].totalCount;
          this.scrollbarH = true;
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
    this.getAllDependenciesOnMe();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.getAllDependenciesOnMe();
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
    this.getAllDependenciesOnMe();
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
    this.getAllDependenciesOnMe();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = null;
    this.getAllDependenciesOnMe();
  }
}
