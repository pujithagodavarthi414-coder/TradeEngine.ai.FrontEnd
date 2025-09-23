import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ContractModel } from "../../models/contract.model";
import { GradeModel } from "../../models/grade.model";
import { ProductTableModel } from "../../models/product-table.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { AppBaseComponent } from "../componentbase";
export interface DialogData {
    rowData: any;
    isEdit: boolean;
}

@Component({
    selector: "app-billing-component-purchase-contract",
    templateUrl: "purchase-contract-popup.component.html"
})

export class PurchaseContractComponentPopup extends AppBaseComponent implements OnInit {
    contractForm: FormGroup;
    gradeList: GradeModel[] = [];
    productList: any;
    clientData: any = null;
    isInProgress: boolean = false;
    rowData: any;
    contractEdit: boolean = false;
    timeStamp: any;
    contractId: string;
    getFilesByReferenceId:boolean = true;
    moduleTypeId = 17;
    isToUploadFiles: boolean = false;
    selectedParentFolderId: null;
    selectedStoreId: null;
    isFileExist: boolean;
    referenceTypeId = ConstantVariables.MasterContractReferenceTypeId;
    softLabels: SoftLabelConfigurationModel[];
    projectLabel: string;
    filteredGradeList: GradeModel[] = [];

    constructor(private BillingDashboardService: BillingDashboardService,
        private translateService: TranslateService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService, public dialogRef: MatDialogRef<PurchaseContractComponentPopup>,
        private cdRef: ChangeDetectorRef) {
        super();
        this.clearForm();
        this.rowData = this.data.rowData;
        if (this.data.isEdit) {
            this.contractEdit = true;
        }
        if (!this.data.rowData) {
            this.contractForm.controls['clientId'].setValue(this.rowData.clientId);
        }
        else {
            this.contractForm.patchValue(this.rowData);
            this.contractForm.controls['clientId'].setValue(this.rowData.clientId);
            this.timeStamp = this.rowData.timeStamp;
            this.contractId = this.rowData.contractId;
        }

    }
    ngOnInit() {
        super.ngOnInit();
        this.getAllGrades();
        this.getClients();
        this.getAllProducts();
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
          this.projectLabel = this.softLabels[0].projectLabel;
          this.cdRef.markForCheck();
        }
      }

    filesExist(event) {
        this.isFileExist = event;
    }

    getAllGrades() {
        let grade = new GradeModel();
        grade.isArchived = false;
        this.BillingDashboardService.getAllGrades(grade)
            .subscribe((responseData: any) => {
                this.gradeList = responseData.data;
                this.getRelatedGrades(this.contractForm.controls['productId'].value);
            });
    }
    getAllProducts() {
        let product = new ProductTableModel();
        product.isArchived = false;
        this.BillingDashboardService.getProducts(product)
            .subscribe((responseData: any) => {
                this.productList = responseData.data;
            });
    }

    getClients() {
        let clientSearchInputModel = new ClientSearchInputModel();
        clientSearchInputModel.isArchived = false;
        clientSearchInputModel.clientType = 'Supplier';
        this.BillingDashboardService.getClients(clientSearchInputModel)
            .subscribe((responseData: any) => {
                this.clientData = responseData.data;
            })
    }

    clearForm() {
        this.contractForm = new FormGroup({
            contractNumber: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            clientId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            productId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            gradeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            rateOrTon: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(9999999999)
                ])
            ),
            contractQuantity: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(9999999999)
                ])
            ),
            description: new FormControl('',
                Validators.compose([
                    Validators.maxLength(150)
                ])
            ),
            usedQuantity: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            remaningQuantity: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractDateFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            contractDateTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    upsertContract() {
        this.isInProgress = true;
        let contractModel = new ContractModel();
        contractModel = this.contractForm.value;
        contractModel.timeStamp = this.timeStamp;
        contractModel.contractId = this.contractId;
        if(!this.contractId) {
            contractModel.usedQuantity = 0;
        }
        else {
            contractModel.usedQuantity = this.contractForm.controls['usedQuantity'].value;
        }
        contractModel.remaningQuantity = this.contractForm.controls['remaningQuantity'].value;
        this.BillingDashboardService.upertPurchaseContract(contractModel).subscribe((result: any) => {
            if (result.success) {
                this.contractId = result.data;
                this.isInProgress = false;
                this.isToUploadFiles = true;
                if (!this.isFileExist) {
                    // this.dialogRef.close();
                    this.onNoClick();
                    this.clearForm();
                }
            } else{
                this.isInProgress = false;
                this.toastr.error("",result.apiResponseMessages[0].message);
            }
        });
    }

    onNoClick() {
        this.dialogRef.close();
    }

    onKey(event) {
        if(!this.contractId)
        this.contractForm.controls['remaningQuantity'].setValue(this.contractForm.controls['contractQuantity'].value);
    }

    numberOnlyWithVal(event, value) {

        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
    
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          if (charCode == 46 && value.toString().includes(".") == false) {
            return true;
          }
          return false;
        }
    
        return true;
    
      }

      getRelatedGrades(productId) {
        this.filteredGradeList = [];
        this.gradeList.forEach((x) => {
            if (x.productId == productId) {
                this.filteredGradeList.push(x);
            }
        })
}
}