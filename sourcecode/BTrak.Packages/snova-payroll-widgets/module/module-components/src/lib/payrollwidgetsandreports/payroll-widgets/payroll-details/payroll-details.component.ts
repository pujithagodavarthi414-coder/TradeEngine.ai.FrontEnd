import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';
import { PayRollService } from '../../services/PayRollService';
import { UserModel } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';

@Component({
  selector: 'app-payroll-details',
  templateUrl: './payroll-details.component.html',
  styleUrls: ['./payroll-details.component.scss']
})
export class PayrollDetailsComponent extends CustomAppBaseComponent implements OnInit {
  validationMessage: any;
  isAnyOperationIsInprogress: boolean;
  isButtonDisable: boolean = false;
  @Input("employeeId")
  set employeeId(data: string) {
    if (data != null && data !== undefined && this.selectedEmployeeId !== data) {
      this.selectedEmployeeId = data;
    }
    this.getEmployeePayrollDetailsList();
  }
  employeePayrollDetails: any[] = [];
  userData$: Observable<UserModel>;
  selectedEmployeeId: string;
  pdfByteArrays = [];
  isZipDownloadInprogress: boolean = false;
  softLabels:SoftLabelConfigurationModel[];

  constructor(public dialog: MatDialog,
    private cdRef: ChangeDetectorRef, private router: Router,
    private payRollService: PayRollService,private toastr: ToastrService) { super(); }

  ngOnInit() {
    super.ngOnInit();
  this.getSoftLabelConfigurations();
    var userModel = new UserModel();
    if (this.selectedEmployeeId == null) {
      if (this.router.url.split("/")[3]) {
        userModel.userId = this.router.url.split("/")[3];
      }
      this.payRollService.getUserById(userModel).subscribe((response: any) => {
        if (response) {
          this.selectedEmployeeId = response.employeeId;
          this.getEmployeePayrollDetailsList();
        }
      });
    }
  }

  
  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }


  getEmployeePayrollDetailsList() {
    this.payRollService.getEmployeePayrollDetailsList(this.selectedEmployeeId).subscribe((response: any) => {
      if (response.success == true) {
        this.employeePayrollDetails = response.data;
        if(this.employeePayrollDetails.length == 0){
          this.isButtonDisable = true;
        }
        else{
          this.isButtonDisable = false;
        }
      }
      else {
        this.isButtonDisable = false;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.cdRef.detectChanges();
      this.isAnyOperationIsInprogress = false;
    })
  }

  downLoadPaySlipsZipFolder() {
    this.isZipDownloadInprogress = true;
    this.pdfByteArrays = [];
    var filesCount = 0;
    var count = 0;
    if (this.employeePayrollDetails == null || this.employeePayrollDetails.length == 0) {
      this.isZipDownloadInprogress = false;
      this.cdRef.markForCheck();
    }
    for (var i = 0; i < this.employeePayrollDetails.length; i++) {
      this.payRollService.downloadPayslip(this.employeePayrollDetails[i].payrollRunId, this.employeePayrollDetails[i].employeeId).subscribe((responseData: any) => {
        this.pdfByteArrays.push(responseData.data);
        filesCount = filesCount + 1
        count = this.downloadZip(filesCount);
        if (count == filesCount) {
          this.isZipDownloadInprogress = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  downloadZip(filesCount) {
    var zip = new JSZip();
    var pdf = zip.folder("payslips");
    var pdffilesCount = 0;
    if (filesCount == this.employeePayrollDetails.length) {
      this.pdfByteArrays.forEach((item: any) => {
        var guid = this.createGuid();
        pdf.file(guid + '-' + item.fileName, item.byteStream, { base64: true });
        pdffilesCount = pdffilesCount + 1;
      });
      if (pdffilesCount == filesCount) {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          FileSaver.saveAs(content, "Payslips.zip");
        });
      }
      return pdffilesCount;
    }
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  downloadPayslip(payrollRunId) {
    this.downloadPdf(payrollRunId, this.selectedEmployeeId);
  }


  getIndividualPaySlip(payrollRunId, employeeId) {

    this.payRollService.downloadPayslip(payrollRunId, employeeId).subscribe((responseData: any) => {
      return responseData.data.byteStream;
    })
  }

  downloadPdf(payrollRunId, employeeId) {

    this.payRollService.downloadPayslip(payrollRunId, employeeId).subscribe((responseData: any) => {

      const linkSource = "data:application/pdf;base64," + responseData.data.byteStream;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = "Payslip.pdf";
      downloadLink.click();
    })
  }

  downloadSalaryCertificate() {
    this.payRollService.downloadSalaryCertificate(this.selectedEmployeeId).subscribe((response: any) => {
      const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.template;base64,' + response;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = 'SalaryCertificate.doc';
      downloadLink.click();
    })
  }
}

