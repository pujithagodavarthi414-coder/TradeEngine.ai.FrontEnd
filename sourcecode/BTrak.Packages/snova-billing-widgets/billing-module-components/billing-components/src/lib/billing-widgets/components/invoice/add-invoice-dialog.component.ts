import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { InvoiceService } from "../../services/invoice.service";
import { InvoiceOutputModel } from "../../models/invoice-output-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { ClientSearchInputModel } from "../../models/client-search-input.model";

import { AssetService } from '../../services/assets.service';
import { ConstantVariables } from '../../constants/constant-variables';
import { FileUploadService } from '../../services/fileUpload.service';
import { Router } from '@angular/router';
import '../../../globaldependencies/helpers/fontawesome-icons'
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";

@Component({
    selector: "add-invoice-dialog",
    templateUrl: "add-invoice-dialog.component.html",
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

        .invoice-container th {
            padding-right: 0;
            text-align: center;
            width: 13%;
        }
    `]
})

export class AddInvoiceDialogComponent {
    @Output() updateCustomFields = new EventEmitter<string>();
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let matData = data[0];
            this.currentDialogId = matData.fromPhysicalId;
            // let currDialog = this.dialog.openDialogs[0].id;
            // this.currentDialog = this.dialog.getDialogById(currDialog);
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.moduleTypeId = matData.moduleTypeId;
            this.referenceId = matData.referenceId;
            this.referenceTypeId = matData.referenceTypeId;
            this.editInvoice = matData.editInvoice;
            this.isDeletePermission = matData.isDeletePermission;
            this.isAddPermission = matData.isAddPermission;
            this.isEditFieldPermission = matData.isEditFieldPermission;
            this.currencyId = (matData.invoiceDetails != undefined && matData.invoiceDetails != null) ? matData.invoiceDetails.currencyId : null;
            this.clientId = (matData.invoiceDetails != undefined && matData.invoiceDetails != null) ? matData.invoiceDetails.clientId : null;
            this.amountPaid = (matData.invoiceDetails != undefined && matData.invoiceDetails != null) ? matData.invoiceDetails.amountPaid : 0;
            this.dueAmount = (matData.invoiceDetails != undefined && matData.invoiceDetails != null) ? matData.invoiceDetails.dueAmount : 0;
            this.initializeInvoiceForm();
            if (this.editInvoice) {
                this.initializeInvoiceEditDetails(matData.invoiceDetails);
            }
            else {
                this.subTotalInvoiceValue = parseFloat('0').toFixed(2);
                this.totalInvoiceValue = parseFloat('0').toFixed(2);
                this.discountInvoiceValue = parseFloat('0').toFixed(2);
                this.invoiceForm.get('amountPaid').setValue(this.amountPaid);
                this.invoiceForm.get('dueAmount').setValue(this.dueAmount);
            }
        }
    }

    currencyList = [];
    clientList = [];
    files: File[] = [];
    softLabels: SoftLabelConfigurationModel[];
    subTotalInvoiceValue: any;
    totalInvoiceValue: any;
    discountInvoiceValue: any;
    currencySymbol = '';
    invoiceDetails: any;
    amountPaid: any;
    dueAmount: any;
    currentDialogId: any;
    currentDialog: any;
    imageUrl: string;
    clientId: string;
    currencyId: string;
    validationMessage: string;
    minDate: string;
    maxDate: string;
    editInvoice: boolean = false;
    filesPresent: boolean = false;
    anyOperationIsInprogress: boolean = false;
    imageIsInprogress: boolean = false;
    referenceId: string;
    isreload: string;
    referenceTypeId: string;
    moduleTypeId: number;
    assetReferenceId: string;
    invoiceForm: FormGroup;
    invoiceTasks: FormArray;
    invoiceItems: FormArray;
    isAddPermission: boolean;
    isEditFieldPermission: boolean;
    isDeletePermission: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<AddInvoiceDialogComponent>, private fileUploadService: FileUploadService, private translateService: TranslateService, private formBuilder: FormBuilder, private invoiceService: InvoiceService, private assetService: AssetService, private billingDashboardService: BillingDashboardService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private router: Router) {
        // this.editInvoice = data.editInvoice;
        // this.currencyId = (data.invoiceDetails != undefined && data.invoiceDetails != null) ? data.invoiceDetails.currencyId : null;
        // this.clientId = (data.invoiceDetails != undefined && data.invoiceDetails != null) ? data.invoiceDetails.clientId : null;
        // this.amountPaid = (data.invoiceDetails != undefined && data.invoiceDetails != null) ? data.invoiceDetails.amountPaid : 0;
        // this.dueAmount = (data.invoiceDetails != undefined && data.invoiceDetails != null) ? data.invoiceDetails.dueAmount : 0;
        // this.initializeInvoiceForm();
        // if (this.editInvoice) {
        //     this.initializeInvoiceEditDetails(data.invoiceDetails);
        // }
        // else {
        //     this.subTotalInvoiceValue = parseFloat('0').toFixed(2);
        //     this.totalInvoiceValue = parseFloat('0').toFixed(2);
        //     this.discountInvoiceValue = parseFloat('0').toFixed(2);
        //     this.invoiceForm.get('amountPaid').setValue(this.amountPaid);
        //     this.invoiceForm.get('dueAmount').setValue(this.dueAmount);
        // }
        this.getCurrencyList();
        this.getClientList();
        this.getSoftLabels();
    }

    getCurrencyList() {
        this.assetService.getCurrencyList().subscribe((result: any) => {
            if (result.success) {
                this.currencyList = result.data;
                if (this.currencyList && this.currencyList.length > 0) {
                    if (this.currencyId) {
                        let index = this.currencyList.findIndex(x => x.currencyId.toLowerCase() == this.currencyId.toLowerCase());
                        this.currencySymbol = this.currencyList[index].currencySymbol;
                        this.invoiceForm.get('currencyId').setValue(this.currencyList[index].currencyId);
                        this.cdRef.markForCheck();
                        this.cdRef.detectChanges();
                    }
                    else {
                        this.currencySymbol = this.currencyList[0].currencySymbol;
                        this.invoiceForm.get('currencyId').setValue(this.currencyList[0].currencyId);
                        this.cdRef.markForCheck();
                        this.cdRef.detectChanges();
                    }
                }
                this.cdRef.markForCheck();
                this.cdRef.detectChanges();
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
                        this.invoiceForm.get('clientId').setValue(this.clientList[index].clientId);
                        this.cdRef.markForCheck();
                        this.cdRef.detectChanges();
                    }
                }
            }
        });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
          this.cdRef.markForCheck();
        }
      }

    onChangeCurrency(event) {
        if (this.currencyList && this.currencyList.length > 0) {
            let index = this.currencyList.findIndex(x => x.currencyId.toLowerCase() == event.toLowerCase());
            this.currencySymbol = this.currencyList[index].currencySymbol;
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
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

    initializeInvoiceEditDetails(invoiceDetails) {
        if (invoiceDetails) {
            this.minDate = invoiceDetails.issueDate;
            this.maxDate = invoiceDetails.dueDate;
            this.invoiceForm.patchValue({
                invoiceId: invoiceDetails.invoiceId,
                clientId: null,
                invoiceImageUrl: invoiceDetails.invoiceImageUrl,
                invoiceTitle: invoiceDetails.title,
                invoiceNumber: invoiceDetails.invoiceNumber,
                pO: invoiceDetails.po,
                issueDate: invoiceDetails.issueDate,
                dueDate: invoiceDetails.dueDate,
                currencyId: null,
                terms: invoiceDetails.terms,
                notes: invoiceDetails.notes,
                discount: invoiceDetails.discount,
                invoiceTax: '',
                timeStamp: invoiceDetails.timeStamp
            });
        }
        if (invoiceDetails && invoiceDetails.invoiceTasks) {
            this.invoiceTasks = this.invoiceForm.get('invoiceTasks') as FormArray;
            invoiceDetails.invoiceTasks.forEach(x => {
                let value = this.calculateTaskAmount(x.rate, x.hours);
                this.invoiceTasks.push(this.formBuilder.group({
                    invoiceTaskId: x.invoiceTaskId,
                    invoiceId: x.invoiceId,
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
        if (invoiceDetails && invoiceDetails.invoiceItems) {
            this.invoiceItems = this.invoiceForm.get('invoiceItems') as FormArray;
            invoiceDetails.invoiceItems.forEach(x => {
                let value = this.calculateItemAmount(x.price, x.quantity);
                this.invoiceItems.push(this.formBuilder.group({
                    invoiceItemId: x.invoiceItemId,
                    invoiceId: x.invoiceId,
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
        this.calculateTotalInvoice();
    }

    calculateTotalInvoice() {
        this.invoiceTasks = this.invoiceForm.get('invoiceTasks') as FormArray;
        this.invoiceItems = this.invoiceForm.get('invoiceItems') as FormArray;
        let discount = this.invoiceForm.get('discount').value;
        if (discount == '' || discount == null) {
            discount = '0';
        }
        else {
            discount = parseFloat(discount.toString()).toFixed(2);
        }
        let subTotal = 0;
        this.invoiceTasks.controls.forEach((x: any) => {
            let rate = (x.get('rate').value == '' || x.get('rate').value == null) ? '0' : parseFloat(x.get('rate').value).toFixed(2);
            let hours = (x.get('hours').value == '' || x.get('hours').value == null) ? '0' : parseFloat(x.get('hours').value).toFixed(2);
            let result = parseFloat(rate) * parseFloat(hours);
            subTotal = subTotal + result;
        });
        this.invoiceItems.controls.forEach((x: any) => {
            let price = (x.get('price').value == '' || x.get('price').value == null) ? '0' : parseFloat(x.get('price').value).toFixed(2);
            let quantity = (x.get('quantity').value == '' || x.get('quantity').value == null) ? '0' : parseFloat(x.get('quantity').value).toFixed(2);
            let result = parseFloat(price) * parseFloat(quantity);
            subTotal = subTotal + result;
        });
        this.subTotalInvoiceValue = subTotal.toFixed(2);
        let discountAmount = (subTotal * parseFloat(discount)) / 100;
        this.discountInvoiceValue = discountAmount.toFixed(2);
        this.totalInvoiceValue = (subTotal - discountAmount).toFixed(2);
        this.dueAmount = (this.totalInvoiceValue - this.amountPaid).toFixed(2);
        this.invoiceForm.get('totalInvoiceAmount').setValue(this.totalInvoiceValue);
        this.invoiceForm.get('invoiceDiscountAmount').setValue(this.discountInvoiceValue);
        this.invoiceForm.get('subTotalInvoiceAmount').setValue(this.subTotalInvoiceValue);
        this.invoiceForm.get('amountPaid').setValue(this.amountPaid);
        this.invoiceForm.get('dueAmount').setValue(this.dueAmount);
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
        this.calculateTotalInvoice();
    }

    checkTaskTotal(i) {
        this.invoiceTasks = this.invoiceForm.get('invoiceTasks') as FormArray;
        let rate = this.invoiceTasks.at(i).get('rate').value;
        let hours = this.invoiceTasks.at(i).get('hours').value;
        let value = this.calculateTaskAmount(rate, hours);
        this.invoiceTasks.at(i).get('total').setValue(value);
        this.calculateTotalInvoice();
    }

    checkItemTotal(i) {
        this.invoiceItems = this.invoiceForm.get('invoiceItems') as FormArray;
        let price = this.invoiceItems.at(i).get('price').value;
        let quantity = this.invoiceItems.at(i).get('quantity').value;
        let value = this.calculateItemAmount(price, quantity);
        this.invoiceItems.at(i).get('total').setValue(value);
        this.calculateTotalInvoice();
    }

    addInvoiceTask() {
        this.invoiceTasks = this.invoiceForm.get('invoiceTasks') as FormArray;
        this.invoiceTasks.insert(this.invoiceTasks.length, this.createInvoiceTask());
    }

    createInvoiceTask() {
        return this.formBuilder.group({
            invoiceTaskId: '',
            invoiceId: '',
            taskName: '',
            taskDescription: '',
            rate: '',
            hours: '',
            total: '0.00',
            isArchived: false,
            timeStamp: '',
        });
    }

    getInvoiceTaskControls() {
        return (<FormArray>this.invoiceForm.get('invoiceTasks')).controls;
    }

    removeTaskAtIndex(index) {
        this.invoiceTasks.removeAt(index);
        this.calculateTotalInvoice();
    }

    addInvoiceItem() {
        this.invoiceItems = this.invoiceForm.get('invoiceItems') as FormArray;
        this.invoiceItems.insert(this.invoiceItems.length, this.createInvoiceItem());
    }

    createInvoiceItem() {
        return this.formBuilder.group({
            invoiceItemId: '',
            invoiceId: '',
            itemName: '',
            itemDescription: '',
            price: '',
            quantity: '',
            total: '0.00',
            isArchived: false,
            timeStamp: '',
        });
    }

    getInvoiceItemControls() {
        return (<FormArray>this.invoiceForm.get('invoiceItems')).controls;
    }

    removeItemAtIndex(index) {
        this.invoiceItems.removeAt(index);
        this.calculateTotalInvoice();
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

    upsertInvoice() {
        let client = this.invoiceForm.get('clientId').value;
        let number = this.invoiceForm.get('invoiceNumber').value;
        if (client == '' || client == null || number == '' || number == null) {
            if (client == '' || client == null)
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForEmptyClient));
            if (number == '' || number == null)
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForEmptyNumber));
        }
        else {
            this.anyOperationIsInprogress = true;
            let invoiceModel = new InvoiceOutputModel();
            invoiceModel = this.invoiceForm.value;
            invoiceModel.invoiceImageUrl = this.imageUrl;
            invoiceModel.notes = invoiceModel.notes == null ? null : invoiceModel.notes.trim();
            invoiceModel.terms = invoiceModel.terms == null ? null : invoiceModel.terms.trim();
            let taskErrorsPresent = false;
            let itemErrorsPresent = false;
            let taskDesErrorsPresent = false;
            let itemDesErrorsPresent = false;
            let titleErrorPresent = false;
            let invoiceNumberErrorPresent = false;
            let pONumberErrorPresent = false;
            let notesErrorPresent = false;
            let termsErrorPresent = false;
            let amountErrorPresent = false;
            let discountErrorPresent = false;
            let taskTitleLengthErrorsPresent = false;
            let itemTitleLengthErrorsPresent = false;
            if (invoiceModel.title && invoiceModel.title.trim().length > 150) {
                titleErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceTitleExceed));
            }
            if (invoiceModel.invoiceNumber && invoiceModel.invoiceNumber.trim().length > 50) {
                invoiceNumberErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceNumberExceed));
            }
            if (invoiceModel.po && invoiceModel.po.trim().length > 50) {
                pONumberErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoicePONumberExceed));
            }
            if (invoiceModel.notes && invoiceModel.notes.trim().length > 800) {
                notesErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceNotesExceed));
            }
            if (invoiceModel.terms && invoiceModel.terms.trim().length > 800) {
                termsErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceTermsExceed));
            }
            if (invoiceModel.totalInvoiceAmount > 999999999) {
                amountErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceAmountExceed));
            }
            if (invoiceModel.discount != null && invoiceModel.discount != '' && invoiceModel.discount > 100) {
                discountErrorPresent = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForDiscountExceed));
            }
            if (invoiceModel.invoiceTasks && invoiceModel.invoiceTasks.length > 0) {
                invoiceModel.invoiceTasks.forEach((x, i) => {
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
            if (invoiceModel.invoiceItems && invoiceModel.invoiceItems.length > 0) {
                invoiceModel.invoiceItems.forEach((x, i) => {
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
            if (titleErrorPresent || invoiceNumberErrorPresent || pONumberErrorPresent || taskErrorsPresent || itemErrorsPresent || taskTitleLengthErrorsPresent || itemTitleLengthErrorsPresent || taskDesErrorsPresent || itemDesErrorsPresent || notesErrorPresent || termsErrorPresent || amountErrorPresent || discountErrorPresent) {
                if (taskErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForEmptyTask));
                if (itemErrorsPresent)
                    this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForEmptyItem));
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
                this.invoiceService.upsertInvoice(invoiceModel).subscribe((result: any) => {
                    if (result.success) {
                        if(!this.referenceId) {
                          this.assetReferenceId = result.data;
                        }
                        this.currentDialog.close({ success: true, redirection: false });
                        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
                        this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
                        this.anyOperationIsInprogress = false;
                        this.cdRef.markForCheck();
                    }
                    else {
                        this.validationMessage = result.apiResponseMessages[0].message;
                        this.toastr.error(this.validationMessage);
                        this.anyOperationIsInprogress = false;
                        this.cdRef.markForCheck();
                    }
                });
            }
        }
    }

    initializeInvoiceForm() {
        this.invoiceForm = new FormGroup({
            invoiceId: new FormControl(null, []),
            clientId: new FormControl(null, Validators.compose([Validators.required])),
            invoiceTitle: new FormControl('', []),
            invoiceImageUrl: new FormControl('', []),
            invoiceNumber: new FormControl('', Validators.compose([Validators.required])),
            pO: new FormControl('', []),
            issueDate: new FormControl(null, []),
            dueDate: new FormControl(null, []),
            currencyId: new FormControl(null, []),
            invoiceTasks: this.formBuilder.array([]),
            invoiceItems: this.formBuilder.array([]),
            terms: new FormControl('', []),
            notes: new FormControl('', []),
            discount: new FormControl('', []),
            invoiceTax: new FormControl('', []),
            totalInvoiceAmount: new FormControl('', []),
            invoiceDiscountAmount: new FormControl('', []),
            subTotalInvoiceAmount: new FormControl('', []),
            amountPaid: new FormControl('', []),
            dueAmount: new FormControl('', []),
            timeStamp: new FormControl('', [])
        });
    }

    closeDialog() {
        this.currentDialog.close({ success: false, redirection: true });
        this.router.navigate(['/billingmanagement/clients']);
    }

    getCustomFieldLength($event) {
      //  this.updateCustomFields.emit('');
    }

    cancelDialog() {
        this.currentDialog.close({ success: false, redirection: false });
    }
}