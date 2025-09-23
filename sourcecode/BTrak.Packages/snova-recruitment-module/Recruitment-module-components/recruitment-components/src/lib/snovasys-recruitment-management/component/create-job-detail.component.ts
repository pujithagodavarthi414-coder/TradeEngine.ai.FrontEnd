import { Component, Output, EventEmitter, Inject, ViewEncapsulation, ViewChildren, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: component-selector
  selector: 'app-create-jobdetails-component',
  templateUrl: 'create-job-detail.component.html',
})

export class CreateJobDetailsComponent implements OnInit {
  @ViewChildren('closeBookingPopup') closeBookingPopup;

  selectedTabIndex = 0;
  jobDetails: JobOpening;
  isEdit = false;
  addedJobId: string = null;

  @Output() messageEvent = new EventEmitter<string>();
  isAnyOperationIsInprogress: boolean;

  ngOnInit() {
    this.selectedTabIndex = 0;
    this.addedJobId = null;
  }

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateJobDetailsComponent>,
  ) {
    this.jobDetails = data.data;
    if (data.data === '') {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
  }

  changePageForward() {
    this.selectedTabIndex = this.selectedTabIndex + 1;
  }

  previousPage() {
    this.selectedTabIndex = this.selectedTabIndex - 1;
  }
  onNoClick() {
    this.dialogRef.close({ success: true, addedJob: this.addedJobId });
  }

  checkPreviousButtonIsVisible() {
    return this.selectedTabIndex > 0;
  }

  jobaddedEvent(value) {
    this.addedJobId = value;
    this.onNoClick();
  }
}
