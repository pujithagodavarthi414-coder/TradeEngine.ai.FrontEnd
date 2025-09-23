import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeSheetService } from '../services/timesheet.service';
import { UserStorySpentTimeInputModel } from '../models/user-story-spent-model';
import { SatPopover } from '@ncstate/sat-popover';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from "../store/reducers/index";
import { ToastrService } from 'ngx-toastr';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { UserModel } from '../models/user';
import "../../globaldependencies/helpers/fontawesome-icons";

@Component({
  selector: 'app-hr-component-spenttimedetails',
  templateUrl: 'spenttimedetails.component.html',
})

export class SpentTimeDetailsComponent {
  @ViewChild("spentTimeFilter") spentTimeFilter: SatPopover;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
      this.getSpentTimeDetails();
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  SearchText: string;
  spentTimereportList: any;
  spentTimeSkip: number = 0;
  spentTimePageSize: number = 10;
  spentTimeSortBy: string;
  spentTimeSortDirection: boolean;
  spentTimePageNumber: number = 1;
  spentTimeSearchText: string;
  skip: number;
  projectslist: any[];
  EmployeeList: any[];
  Teamleadslist: any[];
  isUser: boolean = null;
  isDate: boolean = null;
  isHour: boolean = null;
  checked: boolean = true;
  checkedIsUser: boolean;
  checkedIsHour: boolean;
  checkedIsDate: boolean;
  count: number;
  projectId: string = null;
  userId: string;
  userDescription: string = 'any';
  datedescription: string = 'any';
  selectedDateTo: Date;
  selectedDateFrom: Date;
  days: number;
  hourDescription: string = 'any';
  selectedHourFrom: number;
  selectedHourTo: number;
  showEmployee: boolean = false;
  showDatepicker1: boolean = false;
  showDatepicker2: boolean = false;
  dayselect: boolean = false;
  showhourFrom: boolean = false;
  showhourTo: boolean = false;
  workItemText: string = 'Work item';
  projectText: string = 'Select Project';
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  validationMessage: string;
  adapters: any[] = ['vmnic0', 'vmnic1', 'vmnic2', 'vmnic3', 'vmnic4', 'vmnic5', 'vmnic6', 'vmnic7', 'vmnic8', 'vmnic9', 'vmnic10',]
  userFilter: any[] = [
    'any',
    'is',
    'isnot',
    'none',
  ]
  hoursFilter: any[] = [
    'any',
    'is',
    '>=',
    '<=',
    'between',
    'none'
  ]
  dateFilter: any[] = [
    'any',
    'is',
    '>=',
    '<=',
    'between',
    'lessthandaysago',
    'morethandaysago',
    'inthepast',
    'daysago',
    'today',
    'yesterday',
    'thisweek',
    'lastweek',
    'last2weeks',
    'thismonth',
    'lastmonth',
    'thisyear',
    'none'
  ]

  constructor(private timeSheetService: TimeSheetService, private store: Store<State>, private toaster: ToastrService) { }

  ngOnInit() {
    this.getSpentTimeDetails();
    this.getEntityDropDown();
    this.GetAllProjects();
    this.GetAllUsers();
    this.getSoftLabelConfigurations();
    this.getSpentTimeDetails();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  getSpentTimeDetails() {
    var userStorySpentTimeInputModel: UserStorySpentTimeInputModel;
    userStorySpentTimeInputModel = new UserStorySpentTimeInputModel();
    userStorySpentTimeInputModel.pageNumber = this.spentTimePageNumber;
    userStorySpentTimeInputModel.pageSize = this.spentTimePageSize;
    userStorySpentTimeInputModel.sortBy = this.spentTimeSortBy;
    userStorySpentTimeInputModel.entityId = this.selectedEntity;
    userStorySpentTimeInputModel.sortDirectionAsc = this.spentTimeSortDirection;
    if (this.projectId != null) {
      userStorySpentTimeInputModel.projectId = this.projectId;
    }
    userStorySpentTimeInputModel.userDescription = this.userDescription;
    userStorySpentTimeInputModel.dateDescription = this.datedescription;
    userStorySpentTimeInputModel.hoursDescription = this.hourDescription;
    if (this.userDescription != 'any') {
      userStorySpentTimeInputModel.userId = this.userId;
    }
    if (this.datedescription != 'any') {
      userStorySpentTimeInputModel.dateFrom = this.selectedDateFrom;
      userStorySpentTimeInputModel.dateTo = this.selectedDateTo;
      userStorySpentTimeInputModel.days = this.days;
    }
    if (this.hourDescription != 'any') {
      userStorySpentTimeInputModel.hoursFrom = this.selectedHourFrom;
      userStorySpentTimeInputModel.hoursTo = this.selectedHourTo;
    }
    this.timeSheetService.getSpentTimeDetails(userStorySpentTimeInputModel).subscribe((responseData: any) => {
      if (responseData.data.length == 0) {
        this.spentTimereportList = null;
      }
      else {
        this.count = responseData.data[0].totalCount;
        this.spentTimereportList = responseData.data;
        this.count = this.spentTimereportList[0].totalCount;
      }
    })
  }

  spentTimeBasedOnPaging(event) {
    this.spentTimeSkip = event.skip;
    this.spentTimePageSize = 10;
    this.spentTimePageNumber = (event.skip / event.take) + 1;
    this.spentTimePageSize = event.take;
    this.spentTimeSearchText = null;
    this.spentTimeSortBy = null;
    this.spentTimeSortDirection = true;
    this.getSpentTimeDetails();
  }

  EmployeesspentTimeBasedOnSorting(event) {
    if (this.spentTimeSortBy === null) {
      this.spentTimeSortDirection = true;
    }
    if (this.spentTimeSortBy === event[0].field) {
      this.spentTimeSortDirection = !this.spentTimeSortDirection;
    } else {
      this.spentTimeSortDirection = true;
    }
    this.spentTimeSortBy = event[0].field;
    this.spentTimeSkip = 0;
    this.spentTimePageSize = 10;
    this.getSpentTimeDetails();
  }

  SearchEmployeesspentTime(event) {
    this.spentTimeSkip = event.skip;
    this.spentTimePageSize = 10;
    this.spentTimePageNumber = 1;
    this.spentTimePageSize = 10;
    this.spentTimeSearchText = event;
    this.spentTimeSortBy = null;
    this.spentTimeSortDirection = true;
    this.getSpentTimeDetails();
  }

  Search(state: any) {
    // this.UserWorkAllocation.emit(state);
  }

  searchRecords() {
    this.SearchEmployeesspentTime(this.SearchText);
  }

  onPageChange(state: any) {
    this.spentTimeBasedOnPaging(state);
  }

  GetAllProjects() {
    this.timeSheetService.getAllProjects().subscribe((responseData: any) => {
      console.log(responseData.data);
      this.projectslist = responseData.data;
    });
  }

  GetAllUsers() {
    var userModel = new UserModel();
    userModel.isArchived = false;
    this.timeSheetService.getAllUsers(userModel).subscribe((responseData: any) => {
      console.log(responseData.data);
      this.EmployeeList = responseData.data;
    })
  }

  GetSpentTimeBasedOnEmployee(event) {
    console.log(event);
    if (event === 0) {
      event = null;
    }
  }

  GetSpentTimeByFilter() {
    this.getSpentTimeDetails();
    this.spentTimeFilter.close();

  }

  SearchByUser(checkedIsUser) {
    this.isUser = checkedIsUser;
    this.checked = false;
    this.userId = null;
    this.userDescription = 'any';
  }

  SearchByHour(checkedIsHour) {
    this.isHour = checkedIsHour;
    this.checked = false;
    this.hourDescription = 'any';
    this.selectedHourFrom = 0;
    this.selectedHourTo = 0;
  }

  SearchByDate(checkedIsDate) {
    this.isDate = checkedIsDate;
    this.checked = false;
    this.datedescription = 'any';
    this.selectedDateTo = null;
    this.selectedDateFrom = null;
    this.days = 0;
  }

  GetSpentTimeByProject(event) {
    console.log(event);
    if (event === 0) {
      event = null;
    }
  }

  GetEmployeeList(event) {
    if (event === 0) {
      event = null;
    }
    this.userDescription = event;
    if (this.userDescription === "is" || this.userDescription === "isnot") {
      this.showEmployee = true;
    }
    else {
      this.showEmployee = false;
    }
  }

  GetEmployeeChange(event) {
    console.log(event);
    if (event === 0) {
      event = null;
    }
    this.userId = event;
  }

  showHours(event) {
    if (event === 0) {
      event = null;
    }
    this.hourDescription = event;
    if (this.hourDescription === "is" || this.hourDescription === ">=" || this.hourDescription === "<=") {
      this.showhourFrom = true;
      this.showhourTo = false;
    }
    if (this.hourDescription === "between") {
      this.showhourFrom = true;
      this.showhourTo = true;
    }
    if (this.hourDescription === "any" || this.hourDescription === "none") {
      this.showhourFrom = false;
      this.showhourTo = false;
    }
  }

  showDates(event) {
    if (event === 0) {
      event = null;
    }
    this.datedescription = event;
    if (this.datedescription === "is" || this.datedescription === ">=" || this.datedescription === "<=") {
      this.showDatepicker1 = true;
      this.showDatepicker2 = false;
      this.dayselect = false;
    }
    if (this.datedescription === "between") {
      this.showDatepicker1 = true;
      this.showDatepicker2 = true;
      this.dayselect = false;
    }
    if (this.datedescription === "lessthandaysago" || this.datedescription === "morethandaysago" || this.datedescription === "inthepast" ||
      this.datedescription === "daysago") {
      this.showDatepicker1 = false;
      this.showDatepicker2 = false;
      this.dayselect = true;
    }
    if (this.datedescription === "today" || this.datedescription === "yesterday" || this.datedescription === "thisweek" || this.datedescription === "lastweek" || this.datedescription === "thismonth" || this.datedescription === "lastmonth" || this.datedescription === "thisyear" || this.datedescription === "none" || this.datedescription === "any" || this.datedescription === "last2weeks") {
      this.showDatepicker1 = false;
      this.showDatepicker2 = false;
      this.dayselect = false;
    }
  }

  ClearFilters() {
    this.selectedEntity = "";
    this.checkedIsUser = false;
    this.checkedIsHour = false;
    this.checkedIsDate = false;
    this.projectId = null;
    this.hourDescription = 'any';
    this.selectedHourFrom = 0;
    this.selectedHourTo = 0;
    this.datedescription = 'any';
    this.selectedDateTo = null;
    this.selectedDateFrom = null;
    this.days = 0;
    this.userId = null;
    this.userDescription = 'any';
    this.getSpentTimeDetails();
    this.spentTimeFilter.close();
  }

  getEntityDropDown() {
    let searchText = "";
    this.timeSheetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
  }
}
