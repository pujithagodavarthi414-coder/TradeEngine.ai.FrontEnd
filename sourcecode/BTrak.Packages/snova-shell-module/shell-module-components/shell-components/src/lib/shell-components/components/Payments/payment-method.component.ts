import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-payment-method-component",
  templateUrl: "./payment-method.component.html"
})

export class PaymentMethodComponent implements OnInit {


  selectedTab: string;
  selectedTabIndex: number;
  paymentDetails : any;
  isAnyOperationIsInprogress : boolean = false;
  isFromRoute : boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
   
  }


}
