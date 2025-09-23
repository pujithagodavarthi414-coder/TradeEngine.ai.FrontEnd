import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConfigInputModel } from '../models/config-input-model';
import { RolesModel } from '../models/role-model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { forkJoin } from 'rxjs';
import * as _ from 'underscore';

@Component({
  selector: "app-fm-component-mode-config",
  templateUrl: "activity-tracker-mode-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActivityModeConfigComponent extends CustomAppBaseComponent implements OnInit {
  modesConfig: any;
  roles: RolesModel[];
  loading: boolean;
  settingsLoader: boolean;
  
  stealthMode: boolean;
  stealthModeRole: RolesModel[];
  stealthModeRoleIds: any;
  stealthShiftMode: boolean;
  stealthPunchCardBased: boolean;
  
  prMode: boolean;
  prModeRole: RolesModel[];
  prModeRoleIds: any;
  prShiftMode: boolean;
  prPunchCardBased: boolean;

  punchCardMode: boolean;
  punchCardModeRole: RolesModel[];
  punchCardModeRoleIds: any;
  punchCardShiftMode: boolean;
  punchCardPunchCardBased: boolean;

  messengerMode: boolean;
  messengerModeRole: RolesModel[];
  messengerModeRoleIds: any;
  messengerShiftMode: boolean;
  messengerPunchCardBased: boolean;

  constructor(
    private activityTrackerService: ActivityTrackerService, private toastr: ToastrService,
    private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.init();
  }

  init(){
    this.loading = true;
    var role = new RolesModel();
    role.isArchived = false;
    forkJoin(
      this.activityTrackerService.getActivityTrackerModeConfig(),
      this.activityTrackerService.getAllRoles(role)
    ).subscribe(([configResponse, rolesResponse]) => {
      this.modesConfig = configResponse['data'];
      this.setConfig(this.modesConfig);
      this.addOrRemoveRoles(rolesResponse);
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }

  setConfig(modesConfig) {
    if(modesConfig && modesConfig.length > 0){
      modesConfig.forEach((record, index) => {
        if(record.modeId == ConstantVariables.StealthMode){
          this.stealthModeRoleIds = record.rolesIds ? record.rolesIds : [];
          this.stealthShiftMode = record.shiftBased;
          this.stealthPunchCardBased =record.punchCardBased;
          if(this.stealthModeRoleIds.length > 0){
            this.stealthMode = true;
          }
        } else if (record.modeId == ConstantVariables.PRMode){
          this.prModeRoleIds = record.rolesIds ? record.rolesIds : [];
          this.prShiftMode = record.shiftBased;
          this.prPunchCardBased =record.punchCardBased;
          if(this.prModeRoleIds.length > 0){
            this.prMode = true;
          }
        } else if (record.modeId == ConstantVariables.PunchCardMode){
          this.punchCardModeRoleIds = record.rolesIds ? record.rolesIds : [];
          this.punchCardShiftMode = record.shiftBased;
          this.punchCardPunchCardBased = record.punchCardBased;
          if(this.punchCardModeRoleIds.length > 0){
            this.punchCardMode = true;
          }
        } else if (record.modeId == ConstantVariables.MessengerMode){
          this.messengerModeRoleIds = record.rolesIds ? record.rolesIds : [];
          this.messengerShiftMode = record.shiftBased;
          this.messengerPunchCardBased = record.punchCardBased;
          if(this.messengerModeRoleIds.length > 0){
            this.messengerMode = true;
          }
        }
      });
    }
  }

  upsertStealthModeConfig() {
    var configModel = new ConfigInputModel();
    configModel.rolesIds = this.stealthModeRoleIds;
    if(!this.stealthModeRoleIds || this.stealthModeRoleIds.length == 0) {
      this.stealthShiftMode = false;
      this.stealthMode = false;
      this.stealthPunchCardBased = false;
    }
    configModel.shiftBased = this.stealthShiftMode;
    configModel.punchCardBased = this.stealthPunchCardBased;
    configModel.modeId = ConstantVariables.StealthMode;
    this.addOrRemoveRoles();
    this.upsertConfig(configModel);

  }

  upsertPrModeConfig() {
    var configModel = new ConfigInputModel();
    configModel.rolesIds = this.prModeRoleIds;
    if(!this.prModeRoleIds || this.prModeRoleIds.length == 0) {
      this.prShiftMode = false;
      this.prMode = false;
      this.prPunchCardBased = false
    }
    configModel.shiftBased = this.prShiftMode;
    configModel.punchCardBased = this.prPunchCardBased;
    configModel.modeId = ConstantVariables.PRMode;
    this.addOrRemoveRoles();
    this.upsertConfig(configModel);
  }

  upsertPunchCardModeConfig() {
    var configModel = new ConfigInputModel();
    configModel.rolesIds = this.punchCardModeRoleIds;

    if(!this.punchCardModeRoleIds || this.punchCardModeRoleIds.length == 0) {
      this.punchCardShiftMode = false;
      this.punchCardMode = false;
      this.punchCardPunchCardBased = false;
    }

    if(this.punchCardPunchCardBased){
      this.punchCardShiftMode = false;
    }

    if(this.punchCardShiftMode){
      this.punchCardPunchCardBased = false;
    }

    configModel.shiftBased = this.punchCardShiftMode;
    configModel.punchCardBased = this.punchCardPunchCardBased;
    configModel.modeId = ConstantVariables.PunchCardMode;
    this.addOrRemoveRoles();
    this.upsertConfig(configModel);
  }

  upsertMessengerModeConfig() {
    var configModel = new ConfigInputModel();
    configModel.rolesIds = this.messengerModeRoleIds;
    if(!this.messengerModeRoleIds || this.messengerModeRoleIds.length == 0) {
      this.messengerShiftMode = false;
      this.messengerMode = false;
      this.messengerPunchCardBased = false;
    }
    configModel.shiftBased = this.messengerShiftMode;
    configModel.punchCardBased = this.messengerPunchCardBased;
    configModel.modeId = ConstantVariables.MessengerMode;
    this.addOrRemoveRoles();
    this.upsertConfig(configModel);
  }

  addOrRemoveRoles(rolesResponse = null) {
    if(rolesResponse) {
      this.roles = JSON.parse(JSON.stringify(rolesResponse['data']));
      this.stealthModeRole = JSON.parse(JSON.stringify(rolesResponse['data']));
      this.prModeRole = JSON.parse(JSON.stringify(rolesResponse['data']));
      this.punchCardModeRole = JSON.parse(JSON.stringify(rolesResponse['data']));
      this.messengerModeRole = JSON.parse(JSON.stringify(rolesResponse['data']));
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }

    var allRoleIds = _.pluck(this.roles, 'roleId');
    if(allRoleIds && allRoleIds.length > 0) {

      allRoleIds.forEach((roleId) => {
        if
        (
          !_.contains(this.stealthModeRoleIds, roleId) 
          && !_.contains(this.prModeRoleIds, roleId)
          && !_.contains(this.punchCardModeRoleIds, roleId)
          && !_.contains(this.messengerModeRoleIds, roleId)
        ) {
          if(this.stealthModeRole.findIndex((x) => {return x.roleId == roleId}) == -1) {
            this.stealthModeRole.push(_.find(this.roles, function(role){ return role.roleId == roleId; }));
          }

          if(this.prModeRole.findIndex((x) => {return x.roleId == roleId}) == -1) {
            this.prModeRole.push(_.find(this.roles, function(role){ return role.roleId == roleId; }));
          }

          if(this.punchCardModeRole.findIndex((x) => {return x.roleId == roleId}) == -1) {
            this.punchCardModeRole.push(_.find(this.roles, function(role){ return role.roleId == roleId; }));
          }

          if(this.messengerModeRole.findIndex((x) => {return x.roleId == roleId}) == -1) {
            this.messengerModeRole.push(_.find(this.roles, function(role){ return role.roleId == roleId; }));
          }
        }
      });
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }

    if(this.stealthModeRoleIds && this.stealthModeRoleIds.length > 0){
      this.stealthModeRoleIds.forEach((roleId) => {
        var index;

        index = this.prModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.prModeRole.splice(index, 1);
        }

        index = this.punchCardModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.punchCardModeRole.splice(index, 1);
        }

        index = this.messengerModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1){
          this.messengerModeRole.splice(index, 1);
        }
      });
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }

    if(this.prModeRoleIds && this.prModeRoleIds.length > 0){
      this.prModeRoleIds.forEach((roleId) => {
        var index;

        index = this.stealthModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.stealthModeRole.splice(index, 1);
        }

        index = this.punchCardModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.punchCardModeRole.splice(index, 1);
        }

        index = this.messengerModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.messengerModeRole.splice(index, 1);
        }
      });
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }

    if(this.punchCardModeRoleIds && this.punchCardModeRoleIds.length > 0){
      this.punchCardModeRoleIds.forEach((roleId) => {
        var index;

        index = this.stealthModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.stealthModeRole.splice(index, 1);
        }

        index = this.prModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.prModeRole.splice(index, 1);
        }

        index = this.messengerModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.messengerModeRole.splice(index, 1);
        }
      });
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }

    if(this.messengerModeRoleIds && this.messengerModeRoleIds.length > 0){
      this.messengerModeRoleIds.forEach((roleId) => {
        var index;

        index = this.stealthModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.stealthModeRole.splice(index, 1);
        }

        index = this.prModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.prModeRole.splice(index, 1);
        }

        index = this.punchCardModeRole.findIndex((role) => { return role.roleId == roleId });
        if(index != -1) {
          this.punchCardModeRole.splice(index, 1);
        }
      });
      this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    }
    this.cdRef.detectChanges();
    this.cdRef.markForCheck();
   
  }

  upsertConfig(configModel: ConfigInputModel){
    this.settingsLoader = true;
    this.activityTrackerService.upsertActivityTrackerModeConfig(configModel).subscribe((response: any) => {
      if(response.success && response.data){
        this.settingsLoader = false;
        this.toastr.success("", this.translateService.instant('ACTIVITYTRACKER.SETTINGSSAVED'))
        this.cdRef.detectChanges();
      } else {
        this.settingsLoader = false;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.cdRef.detectChanges();
      }
    });
  }
}
