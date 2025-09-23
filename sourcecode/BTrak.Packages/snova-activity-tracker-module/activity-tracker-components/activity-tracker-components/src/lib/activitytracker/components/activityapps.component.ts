import { map } from 'rxjs/operators';
// tslint:disable-next-line: quotemark
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren, Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RolesModel } from '../models/role-model';
import { ActivityModel } from '../models/activity-tracker.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { ScreenshotFrequencyModel } from '../models/screenshot-frequency-model';
import { ActivityConfigurationStateModel } from '../models/activity-configuration-state-model';
import * as $_ from 'jquery';
import { DashboardFilterModel } from '../models/dashboard.filter.model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import * as introJs from 'intro.js/intro.js';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
const $ = $_;

@Component({
  selector: "app-fm-component-activityapps",
  templateUrl: `activityapps.component.html`
  // styleUrls:["./activity-tracker.component.scss"]
})

export class ActivityAppsComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("roleslist") roles;
  @ViewChildren("allSelected") private allSelected: MatOption;
  @ViewChildren("allScreenSelected") private allScreenSelected: any;
  @ViewChildren("allScreenSelectedUser") private allScreenSelectedUser: any;
  @Output() onAreaSelected = new EventEmitter<boolean>();
  @Output() trackingDisable = new EventEmitter<boolean>();
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  @Input("tracking")
  set _tracking(data: string) {
    if (data != null && this.trackerChange != data) {
      this.trackerChange = data;
      this.getActivityTrackerConfigurationState(false);
    }
  }

  @Input("enableBasicTrackingInput")
  set _enableBasicTrackingInput(data: boolean) {
    if (data != null && data == true) {
      this.skipConfig = true;
      this.getActivityTrackerConfigurationState(true);
    }
  }

  trackerChange: string;
  dashboardFilters: DashboardFilterModel;
  selectedRoles: string[] = [];
  selectedUser: string[] = [];
  Roles: RolesModel[];
  screenShotRoles: RolesModel[];
  screenShotList: RolesModel[];
  idealForm: FormGroup;
  activitytrackerForm: FormGroup;
  ScreenshotForm: FormGroup;
  screenForm: FormArray;
  isDeleteScreenshots = false;
  validationMessage: string;
  idleAlertTime: number = 0;
  minimumIdelTime: number;
  isManualEntryTime: boolean;
  isRecordActivity: boolean;
  isOffileTracking: boolean;
  selectedUsersList: string;
  isIdleTime: boolean;
  idleScreenShotCaptureTime: number = 0;
  screenshotTime: number;
  screenshotTimeFrequency: number;
  multiplier: number;
  selectedMember: string;
  selectedAppUrl: string;
  deleterole: RolesModel[];
  appUrlOverrideConfigsLength: number = 0;
  recordrole: RolesModel[];
  offlineRole: RolesModel[];
  idealTimerole: RolesModel[];
  roleList: RolesModel[];
  manualrole: RolesModel[];
  apps: any;
  screenApps: any;
  off: boolean;
  Urls: boolean;
  appsTrack: boolean;
  disableUrls: boolean;
  considerPunchCard: boolean;
  screenshots: boolean;
  selectedUserId: string;
  selectedUserIds: string[] = [];
  activityForm: FormArray;
  selectedUsers = [];
  appUrl: boolean;
  AfterDeletionRoles: any;
  roleId: any;
  manualRoleId: any;
  idealRoleId: any;
  recordRoleId: any;
  deleteRoleId: any;
  offlineRoleId: any;
  trackRoles: any = [];
  screenshotRoles: any;
  screenShotUsers: any;
  Mymodel: any;
  screenShotsFrequency: any;
  offactive: any;
  buttonsurls: any;
  active: any;
  appsUrlToggle: any;
  frequencyIndex: number;
  timeStamp: any;
  manualOpen: boolean;
  id: string;
  loading: boolean = false;
  stateloading: boolean = false;
  roleLength: number;
  isVisibleFalse: boolean = false;
  employeesDropDown: any;
  roleloading: boolean = false;
  screenUpsertLoading: boolean = false;
  upsertRolesLoading: boolean = false;
  activityLength: number = 0;
  randomScreenshot: boolean = false;
  isMouse: boolean = false;
  mouseRoleId: any;
  mouseActivityRoleId: any;
  isBasicTracking: boolean = false;
  skipConfig: boolean = false;
  introJS = new introJs();
  trailVersion: boolean = false;
  paidVersion: boolean = false;
  multiPage: string = null;

  constructor(
    private activitytracker: ActivityTrackerService, private fb: FormBuilder, private toastr: ToastrService,
    private translateService: TranslateService, private cdRef: ChangeDetectorRef, private cookieService: CookieService, private route: ActivatedRoute, private router: Router) {
    super();
    this.route.queryParams.subscribe(params => {
      if (!this.multiPage) {
        this.multiPage = params['multipage'];
      }
    });

    this.activitytracker.getCompanyStatus().subscribe((responseData: any) => {
      var data = JSON.parse(JSON.stringify(responseData.data));
      this.paidVersion = data.paidVersion;
      if (!this.paidVersion) {
        this.trailVersion = data.trailVersion;
      }
    });

    this.introEnable();
  }

  ngOnInit() {
    super.ngOnInit();
    // this.loading = true;
    this.trackRoles = [];
    this.screenshotRoles = [];
    this.screenShotUsers = [];
    this.initializeActivityForm();
    this.initializeScreenshotForm();
    this.getEmployees();
    this.getAllRoles(false);
    this.idealform();
    if (!this.skipConfig) {
      this.getActivityTrackerConfigurationState(false);
    }
  }
  ngAfterViewInit() {

    //this.introJS.start();
  }

  enableBasicTracking(data) {
    if (this.Roles && this.Roles.length > 0) {
      this.saveConfiguration(data, this.Roles);
    } else {
      var role = new RolesModel();
      role.isArchived = false;
      this.activitytracker.getAllRoles(role).subscribe((responseData: any) => {
        var roles = JSON.parse(JSON.stringify(responseData.data));
        this.Roles = roles;
        this.saveConfiguration(data, roles);
      });
    }
  }

  saveConfiguration(data, roles) {
    this.isBasicTracking = data;
    if (!data) {
      this.appsTrack = false;
      this.isMouse = false;
      this.isRecordActivity = false;
      this.screenShotsFrequency = false;
      this.isIdleTime = false;
      this.isOffileTracking = false;
      this.minimumIdelTime = 5;
      this.considerPunchCard = true;
      this.selectedAppUrl = ConstantVariables.off;
    } else {
      this.isMouse = true;
      this.isRecordActivity = true;
      this.isIdleTime = true;
      this.minimumIdelTime = 10;
      this.considerPunchCard = true;
      this.selectedAppUrl = ConstantVariables.off;
    }

    this.idealRoleId = [];
    this.recordRoleId = [];
    this.mouseRoleId = [];

    roles.forEach((x, i) => {
      this.idealRoleId.push(x.roleId);
      this.recordRoleId.push(x.roleId);
      this.mouseRoleId.push(x.roleId);
    });
    this.upsertActivityTrackerConfigurationState();
    this.upsertIdealTime(false);
    this.upsertActTrackerAppUrlType(false);
    var _this_ = this;
    setTimeout(function () {
      _this_.upsertRecordActivity(false);
      _this_.upsertMouseActivity(false);
    }, 1000);
    this.trackingDisable.emit(data);
  }

  // enableAdvancedTracking() {
  //   if (!this.enableAdvancedTrack) {
  //     this.appsTrack = false;
  //     this.screenShotsFrequency = false;
  //     this.isMouse = false;
  //     this.isRecordActivity = false;
  //     this.isIdleTime = false;
  //     this.isOffileTracking = false;
  //   }
  // }


  setDetailedTrack(data) {
    this.isRecordActivity = data.checked;
    this.isMouse = data.checked;
    if (data.checked) {
      this.getAllRemaingRoles();
    }
  }

  getDetailedTrack() {
    if (this.isRecordActivity || this.isMouse) {
      return true;
    } else {
      return false;
    }
  }

  getActivityTrackerConfigurationState(enableBasicTracking) {
    this.loading = true;
    this.activitytracker.getActivityTrackerConfigurationState().subscribe((response: any) => {
      if (response.success) {
        var data = response.data;
        this.id = data.id;
        this.appsTrack = data.isTracking;
        this.disableUrls = data.disableUrls;
        this.considerPunchCard = data.considerPunchCard;
        this.screenShotsFrequency = data.isScreenshot;
        this.isDeleteScreenshots = data.isDelete;
        this.isRecordActivity = data.isRecord;
        this.isIdleTime = data.isIdealTime;
        this.isManualEntryTime = data.isManualTime;
        this.manualOpen = data.manualTimeRole;
        this.isOffileTracking = data.isOfflineTracking == null ? false : data.isOfflineTracking;
        this.isMouse = data.isMouse == null ? false : data.isMouse;
        this.isBasicTracking = (data.isBasicTracking || this.isMouse || this.isRecordActivity || this.screenShotsFrequency || this.appsTrack) ? true : false;
        this.timeStamp = data.timeStamp;
        if (enableBasicTracking) {
          this.enableBasicTracking(true);
        }
        if (this.appsTrack) {
          this.getActTrackeUrls();
          this.getActTrackerRoleConfigurationRoles();
        }
        if (this.screenShotsFrequency) {
          this.getActScreenshotfrequency();
        }
        if ((this.isDeleteScreenshots || this.isRecordActivity || this.isIdleTime || this.manualOpen || this.isOffileTracking) && !enableBasicTracking) {
          this.getAllRemaingRoles();
        }
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
        }
      }
      else {
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
        }
      }
      this.loading = false;
    });
  }

  getAllRoles(data) {
    var role = new RolesModel();
    role.isArchived = false;
    this.activitytracker.getAllRoles(role).subscribe((responseData: any) => {
      this.Roles = JSON.parse(JSON.stringify(responseData.data));
      this.screenShotList = JSON.parse(JSON.stringify(responseData.data));
      this.screenShotRoles = JSON.parse(JSON.stringify(responseData.data));
      this.deleterole = JSON.parse(JSON.stringify(responseData.data));
      this.recordrole = JSON.parse(JSON.stringify(responseData.data));
      this.idealTimerole = JSON.parse(JSON.stringify(responseData.data));
      this.manualrole = JSON.parse(JSON.stringify(responseData.data));
      this.offlineRole = JSON.parse(JSON.stringify(responseData.data));
      this.mouseActivityRoleId = JSON.parse(JSON.stringify(responseData.data));
      var role = this.Roles.map((item) => item.roleId);
      this.roleLength = role.length;
    });
    this.cdRef.detectChanges();
    this.cdRef.markForCheck();
  }

  upsertActTrackerAppUrlType(showToaster, appUrlId = null) {
    if (this.appUrlOverrideConfigsLength > 0 && showToaster) {
      if (confirm(this.translateService.instant('ACTIVITYTRACKER.ALLOVERRIDESFORAPPSWEREDELETED'))) {
        this.upsertActTrackerAppUrl(showToaster, appUrlId);
      } else {
        this.getActTrackerRoleConfigurationRoles();
      }
    } else {
      this.upsertActTrackerAppUrl(showToaster, appUrlId);
    }
  }

  upsertActTrackerAppUrl(showToaster = true, appUrlId = null) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    if (!appUrlId) {
      activityModel.appUrlId = this.selectedAppUrl ? this.selectedAppUrl : this.appsUrlToggle;
    }
    activityModel.appUrlId =
      appUrlId === "App" ? ConstantVariables.Apps
        : appUrlId === "Off" ? ConstantVariables.off
          : appUrlId === "Url" ? ConstantVariables.Urls
            : appUrlId === "AppandUrl" ? ConstantVariables.AppsUrls
              : appUrlId === "AppandUrlDetailed" ? ConstantVariables.AppUrlsDetailed
                : null;
    activityModel.considerPunchCard = this.considerPunchCard;
    activityModel.frequencyIndex = -1;
    const userNames = this.Roles.map((x) => x.roleId);
    activityModel.roleId = userNames;
    activityModel.selectAll = false;
    this.activitytracker.UpsertActTrackerRoleConfiguration(activityModel).subscribe((response: any) => {
      if (response.success === true) {
        // this.apps = response.data;
        if (showToaster) { this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED')) };
        this.getActTrackerRoleConfigurationRoles();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertIndividualAppUrlType(index, appUrlId) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.frequencyIndex = this.frequencyIndex;
    this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
    if (!appUrlId) {
      appUrlId = this.activityForm.at(index).get("selectedAppUrl").value;
    }
    activityModel.appUrlId =
      appUrlId === "App" ? ConstantVariables.Apps
        : appUrlId === "Off" ? ConstantVariables.off
          : appUrlId === "Url" ? ConstantVariables.Urls
            : appUrlId === "AppandUrl" ? ConstantVariables.AppsUrls
              : appUrlId === "AppandUrlDetailed" ? ConstantVariables.AppUrlsDetailed
                : null;
    activityModel.considerPunchCard = this.activityForm.at(index).get("considerPunchCardInFrequency").value;
    // activityModel.appUrlId = this.selectedAppUrl;
    // tslint:disable-next-line: max-line-length
    // if (this.activityForm.at(index).get("frequencyIndex").value !=  null && this.activityForm.at(index).get("frequencyIndex").value !=  undefined && this.screenForm.at(index).get("frequencyIndex").value !=  "") {
    //   activityModel.frequencyIndex = this.activityForm.at(index).get("frequencyIndex").value;
    // } else {
    activityModel.frequencyIndex = index;
    this.frequencyIndex = index;
    this.activityForm.at(index).get("frequencyIndex").patchValue(index);
    // }
    // activityModel.frequencyIndex = index;
    activityModel.roleId = this.activityForm.at(index).get("selectedUsers").value;
    if (activityModel.roleId.length == 0) {
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
      return null;
    }
    activityModel.selectAll = this.activityForm.at(index).get("isSelectAll").value;
    this.activitytracker.UpsertActTrackerRoleConfiguration(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        // this.apps = response.data;
        this.getActTrackerRoleConfigurationRoles();
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  getActTrackerRoleConfigurationRoles() {
    if (this.appsTrack) {
      this.offactive = null;
      this.offactive = ConstantVariables.off;
      this.trackRoles = [];
      this.activitytracker.getActTrackerRoleConfigurationRoles().subscribe((response: any) => {
        this.initializeActivityForm();
        if (response.success == true && response.data != null) {
          var app = response.data.individualRoles;
          this.appUrlOverrideConfigsLength = app ? (app.findIndex((p) => p.appUrlId != null && p.appUrlId != '00000000-0000-0000-0000-000000000000') > -1) ? 1 : 0 : 0;
          this.appsUrlToggle = null;
          if (response.data.appUrlId != null && response.data.appUrlId != "") {
            // tslint:disable-next-line: max-line-length
            this.appsUrlToggle = response.data.appUrlId === ConstantVariables.Apps ? "App" : response.data.appUrlId === ConstantVariables.off ? "off" : response.data.appUrlId === ConstantVariables.Urls ? "Url" : response.data.appUrlId === ConstantVariables.AppsUrls ? "AppandUrl" : response.data.appUrlId === ConstantVariables.AppUrlsDetailed ? "AppandUrlDetailed" : null;
            this.selectedAppUrl = response.data.appUrlId;
          }
          if (response.data.considerPunchCard) {
            this.considerPunchCard = response.data.considerPunchCard;
          }
          // tslint:disable-next-line: max-line-length
          // this.initializeActivityForm();
          this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
          this.activityForm.push(this.createForm());
          this.activityForm.at(0).get("selectedRoleDB").patchValue([]);
          if (app && app.length > 0) {
            this.apps = [];
            app.forEach((x, i) => {
              if (x.roleId.length > 0) {
                this.apps.push(x);
              }
            });
            // this.activityForm.push(this.createForm());
            if (this.apps && this.apps.length > 0) {
              this.apps.forEach((x, i) => {
                if (i > 0) {
                  this.activityForm.push(this.createForm());
                }

                this.activityForm.at(i).get("frequencyIndex").patchValue(x.frequencyIndex);

                this.activityForm.at(i).get("selectedUsers").patchValue(x.roleId);
                this.activityForm.at(i).get("selectedRoleDB").patchValue(x.roleId);
                var appType =
                  x.appUrl === ConstantVariables.Apps ? "App"
                    : x.appUrlId === ConstantVariables.off ? "Off"
                      : x.appUrlId === ConstantVariables.Urls ? "Url"
                        : x.appUrlId === ConstantVariables.AppsUrls ? "AppandUrl"
                          : x.appUrlId === ConstantVariables.AppUrlsDetailed ? "AppandUrlDetailed"
                            : null;
                this.activityForm.at(i).get("selectedAppUrl").patchValue(appType);
                this.activityForm.at(i).get("considerPunchCardInFrequency").patchValue(x.considerPunchCard);
                x.roleId.forEach((y, j) => {
                  this.trackRoles.push(y);
                });
                if (x.selectAll) {
                  var role = this.activityForm.at(i).get("selectedRoleDB").value;
                  role.push(0);
                  this.activityForm.at(i).get("selectedRoleDB").patchValue([]);
                  this.activityForm.at(i).get("selectedRoleDB").patchValue(role);
                  this.activityForm.at(i).get("isSelectAll").patchValue(true);
                } else {
                  this.activityForm.at(i).get("isSelectAll").patchValue(false);
                }
              });
              // this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
            } else {
              // this.addItem();
            }
          } else {
            this.addItem();
          }

        } else {
          this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
          this.activityForm.push(this.createForm());
          this.activityForm.at(0).get("selectedRoleDB").patchValue([]);
          this.loading = false;
          // this.addItem();
          this.validationMessage = response.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
          // this.initializeActivityForm();
        }
        // this.activityLength = this.activitytrackerForm.get('activityForm')['controls'].length;
        this.cdRef.detectChanges();
      });
    }
  }

  getActTrackeUrls() {
    this.activitytracker.getActTrackeUrls().subscribe((response: any) => {
      if (response.success == true) {
        this.buttonsurls = response.data;
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });
  }

  getEmployees() {
    var emp = new EmployeeOfRoleModel();
    emp.isAllEmployee = true;
    this.activitytracker.getAllEmployee(emp).subscribe((responseData: any) => {
      this.employeesDropDown = [];
      this.employeesDropDown = responseData.data;
    })
  }

  getActScreenshotfrequency() {
    if (this.screenShotsFrequency) {
      // this.getEmployees();
      this.activitytracker.getActScreenshotfrequency().subscribe((response: any) => {
        this.screenshotRoles = [];
        this.screenShotUsers = [];
        // this.initializeScreenshotForm();
        if (response.success == true && response.data != null) {
          var app = response.data.individualRoles;
          // if (this.apps.length >= 1) {
          //   this.active = null;
          //   this.screenshotTime = this.apps[0].screenShotFrequency;
          // } else {
          this.screenshotTime = response.data.screenShotFrequency;
          this.active = null;
          if (response.data.multiplier != null) {
            this.active = response.data.multiplier === 0 ? "0" :
              (response.data.multiplier === 1 ? "1" : (response.data.multiplier === 2 ? "2" :
                (response.data.multiplier === 3 ? "3" : null)));
          }
          // }
          this.randomScreenshot = response.data.randomScreenshot;
          if (app && app.length > 0) {
            this.screenApps = [];
            app.forEach((x, i) => {
              if (x.roleId.length > 0) {
                this.screenApps.push(x);
              }
            });

            this.initializeScreenshotForm();
            this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
            this.screenForm.push(this.clearForm());
            this.screenForm.at(0).get("selectedRoleDB").patchValue([]);
            // this.screenForm.at(0).get("selectedUserDB").patchValue([]);
            if (this.screenApps && this.screenApps.length > 0) {
              // this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
              this.screenApps.forEach((x, j) => {
                if (j > 0) {
                  this.screenForm.push(this.clearForm());
                }

                this.screenForm.at(j).get("frequencyIndex").patchValue(x.frequencyIndex);

                this.screenForm.at(j).get("Users").patchValue([]);
                this.screenForm.at(j).get("isUserSelectAll").patchValue(false);
                if (x.userId != null && x.userId != undefined) {
                  if (x.isUserSelectAll) {
                    this.screenForm.at(j).get("isUserSelectAll").patchValue(true);
                    // this.activityForm.at(i).get("selectedRoleDB").value;
                    var userRole = x.userId;
                    userRole.push(0);
                    // this.screenForm.at(j).get("Users").patchValue([...x.userId, 0]);
                    this.screenForm.at(j).get("Users").patchValue(userRole)
                  } else {
                    this.screenForm.at(j).get("Users").patchValue(x.userId);
                  }
                }

                this.screenForm.at(j).get("selectedUsers").patchValue([...x.roleId]);
                this.screenForm.at(j).get("selectedRoleDB").patchValue([...x.roleId]);
                this.screenForm.at(j).get("multiplier").patchValue(x.multiplier.toString());
                x.roleId.forEach((y, k) => {
                  this.screenshotRoles.push(y);
                });

                x.userId.forEach((y, k) => {
                  this.screenShotUsers.push(y)
                });

                if (x.selectAll) {
                  var role = this.screenForm.at(j).get("selectedRoleDB").value;
                  role.push(0);
                  // this.screenForm.at(j).get("selectedRoleDB").patchValue([]);
                  this.screenForm.at(j).get("selectedRoleDB").patchValue([...role]);
                  // this.allScreenSelected["_results"][j].select();
                  setTimeout(() => {
                    this.allScreenSelected["_results"][j].select();
                  }, 500)
                  this.screenForm.at(j).get("isSelectAll").patchValue(true);
                } else {
                  this.screenForm.at(j).get("isSelectAll").patchValue(false);
                }
              });
              // this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
            } else {
              // this.addscreenshot();
            }
          } else {
            this.addscreenshot();
          }
        } else {
          this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
          this.screenForm.push(this.clearForm());
          this.screenForm.at(0).get("selectedRoleDB").patchValue([]);
          // this.addscreenshot();
          this.validationMessage = response.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
          // this.initializeScreenshotForm();
        }
        this.cdRef.detectChanges();
      });
    }
  }

  getSelectedRoles(roleId, selectedindex) {
    var values = this.activityForm.at(selectedindex).get("selectedUsers").value;
    const pos = values.indexOf(roleId);
    const ind = this.trackRoles.indexOf(roleId);
    if (this.allSelected["_results"][selectedindex].selected) {
      this.allSelected["_results"][selectedindex].deselect();
      this.activityForm.at(selectedindex).get("isSelectAll").patchValue(false);
    }
    if (ind > -1 && pos > -1) {
      this.activityForm.at(selectedindex).get("selectedUsers").patchValue([]);
      if (values.length > 1) {
        values.splice(pos, 1);
        this.activityForm.at(selectedindex).get("selectedUsers").patchValue(values);
      }
      this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.THISROLEISALREADYSELECTEDINTRACKSAPPURL'));
    } else if (ind > -1 && pos == -1) {
      this.trackRoles.splice(ind, 1);
    } else {
      this.trackRoles.push(roleId);
      var value = this.activityForm.at(selectedindex).get("selectedUsers").value;
      if (this.trackRoles.length === this.Roles.length && value.length === this.Roles.length) {
        this.allSelected["_results"][selectedindex].select();
        this.activityForm.at(selectedindex).get("isSelectAll").patchValue(true);
      }
      // const index = this.selectedUser.indexOf(roleId);
      // if (index > -1) {
      //   this.selectedUser.splice(index, 1);
      // } else {
      //   this.selectedUsers.push(roleId);
      // }
      // this.selectedUserId = this.selectedUsers.toString();
      // const Roles = this.Roles;
      // const selectedRoles = this.selectedUserId;
      // // tslint:disable-next-line: only-arrow-functions
      // const users = _.filter(Roles, function (role) {
      //   return selectedRoles.includes(role.roleId);
      // })
      // const userNames = users.map((x) => x.fullName);
      // this.selectedUsersList = userNames.toString();
    }
  }

  toggleAllRolesSelected(event, selectedindex) {
    var val = this.allSelected["_results"][selectedindex].selected;
    var value = this.activityForm.at(selectedindex).get("isSelectAll").value;
    if (val && value == false) {
      var role = this.Roles.map((item) => item.roleId);
      var selectroles = this.activityForm.at(selectedindex).get("selectedUsers").value;
      let trackroles = this.trackRoles;
      // let nonselcteditem = this.Roles.filter(function(item){
      //   rlids = trackroles.filter(items => items != item.roleId);
      // })
      var index = 0;
      if (trackroles.length > 0) {
        trackroles.forEach((x, i) => {
          index = role.indexOf(x);
          role.splice(index, 1);
        });
      }
      role.map((item) => this.trackRoles.push(item));
      if (selectroles.length > 0) {
        selectroles.forEach((x, i) => {
          if (x != 0) {
            role.push(x);
          }
        });
      }
      this.activityForm.at(selectedindex).get("selectedUsers").patchValue([]);
      this.activityForm.at(selectedindex).get("selectedUsers").patchValue([
        ...role.map((item) => item),
        0
      ]);
      this.activityForm.at(selectedindex).get("isSelectAll").patchValue(true);
    } else {
      var selectroles = this.activityForm.at(selectedindex).get("selectedUsers").value;
      var index = 0;
      selectroles.map((item) => {
        if (item != 0) {
          index = this.trackRoles.indexOf(item);
          this.trackRoles.splice(index, 1);
        }
      });
      selectroles.map((item) => {
        if (item != 0) {
          index = this.trackRoles.indexOf(item);
          this.trackRoles.splice(index, 1);
        }
      });
      this.activityForm.at(selectedindex).get("selectedUsers").patchValue([]);
      this.activityForm.at(selectedindex).get("isSelectAll").patchValue(false);
    }
    // let selectAll = this.screenForm.at(selectedindex).get("isSelectAll").value;
  }

  getScreenshotSelectedRoles(roleId, selectedindex) {
    var values = this.screenForm.at(selectedindex).get("selectedUsers").value;
    const pos = values.indexOf(roleId);
    const ind = this.screenshotRoles.indexOf(roleId);
    if (this.allScreenSelected["_results"][selectedindex].selected) {
      this.allScreenSelected["_results"][selectedindex].deselect();
      this.screenForm.at(selectedindex).get("isSelectAll").patchValue(false);
    }
    if (ind > -1 && pos > -1) {
      this.screenForm.at(selectedindex).get("selectedUsers").patchValue([]);
      if (values.length > 1) {
        values.splice(pos, 1);
        this.screenForm.at(selectedindex).get("selectedUsers").patchValue(values);
      }
      this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.THISROLEISALREADYSELECTEDINSCREENSHOTFREQUENCY'));
    } else if (ind > -1 && pos == -1) {
      this.screenshotRoles.splice(ind, 1);
    } else {
      this.screenshotRoles.push(roleId);
      var value = this.screenForm.at(selectedindex).get("selectedUsers").value;
      if (this.screenshotRoles.length === this.Roles.length && value.length === this.Roles.length) {
        this.allScreenSelected["_results"][selectedindex].select();
        this.screenForm.at(selectedindex).get("isSelectAll").patchValue(true);
      }
      // const index = this.selectedUser.indexOf(roleId);
      // if (index > -1) {
      //   this.selectedUser.splice(index, 1);
      // } else {
      //   this.selectedUsers.push(roleId);
      // }
      // this.selectedUserId = this.selectedUsers.toString();
      // const Roles = this.Roles;
      // const selectedRoles = this.selectedUserId;
      // // tslint:disable-next-line: only-arrow-functions
      // const users = _.filter(Roles, function (role) {
      //   return selectedRoles.includes(role.roleId);
      // })
      // const userNames = users.map((x) => x.fullName);
      // this.selectedUsersList = userNames.toString();
    }
    this.changeUserSelectedScreenshotFrequency(selectedindex);
  }


  toggleAllRolesSelectedScreenShot(event, selectedindex) {
    var val = this.allScreenSelected["_results"][selectedindex].selected;
    var value = this.screenForm.at(selectedindex).get("isSelectAll").value;
    if (val && value == false) {
      var role = this.Roles.map((item) => item.roleId);
      var selectroles = this.screenForm.at(selectedindex).get("selectedUsers").value;
      let screenshotRoles = this.screenshotRoles;
      var index = 0;
      if (screenshotRoles.length > 0) {
        screenshotRoles.forEach((x, i) => {
          index = role.indexOf(x);
          role.splice(index, 1);
        });
      }
      this.screenForm.at(selectedindex).get("selectedUsers").patchValue([]);
      role.map((item) => this.screenshotRoles.push(item));

      if (selectroles.length > 0) {
        selectroles.forEach((x, i) => {
          if (x != 0) {
            role.push(x);
          }
        });
      }

      this.screenForm.at(selectedindex).get("selectedUsers").patchValue([
        ...role.map((item) => item),
        0
      ]);
      this.screenForm.at(selectedindex).get("isSelectAll").patchValue(true);
    } else {
      var selectroles = this.screenForm.at(selectedindex).get("selectedUsers").value;
      var index = 0;
      selectroles.map((item) => {
        if (item != 0) {
          index = this.screenshotRoles.indexOf(item);
          this.screenshotRoles.splice(index, 1);
        }
      })
      this.screenForm.at(selectedindex).get("selectedUsers").patchValue([]);
      this.screenForm.at(selectedindex).get("isSelectAll").patchValue(false);
    }
    // let selectAll = this.screenForm.at(selectedindex).get("isSelectAll").value;
    this.changeUserSelectedScreenshotFrequency(selectedindex);
  }

  getScreenshotSelectedUsers(userId, selectedindex) {
    var values = this.screenForm.at(selectedindex).get("Users").value;
    const pos = values.indexOf(userId);
    const ind = this.screenShotUsers.indexOf(userId);
    if (this.allScreenSelectedUser["_results"][selectedindex].selected) {
      this.allScreenSelectedUser["_results"][selectedindex].deselect();
      this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(false);
    }
    if (ind > -1 && pos > -1) {
      this.screenForm.at(selectedindex).get("Users").patchValue([]);
      if (values.length > 1) {
        values.splice(pos, 1);
        this.screenForm.at(selectedindex).get("Users").patchValue(values);
      }
      this.toastr.error("", this.translateService.instant('ACTIVITYAPPS.THISUSERISALREADYSELECTEDINSCREENSHOTFREQUENCY'));
    } else if (ind > -1 && pos == -1) {
      this.screenShotUsers.splice(ind, 1);
    } else {
      this.screenShotUsers.push(userId);
      var value = this.screenForm.at(selectedindex).get("Users").value;

      var userList = this.employeesDropDown;

      var role: any;
      role = [];
      // var userList = this.screenShotUsers;
      var roleList = this.screenForm.at(selectedindex).get("selectedUsers").value;
      roleList.map(r => {
        userList.map((user) => {
          // tslint:disable-next-line: prefer-const
          var uRole = user.role.split(",");
          if (uRole.includes(r)) {
            role.push(user.userId);
          }
        });
      })
      role = new Set(role);
      role = Array.from(role);
      // this.screenShotUsers = new Set(this.screenShotUsers);
      if (this.screenShotUsers.length === this.employeesDropDown.length && value.length === role.length) {
        this.allScreenSelectedUser["_results"][selectedindex].select();
        this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(true);
      }
    }
  }

  toggleAllUsersSelectedScreenShot(event, selectedindex) {
    var val = this.allScreenSelectedUser["_results"][selectedindex].selected;
    var value = this.screenForm.at(selectedindex).get("isUserSelectAll").value;
    if (val && value == false) {
      // var role = this.employeesDropDown.map((item) => item.userId);
      var userList = this.employeesDropDown;
      var selectroles = this.screenForm.at(selectedindex).get("Users").value;
      let screenshotRoles = this.screenShotUsers;

      var role: any;
      role = [];
      // var userList = this.screenShotUsers;
      var roleList = this.screenForm.at(selectedindex).get("selectedUsers").value;
      if (roleList.length > 0) {
        roleList.map(r => {
          userList.map((user) => {
            // tslint:disable-next-line: prefer-const
            var uRole = user.role.split(",");
            if (uRole.includes(r)) {
              role.push(user.userId);
            }
          });
        })
      }
      if (roleList.length == 0) {
        userList.map((user) => {
          role.push(user.userId);
        });
      }
      // var index = 0;
      if (screenshotRoles.length > 0) {
        screenshotRoles.forEach((x, i) => {
          var index = role.indexOf(x);
          if (index > -1) {
            role.splice(index, 1);
          }
        });
      }
      this.screenForm.at(selectedindex).get("Users").patchValue([]);
      role.map((item) => this.screenShotUsers.push(item));

      if (selectroles.length > 0) {
        selectroles.forEach((x, i) => {
          if (x != 0) {
            role.push(x);
          }
        });
      }

      this.screenForm.at(selectedindex).get("Users").patchValue([
        ...role.map((item) => item),
        0
      ]);
      this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(true);
    } else {
      var selectroles = this.screenForm.at(selectedindex).get("Users").value;
      var index = 0;
      selectroles.map((item) => {
        if (item != 0) {
          index = this.screenShotUsers.indexOf(item);
          this.screenShotUsers.splice(index, 1);
        }
      })
      this.screenForm.at(selectedindex).get("Users").patchValue([]);
      this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(false);
    }
    // let selectAll = this.screenForm.at(selectedindex).get("isSelectAll").value;
  }

  changeUserSelectedScreenshotFrequency(selectedindex) {
    var role: any;
    role = [];
    var userList = this.employeesDropDown;
    var roleList = this.screenForm.at(selectedindex).get("selectedUsers").value;

    if (roleList.length == 0) {
      var selectUsers = this.screenForm.at(selectedindex).get("Users").value;
      var index = 0;
      selectUsers.map((item) => {
        if (item != 0) {
          index = this.screenShotUsers.indexOf(item);
          this.screenShotUsers.splice(index, 1);
        }
      })
      this.screenForm.at(selectedindex).get("Users").patchValue([]);
      this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(false);
    } else {
      this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(true);
      roleList.map(r => {
        userList.map((user) => {
          // tslint:disable-next-line: prefer-const
          var uRole = user.role.split(",");
          if (uRole.includes(r)) {
            role.push(user.userId);
          }
        });
      })

      role = new Set(role);

      role = Array.from(role);

      var selectedList = this.screenForm.at(selectedindex).get("Users").value;
      if (selectedList != "") {
        var index = 0;
        selectedList.map((item) => {
          if (item != 0) {
            index = this.screenShotUsers.indexOf(item);
            this.screenShotUsers.splice(index, 1);
          }
        })
      }

      if (this.screenShotUsers.length > 0) {
        var len = role.length;
        this.screenShotUsers.map((item) => {
          var index = role.indexOf(item);
          if (index > -1) {
            role.splice(index, 1);
          }
        })
        var remlen = role.length;
        role.map((item) => this.screenShotUsers.push(item));

        this.screenShotUsers = new Set(this.screenShotUsers);
        this.screenShotUsers = Array.from(this.screenShotUsers);
        if (len == remlen) {
          this.screenForm.at(selectedindex).get("Users").patchValue([
            ...role.map((item) => item),
            0
          ]);
          this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(true);
        } else {
          this.screenForm.at(selectedindex).get("Users").patchValue([
            ...role.map((item) => item)
          ]);
          this.screenForm.at(selectedindex).get("isUserSelectAll").patchValue(false);
        }
      } else {
        this.screenForm.at(selectedindex).get("Users").patchValue([]);
        role.map((item) => this.screenShotUsers.push(item));
        this.screenForm.at(selectedindex).get("Users").patchValue([
          ...role.map((item) => item),
          0
        ]);
        role.map((item) => this.screenShotUsers.push(item));
        this.screenShotUsers = new Set(this.screenShotUsers);
        this.screenShotUsers = Array.from(this.screenShotUsers);
      }
    }
  }

  upsertActTrackerScreenShotFrequency() {
    this.screenUpsertLoading = true;
    const screenshotFrequencyModel = new ScreenshotFrequencyModel();
    const userNames = this.screenShotRoles.map((x) => x.roleId);
    screenshotFrequencyModel.roleIds = userNames;
    screenshotFrequencyModel.userIds = [];
    screenshotFrequencyModel.screenShotFrequency = this.screenshotTimeFrequency;
    screenshotFrequencyModel.multiplier = this.multiplier;
    screenshotFrequencyModel.selectAll = false;
    screenshotFrequencyModel.isRandomScreenshot = this.randomScreenshot;
    // screenshotFrequencyModel.multiplier = this.active;
    screenshotFrequencyModel.frequencyIndex = -1;
    this.activitytracker.upsertActTrackerScreenShotFrequency(screenshotFrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        // this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
        this.getActScreenshotfrequency();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.screenUpsertLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertScreenShotFrequency() {
    this.upsertRolesLoading = true;
    const screenshotFrequencyModel = new ScreenshotFrequencyModel();
    const userNames = this.screenShotRoles.map((x) => x.roleId);
    screenshotFrequencyModel.roleIds = userNames;
    screenshotFrequencyModel.userIds = [];
    screenshotFrequencyModel.screenShotFrequency = this.screenshotTime;
    screenshotFrequencyModel.multiplier = 0;
    screenshotFrequencyModel.selectAll = false;
    screenshotFrequencyModel.isRandomScreenshot = this.randomScreenshot;
    // screenshotFrequencyModel.multiplier = this.active;
    screenshotFrequencyModel.frequencyIndex = -2;
    this.activitytracker.upsertActTrackerScreenShotFrequency(screenshotFrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        // this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
        this.getActScreenshotfrequency();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertActTrackerIndividualScreenShotFrequency(index) {
    this.screenUpsertLoading = true;
    const screenshotFrequencyModel = new ScreenshotFrequencyModel();
    this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
    screenshotFrequencyModel.roleIds = this.screenForm.at(index).get("selectedUsers").value;
    screenshotFrequencyModel.screenShotFrequency = this.screenshotTimeFrequency;
    screenshotFrequencyModel.isRandomScreenshot = this.randomScreenshot;
    screenshotFrequencyModel.multiplier = this.multiplier;
    screenshotFrequencyModel.selectAll = this.screenForm.at(index).get("isSelectAll").value;
    screenshotFrequencyModel.userIds = this.screenForm.at(index).get("Users").value;
    // screenshotFrequencyModel.multiplier = this.screenForm.value[0].multiplier;
    screenshotFrequencyModel.isUserSelectAll = this.screenForm.at(index).get("isUserSelectAll").value;
    // tslint:disable-next-line: max-line-length
    if (this.screenForm.at(index).get("frequencyIndex").value != null && this.screenForm.at(index).get("frequencyIndex").value != undefined && this.screenForm.at(index).get("frequencyIndex").value != "") {
      screenshotFrequencyModel.frequencyIndex = this.screenForm.at(index).get("frequencyIndex").value;
    } else {
      screenshotFrequencyModel.frequencyIndex = index;
    }
    this.activitytracker.upsertActTrackerScreenShotFrequency(screenshotFrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.getActScreenshotfrequency();
        // this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.screenUpsertLoading = false;
      this.cdRef.detectChanges();
    });
  }

  initializeActivityForm() {
    this.activitytrackerForm = new FormGroup({
      activityForm: this.fb.array([])
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      selectedAppUrl: new FormControl("", []),
      considerPunchCardInFrequency: new FormControl(false, []),
      selectedUsers: new FormControl([], []),
      buttongroups: new FormControl("", []),
      selectedRoles: new FormControl("", []),
      selectedscreenShotRoles: new FormControl("", []),
      button: new FormControl("", []),
      isSelectAll: new FormControl(false, []),
      selectedRoleDB: new FormControl("", []),
      selectedUserDB: new FormControl("", []),
      frequencyIndex: new FormControl("", []),
    });
  }

  addItem(): void {
    (this.activitytrackerForm.get("activityForm") as FormArray).push(this.createForm());
  }

  removeActivityTrackerIndex(addActivityTrackerIndex: number) {
    const activityModel = new ActivityModel();
    activityModel.frequencyIndex = this.frequencyIndex;
    this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
    activityModel.appUrlId = this.selectedAppUrl;
    activityModel.frequencyIndex = this.activityForm.at(addActivityTrackerIndex).get("frequencyIndex").value;
    activityModel.remove = true;
    activityModel.roleId = this.activityForm.at(addActivityTrackerIndex).get("selectedUsers").value;
    var roles = this.activityForm.at(addActivityTrackerIndex).get("selectedUsers").value;

    roles.forEach((x, j) => {
      var index = this.trackRoles.indexOf(x);
      this.trackRoles.splice(index, 1);
    });
    activityModel.remove = true;
    this.activitytracker.UpsertActTrackerRoleConfiguration(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        // this.apps = response.data;
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });

    (this.activitytrackerForm.get("activityForm") as FormArray).removeAt(addActivityTrackerIndex);
  }

  initializeScreenshotForm() {
    this.ScreenshotForm = new FormGroup({
      screenForm: this.fb.array([])
    });
  }

  clearForm(): FormGroup {
    return this.fb.group({
      selectedUsers: new FormControl("", []),
      Users: new FormControl("", []),
      buttons: new FormControl("", []),
      multiplier: new FormControl("", []),
      isSelectAll: new FormControl(false, []),
      isUserSelectAll: new FormControl(false, []),
      selectedRoleDB: new FormControl("", []),
      frequencyIndex: new FormControl("", [])
    });
  }

  addscreenshot(): void {
    (this.ScreenshotForm.get("screenForm") as FormArray).push(this.clearForm())
  }

  removeScreenshotIndex(addScreenshotIndex: number) {
    const screenshotFrequencyModel = new ScreenshotFrequencyModel();
    this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
    screenshotFrequencyModel.roleIds = this.screenForm.at(addScreenshotIndex).get("selectedUsers").value;
    if (this.screenForm.at(addScreenshotIndex).get("selectedUsers").value == "") {
      screenshotFrequencyModel.roleIds = [];
    }
    screenshotFrequencyModel.userIds = this.screenForm.at(addScreenshotIndex).get("Users").value;
    if (this.screenForm.at(addScreenshotIndex).get("Users").value == "") {
      screenshotFrequencyModel.userIds = [];
    }
    screenshotFrequencyModel.screenShotFrequency = this.screenshotTime;
    screenshotFrequencyModel.multiplier = this.multiplier;
    if (this.multiplier != undefined) {
      screenshotFrequencyModel.multiplier = 0;
    }
    screenshotFrequencyModel.frequencyIndex = this.screenForm.at(addScreenshotIndex).get("frequencyIndex").value;
    screenshotFrequencyModel.remove = true;

    var roles = this.screenForm.at(addScreenshotIndex).get("selectedUsers").value;
    if (roles != "") {
      roles.forEach((x, j) => {
        var index = this.screenshotRoles.indexOf(x);
        this.screenshotRoles.splice(index, 1);
      });
    }

    var users = this.screenForm.at(addScreenshotIndex).get("Users").value;
    if (users != "") {
      users.forEach((x, j) => {
        var index = this.screenShotUsers.indexOf(x);
        this.screenShotUsers.splice(index, 1);
      });
    }

    this.activitytracker.upsertActTrackerScreenShotFrequency(screenshotFrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        // this.apps = response.data;
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });

    (this.ScreenshotForm.get("screenForm") as FormArray).removeAt(addScreenshotIndex);
  }

  onChangeScreenShotFrequency(changedValue) {
    if (this.screenApps && this.screenApps.length > 0 && changedValue != 0) {
      if (confirm(this.translateService.instant('ACTIVITYTRACKER.ALLOVERRIDESFORAPPSWEREDELETED'))) {
        this.screenshotTimeFrequency = this.screenshotTime;
        this.multiplier = changedValue;
        this.upsertActTrackerScreenShotFrequency();
      } else {
        this.getActScreenshotfrequency();
      }
    } else {
      this.screenshotTimeFrequency = this.screenshotTime;
      this.multiplier = changedValue;
      this.upsertActTrackerScreenShotFrequency();
    }
  }

  onChangeIndividualScreenShotFrequency(changedValue, index) {
    // if (changedValue.value == 0) {
    this.screenshotTimeFrequency = this.screenshotTime;
    this.multiplier = changedValue;
    // } else {
    // this.screenshotTimeFrequency = this.screenshotTime;
    // this.multiplier = changedValue.value;
    // }
    this.upsertActTrackerIndividualScreenShotFrequency(index);
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

  onClickOff() {
    this.selectedAppUrl = ConstantVariables.off;
    this.roleId = this.selectedRoles
  }

  onClickApp() {
    this.selectedAppUrl = ConstantVariables.Apps;
  }

  onClickAppUrl() {
    this.selectedAppUrl = ConstantVariables.AppsUrls;
    this.roleId = this.selectedRoles
  }

  onClickAppsUrlsDetailed() {
    this.selectedAppUrl = ConstantVariables.AppUrlsDetailed;
  }

  onClickUrl() {
    this.selectedAppUrl = ConstantVariables.Urls;
  }

  UpsertDeleteScreenshot() {
    const activityModel = new ActivityModel();
    activityModel.isDeleteScreenShots = this.isDeleteScreenshots;
    activityModel.roleId = this.deleteRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    })
  }

  getDeleteScreenshot() {
    const activityModel = new ActivityModel();
    activityModel.roleId = this.deleteRoleId;
    activityModel.isDeleteScreenShots = this.isDeleteScreenshots;
    activityModel.isRecordActivity = this.isRecordActivity;
    activityModel.idleScreenShotCaptureTime = this.idleScreenShotCaptureTime;
    activityModel.isManualEntryTime = this.isManualEntryTime;
    this.activitytracker.getDeleteScreenshot(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        this.AfterDeletionRoles = response.data;
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });
  }

  getAllRemaingRoles() {
    const activityModel = new ActivityModel();
    this.roleloading = true;
    activityModel.isDeleteScreenShots = this.isDeleteScreenshots;
    activityModel.isRecordActivity = this.isRecordActivity;
    activityModel.isIdleTime = this.isIdleTime;
    activityModel.isManualEntryTime = this.isManualEntryTime;
    activityModel.isOfflineTracking = this.isOffileTracking;
    this.activitytracker.getRemainingRoles(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        this.AfterDeletionRoles = response.data;
        this.deleteRoleId = [];
        this.recordRoleId = [];
        this.idealRoleId = [];
        this.manualRoleId = [];
        this.offlineRoleId = [];
        this.mouseRoleId = [];
        if (this.AfterDeletionRoles.idleTimeRoleIds.length > 0) {
          this.idleScreenShotCaptureTime = this.AfterDeletionRoles.idleTimeRoleIds[0].idleScreenShotCaptureTime;
          this.idleAlertTime = this.AfterDeletionRoles.idleTimeRoleIds[0].idleAlertTime;
          this.minimumIdelTime = this.AfterDeletionRoles.idleTimeRoleIds[0].minimumIdelTime;
        }
        var role = [];
        this.recordrole.forEach((x) => {
          role.push(x.roleId);
        })
        if (this.AfterDeletionRoles.offlineTrackingRoleIds.length > 0) {
          this.AfterDeletionRoles.offlineTrackingRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.offlineRoleId.push(x.roleId);
            }
          });
        }
        if (this.AfterDeletionRoles.deleteScreenShotRoleIds.length > 0) {
          this.AfterDeletionRoles.deleteScreenShotRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.deleteRoleId.push(x.roleId);
            }
          });
        }
        if (this.AfterDeletionRoles.idleTimeRoleIds.length > 0) {
          this.AfterDeletionRoles.idleTimeRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.idealRoleId.push(x.roleId);
            }
          });
        }
        if (this.AfterDeletionRoles.manualEntryRoleIds.length > 0) {
          this.AfterDeletionRoles.manualEntryRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.manualRoleId.push(x.roleId);
            }
          });
        }
        if (this.AfterDeletionRoles.recordActivityRoleIds.length > 0) {
          this.AfterDeletionRoles.recordActivityRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.recordRoleId.push(x.roleId);
            }
          });
        }
        if (this.AfterDeletionRoles.mouseTrackingRoleIds.length > 0) {
          this.AfterDeletionRoles.mouseTrackingRoleIds.forEach((x) => {
            if (role.includes(x.roleId)) {
              this.mouseRoleId.push(x.roleId);
            }
          });
        }
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.roleloading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertDeleteScreenshot() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isDeleteScreenShots = this.isDeleteScreenshots;
    activityModel.roleId = this.deleteRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertRecordActivity(showToaster = true) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isRecordActivity = this.isRecordActivity;
    activityModel.roleId = this.recordRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        if (showToaster) { this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED')) };
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertMouseActivity(showToaster = true) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isMouseActivity = this.isMouse;
    activityModel.roleId = this.mouseRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        if (showToaster) { this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED')) };
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertOfflineTracking() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isOfflineTracking = this.isOffileTracking;
    activityModel.roleId = this.offlineRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertIdealTime(showToaster = true) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.idleScreenShotCaptureTime = this.idleScreenShotCaptureTime;
    activityModel.idleAlertTime = this.idleAlertTime;
    activityModel.minimumIdelTime = this.minimumIdelTime;
    activityModel.isIdleTime = this.isIdleTime;
    activityModel.roleId = this.idealRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        if (showToaster) { this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED')) };
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });
    this.upsertRolesLoading = false;
    this.cdRef.detectChanges();
  }

  upsertManualTime() {
    const activityModel = new ActivityModel();
    activityModel.isManualEntryTime = this.isManualEntryTime;
    activityModel.roleId = this.manualRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });
  }

  compareSelectedTeamMembersFn(Roles: any, selectedUsers: any) {
    if (Roles === selectedUsers) {
      return true;
    } else {
      return false;
    }
  }

  displayFn(rolesId) {
    if (!rolesId) {
      return "";
    } else {
      // tslint:disable-next-line: no-shadowed-variable
      const role = this.roleList.find((role) => role.roleId === rolesId);
      return role.fullName;
    }
  }

  idealform() {
    this.idealForm = new FormGroup({
      IdealTime: new FormControl(null,
        Validators.compose([
          // Validators.required,
          Validators.max(ConstantVariables.IdealTimeLength)
        ])
      ),
      AlertTime: new FormControl(null,
        Validators.compose([
          // Validators.required,
          Validators.max(ConstantVariables.IdealTimeLength)
        ]),
      ),
      MinIdealTime: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.max(ConstantVariables.IdealTimeLength)
        ]),
      )
    })
  }

  upsertActivityTrackerConfigurationState(showToaster = true) {
    this.stateloading = true;
    var activityConfigurationStateModel = new ActivityConfigurationStateModel();
    activityConfigurationStateModel.id = this.id;
    activityConfigurationStateModel.isBasicTracking = this.isBasicTracking;
    activityConfigurationStateModel.isTracking = this.appsTrack;
    activityConfigurationStateModel.disableUrls = this.disableUrls;
    activityConfigurationStateModel.isScreenshot = this.screenShotsFrequency;
    activityConfigurationStateModel.isDelete = this.isDeleteScreenshots;
    activityConfigurationStateModel.deleteRoles = this.isDeleteScreenshots;
    activityConfigurationStateModel.isRecord = this.isRecordActivity;
    activityConfigurationStateModel.recordRoles = this.isRecordActivity;
    activityConfigurationStateModel.isIdealTime = this.isIdleTime;
    activityConfigurationStateModel.idealTimeRoles = this.isIdleTime;
    activityConfigurationStateModel.isManualTime = this.isManualEntryTime;
    activityConfigurationStateModel.manualTimeRole = this.manualOpen;
    activityConfigurationStateModel.isOfflineTracking = this.isOffileTracking;
    activityConfigurationStateModel.offlineOpen = this.isOffileTracking;
    activityConfigurationStateModel.isMouse = this.isMouse;
    activityConfigurationStateModel.mouseRoles = this.isMouse;
    activityConfigurationStateModel.timeStamp = this.timeStamp;
    this.activitytracker.upsertActivityTrackerConfigurationState(activityConfigurationStateModel).subscribe((response: any) => {
      if (response.success) {
        this.stateloading = false;
        this.timeStamp = response.data;
        if (showToaster) { this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED')) };
        this.cdRef.detectChanges();
      } else {
        this.stateloading = false;
        this.cdRef.detectChanges();
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  fitContent(optionalParameters?: any) {
    try {
      if (optionalParameters) {
        var parentElementSelector = '';
        var minHeight = '';
        if (optionalParameters['popupView']) {
          parentElementSelector = optionalParameters['popupViewSelector'];
          minHeight = `calc(90vh - 200px)`;
        }
        else if (optionalParameters['gridsterView']) {
          parentElementSelector = optionalParameters['gridsterViewSelector'];
          minHeight = `${$(parentElementSelector).height() - 40}px`;
        }
        else if (optionalParameters['individualPageView']) {
          parentElementSelector = optionalParameters['individualPageSelector'];
          minHeight = `calc(100vh - 85px)`;
        }

        var counter = 0;
        var applyHeight = setInterval(function () {
          if (counter > 10) {
            clearInterval(applyHeight);
          }
          counter++;
          if ($(parentElementSelector + ' app-fm-component-activityapps mat-card.admin-activity-app-height').length > 0) {
            $(parentElementSelector + ' app-fm-component-activityapps mat-card.admin-activity-app-height').css('height', minHeight);
            clearInterval(applyHeight);
          }
        }, 1000);
      }
    }
    catch (err) {
      clearInterval(applyHeight);
      console.log(err);
    }
  }

  resetAllSettings() {
    this.onClickTrackAllAppsUrlsDetailed();
    this.upsertActTrackerAppUrlType(false, 'Off');
    this.screenshotTime = 0;
    this.randomScreenshot = false;
    this.onChangeScreenShotFrequency(0);
    this.upsertDeleteScreenshotReset();
    this.appsTrack = false;
    this.disableUrls = false;
    this.screenShotsFrequency = false;
    this.isDeleteScreenshots = false;
    this.isRecordActivity = false;
    this.isIdleTime = false;
    this.isManualEntryTime = false;
    this.manualOpen = false;
    this.isOffileTracking = false;
    this.isMouse = false;
    this.considerPunchCard = true;
    this.isBasicTracking = true;
    this.upsertActivityTrackerConfigurationStateReset();
  }

  upsertDeleteScreenshotReset() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isDeleteScreenShots = true;
    activityModel.isRecordActivity = true;
    activityModel.isMouseActivity = true;
    activityModel.idleScreenShotCaptureTime = 0;
    activityModel.idleAlertTime = 0;
    activityModel.minimumIdelTime = 0;
    activityModel.isIdleTime = true;
    activityModel.isOfflineTracking = true;
    activityModel.roleId = [];
    this.minimumIdelTime = null;
    this.idealForm.controls.MinIdealTime.markAsUntouched({ onlySelf: true });
    this.selectedRoles = [];
    this.offlineRoleId = [];
    this.idealRoleId = [];
    this.mouseRoleId = [];
    this.recordRoleId = [];
    this.deleteRoleId = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertActivityTrackerConfigurationStateReset() {
    this.stateloading = true;
    var activityConfigurationStateModel = new ActivityConfigurationStateModel();
    activityConfigurationStateModel.id = this.id;
    activityConfigurationStateModel.isTracking = this.appsTrack;
    activityConfigurationStateModel.isBasicTracking = this.isBasicTracking;
    activityConfigurationStateModel.isScreenshot = this.screenShotsFrequency;
    activityConfigurationStateModel.isDelete = this.isDeleteScreenshots;
    activityConfigurationStateModel.deleteRoles = this.isDeleteScreenshots;
    activityConfigurationStateModel.isRecord = this.isRecordActivity;
    activityConfigurationStateModel.recordRoles = this.isRecordActivity;
    activityConfigurationStateModel.isIdealTime = this.isIdleTime;
    activityConfigurationStateModel.idealTimeRoles = this.isIdleTime;
    activityConfigurationStateModel.isManualTime = this.isManualEntryTime;
    activityConfigurationStateModel.manualTimeRole = this.manualOpen;
    activityConfigurationStateModel.isOfflineTracking = this.isOffileTracking;
    activityConfigurationStateModel.offlineOpen = this.isOffileTracking;
    activityConfigurationStateModel.isMouse = this.isMouse;
    activityConfigurationStateModel.mouseRoles = this.isMouse;
    activityConfigurationStateModel.timeStamp = this.timeStamp;
    this.activitytracker.upsertActivityTrackerConfigurationState(activityConfigurationStateModel).subscribe((response: any) => {
      if (response.success) {
        this.stateloading = false;
        this.timeStamp = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
        this.cdRef.detectChanges();
      } else {
        this.stateloading = false;
        this.cdRef.detectChanges();
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.getActivityTrackerConfigurationState(false);
    });
  }
  public async introStart() {
    await this.delay(2000);
    const navigationExtras: NavigationExtras = {
      queryParams: { multipage: true },
      queryParamsHandling: 'merge',
      // preserveQueryParams: true
    }

    this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
      if (this.canAccess_feature_ManageActivityConfig) {
        this.router.navigate(["activitytracker/activitydashboard/configurationHistory"], navigationExtras);
      }
    });
  }
  navigateToPayments() {
    this.router.navigate([
      "shell/payments-plans"
    ]);
  }

  introEnable() {
    if (this.trailVersion || this.paidVersion) {
      this.introJS.setOptions({
        steps: [
          {
            element: '#app-1',
            intro: "It will diplay activity tracker configuration, enable tracking and tracking with idle time options.",
            position: 'top'
          },
          {
            element: '#app-22',
            intro: "It will reset to default settings"
          }
          ,
          {
            element: '#app-2',
            intro: "It will display tracking options like enable or disable tracking of apps and url's, kind of apps and url's tracking.",
            position: 'bottom'
          },
          {
            element: '#app-3',
            intro: "It will display screen shot options like capturing random screen shots, time of screen shots to be taken, scrren shot frequency.",
            position: 'bottom'
          },
          {
            element: '#app-4',
            intro: "It will display selecting roles field to tarck keystrokes and mouseclicks.",
            position: 'bottom'
          },
          /*{
            element: '#app-5',
            intro: "It will display offline tracking details.",
            position: 'bottom'
          }*/
        ]
      });
    }
    else {
      this.introJS.setOptions({
        steps: [
          {
            element: '#app-1',
            intro: "It will diplay activity tracker configuration, enable tracking and tracking with idle time options.",
            position: 'top'
          },
          {
            element: '#app-22',
            intro: "It will reset to default settings"
          }
          // ,
          // {
          //   element: '#app-2',
          //   intro: "It will display tracking options like enable or disable tracking of apps and url's, kind of apps and url's tracking.",
          //   position: 'bottom'
          // },
          // {
          //   element: '#app-3',
          //   intro: "It will display screen shot options like capturing random screen shots, time of screen shots to be taken, scrren shot frequency.",
          //   position: 'bottom'
          // },
          // {
          //   element: '#app-4',
          //   intro: "It will display selecting roles field to tarck keystrokes and mouseclicks.",
          //   position: 'bottom'
          // },
          /*{
            element: '#app-5',
            intro: "It will display offline tracking details.",
            position: 'bottom'
          }*/
        ]
      });
    }
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
