import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeUserStoryData } from '../models/employeeUserStoryData';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { SelectStatusDropDownList } from '../models/selectStatusDropDownList';
import { ProductivityDashboardModel } from '../models/productivityDashboardModel';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { UserModel } from '../models/user-details.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-employeeUserStory',
  templateUrl: './employee-user-stories.component.html'
})

export class EmployeeUserStoriesComponent extends CustomAppBaseComponent implements OnInit {
  Offset: string;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.employeeId = null;
      this.projectId = this.dashboardFilters.projectId;
      this.getAllEmployeeUserStories();
    }
  }

  @Output() closePopUp = new EventEmitter<any>();

  dashboardFilters: DashboardFilterModel;
  date: Date = new Date();
  dateFrom = this.date;
  dateTo = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  searchText: string = '';
  selectedStatus: string = '0';
  pageNumber: number = 0;
  sortBy: string;
  sortDirectionAsc: boolean;
  projectId: string;
  employeeId: string = null;
  userStoryStatusId: string;
  pageSize: number = 10;
  anyOperationInProgress: boolean;
  employeeUserStories: EmployeeUserStoryData[] = [];
  employeeList = [];
  teamleadslist: any[];
  statusList: SelectStatusDropDownList[];
  totalCount: number = 0;
  validationMessage: string;
  isOpen: boolean = true;
  fromdateFilterIsActive: boolean = true;
  todateFilterIsActive: boolean = true;
  scrollbarH: boolean = false;
  statusFilterIsActive: boolean = false;
  employeeFilterIsActive: boolean;
  searchIsActive: boolean;
  featureIsActive: boolean;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  softLabels: SoftLabelConfigurationModel[];

  constructor(
    private datePipe: DatePipe,
    private productivityDashboardService: ProductivityDashboardService,
    private toaster: ToastrService, private router: Router,
    private cdRef: ChangeDetectorRef) {
    super();
    // this.dateTo = new Date(this.dateTo.getFullYear(), 
    // this.dateTo.getMonth(), 
    // this.dateTo.getDate() + 1);
    // this.dateFrom = new Date(this.dateFrom.getFullYear(), 
    // this.dateFrom.getMonth(), 
    // this.dateFrom.getDate() + 1);
    this.date = new Date();
    this.dateFrom = this.date;
    this.dateTo = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    super.ngOnInit();
    this.getAllUsers();
    this.getAllStatus();
    this.getEntityDropDown();
    if (!this.dashboardFilters)
      this.getAllEmployeeUserStories();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    this.pageNumber = 0;
    if (sort.dir === 'asc')
      this.sortDirectionAsc = true;
    else
      this.sortDirectionAsc = false;
    this.pageNumber = 0;
    this.getAllEmployeeUserStories();
  }

  onPageChange(data) {
    this.pageNumber = data.offset;
    this.pageSize = 10;
    this.cdRef.markForCheck();
    this.getAllEmployeeUserStories();
  }

  getUserStoriesBasedOnEmployee(event) {
    this.pageNumber = 0;
    this.employeeId = event;
    this.getAllEmployeeUserStories();
    this.employeeFilterIsActive = true;
  }

  getUserStoriesBasedOnStatus() {
    this.userStoryStatusId = this.selectedStatus;

    this.getAllEmployeeUserStories();
    this.statusFilterIsActive = true;
    this.pageNumber = 0;
  }

  searchRecords() {
    if (this.searchText) {
      this.searchIsActive = true;
    }
    else {
      this.searchIsActive = false;
    }
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.pageNumber = 0;
    this.searchText = this.searchText.trim();
    this.getAllEmployeeUserStories();
  }

  closeSearch() {
    this.searchText = '';
    this.searchIsActive = false;
    this.getAllEmployeeUserStories();
  }

  getDateFrom(event) {
    this.dateFrom = event;

    this.getAllEmployeeUserStories();
    this.pageNumber = 0;
  }
  getDateTo(event) {
    this.dateTo = event;
    this.getAllEmployeeUserStories();
    this.pageNumber = 0;
  }


  getAllUsers() {
    var userModel = new UserModel();
    this.productivityDashboardService.getAllUsers(userModel).subscribe((responseData: any) => {
      this.employeeList = responseData.data;
      this.teamleadslist = _.where(this.employeeList, { roleId: '3269ca75-879d-44ba-99e1-a94b8ca80e64' });
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getAllStatus() {
    this.productivityDashboardService.getAllStatus().subscribe((responseData: any) => {
      this.statusList = responseData.data;
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    });
  }

  getAllEmployeeUserStories() {
    this.anyOperationInProgress = true;
    let productivityDashboard = new ProductivityDashboardModel();
    productivityDashboard.pageSize = this.pageSize;
    productivityDashboard.pageNumber = this.pageNumber + 1;
    productivityDashboard.sortBy = this.sortBy;
    productivityDashboard.sortDirectionAsc = this.sortDirectionAsc;
    productivityDashboard.searchText = this.searchText;
    productivityDashboard.projectId = this.projectId;
    if (this.employeeId && this.employeeList && this.employeeList.length > 0) {
      let index = this.employeeList.findIndex(x => x.id == this.employeeId.toLowerCase());
      if (index == -1) {
        this.employeeId = null;
        this.cdRef.markForCheck();
      }
    }
    productivityDashboard.ownerUserId = this.employeeId;
    productivityDashboard.userStoryStatusId = this.userStoryStatusId;
    productivityDashboard.entityId = this.selectedEntity;
    productivityDashboard.deadLineDateFrom = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');;
    productivityDashboard.deadLineDateTo = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
    this.productivityDashboardService.getEmployeeUserStories(productivityDashboard).subscribe((responseData: any) => {
      if (responseData.data.length != 0) {
        this.employeeUserStories = responseData.data;
        this.scrollbarH = true;
        this.totalCount = this.employeeUserStories[0].totalCount;
      } else {
        this.totalCount = 0;
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    });
  }
  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.statusFilterIsActive = false;
    this.employeeFilterIsActive = false;
    this.date = new Date();
    this.dateFrom = this.date;
    this.dateTo = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.selectedStatus = '';
    this.employeeId = null;
    this.userStoryStatusId = '';
    this.searchIsActive = false;
    this.searchText = '';
    this.selectedEntity = "";
    this.pageSize = 10;
    this.pageNumber = 0;
    this.getAllEmployeeUserStories();
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
    this.router.navigate(["dashboard/profile", url, "overview"]);
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
    this.getAllEmployeeUserStories();
  }
}