import { Component, Output, EventEmitter, Inject, Input, ViewEncapsulation,
   ViewChildren, ViewChild, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { SkillsModel } from '../../snovasys-recruitment-management-apps/models/skills.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { Branch } from '../../snovasys-recruitment-management-apps/models/branch';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import * as jobOpeningModuleReducer from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { CreateJobOpeningItemTriggered, JobOpeningActionTypes } from '../../snovasys-recruitment-management-apps/store/actions/job-opening.action';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmployementStatusSearch } from '../models/employement-status-search.model';
import { JobOpeningStatusInputModel } from '../../snovasys-recruitment-management-apps/models/jobOpeningStatusInputModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DesigationSearch } from '../models/designation-search.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-basic-jobdetails-component',
  templateUrl: 'basic-job-detail.component.html',
})
export class BasicJobDetailsComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
  @ViewChildren('closeBookingPopup') closeBookingPopup;
  @ViewChild('basicJobDetailFormDirective') paymentFormDirective: FormGroupDirective;
  @ViewChild('skillsFormDirective') skillsFormDirective: FormGroupDirective;
  @ViewChild('allLocationSelected') private allLocationSelected: MatOption;
  @ViewChild('allSkillsSelected') private allSkillsSelected: MatOption;
  @ViewChildren('addSkillsPopup') addSkillsPopover;

  @Output() messageEvent = new EventEmitter<string>();
  @Output() jobAddEvent = new EventEmitter<string>();

  selectedTabIndex = 0;
  createJobForm: FormGroup;
  isAnyOperationIsInprogress = true;
  jobDetails: JobOpening;
  numberOfPositions: Array<number> = [];
  onBoardProcessDate: Date;
  jobAssignTo: any;
  locationList: Branch[];
  skillsList = [];
  jobstatusList: JobOpeningStatusInputModel[];
  jobOpening: any;
  isArchived = false;
  isThereAnError: boolean;
  validationMessage: any;
  timeStamp: any;
  skills: any;
  loadSpinner: boolean;
  addSkillsForm: FormGroup;
  SkillId: any;
  skillName: any;
  skillId: any;
  selectedModules: string;
  searchtext: any;
  selectedHiringManager: string;
  selectedId: string;
  selectedLocations: string;
  locationIds: string;
  selectSkills: FormGroup;
  selectedSkills: string;
  skillIds: string;
  selectLocations: FormGroup;
  sourceTitle: any;
  public ngDestroyed$ = new Subject();
  responseId$: Observable<string>;
  validationMessage$: Observable<string[]>;
  jobTypes: any;
  sortBy: string;
  sortDirection: boolean;
  page: any;
  jobOpeningStatusList$: Observable<any>;
  jobOpeningStatusDataLoading$: Observable<any>;
  openingstatus: any;
  temp: any;
  savingInProgress = false;
  isJobOpeningAdd = false;
  maxSalaryError = false;
  maxExperienceError = false;
  selectedjobstatus: any;
  jobOpeningStatus: any;
  jobstatus: any;
  selectjobstatus: FormGroup;
  selectedJobStatusOrder: number;
  isDraft: boolean;
  showDraft = true;
  isFailed = false;
  designationList: any;

  @Input('jobDetails')
  set _jobDetails(data: any) {
    this.jobDetails = data;
    if (data === '' || data == null || data === undefined) {
      this.isJobOpeningAdd = true;
      this.isDraft = false;
    } else {
      this.isJobOpeningAdd = false;
      this.timeStamp = this.jobDetails.timeStamp;
      this.isDraft = true;
    }
    this.formValidate();
    this.filledData();
    this.clearAddSkillFormPopup();
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectedTabIndex = 0;
    this.formValidate();
    this.clearAddSkillFormPopup();
    this.getUsers();
    this.getEmploymentStatus();
    this.getjobOpeningStatus();
    this.getDesignation();
  }

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private store: Store<State>,
    private actionUpdates$: Actions
  ) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(JobOpeningActionTypes.CreateJobOpeningItemCompleted),
        tap(() => {
          this.responseId$ = this.store.pipe(select(jobOpeningModuleReducer.jobOpeningCreatedorUpsert));
          this.responseId$.subscribe((result) => {
            this.emitJobAddedSuccessfully(result);
            this.savingInProgress = false;
            this.isAnyOperationIsInprogress = false;
          });
          this.isFailed = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(JobOpeningActionTypes.CreateJobOpeningItemFailed),
        tap((response: any) => {
          this.toastr.error(response.validationMessages[0].message);
          this.savingInProgress = false;
          this.validationMessage$ = this.store.pipe(select(jobOpeningModuleReducer.jobOpeningCreatedorUpsertFailed));
          this.validationMessage$.subscribe((result) => {
            this.isAnyOperationIsInprogress = false;
          });
          this.isFailed = true;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.getLocations();
    this.getSkills();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  numberOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  floatOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
    return true;
  }

  getLocations() {
    this.isAnyOperationIsInprogress = true;
    const locationList = new Branch();
    locationList.isArchived = this.isArchived;
    this.recruitmentService.getLocations(locationList).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.locationList = response.data;
        if (this.jobDetails) {
          this.selectedLocations = this.jobDetails.locationNames;
        }
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

  getSkills() {
    this.isAnyOperationIsInprogress = true;
    const skillsModel = new SkillsModel();
    skillsModel.isArchived = this.isArchived;
    this.recruitmentService.getSkills(skillsModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.skills = response.data;
        if (this.jobDetails) {
          this.selectedSkills = this.jobDetails.skillNames;
        }
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

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }

  formValidate() {
    this.createJobForm = new FormGroup({
      jobOpeningTitle: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      jobDescription: new FormControl('',
        Validators.compose([

        ])
      ),
      jobOpeningId: new FormControl('',
        Validators.compose([

        ])
      ),
      jobOpeningStatusId: new FormControl('',
        Validators.compose([
        ])
      ),
      designationId: new FormControl('',
        Validators.compose([
        ])
      ),
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      minExperience: new FormControl(''),
      maxExperience: new FormControl(''),
      minSalary: new FormControl(''),
      maxSalary: new FormControl(''),
      certification: new FormControl(''),
      hiringManagerId: new FormControl(''),
      noOfOpenings: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      locations: new FormControl('',
        Validators.compose([

        ])
      ),
      skills: new FormControl('',
        Validators.compose([

        ])
      ),
      qualification: new FormControl(''),
      jobTypeId: new FormControl('',
        Validators.compose([
        ])
      ),

    });

    this.selectLocations = new FormGroup({
      locations: new FormControl('')
    });

    this.selectSkills = new FormGroup({
      skills: new FormControl('')
    });
    this.selectjobstatus = new FormGroup({
      openingstatus: new FormControl('')
    });

    if (this.jobDetails) {
      this.filledData();
    }
  }

  validateInput() {
    if (this.createJobForm.value.maxSalary !== '0'
     && this.createJobForm.value.maxSalary != null && this.createJobForm.value.maxSalary !== '') {
      if (this.createJobForm.value.minSalary === '0' || this.createJobForm.value.minSalary == null || this.createJobForm.value.minSalary === '') {
        this.maxSalaryError = false;
      } else {
        if (parseFloat(this.createJobForm.value.maxSalary) >= parseFloat(this.createJobForm.value.minSalary)) {
          this.maxSalaryError = false;
        } else {
          this.maxSalaryError = true;
        }
      }
    }
    if (this.createJobForm.value.maxSalary === '0'
     || this.createJobForm.value.maxSalary == null || this.createJobForm.value.maxSalary === '') {
      this.maxSalaryError = false;
    }
    if (this.createJobForm.value.maxExperience !== '0'
    && this.createJobForm.value.maxExperience != null && this.createJobForm.value.maxExperience !== '') {
      if (this.createJobForm.value.minExperience === '0'
      || this.createJobForm.value.minExperience == null || this.createJobForm.value.minExperience === '') {
        this.maxExperienceError = false;
      } else {
        if (parseFloat(this.createJobForm.value.maxExperience) >= parseFloat(this.createJobForm.value.minExperience)) {
          this.maxExperienceError = false;
        } else {
          this.maxExperienceError = true;
        }
      }
    }
    if (this.createJobForm.value.maxExperience === '0'
     || this.createJobForm.value.maxExperience == null || this.createJobForm.value.maxExperience === '') {
      this.maxExperienceError = false;
    }
    this.cdRef.detectChanges();
  }

  addJobDetail(basicJobDetailFormDirective) {
    this.savingInProgress = true;
    this.changePageForward();
    let jobOpening = new JobOpening();
    jobOpening = this.createJobForm.value;
    jobOpening.jobOpeningTitle = this.createJobForm.value.jobOpeningTitle;
    jobOpening.jobDescription = this.createJobForm.value.jobDescription;
    jobOpening.jobOpeningId = this.createJobForm.value.jobOpeningId;
    jobOpening.dateFrom = this.createJobForm.value.dateFrom;
    jobOpening.dateTo = this.createJobForm.value.dateTo;
    jobOpening.minExperience = this.createJobForm.value.minExperience;
    jobOpening.jobOpeningStatusId = this.createJobForm.value.jobOpeningStatusId;
    jobOpening.maxExperience = this.createJobForm.value.maxExperience;
    jobOpening.minSalary = this.createJobForm.value.minSalary;
    jobOpening.maxSalary = this.createJobForm.value.maxSalary;
    jobOpening.certification = this.createJobForm.value.certification;
    jobOpening.noOfOpenings = this.createJobForm.value.noOfOpenings;
    jobOpening.qualification = this.createJobForm.value.qualification;
    jobOpening.jobTypeId = this.createJobForm.value.jobTypeId;
    jobOpening.designationId = this.createJobForm.value.designationId;
    jobOpening.jobLocations = this.locationIds;
    jobOpening.jobSkills = this.skillIds;
    jobOpening.domainName = window.location.protocol + '//' + window.location.hostname;
    jobOpening.timeStamp = this.timeStamp;
    this.store.dispatch(new CreateJobOpeningItemTriggered(jobOpening));
  }

  filledData() {
    let locationTypeIds = [];
    let skillsIds = [];
    if (this.jobDetails != null && this.jobDetails !== undefined) {
      this.selectedHiringManager = this.jobDetails.hiringManagerName;
      this.locationIds = this.jobDetails.locationIds;
      if (this.locationIds) {
        this.locationIds.split(',').forEach(element => {
          locationTypeIds.push(element);
        });
      } else {
        locationTypeIds = [];
      }
      this.selectLocations = new FormGroup({
        locations: new FormControl(locationTypeIds)
      });
      this.skillIds = this.jobDetails.skillIds;
      if (this.skillIds) {
        this.skillIds.split(',').forEach(element => {
          skillsIds.push(element);
        });
      } else {
        skillsIds = [];
      }
      this.selectSkills = new FormGroup({
        skills: new FormControl(skillsIds)
      });
      this.selectedLocations = this.jobDetails.locationNames;
      this.selectedSkills = this.jobDetails.skillNames;
      this.selectedId = this.jobDetails.hiringManagerId;
      this.createJobForm.patchValue(this.jobDetails);
      if (this.jobDetails.jobDescription != null && this.jobDetails.jobDescription !== undefined && this.jobDetails.jobDescription !== '') {
        const description = this.jobDetails.jobDescription.replace(/<(.|\n)*?>/g, '');
        this.createJobForm.get('jobDescription').patchValue(description);
      }
      this.timeStamp = this.jobDetails.timeStamp;
    }
  }

  getHiringManagerValue(event) {
    const jobAssignTo = this.jobAssignTo;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(jobAssignTo, function(member: any) {
      return member.id === event;
    });
    if (filteredList) {
      this.selectedHiringManager = filteredList.fullName;
      this.cdRef.detectChanges();
    }
  }

  getUsers() {
    this.searchtext = '';
    this.recruitmentService.getUsersDropDown(this.searchtext).subscribe((response: any) => {
      if (response.success) {
        this.jobAssignTo = response.data;
      }
      this.cdRef.detectChanges();
    });
  }

  emitJobAddedSuccessfully(value) {
    if (this.isFailed) {
      this.jobAddEvent.emit('1');
    } else {
      this.jobAddEvent.emit(value);
    }
  }
  compareSelectedSkillsFn(skills: any, selectedModules: any) {
    if (skills === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  GetLocationslist() {
    const selectedLocations = this.selectLocations.value.locations;
    const index = selectedLocations.indexOf(0);
    if (index > -1) {
      selectedLocations.splice(index, 1);
    }
    this.locationIds = selectedLocations.toString();
    this.bindLocations(this.locationIds);
  }

  compareSelectedLocationFn(jobStatus: any, selectedJobStatus: any) {
    if (jobStatus === selectedJobStatus) {
      return true;
    } else {
      return false;
    }
  }

  bindLocations(locationIds) {
    if (locationIds) {
      const locationList = this.locationList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(locationList, function(member: any) {
        return locationIds.toString().includes(member.branchId);
      });
      const selectedLocations = filteredList.map((x: any) => x.branchName);
      this.selectedLocations = selectedLocations.toString();
    } else {
      this.selectedLocations = '';
    }
  }

  toggleLocationPerOne() {
    if (this.allLocationSelected.selected) {
      this.allLocationSelected.deselect();
      return false;
    }
    if (
      this.selectLocations.controls.locations.value.length === this.locationList.length
    ) {
      this.allLocationSelected.select();
    }
  }

  toggleAllLocationSelected() {
    if (this.allLocationSelected.selected) {
      this.selectLocations.controls.locations.patchValue([
        ...this.locationList.map((item) => item.branchId), 0]);

    } else {
      this.selectLocations.controls.locations.patchValue([]);
    }
    this.locationIds = this.selectLocations.value;
    this.GetLocationslist();
  }

  GetSkillslist() {
    const selectedSkills = this.selectSkills.value.skills;
    const index = selectedSkills.indexOf(0);
    if (index > -1) {
      selectedSkills.splice(index, 1);
    }
    this.skillIds = selectedSkills.toString();
    this.bindSkills(this.skillIds);
  }

  bindSkills(skillIds) {
    if (skillIds) {
      const skillsList = this.skills;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(skillsList, function(member: any) {
        return skillIds.toString().includes(member.skillId);
      });
      const selectedSkills = filteredList.map((x: any) => x.skillName);
      this.selectedSkills = selectedSkills.toString();
    } else {
      this.selectedSkills = '';
    }
  }

  GetjobstatuslistSubmit(value) {
    // tslint:disable-next-line: radix
    const SaveTypeOrder = parseInt(value);
    this.selectedJobStatusOrder = SaveTypeOrder;
    this.openingstatus.forEach(x => {
      if (x.order === SaveTypeOrder) {
        this.createJobForm.get('jobOpeningStatusId').patchValue(x.jobOpeningStatusId);
      }
    });
    this.addJobDetail(this.paymentFormDirective);
  }

  toggleSkillsPerOne(all) {
    if (this.allSkillsSelected.selected) {
      this.allSkillsSelected.deselect();
      return false;
    }
    if (
      this.selectSkills.controls.skills.value.length === this.skills.length
    ) {
      this.allSkillsSelected.select();
    }
  }

  toggleAllSkillsSelected() {
    if (this.allSkillsSelected.selected) {
      this.selectSkills.controls.skills.patchValue([
        ...this.skills.map((item) => item.skillId),
        0
      ]);
    } else {
      this.selectSkills.controls.skills.patchValue([]);
    }
    this.selectedSkills = this.selectSkills.value;
    this.GetSkillslist();
  }

  createSkills(addSkillsPopover) {
    addSkillsPopover.openPopover();
  }

  clearAddSkillFormPopup() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.addSkillsForm = this.fb.group({
      skillName: new FormControl('', Validators.compose([Validators.required]))
    });
  }
  closeAddSkillFormPopup(skillsFormDirective: FormGroupDirective) {
    skillsFormDirective.resetForm();
    this.clearForm();
    this.addSkillsPopover.forEach((p) => p.closePopover());
  }

  clearForm() {
    this.skillName = null;
    this.SkillId = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.savingInProgress = false;
    this.addSkillsForm = new FormGroup({
      skillName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      SkillId: new FormControl(null,
        Validators.compose([

        ])
      ),
      Timestamp: new FormControl(null,
        Validators.compose([

        ])
      )
    });
  }

  UpsertSkills(skillsFormDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    let skillsModel = new SkillsModel();
    skillsModel = this.addSkillsForm.value;
    skillsModel.skillName = this.addSkillsForm.value.skillName.toString().trim();
    skillsModel.skillId = skillsModel.skillId;
    skillsModel.timestamp = skillsModel.timestamp;
    this.recruitmentService.upsertSkills(skillsModel).subscribe((response: any) => {
      if (response.success === true) {
        this.addSkillsPopover.forEach((p) => p.closePopover());
        skillsFormDirective.resetForm();
        this.getSkills();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  getEmploymentStatus() {
    this.recruitmentService.getEmploymentStatus(new EmployementStatusSearch()).subscribe((response: any) => {
      if (response.success) {
        this.jobTypes = response.data;
      } else {
        this.jobTypes = [];
      }
      this.cdRef.detectChanges();
    });
  }

  getjobOpeningStatus() {
    this.isAnyOperationIsInprogress = true;
    const jobOpeningStatusInputModel = new JobOpeningStatusInputModel();
    jobOpeningStatusInputModel.isArchived = this.isArchived;
    this.recruitmentService.getJobOpeningStatus(jobOpeningStatusInputModel).subscribe((response: any) => {
      if (response.success === true) {
        this.isThereAnError = false;
        this.openingstatus = response.data;
        if(this.jobDetails != null ){
        this.openingstatus.forEach(x => {
          if (x.order !== 1 && x.jobOpeningStatusId === this.jobDetails.jobOpeningStatusId) {
            this.showDraft = false;
          }
        });
      }

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

  getDesignation() {
    const designation = new DesigationSearch();
    designation.isArchived = false;
    this.recruitmentService.getDesignation(designation).subscribe((response: any) => {
      if (response.success) {
        this.designationList = response.data;
      }
      this.cdRef.detectChanges();
    });
  }

  closedialog() {
    this.dialog.closeAll();
    //this.emitJobAddedSuccessfully(null);
  }
}
