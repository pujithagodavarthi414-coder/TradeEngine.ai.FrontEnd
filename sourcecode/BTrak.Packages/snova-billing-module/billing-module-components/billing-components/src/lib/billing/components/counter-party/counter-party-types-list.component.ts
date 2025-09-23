import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, QueryList, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from "ng2-dragula";
import { Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap, takeUntil } from 'rxjs/operators';

import { SatPopover } from '@ncstate/sat-popover';
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { CounterPartyTypesModel } from '../../models/counter-party-types.model';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { RoleModel } from '../../models/role-model';
import { AppBaseComponent } from '../componentbase';
import * as $_ from 'jquery';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
const $ = $_;

@Component({
  selector: "app-counter-party-types",
  templateUrl: "counter-party-types-list.component.html",
  providers: [DragulaService]
})

export class CounterPartyTypesComponent extends AppBaseComponent implements OnInit {

  @Output() reOrderImplementation = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren('addCounterPartyPopup') addCounterPartyPopup;
  @ViewChildren('deleteCounterPartyTypePopup') deleteCounterPartyTypePopup;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild("allSelected") private allSelected: MatOption;
  @Output() getworkflowStatusAll = new EventEmitter<string>();
  softLabels: SoftLabelConfigurationModel[];
  disabled: boolean;
  showSpinner: boolean;
  timeStamp: any;
  workFlowManagementDataInProgress: boolean = false;
  permissionManagementLoopingData: any[] = [1, 2, 3];
  isAnyOperationIsInprogress: boolean = false;
  reOrderOperationInProgress: boolean;
  public ngDestroyed$ = new Subject();
  selectStatus: FormGroup;
  subs = new Subscription();
  statusForm: FormGroup;
  isAddStatusId: string;
  isArchiveStatusId: string;
  isArchived: boolean;
  temp: any;
  clientTypeList: any;
  counterPartyTitle: any;
  clientTypeForm: FormGroup;
  rolesList: any;
  selectedRoles: any;
  id: any;
  counterPartTypesIdsList: any[];
  selectedCounterPartType: any;

  constructor(
    private translateService: TranslateService,
    private BillingDashboardService: BillingDashboardService,
    private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private dragulaService: DragulaService,
    private toastr: ToastrService,
    private softlabel: SoftLabelPipe,
    private fb: FormBuilder
  ) {
    super();
    this.handleDragulaDragAndDropActions(dragulaService);
    this.getCounterPartyTypes();
    this.getRoles();
  }

  getCounterPartyTypes(){
    let counterPartyTypesModel = new CounterPartyTypesModel();
    counterPartyTypesModel.isArchived = this.isArchived;
    this.BillingDashboardService.getCounterPartyTypes(counterPartyTypesModel)
      .subscribe((responseData: any) => {
        this.clientTypeList = responseData.data;
        this.isAnyOperationIsInprogress = false;
        this.reOrderOperationInProgress = false;
        this.cdRef.detectChanges();
      });
  }

  UpsertClientType(formDirective: FormGroupDirective) {
    this.getSelectedRoles();
        let roles;
        if (Array.isArray(this.clientTypeForm.value.roleIds))
            roles = this.clientTypeForm.value.roleIds
        else
            roles = this.clientTypeForm.value.roleIds.split(',');

        const index2 = roles.indexOf(0);
        if (index2 > -1) {
            roles.splice(index2, 1)
        }
    this.isAnyOperationIsInprogress = true;
    let counterPartyTypesModel = new CounterPartyTypesModel();
    counterPartyTypesModel = this.clientTypeForm.value;
    counterPartyTypesModel.clientTypeId = this.id;
    counterPartyTypesModel.timeStamp = this.timeStamp;
    counterPartyTypesModel.roleIds = roles.join();
    this.BillingDashboardService.UpsertClientType(counterPartyTypesModel).subscribe((response: any) => {
        if (response.success === true) {
            this.addCounterPartyPopup.forEach((p) => p.closePopover());
            this.clearForm();
            formDirective.resetForm();
            this.getCounterPartyTypes();
            this.allSelected.deselect();
        } else {
            this.toastr.error('', this.softlabel.transform(response.apiResponseMessages[0].message,this.softLabels));
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    });
}

  createCounterPartyType(addCounterPartyPopup) {
    addCounterPartyPopup.openPopover();
    this.allSelected.deselect();
    this.counterPartyTitle = this.translateService.instant("COUNTERPARTYTYPE.ADDCOUNTERPARTYTYPE");
  }

  editCounterPartyType(counterPartyType,editCounterPartyPopup){
    
    this.selectedRoles = counterPartyType.roleNames;
    let roleIds = [];
    if (counterPartyType.roleIds != null) {
    counterPartyType.roleIds.split(',').forEach(element => {
            roleIds.push(element)
        });
        if(this.rolesList!=undefined){
        if (roleIds.length === this.rolesList.length) {
            roleIds.push(0);
        }
    }
    }
    counterPartyType.roleIds=roleIds;
    this.clientTypeForm.patchValue(counterPartyType);
    this.id = counterPartyType.clientTypeId;
    this.counterPartyTitle = this.translateService.instant("COUNTERPARTYTYPE.EDITCOUNTERPARTYTYPE");
    editCounterPartyPopup.openPopover();
    this.timeStamp = counterPartyType.timeStamp;
  }

ngOnInit() {
  super.ngOnInit();
  this.clearForm();
  this.getSoftLabels();
}

getSoftLabels() {
  this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
}

clearForm() {
  this.id=null;
  this.timeStamp=null;
  this.selectedRoles=null;
  this.clientTypeForm = new FormGroup({
    clientTypeName: new FormControl("",Validators.compose([Validators.required,Validators.maxLength(50)])),
    roleIds: new FormControl("", []),
    order: new FormControl("", [])
  });
}
getRoles() {
  var companyModel = new RoleModel();
  companyModel.isArchived = false;
  this.BillingDashboardService.getRoles(companyModel).subscribe((response: any) => {
    if (response.success == true) {
      this.rolesList = response.data;
      this.cdRef.detectChanges()
    }
    else {
      this.toastr.error('', this.softlabel.transform(response.apiResponseMessages[0].message,this.softLabels));
    }
  });
}

compareSelectedRolesFn(roles: any, selectedroles: any) {
  if (roles === selectedroles) {
      return true;
  } else {
      return false;
  }

}

getSelectedRoles() {

  let rolevalues;
  if (Array.isArray(this.clientTypeForm.value.roleIds))
      rolevalues = this.clientTypeForm.value.roleIds;
  else
      rolevalues = this.clientTypeForm.value.roleIds.split(',');

  const component = rolevalues;
  const index = component.indexOf(0);
  if (index > -1) {
      component.splice(index, 1);
  }
  const rolesList = this.rolesList;
  const selectedUsersList = _.filter(rolesList, function (role) {
      return component.toString().includes(role.roleId);
  })
  const roleNames = selectedUsersList.map((x) => x.roleName);
  this.selectedRoles = roleNames.toString();
}

toggleAllRolesSelected() {
  if (this.allSelected.selected) {
      this.clientTypeForm.controls['roleIds'].patchValue([
          0, ...this.rolesList.map(item => item.roleId)
      ]);
  } else {
      this.clientTypeForm.controls['roleIds'].patchValue([]);
  }
  this.getSelectedRoles()
}

toggleGoalStatusPerOne(event) {
  if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
  }
  if (
      this.clientTypeForm.controls['roleIds'].value.length ===
      this.rolesList.length
  ) {
      this.allSelected.select();
  }
}

  private handleDragulaDragAndDropActions(dragulaService: DragulaService) {
    dragulaService.createGroup("reOrderItems", {
      accepts: this.acceptDragulaCallback,
      revertOnSpill: true
    });


    this.subs.add(this.dragulaService.drag("reOrderItems")
      .subscribe(({ el }) => {
        if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
          this.dragulaService.find('reOrderItems').drake.cancel(true);
        }
      })
    );
    this.subs.add(this.dragulaService.drop("reOrderItems").pipe(
      takeUntil(this.ngDestroyed$))
      .subscribe(({ name, el, target, source, sibling }) => {
        if (!(this.reOrderOperationInProgress)) {

          var orderedListLength = target.children.length;
          this.counterPartTypesIdsList = [];
          for (var i = 0; i < orderedListLength; i++) {
            var clientTypeId = target.children[i].attributes["data-clientTypeId"].nodeValue;
            var index = this.counterPartTypesIdsList.indexOf(clientTypeId.toLowerCase());
            if (index === -1) {
              this.counterPartTypesIdsList.push(clientTypeId.toLowerCase());
            }
          }
          this.changeOrderForWorkflowStatus();
        }
        else if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
        }
      })
    );
  }

  changeOrderForWorkflowStatus() {
    this.reOrderOperationInProgress = true;
    var counterPartyTypesModel = new CounterPartyTypesModel();
    counterPartyTypesModel.clientTypeIds = this.counterPartTypesIdsList;
    this.BillingDashboardService.reorderClientType(counterPartyTypesModel).subscribe((x: any) => {
      this.reOrderOperationInProgress = false;
      this.getCounterPartyTypes();
      if (x.success) {
        this.counterPartTypesIdsList = [];
        this.reOrderImplementation.emit('');
        this.getworkflowStatusAll.emit('');
      }
    })
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy("reOrderItems");
    this.ngDestroyed$.next();
  }
  private acceptDragulaCallback = (el, target, source, sibling) => {
    return true
  };

  closedialog() {
    this.addCounterPartyPopup.forEach((p) => p.closePopover());
    this.cdRef.detectChanges();
  }

  closeDeleteDialog() {
    this.deleteCounterPartyTypePopup.forEach((p) => p.closePopover());
    this.cdRef.detectChanges();
  }

  archiveCounterPartyType() {
    this.isAnyOperationIsInprogress = true;
    const counterPartyTypesModel = new CounterPartyTypesModel();
    counterPartyTypesModel.clientTypeId = this.selectedCounterPartType.clientTypeId;
    counterPartyTypesModel.clientTypeName = this.selectedCounterPartType.clientTypeName;
    counterPartyTypesModel.timeStamp = this.selectedCounterPartType.timeStamp;
    counterPartyTypesModel.roleIds = this.selectedCounterPartType.roleIds;
    counterPartyTypesModel.isArchived = !this.isArchived;
    this.BillingDashboardService.UpsertClientType(counterPartyTypesModel).subscribe((response: any) => {
        if (response.success === true) {
            this.deleteCounterPartyTypePopup.forEach((p) => p.closePopover());
            this.clearForm();
            this.getCounterPartyTypes();
        } else {
            this.toastr.error('', this.softlabel.transform(response.apiResponseMessages[0].message,this.softLabels));
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    });
}
archiveCounterPartyTypePopUpOpen(clientType, deleteArchiveCounterPartyTypePopup) {
  this.selectedCounterPartType = clientType;
  deleteArchiveCounterPartyTypePopup.openPopover();
}
  fitContent(optionalParameters: any) {
    var interval;
    var count = 0;
    if (optionalParameters['gridsterView']) {
      interval = setInterval(() => {
        try {
          if (count > 30) {
            clearInterval(interval);
          }
          count++;
          if ($(optionalParameters['gridsterViewSelector'] + ' .client-type-height').length > 0) {
            var contentHeight = $(optionalParameters['gridsterViewSelector']).height() - 90;
            $(optionalParameters['gridsterViewSelector'] + ' .client-type-height').css("cssText", `height: ${contentHeight}px !important;`);
            clearInterval(interval);
          }
        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);
    }
  }
}
