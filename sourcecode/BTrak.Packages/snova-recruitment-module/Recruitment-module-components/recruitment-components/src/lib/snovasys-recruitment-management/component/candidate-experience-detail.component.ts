import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CandidateExperienceModel } from '../../snovasys-recruitment-management-apps/models/candidateexperience.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candide-experience-detail',
  templateUrl: 'candidate-experience-detail.component.html',

})
export class CandidateExperienceComponent implements OnInit {
  @ViewChildren('upsertExperiencePopUp') upsertExperiencePopover;
  @ViewChildren('deleteExperiencePopup') deleteExperiencePopover;
  @ViewChild('formDirective') formDirective: FormGroupDirective;
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.clearForm();
      this.candidateData = data;
      this.candidateId = data.candidateId;
      this.getCandidateExperience();
    }
  }

  @Input('isFromExperience')
  set _isFromExperiences(data: boolean) {
    if (data) {
      this.isFromExperiences = data;
    }
  }

  isFromSkills = false;
  isAnyOperationIsInprogress: boolean;
  candidateExperience: any;
  experienceForm: FormGroup;
  occupationTitle: any;
  company: any;
  companyType: any;
  description: any;
  dateFrom: any;
  dateTo: any;
  location: any;
  salary: any;
  timeStamp: any;
  experienceTitle: any;
  isThereAnError: boolean;
  validationMessage: any;
  selectedTabIndex: number;
  jobAddEvent: any;
  isArchived = false;
  searchText: string;
  temp: any = [];
  onBoardProcessDate: Date;
  isFromExperience: boolean;
  isFromExperiences: boolean;
  candidateId: any;
  candidateData: any;
  candidateExperienceDetailsId: any;
  isCurrentlyWorkingHere = false;
  candidateExperienceId: any;
  sortDirection = true;
  sortBy = 'OccupationTitle';

  ngOnInit() {
    this.selectedTabIndex = 0;
  }

  constructor(
    private toastr: ToastrService,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  getCandidateExperience() {
    this.isAnyOperationIsInprogress = true;
    const candidateExperienceModel = new CandidateExperienceModel();
    candidateExperienceModel.candidateId = this.candidateId;
    candidateExperienceModel.isArchived = this.isArchived;
    candidateExperienceModel.sortDirectionAsc = this.sortDirection;
    candidateExperienceModel.sortBy = this.sortBy;
    this.recruitmentService.getCandidateExperience(candidateExperienceModel).subscribe((response: any) => {
      if (response.success) {
        this.isThereAnError = false;
        this.clearForm();
        this.candidateExperience = response.data;
        this.temp = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });


  }

  createExperience(upsertExperiencePopUp) {
    this.clearForm();
    upsertExperiencePopUp.openPopover();
    this.experienceTitle = this.translateService.instant('EXPERIENCE.CREATEEXPERIENCE');
  }

  clearForm() {
    this.occupationTitle = null;
    this.company = null;
    this.companyType = null;
    this.description = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.location = null;
    this.salary = null;
    this.searchText = null;
    this.validationMessage = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.experienceForm = new FormGroup({
      candidateId: new FormControl(null,
        Validators.compose([
          Validators.maxLength(50)
        ])
      ),
      occupationTitle: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      company: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      companyType: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      description: new FormControl(null,
        Validators.compose([

          Validators.maxLength(100)
        ])
      ),
      dateFrom: new FormControl(null,
        Validators.compose([
          Validators.required,
        ])
      ),
      dateTo: new FormControl(null,
        Validators.compose([

        ])
      ),
      location: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      salary: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      currencyId: new FormControl(null,
        Validators.compose([

        ])
      ),
      timeStamp: new FormControl(null,
        Validators.compose([

        ])
      ), candidateExperienceDetailsId: new FormControl(null,
        Validators.compose([

        ])
      ),
      isCurrentlyWorkingHere: new FormControl(null,
        Validators.compose([

        ])
      ),
    });
  }
  upsertCandidateExperience(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    const candidateExperienceModel = new CandidateExperienceModel();
    candidateExperienceModel.candidateId = this.candidateData.candidateId;
    candidateExperienceModel.candidateExperienceDetailsId = this.experienceForm.value.candidateExperienceDetailsId;
    candidateExperienceModel.occupationTitle = this.experienceForm.value.occupationTitle;
    candidateExperienceModel.company = this.experienceForm.value.company;
    candidateExperienceModel.companyType = this.experienceForm.value.companyType;
    candidateExperienceModel.description = this.experienceForm.value.description;
    candidateExperienceModel.dateFrom = this.experienceForm.value.dateFrom;
    candidateExperienceModel.dateTo = this.experienceForm.value.dateTo;
    candidateExperienceModel.location = this.experienceForm.value.location;
    candidateExperienceModel.salary = this.experienceForm.value.salary;
    candidateExperienceModel.isCurrentlyWorkingHere = this.experienceForm.value.isCurrentlyWorkingHere;
    candidateExperienceModel.timeStamp = this.experienceForm.value.timeStamp;
    this.recruitmentService.upsertCandidateExperience(candidateExperienceModel).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success('' + this.translateService.instant('EXPERIENCE.SAVEDSUCCESSFULLY'));
        this.isAnyOperationIsInprogress = false;
        formDirective.resetForm();
        this.clearForm();
        this.isThereAnError = false;
        this.upsertExperiencePopover.forEach((p) => p.closePopover());
        this.getCandidateExperience();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  editExperience(row, upsertExperiencePopUp) {
    this.experienceForm.patchValue(row);
    this.candidateId = row.candidateId;
    this.occupationTitle = row.occupationTitle;
    this.company = row.company;
    this.companyType = row.companyType;
    this.description = row.description;
    this.dateFrom = row.dateFrom;
    this.dateTo = row.dateTo;
    this.location = row.location;
    this.salary = row.salary;
    this.timeStamp = row.timeStamp;
    this.isCurrentlyWorkingHere = row.isCurrentlyWorkingHere;
    this.experienceTitle = this.translateService.instant('EXPERIENCE.EDITEXPERIENCE');
    upsertExperiencePopUp.openPopover();
  }

  deleteExperiencePopupOpen(row, deleteExperiencePopup) {
    this.candidateId = row.candidateId;
    this.occupationTitle = row.occupationTitle;
    this.company = row.company;
    this.companyType = row.companyType;
    this.description = row.description;
    this.dateFrom = row.dateFrom;
    this.dateTo = row.dateTo;
    this.location = row.location;
    this.salary = row.salary;
    this.isCurrentlyWorkingHere = row.isCurrentlyWorkingHere;
    this.candidateExperienceId = row.candidateExperienceDetailsId;
    this.timeStamp = row.timeStamp;
    deleteExperiencePopup.openPopover();
  }

  closeUpsertExperiencePopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertExperiencePopover.forEach((p) => p.closePopover());
  }

  deleteExperience() {
    this.isAnyOperationIsInprogress = true;
    const candidateExperienceModel = new CandidateExperienceModel();
    candidateExperienceModel.candidateExperienceDetailsId = this.candidateExperienceId;
    candidateExperienceModel.candidateId = this.candidateId;
    candidateExperienceModel.occupationTitle = this.occupationTitle;
    candidateExperienceModel.company = this.company;
    candidateExperienceModel.companyType = this.companyType;
    candidateExperienceModel.description = this.description;
    candidateExperienceModel.dateFrom = this.dateFrom;
    candidateExperienceModel.dateTo = this.dateTo;
    candidateExperienceModel.location = this.location;
    candidateExperienceModel.salary = this.salary;
    candidateExperienceModel.isCurrentlyWorkingHere = this.isCurrentlyWorkingHere;
    candidateExperienceModel.timeStamp = this.timeStamp;
    candidateExperienceModel.isArchived = !this.isArchived;
    candidateExperienceModel.candidateExperienceDetailsId = this.candidateExperienceId;

    this.recruitmentService.upsertCandidateExperience(candidateExperienceModel).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteExperiencePopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getCandidateExperience();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  closeDeleteExperiencePopup() {
    this.clearForm();
    this.deleteExperiencePopover.forEach((p) => p.closePopover());
  }

  onSort(event) {
    if (this.candidateExperience.length > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === 'asc') {
        this.sortDirection = true;
      } else {
        this.sortDirection = false;
      }
      this.getCandidateExperience();
    }
  }

  closeSearch() {
    this.searchText = null;
    this.filterByName(null);
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      const temp = this.temp.filter(candidateExperience =>
        (candidateExperience.occupationTitle == null ? null :
           candidateExperience.occupationTitle.toString().toLowerCase().indexOf(this.searchText) > -1)
        || (candidateExperience.company == null ? null : candidateExperience.company.toString().toLowerCase().indexOf(this.searchText) > -1)
        || (candidateExperience.companyType == null ? null :
           candidateExperience.companyType.toString().toLowerCase().indexOf(this.searchText) > -1)
        || (candidateExperience.description == null ? null :
           candidateExperience.description.toString().toLowerCase().indexOf(this.searchText) > -1)
        || (candidateExperience.location == null ? null :
           candidateExperience.location.toString().toLowerCase().indexOf(this.searchText) > -1)
        || (candidateExperience.salary == null ? null : candidateExperience.salary.toString().indexOf(this.searchText) > -1));


      this.candidateExperience = temp;
    } else if (this.searchText == null || this.searchText === '') {
      this.candidateExperience = this.temp;
    }
  }

}
