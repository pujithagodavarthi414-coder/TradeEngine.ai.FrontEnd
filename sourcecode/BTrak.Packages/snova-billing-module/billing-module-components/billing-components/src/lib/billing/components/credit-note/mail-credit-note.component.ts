import { validateVerticalPosition } from "@angular/cdk/overlay";
import { DecimalPipe } from "@angular/common";
import { VariableAst, VariableBinding } from "@angular/compiler";
import { ChangeDetectorRef, Component, Inject, Input, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { GRDMOdel } from "../../models/GRD-Model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";

@Component({
  selector: "mail-credit-note",
  templateUrl: "mail-credit-note.component.html"
})

export class MailCreditNoteComponent {
  currentDialogId: any;
    creditNoteDetails: any;
    siteDetails: any;
  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      let matData = data[0];
      this.currentDialogId = matData.fromPhysicalId;
      if(matData){
        this.currentDialogId = matData.fromPhysicalId;
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }
    this.creditNoteDetails = matData.creditNoteDetails;
    this.siteDetails = matData.siteDetails;
  }
}
//   moduleTypeId = 16;
//   referenceTypeId = ConstantVariables.EntryFormInvoiceReferenceTypeId;
//   isToUploadFiles = false;
//   selectedStoreId: null;
//   selectedParentFolderId: null;
//   entryFromReferenceId: any = null;
//   isFileExist: boolean;
currentDialog: any;
id: any;
  isAnyOperationIsInprogress: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private toastr: ToastrService,private dialogRef: MatDialogRef<MailCreditNoteComponent>, private dateAdapter: DateAdapter<any>, public siteService: SiteService, public cdRef: ChangeDetectorRef,
  private decimalPipe: DecimalPipe) {
    this.dateAdapter.setLocale('fr');
    if (data.dialogId) {
      this.currentDialogId = this.data.dialogId;
      this.id = setTimeout(() => {
          this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      }, 1200)
    }
  }

  ngOnInit() {
  }
  cancelDialog() {
    this.currentDialog.close({ success: false, redirection: true });
  }
  sendMail() {
    this.isAnyOperationIsInprogress = true;
    this.siteService.sendCreditNoteMail(this.creditNoteDetails).subscribe((result: any) => {
      if (result.success) {
        this.cancelDialog();
      }
      else {
        this.isAnyOperationIsInprogress = false;
        this.toastr.error('',"Error occured while sending mail");
      }
    });
  }

//   filesExist(event) {
//     this.isFileExist = event;
//   }

  closeFilePopup() {
  }
}
