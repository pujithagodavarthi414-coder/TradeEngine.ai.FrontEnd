import { map } from 'rxjs/operators';
// tslint:disable-next-line: quotemark
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren, Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RolesModel } from '../models/role-model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { ActivityModel } from '../models/activity-tracker.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { ScreenshotFrequencyModel } from '../models/screenshot-frequency-model';
import { ActivityConfigurationStateModel } from '../models/activity-configuration-state-model';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "app-fm-component-activityapps",
  templateUrl: `activityapps.component.html`
})
export class ActivityAppsComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("roleslist") roles;
  @ViewChildren("allSelected") private allSelected: MatOption;
  @ViewChildren("allScreenSelected") private allScreenSelected: any;
  @ViewChildren("allScreenSelectedUser") private allScreenSelectedUser: any;
  @Output() onAreaSelected = new EventEmitter<boolean>();
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

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
  isThereAnError = false;
  isDeleteScreenshots = false;
  validationMessage: string;
  idleAlertTime: number = 0;
  minimumIdelTime: number;
  isManualEntryTime: boolean;
  isRecordActivity: boolean;
  isOffileTracking: boolean;
  offlineOpen: boolean;
  selectedUsersList: string;
  isIdleTime: boolean;
  idleScreenShotCaptureTime: number = 0;
  screenshotTime: number;
  screenshotTimeFrequency: number;
  multiplier: number;
  selectedMember: string;
  selectedAppUrl: string;
  deleterole: RolesModel[];
  recordrole: RolesModel[];
  offlineRole: RolesModel[];
  idealTimerole: RolesModel[];
  roleList: RolesModel[];
  manualrole: RolesModel[];
  apps: any;
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
  deleteScreenshots: boolean;
  record: boolean;
  idealTimeOpen: boolean;
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
  mouseRoles: boolean = false;
  mouseRoleId: any;
  mouseActivityRoleId: any;
  // tslint:disable-next-line: max-line-length
  constructor(private activitytracker: ActivityTrackerService, private fb: FormBuilder, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.loading = true;
    this.trackRoles = [];
    this.screenshotRoles = [];
    this.screenShotUsers = [];
    // this.clearForm();
    this.initializeActivityForm();
    this.initializeScreenshotForm();
    this.getEmployees();
    this.getAllRoles();
    this.idealform();
    // this.getAllRemaingRoles();
    // this.getActTrackeUrls();
    // this.getActTrackerRoleConfigurationRoles();
    this.getActivityTrackerConfigurationState();
  }

  getActivityTrackerConfigurationState() {
    this.activitytracker.getActivityTrackerConfigurationState().subscribe((response: any) => {
      if (response.success) {
        var data = response.data;
        this.id = data.id;
        this.appsTrack = data.isTracking;
        this.disableUrls = data.disableUrls;
        this.considerPunchCard = data.considerPunchCard;
        this.screenShotsFrequency = data.isScreenshot;
        this.isDeleteScreenshots = data.isDelete;
        this.deleteScreenshots = data.deleteRoles;
        this.isRecordActivity = data.isRecord;
        this.record = data.recordRoles;
        this.isIdleTime = data.isIdealTime;
        this.idealTimeOpen = data.idealTimeRoles;
        this.isManualEntryTime = data.isManualTime;
        this.manualOpen = data.manualTimeRole;
        this.isOffileTracking = data.isOfflineTracking == null ? false : data.isOfflineTracking;
        this.offlineOpen = data.offlineOpen == null ? false : data.offlineOpen;
        this.isMouse = data.isMouse == null ? false : data.isMouse;
        this.mouseRoles = data.mouseRoles == null ? false : data.mouseRoles;
        this.timeStamp = data.timeStamp;
        if (this.appsTrack) {
          this.getActTrackeUrls();
          this.getActTrackerRoleConfigurationRoles();
        }
        if (this.screenShotsFrequency) {
          this.getActScreenshotfrequency()
        }
        if (this.deleteScreenshots || this.record || this.idealTimeOpen || this.manualOpen || this.offlineOpen) {
          this.getAllRemaingRoles();
        }
      }
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }

  getAllRoles() {
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
  }

  upsertActTrackerAppUrlType() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.appUrlId = this.selectedAppUrl ? this.selectedAppUrl : this.appsUrlToggle;
    activityModel.considerPunchCard = this.considerPunchCard;
    activityModel.frequencyIndex = -1;
    const userNames = this.Roles.map((x) => x.roleId);
    activityModel.roleId = userNames;
    activityModel.selectAll = false;
    this.activitytracker.UpsertActTrackerRoleConfiguration(activityModel).subscribe((response: any) => {
      if (response.success === true) {
        this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertIndividualAppUrlType(index) {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.frequencyIndex = this.frequencyIndex;
    this.activityForm = this.activitytrackerForm.get("activityForm") as FormArray;
    var appUrlId = this.activityForm.at(index).get("selectedAppUrl").value;
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
    this.activityForm.at(index).get("frequencyIndex").patchValue(index);
    // }
    // activityModel.frequencyIndex = index;
    activityModel.roleId = this.activityForm.at(index).get("selectedUsers").value;
    activityModel.selectAll = this.activityForm.at(index).get("isSelectAll").value;
    this.activitytracker.UpsertActTrackerRoleConfiguration(activityModel).subscribe((response: any) => {
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
        // tslint:disable-next-line: triple-equals
        this.initializeActivityForm();
        if (response.success == true && response.data != null) {
          var app = response.data.individualRoles;
          this.appsUrlToggle = null;
          if (response.data.appUrlId != null && response.data.appUrlId != "") {
            // tslint:disable-next-line: max-line-length
            this.appsUrlToggle = response.data.appUrlId === ConstantVariables.Apps ? "App" : response.data.appUrlId === ConstantVariables.off ? "off" : response.data.appUrlId === ConstantVariables.Urls ? "Url" : response.data.appUrlId === ConstantVariables.AppsUrls ? "AppandUrl" : response.data.appUrlId === ConstantVariables.AppUrlsDetailed ? "AppandUrlDetailed" : null;
            this.selectedAppUrl = response.data.appUrlId;
          }
          if(response.data.considerPunchCard){
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
          this.isThereAnError = true;
          this.validationMessage = response.apiResponseMessages[0].message;
          // this.initializeActivityForm();
        }
        // this.activityLength = this.activitytrackerForm.get('activityForm')['controls'].length;
        this.cdRef.detectChanges();
      });
    }
  }

  getActTrackeUrls() {
    this.activitytracker.getActTrackeUrls().subscribe((response: any) => {
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.buttonsurls = response.data;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
        // tslint:disable-next-line: triple-equals
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
            this.apps = [];
            app.forEach((x, i) => {
              if (x.roleId.length > 0) {
                this.apps.push(x);
              }
            });

            this.initializeScreenshotForm();
            this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
            this.screenForm.push(this.clearForm());
            this.screenForm.at(0).get("selectedRoleDB").patchValue([]);
            // this.screenForm.at(0).get("selectedUserDB").patchValue([]);
            if (this.apps && this.apps.length > 0) {
              // this.screenForm = this.ScreenshotForm.get("screenForm") as FormArray;
              this.apps.forEach((x, j) => {
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
          this.isThereAnError = true;
          this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.apps = response.data;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });

    (this.ScreenshotForm.get("screenForm") as FormArray).removeAt(addScreenshotIndex);
  }

  onChangeScreenShotFrequency(changedValue) {
    // tslint:disable-next-line: triple-equals
    // if (changedValue.value == 0) {
    this.screenshotTimeFrequency = this.screenshotTime;
    this.multiplier = changedValue;
    // } else {
    // this.screenshotTimeFrequency = this.screenshotTime;
    // this.multiplier = changedValue.value;
    // }
    this.upsertActTrackerScreenShotFrequency();
  }

  onChangeIndividualScreenShotFrequency(changedValue, index) {
    // tslint:disable-next-line: triple-equals
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.AfterDeletionRoles = response.data;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
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
        if(this.AfterDeletionRoles.offlineTrackingRoleIds.length > 0){
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
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertRecordActivity() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isRecordActivity = this.isRecordActivity;
    activityModel.roleId = this.recordRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertMouseActivity(){
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.isMouseActivity = this.isMouse;
    activityModel.roleId = this.mouseRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.upsertRolesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  upsertIdealTime() {
    this.upsertRolesLoading = true;
    const activityModel = new ActivityModel();
    activityModel.idleScreenShotCaptureTime = this.idleScreenShotCaptureTime;
    activityModel.idleAlertTime = this.idleAlertTime;
    activityModel.minimumIdelTime = this.minimumIdelTime;
    activityModel.isIdleTime = this.isIdleTime;
    activityModel.roleId = this.idealRoleId;
    this.selectedRoles = [];
    this.activitytracker.upsertActTrackerRolePermission(activityModel).subscribe((response: any) => {
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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

  upsertActivityTrackerConfigurationState() {
    this.stateloading = true;
    var activityConfigurationStateModel = new ActivityConfigurationStateModel();
    activityConfigurationStateModel.id = this.id;
    activityConfigurationStateModel.isTracking = this.appsTrack;
    activityConfigurationStateModel.disableUrls = this.disableUrls;
    activityConfigurationStateModel.isScreenshot = this.screenShotsFrequency;
    activityConfigurationStateModel.isDelete = this.isDeleteScreenshots;
    activityConfigurationStateModel.deleteRoles = this.deleteScreenshots;
    activityConfigurationStateModel.isRecord = this.isRecordActivity;
    activityConfigurationStateModel.recordRoles = this.record;
    activityConfigurationStateModel.isIdealTime = this.isIdleTime;
    activityConfigurationStateModel.idealTimeRoles = this.idealTimeOpen;
    activityConfigurationStateModel.isManualTime = this.isManualEntryTime;
    activityConfigurationStateModel.manualTimeRole = this.manualOpen;
    activityConfigurationStateModel.isOfflineTracking = this.isOffileTracking;
    activityConfigurationStateModel.offlineOpen = this.offlineOpen;
    activityConfigurationStateModel.isMouse = this.isMouse;
    activityConfigurationStateModel.mouseRoles = this.mouseRoles;
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
        else if (optionalParameters['individualPageView']){
          parentElementSelector = optionalParameters['individualPageSelector'];
          minHeight = `calc(100vh - 85px)`;
        }

        var counter = 0;
        var applyHeight = setInterval(function() {
          if(counter > 10){
            clearInterval(applyHeight);
          }
          counter++;
          if($(parentElementSelector + ' app-fm-component-activityapps mat-card.admin-activity-app-height').length > 0) {
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

  resetAllSettings(){
    this.onClickTrackAllAppsUrlsDetailed();
    this.upsertActTrackerAppUrlType();
    this.screenshotTime = 0;
    this.randomScreenshot = false;
    this.onChangeScreenShotFrequency(0);
    this.upsertDeleteScreenshotReset();
    this.appsTrack = true;
    this.disableUrls = false;
    this.screenShotsFrequency = false;
    this.isDeleteScreenshots = false;
    this.deleteScreenshots = false;
    this.isRecordActivity = false;
    this.record = false;
    this.isIdleTime = false;
    this.idealTimeOpen = false;
    this.isManualEntryTime = false;
    this.manualOpen = false;
    this.isOffileTracking = false;
    this.offlineOpen = false;
    this.isMouse = false;
    this.mouseRoles = false;
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
      // tslint:disable-next-line: triple-equals
      if (response.success == true) {
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'));
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
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
    activityConfigurationStateModel.isScreenshot = this.screenShotsFrequency;
    activityConfigurationStateModel.isDelete = this.isDeleteScreenshots;
    activityConfigurationStateModel.deleteRoles = this.deleteScreenshots;
    activityConfigurationStateModel.isRecord = this.isRecordActivity;
    activityConfigurationStateModel.recordRoles = this.record;
    activityConfigurationStateModel.isIdealTime = this.isIdleTime;
    activityConfigurationStateModel.idealTimeRoles = this.idealTimeOpen;
    activityConfigurationStateModel.isManualTime = this.isManualEntryTime;
    activityConfigurationStateModel.manualTimeRole = this.manualOpen;
    activityConfigurationStateModel.isOfflineTracking = this.isOffileTracking;
    activityConfigurationStateModel.offlineOpen = this.offlineOpen;
    activityConfigurationStateModel.isMouse = this.isMouse;
    activityConfigurationStateModel.mouseRoles = this.mouseRoles;
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
      this.getActivityTrackerConfigurationState();
    });
  }
}
