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
    selector: "app-documents-description-component",
    templateUrl: "documents-description.component.html"
})
export class DocumentsDescriptionComponent extends AppBaseComponent implements OnInit {
    @ViewChildren('deleteDescriptionPopover') deleteDescriptionPopover;
    @ViewChildren("testSuiteFileUploadPopup") testSuiteFileUploadPopup;
    @ViewChildren("documentPopover") documentPopover;
    @Output() closePreview = new EventEmitter<any>();
    id: string;
    docsData: any;
    descriptionForm: FormGroup;
    consigneeList: any;
    textShow: boolean = true;
    exploratoryShow: boolean = false;
    stepsShow: boolean = false;
    isInProgress: boolean;
    rowData: any;
    moduleTypeId: number = 6;
    isButtonVisible: boolean = true;
    referenceTypeId: string;
    referenceId: string;
    IntialReferenceTypeId = ConstantVariables.IntialDocumentTypeBlId;
    selectedStoreId: null;
    removableIndex: number;
    descriptions: FormArray;
    showDescriptionsCard: boolean;
    fileUploadPopover: boolean;
    temp: any;
    documentText: string;
    clientData: any;
    documents: any;
    constructor(private BillingDashboardService: BillingDashboardService, private formBuilder: FormBuilder, private router: Router,
        private translateService: TranslateService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService, public dialogRef: MatDialogRef<DocumentsDescriptionComponent>,
        private cdRef: ChangeDetectorRef) {
        super();
        this.clearForm();
            this.rowData = this.data.rowData;
            this.GetDocumentsDescriptions();
    }
    ngOnInit() {
        super.ngOnInit();

    }
    GetDocumentsDescriptions() {
        this.BillingDashboardService.GetDocumentsDescriptions(this.rowData.addressId)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.documents=responseData.data;
                    this.intialFormDocument();
            }})
    }
    getDocs() {
        this.BillingDashboardService.GetDocumentsDescriptions(this.rowData.addressId)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    let caseData;
                    this.documents=responseData.data;
                        caseData = responseData.data.initialDocumentsDescriptions;
                        this.docsData = responseData.data.initialDocumentsDescriptions;
                    if (caseData) {
                        this.descriptions = this.descriptionForm.get('descriptions') as FormArray;
                        if (this.descriptions.controls.length != 0) {
                            caseData.forEach((x, i) => {
                                this.descriptions.at(i).patchValue({
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
            DocumentsDescriptions = this.temp.initialDocumentsDescriptions;
            this.docsData = DocumentsDescriptions;
        if (DocumentsDescriptions) {
            this.descriptions = this.descriptionForm.get('descriptions') as FormArray;
            DocumentsDescriptions.forEach(x => {
                this.descriptions.push(this.formBuilder.group({
                    id: x.id,
                    description: x.description
                }))
            })
        }
    }
    clearForm() {
        this.descriptionForm = new FormGroup({
            description: new FormControl(null, null),
            id: new FormControl(null, null),
            descriptions: this.formBuilder.array([]),
        })
    }
    closeDeleteDescriptionDialog() {
        this.deleteDescriptionPopover.forEach((p) => p.closePopover());
    }
    removeItemAtIndex() {
        this.descriptions.removeAt(this.removableIndex);
        this.closeDeleteDescriptionDialog();
    }

    onNoClick() {
        this.dialogRef.close();
    }

    getDescriptionControls() {
        return (this.descriptionForm.get('descriptions') as FormArray).controls;
    }

    getControlsLength() {
        this.addItem((this.descriptionForm.get('descriptions') as FormArray).length - 1);
    }

    validateDescriptionsLength() {
        let length = (this.descriptionForm.get('descriptions') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }
    addItem(index): void {

        this.descriptions = this.descriptionForm.get('descriptions') as FormArray;
        this.descriptions.insert(index + 1, this.createItem());
        this.upsertDocumentsDescription()

    }
    showDescriptions() {
        this.showDescriptionsCard = true;
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            id: '',
            description: '',
            orderNumber: 0
        });
    }

    openFileUploadPopover(id, i, testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        var sa = this.descriptions;
            this.referenceTypeId = this.IntialReferenceTypeId;
        this.referenceId = sa.value[i].id;
    }
    closeTestSuitePopup() {
        this.testSuiteFileUploadPopup.forEach((p) => p.closePopover());
        this.referenceTypeId = null
        this.referenceId = null;
        this.fileUploadPopover = false;
    }

    removeDescription(index, deleteDescriptionPopover) {
        this.removableIndex = index;
        deleteDescriptionPopover.openPopover();

    }
    upsertDocumentsDescription() {
        this.isInProgress = true;
        let shipModel = new ShipmentExecutionModel();
        shipModel = this.descriptionForm.value;
        shipModel.ShipmentBLId=this.rowData.addressId;
        if (shipModel.descriptions.length > 0) {
            shipModel.descriptions.forEach((x, i) => {
                x.orderNumber = i + 1;
            });
        }
            shipModel.InitialDocumentsDescription = shipModel.descriptions;
        this.BillingDashboardService.UpsertDocumentsDescription(shipModel).subscribe((result: any) => {
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
}