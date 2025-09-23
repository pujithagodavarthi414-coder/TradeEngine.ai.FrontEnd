import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantVariables } from '../../constants/constant-variables';
import { BLModel } from '../../models/bl-model';
import { ClientSearchInputModel } from '../../models/client-search-input.model';
import { ShipmentBLModel } from '../../models/payment-term.model';
import { ShipmentExecutionModel } from '../../models/shipment-execution.model';
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ChaConfirmationMail } from './cha-confirmation-mail.component';
export interface DialogData {
    rowData: any;
}
@Component({
    selector: "app-billing-component-stage-two",
    templateUrl: "stage-two-process.component.html"
})

export class ShipmentStageTwoForm {
    shipmentStageTwoForm: FormGroup;
    purchaseExecutionId: string;
    selectedContractId: string;
    purchaseShipmentBLId: string;
    blData: any;
    rowData: any;
    timeStamp: any;
    clientData: any = null;
    decisionList = [
        { key: 'Yes', value: true },
        { key: 'No', value: false }
    ]
    isInProgress: boolean = false;
    loadingInProgress: boolean = false;
    referenceTypeId = ConstantVariables.MasterBillOfEntryDraftReferenceTypeId;
    getFilesByReferenceId: boolean = true;
    moduleTypeId = 17;
    isToUploadFiles: boolean = false;
    selectedParentFolderId: null;
    selectedStoreId: null;
    isFileExist: boolean;

    referenceConfirmTypeId = ConstantVariables.MasterBillOfEntryConfirmReferenceTypeId;
    getFilesByReferenceConfirmId: boolean = true;
    isToUploadConfirmFiles: boolean = false;
    selectedConfirmParentFolderId: null;
    selectedConfirmStoreId: null;
    isConfirmFileExist: boolean;

    constructor(private BillingDashboardService: BillingDashboardService, public dialog: MatDialog, private router: Router, public dialogRef: MatDialogRef<ShipmentStageTwoForm>,
        private route: ActivatedRoute, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private cdRef: ChangeDetectorRef) {
        this.rowData = this.data.rowData;
        var temp = this.router.url.split("/");
        this.selectedContractId = temp[3];
        this.purchaseExecutionId = temp[4];
        this.purchaseShipmentBLId = this.rowData.shipmentBLId;
        this.getShipmentBlById();
    }

    ngOnInit() {
        this.getClients();
        this.clearForm();
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    filesConfirmExist(event) {
        this.isConfirmFileExist = event;
    }

    getClients() {
        let clientSearchInputModel = new ClientSearchInputModel();
        clientSearchInputModel.isArchived = false;
        clientSearchInputModel.clientType = 'Other';
        this.BillingDashboardService.getClients(clientSearchInputModel)
            .subscribe((responseData: any) => {
                this.clientData = responseData.data;
            })
    }

    getShipmentBlById() {
        this.loadingInProgress = true;
        let bldet = new ShipmentBLModel();
        bldet.isArchived = false;
        bldet.purchaseShipmentBLId = this.purchaseShipmentBLId;
        bldet.purchaseShipmentId = this.purchaseExecutionId;
        this.BillingDashboardService.GetShipmentExecutionBLById(bldet)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.blData = responseData.data;
                    this.shipmentStageTwoForm.patchValue(this.blData);
                    this.draftTotal();
                    this.confoTotal();
                    this.loadingInProgress = false;
                }
                else {
                    this.loadingInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            })
    }

    saveBlDetails() {
        this.isInProgress = true;
        var blModel = new BLModel();
        blModel.shipmentBLId = this.purchaseShipmentBLId;
        blModel.isArchived = false;
        blModel = this.blData
        blModel.chaId = this.shipmentStageTwoForm.controls['chaId'].value;
        blModel.isDocumentsSent = this.shipmentStageTwoForm.controls['isDocumentsSent'].value;
        blModel.sentDate = this.shipmentStageTwoForm.controls['sentDate'].value;
        blModel.draftEntryDate = this.shipmentStageTwoForm.controls['draftEntryDate'].value;
        blModel.draftBLNumber = this.shipmentStageTwoForm.controls['draftBLNumber'].value;
        blModel.draftBLDescription = this.shipmentStageTwoForm.controls['draftBLDescription'].value;
        blModel.draftBasicCustomsDuty = this.shipmentStageTwoForm.controls['draftBasicCustomsDuty'].value;
        blModel.draftSWC = this.shipmentStageTwoForm.controls['draftSWC'].value;
        blModel.draftIGST = this.shipmentStageTwoForm.controls['draftIGST'].value;
        blModel.draftEduCess = this.shipmentStageTwoForm.controls['draftEduCess'].value;
        blModel.draftOthers = this.shipmentStageTwoForm.controls['draftOthers'].value;
        blModel.isConfirmedBill = this.shipmentStageTwoForm.controls['isConfirmedBill'].value;
        blModel.confirmationDate = this.shipmentStageTwoForm.controls['confirmationDate'].value;
        blModel.confoEntryDate = this.shipmentStageTwoForm.controls['confoEntryDate'].value;
        blModel.confoBLNumber = this.shipmentStageTwoForm.controls['confoBLNumber'].value;
        blModel.confoBLDescription = this.shipmentStageTwoForm.controls['confoBLDescription'].value;
        blModel.confoBasicCustomsDuty = this.shipmentStageTwoForm.controls['confoBasicCustomsDuty'].value;
        blModel.confoSWC = this.shipmentStageTwoForm.controls['confoSWC'].value;
        blModel.confoIGST = this.shipmentStageTwoForm.controls['confoIGST'].value;
        blModel.confoEduCess = this.shipmentStageTwoForm.controls['confoEduCess'].value;
        blModel.confoOthers = this.shipmentStageTwoForm.controls['confoOthers'].value;
        blModel.confoIsPaymentDone = this.shipmentStageTwoForm.controls['confoIsPaymentDone'].value;
        blModel.confoPaymentDate = this.shipmentStageTwoForm.controls['confoPaymentDate'].value;
        blModel.purchaseExecutionId = this.purchaseExecutionId;
        this.BillingDashboardService.UpsertBL(blModel).subscribe((result: any) => {
            if (result.success) {
                this.purchaseShipmentBLId = result.data;
                this.isToUploadFiles = true;
                this.isToUploadConfirmFiles = true;
                if (!this.isFileExist) {
                    this.onNoClick();
                    this.clearForm();
                }
                if (!this.isConfirmFileExist) {
                    this.onNoClick();
                    this.clearForm();
                }
                this.isInProgress = false;
                this.toastr.success("", "Bill of Entry Details saved successfully");
            } else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    clearForm() {
        this.shipmentStageTwoForm = new FormGroup({
            chaId: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            isDocumentsSent: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            ),
            sentDate: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            ),
            draftEntryDate: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            ),
            draftBLNumber: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftBLDescription: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftBasicCustomsDuty: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftSWC: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftIGST: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftEduCess: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftOthers: new FormControl(null,
                Validators.compose([
                ])
            ),
            draftTotal: new FormControl(null,
                Validators.compose([
                ])
            ),
            isConfirmedBill: new FormControl(null,
                Validators.compose([
                ])
            ),
            confirmationDate: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoEntryDate: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoBLNumber: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoBLDescription: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoBasicCustomsDuty: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoSWC: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoIGST: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoEduCess: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoOthers: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoTotal: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoIsPaymentDone: new FormControl(null,
                Validators.compose([
                ])
            ),
            confoPaymentDate: new FormControl(null,
                Validators.compose([
                ])
            ),
        })
    }

    onNoClick() {
        this.dialogRef.close();
    }

    draftTotal() {
        if (this.shipmentStageTwoForm.controls['draftSWC'].value
            && this.shipmentStageTwoForm.controls['draftIGST'].value
            && this.shipmentStageTwoForm.controls['draftEduCess'].value
            && this.shipmentStageTwoForm.controls['draftOthers'].value)
            this.shipmentStageTwoForm.controls['draftTotal'].setValue(parseInt(this.shipmentStageTwoForm.controls['draftSWC'].value)
                + parseInt(this.shipmentStageTwoForm.controls['draftIGST'].value)
                + parseInt(this.shipmentStageTwoForm.controls['draftEduCess'].value)
                + parseInt(this.shipmentStageTwoForm.controls['draftOthers'].value));
    }

    confoTotal() {
        if (this.shipmentStageTwoForm.controls['confoSWC'].value
            && this.shipmentStageTwoForm.controls['confoIGST'].value
            && this.shipmentStageTwoForm.controls['confoEduCess'].value
            && this.shipmentStageTwoForm.controls['confoOthers'].value)
            this.shipmentStageTwoForm.controls['confoTotal'].setValue(parseInt(this.shipmentStageTwoForm.controls['confoSWC'].value)
                + parseInt(this.shipmentStageTwoForm.controls['confoIGST'].value)
                + parseInt(this.shipmentStageTwoForm.controls['confoEduCess'].value)
                + parseInt(this.shipmentStageTwoForm.controls['confoOthers'].value));
    }

    openMailPopUp(event) {
        if (event) {
            this.mailOpen();
        }
    }

    mailOpen() {
        if (this.rowData && this.rowData.chaId) {
            var index = this.clientData.findIndex((x) => (x.clientId.toLowerCase() == this.rowData.chaId.toLowerCase()));
            if (index > -1) {
                this.rowData['chaName'] = this.clientData[index].fullName;
                this.rowData['chaEmail'] = this.clientData[index].email;
            }
            const dialogRef = this.dialog.open(ChaConfirmationMail, {
                maxWidth: "80vw",
                width: "75%",
                disableClose: true,
                data: { rowData: this.rowData }
            });
            dialogRef.afterClosed().subscribe((success: any) => {

            });
        }
        else {
            this.toastr.warning("", "CHA is not assigned for sending confirmation email please assign CHA");
        }

    }
}