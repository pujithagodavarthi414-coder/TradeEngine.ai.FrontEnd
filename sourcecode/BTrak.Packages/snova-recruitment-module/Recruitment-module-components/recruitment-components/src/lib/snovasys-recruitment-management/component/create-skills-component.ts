import { Component, Output, EventEmitter, Inject, ViewEncapsulation, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-basic-skills-component',
  templateUrl: 'create-skills-component.html',
})

export class CreateskillsDetailsComponent implements OnInit {
  @ViewChildren('closeBookingPopup') closeBookingPopup;
  @Output() messageEvent = new EventEmitter<string>();
  selectedTabIndex = 0;
  skillsList = [];
  optionalSkills = [];
  workExperienceYears = [];
  workExperienceMonths = [];
  createSkillsForm: FormGroup;
  isAnyOperationIsInprogress: boolean;

  ngOnInit() {
    this.selectedTabIndex = 0;
    this.optionalSkills = this.getOptionalSkills();
    this.formValidate();
    this.getMonths();
    this.getYears();
  }

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService) {}

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }

  getOptionalSkills() {
    return [
      { id: '1', name: 'React js' },
      { id: '2', name: 'Node js' },
      { id: '3', name: 'AWS' }
    ];
  }

  getYears() {
    for (let i = 1; i <= 30; i++) {
      this.workExperienceYears.push(i);
    }
  }
  getMonths() {
    for (let i = 1; i <= 12; i++) {
      this.workExperienceMonths.push(i);
    }
  }

  formValidate() {
    this.createSkillsForm = new FormGroup({
      skills: new FormControl('',
        Validators.compose([

        ])
      ),
      locations: new FormControl('',
        Validators.compose([

        ])
      ),

      years: new FormControl('',
        Validators.compose([

        ])
      ),
      months: new FormControl('',
        Validators.compose([

        ])
      )
    });
  }

  compareSelectedLocationFn(rolesList: any, selectedModules: any) {
    if (rolesList === selectedModules) {
      return true;
    } else {
      return false;
    }
  }

  addSkillsDetail(value) {
    this.changePageForward();
    this.toastr.success('Skills saved successfully');
  }

}
