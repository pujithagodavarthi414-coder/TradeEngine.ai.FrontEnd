import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../../models/dashboardFilterModel';
import { ProjectManagementService } from '../../../services/project-management.service';
import { BoardTypeModel } from '../../../models/projects/boardTypeDropDown';
import { BoardType } from '../../../models/projects/boardtypes';
import { BoardTypeUiModel } from '../../../models/projects/boardTypeUiModel';
import { WorkFlow } from '../../../models/projects/workFlow';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MasterDataManagementService } from '../../../services/master-data-management.service';
import { CompanysettingsModel } from '../../../models/company-model';
import { SoftLabelConfigurationModel } from '../../../models/hr-models/softlabels-model';
import { ConstantVariables } from '../../../helpers/constant-variables';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';


@Component({
  selector: "app-pm-component-boardtypeworkflow",
  templateUrl: "boardTypeWorkFlow.component.html",
})
export class BoardTypeWorkFlowComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('addBoardTypeWorkFlowPopUp') boardTypePopovers;
  @ViewChildren('addBoardTypeWorkFlowPopUp1') boardTypePopovers1;
  @ViewChild("formDirective") formDirective: FormGroupDirective;
  isEdit: boolean = false;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  private boardtype: BoardTypeModel;
  success: boolean;
  showSpinner: boolean;
  anyOperationInProgress: boolean;
  isArchivedTypes: boolean;
  errorMessage: boolean;
  validationMessages: string;
  selectedBoardTypeName: string;
  selectedBoardTypeWorkFlow: string;
  searchText: string;
  boardTypeId: string;
  selectedWorkFlowId: string;
  timeStamp: string;
  boardTypes: BoardType[];
  isDefault: boolean;
  temp: BoardType[];
  boardTypeUIList: BoardTypeUiModel[];
  workFlowsList: WorkFlow[];
  boardTypeForm: FormGroup;
  boardTypeInputModel: BoardTypeModel;
  public ngDestroyed$ = new Subject();
  isEditBoardType: boolean = false;
  isEditWorkFlow: boolean = true;
  isBugBoardEnable: boolean;
  projectButtonIcon: string;
  buttontext: string;
  softLabels: SoftLabelConfigurationModel[];
  canAccess_feature_ManageBoardTypeWorkflow: Boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private boardTypeService: ProjectManagementService, private toastr: ToastrService,
    private snackBar: MatSnackBar, private translateService: TranslateService,
    private masterSettings: MasterDataManagementService
  ) {
    super();


    this.getCompanySettings();
  }

  getCompanySettings() {
    var companysettingsModel = new CompanysettingsModel();
    companysettingsModel.isArchived = false;
    this.masterSettings.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
      if (response.success == true && response.data.length > 0) {
        let companyResult = response.data.filter(item => item.key.trim() == "EnableBugBoard");
        if (companyResult.length > 0) {
          this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
        }
      }
    });
  }

  getBoardTypeDetails() {
    this.anyOperationInProgress = true;
    this.boardTypeService.GetAllBoardTypes().subscribe((response: any) => {
      if (response.success == true) {
        this.boardTypes = response.data;
        this.temp = this.boardTypes;
        this.clearForm();
        this.cdRef.detectChanges();
      }
      if (response.success == false) {
        this.validationMessages = response.apiResponseMessages[0].message;
        this.anyOperationInProgress = false;
        this.toastr.error(this.validationMessages);
        this.cdRef.detectChanges();
      }
    });
  }

  getBoardTypeUIAndWorkFlow() {
    this.boardTypeService.GetAllBoardTypesUI().subscribe((response: any) => {
      if (response.success) {
        this.boardTypeUIList = response.data;
      }
      else {
        this.validationMessages = response.apiResponseMessages[0].message;
        this.anyOperationInProgress = false;
        this.toastr.error(this.validationMessages);
      }
    });

    this.boardTypeService.GetAllWorkFlows().subscribe((response: any) => {
      if (response.success) {
        this.workFlowsList = response.data;
      }
      else {
        this.validationMessages = response.apiResponseMessages[0].message;
        this.anyOperationInProgress = false;
        this.toastr.error(this.validationMessages);
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.clearForm();
    if (this.canAccess_feature_ManageBoardTypeWorkflow) {
      this.getBoardTypeDetails();
    }
    this.getBoardTypeUIAndWorkFlow();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  clearForm() {
    this.showSpinner = false;
    this.anyOperationInProgress = false;
    this.boardTypeId = null;
    this.selectedBoardTypeWorkFlow = null;
    this.errorMessage = false;
    this.selectedBoardTypeName = null;
    this.timeStamp = null;
    this.selectedWorkFlowId = null;
    this.isEditBoardType = false;
    this.isDefault = false;
    this.projectButtonIcon = "plus";
    this.buttontext = this.translateService.instant("BOARDTYPEWORKFLOW.ADD");
    this.boardTypeForm = new FormGroup({
      boardTypeName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)])),
      boardTypeUiId: new FormControl("", [Validators.required]),
      workFlowId: new FormControl("", []),
      isDefaultSelected: new FormControl("", [])
    });
  }

  closeDialog() {
    this.formDirective.resetForm();
    this.boardTypePopovers.forEach((p) => p.closePopover());
    this.boardTypePopovers1.forEach((p) => p.closePopover());
  }

  createBoardTypePopUpOpen(addBoardTypeWorkFlowPopUp) {
    this.isEdit = false;
    this.clearForm();
    this.isEditBoardType = false;
    this.isEditWorkFlow = true;
    addBoardTypeWorkFlowPopUp.openPopover();
    this.cdRef.markForCheck();
  }

  editBoardTypeWorkFlowPopover(row, addBoardTypeWorkFlowPopUp) {
    this.isEdit = true;
    this.projectButtonIcon = "sync";
    this.buttontext = this.translateService.instant("BOARDTYPEWORKFLOW.UPDATE");
    this.errorMessage = false;
    if (row.isSuperAgileBoard) {
      row.isDefaultSelected = "isSuperagile"
    } else if (row.isBugBoard) {
      row.isDefaultSelected = "isBugBoard"
    }
    this.boardTypeForm.patchValue(row);
    this.isEditBoardType = true;
    this.isEditWorkFlow = false;
    this.boardTypeId = row.boardTypeId;
    this.selectedWorkFlowId = row.workFlowId;
    this.isDefault = row.isDefault;
    this.timeStamp = row.timeStamp;
    addBoardTypeWorkFlowPopUp.openPopover();
  }

  onBlurMethod(value) {
    if (value === "Api" || value === "API") {
      this.boardTypeForm.controls["workFlowId"].clearValidators();
      this.boardTypeForm.get("workFlowId").updateValueAndValidity();
    } else {
      this.boardTypeForm.controls["workFlowId"].setValidators([
        Validators.required
      ]);
      this.boardTypeForm.get("workFlowId").updateValueAndValidity();
    }
  }

  SaveBoardType() {
    this.showSpinner = true;
    this.anyOperationInProgress = true;
    this.boardTypeInputModel = this.boardTypeForm.value;
    this.boardTypeInputModel.boardTypeId = this.boardTypeId;
    if (this.isEditBoardType) {
      this.boardTypeInputModel.workFlowId = this.selectedWorkFlowId;
    }
    this.boardTypeInputModel.timeStamp = this.timeStamp;
    if (this.boardTypeInputModel.boardTypeUiId === "0") {
      this.boardTypeInputModel.boardTypeUiId = null;
    }
    if (this.boardTypeForm.value.isDefaultSelected == "isSuperagile") {
      this.boardTypeInputModel.isSuperAgileBoard = true;
      this.boardTypeInputModel.isBugBoard = false;
    } else if (this.boardTypeForm.value.isDefaultSelected == "isBugBoard") {
      this.boardTypeInputModel.isBugBoard = true;
      this.boardTypeInputModel.isSuperAgileBoard = false;
    } else {
      this.boardTypeInputModel.isSuperAgileBoard = false;
      this.boardTypeInputModel.isBugBoard = false;
    }
    this.boardTypeInputModel.isDefault = this.isDefault;

    this.boardTypeService
      .UpsertBoardType(this.boardTypeInputModel)
      .subscribe((responseData: any) => {
        this.success = responseData.success;
        this.anyOperationInProgress = false;
        this.showSpinner = false;
        if (this.success) {
          const toastrMessage = this.boardTypeInputModel.boardTypeName + " " + this.translateService.instant(ConstantVariables.BoardTypeCreated);
          this.snackBar.open(toastrMessage, "", { duration: 3000 });
          this.formDirective.resetForm();
          this.clearForm();
          this.getBoardTypeDetails();
          this.boardTypePopovers.forEach((p) => p.closePopover());
          this.boardTypePopovers1.forEach((p) => p.closePopover());
        } else {
          this.errorMessage = true;
          this.validationMessages = responseData.apiResponseMessages[0].message;
        }
        this.cdRef.detectChanges();
      });
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }

    const temp = this.temp.filter(boardType => (boardType.boardTypeName.toLowerCase().indexOf(this.searchText) > -1)
      || ((boardType.workFlowName == null) ? null : boardType.workFlowName.toLowerCase().indexOf(this.searchText) > -1) || ((boardType.boardTypeUiName == null) ? null : boardType.boardTypeUiName.toLowerCase().indexOf(this.searchText) > -1));

    this.boardTypes = temp;
  }

  closeSearch() {
    this.filterByName(null);
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
