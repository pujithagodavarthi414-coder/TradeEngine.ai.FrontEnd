import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserStorySearchCriteriaOutputModel } from '../models/user-stories-search-criteria-model';
import { DashboardService } from '../services/dashboard.service';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-imminentdeadlines-profile',
  templateUrl: 'imminentdeadlines-profile.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ImminentDeadlinesProfileComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = data.projectId;
      if (data.userId == null) {
        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.cdRef.detectChanges();
        this.getImminentDeadLines();
      } else {
        this.userId = data.userId;
        this.cdRef.detectChanges();
        this.getImminentDeadLines();
      }
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  imminentDeadlinesOutputRecords: UserStorySearchCriteriaOutputModel[];
  userId = null;
  projectId = null;
  pageNumber: number;
  pageSize: number;
  count: number;
  sortBy: any;
  sortDirectionAsc: boolean;
  anyOperationInProgress: boolean;
  searchText: any;
  includeArchive: boolean = false;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  validationMessage: string;
  projectLabel: string;
  goalLabel: string;
  workItemLabel: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService, private router: Router,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService, private dashboardService: DashboardService) {
    super();
    this.pageNumber = 0;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.pageSize = 10;
    this.getEntityDropDown();
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.dashboardService.getLoggedInUser().subscribe((responseData: any) => {
      this.userId = responseData.data.id;
      this.getImminentDeadLines();
    })
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.workItemLabel = this.softLabels[0].userStoryLabel;
      this.cdRef.markForCheck();
    }
  }

  getImminentDeadLines() {
    this.anyOperationInProgress = true;
    const userStorySearchCriteriaInputModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaInputModel.dependencyText = "ImminentDeadline";
    userStorySearchCriteriaInputModel.pageNumber = this.pageNumber + 1;
    userStorySearchCriteriaInputModel.pageSize = this.pageSize;
    userStorySearchCriteriaInputModel.sortBy = this.sortBy;
    userStorySearchCriteriaInputModel.sortDirectionAsc = this.sortDirectionAsc;
    userStorySearchCriteriaInputModel.searchText = this.searchText;
    userStorySearchCriteriaInputModel.entityId = this.selectedEntity;
    userStorySearchCriteriaInputModel.ownerUserId = this.userId;
    userStorySearchCriteriaInputModel.projectId = this.projectId;

    this.dashboardService
      .searchUserStories(userStorySearchCriteriaInputModel)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.imminentDeadlinesOutputRecords = [];
          this.count = 0;
        }
        else {
          this.count = responseData.data[0].totalCount;
          this.imminentDeadlinesOutputRecords = responseData.data;
          this.count = this.imminentDeadlinesOutputRecords[0].totalCount;
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
    this.getImminentDeadLines();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.searchText = null;
    this.getImminentDeadLines();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getImminentDeadLines();
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
    this.getImminentDeadLines();
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
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
    this.getImminentDeadLines();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = null;
    this.getImminentDeadLines();
  }
}
