import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core'
import { MainDashboardService } from '../services/maindashboard.service';
import { GoalsArchive } from '../models/goalsarchive';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { TeamLeadsService } from '../services/teamleads.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'underscore';
@Component({
  selector: 'app-dashboard-component-goalsarchive',
  templateUrl: './goals-to-archive.component.html',
})

export class GoalsArchiveComponent extends CustomAppBaseComponent implements OnInit {

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
  pageSize: number = 10;
  goalsArchiveRecords: any;
  SearchText: string;
  anyOperationInProgress: boolean;
  SortBy: any;
  projectId: string;
  sortDirectionAsc: boolean;
  pageNumber: number = 0;
  count: number;
  projectLabel: string;
  goalLabel: string;
  public ngDestroyed$ = new Subject();
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  validationMessage: string;

  constructor(
    private mainDashboardService: MainDashboardService, private router: Router,
    private cdRef: ChangeDetectorRef, private productivityService: ProductivityDashboardService,
    private toaster: ToastrService,private teamLeadService : TeamLeadsService,
    private cookieService: CookieService) {
    super();
    this.pageSize = 10;
    this.pageNumber = 0;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getGoalsToArchive();
    this.getEntityDropDown();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getGoalsToArchive();
  }

  onSelect(event) {
    this.closePopUp.emit(true);
    let entityTypeFeatureForViewGoals = 'F3195B7A-C116-4BB0-9722-CEFFCB5E126D';
    entityTypeFeatureForViewGoals = entityTypeFeatureForViewGoals.toLowerCase();
    this.teamLeadService.getAllPermittedEntityRoleFeatures(event.selected[0].projectId).subscribe((roleFeatures: any) => {
      if (roleFeatures.success == true) {
        let entityRoleFeatures = roleFeatures.data;
        localStorage.setItem(LocalStorageProperties.EntityRoleFeatures, JSON.stringify(roleFeatures.data));
        var viewGoalsPermisisonsList = _.filter(entityRoleFeatures, function (permission) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewGoals)
        })
          if (viewGoalsPermisisonsList.length > 0) {
            this.cookieService.set("selectedProjectsTab", "active-goals");
            this.router.navigate([
              "projects/projectstatus",
              event.selected[0].projectId,
              "active-goals"
            ]);
          } else {
            this.router.navigate([
              "projects/projectstatus",
              event.selected[0].projectId,
              "documents"
            ]);
          }
      }
    })
  }

  sortChange(event) {
    const sort = event.sorts[0];
    this.SortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.pageNumber = 0;

    this.pageSize = 10;
    this.getGoalsToArchive();
  }

  getGoalsToArchive() {
    let goalsToArchive = new GoalsArchive();
    goalsToArchive.SearchText = this.SearchText;
    goalsToArchive.PageSize = this.pageSize;
    goalsToArchive.SortBy = this.SortBy;
    goalsToArchive.SortDirectionAsc = this.sortDirectionAsc;
    goalsToArchive.PageNumber = this.pageNumber + 1;
    goalsToArchive.PageSize = this.pageSize;
    goalsToArchive.entityId = this.selectedEntity;
    goalsToArchive.projectId = this.projectId;

    this.mainDashboardService
      .GetGoalsToArchive(goalsToArchive)
      .subscribe((responseData: any) => {
        if (responseData.data.length === 0) {
          this.goalsArchiveRecords = [];
          this.count = 0;
        }
        else {

          this.goalsArchiveRecords = responseData.data;
          this.count = this.goalsArchiveRecords[0].totalCount;
        }
      });
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
    this.getGoalsToArchive();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getGoalsToArchive();
  }

}