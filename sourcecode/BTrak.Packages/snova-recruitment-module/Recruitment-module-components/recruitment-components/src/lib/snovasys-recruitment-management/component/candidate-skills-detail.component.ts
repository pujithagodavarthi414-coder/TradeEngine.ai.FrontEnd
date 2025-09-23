import {
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  ViewChildren,
  EventEmitter,
  ViewChild,
  OnInit
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SkillsModel } from '../../snovasys-recruitment-management-apps/models/skills.model';
import { CandidateSkillsModel } from '../../snovasys-recruitment-management-apps/models/candidateskills.model';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candide-skills-detail',
  templateUrl: 'candidate-skills-detail.component.html',
})
export class CandidateSkillsComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('upsertskillPopUp') upsertskillPopover;
  @ViewChildren('deleteskillPopup') deleteskillPopover;
  @ViewChild('formDirective') formDirective: FormGroupDirective;
  @ViewChildren('addSkillsPopup') addSkillsPopover;
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  @Output() jobAddEvent = new EventEmitter<string>();
  candidateSkills: any = [];
  isFromSkills = false;
  isAnyOperationIsInprogress: boolean;
  selectedTabIndex = 0;
  isEdit: boolean;
  errorMessage: boolean;
  skillNameId: any;
  timeStamp: any;
  skillTitle: any;
  isThereAnError: boolean;
  validationMessage: string;
  searchText: any;
  candidateSkillsForm: FormGroup;
  experience: any;
  isArchived: any;
  skillId: any;
  skills: any;
  selectedSkill: any;
  candidateId: any;
  candidateData: any;
  candidateSkillId: any;
  temp: any;
  addSkillsForm: FormGroup;
  loadSpinner: boolean;

  @Input('isFromSkill')
  set _isFromSkills(data: boolean) {
    if (data) {
      this.isFromSkills = data;
    }
  }

  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.clearForm();
      this.candidateId = data.candidateId;
      this.candidateData = data;
      this.getCandidateSkills();
      this.getSkills();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectedTabIndex = 0;
  }

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private recruitmentService: RecruitmentService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  getCandidateSkills() {
    const candidateSkillsModel = new CandidateSkillsModel();
    candidateSkillsModel.isArchived = this.isArchived;
    candidateSkillsModel.candidateId = this.candidateId;
    this.isAnyOperationIsInprogress = true;
    this.recruitmentService.getCandidateSkills(candidateSkillsModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateSkills = response.data;
        this.temp = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
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

  getSkillValue(event) {
    const skillSelected = this.skills;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(skillSelected, function(member: any) {
      return member.skillId === event;
    });
    if (filteredList) {
      this.selectedSkill = filteredList.skillName;
      this.cdRef.detectChanges();
    }
  }

  createCandidateSkill(upsertskillPopUp) {
    this.skillTitle = this.translateService.instant('CANDIDATESKILLS.ADDCANDIDATESKILLTITLE');
    upsertskillPopUp.openPopover();
  }

  editskillType(row, upsertskillPopUp) {
    this.isEdit = true;
    this.errorMessage = false;
    this.candidateSkillsForm.patchValue(row);
    this.skillId = row.SkillId;
    this.name = row.name;
    this.experience = row.experience;
    this.timeStamp = row.timeStamp;
    this.skillTitle = this.translateService.instant('CANDIDATESKILLS.EDITCANDIDATESKILLTITLE');
    upsertskillPopUp.openPopover();
  }

  deleteskillPopupOpen(row, deleteskillPopup) {
    this.candidateSkillId = row.candidateSkillId;
    this.name = row.skillId;
    this.experience = row.experience;
    this.timeStamp = row.timeStamp;
    deleteskillPopup.openPopover();
  }

  closeUpsertSkillPopUpPopup(formDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertskillPopover.forEach((p) => p.closePopover());
  }

  deleteskill() {
    this.isAnyOperationIsInprogress = true;
    const candidateSkillsModel = new CandidateSkillsModel();
    candidateSkillsModel.candidateId = this.candidateId;
    candidateSkillsModel.candidateSkillId = this.candidateSkillId;
    candidateSkillsModel.skillId = this.name;
    candidateSkillsModel.experience = this.experience;
    candidateSkillsModel.timeStamp = this.timeStamp;
    candidateSkillsModel.isArchived = !this.isArchived;
    this.recruitmentService.upsertCandidateSkills(candidateSkillsModel).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteskillPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getCandidateSkills();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }
  closeDeleteskillPopup() {
    this.clearForm();
    this.deleteskillPopover.forEach((p) => p.closePopover());
  }

  clearForm() {
    this.name = null;
    this.selectedSkill = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.experience = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.searchText = null;
    this.candidateSkillsForm = new FormGroup({
      skillId: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      experience: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      candidateSkillId: new FormControl(null,
        Validators.compose([

        ])
      ),
      timeStamp: new FormControl(null,
        Validators.compose([

        ])
      ),
    });
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

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }

  upsertCandidateSkills(patchValue) {
    this.isAnyOperationIsInprogress = true;
    this.changePageForward();
    const candidateSkillsModel = new CandidateSkillsModel();
    candidateSkillsModel.candidateId = this.candidateId;
    candidateSkillsModel.candidateSkillId = this.candidateSkillsForm.value.candidateSkillId;
    candidateSkillsModel.skillId = this.candidateSkillsForm.value.skillId;
    candidateSkillsModel.experience = this.candidateSkillsForm.value.experience;
    candidateSkillsModel.timeStamp = this.candidateSkillsForm.value.timeStamp;
    this.recruitmentService.upsertCandidateSkills(candidateSkillsModel).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success('Candidate skills saved successfully');
        this.clearForm();
        this.formDirective.resetForm();
        this.upsertskillPopover.forEach((p) => p.closePopover());
        this.getCandidateSkills();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }
  emitSkillAddedSuccessfully(value) {
    this.jobAddEvent.emit(value);
  }

  closeSearch() {
    this.searchText = null;
    this.filterByName(null);
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      const temp = this.temp.filter(candidateSkills =>
        (candidateSkills.skillName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
         || (candidateSkills.experience.toString().indexOf(this.searchText) > -1));
      this.candidateSkills = temp;
    } else if (this.searchText == null || this.searchText === '') {
      this.candidateSkills = this.temp;
    }
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

}
