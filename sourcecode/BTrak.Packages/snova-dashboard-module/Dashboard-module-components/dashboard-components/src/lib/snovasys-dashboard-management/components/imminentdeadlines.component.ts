import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { UserStorySearchCriteriaOutputModel } from '../models/user-stories-search-criteria-model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { DashboardService } from '../services/dashboard.service';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: 'app-dashboard-component-imminentdeadlines',
  templateUrl: 'imminentdeadlines.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ImminentDeadlinesComponent extends CustomAppBaseComponent implements OnInit {
  Offset: string;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = data.projectId;
      if (data.userId == null) {
        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.cdRef.markForCheck();
        this.getImminentDeadLines();
      } else {
        this.userId = data.userId;
        this.cdRef.markForCheck();
        this.getImminentDeadLines();
      }
    }
  }
  @Output() closePopUp = new EventEmitter<any>();
  dashboardFilters: DashboardFilterModel;
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
  isFromProfile: boolean = false;
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
    private toaster: ToastrService, private dashboardService: DashboardService, private routes: Router) {
    super();
    this.pageNumber = 0;

    if (this.router.url.includes('profile')) {
      this.isFromProfile = true;
      this.cdRef.markForCheck();
    }
  }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    super.ngOnInit();
    this.getSoftLabels();
    this.pageSize = 10;
    this.getEntityDropDown();
    this.getImminentDeadLines();
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
    let userId: string;
    this.anyOperationInProgress = true;
    if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
      userId = this.routes.url.split("/")[3];
    }
    const userStorySearchCriteriaInputModel = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteriaInputModel.dependencyText = "ImminentDeadline";
    userStorySearchCriteriaInputModel.pageNumber = this.pageNumber + 1;
    userStorySearchCriteriaInputModel.pageSize = this.pageSize;
    userStorySearchCriteriaInputModel.sortBy = this.sortBy;
    userStorySearchCriteriaInputModel.sortDirectionAsc = this.sortDirectionAsc;
    userStorySearchCriteriaInputModel.searchText = this.searchText;
    userStorySearchCriteriaInputModel.entityId = this.selectedEntity;
    userStorySearchCriteriaInputModel.ownerUserId = this.isFromProfile ? userId : null;
    userStorySearchCriteriaInputModel.projectId = this.projectId;

    this.dashboardService
      .searchAllUserStories(userStorySearchCriteriaInputModel)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.imminentDeadlinesOutputRecords = [];
          this.count = 0;
        }
        else {
          this.count = responseData.data[0].totalCount;
          this.imminentDeadlinesOutputRecords = responseData.data;
          this.count = this.imminentDeadlinesOutputRecords[0].totalCount;

          setTimeout(function(){ 
            $("#style-1" + ' datatable-body').addClass('widget-scroll');
          }, 1400);
          
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
