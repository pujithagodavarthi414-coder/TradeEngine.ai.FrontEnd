import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { RecruitmentService } from '../services/recruitment.service';
import { InterviewTypeUpsertModel } from '../models/InterviewTypeUpsertModel';
import * as _ from 'underscore';
import * as $_ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CustomFormFieldModel } from '../../snovasys-recruitment-management/models/custom-field.model';
import { Subject } from 'rxjs';
import { InterviewProcessModel } from '../models/InterviewProcessModel';

const $ = $_;
@Component({
  selector: 'app-am-component-interview-process',
  templateUrl: 'interview-process-app.component.html'
})

export class InterviewProcessAppComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('upsertInterviewTypePopUp') upsertInterviewTypePopover;
  @ViewChildren('deleteInterviewTypePopup') deleteInterviewTypePopover;
  @ViewChildren('upsertInterviewPopUp') upsertInterviewPopUp;
  @ViewChildren('deleteInterviewProcessPopup') deleteInterviewProcessPopup;
  @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
  @ViewChild('allInterviewsSelected') private allInterviewsSelected: MatOption;

  @Input('dashboardFilters')
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  @Input('fromRoute')
  set _fromRoute(data: boolean) {
    if (data || data === false) {
      this.isFromRoute = data; } else {
      this.isFromRoute = true; }
  }
  role: any;
  moduleTypeId: number;
  isButtonVisible: boolean;
  isFormType: boolean;
  isEdit: boolean;
  isEditForm: boolean;
  interviewtypeId: string;
  referenceId: string;
  isrecruitment: boolean;
  addInterviewForm: any;
  interviewProcess: any;
  sourceTitle: any;
  loadSpinner: boolean;
  interviewProcessName: any;
  interviewTypes: any;
  selectedInterviewTypes: any;
  selectInterviewTypes: any;
  interviewTypeIds: any[];
  interviewTypeIds1: any;
  interviewTypeNames: any;
  interviewProcessId: any;
  interviewprocessTitle: any;
  dashboardFilters: DashboardFilterModel;
  isAnyOperationIsInprogress = true;
  isArchived = false;
  interviewType: InterviewTypeUpsertModel[];
  isFromRoute = false;
  validationMessage: string;
  isFiltersVisible = false;
  isThereAnError: boolean;
  interviewTypeForm: FormGroup;
  timeStamp: any;
  temp: any;
  searchText: string;
  interviewTypeId: any;
  interviewTypeName: string;
  loading = false;
  interviewTypeTitle: string;
  isVideo = false;
  color = '';
  roleId: string;
  customFormComponent: CustomFormFieldModel;
  isreload: string;
  public ngDestroyed$ = new Subject();

  constructor(
    private recruitmentService: RecruitmentService, private cdRef: ChangeDetectorRef,
    private translateService: TranslateService, private toastr: ToastrService, public dialog: MatDialog) {
    super();
    this.moduleTypeId = 24;
  }

  ngOnInit() {
    this.clearForm();
    super.ngOnInit();
    this.getInterviewType();
    this.getInterviewProcess();
  }

  UpsertInterviewProcess(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    let interviewprocess = new InterviewProcessModel();
    interviewprocess = this.addInterviewForm.value;
    interviewprocess.interviewProcessName = interviewprocess.interviewProcessName.toString().trim();
    interviewprocess.interviewProcessId = interviewprocess.interviewProcessId;
    interviewprocess.interviewTypeId = interviewprocess.interviewTypeId;
    interviewprocess.timeStamp = this.timeStamp;
    this.recruitmentService.upsertInterviewProcess(interviewprocess).subscribe((response: any) => {
      if (response.success === true) {
        this.upsertInterviewPopUp.forEach((p) => p.closePopover());
        this.clearForm();
        formDirective.resetForm();
        this.getInterviewProcess();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  getInterviewProcess() {
    this.isAnyOperationIsInprogress = true;
    const interviewProcessModel = new InterviewProcessModel();
    interviewProcessModel.isArchived = this.isArchived;
    this.recruitmentService.getInterviewProcess(interviewProcessModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.clearForm();
        this.interviewProcess = response.data;
        this.temp = this.interviewProcess;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  createInterviewProcess(upsertInterviewPopover) {
    upsertInterviewPopover.openPopover();
    this.interviewprocessTitle = this.translateService.instant('INTERVIEWPROCESS.INTERVIEWPROCESSTITLE');
  }

  clearForm() {
    this.interviewProcessName = null;
    this.interviewTypeIds = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.searchText = null;
    this.addInterviewForm = new FormGroup({
      interviewProcessName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      interviewTypeId: new FormControl('',
        Validators.compose([
          Validators.required,
        ])
      ),
      interviewProcessId: new FormControl(null,
        Validators.compose([

        ])
      ),
      interviewTypeIds: new FormControl('',
        Validators.compose([

        ])
      )
    });
  }

  toggleAllInterviewTypesSelection1() {
    if (this.allInterviewsSelected.selected && this.interviewTypes) {
      this.addInterviewForm.get('interviewTypeId').patchValue([
        ...this.interviewTypes.map((item) => item.interviewTypeId),
        0
      ]);
      this.selectedInterviewTypes = this.interviewTypes.map((item) => item.interviewTypeId);
    } else {
      this.addInterviewForm.get('interviewTypeId').patchValue([]);
    }
  }

  toggleInterviewTypesPerOne1() {
    if (this.allInterviewsSelected.selected) {
      this.allInterviewsSelected.deselect();
      return false;
    }
    if (
      this.addInterviewForm.get('interviewTypeId').value.length === this.interviewTypes.length
    ) {
      this.allInterviewsSelected.select();
    }
  }

  bindInterviewTypeIds(interviewTypeIds) {
    if (interviewTypeIds) {
      const interviewTypesList = this.interviewTypes;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(interviewTypesList, function(member: any) {
        return interviewTypeIds.toString().includes(member.interviewTypeIds);
      });
      const selectedInterviewTypes = filteredList.map((x: any) => x.interviewTypeName);
      this.selectedInterviewTypes = selectedInterviewTypes.toString();
    } else {
      this.selectedInterviewTypes = '';
    }
  }

  compareSelectedInterviewTypesFn(interviewTypes: any, selectedModules: any) {
    if (interviewTypes === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  closeAddInterviewFormPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertInterviewPopUp.forEach((p) => p.closePopover());
  }

  changeArchived() {
    this.isArchived = !this.isArchived;
    this.getInterviewProcess();
  }

  getInterviewType() {
    this.isAnyOperationIsInprogress = true;
    const interviewTypeModel = new InterviewTypeUpsertModel();
    interviewTypeModel.isArchived = this.isArchived;
    this.recruitmentService.getInterviewType(interviewTypeModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.interviewTypes = response.data;
        this.temp = this.interviewTypes;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  editInterviewProcess(row, upsertInterviewPopUp) {
    this.addInterviewForm.patchValue(row);
    const interviewType = row.interviewTypeIds.toLowerCase().split(',');
    if (this.interviewTypes.length === interviewType.length) {
      this.addInterviewForm.controls.interviewTypeId.patchValue(interviewType);
      this.allInterviewsSelected.select();
    } else {
      this.addInterviewForm.controls.interviewTypeId.patchValue(interviewType);
    }
    this.cdRef.detectChanges();
    this.interviewTypeId = row.interviewTypeIds;
    this.interviewProcessName = row.interviewProcessName;
    this.interviewProcessId = row.interviewProcessId;
    this.interviewTypeNames = row.interviewTypeNames;
    this.timeStamp = row.timeStamp;
    this.interviewprocessTitle = this.translateService.instant('INTERVIEWPROCESS.EDITINTERVIEWTYPETITLE');
    upsertInterviewPopUp.openPopover();
  }

  showFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  deleteInterviewProcessPopupOpen(row, deleteInterviewProcessPopup) {
    this.interviewTypeId = row.interviewTypeIds;
    this.interviewProcessName = row.interviewProcessName;
    this.interviewProcessId = row.interviewProcessId;
    this.timeStamp = row.timeStamp;
    deleteInterviewProcessPopup.openPopover();
  }

  deleteInterviewProcess() {
    this.isAnyOperationIsInprogress = true;
    const interviewProcessModel = new InterviewProcessModel();
    const interviewType = this.interviewTypeId.toLowerCase().split(',');
    interviewProcessModel.interviewTypeId = interviewType;
    interviewProcessModel.interviewProcessName = this.interviewProcessName;
    interviewProcessModel.interviewProcessId = this.interviewProcessId;
    interviewProcessModel.timeStamp = this.timeStamp;
    interviewProcessModel.isArchived = !this.isArchived;
    this.recruitmentService.upsertInterviewProcess(interviewProcessModel).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteInterviewProcessPopup.forEach((p) => p.closePopover());
        this.clearForm();
        this.getInterviewProcess();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    } else {
      this.searchText = '';
    }
    const temp = this.temp.filter(interviewProcess =>
      (interviewProcess.interviewProcessName == null ? null
         : interviewProcess.interviewProcessName.toLowerCase().indexOf(this.searchText) > -1)
      || (interviewProcess.interviewTypeNames == null ? null
         : interviewProcess.interviewTypeNames.toLowerCase().indexOf(this.searchText) > -1)
    );
    this.interviewProcess = temp;
  }

  closeSearch() {
    this.filterByName(null);
  }

  closeDeleteInterviewProcessPopup() {
    this.clearForm();
    this.deleteInterviewProcessPopup.forEach((p) => p.closePopover());
  }

  fitContent(optionalParameters?: any) {
    try {
      if (optionalParameters) {
        let parentElementSelector = '';
        let minHeight = '';
        if (optionalParameters['popupView'.toString()]) {
          parentElementSelector = optionalParameters['popupViewSelector'.toString()];
          minHeight = `calc(90vh - 200px)`;
        } else if (optionalParameters['gridsterView'.toString()]) {
          parentElementSelector = optionalParameters['gridsterViewSelector'.toString()];
          minHeight = `${$(parentElementSelector).height() - 40}px`;
        } else if (optionalParameters['individualPageView'.toString()]) {
          parentElementSelector = optionalParameters['individualPageSelector'.toString()];
          minHeight = `calc(100vh - 85px)`;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  closeDialog(result) {
    result.dialog.close();
    if (!result.emitString) {
      this.isFormType = true;
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;\'[]\=-)(*&^%$#@!~`';
      this.isreload = 'reload' + possible.charAt(Math.floor(Math.random() * possible.length));
      this.cdRef.detectChanges();
    }
  }

  submitFormComponent(result) {
    result.dialog.close();
    if (result.emitData) {
      this.customFormComponent = result.emitData;
      this.cdRef.detectChanges();
    }
  }

}
