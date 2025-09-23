import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CandidateEducationModel } from '../../snovasys-recruitment-management-apps/models/candidate-education.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candide-education-detail',
  templateUrl: 'candidate-education-detail.component.html',

})
export class CandidateEducationComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('upsertEducationPopUp') upsertEducationPopover;
  @ViewChildren('deleteEducationPopup') deleteEducationPopover;
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;

  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.candidateData = data;
      this.clearForm();
      this.getCandidateEducation();
    }
  }

  @Input('isFromEducation')
  set _isFromEducation(data: any) {
    if (data) {
      this.isFromEducation = data;
    }
  }
  isAnyOperationIsInprogress: boolean;
  educationForm: FormGroup;
  institute: any;
  department: any;
  nameOfDegree: any;
  dateFrom: any;
  dateTo: any;
  timeStamp: any;
  educationTitle: any;
  candidateEducationId: any;
  isThereAnError: boolean;
  validationMessage: any;
  candidateEducation: any;
  isFromEducation: boolean;
  candidateId: any;
  isArchived = false;
  candidateData: any;
  searchText: string = null;
  onBoardProcessDate: Date;
  temp: any;
  sortDirection = true;
  sortBy = 'Institute';
  candidateLength = 0;
  pursuing: any;

  ngOnInit() {
    super.ngOnInit();
  }

  constructor(
    private toastr: ToastrService,
    private recruitmentService: RecruitmentService,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    super();
  }

  onSort(event) {
    if (this.candidateEducation.length > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === 'asc') {
        this.sortDirection = true;
      } else {
        this.sortDirection = false;
      }
      this.getCandidateEducation();
    }
  }

  getCandidateEducation() {
    this.isAnyOperationIsInprogress = true;
    const candidateEducationModel = new CandidateEducationModel();
    candidateEducationModel.candidateId = this.candidateData.candidateId;
    candidateEducationModel.sortBy = this.sortBy;
    candidateEducationModel.sortDirectionAsc = this.sortDirection;
    candidateEducationModel.isArchived = this.isArchived;
    this.recruitmentService.getCandidateEducation(candidateEducationModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateEducation = response.data;
        this.candidateLength = this.candidateEducation.length;
        this.temp = response.data;
        if (this.searchText != null && this.searchText !== '') {
          this.filterByName('');
        }
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  createCandidateEducation(upsertEducationPopUp) {
    this.clearForm();
    this.educationTitle = this.translateService.instant('CANDIDATEEDUCATION.ADDEDUCATION');
    upsertEducationPopUp.openPopover();
  }

  upsertCandidateEducation(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    const candidateEducationModel = new CandidateEducationModel();
    candidateEducationModel.candidateEducationalDetailId = this.educationForm.value.candidateEducationalDetailId;
    candidateEducationModel.candidateId = this.candidateData.candidateId;
    candidateEducationModel.institute = this.educationForm.value.institute;
    candidateEducationModel.department = this.educationForm.value.department;
    candidateEducationModel.nameOfDegree = this.educationForm.value.nameOfDegree;
    candidateEducationModel.dateFrom = this.educationForm.value.dateFrom;
    candidateEducationModel.dateTo = this.educationForm.value.dateTo;
    candidateEducationModel.isPursuing = this.educationForm.value.isPursuing;
    candidateEducationModel.timeStamp = this.educationForm.value.timeStamp;
    this.recruitmentService.upsertCandidateEducation(candidateEducationModel).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success('' + this.translateService.instant('CANDIDATEEDUCATION.SAVEDSUCCESSFULLY'));
        this.isAnyOperationIsInprogress = false;
        formDirective.resetForm();
        this.clearForm();
        this.isThereAnError = false;
        this.upsertEducationPopover.forEach((p) => p.closePopover());
        this.getCandidateEducation();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  editEducation(row, upsertEducationPopUp) {
    this.educationForm.patchValue(row);
    this.candidateId = row.candidateId;
    this.institute = row.institute;
    this.department = row.department;
    this.nameOfDegree = row.nameOfDegree;
    this.dateFrom = row.dateFrom;
    this.dateTo = row.dateTo;
    this.timeStamp = row.timeStamp;
    this.pursuing = row.isPursuing;
    this.educationTitle = this.translateService.instant('CANDIDATEEDUCATION.EDITEDUCATIONTITLE');
    upsertEducationPopUp.openPopover();
  }

  deleteEducationPopupOpen(row, deleteEducationPopup) {
    this.candidateEducationId = row.candidateEducationalDetailId;
    this.candidateId = row.candidateId;
    this.institute = row.institute;
    this.department = row.department;
    this.nameOfDegree = row.nameOfDegree;
    this.dateFrom = row.dateFrom;
    this.dateTo = row.dateTo;
    this.timeStamp = row.timeStamp;
    this.pursuing = row.isPursuing;
    deleteEducationPopup.openPopover();
  }

  closeEducationPopUpPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertEducationPopover.forEach((p) => p.closePopover());
  }

  deleteEducation() {
    this.isAnyOperationIsInprogress = true;
    const candidateEducationModel = new CandidateEducationModel();
    candidateEducationModel.candidateEducationalDetailId = this.candidateEducationId;
    candidateEducationModel.candidateId = this.candidateId;
    candidateEducationModel.institute = this.institute;
    candidateEducationModel.department = this.department;
    candidateEducationModel.nameOfDegree = this.nameOfDegree;
    candidateEducationModel.dateFrom = this.dateFrom;
    candidateEducationModel.dateTo = this.dateTo;
    candidateEducationModel.timeStamp = this.timeStamp;
    candidateEducationModel.isPursuing = this.pursuing;
    candidateEducationModel.isArchived = !this.isArchived;
    this.recruitmentService.upsertCandidateEducation(candidateEducationModel).subscribe((response: any) => {
      if (response.success === true) {
        this.deleteEducationPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getCandidateEducation();
      } else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  closeDeleteEducationPopup() {
    this.clearForm();
    this.deleteEducationPopover.forEach((p) => p.closePopover());
  }

  clearForm() {
    this.institute = null;
    this.department = null;
    this.candidateEducationId = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.nameOfDegree = null;
    this.timeStamp = null;
    this.isAnyOperationIsInprogress = false;
    this.dateFrom = null;
    this.dateTo = null;
    this.educationForm = new FormGroup({
      candidateId: new FormControl(null,
        Validators.compose([
        ])
      ),
      candidateEducationalDetailId: new FormControl(null,
        Validators.compose([])
      ),
      institute: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      department: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      nameOfDegree: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      dateFrom: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      dateTo: new FormControl(null,
        Validators.compose([
        ])
      ),
      isPursuing: new FormControl(null,
        Validators.compose([
        ])
      ),
      timeStamp: new FormControl(null,
        Validators.compose([
        ])
      ),
    });
  }

  closeSearch() {
    this.searchText = null;
    this.filterByName(null);
  }

  filterByName(value) {
    if (this.searchText != null && this.searchText !== undefined && this.searchText !== '') {
      const temp = this.temp.filter(candidateEducation =>
        (candidateEducation.institute.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (candidateEducation.department.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
        || (candidateEducation.nameOfDegree.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1));
      this.candidateEducation = temp;
    } else if (this.searchText == null || this.searchText === '') {
      this.candidateEducation = this.temp;
    }
    this.candidateLength = this.candidateEducation.length;
  }
}
