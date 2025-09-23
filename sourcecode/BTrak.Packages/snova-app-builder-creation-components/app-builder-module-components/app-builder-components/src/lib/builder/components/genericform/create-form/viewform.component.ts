import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-viewform',
  templateUrl: './viewform.component.html'
})
export class ViewformComponent implements OnInit {

  formObject: any;
  formName: string;
  matData: any;
  currentDialogId: any;
  currentDialog: any;
  formId: any;

  @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.formObject = this.matData.formSrc;
            this.formName = this.matData.formName;
            this.currentDialogId = this.matData.formPhysicalId;
            this.formId=this.matData.formId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ViewformComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // this.formObject = this.data.formSrc;
    // this.formName = this.data.formName;
  }

  onSubmit(data) {
    this.currentDialog.close({ formJson: data, formFields: this.formObject });
  }

  closePopup() {
    this.currentDialog.close();
  }
}
