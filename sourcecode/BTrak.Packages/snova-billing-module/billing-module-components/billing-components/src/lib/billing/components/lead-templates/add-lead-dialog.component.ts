import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { CountryModel } from "../../models/country-model";
import { EmployeeListModel } from "../../models/employee-list-model";
import { GradeModel } from "../../models/grade.model";
import { LeadContractModel } from "../../models/lead-contract.mdel";
import { PaymentTermModel } from "../../models/payment-term.model";
import { ProductTableModel } from "../../models/product-table.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { ClientOutPutModel } from "../../models/client-model";
import { ContractModel } from "../../models/contract.model";

export interface DialogData {
    rowData: any;
    isForPreview: boolean;
}
@Component({
    selector: "app-billing-component-addlead",
    templateUrl: "add-lead-dialog.component.html"
})

export class AddLeadDialogComponent {

    leadContractForm: FormGroup;
    gradeList: GradeModel[] = [];
    productList: any;
    clientData: any = null;
    statusList: any;
    isInProgress: boolean = false;
    contractEdit: boolean = false;
    countryList: any;
    rowData: any;
    timeStamp: any;
    contractId: string;
    paymentList: PaymentTermModel[] = [];
    portDetailList: PaymentTermModel[] = [];
    clientId: string;
    employeesList: any;
    id: string;
    leadFormId: string;
    contractTypes: any = [
        {
            contractName: 'Contract', value: 'contract'
        },
        {
            contractName: 'Non Contract', value: 'nonContract'
        }
    ];
    contractTypeValue: string = 'contract';
    contractList: any[] = [];
    isExceptionApproval: string;
    filteredGradeList: GradeModel[] = [];

    constructor(private BillingDashboardService: BillingDashboardService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private toastr: ToastrService,
        public dialogRef: MatDialogRef<AddLeadDialogComponent>,) {
        this.clearForm();
        this.rowData = this.data.rowData;
        if (this.data.isForPreview) {
            this.leadContractForm.disable();
        }
        if (!this.data.rowData) {
            this.contractEdit = false;
        }
        else {
            if (this.rowData.clientTypeName == 'Buyer') {
                this.contractTypeValue = 'nonContract';
                this.contractTypeChange(this.contractTypeValue);
            }

            this.leadContractForm.patchValue(this.rowData);
            this.leadContractForm.controls["invoiceNumber"].setValue(this.rowData.performaInvoiceNumber);
            this.leadContractForm.controls["buyerId"].setValue(this.rowData.buyerId);
            this.leadContractForm.controls["shipToAddress"].setValue(this.rowData.shipToAddress);
            this.leadContractForm.controls["gstNumber"].setValue(this.rowData.gstNumber);
            if (this.rowData.rateOrTon)
                this.leadContractForm.controls["rateGst"].setValue(this.rowData.rateOrTon);
            if (this.rowData.rateGST)
                this.leadContractForm.controls["rateGst"].setValue(this.rowData.rateGST);
            this.timeStamp = this.rowData.timeStamp;
            this.contractId = this.rowData.contractId;
            this.clientId = this.rowData.buyerId;
            this.id = this.rowData.id;
            if (!this.contractId && this.id) {
                this.contractTypeValue = 'nonContract';
                this.contractTypeChange(this.contractTypeValue);
            }
            this.leadFormId = this.rowData.id;
            if (this.rowData.exceptionApprovalRequired) {
                this.leadContractForm.controls["exceptionApprovalRequired"].setValue("true");
            }
            else if (this.rowData.kycCompleted) {
                this.leadContractForm.controls["exceptionApprovalRequired"].setValue("false");
            }
            else {
                this.leadContractForm.controls["exceptionApprovalRequired"].setValue("true");
            }
            this.onKey(null);
            this.calculateNet(null);
        }
    }

    ngOnInit() {
        this.getAllGrades();
        this.getClients();
        this.getAllProducts();
        this.getCountries();
        this.getAllPaymentTerms();
        this.getAllPortDetails();
        this.getStatus();
        this.getEmployeesLists();
        this.getContracts();
    }

    getContracts() {
        let contractModel = new ContractModel();
        contractModel.isArchived = false;
        this.BillingDashboardService.getContractList(contractModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.contractList = responseData.data;
                }
            });
    }

    getEmployeesLists() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.sortDirectionAsc = true;
        employeeListSearchResult.isArchived = false;
        employeeListSearchResult.isActive = true;
        this.BillingDashboardService.getAllEmployees(employeeListSearchResult).subscribe((responseData: any) => {
            this.employeesList = responseData.data;
        })
    }

    getAllPaymentTerms() {
        let paymentTerm = new PaymentTermModel();
        paymentTerm.isArchived = false;
        this.BillingDashboardService.getAllPaymentTerms(paymentTerm)
            .subscribe((responseData: any) => {
                this.paymentList = responseData.data;
            });
    }

    getAllPortDetails() {
        let portDetail = new PaymentTermModel();
        portDetail.isArchived = false;
        this.BillingDashboardService.GetAllPortDetails(portDetail)
            .subscribe((responseData: any) => {
                this.portDetailList = responseData.data;
            });
    }

    getAllGrades() {
        let grade = new GradeModel();
        grade.isArchived = false;
        this.BillingDashboardService.getAllGrades(grade)
            .subscribe((responseData: any) => {
                this.gradeList = responseData.data;
                this.getRelatedGrades(this.leadContractForm.controls['productId'].value);
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
        clientSearchInputModel.clientType = 'Buyer';
        this.BillingDashboardService.getClients(clientSearchInputModel)
            .subscribe((responseData: any) => {
                this.clientData = responseData.data;
            })
    }

    getCountries() {
        let countryModel = new CountryModel();
        countryModel.isArchived = false;
        this.BillingDashboardService.getCountries(countryModel)
            .subscribe((responseData: any) => {
                this.countryList = responseData.data;
            })
    }

    getStatus() {
        let paymentTermModel = new PaymentTermModel();
        paymentTermModel.isArchived = false;
        this.BillingDashboardService.getLeadStatus(paymentTermModel)
            .subscribe((responseData: any) => {
                this.statusList = responseData.data;
            })
    }

    upsertLeadContract() {
        this.isInProgress = true;
        let contractModel = new LeadContractModel();
        contractModel = this.leadContractForm.value;
        contractModel.timeStamp = this.timeStamp;
        contractModel.contractId = this.contractId;
        contractModel.clientId = this.clientId;
        contractModel.exceptionApprovalRequired = contractModel.exceptionApprovalRequired == "true" ? true : false;
        contractModel.id = this.id;
        contractModel.rateGst = this.leadContractForm.controls['rateGst'].value;
        contractModel.remaningQuantity = this.leadContractForm.controls['remaningQuantity'].value;
        if (this.contractTypeValue == "contract") {
            if (parseInt(contractModel.quantityInMT) > contractModel.remaningQuantity) {
                this.toastr.error("", "Please enter quantity below or equal to the contract remaining quantity");
                this.isInProgress = false;
                return;
            }
        }
        this.BillingDashboardService.upertLeadContract(contractModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                this.leadFormId = result.data;
                this.onNoClick();
                this.toastr.success("", "Lead added successfully");
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    upsertSco() {
        this.isInProgress = true;
        var scoLeadModel = new ClientOutPutModel();
        scoLeadModel.clientId = this.rowData.buyerId;
        scoLeadModel.email = this.rowData.buyerEmail;
        scoLeadModel.firstName = this.rowData.buyerName;
        scoLeadModel.mobileNo = this.rowData.mobileNo;
        scoLeadModel.countryCode = this.rowData.countryCode;
        scoLeadModel.leadFormId = this.leadFormId;
        this.BillingDashboardService.upsertSCO(scoLeadModel).subscribe((response: any) => {
            this.isInProgress = false;
            if (response.success) {

            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    onKey(event) {
        if (this.leadContractForm.controls['quantityInMT'].value && this.leadContractForm.controls['rateGst'].value)
            this.leadContractForm.controls['totalAmount'].setValue(this.leadContractForm.controls['quantityInMT'].value * this.leadContractForm.controls['rateGst'].value);
    }

    calculateNet(event) {
        if (this.leadContractForm.controls['quantityInMT'].value && this.leadContractForm.controls['drums'].value)
            this.leadContractForm.controls['netWeightApprox'].setValue(this.leadContractForm.controls['quantityInMT'].value / this.leadContractForm.controls['drums'].value);
    }

    clearForm() {
        this.leadContractForm = new FormGroup({
            contractNumber: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            buyerId: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractDateFrom: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractDateTo: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractQuantity: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            remaningQuantity: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            rateOrTon: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            uniqueLeadId: new FormControl(null,
                Validators.compose([
                ])
            ),
            salesPersonId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            contractTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            contractId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            leadDate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            shipToAddress: new FormControl({ value: '', disabled: true }, [Validators.required]
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
            quantityInMT: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            rateGst: new FormControl(null, Validators.compose([
                Validators.required
            ])
            ),
            totalAmount: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            paymentTypeId: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            gstNumber: new FormControl({ value: '', disabled: true }
            ),
            vehicleNumberOfTransporter: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            mobileNumberOfTruckDriver: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            drums: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            netWeightApprox: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            portId: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            blNumber: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            availableCreditLimit: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            kycCompleted: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            exceptionApprovalRequired: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            shipmentMonth: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            countryOriginId: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            termsOfDelivery: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            customPoint: new FormControl(null,
                Validators.compose([
                    //Validators.required
                ])
            ),
            invoiceNumber: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            deliveryNote: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            suppliersRef: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    onNoClick() {
        this.dialogRef.close();
    }

    contractTypeChange(value) {
        if (value == "contract") {
            this.leadContractForm.controls["contractNumber"].setValidators([Validators.required]);
            this.leadContractForm.get("contractNumber").updateValueAndValidity();
            this.leadContractForm.controls["buyerId"].setValidators([Validators.required]);
            this.leadContractForm.get("buyerId").updateValueAndValidity();
            this.leadContractForm.controls["contractDateFrom"].setValidators([Validators.required]);
            this.leadContractForm.get("contractDateFrom").updateValueAndValidity();
            this.leadContractForm.controls["contractDateTo"].setValidators([Validators.required]);
            this.leadContractForm.get("contractDateTo").updateValueAndValidity();
            this.leadContractForm.controls["contractDateTo"].setValidators([Validators.required]);
            this.leadContractForm.get("contractDateTo").updateValueAndValidity();
            this.leadContractForm.controls["contractQuantity"].setValidators([Validators.required]);
            this.leadContractForm.get("contractQuantity").updateValueAndValidity();
            this.leadContractForm.controls["remaningQuantity"].setValidators([Validators.required]);
            this.leadContractForm.get("remaningQuantity").updateValueAndValidity();
            this.leadContractForm.controls["rateOrTon"].setValidators([Validators.required]);
            this.leadContractForm.get("rateOrTon").updateValueAndValidity();
            this.leadContractForm.controls["contractId"].setValidators([Validators.required]);
            this.leadContractForm.get("contractId").updateValueAndValidity();
            this.leadContractForm.controls["rateGst"].setValidators([Validators.required]);
            this.leadContractForm.get("rateGst").updateValueAndValidity();
        }
        else {
            this.leadContractForm.controls["contractNumber"].clearValidators();
            this.leadContractForm.get("contractNumber").updateValueAndValidity();
            this.leadContractForm.controls["buyerId"].clearValidators();
            this.leadContractForm.get("buyerId").updateValueAndValidity();
            this.leadContractForm.controls["contractDateFrom"].clearValidators();
            this.leadContractForm.get("contractDateFrom").updateValueAndValidity();
            this.leadContractForm.controls["contractDateTo"].clearValidators();
            this.leadContractForm.get("contractDateTo").updateValueAndValidity();
            this.leadContractForm.controls["contractDateTo"].clearValidators();
            this.leadContractForm.get("contractDateTo").updateValueAndValidity();
            this.leadContractForm.controls["contractQuantity"].clearValidators();
            this.leadContractForm.get("contractQuantity").updateValueAndValidity();
            this.leadContractForm.controls["remaningQuantity"].clearValidators();
            this.leadContractForm.get("remaningQuantity").updateValueAndValidity();
            this.leadContractForm.controls["rateOrTon"].clearValidators();
            this.leadContractForm.get("rateOrTon").updateValueAndValidity();
            this.leadContractForm.controls["contractId"].clearValidators();
            this.leadContractForm.get("contractId").updateValueAndValidity();
            this.leadContractForm.controls["rateGst"].clearValidators();
            this.leadContractForm.get("rateGst").updateValueAndValidity();
            this.leadContractForm.controls["contractDateFrom"].setValue(null);
            this.leadContractForm.controls["contractDateTo"].setValue(null);
            if (!this.id) {
                this.leadContractForm.controls["productId"].setValue(null);
                this.leadContractForm.controls["gradeId"].setValue(null);
            }
            this.leadContractForm.controls["buyerId"].setValue(this.rowData.buyerId);
        }
    }

    contractSelection(value) {
        let index = this.contractList.findIndex(x => x.contractId.toLocaleLowerCase() == value.toLocaleLowerCase());
        if (index > -1) {
            this.rowData = this.contractList[index];
            this.leadContractForm.patchValue(this.rowData);
            this.leadContractForm.controls["buyerId"].setValue(this.rowData.buyerId);
            this.leadContractForm.controls["shipToAddress"].setValue(this.rowData.shipToAddress);
            this.leadContractForm.controls["gstNumber"].setValue(this.rowData.gstNumber);
            if (this.rowData.rateOrTon)
                this.leadContractForm.controls["rateGst"].setValue(this.rowData.rateOrTon);
            if (this.rowData.rateGST)
                this.leadContractForm.controls["rateGst"].setValue(this.rowData.rateGST);
            this.timeStamp = this.rowData.timeStamp;
            this.contractId = this.rowData.contractId;
            this.clientId = this.rowData.buyerId;
            this.id = this.rowData.id;
            this.leadFormId = this.rowData.id;
            if (this.rowData.exceptionApprovalRequired) {
                this.leadContractForm.controls["exceptionApprovalRequired"].setValue("true");
            }
            else {
                this.leadContractForm.controls["exceptionApprovalRequired"].setValue("false");
            }
            this.onKey(null);
            this.calculateNet(null);
            this.getRelatedGrades(this.rowData.productId);
        }
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