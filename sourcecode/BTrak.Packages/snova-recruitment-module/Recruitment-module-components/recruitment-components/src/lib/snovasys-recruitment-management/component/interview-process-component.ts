import { Component, Output, EventEmitter, Inject, ViewEncapsulation, ViewChildren, ViewChild, ChangeDetectorRef, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { InterviewProcessConfigurationModel } from '../../snovasys-recruitment-management-apps/models/InterviewProcessConfigurationModel';
import { InterviewProcessModel } from '../../snovasys-recruitment-management-apps/models/InterviewProcessModel';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { InterviewTypesModel } from '../models/InterviewTypesmodel';
import { Subject, Subscription } from 'rxjs';
import { InterviewTypeUpsertModel } from '../../snovasys-recruitment-management-apps/models/InterviewTypeUpsertModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RoleModel } from '../../snovasys-recruitment-management-apps/models/rolesdropdown.model';
import { CustomFormFieldModel } from '../models/custom-field.model';
import { Store } from '@ngrx/store';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { UpsertCustomFieldTriggered } from '@snovasys/snova-custom-fields';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-job-interview-component',
  templateUrl: 'interview-process-component.html',
  providers: [DragulaService]
})

export class InterviewProcessComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('closeBookingPopup') closeBookingPopup;
  @ViewChildren('addInterviewPopUp') addInterviewPopUp;
  @ViewChildren('upsertInterviewTypePopUp') upsertInterviewTypePopUp;
  @ViewChild('allRolesSelected') private allRolesSelected: MatOption;
  @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
  @ViewChild('allInterviewsSelected') private allInterviewsSelected: MatOption;
  @Output() messageEvent = new EventEmitter<string>();
  @Output() jobAddEvent = new EventEmitter<string>();
  change: EventEmitter<MatSlideToggleChange>;
  selectedTabIndex = 0;
  jobAssignForm: FormGroup;
  preScreeningQuestionsList: any;
  interviewWorkflow: any;
  compareSelectedOptionalSkillsFn: any;
  isAnyOperationIsInprogress: boolean;
  selectedId: string;
  interviewProcessConfiguration: InterviewProcessConfigurationModel[];
  addInterviewForm: FormGroup;
  interviewTypes: InterviewTypesModel[];
  interviewProcess: InterviewProcessModel[];
  jobOpeningModel: JobOpening[];
  savingInProgress: boolean;
  sourceForm: FormGroup;
  interviewProcessId: string;
  timeStamp: any;
  validationMessage: string;
  isThereAnError: boolean;
  isArchived = false;
  temp: any;
  selectedtype: any[];
  interviewProcessName: string;
  interviewTypeId: any;
  loadSpinner: boolean;
  jobAssignFormDirective: any;
  isInitial = true;
  sourceTitle: any;
  selectedtoggle: any;
  isPhoneCalling: boolean;
  job: any;
  selectedInterviewProcess: any;
  customFormComponent: CustomFormFieldModel;
  subs = new Subscription();
  reOrderOperationInProgress: boolean;
  interviewProcessConfigurationIdsList: any[];
  candidate: any;
  interviewTypeTitle: any;
  interviewTypeForm: FormGroup;
  selectInterviewTypes: FormGroup;
  interviewTypeIds: any;
  selectedInterviewTypes: any;
  color: any;
  roleList: any;
  InterviewTypeRoleCofigurationId: any;
  selectType: any;
  IsPhone = false;
  isVideo = false;
  interviewprocesses: any;
  isPhone: boolean;
  interviewTypeRoleCofigurationId: any;
  roleIds: any;
  selectRoles: FormGroup;
  selectedRoles: any;
  interviewTypeAdd = false;
  moduleTypeId: any;
  isButtonVisible: any;
  isFormType: boolean;
  isreload: string;
  isEdit: any;
  isrecruitment: boolean;
  formName = false;
  resultstore: any = [] = [];
  isFormEdit: boolean;
  formIndex: any;
  isFromExists: boolean;
  jobOpeningId: any;
  list = [
    { id: 1, name: 'INTERVIEWTYPES.ISPHONE' },
    { id: 2, name: 'INTERVIEWTYPES.ISVIDEO' },
    { id: 3, name: 'INTERVIEWTYPES.OTHER' }
  ];
  chosenItem = this.list[0].name;
  public ngDestroyed$ = new Subject();
  private acceptDragulaCallback = (el, target, source, sibling) => {
    return true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getInterviewProcess();
    this.getInterviewTypes();
    this.selectedTabIndex = 0;
    this.formValidate();
    this.clearAddInterviewFormPopup();
    this.isrecruitment = true;
  }


  constructor(
    private recruitmentService: RecruitmentService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private dragulaService: DragulaService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InterviewProcessComponent>,
    private translateService: TranslateService,
    private store: Store<State>
  ) {
    super();
    this.interviewprocesses = new InterviewProcessConfigurationModel();
    this.job = this.data.data;
    this.candidate = this.data.data1;
    if (this.candidate !== undefined) {
      this.selectedId = this.candidate.interviewProcessId;
      this.interviewprocesses.interviewProcessId = this.candidate.interviewProcessId;
      this.interviewprocesses.candidateId = this.candidate.candidateId;
      this.interviewprocesses.jobOpeningId = this.candidate.jobOpeningId;
      this.jobOpeningId = this.candidate.jobOpeningId;
      this.selectedInterviewProcess = this.candidate.interviewProcessName;
      if (this.candidate.interviewProcessId == null && this.job.interviewProcessId != null) {
        this.selectedId = this.job.interviewProcessId;
        this.selectedInterviewProcess = this.job.interviewProcessName;
      }
    }
    if (this.candidate === undefined) {
      this.interviewprocesses.interviewProcessId = this.job.interviewProcessId;
      this.interviewprocesses.candidateId = '';
      this.interviewprocesses.jobOpeningId = this.job.jobOpeningId;
      this.jobOpeningId = this.job.jobOpeningId;
      this.selectedId = this.job.interviewProcessId;
      this.selectedInterviewProcess = this.job.interviewProcessName;
    }
    this.getInterviewProcessConfiguration(this.interviewprocesses);
    this.handleDragulaDragAndDropActions(dragulaService);
  }

  getInterviewTypes() {
    const interviewTypesModel = new InterviewTypesModel();
    interviewTypesModel.isArchived = false;
    this.recruitmentService
      .getInterviewType(interviewTypesModel)
      .subscribe((responseData: any) => {
        this.interviewTypes = responseData.data;
        this.isAnyOperationIsInprogress = false;
      });
  }

  private handleDragulaDragAndDropActions(dragulaService: DragulaService) {
    dragulaService.createGroup('reOrderItems', {
      accepts: this.acceptDragulaCallback,
      revertOnSpill: true
    });

    this.subs.add(this.dragulaService.drag('reOrderItems')
      .subscribe(({ el }) => {
        if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
          this.dragulaService.find('reOrderItems').drake.cancel(true);
        }
      })
    );
    this.subs.add(this.dragulaService.drop('reOrderItems')
      .subscribe(({ name, el, target, source, sibling }) => {
        if (!(this.reOrderOperationInProgress)) {

          const orderedListLength = target.children.length;
          this.interviewProcessConfigurationIdsList = [];
          for (let i = 0; i < orderedListLength; i++) {
            const interviewProcessConfigurationId = target.children[i].attributes['data-userStoryStatusId'].nodeValue;
            const index = this.interviewProcessConfigurationIdsList.indexOf(interviewProcessConfigurationId.toLowerCase());
            if (index === -1) {
              this.interviewProcessConfigurationIdsList.push(interviewProcessConfigurationId.toLowerCase());
            }
          }
          this.changeOrderForWorkflowStatus();
        } else if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
        }
      })
    );
  }

  changeOrderForWorkflowStatus() {
    this.isAnyOperationIsInprogress = true;
    this.reOrderOperationInProgress = true;
    const interviewProcessModel = new InterviewProcessConfigurationModel();
    this.isInitial = false;
    interviewProcessModel.interviewProcessConfigurationIds = this.interviewProcessConfigurationIdsList;
    interviewProcessModel.jobOpeningId = this.job.jobOpeningId;
    interviewProcessModel.isInitial = this.isInitial;
    this.recruitmentService.reOrderInterviewProcessConfiguration(interviewProcessModel).subscribe((x: any) => {
      this.reOrderOperationInProgress = false;
      if (x.success) {
        this.interviewProcessConfigurationIdsList = [];
      }
    });
    this.recruitmentService.reOrderInterviewProcessConfiguration(interviewProcessModel).subscribe((response: any) => {
      if (response.success === true) {
        this.interviewProcessConfigurationIdsList = [];
        this.toastr.success(this.translateService.instant('INTERVIEWPROCESS.REORDER'));
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  createInterviewProcess(addInterviewPopover) {
    addInterviewPopover.openPopover();
    this.sourceTitle = this.translateService.instant('INTERVIEWPROCESS.INTERVIEWPROCESSTITLE');
  }

  getRoles() {
    const roleModel = new RoleModel();
    this.recruitmentService.getAllRolesDropDown(roleModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.roleList = response.data;
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

  createInterviewType(upsertInterviewTypePopover) {
    this.getRoles();
    upsertInterviewTypePopover.openPopover();
    this.interviewTypeTitle = this.translateService.instant('INTERVIEWTYPES.ADDINTERVIEWTYPETITLE');
  }

  onClick(value) {
    if (value === 3) {
      this.isPhone = false;
      this.isVideo = false;
    } else if (value === 1) {
      this.isPhone = true;
      this.isVideo = false;
    } else {
      this.isPhone = false;
      this.isVideo = true;
    }
  }

  UpsertInterviewType(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    let interviewType = new InterviewTypeUpsertModel();
    interviewType = this.interviewTypeForm.value;
    interviewType.interviewTypeName = interviewType.interviewTypeName.toString().trim();
    interviewType.isPhone = this.isPhone;
    interviewType.isVideo = this.isVideo;
    interviewType.color = interviewType.color;
    interviewType.interviewTypeId = this.interviewTypeId;
    interviewType.selectType = this.selectType;
    interviewType.interviewTypeRoleCofigurationId = this.interviewTypeRoleCofigurationId;
    interviewType.timeStamp = this.timeStamp;
    this.recruitmentService.upsertInterviewType(interviewType).subscribe((response: any) => {
      if (response.success === true) {
        this.interviewTypeAdd = true;
        if (!this.isEdit && this.customFormComponent) {
          let i = 0;
          this.formIndex = 0;
          this.resultstore.forEach(x => {
            if (this.resultstore[0]) {
              this.resultstore[i].referenceId = response.data;
              this.resultstore[i].referenceTypeId = response.data;
              this.resultstore[i].moduleTypeId = 24;
              this.formIndex = i;
            }
            this.store.dispatch(new UpsertCustomFieldTriggered(this.resultstore[i]));
            i++;
          });
          this.upsertInterviewTypePopUp.forEach((p) => p.closePopover());
          this.clearForm();
          formDirective.resetForm();
          this.isAnyOperationIsInprogress = false;
          this.getInterviewTypes();
        } else {
          this.upsertInterviewTypePopUp.forEach((p) => p.closePopover());
          this.clearForm();
          formDirective.resetForm();
          this.getInterviewTypes();
        }
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  UpsertInterviewProcess(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;

    let interviewprocess = new InterviewProcessModel();
    interviewprocess = this.addInterviewForm.value;
    interviewprocess.interviewProcessName = interviewprocess.interviewProcessName.toString().trim();
    interviewprocess.interviewTypeId = this.addInterviewForm.get('interviewTypeId').value;
    interviewprocess.timeStamp = this.timeStamp;

    this.recruitmentService.upsertInterviewProcess(interviewprocess).subscribe((response: any) => {
      if (response.success === true) {
        this.addInterviewPopUp.forEach((p) => p.closePopover());
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
    const sourceModel = new InterviewProcessModel();
    sourceModel.isArchived = this.isArchived;
    this.recruitmentService.getInterviewProcess(sourceModel).subscribe((response: any) => {
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

  GetInterviewTypelist(event) {
    this.selectedtype = event;
  }

  toggleInterviewTypesPerOne() {
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

  toggleAllInterviewTypesSelection() {
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

  GetInterviewTypesList() {
    const selectedInterviewTypes = this.selectInterviewTypes.value.interviewTypeId;
    const index = selectedInterviewTypes.indexOf(0);
    if (index > -1) {
      selectedInterviewTypes.splice(index, 1);
    }
    this.interviewTypeIds = selectedInterviewTypes.toString();
    this.bindInterviewTypeIds(this.interviewTypeIds);
  }

  bindInterviewTypeIds(interviewTypeIds) {
    if (interviewTypeIds) {
      const interviewTypesList = this.interviewTypes;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(interviewTypesList, function(member: any) {
        return interviewTypeIds.toString().includes(member.interviewTypeId);
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

  UpsertInterviewJobConfiguration(event) {

    if (event) {
      this.selectedId = event;
      const interviewProcess = this.interviewProcess;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.find(interviewProcess, function(member: any) {
        return member.interviewProcessId === event;
      });
      if (filteredList) {
        this.selectedInterviewProcess = filteredList.interviewProcessName;
        this.selectedId = filteredList.interviewProcessId;
      }
      this.isAnyOperationIsInprogress = true;
      this.cdRef.detectChanges();
      let interviewProcessConfiguration = new InterviewProcessConfigurationModel();
      interviewProcessConfiguration = this.jobAssignForm.value;
      interviewProcessConfiguration.interviewProcessId = this.selectedId;
      interviewProcessConfiguration.jobOpeningId = this.jobOpeningId;
      if (this.candidate !== undefined) {
        interviewProcessConfiguration.jobOpeningId = this.jobOpeningId;
        interviewProcessConfiguration.candidateId = this.candidate.candidateId;
      }
      interviewProcessConfiguration.isInitial = this.isInitial;
      interviewProcessConfiguration.timeStamp = this.timeStamp;

      this.recruitmentService.upsertInterviewJobConfiguration(interviewProcessConfiguration).subscribe((response: any) => {
        if (response.success === true) {
          this.clearForm();
          this.toastr.success(this.translateService.instant('INTERVIEWPROCESS.SUCCESSLINK'));
          this.getInterviewProcessConfiguration(interviewProcessConfiguration);
        } else {
          this.isThereAnError = true;
          this.validationMessage = response.apiResponseMessages[0].message;
          this.isAnyOperationIsInprogress = false;
        }
      });
      if (interviewProcessConfiguration.candidateId !== null) {
        this.candidate.interviewProcessId = this.selectedId;
        this.candidate.interviewProcessName = this.selectedInterviewProcess;
      } else {
        this.job.interviewProcessId = this.selectedId;
        this.job.interviewProcessName = this.selectedInterviewProcess;
      }
    }
  }
  getInterviewProcessConfiguration(value) {
    this.isAnyOperationIsInprogress = true;
    let sourceModel = new InterviewProcessConfigurationModel();
    if (value !== '') {
      sourceModel = value;
    }
    if (value === '') {
      if (this.candidate === undefined) {
        sourceModel.jobOpeningId = (this.job.jobOpeningId !== undefined ? this.job.jobOpeningId : null);
        sourceModel.interviewProcessId = this.job.interviewProcessId;
      } else {
        if (this.candidate.interviewProcessId !== null) {
          sourceModel.candidateId = this.candidate.candidateId;
        } else {
          sourceModel.jobOpeningId = (this.job.jobOpeningId !== undefined ? this.job.jobOpeningId : this.candidate.jobOpeningId);
          sourceModel.interviewProcessId = this.job.interviewProcessId;
        }
      }
    }

    this.recruitmentService.getInterviewProcessConfiguration(sourceModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.clearForm();
        this.interviewProcessConfiguration = response.data;
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

  clearForm() {
    this.interviewProcessId = null;
    this.interviewProcessName = null;
    this.interviewTypeId = null;
    this.color = null;
    this.customFormComponent = null;
    let index = 0;
    let i = 0;
    this.resultstore.forEach(x => {
      if (this.resultstore[0]) {
        index = i;
      }
      i++;
    });
    if (index >= 0) {
      this.resultstore.splice(index, 1);
    }
    if (this.resultstore.length > 0) {
      this.isFromExists = true;
    } else {
      this.isFromExists = false;
    }
    this.customFormComponent = null;
    this.isFormType = false;
    this.cdRef.detectChanges();
    this.addInterviewForm = this.fb.group({
      interviewProcessName: new FormControl('', Validators.compose([Validators.required])),
      interviewTypeId: new FormControl('', Validators.compose([]))
    });

    this.interviewTypeForm = new FormGroup({
      interviewTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      color: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),

      roleId: new FormControl(null,
        Validators.compose([
        ])
      ),
      selectType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      isPhone: new FormControl(null,
        Validators.compose([

        ])
      ),
      isVideo: new FormControl(null,
        Validators.compose([
        ])
      ),
      interviewTypeRoleConfigurationId: new FormControl(null,
        Validators.compose([
        ]))
    });
    this.selectInterviewTypes = new FormGroup({
      interviewTypeId: new FormControl('')
    });
    this.selectRoles = new FormGroup({
      roleId: new FormControl('')
    });
  }

  clearInterviewTypeForm() {
    this.interviewTypeForm = new FormGroup({
      interviewTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      color: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),

      roleId: new FormControl(null,
        Validators.compose([
        ])
      ),
      selectType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      isPhone: new FormControl(null,
        Validators.compose([

        ])
      ),
      isVideo: new FormControl(null,
        Validators.compose([
        ])
      ),
      interviewTypeRoleConfigurationId: new FormControl(null,
        Validators.compose([
        ]))
    });
  }

  clearAddInterviewFormPopup() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.addInterviewForm = this.fb.group({
      interviewProcessName: new FormControl('', Validators.compose([Validators.required])),
      interviewTypeId: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  clearAddInterviewTypeFormPopup() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.interviewTypeForm = new FormGroup({
      interviewTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      color: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),

      roleId: new FormControl(null,
        Validators.compose([
        ])
      ),
      selectType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      isPhone: new FormControl(null,
        Validators.compose([

        ])
      ),
      isVideo: new FormControl(null,
        Validators.compose([
        ])
      ),
      interviewTypeRoleConfigurationId: new FormControl(null,
        Validators.compose([
        ]))
    });
  }

  closeUpsertInterviewTypePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearInterviewTypeForm();
    this.upsertInterviewTypePopUp.forEach((p) => p.closePopover());
  }

  closeAddInterviewFormPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.addInterviewPopUp.forEach((p) => p.closePopover());
  }

  OnClickVideo(event, value) {
    this.UpsertInterviewJobConfigurations(event, value, 1);
  }

  OnClickPhone(event, value) {
    this.UpsertInterviewJobConfigurations(event, value, 2);
  }

  UpsertInterviewJobConfigurations(event, value, i) {
    this.isAnyOperationIsInprogress = true;
    this.isInitial = false;

    let interviewProcessConfiguration = new InterviewProcessConfigurationModel();
    interviewProcessConfiguration = value;
    if (i === 2) {
      (interviewProcessConfiguration.isPhoneCalling = event.checked); }
    if (i === 1) {
      (interviewProcessConfiguration.isVideoCalling = event.checked); }
    interviewProcessConfiguration.interviewProcessConfigurationId = interviewProcessConfiguration.interviewProcessConfigurationId;
    interviewProcessConfiguration.interviewProcessId = interviewProcessConfiguration.interviewProcessId;
    interviewProcessConfiguration.jobOpeningId = this.job.jobOpeningId;
    interviewProcessConfiguration.isInitial = this.isInitial;
    this.interviewProcessConfigurationIdsList = [];
    interviewProcessConfiguration.interviewProcessConfigurationIds = this.interviewProcessConfigurationIdsList;
    interviewProcessConfiguration.isPhoneCalling = interviewProcessConfiguration.isPhoneCalling;
    interviewProcessConfiguration.isVideoCalling = interviewProcessConfiguration.isVideoCalling;
    interviewProcessConfiguration.timeStamp = interviewProcessConfiguration.timeStamp;
    this.recruitmentService.upsertInterviewJobConfiguration(interviewProcessConfiguration).subscribe((response: any) => {
      if (response.success === true) {
        this.clearForm();
        this.getInterviewProcessConfiguration(this.selectedId);
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  GetRoleslist() {
    const selectedRoles = this.selectRoles.value.roleId;
    const index = selectedRoles.indexOf(0);
    if (index > -1) {
      selectedRoles.splice(index, 1);
    }
    this.roleIds = selectedRoles.toString();
    this.bindRoleIds(this.roleIds);
  }

  bindRoleIds(roleIds) {
    if (roleIds) {
      const rolesList = this.roleList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(rolesList, function(member: any) {
        return roleIds.toString().includes(member.roleId);
      });
      const selectedRoles = filteredList.map((x: any) => x.roleName);
      this.selectedRoles = selectedRoles.toString();
    } else {
      this.selectedRoles = '';
    }
  }

  toggleRolePerOne() {
    if (this.allRolesSelected.selected) {
      this.allRolesSelected.deselect();
      return false;
    }
    if (
      this.interviewTypeForm.get('roleId').value.length === this.roleList.length
    ) {
      this.allRolesSelected.select();
    }
  }

  toggleAllRolesSelection() {
    if (this.allRolesSelected.selected && this.roleList) {
      this.interviewTypeForm.get('roleId').patchValue([
        ...this.roleList.map((item) => item.roleId),
        0
      ]);
      this.selectedRoles = this.roleList.map((item) => item.roleId);
    } else {
      this.interviewTypeForm.get('roleId').patchValue([]);
    }
  }

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }

  formValidate() {
    this.jobAssignForm = new FormGroup({
      interviewProcessId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    });

    this.addInterviewForm = new FormGroup({
      interviewProcessName: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ),
      interviewTypeId: new FormControl(null,
        Validators.compose([
        ])
      ),

    });

    this.selectInterviewTypes = new FormGroup({
      interviewTypeId: new FormControl('')
    });
    this.interviewTypeForm = new FormGroup({
      interviewTypeName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      color: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),

      roleId: new FormControl(null,
        Validators.compose([
        ])
      ),
      selectType: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      IsPhone: new FormControl(null,
        Validators.compose([

        ])
      ),
      isVideo: new FormControl(null,
        Validators.compose([
        ])
      ),
      interviewTypeRoleConfigurationId: new FormControl(null,
        Validators.compose([
        ]))
    });

    this.jobAssignForm.controls.interviewProcessId.markAsUntouched({ onlySelf: true });
  }

  openClosingPopup() {
    this.selectedId = null;
    this.interviewprocesses = null;
    this.selectedInterviewProcess = null;
    this.candidate = null;
    this.dialogRef.close({ interviewTypeAdd: this.interviewTypeAdd });
    this.clearForm();
  }

  openCustomForm() {
    if (this.isFormType) {
      this.customFormComponent = null;
    }
    const dialogId = 'app-custom-form-component';
    const formsDialog = this.dialog.open(this.customFormsComponent, {
      height: '70%',
      width: '60%',
      hasBackdrop: true,
      direction: 'ltr',
      id: dialogId,
      data: {
        moduleTypeId: this.moduleTypeId, referenceId: this.interviewTypeId, referenceTypeId: this.interviewTypeId,
        customFieldComponent: this.customFormComponent, isButtonVisible: this.isButtonVisible, formPhysicalId: dialogId, dialogId
      },
      disableClose: true,
      panelClass: 'custom-modal-box'
    });
  }

  openCustomForms() {
    const dialogId = 'app-custom-form-component';
    const formsDialog = this.dialog.open(this.customFormsComponent, {
      height: '70%',
      width: '60%',
      hasBackdrop: true,
      direction: 'ltr',
      id: dialogId,
      data: {
        moduleTypeId: this.moduleTypeId, referenceId: this.interviewTypeId, referenceTypeId: this.interviewTypeId,
        customFieldComponent: this.customFormComponent, isButtonVisible: this.isButtonVisible, formPhysicalId: dialogId, dialogId
      },
      disableClose: true,
      panelClass: 'custom-modal-box'
    });
  }

  editFormComponent(result) {
    this.isFormEdit = true;
    this.customFormComponent = result;
    this.formIndex = 0;
    let i = 0;
    this.resultstore.forEach(x => {
      if (result.formName === x.formName) {
        this.formIndex = i;
      }
      i++;
    });
    this.openCustomForms();
    this.cdRef.detectChanges();
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

  deleteFormComponent(result) {
    let index = 0;
    let i = 0;
    this.resultstore.forEach(x => {
      if (result.formName === x.formName) {
        index = i;
      }
      i++;
    });
    if (index >= 0) {
      this.resultstore.splice(index, 1);
    }
    if (this.resultstore.length > 0) {
      this.isFromExists = true;
    } else {
      this.isFromExists = false;
    }
    this.customFormComponent = null;
    this.isFormType = false;
    this.cdRef.detectChanges();
  }

  submitFormComponent(result) {
    result.dialog.close(result.null);
    if (result.emitData) {
      this.customFormComponent = result.emitData;
      if (this.isFormEdit && this.formIndex >= 0) {
        this.resultstore.splice(this.formIndex, 1, this.customFormComponent);
      } else {
        this.resultstore.push(this.customFormComponent);
      }
      this.temp = this.resultstore[0];
      this.isFormType = true;
      this.isFormEdit = false;
      if (this.resultstore.length > 0) {
        this.isFromExists = true;
      } else {
        this.isFromExists = false;
      }
      this.cdRef.detectChanges();
    }
  }
}
