import { Component, OnInit, Inject, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-form-data',
  templateUrl: './edit-form-data.component.html'
})
export class EditFormDataComponent implements OnInit {

  @Input("data")
  set _data(data: any) {
      if (data && data !== undefined) {
          this.matData = data[0];
          this.formObject = this.matData.formFields;
          this.formData.data = this.matData.formSrc; 
          this.currentDialogId = this.matData.formPhysicalId;
          this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      }
  }

  formObject: any;
  formData = {data: {} };
  matData: any;
  currentDialogId: any;
  currentDialog: any;

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<EditFormDataComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // this.formObject = this.data.formFields;
    // this.formData.data = this.data.formSrc; 
  }

  onSubmit(data){
    console.log(data);
    this.currentDialog.close({formJson: data,formFields: this.formObject});
  }
  onChangeNew(event) {
       console.log(event);
  }

}
