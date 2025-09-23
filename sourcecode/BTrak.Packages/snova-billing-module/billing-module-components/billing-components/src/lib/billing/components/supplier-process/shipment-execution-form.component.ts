import { ChangeDetectorRef, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ContractModel } from "../../models/contract.model";
import { EmployeeListModel } from "../../models/employee-list-model";
import { GradeModel } from "../../models/grade.model";
import { PaymentTermModel } from "../../models/payment-term.model";
import { ProductTableModel } from "../../models/product-table.model";
import { ShipmentExecutionModel } from "../../models/shipment-execution.model";
import { VesselModel } from "../../models/vessel.model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';

@Component({
    selector: "app-billing-component-shipment-execution",
    templateUrl: "shipment-execution-form.component.html"
})
export class ShipmentExecutionForm {

    shipmentForm: FormGroup;
    minDate: Date = new Date();
    portDetailList: PaymentTermModel[] = [];
    gradeList: GradeModel[];
    productList: any;
    clientData: any = null;
    vesselData: any = null;
    selectedContractId: string;
    isInProgress: boolean = false;
    contractList: any[];
    purchaseShipmentId: string;
    employeesList: any;
    selectedEmployeeUserId: string;
    selectedDueDate: any;
    timeStamp: any;

    constructor(private BillingDashboardService: BillingDashboardService, private router: Router,
        private route: ActivatedRoute, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.selectedContractId = routeParams.id;
                this.getContracts();
            }
            else if (routeParams.id1 && routeParams.id2) {
                this.selectedContractId = routeParams.id1;
                this.purchaseShipmentId = routeParams.id2;
                this.getContracts();
            }
        })
    }

    ngOnInit() {
        this.clearForm();
        this.getAllPortDetails();
        this.getAllGrades();
        this.getClients();
        this.getAllProducts();
        this.getAllVessels();
        this.getEmployeesLists();
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
    
    getAllPortDetails() {
        let portDetail = new PaymentTermModel();
        portDetail.isArchived = false;
        this.BillingDashboardService.GetAllPortDetails(portDetail)
            .subscribe((responseData: any) => {
                this.portDetailList = responseData.data;
            });
    }

    getAllVessels() {
        let vessel = new VesselModel();
        vessel.isArchived = false;
        this.BillingDashboardService.getAllVessels(vessel)
            .subscribe((responseData: any) => {
                this.vesselData = responseData.data;
                this.cdRef.detectChanges();
            });
    }


    getAllGrades() {
        let grade = new GradeModel();
        grade.isArchived = false;
        this.BillingDashboardService.getAllGrades(grade)
            .subscribe((responseData: any) => {
                this.gradeList = responseData.data;
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

    getContracts() {
        this.isInProgress = true;
        let contractModel = new ContractModel();
        contractModel.contractId = this.selectedContractId;
        this.BillingDashboardService.getPurchaseContractList(contractModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.contractList = responseData.data;
                    this.shipmentForm.patchValue(this.contractList[0]);
                    if (this.purchaseShipmentId)
                        this.getShipmentExecutionDetails();
                    this.isInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    getShipmentExecutionDetails() {
        this.isInProgress = true;
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel.isArchived = false;
        shipmentExecutionModel.purchaseShipmentId = this.purchaseShipmentId;
        this.BillingDashboardService.getShipmentExecutionList(shipmentExecutionModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.shipmentForm.patchValue(responseData.data[0]);
                    this.timeStamp = responseData.data[0].timeStamp;
                    this.selectedEmployeeUserId = responseData.data[0].workEmployeeId;
                    this.selectedDueDate = responseData.data[0].fillDueDate;
                    this.isInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    clearForm() {
        this.shipmentForm = new FormGroup({
            counterPartyId: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractNumber: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractDateFrom: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractDateTo: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            productId: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            gradeId: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            rateOrTon: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            contractQuantity: new FormControl({ value: '', disabled: true }, [Validators.required]
            ),
            shipmentNumber: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            shipmentQuantity: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            remaningQuantity: new FormControl({value:'',disabled:true},
                Validators.compose([
                    //Validators.required
                ])
            ),
            blQuantity: new FormControl({ value: '0', disabled: true }
            ),
            vesselId: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            ),
            voyageNumber: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            ),
            portLoadId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            portDischargeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            etaDate: new FormControl(null,
                Validators.compose([

                ])
            ),
        })
    }

    saveShipmentDetails() {
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel = this.shipmentForm.value;
        shipmentExecutionModel.contractId = this.selectedContractId;
        shipmentExecutionModel.timeStamp = this.timeStamp;
        shipmentExecutionModel.purchaseShipmentId = this.purchaseShipmentId;
        shipmentExecutionModel.fillDueDate = this.selectedDueDate;
        shipmentExecutionModel.workEmployeeId = this.selectedEmployeeUserId;
        this.BillingDashboardService.UpertShipmentExecution(shipmentExecutionModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                if(!this.purchaseShipmentId)
                this.router.navigate(["billingmanagement/shipmentExecution", this.selectedContractId, result.data]);
                this.purchaseShipmentId = result.data;
                this.getShipmentExecutionDetails();
                this.toastr.success("", "Shipment execution saved successfully");
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
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

    navigateToStageTwo() {
        this.router.navigate(["billingmanagement/shipmentExecution/stage2", this.selectedContractId, this.purchaseShipmentId]);
    }

    employeeSelection(event) {
        this.selectedEmployeeUserId = event.value;
        this.upsertFields(true);
    }

    dueDateChange() {
        this.upsertFields(false);
    }

    upsertFields(isForEmployee: boolean) {
        let shipmentExecutionModel = new ShipmentExecutionModel();
        shipmentExecutionModel = this.shipmentForm.value;
        shipmentExecutionModel.contractId = this.selectedContractId;
        shipmentExecutionModel.fillDueDate = this.selectedDueDate;
        shipmentExecutionModel.workEmployeeId = this.selectedEmployeeUserId;
        shipmentExecutionModel.isSendNotification = isForEmployee;
        shipmentExecutionModel.timeStamp = this.timeStamp;
        shipmentExecutionModel.purchaseShipmentId = this.purchaseShipmentId;
        if(isForEmployee && this.employeesList) {
            var index = this.employeesList.findIndex((x) => (x.userId.toLowerCase() == this.selectedEmployeeUserId.toLowerCase()));
            if(index > -1) {
                shipmentExecutionModel.employeeId = this.employeesList[index].employeeId;
                shipmentExecutionModel.mobileNo = this.employeesList[index].mobileNo;
                shipmentExecutionModel.employeeEmailId = this.employeesList[index].email;
                shipmentExecutionModel.employeeName = this.employeesList[index].fullName;
            }
        }
        this.BillingDashboardService.UpertShipmentExecution(shipmentExecutionModel).subscribe((result: any) => {
            if (result.success) {
                this.isInProgress = false;
                if (isForEmployee) {
                    this.toastr.success("", "Duty Payment Work assigned successfully");
                }
                else {
                    this.toastr.success("", "Filling due date saved successfully");
                }
                this.getShipmentExecutionDetails();
            }
            else {
                this.isInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }
}