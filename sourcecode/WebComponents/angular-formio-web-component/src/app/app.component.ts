import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateFormComponent } from './create-form-component/create-form-component';
import { CustomToolbarItemModel, DocumentEditor, DocumentEditorComponent, DocumentEditorContainerComponent, PrintService, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  /**
   *
   */
  constructor(public dialog: MatDialog) {    
    
  }
  formId:any="fc8c39a4-47da-487a-803d-74152532142d";
  applicationId: any = "59c906ad-3a03-43c2-ab25-8ee2129da5a8";
  submittedId: any = "a630527a-d127-4633-aef8-aace3a357973";
  title = 'angular-formio-web-component';
  data = [
   
  ]
  createForm() {
    let dialogId = "create-form-dialog-component";
    const dialogRef = this.dialog.open(CreateFormComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      height: "70%",
      id: dialogId,
      data: { formPhysicalId: dialogId }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
