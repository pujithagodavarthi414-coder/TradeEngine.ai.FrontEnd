import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { StoreManagementService } from "@thetradeengineorg1/snova-document-management";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-document-component",
  templateUrl: "./document.component.html"
})

export class DocumentComponent implements OnInit {


  selectedTab: string;
  selectedTabIndex: number;
  paymentDetails: any;
  isAnyOperationIsInprogress: boolean = false;
  isFromRoute: boolean = false;
  dashboardUpdateInProgress: boolean;
  constructor(private storeManagementService: StoreManagementService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.paymentDetails = [
      { documentName: 'Terms of Services', status: 'Uploaded', type: 'Pdf', updatedAt: '10-Dec-2020' },
    ];
  }


  downloadFile() {
    this.dashboardUpdateInProgress = true;
    let file = "https://bviewstorage.blob.core.windows.net/f94916c1-6742-49bd-90de-344662b42704/projects/0a41f08e-f35e-4b41-a9e4-a4c43839abef/SnovasysTerms-5a7e4877-a7bb-47e3-b464-4704b547c937.pdf"
    let obj = file;
    const parts = obj.split("/");
    const loc = parts.pop();
    this.downloadPdf(obj);
  }

  downloadPdf(pdf) {

    const parts = pdf.split("/");
    const loc = parts.pop();
    this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {

      const linkSource = 'data:application/pdf;base64,' + responseData;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = loc.split(".")[0] + '-' + '-File.pdf';
      this.dashboardUpdateInProgress = false;
      downloadLink.click();
    })
  }


}
