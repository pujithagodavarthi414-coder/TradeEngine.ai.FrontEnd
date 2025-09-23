import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Input } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { EstimateOutputModel } from "../../models/estimate-output.model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { ClientSearchInputModel } from "../../models/client-search-input.model";

import { AddInvoiceDialogComponent } from "../invoice/add-invoice-dialog.component";
import { InvoiceOutputModel } from "../../models/invoice-output-model";

import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { ConstantVariables } from '../../constants/constant-variables';
import { AssetService } from '../../services/assets.service';
import { FileUploadService } from '../../services/fileUpload.service';
import { EstimateService } from '../../services/estimate.service';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "add-estimate-dialog",
    templateUrl: "add-estimate-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .custom-dropzone {
            height: 85px;
            border-radius: 5px;
            font-size: 20px;
        }
        .custom-dropzone .custom-dropzone-label {
            font-size: 10px;
            margin: 5px auto;
            overflow: hidden !important;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .custom-dropzone .custom-dropzone-preview {
            height: 58px !important;
            min-height: 58px !important;
            min-width: 75px !important;
            max-width: 75px !important;
            padding: 0px 5px !important;
            margin: 3px 5px !important;
        }

        ngx-dropzone-image-preview {
            height: 60px !important;
            max-height: 60px !important;
        }
    `]
})

export class AddEstimateDialogComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let matData = data[0];
            // let currDialog = this.dialog.openDialogs[0].id;
            // this.currentDialog = this.dialog.getDialogById(currDialog);
            this.currentDialogId = matData.fromPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.editEstimate = matData.editEstimate;
            this.currencyId = (matData.estimateDetails != undefined && matData.estimateDetails != null) ? matData.estimateDetails.currencyId : null;
            this.clientId = (matData.estimateDetails != undefined && matData.estimateDetails != null) ? matData.estimateDetails.clientId : null;
            this.initializeEstimateForm();
            if (this.editEstimate) {
                this.initializeEstimateEditDetails(matData.estimateDetails);
            }
            else {
                this.subTotalEstimateValue = parseFloat('0').toFixed(2);
                this.totalEstimateValue = parseFloat('0').toFixed(2);
                this.discountEstimateValue = parseFloat('0').toFixed(2);
            }
        }
    }

    softLabels: SoftLabelConfigurationModel[];

    currencyList = [];
    clientList = [];
    files: File[] = [];

    subTotalEstimateValue: any;
    totalEstimateValue: any;
    discountEstimateValue: any;
    currencySymbol = '';
    estimateDetails: any;
    currentDialogId: any;
    currentDialog: any;
    imageUrl: string;
    clientId: string;
    currencyId: string;
    validationMessage: string;
    minDate: string;
    maxDate: string;
    editEstimate: boolean = false;
    filesPresent: boolean = false;
    anyOperationIsInprogress: boolean = false;
    imageIsInprogress: boolean = false;

    estimateForm: FormGroup;
    estimateTasks: FormArray;
    estimateItems: FormArray;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<AddEstimateDialogComponent>, private fileUploadService: FileUploadService, private translateService: TranslateService, private softLabePipe: SoftLabelPipe, private formBuilder: FormBuilder, private estimateService: EstimateService, private assetService: AssetService, private billingDashboardService: BillingDashboardService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        // this.editEstimate = data.editEstimate;
        // this.currencyId = (data.estimateDetails != undefined && data.estimateDetails != null) ? data.estimateDetails.currencyId : null;
        // this.clientId = (data.estimateDetails != undefined && data.estimateDetails != null) ? data.estimateDetails.clientId : null;
        // this.initializeEstimateForm();
        // if (this.editEstimate) {
        //     this.initializeEstimateEditDetails(data.estimateDetails);
        // }
        // else {
        //     this.subTotalEstimateValue = parseFloat('0').toFixed(2);
        //     this.totalEstimateValue = parseFloat('0').toFixed(2);
        //     this.discountEstimateValue = parseFloat('0').toFixed(2);
        // }
        this.getCurrencyList();
        this.getClientList();
        this.getSoftLabelConfigurations();
    }

    getCurrencyList() {
        this.assetService.getCurrencyList().subscribe((result: any) => {
            if (result.success) {
                this.currencyList = result.data;
                if (this.currencyList && this.currencyList.length > 0) {
                    if (this.currencyId) {
                        let index = this.currencyList.findIndex(x => x.currencyId.toLowerCase() == this.currencyId.toLowerCase());
                        this.currencySymbol = this.currencyList[index].currencySymbol;
                        this.estimateForm.get('currencyId').setValue(this.currencyList[index].currencyId);
                        this.cdRef.markForCheck();
                    }
                    else {
                        this.currencySymbol = this.currencyList[0].currencySymbol;
                        this.estimateForm.get('currencyId').setValue(this.currencyList[0].currencyId);
                        this.cdRef.markForCheck();
                    }
                }
            }
        });
    }

    getClientList() {
        let clientSearchResult = new ClientSearchInputModel();
        clientSearchResult.isArchived = false;
        this.billingDashboardService.getClients(clientSearchResult).subscribe((responseData: any) => {
            if (responseData.success == false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            else if (responseData.success == true) {
                this.clientList = responseData.data;
                if (this.clientId) {
                    let index = this.clientList.findIndex(x => x.clientId.toLowerCase() == this.clientId.toLowerCase());
                    if (index != -1) {
                        this.estimateForm.get('clientId').setValue(this.clientList[index].clientId);
                        this.cdRef.markForCheck();
                    }
                }
            }
        });
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    onChangeCurrency(event) {
        if (this.currencyList && this.currencyList.length > 0) {
            let index = this.currencyList.findIndex(x => x.currencyId.toLowerCase() == event.toLowerCase());
            this.currencySymbol = this.currencyList[index].currencySymbol;
            this.cdRef.markForCheck();
        }
    }

    changeDateFrom(minDate) {
        this.minDate = minDate;
        this.cdRef.markForCheck();
    }

    changeDateTo(maxDate) {
        this.maxDate = maxDate;
        this.cdRef.markForCheck();
    }

    initializeEstimateEditDetails(estimateDetails) {
        if (estimateDetails) {
            this.minDate = estimateDetails.issueDate;
            this.maxDate = estimateDetails.dueDate;
            this.estimateForm.patchValue({
                estimateId: estimateDetails.estimateId,
                clientId: null,
                estimateImageUrl: estimateDetails.estimateImageUrl,
                estimateTitle: estimateDetails.title,
                estimateNumber: estimateDetails.estimateNumber,
                pO: estimateDetails.po,
                issueDate: estimateDetails.issueDate,
                dueDate: estimateDetails.dueDate,
                currencyId: null,
                terms: estimateDetails.terms,
                notes: estimateDetails.notes,
                discount: estimateDetails.discount,
                estimateTax: '',
                timeStamp: estimateDetails.timeStamp
            });
        }
        if (estimateDetails && estimateDetails.estimateTasks) {
            this.estimateTasks = this.estimateForm.get('estimateTasks') as FormArray;
            estimateDetails.estimateTasks.forEach(x => {
                let value = this.calculateTaskAmount(x.rate, x.hours);
                this.estimateTasks.push(this.formBuilder.group({
                    estimateTaskId: x.estimateTaskId,
                    estimateId: x.estimateId,
                    taskName: x.taskName,
                    taskDescription: x.taskDescription,
                    rate: x.rate,
                    hours: x.hours,
                    total: value,
                    isArchived: false,
                    timeStamp: x.timeStamp
                }))
            })
        }
        if (estimateDetails && estimateDetails.estimateItems) {
            this.estimateItems = this.estimateForm.get('estimateItems') as FormArray;
            estimateDetails.estimateItems.forEach(x => {
                let value = this.calculateItemAmount(x.price, x.quantity);
                this.estimateItems.push(this.formBuilder.group({
                    estimateItemId: x.estimateItemId,
                    estimateId: x.estimateId,
                    itemName: x.itemName,
                    itemDescription: x.itemDescription,
                    price: x.price,
                    quantity: x.quantity,
                    total: value,
                    isArchived: false,
                    timeStamp: x.timeStamp
                }))
            })
        }
        this.calculateTotalEstimate();
    }

    calculateTotalEstimate() {
        this.estimateTasks = this.estimateForm.get('estimateTasks') as FormArray;
        this.estimateItems = this.estimateForm.get('estimateItems') as FormArray;
        let discount = this.estimateForm.get('discount').value;
        if (discount == '' || discount == null) {
            discount = '0';
        }
        else {
            discount = parseFloat(discount.toString()).toFixed(2);
        }
        let subTotal = 0;
        this.estimateTasks.controls.forEach((x: any) => {
            let rate = (x.get('rate').value == '' || x.get('rate').value == null) ? '0' : parseFloat(x.get('rate').value).toFixed(2);
            let hours = (x.get('hours').value == '' || x.get('hours').value == null) ? '0' : parseFloat(x.get('hours').value).toFixed(2);
            let result = parseFloat(rate) * parseFloat(hours);
            subTotal = subTotal + result;
        });
        this.estimateItems.controls.forEach((x: any) => {
            let price = (x.get('price').value == '' || x.get('price').value == null) ? '0' : parseFloat(x.get('price').value).toFixed(2);
            let quantity = (x.get('quantity').value == '' || x.get('quantity').value == null) ? '0' : parseFloat(x.get('quantity').value).toFixed(2);
            let result = parseFloat(price) * parseFloat(quantity);
            subTotal = subTotal + result;
        });
        this.subTotalEstimateValue = subTotal.toFixed(2);
        let discountAmount = (subTotal * parseFloat(discount)) / 100;
        this.discountEstimateValue = discountAmount.toFixed(2);
        this.totalEstimateValue = (subTotal - discountAmount).toFixed(2);
        this.estimateForm.get('totalEstimateAmount').setValue(this.totalEstimateValue);
        this.estimateForm.get('estimateDiscountAmount').setValue(this.discountEstimateValue);
        this.estimateForm.get('subTotalEstimateAmount').setValue(this.subTotalEstimateValue);
        this.cdRef.markForCheck();
    }

    calculateTaskAmount(rate, hours) {
        let rt = rate;
        let hrs = hours;
        if (rate == '' || rate == null)
            rt = 0;
        else
            rt = parseFloat(rate.toString()).toFixed(2);
        if (hours == '' || hours == null)
            hrs = 0;
        else
            hrs = parseFloat(hours.toString()).toFixed(2);
        return (rt * hrs).toFixed(2);
    }

    calculateItemAmount(price, qty) {
        let pr = price;
        let qy = qty;
        if (price == '' || price == null)
            pr = 0;
        else
            pr = parseFloat(price.toString()).toFixed(2);
        if (qty == '' || qty == null)
            qy = 0;
        else
            qy = parseFloat(qty.toString()).toFixed(2);
        return (pr * qy).toFixed(2);
    }

    calculateDiscount(value) {
        this.calculateTotalEstimate();
    }

    checkTaskTotal(i) {
        this.estimateTasks = this.estimateForm.get('estimateTasks') as FormArray;
        let rate = this.estimateTasks.at(i).get('rate').value;
        let hours = this.estimateTasks.at(i).get('hours').value;
        let value = this.calculateTaskAmount(rate, hours);
        this.estimateTasks.at(i).get('total').setValue(value);
        this.calculateTotalEstimate();
    }

    checkItemTotal(i) {
        this.estimateItems = this.estimateForm.get('estimateItems') as FormArray;
        let price = this.estimateItems.at(i).get('price').value;
        let quantity = this.estimateItems.at(i).get('quantity').value;
        let value = this.calculateItemAmount(price, quantity);
        this.estimateItems.at(i).get('total').setValue(value);
        this.calculateTotalEstimate();
    }

    addEstimateTask() {
        this.estimateTasks = this.estimateForm.get('estimateTasks') as FormArray;
        this.estimateTasks.insert(this.estimateTasks.length, this.createEstimateTask());
    }

    createEstimateTask() {
        return this.formBuilder.group({
            estimateTaskId: '',
            estimateId: '',
            taskName: '',
            taskDescription: '',
            rate: '',
            hours: '',
            total: '0.00',
            isArchived: false,
            timeStamp: '',
        });
    }

    getEstimateTaskControls() {
        return (<FormArray>this.estimateForm.get('estimateTasks')).controls;
    }

    removeTaskAtIndex(index) {
        this.estimateTasks.removeAt(index);
        this.calculateTotalEstimate();
    }

    addEstimateItem() {
        this.estimateItems = this.estimateForm.get('estimateItems') as FormArray;
        this.estimateItems.insert(this.estimateItems.length, this.createEstimateItem());
    }

    createEstimateItem() {
        return this.formBuilder.group({
            estimateItemId: '',
            estimateId: '',
            itemName: '',
            itemDescription: '',
            price: '',
            quantity: '',
            total: '0.00',
            isArchived: false,
            timeStamp: '',
        });
    }

    getEstimateItemControls() {
        return (<FormArray>this.estimateForm.get('estimateItems')).controls;
    }

    removeItemAtIndex(index) {
        this.estimateItems.removeAt(index);
        this.calculateTotalEstimate();
    }

    filesSelected(event) {
        if (this.files.length > 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.MultipleImagesNotAllowed));
        }
        else {
            this.files.push(...event.addedFiles);
            if (event.rejectedFiles.length > 0) {
                if (event.rejectedFiles[0].type != "image/*") {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
                }
            }
            else
                this.saveFiles();
        }
    }

    saveFiles() {
        const formData = new FormData();
        this.imageIsInprogress = true;
        this.files.forEach((file: File) => {
            const fileKeyName = "file";
            formData.append(fileKeyName, file);
        });
        this.fileUploadService.UploadFile(formData, 8).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.imageUrl = responseData.data[0].filePath;
                this.cdRef.markForCheck();
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
            this.imageIsInprogress = false;
        });
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.imageUrl = null;
        this.cdRef.markForCheck();
    }

    upsertEstimate() {
        let client = this.estimateForm.get('clientId').value;
        let number = this.estimateForm.get('estimateNumber').value;
        if (client == '' || client == null || number == '' || number == null) {
            if (client == '' || client == null)
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForEmptyClient));
            if (number == '' || number == null)
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateEmptyNumber), this.softLabels));
        }
        else {
            this.anyOperationIsInprogress = true;
            let estimateModel = new EstimateOutputModel();
            estimateModel = this.estimateForm.value;
            estimateModel.estimateImageUrl = this.imageUrl;
            estimateModel.notes = estimateModel.notes == null ? null : estimateModel.notes.trim();
            estimateModel.terms = estimateModel.terms == null ? null : estimateModel.terms.trim();
            let taskErrorsPresent = false;
            let itemErrorsPresent = false;
            let taskDesErrorsPresent = false;
            let itemDesErrorsPresent = false;
            let titleErrorPresent = false;
            let estimateNumberErrorPresent = false;
            let pONumberErrorPresent = false;
            let notesErrorPresent = false;
            let termsErrorPresent = false;
            let amountErrorPresent = false;
            let discountErrorPresent = false;
            let taskTitleLengthErrorsPresent = false;
            let itemTitleLengthErrorsPresent = false;
            if (estimateModel.title && estimateModel.title.trim().length > 150) {
                titleErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateTitleExceed), this.softLabels));
            }
            if (estimateModel.estimateNumber && estimateModel.estimateNumber.trim().length > 50) {
                estimateNumberErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateNumberExceed), this.softLabels));
            }
            if (estimateModel.po && estimateModel.po.trim().length > 50) {
                pONumberErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimatePONumberExceed), this.softLabels));
            }
            if (estimateModel.notes && estimateModel.notes.trim().length > 800) {
                notesErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateNotesExceed), this.softLabels));
            }
            if (estimateModel.terms && estimateModel.terms.trim().length > 800) {
                termsErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateTermsExceed), this.softLabels));
            }
            if (estimateModel.totalEstimateAmount > 999999999) {
                amountErrorPresent = true;
                this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEstimateAmountExceed), this.softLabels));
            }
            if (estimateModel.discount != null && estimateModel.discount != '' && estimateModel.discount > 100) {
                discountErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForDiscountExceed));
            }
            if (estimateModel.estimateTasks && estimateModel.estimateTasks.length > 0) {
                estimateModel.estimateTasks.forEach((x, i) => {
                    if (x.taskName == null || x.taskName.trim() == '') {
                        taskErrorsPresent = true;
                    }
                    if (x.taskName.trim() != '' && x.taskName.trim().length > 150) {
                        taskTitleLengthErrorsPresent = true;
                    }
                    if (x.taskDescription.trim() != '' && x.taskDescription.trim().length > 800) {
                        taskDesErrorsPresent = true;
                    }
                    let rt = parseFloat(x.rate.toString()).toFixed(2);
                    x.rate = parseFloat(rt);
                    let hrs = parseFloat(x.hours.toString()).toFixed(2);
                    x.hours = parseFloat(hrs);
                    x.order = i + 1;
                });
            }
            if (estimateModel.estimateItems && estimateModel.estimateItems.length > 0) {
                estimateModel.estimateItems.forEach((x, i) => {
                    if (x.itemName == null || x.itemName.trim() == '') {
                        itemErrorsPresent = true;
                    }
                    if (x.itemName.trim() != '' && x.itemName.trim().length > 150) {
                        itemTitleLengthErrorsPresent = true;
                    }
                    if (x.itemDescription.trim() != '' && x.itemDescription.trim().length > 800) {
                        itemDesErrorsPresent = true;
                    }
                    let pr = parseFloat(x.price.toString()).toFixed(2);
                    x.price = parseFloat(pr);
                    let qty = parseFloat(x.quantity.toString()).toFixed(2);
                    x.quantity = parseFloat(qty);
                    x.order = i + 1;
                });
            }
            if (titleErrorPresent || estimateNumberErrorPresent || pONumberErrorPresent || taskErrorsPresent || itemErrorsPresent || taskTitleLengthErrorsPresent || itemTitleLengthErrorsPresent || taskDesErrorsPresent || itemDesErrorsPresent || notesErrorPresent || termsErrorPresent || amountErrorPresent || discountErrorPresent) {
                if (taskErrorsPresent)
                    this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEmptyEstimateTask), this.softLabels));
                if (itemErrorsPresent)
                    this.toastr.warning(this.softLabePipe.transform(this.translateService.instant(ConstantVariables.WarningMessageForEmptyEstimateItem), this.softLabels));
                if (taskTitleLengthErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForTaskTitleExceed));
                if (itemTitleLengthErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForItemTitleExceed));
                if (taskDesErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForTaskExceed));
                if (itemDesErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForItemExceed));
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
            else {
                this.estimateService.upsertEstimate(estimateModel).subscribe((result: any) => {
                    if (result.success) {
                        this.currentDialog.close({ success: true });
                        this.anyOperationIsInprogress = false;
                        this.cdRef.markForCheck();
                    }
                    else {
                        this.validationMessage = result.apiResponseMessages[0].message;
                        this.toastr.error("", this.softLabePipe.transform(this.validationMessage, this.softLabels));
                        this.anyOperationIsInprogress = false;
                        this.cdRef.markForCheck();
                    }
                });
            }
        }
    }

    convertToInvoiceDialog() {
        this.currentDialog.close({ success: false });
        let estimateDetails = this.estimateForm.value;
        let invoiceDetails = new InvoiceOutputModel();
        invoiceDetails.clientId = estimateDetails.clientId;
        invoiceDetails.title = estimateDetails.estimateTitle;
        invoiceDetails.invoiceNumber = estimateDetails.estimateNumber;
        invoiceDetails.po = estimateDetails.pO;
        invoiceDetails.issueDate = estimateDetails.issueDate;
        invoiceDetails.dueDate = estimateDetails.dueDate;
        invoiceDetails.currencyId = estimateDetails.currencyId;
        invoiceDetails.invoiceTasks = estimateDetails.estimateTasks;
        invoiceDetails.invoiceItems = estimateDetails.estimateItems;
        invoiceDetails.terms = estimateDetails.terms;
        invoiceDetails.notes = estimateDetails.notes;
        invoiceDetails.discount = estimateDetails.discount;
        invoiceDetails.amountPaid = 0.00;
        invoiceDetails.dueAmount = estimateDetails.totalEstimateAmount;
        invoiceDetails.totalInvoiceAmount = estimateDetails.totalEstimateAmount;
        invoiceDetails.invoiceDiscountAmount = estimateDetails.estimateDiscountAmount;
        invoiceDetails.subTotalInvoiceAmount = estimateDetails.subTotalEstimateAmount;

        const dialogRef = this.dialog.open(AddInvoiceDialogComponent, {
            height: "90%",
            width: "90%",
            direction: 'ltr',
            data: { editInvoice: true, invoiceDetails: invoiceDetails },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => { });
    }

    initializeEstimateForm() {
        this.estimateForm = new FormGroup({
            estimateId: new FormControl(null, []),
            clientId: new FormControl(null, Validators.compose([Validators.required])),
            estimateTitle: new FormControl('', []),
            estimateImageUrl: new FormControl('', []),
            estimateNumber: new FormControl('', Validators.compose([Validators.required])),
            pO: new FormControl('', []),
            issueDate: new FormControl(null, []),
            dueDate: new FormControl(null, []),
            currencyId: new FormControl(null, []),
            estimateTasks: this.formBuilder.array([]),
            estimateItems: this.formBuilder.array([]),
            terms: new FormControl('', []),
            notes: new FormControl('', []),
            discount: new FormControl('', []),
            estimateTax: new FormControl('', []),
            totalEstimateAmount: new FormControl('', []),
            estimateDiscountAmount: new FormControl('', []),
            subTotalEstimateAmount: new FormControl('', []),
            timeStamp: new FormControl('', [])
        });
    }

    closeDialog() {
        this.currentDialog.close({ success: false });
    }
}