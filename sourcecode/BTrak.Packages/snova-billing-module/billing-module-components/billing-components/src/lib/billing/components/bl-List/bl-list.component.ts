import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChildren } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { BLModel } from "../../models/bl-model";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ContractModel } from "../../models/contract.model";
import { GradeModel } from "../../models/grade.model";
import { PaymentTermModel, ShipmentBLModel } from "../../models/payment-term.model";
import { ProductTableModel } from "../../models/product-table.model";
import { ShipmentExecutionModel } from "../../models/shipment-execution.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
export interface DialogData {
    rowData: any; type: any;
}

@Component({
    selector: "app-billing-component-bl",
    templateUrl: "bl-list.component.html"
})
export class BlListComponent extends AppBaseComponent implements OnInit {
    @ViewChildren('deleteStepPopover') deleteStepsPopover;
    @ViewChildren("testSuiteFileUploadPopup") testSuiteFileUploadPopup;
    @ViewChildren("documentPopover") documentPopover;
    @Output() closePreview = new EventEmitter<any>();
    id: string;
    docsData: any;
    blForm: FormGroup;
    consigneeList: any;
    textShow: boolean = true;
    exploratoryShow: boolean = false;
    stepsShow: boolean = false;
    consignerList: any;
    isInProgress: boolean;
    blEdit: boolean = false;
    rowData: any;
    moduleTypeId: number = 6;
    isButtonVisible: boolean = true;
    referenceTypeId: string;
    referenceId: string;
    finalreferenceId: string;
    intialreferenceId: string;
    FinalReferenceTypeId = ConstantVariables.FinalDocumentTypeBlId;
    IntialReferenceTypeId = ConstantVariables.IntialDocumentTypeBlId;
    timeStamp: any;
    selectedStoreId: null;
    removableIndex: number;
    blSteps: FormArray;
    shipmentBlId: any;
    showStepsCard: boolean;
    fileUploadPopover: boolean;
    purchaseShipmentId: string;
    purchaseShipmentBlId: string;
    purchaseShipmentBLId: string;
    purchaseExecutionId: string;
    temp: any;
    DocTpe: any;
    isDoc: boolean;
    selectedChaUserId: any;
    documentText: string;
    clientData: any;
    shareDocumentsLoading: boolean;
    visible: boolean;
    documents: any;
    constructor(private BillingDashboardService: BillingDashboardService, private formBuilder: FormBuilder, private router: Router,
        private translateService: TranslateService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService, public dialogRef: MatDialogRef<BlListComponent>,
        private cdRef: ChangeDetectorRef) {
        super();
        this.clearForm();
        if (this.data.type == "final" || this.data.type == "initial") {
            this.DocTpe = this.data.type;
            this.isDoc = true;
            this.rowData = this.data.rowData;
            this.purchaseShipmentId = this.rowData.purchaseShipmentId;
            this.purchaseShipmentBlId = this.rowData.shipmentBLId;
            this.getClients();
            this.GetBlDescriptions();

        }
        else {
            this.isDoc = false;

            var temp = this.router.url.split("/");
            this.purchaseExecutionId = temp[4];
            if (this.data.rowData == null) {
                this.blEdit = false;

            }
            else {
                this.blEdit = true;
                this.rowData = this.data.rowData;
                this.blForm.patchValue(this.rowData);
                this.timeStamp = this.rowData.timeStamp;
                this.purchaseShipmentId = this.rowData.purchaseShipmentId;
                this.purchaseShipmentBlId = this.rowData.shipmentBLId;
                this.getShipmentBlById();
            }

        }
    }
    ngOnInit() {
        super.ngOnInit();
        this.getAllConsigners();
        this.getAllConsignees();

    }
    getShipmentBlById() {
        let bldet = new ShipmentBLModel();
        bldet.isArchived = false;
        bldet.purchaseShipmentBLId = this.purchaseShipmentBlId;
        bldet.purchaseShipmentId = this.purchaseShipmentId;
        this.BillingDashboardService.GetShipmentExecutionBLById(bldet)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    // this.temp = responseData.data;
                }

            })
    }
    GetBlDescriptions() {
        let bldet = new ShipmentExecutionModel();
        bldet.isArchived = false;
        bldet.PurchaseShipmentBLId = this.purchaseShipmentBlId;
        bldet.purchaseShipmentId = this.purchaseShipmentId;
        this.BillingDashboardService.GetBlDescriptions(bldet)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.documents=responseData.data;
                    this.intialFormDocument();
                    if (this.DocTpe == 'initial') {
                        if (responseData.data.initialDocumentsDescriptions) {
                            this.visible = true;
                        } else {
                            this.visible = false;
                        }

                    } else if (this.DocTpe == 'final') {
                        if (responseData.data.finalDocumentsDescriptions) {
                            this.visible = true;
                        } else {
                            this.visible = false;
                        }
                    }
                }

            })
    }
    getDocs() {

        let bldet = new ShipmentExecutionModel();
        bldet.isArchived = false;
        bldet.PurchaseShipmentBLId = this.purchaseShipmentBlId;
        bldet.purchaseShipmentId = this.purchaseShipmentId;
        this.BillingDashboardService.GetBlDescriptions(bldet)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    let caseData;
                    this.documents=responseData.data;
                    if (this.DocTpe == 'final') {
                        caseData = responseData.data.finalDocumentsDescriptions;
                        this.docsData = responseData.data.finalDocumentsDescriptions;

                    }
                    else {
                        caseData = responseData.data.initialDocumentsDescriptions;
                        this.docsData = responseData.data.initialDocumentsDescriptions;
                    }
                    if (this.DocTpe == 'initial') {
                        if (responseData.data.initialDocumentsDescriptions) {
                            this.visible = true;
                        } else {
                            this.visible = false;
                        }

                    } else if (this.DocTpe == 'final') {
                        if (responseData.data.finalDocumentsDescriptions) {
                            this.visible = true;
                        } else {
                            this.visible = false;
                        }
                    }
                    if (caseData) {
                        this.blSteps = this.blForm.get('blSteps') as FormArray;
                        if (this.blSteps.controls.length != 0) {
                            caseData.forEach((x, i) => {
                                this.blSteps.at(i).patchValue({
                                    id: x.id
                                });
                            });
                        }
                    }
                }
            })
    }
    intialFormDocument() {
        var DocumentsDescriptions;
        if (this.DocTpe == 'final') {
            DocumentsDescriptions = this.temp.finalDocumentsDescriptions;
            this.docsData = DocumentsDescriptions;
        }
        else {
            DocumentsDescriptions = this.temp.initialDocumentsDescriptions;
            this.docsData = DocumentsDescriptions;
        }
        if (DocumentsDescriptions) {
            this.blSteps = this.blForm.get('blSteps') as FormArray;
            DocumentsDescriptions.forEach(x => {
                this.blSteps.push(this.formBuilder.group({
                    id: x.id,
                    description: x.description,
                    stepTextFilePath: x.stepTextFilePath,
                    stepExpectedResult: x.stepExpectedResult,
                    stepExpectedResultFilePath: x.stepExpectedResultFilePath,
                    stepActualResult: x.stepActualResult,
                    stepStatusId: x.stepStatusId,
                    stepCreated: 0
                }))
            })
            this.visible = true;
        }
    }
    clearForm() {
        this.blForm = new FormGroup({
            blNumber: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            shipmentBLId: new FormControl(null, null),
            consignerId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            consigneeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            blQuantity: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(9999999999)
                ])
            ),

            notifyParty: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            packingDetails: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            blDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            description: new FormControl(null, null),
            id: new FormControl(null, null),
            blSteps: this.formBuilder.array([]),
            steps: new FormControl(null, []),
            stepsFilePath: new FormControl(null, []),
        })
    }
    openDocumentPopup(popUp) {

        this.selectedChaUserId = this.rowData.chaId;
        if (this.DocTpe == 'final') {
            this.documentText = "Assign CHA and share final documents to CHA"
        }
        else {

            this.documentText = "Assign CHA and share intial documents to CHA"

        }
        popUp.openPopover();
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
    upsertBlSuppllier() {
        this.isInProgress = true;
        let shipModel = new ShipmentExecutionModel();
        shipModel = this.blForm.value;
        shipModel.timeStamp = this.timeStamp;
        shipModel.purchaseShipmentId = this.purchaseShipmentId;
        shipModel.purchaseExecutionId = this.purchaseExecutionId;
        if (this.blEdit == true) {
            shipModel.ShipmentBLId = this.purchaseShipmentBlId;
        }
        shipModel.ConfoEntryDate = null;
        this.BillingDashboardService.UpsertShipmentExecutionBL(shipModel).subscribe((result: any) => {
            if (result.success) {
                this.purchaseShipmentBlId = result.data;
                this.isInProgress = false;
                // this.dialogRef.close();
                this.onNoClick();
                this.clearForm();

            } else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }
    getAllConsignees() {
        let consignee = new PaymentTermModel();


        this.BillingDashboardService.GetAllConsignees(consignee)
            .subscribe((responseData: any) => {
                this.consigneeList = responseData.data;
                this.cdRef.detectChanges();
            });
    }

    getAllConsigners() {
        let consignee = new PaymentTermModel();


        this.BillingDashboardService.GetAllConsigners(consignee)
            .subscribe((responseData: any) => {
                this.consignerList = responseData.data;
                this.cdRef.detectChanges();
            });
    }
    closeDeleteStepDialog() {
        this.deleteStepsPopover.forEach((p) => p.closePopover());
    }
    removeItemAtIndex() {
        this.blSteps.removeAt(this.removableIndex);
        this.addNewTestCaseStep();
        this.closeDeleteStepDialog();
    }

    onNoClick() {
        this.dialogRef.close();
    }
    upsertBl() {

    }
    addNewTestCaseStep() {

    }

    getStepControls() {
        return (this.blForm.get('blSteps') as FormArray).controls;
    }

    getControlsLength() {
        this.addItem((this.blForm.get('blSteps') as FormArray).length - 1);
    }

    validateStepsLength() {
        let length = (this.blForm.get('blSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }
    addItem(index): void {

        this.blSteps = this.blForm.get('blSteps') as FormArray;
        this.blSteps.insert(index + 1, this.createItem());
        this.upsertBlDoc()

    }
    showSteps() {
        this.showStepsCard = true;
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            id: '',
            description: '',
            stepExpectedResult: '',
            stepActualResult: '',
            stepStatusId: '',
            orderNumber: 0,
            stepCreated: 1
        });
    }

    openFileUploadPopover(id, i, testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        var sa = this.blSteps;
        // sa = sa.value[i].id;
        if (this.DocTpe == 'final') {
            this.referenceTypeId = this.FinalReferenceTypeId;
        }
        else {
            this.referenceTypeId = this.IntialReferenceTypeId;
        }
        this.referenceId = sa.value[i].id;
    }
    closeTestSuitePopup() {
        this.testSuiteFileUploadPopup.forEach((p) => p.closePopover());
        this.referenceTypeId = null
        this.referenceId = null;
        this.fileUploadPopover = false;
    }

    removeItem(index, deleteStepPopover) {

        this.removableIndex = index;
        deleteStepPopover.openPopover();

    }
    openStepDescriptionPopover(event, id) {

    }
    upsertBlDoc() {
        this.isInProgress = true;
        let shipModel = new ShipmentExecutionModel();
        shipModel = this.blForm.value;

        shipModel.PurchaseExecutionId = this.purchaseExecutionId;
        shipModel.ShipmentBLId = this.purchaseShipmentBlId;
        shipModel.ConfoEntryDate = null;
        if (shipModel.blSteps.length > 0) {
            shipModel.blSteps.forEach((x, i) => {
                x.orderNumber = i + 1;
            });
        }
        if (this.DocTpe == 'final') {
            shipModel.FinalDocumentsDescription = shipModel.blSteps;
            shipModel.InitialDocumentsDescription = this.documents.initialDocumentsDescriptions;
        }
        else {
            shipModel.InitialDocumentsDescription = shipModel.blSteps;
            shipModel.FinalDocumentsDescription = this.documents.finalDocumentsDescriptions;
        }
        this.BillingDashboardService.UpsertBlDescription(shipModel).subscribe((result: any) => {
            if (result.success) {
                // this.purchaseShipmentBlId = result.data;
                this.isInProgress = false;
                // this.visible = true;
                this.getDocs();
            } else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }
    employeeSelection(event) {
        this.selectedChaUserId = event.value;
    }

    shareDocuments(dataItem) {
        var blModel = new BLModel();
        blModel = this.rowData;
        if (this.DocTpe == 'final') {
            blModel.isInitialDocumentsMail = false;
        }
        else {
            blModel.isInitialDocumentsMail = true;
        }
        blModel.chaId = this.selectedChaUserId;
        this.shareDocumentsLoading = true;
        this.BillingDashboardService.UpsertBL(blModel).subscribe((result: any) => {
            if (result.success) {
                this.purchaseShipmentBLId = result.data;
                this.shareDocumentsLoading = false;
                if (this.DocTpe == 'final') {
                    this.toastr.success("", "Final Documents Shared successfully");
                }
                else {
                    this.toastr.success("", "Intial Documents Shared successfully");
                }

            } else {
                this.shareDocumentsLoading = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }
    closeSendEmailPopover() {
        this.documentPopover.forEach((p) => p.closePopover());
        this.selectedChaUserId = null;
    }
    check(e) {
        this.clearForm()
        if (e.value == "final") {
            this.DocTpe = 'final'
            this.GetBlDescriptions();
        }
        else if (e.value == "initial") {
            this.DocTpe = 'initial'
            this.GetBlDescriptions();
        }
        else {
            this.visible = null;
        }
    }

}