import { Component, Output, EventEmitter, ViewChildren, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Observable, Subject, Subscription } from "rxjs";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormArray } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { State } from "../store/reducers/index";
import { select, Store } from '@ngrx/store';
import { UserModel } from '../models/user';
import { ChangePasswordModel } from '../models/change-password-model';

import { UserService } from '../services/user.Service';

import { ChangePasswordTriggered, ChangePasswordActionTypes } from '../store/actions/change-password.actions';

import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
import { LoadTimeZoneListItemsTriggered } from '../store/actions/time-zone.actions';
import * as hrManagementModuleReducer from "../store/reducers/index";
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { Currency } from '../models/currency';
import { Page } from '../models/Page';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { TimeZoneModel } from '../models/time-zone';
import { EmployeeService } from '../services/employee-service';
import { LoadCurrencyTriggered } from '../store/actions/currency.actions';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { UserActionTypes, CreateUsersTriggered } from '../store/actions/userList.actions';
import '../../globaldependencies/helpers/fontawesome-icons';
import { AvailableLangs } from "@snovasys/snova-shell-module";
import { ActivityConfigurationUserModel } from '../models/activity-configuration-user-model'
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { DesktopModel } from '../models/tracker-desktop.model';
import { Guid } from 'guid-typescript';
import { IntroModel } from '../models/IntroModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hr-component-usermanagement',
  templateUrl: 'usermanagement.component.html',
})

export class UserManagementComponent extends CustomAppBaseComponent {
  @ViewChildren("addTrackerPopover") addTrackerPopover;
  @ViewChildren('UserPopover') UserPopover;
  @ViewChildren('updatePasswordPopover') changePasswordPopovers;
  @ViewChild("formDirective") formDirective: FormGroupDirective;
  @ViewChild("passwordFormDirective") passwordFormDirective: FormGroupDirective;
  @ViewChild("allRolesSelected") private allSelected: MatOption;
  @ViewChild("allModulesSelected") private allModulesSelected: MatOption;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;

  @Output() GetAllUsers = new EventEmitter<string>();

  updateForm: FormGroup;
  changePasswordForm: FormGroup;
  activityForm: FormGroup;
  addTimeZoneElement: FormArray;
  upsertUserData: UserModel;
  upsertPassword: ChangePasswordModel;
  upsertUserDat: any;
  isFromAdd = true;
  success: boolean;
  rolesDropDown: any[];
  modulesDropDown: any[];
  showSpinner: boolean;
  userId: string;
  searchText: string = '';
  sortBy: string;
  currencyList$: Observable<Currency[]>;
  dataItem: any;
  sortDirection: boolean = true;
  timeStamp: any;
  profileImage: string;
  page = new Page();
  isOpen: boolean = true;
  selectedType: boolean = true;
  branchIsActive: boolean = true;
  scroll: boolean = true;
  selectedStatusId: string = 'active';
  isPassword: boolean = false;
  validationMessage: string = '';
  isAllowSpecialCharacterForFirstName: boolean;
  isAllowSpecialCharacterForLastName: boolean;
  selectedRoles: string
  selectedModules: string
  moduleId: string;
  companyLang: any;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  userManagementList$: Observable<UserModel[]>;
  userManagementList: UserModel[] = [];
  UpdateOperationInProgress$: Observable<boolean>;
  changePasswordOperationInProgress$: Observable<boolean>;
  userManagementDataLoading$: Observable<boolean>;
  timeZoneList$: Observable<TimeZoneModel[]>;
  isLoading: boolean = false;
  userLanguages = AvailableLangs.languages;

  upsertEmployeeInProgress$: Observable<boolean>;
  /* ENABLE TRACKING */
  selectedAppUrl: string = null;
  screenshotTime: number;
  appsUrlToggle: any;
  screenshotTimeFrequency: any;
  multiplier: any;
  track: boolean;
  active: any;
  desktopsDropdown: DesktopModel[] = [];
  employeeId: string;
  activityTrackerUserId: string;
  atuTimeStamp: any;
  appUrlId: string;
  upsertEnableTracking: boolean = false;
  isRecordActivity: boolean = false;
  isMouse: boolean = false;
  isScreenshot: boolean = false;
  appsTrack: boolean = false;
  /* ENABLE TRACKING */

  public ngDestroyed$ = new Subject();
  oldModuleIds: any[] = [];
  newModuleIds: any[] = [];

  searchTextChanged = new Subject<any>();
  subscription: Subscription;
  timeZonesList: TimeZoneModel[];
  timeZoneListCopy: any[];
  desktopListCopy: any[];

  constructor(private userService: UserService, private store: Store<State>, private actionUpdates$: Actions,
    private cookieService: CookieService,
    private toaster: ToastrService, private router: Router, private cdRef: ChangeDetectorRef, private employeeService: EmployeeService,) {
    super();
    this.page.size = 500;
    this.page.pageNumber = 0;

    this.clearTrackerForm();
    this.getUsersList();
    this.clearForm();
    this.getAllRoles();
    this.getAllModules();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserActionTypes.CreateUsersCompleted),
        tap((data: any) => {

          if (data != null && data.userId != null && data.userId != '')
            this.getUsersList();
          let temp = [];
          if (data != null && data.userId == this.cookieService.get(LocalStorageProperties.CurrentUserId)
            && this.checkModules(this.newModuleIds, this.oldModuleIds)) {
            this.getIntroDetails();
          }
        })
      )
      .subscribe();

    window.onresize = () => {
      this.scroll = (window.innerWidth < 1200);
    };

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserActionTypes.CreateUsersCompleted),
        tap(() => {
          this.closeDialog();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserActionTypes.RemoveUserFromList),
        tap(() => {
          this.closeDialog();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ChangePasswordActionTypes.ChangePasswordCompleted),
        tap(() => {
          this.closePopup();
          this.getUsersList();
        })
      )
      .subscribe();
  }

  getAllRoles() {
    this.employeeService.getRoles().subscribe((responseData: any) => {
      this.rolesDropDown = responseData.data;
    })
  }
  getAllModules() {
    this.employeeService.getModules().subscribe((responseData: any) => {
      this.modulesDropDown = responseData.data;
    })
  }
  clearForm() {
    this.showSpinner = false;
    this.selectedRoles = null;
    this.selectedModules = null;
    this.updateForm = new FormGroup({
      userId: new FormControl(''
      ),
      password: new FormControl(''),
      firstName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])
      ),
      surName: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      email: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
      mobileNo: new FormControl('',
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      timeZoneId: new FormControl(null,
        Validators.compose([
        ])
      ),
      desktopId: new FormControl(null,
        Validators.compose([
        ])
      ),
      language: new FormControl(null,
        Validators.compose([
        ])
      ),
      roleIds: new FormControl('', [
      ]),
      moduleIds: new FormControl('', [
      ]),
      isAdmin: new FormControl('', [
      ]),
      isActive: new FormControl('', [
      ]),
      isExternal: new FormControl('', [
      ])
    })
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeChangePasswordForm();
    this.getEntityDropDown();
    this.getCurrencyList();
    this.getTimeZoneList();
    this.subscription = this.searchTextChanged
    .pipe(debounceTime(800),
          distinctUntilChanged()
     )
    .subscribe(term => {
      this.searchText = term;
      this.getUsersList();
    })
    this.UpdateOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createUserLoading));
  }

  getDesktops() {
    const desktopModel = new DesktopModel()
    this.employeeService.getDesktops(desktopModel).subscribe((responseData: any) => {
      if (responseData.success == true){
      this.desktopsDropdown = responseData.data;
      this.desktopListCopy = responseData.data;
      }
    })
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 500;
    this.page.pageNumber = 0;
    this.searchTextChanged.next(this.searchText);
    //this.getUsersList();
  }

  closeSearch() {
    this.searchText = '';
    this.getUsersList();
  }

  getCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
    this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
  }

  getTimeZoneList() {
    const timeZoneModel = new TimeZoneModel();
    timeZoneModel.isArchived = false;
    this.store.dispatch(new LoadTimeZoneListItemsTriggered(timeZoneModel));
    this.timeZoneList$ = this.store.pipe(select(hrManagementModuleReducer.getTimeZoneAll));
    this.timeZoneList$.subscribe((x) => this.timeZoneListCopy = x);
    this.timeZoneList$.subscribe((x) => this.timeZonesList = x);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getUsersList()
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.page.size = 500;
    this.page.pageNumber = 0;
    this.getUsersList()
  }

  searchByEmployee(branchId) {
    if (branchId == "all") {
      this.selectedType = null;
      this.branchIsActive = false;
    }
    else if (branchId == "active") {
      this.selectedType = true;
      this.branchIsActive = true;
    }
    else {
      this.selectedType = false;
      this.branchIsActive = true;
    }
    this.page.size = 500;
    this.page.pageNumber = 0;
    this.getUsersList();
  }

  closeDialog() {
    this.formDirective.resetForm();
    this.UserPopover.forEach((p) => p.closePopover());
    this.clearForm();
    this.timeStamp = '';
    this.profileImage = '';
  }
  getUsersList() {
    this.isLoading = true;
    const usersResult = new UserModel();
    usersResult.sortBy = this.sortBy;
    usersResult.sortDirectionAsc = this.sortDirection;
    usersResult.searchText = this.searchText;
    usersResult.pageNumber = this.page.pageNumber + 1;
    usersResult.pageSize = this.page.size;
    usersResult.isActive = this.selectedType;
    usersResult.entityId = this.selectedEntity;
    usersResult.isUsersPage = true;

    this.employeeService.GetUsers(usersResult)
      .subscribe((responseData: any) => {
        this.isLoading = false;
        if (responseData.success) {
          var result = responseData.data.length > 0 ? responseData.data : [];
          this.userManagementList = result;
          this.companyLang = (this.userManagementList != [] ? (this.userManagementList.length > 0 ? this.userManagementList[0].companyLanguage : '') : '');
          this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
          this.page.totalPages = this.page.totalElements / this.page.size;
          this.scroll = true;
          this.cdRef.detectChanges();
        }
      });
  }

  updateUser() {
    this.newModuleIds = [];
    this.upsertUserData = this.updateForm.value;
    if (this.upsertUserData.language == this.companyLang) {
      this.upsertUserData.language = null;
    }
    this.upsertUserDat = this.upsertUserData
    this.upsertUserData.profileImage = this.profileImage;
    let roles = this.upsertUserDat.roleIds;
    const index2 = roles.indexOf(0);
    if (index2 > -1) {
      roles.splice(index2, 1)
    }
    this.upsertUserData.roleId = roles.toString();
    let modules = this.upsertUserDat.moduleIds;
    const index = modules.indexOf(0);
    if (index > -1) {
      modules.splice(index2, 1)
    }
    this.newModuleIds = modules;
    this.upsertUserData.moduleId = modules.toString();
    this.upsertUserData.timeStamp = this.timeStamp;
    this.upsertUserData.isAdmin = false;
    this.store.dispatch(new CreateUsersTriggered(this.upsertUserData));
    this.UpdateOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createUserLoading));
  }

  editUser(dataItem, UserPopover) {
    this.isFromAdd = false;
    this.selectedRoles = dataItem.roleName;
    this.selectedModules = dataItem.moduleName;
    this.isAllowSpecialCharacterForFirstName = true;
    this.isAllowSpecialCharacterForLastName = true;
    this.timeStamp = dataItem.timeStamp;
    this.profileImage = dataItem.profileImage;
    this.selectedModules = dataItem.moduleNames;
    var rolesIds = []
    var modulesIds = []
    var temp = []
    this.desktopsDropdown = [];
    this.oldModuleIds = [];
    var desktopModel = new DesktopModel()
    desktopModel.userId = dataItem.id;
    this.employeeService.getDesktops(desktopModel).subscribe((responseData: any) => {
      this.desktopsDropdown = responseData.data;
      this.desktopListCopy = responseData.data;
      if (this.desktopsDropdown && this.desktopsDropdown.length > 0) {
        var noDeskTop = new DesktopModel();
        noDeskTop.desktopId = null,
          noDeskTop.desktopName = 'Select none',
          this.desktopsDropdown.unshift(noDeskTop);
      }
    if (dataItem.roleIds != null) {
      temp = dataItem.roleIds.split(',')
      if (temp.length === this.rolesDropDown.length) {
        rolesIds.push(0);
      }
      dataItem.roleIds.split(',').forEach(element => {
        rolesIds.push(element);
      });
    }
    if (dataItem.moduleIds != null) {
      temp = dataItem.moduleIds.split(',')
      if (temp.length === this.modulesDropDown.length) {
        modulesIds.push(0);
      }
      dataItem.moduleIds.split(',').forEach(element => {
        modulesIds.push(element.trim().toLowerCase());
        this.oldModuleIds.push(element.trim().toLowerCase());
      });
    }
    this.updateForm = new FormGroup({
      userId: new FormControl(dataItem.id
      ),
      password: new FormControl(dataItem.password),
      firstName: new FormControl(dataItem.firstName, Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])
      ),
      surName: new FormControl(dataItem.surName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      email: new FormControl(dataItem.email,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
      // currencyId: new FormControl(dataItem.currencyId,
      //   Validators.compose([
      //     Validators.required
      //   ])
      // ),
      timeZoneId: new FormControl(dataItem.timeZoneId,
        Validators.compose([
        ])
      ),
      desktopId: new FormControl(dataItem.desktopId,
        Validators.compose([
        ])
      ),
      language: new FormControl(dataItem.language,
        Validators.compose([
        ])
      ),
      mobileNo: new FormControl(dataItem.mobileNo,
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      roleIds: new FormControl(rolesIds,
        Validators.compose([
          Validators.required
        ])
      ),
      moduleIds: new FormControl(modulesIds,
        Validators.compose([
          // Validators.required
        ])
      ),
      isAdmin: new FormControl(dataItem.isAdmin, [
      ]),
      isActive: new FormControl(dataItem.isActive, [
      ]),
      isExternal: new FormControl(dataItem.isExternal, [])
    })
    if (dataItem.language == null) {
      this.updateForm.controls["language"].setValue(this.companyLang);
    }
    else {
      this.updateForm.controls["language"].setValue(dataItem.language);
    }
    UserPopover.openPopover();
  });
  }

  addUser(UserPopover) {
    this.isFromAdd = true;
    this.selectedRoles = null;
    this.selectedModules = null;
    this.selectedModules = null;
    this.isAllowSpecialCharacterForFirstName = true;
    this.isAllowSpecialCharacterForLastName = true;
    this.timeStamp = null;
    this.profileImage = null;
    var roleIds = [];
    var moduleIds = [];
    this.desktopsDropdown = [];

    var desktopModel = new DesktopModel()
    desktopModel.userId = Guid.EMPTY;
    this.employeeService.getDesktops(desktopModel).subscribe((responseData: any) => {
      this.desktopsDropdown = responseData.data;
      this.desktopListCopy = responseData.data;
      if (this.desktopsDropdown && this.desktopsDropdown.length > 0) {
        var noDeskTop = new DesktopModel();
        noDeskTop.desktopId = null,
          noDeskTop.desktopName = 'Select none',
          this.desktopsDropdown.unshift(noDeskTop);
      }
    });

    this.updateForm = new FormGroup({
      userId: new FormControl(
      ),
      password: new FormControl(),
      firstName: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])
      ),
      surName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      email: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
      // currencyId: new FormControl(null,
      //   Validators.compose([
      //     Validators.required
      //   ])
      // ),
      timeZoneId: new FormControl(null,
        Validators.compose([
        ])
      ),
      desktopId: new FormControl(null,
        Validators.compose([
        ])
      ),
      language: new FormControl(null,
        Validators.compose([
        ])
      ),
      mobileNo: new FormControl(null,
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      roleIds: new FormControl(roleIds, [
        Validators.compose([
          Validators.required
        ])
      ]),
      moduleIds: new FormControl(moduleIds,
        Validators.compose([
          //Validators.required
        ])
      ),
      isAdmin: new FormControl(null, [
      ]),
      isActive: new FormControl(true, [
      ]),
      isExternal: new FormControl(false, [
      ])
    })
    roleIds = []
    moduleIds = []
    this.updateForm.controls["language"].setValue(this.companyLang);
    UserPopover.openPopover();
  }

  updatePassword(dataItem, updatePasswordPopover) {
    this.initializeChangePasswordForm();
    this.userId = dataItem.id;
    this.timeStamp = dataItem.timeStamp;
    this.profileImage = dataItem.profileImage;
    updatePasswordPopover.openPopover();
  }

  initializeChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      newPassword: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
          Validators.maxLength(250)
        ])
      ),
      confirmPassword: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
          Validators.maxLength(250)
        ])
      )
    })
  }

  changePassword() {
    if (this.isPassword) {
      return;
    }
    this.upsertPassword = this.changePasswordForm.value;
    this.upsertPassword.type = 1;
    this.upsertPassword.userId = this.userId;
    this.upsertPassword.timeStamp = this.timeStamp;
    this.upsertPassword.isArchived = false;
    this.store.dispatch(new ChangePasswordTriggered(this.upsertPassword));
    this.changePasswordOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.changePasswordLoading));
  }

  passwordConfirmation() {
    if (this.changePasswordForm.value.newPassword != this.changePasswordForm.value.confirmPassword) {
      this.isPassword = true;
      this.validationMessage = "Passwords should match";
      this.cdRef.detectChanges();
    }
    else {
      this.isPassword = false;
      this.cdRef.detectChanges();
    }
  }

  closePopup() {
    this.passwordFormDirective.resetForm();
    this.changePasswordPopovers.forEach((p) => p.closePopover());
    this.timeStamp = '';
    this.profileImage = '';
    this.isPassword = false;
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
    this.subscription.unsubscribe();
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  removeSpecialCharacterForFirstName() {
    if (this.updateForm.value.firstName) {
      const firstName = this.updateForm.value.firstName;
      const charCode = firstName.charCodeAt(0);
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
        (charCode >= 48 && charCode <= 57)) {
        this.isAllowSpecialCharacterForFirstName = true;
        this.cdRef.detectChanges();
      } else {
        this.isAllowSpecialCharacterForFirstName = false;
        this.cdRef.detectChanges();
      }

    } else {
      this.isAllowSpecialCharacterForFirstName = true;
    }
  }

  removeSpecialCharacterForLastName() {
    if (this.updateForm.value.surName) {
      const surName = this.updateForm.value.surName;
      const charCode = surName.charCodeAt(0);
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
        (charCode >= 48 && charCode <= 57)) {
        this.isAllowSpecialCharacterForLastName = true;
        this.cdRef.detectChanges();
      } else {
        this.isAllowSpecialCharacterForLastName = false;
        this.cdRef.detectChanges();
      }

    } else {
      this.isAllowSpecialCharacterForLastName = true;
    }
  }
 
  goToProfile(url) {
    if (url.type == 'click') {
      this.employeeService.getUserById(url.row.userId).subscribe((response: any) => {
        if (response.success == true) {
          var employeeId = response.data.employeeId;
          if (employeeId) {
            this.router.navigate(["dashboard/profile", url.row.userId, "overview"]);
          }
          else {
            this.router.navigate(["dashboard/myProfile", url.row.userId]);
          }
        }
      });
    }
  } 

  compareSelectedstories(roles: any, selectedroles: any) {
    if (roles === selectedroles) {
      return true;
    } else {
      return false;
    }
  }

  toggleAllRolesSelected() {
    if (this.allSelected.selected) {
      this.updateForm.controls['roleIds'].patchValue([
        0, ...this.rolesDropDown.map(item => item.roleId)
      ]);
    } else {
      this.updateForm.controls['roleIds'].patchValue([]);
    }
    this.getSelectedRoles()
  }
  toggleAllModulesSelected() {
    if (this.allModulesSelected.selected) {
      this.updateForm.controls['moduleIds'].patchValue([
        0, ...this.modulesDropDown.map(item => item.moduleId)
      ]);
    } else {
      this.updateForm.controls['moduleIds'].patchValue([]);
    }
    this.getSelectedModules()
  }
  getSelectedRoles() {
    const component = this.updateForm.value.roleIds;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const rolesList = this.rolesDropDown;
    const selectedUsersList = _.filter(rolesList, function (role) {
      return component.toString().includes(role.roleId);
    })
    const roleNames = selectedUsersList.map((x) => x.roleName);
    this.selectedRoles = roleNames.toString();
  }
  getSelectedModules() {
    const component = this.updateForm.value.moduleIds;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const modulesList = this.modulesDropDown;
    const selectedUsersList = _.filter(modulesList, function (module) {
      return component.toString().includes(module.moduleId);
    })
    const moduleNames = selectedUsersList.map((x) => x.moduleName);
    this.selectedModules = moduleNames.toString();
  }

  toggleGoalStatusPerOne(event) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.updateForm.controls['roleIds'].value.length ===
      this.rolesDropDown.length
    ) {
      this.allSelected.select();
    }
  }
  toggleGoalStatusPerOnemodule(event) {
    if (this.allModulesSelected.selected) {
      this.allModulesSelected.deselect();
      return false;
    }
    if (
      this.updateForm.controls['moduleIds'].value.length ===
      this.modulesDropDown.length
    ) {
      this.allModulesSelected.select();
    }
  }

  getEntityDropDown() {
    let searchText = "";
    this.employeeService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
    this.getUsersList();
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.selectedType = true;
    this.searchText = "";
    this.selectedStatusId = "active";
    this.getUsersList();
  }

  compareSelectedRolesFn(roles: any, selectedroles: any) {
    if (roles == selectedroles) {
      return true;
    } else {
      return false;
    }
  }
  compareSelectedModulesFn(modules: any, selectedmodules: any) {
    if (modules == selectedmodules) {
      return true;
    } else {
      return false;
    }
  }

  /* ENABLE TRACKING */

  trackEmployee(row, addTrackerPopover) {
    this.clearTrackerForm();
    // this.addProductiveAppForm.get('isApp').patchValue("1");
    if (row.trackEmployee) {
      this.activityForm.get('isTrack').patchValue(1);
      this.track = true;
    } else {
      this.activityForm.get('isTrack').patchValue(0);
      this.track = false;
    }
    // tslint:disable-next-line: max-line-length
    this.appsUrlToggle = row.activityTrackerAppUrlTypeId === ConstantVariables.Apps ? "App" : row.activityTrackerAppUrlTypeId === ConstantVariables.off ? "off" : row.activityTrackerAppUrlTypeId === ConstantVariables.Urls ? "Url" : row.activityTrackerAppUrlTypeId === ConstantVariables.AppsUrls ? "AppandUrl" : row.activityTrackerAppUrlTypeId === ConstantVariables.AppUrlsDetailed ? "AppandUrlDetailed" : "off";
    this.activityForm.get('app').patchValue(this.appsUrlToggle);
    this.selectedAppUrl = row.activityTrackerAppUrlTypeId == null ? ConstantVariables.off : row.activityTrackerAppUrlTypeId;
    this.screenshotTime = row.screenShotFrequency;
    this.screenshotTimeFrequency = row.screenShotFrequency;
    this.activityForm.get("shotTime").patchValue(this.screenshotTime);
    this.active = row.multiplier === 0 ? "0" :
      (row.multiplier === 1 ? "1" : (row.multiplier === 2 ? "2" : (row.multiplier === 3 ? "3" : null)));
    this.multiplier = row.multiplier;
    this.activityForm.get("shotFrequency").patchValue(this.active);
    this.appsTrack = row.isTrack == null ? false : row.isTrack;
    this.activityForm.get('isTracking').patchValue(this.appsTrack);
    this.isScreenshot = row.isScreenshot == null ? false : row.isScreenshot;
    this.activityForm.get('isScreenshotTracking').patchValue(this.isScreenshot);
    this.isRecordActivity = row.isKeyboardTracking == null ? false : row.isKeyboardTracking;
    this.activityForm.get('isKeyboardTracking').patchValue(this.isRecordActivity);
    this.isMouse = row.isMouseTracking == null ? false : row.isMouseTracking;
    this.activityForm.get('isMouseTracking').patchValue(this.isMouse);
    this.atuTimeStamp = row.atuTimeStamp;
    this.userId = row.userId;
    this.employeeId = row.employeeId
    this.activityTrackerUserId = row.activityTrackerUserId;
    this.changeTrack();
    addTrackerPopover.openPopover();
    this.cdRef.detectChanges();
  }

  closeTrackDialog() {
    this.clearTrackerForm();
    this.addTrackerPopover.forEach((p) => p.closePopover());
    this.cdRef.detectChanges();
  }

  changeTrack() {
    if (this.activityForm.value.isTrack) {
      this.track = true;
      this.activityForm.controls["app"].setValidators([Validators.required
      ]);
      this.activityForm.controls["shotFrequency"].setValidators([Validators.required
      ]);
    } else {
      this.track = false;
      this.activityForm.controls["app"].clearValidators();
      this.activityForm.controls["shotFrequency"].clearValidators();
    }
    this.activityForm.controls["app"].updateValueAndValidity();
    this.activityForm.controls["shotFrequency"].updateValueAndValidity();
  }

  clearTrackerForm() {

    this.track = false;
    this.userId = null;
    this.employeeId = null;
    this.activityTrackerUserId = null;
    this.multiplier = null;
    this.screenshotTimeFrequency = null;
    this.track = null;
    this.appUrlId = null;
    this.atuTimeStamp = null;

    this.activityForm = new FormGroup({
      isTrack: new FormControl("",
        Validators.compose([
        ])
      ),
      app: new FormControl("",
        Validators.compose([
        ])
      ),
      shotFrequency: new FormControl("",
        Validators.compose([
        ])
      ),
      shotTime: new FormControl("",
        Validators.compose([
        ])
      ),
      isTracking: new FormControl("",
        Validators.compose([
        ])
      ),
      isScreenshotTracking: new FormControl("",
        Validators.compose([
        ])
      ),
      isKeyboardTracking: new FormControl("",
        Validators.compose([
        ])
      ),
      isMouseTracking: new FormControl("",
        Validators.compose([
        ])
      ),
    })

  }

  onClickTrackAlloff() {
    this.selectedAppUrl = ConstantVariables.off;
  }

  onClickTrackAllApps() {
    this.selectedAppUrl = ConstantVariables.Apps;
  }

  onClickTrackAllAppsUrls() {
    this.selectedAppUrl = ConstantVariables.AppsUrls;
  }

  onClickTrackAllAppsUrlsDetailed() {
    this.selectedAppUrl = ConstantVariables.AppUrlsDetailed;
  }

  onClickTrackUrls() {
    this.selectedAppUrl = ConstantVariables.Urls;
  }

  onChangeScreenShotFrequency(changedValue) {
    this.screenshotTimeFrequency = this.activityForm.value.shotTime;
    this.multiplier = changedValue;
  }

  onChangeScreenShotCount() {
    this.screenshotTimeFrequency = this.activityForm.value.shotTime;
  }

  upsertTracker() {
    var act = new ActivityConfigurationUserModel();
    this.upsertEnableTracking = true;
    act.userId = this.userId;
    act.employeeId = this.employeeId;
    act.id = this.activityTrackerUserId;
    act.multiplier = this.multiplier;
    act.screenshotFrequency = this.screenshotTimeFrequency;
    act.track = this.track;
    act.isTrack = this.appsTrack;
    act.isScreenshot = this.isScreenshot;
    act.isMouseTracking = this.isMouse;
    act.isKeyboardTracking = this.isRecordActivity;
    act.appUrlId = this.selectedAppUrl;
    act.timeStamp = this.atuTimeStamp;
    this.employeeService.upsertActivityTrackerUserConfiguration(act).subscribe((response: any) => {
      if (response.data) {
        this.clearTrackerForm();
        this.addTrackerPopover.forEach((p) => p.closePopover());
        this.getUsersList();
      } else {

      }
      this.addTrackerPopover.forEach((p) => p.closePopover());
      this.upsertEnableTracking = false;
      this.cdRef.detectChanges();
    })
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  detectTrackingChange() {
    if (this.activityForm.value.isTracking) {
      this.appsTrack = true;
    } else {
      this.appsTrack = false;
    }
    this.cdRef.detectChanges();
  }

  detectScreenshotChange() {
    if (this.activityForm.value.isScreenshotTracking) {
      this.isScreenshot = true;
    } else {
      this.isScreenshot = false;
    }
    this.cdRef.detectChanges();
  }

  changeKeyboard() {
    if (this.activityForm.value.isKeyboardTracking) {
      this.isRecordActivity = true;
    } else {
      this.isRecordActivity = false;
    }
    this.cdRef.detectChanges();
  }

  changeMouse() {
    if (this.activityForm.value.isMouseTracking) {
      this.isMouse = true;
    } else {
      this.isMouse = false;
    }
    this.cdRef.detectChanges();
  }

  /* ENABLE TRACKING */

  getIntroDetails() {
    var intro = new IntroModel();
    intro.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.employeeService.getIntroDetails(intro).subscribe((responseData: any) => {
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
      }
      else if (responseData.success == true) {
        localStorage.removeItem(LocalStorageProperties.IntroModules);
        localStorage.setItem(LocalStorageProperties.IntroModules, JSON.stringify(responseData.data));
      }
    });
  }

  checkModules(newList, oldList) {
    if (newList && oldList) {
      if (newList.length !== oldList.length) {
        return true;
      };
      for (let i = 0; i < newList.length; i++) {
        if (!newList.includes(oldList[i])) {
          return true;
        };
      };
      return false;
    }
  }
  
  displayFn(timeZoneId) {
    if (!timeZoneId) {
      return "";
    } else if(this.timeZoneListCopy.length > 0){
      const timeZoneDetails = this.timeZoneListCopy.find((x) => x.timeZoneId === timeZoneId);
      return timeZoneDetails.timeZoneTitle;
    }
  }

  display1Fn(desktopId) {
    if (!desktopId) {
      return "";
    } else {
      const desktopDetails = this.desktopListCopy.find((x) => x.desktopId === desktopId);
      return desktopDetails.desktopName;
    }
  }

  searchtimeZone(enteredText, searchText){
    if ((enteredText === "Enter" || enteredText === "Comma")) {
    } else {
        const temp = this.timeZoneListCopy.filter((timeZone => (timeZone.timeZoneTitle.toLowerCase().indexOf(searchText) > -1)));
        this.timeZonesList = temp;
    }
  }

  searchdesktop(enteredText, searchText){
    if ((enteredText === "Enter" || enteredText === "Comma")) {
    } else {
        const temp = this.desktopListCopy.filter((desktop => (desktop.desktopName.toLowerCase().indexOf(searchText) > -1)));
        this.desktopsDropdown = temp;
    }
  }

  selectedTimeZone(event){
    this.updateForm.get("timeZoneId").setValue(event.option.value);
  }

  selectedDesktop(event){
    this.updateForm.get("desktopId").setValue(event.option.value);
  }
}
