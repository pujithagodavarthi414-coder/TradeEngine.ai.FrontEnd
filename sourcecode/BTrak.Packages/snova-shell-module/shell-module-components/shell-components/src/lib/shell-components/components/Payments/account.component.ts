import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-account.component",
  templateUrl: "./account.component.html"
})

export class AccountAndBillingComponent implements OnInit {


  selectedTab: string;
  selectedTabIndex: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit() {
   
    this.selectedTabIndex = 1;
    this.selectedTab = "Products & Services";
  }

  onTabClick(event: MatTabChangeEvent) {
    if (event.tab.textLabel.includes("Products & Services")) {
      this.selectedTab = "Products & Services";
    }
    else if (event.tab.textLabel.includes("Company Info")) {
      this.selectedTab = "Company Info";
    }
    else if (event.tab.textLabel.includes("Transactions")) {
      this.selectedTab = "Transactions";
    }
    else if (event.tab.textLabel.includes("Documents")) {
      this.selectedTab = "Documents";
    }
    else if (event.tab.textLabel.includes("Payment Method")) {
      this.selectedTab = "Payment Method";
    }

  }

}
