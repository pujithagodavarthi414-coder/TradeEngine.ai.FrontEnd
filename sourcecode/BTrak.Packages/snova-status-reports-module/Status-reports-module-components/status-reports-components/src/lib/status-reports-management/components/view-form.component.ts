import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import "../../globaldependencies/helpers/fontawesome-icons"

@Component({
  selector: 'app-viewform',
  templateUrl: './viewform.component.html'
})
export class ViewformComponent implements OnInit {

  formObject: any;
  formName:string;

  constructor(public dialogRef: MatDialogRef<ViewformComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formObject = this.data.formSrc;
    this.formName = this.data.formName;
  }

  onSubmit(data) {
    this.dialogRef.close({ formJson: data, formFields: this.formObject });
  }

  closePopup() {
    this.dialogRef.close();
  }
}
