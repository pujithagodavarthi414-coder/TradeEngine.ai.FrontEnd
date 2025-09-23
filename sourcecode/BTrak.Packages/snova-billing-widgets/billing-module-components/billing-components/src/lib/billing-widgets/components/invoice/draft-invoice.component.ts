import { Component } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Location} from '@angular/common';
import '../../../globaldependencies/helpers/fontawesome-icons'


import { SendInvoiceComponent } from "./send-invoice.component";

@Component({
  selector: "app-billing-component-invoice-draftinvoice",
  templateUrl: "draft-invoice.component.html"
})

export class InvoiceDraftinvoiceComponent {
    Tasks=[];
    Items=[];

    constructor(public dialog: MatDialog,
                private _location: Location) 
    { 
      
    }

    openDialog(): void 
    {
      let dialogRef = this.dialog.open(SendInvoiceComponent, {
        height: 'auto',
        width: '600px',
        disableClose: true,
        panelClass: 'custom-matdialog'
      });
    }
    backClicked() {
      this._location.back();
    }
  ngOnInit() {
    this.Tasks.push('1');
    this.Items.push('1');
  }
 
}
