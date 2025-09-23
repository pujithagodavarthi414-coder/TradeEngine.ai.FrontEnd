import { Component, Output, EventEmitter, Inject, ViewEncapsulation, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateJobDetailsComponent } from './create-job-detail.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-job-assign-component',
  templateUrl: 'job-assing-component.html',
})

export class JobAssignComponent implements OnInit {
  @ViewChildren('closeBookingPopup') closeBookingPopup;
  @Output() messageEvent = new EventEmitter<string>();
  selectedTabIndex = 0;
  jobAssignForm: FormGroup;
  isAnyOperationIsInprogress: boolean;

  ngOnInit() {
    this.selectedTabIndex = 0;
    this.formValidate();
  }

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateJobDetailsComponent>
  ) {}

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }

  formValidate() {
    this.jobAssignForm = new FormGroup({
      assignJobTo: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      ),
      sendNotificationEmail: new FormControl('',
        Validators.compose([

        ])
      )
    });
  }

  addAssigneeDetail(value) {
    this.toastr.success('Assign job to saved successfully');
    this.dialogRef.close();
  }
  changeAddress() { }
}
