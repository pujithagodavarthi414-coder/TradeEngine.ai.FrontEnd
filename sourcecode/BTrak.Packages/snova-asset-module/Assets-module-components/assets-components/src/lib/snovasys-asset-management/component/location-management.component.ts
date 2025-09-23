import { Component, ViewChildren, ViewChild, Input } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { LocationManagement } from "../models/location-management";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from "../store/reducers/index";
import { LoadBranchTriggered } from "../store/actions/branch.actions";
import { LoadLocationsTriggered, CreateLocationTriggered, LocationActionTypes } from "../store/actions/location.actions";
import { Page } from '../models/page';
import { Branch } from '../models/branch';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { SoftLabelConfigurationModel } from '../models/softlabelconfiguration.model';
import { UserDropDownModel } from '../models/user-dropdown.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import { UsersActionTypes, LoadUsersDropDownTriggered } from '../store/actions/users-dropdown.actions';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-location-management",
  templateUrl: `location-management.component.html`
})

export class LocationManagementComponent extends CustomAppBaseComponent {
  @ViewChild("namePopover") namePopover: SatPopover;
  @ViewChild("branchPopover") branchPopover: SatPopover;
  @ViewChildren("addLocationPopover") addLocationPopover;
  @ViewChildren("locationPopover") deleteLocationPopovers;
  @ViewChild("formDirective") formDirective: FormGroupDirective;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  locationList$: Observable<LocationManagement[]>;
  savingLocationInProgress$: Observable<boolean>;
  locationGridSpinner$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  selectEmployeeDropDownListData$: Observable<UserDropDownModel[]>;
  branchList$: Observable<Branch[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;

  seatingModel: LocationManagement;
  locationData: LocationManagement;
  selectEmployeeDropDownListData: UserDropDownModel[];
  softLabels: SoftLabelConfigurationModel[];
  page = new Page();

  formId: FormGroupDirective;
  locationForm: FormGroup;
  searchText: string = "";
  selectedEmployeeId = "";
  searchSeatCode: string = "";
  selectedBranchId: string = "";
  timeStamp: any;
  isOpen: boolean = true;
  searchByEmployeeName: boolean = false;
  searchBySeatCodes: boolean = false;
  searchByBranch: boolean = false;
  sortBy: string = "employeeName";
  sortDirection: boolean = true;
  userSearchText: string = "";
  seatingId: string;
  selectedEmployee: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  validationMessage: string;
  public ngDestroyed$ = new Subject();
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(private store: Store<State>, private actionUpdates$: Actions,
    private router: Router, private toastr: ToastrService, private assetService: AssetService) {
    super();
    this.clearForm();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(LocationActionTypes.LoadLocationsCompleted),
        tap(() => {
          this.locationList$ = this.store.pipe(select(assetModuleReducer.getLocationsAll));
          this.locationList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(LocationActionTypes.CreateLocationCompleted),
        tap(() => {
          this.closeDialog();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(UsersActionTypes.LoadUsersDropDownCompleted),
        tap(() => {
          this.selectEmployeeDropDownListData$ = this.store.pipe(select(assetModuleReducer.getUserDropDownAll), tap(result => {
            this.selectEmployeeDropDownListData = result
          }));
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.page.size = 20;
    this.page.pageNumber = 0;
    this.selectedEmployeeId = "";
    this.getEntityDropDown();
    this.getAllLocationManagementList();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
    this.anyOperationInProgress$ = this.store.pipe(
      select(assetModuleReducer.createLocationLoading)
    );
    if (this.canAccess_feature_AddOrUpdateLocation) {
      this.getUsersList();
      this.getAllBranches();
    }
  }

  getSoftLabels() {
    this.softLabels$ = this.store.pipe(select(assetModuleReducer.getSoftLabelsAll));
    this.softLabels$.subscribe((x) => this.softLabels = x);
  }

  getAllBranches() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(assetModuleReducer.getBranchAll));
  }

  branchSelected(BranchId) {
    this.selectedBranchId = BranchId;
  }

  getUsersList() {
    this.store.dispatch(new LoadUsersDropDownTriggered(this.userSearchText));
  }

  closeSearch() {
    this.searchSeatCode = "";
    this.searchBySeatCodes = false;
    this.getAllLocationManagementList();
  }

  editLocationPopupOpen(row, addLocationPopover) {
    this.locationForm.patchValue(row);
    this.seatingId = row.seatingId;
    this.timeStamp = row.timeStamp;
    this.getEmployeeName(row.employeeId);
    addLocationPopover.openPopover();
  }

  addLocationDetail(addLocationPopover) {
    addLocationPopover.openPopover();
  }

  searchByName(employeeId) {
    if (employeeId == "all") {
      this.selectedEmployeeId = "";
      this.searchByEmployeeName = false;
    }
    else {
      this.selectedEmployeeId = employeeId;
      this.searchByEmployeeName = true;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    // this.namePopover.close();
    this.getAllLocationManagementList();
  }

  searchBySeatCode() {
    if (this.searchSeatCode == "")
      this.searchBySeatCodes = false;
    else
      this.searchBySeatCodes = true;
    if (this.searchSeatCode.length > 0) {
      this.searchSeatCode = this.searchSeatCode.trim();
      if (this.searchSeatCode.length <= 0) return;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getAllLocationManagementList();
  }

  branchesSelected(BranchId) {
    if (BranchId == "all") {
      this.selectedBranchId = "";
      this.searchByBranch = false;
    }
    else {
      this.selectedBranchId = BranchId;
      this.searchByBranch = true;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    // this.branchPopover.close();
    //this.getAllLocationManagementList();
  }

  getAllLocationManagementList() {
    const locationSearchResult = new LocationManagement();
    locationSearchResult.searchText = this.searchText;
    locationSearchResult.sortBy = this.sortBy;
    locationSearchResult.sortDirectionAsc = this.sortDirection;
    locationSearchResult.pageNumber = this.page.pageNumber + 1;
    locationSearchResult.pageSize = this.page.size;
    locationSearchResult.branchId = this.selectedBranchId;
    locationSearchResult.seatCode = this.searchSeatCode;
    locationSearchResult.employeeId = this.selectedEmployeeId;
    locationSearchResult.entityId = this.selectedEntity;
    locationSearchResult.isArchived = false;
    this.store.dispatch(new LoadLocationsTriggered(locationSearchResult));
    this.locationGridSpinner$ = this.store.pipe(select(assetModuleReducer.getLocationLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllLocationManagementList();
  }

  onSort(event) {
    if (this.page.totalElements > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === "asc")
        this.sortDirection = true;
      else
        this.sortDirection = false;
      this.page.size = 30;
      this.page.pageNumber = 0;
      this.getAllLocationManagementList();
    }
  }

  saveLocation() {
    this.locationData = this.locationForm.value;
    this.upsertLocation();
  }

  getLocationId(seatingModel, locationPopover) {
    this.seatingModel = seatingModel;
    locationPopover.openPopover();
  }

  deleteSeatLocation() {
    this.locationData = new LocationManagement();
    this.locationData.seatingId = this.seatingModel.seatingId;
    this.locationData.employeeId = this.seatingModel.employeeId;
    this.locationData.seatCode = this.seatingModel.seatCode;
    this.locationData.description = this.seatingModel.description;
    this.locationData.comment = this.seatingModel.comment;
    this.locationData.timeStamp = this.seatingModel.timeStamp;
    this.locationData.branchId = this.seatingModel.branchId;
    this.locationData.isArchived = true;
    this.upsertLocation();
    this.deleteLocationPopovers.forEach((p) => p.closePopover());
  }

  cancelDeleteLocation() {
    this.seatingModel = null;
    this.deleteLocationPopovers.forEach((p) => p.closePopover());
  }

  upsertLocation() {
    if (this.seatingId) {
      this.locationData.seatingId = this.seatingId;
      this.locationData.timeStamp = this.timeStamp;
    }
    this.store.dispatch(new CreateLocationTriggered(this.locationData));
    this.savingLocationInProgress$ = this.store.pipe(select(assetModuleReducer.createLocationLoading));
  }

  closeDialog() {
    this.formDirective.resetForm();
    this.locationForm.reset();
    this.addLocationPopover.forEach((p) => p.closePopover());
    this.selectedEmployee = "";
    this.clearForm();
  }

  clearForm() {
    this.seatingId = "";
    this.timeStamp = null;
    this.selectedBranchId = "";
    this.locationForm = new FormGroup({
      employeeId: new FormControl("",
        Validators.compose([
        ])
      ),
      seatCode: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      branchId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      description: new FormControl("",
        Validators.compose([
          Validators.maxLength(800)
        ])
      ),
      comment: new FormControl("",
        Validators.compose([
          Validators.maxLength(800)
        ])
      )
    });
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.selectedEmployeeId = "";
    this.searchByEmployeeName = false;
    this.searchSeatCode = "";
    this.searchBySeatCodes = false;
    this.selectedBranchId = "";
    this.selectedEntity = "";
    this.searchByBranch = false;
    this.getAllLocationManagementList();
  }

  getEmployeeName(employeeId) {
    if (employeeId) {
      let employee = this.selectEmployeeDropDownListData.find(result => result.id === employeeId);
      this.selectedEmployee = employee.fullName;
    }
  }

  goToProfile(url) {
    this.router.navigateByUrl("dashboard/profile/" + url);
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  getEntityDropDown() {
    let searchText = "";
    this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
    this.getAllLocationManagementList();
  }
}