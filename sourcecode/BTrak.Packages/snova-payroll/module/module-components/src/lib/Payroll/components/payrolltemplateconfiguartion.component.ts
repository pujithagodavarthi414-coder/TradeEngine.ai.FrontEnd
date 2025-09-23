import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PayRollTemplateConfigurationModel } from '../../Payroll/models/PayRollTemplateConfigurationModel';
import { Router } from '@angular/router';
import { PayRollComponentModel } from '../../Payroll/models/PayRollComponentModel';
import { MatOption } from '@angular/material/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { PayRollTemplateModel } from '../../Payroll/models/PayRollTemplateModel';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { PayrollManagementService } from '../services/payroll-management.service';

@Component({
    selector: 'app-payrolltemplateconfiguration',
    templateUrl: `payrolltemplateconfiguartion.component.html`
})

export class PayRollTemplateConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("deletePayRollTemplateConfigurationPopUp") deletePayRollTemplateConfigurationPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild(GridComponent) private grid: GridComponent;

    isFiltersVisible: boolean = false;;
    isAnyOperationIsInprogress: boolean = false;
    roleFeaturesIsInProgress$: Observable<boolean>;
    payRollTemplate: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollComponentId: string;
    timeStamp: any;
    searchText: string;
    payRollTemplateconfigurationForm: FormGroup;
    payRollTemplateConfigurationModel: PayRollTemplateConfigurationModel;
    isPayRollTemplateConfigurationArchived: boolean = false;
    fromDate: Date;
    payRollTemplateId: string;
    isArchivedTypes: boolean = false;
    currencyId: string;
    payRollTemplateConfigurations: PayRollTemplateConfigurationModel[] = [];
    payRollTemplateConfigurationId: string;
    payRollComponents: PayRollComponentModel[];
    paytoDate: string;
    selectedPayRollComponentIds: string[]
    formGroup: FormGroup;
    editedRowIndex: number;
    editedPayRollTemplateConfiguration: PayRollTemplateConfigurationModel;
    value: PayRollTemplateConfigurationModel[];
    sum: number = 0;
    isComponetDuplicate: boolean = false;
    components: Component[];
    gridData: GridDataResult;
    state: State = {
        skip: 0,
        take: 10
    };

    @Input("payrollTemplateId")
    set _payrollTemplateId(data) {
        this.payRollTemplateId = data;
        this.payRollTemplateConfigurations = [];
        if (this.payRollTemplateId) {
            this.getAllPayRollTemplateConfigurations();
        }
    }

    constructor(private payrollManagementService: PayrollManagementService, 
        private translateService: TranslateService, private cdRef: ChangeDetectorRef,
        private router: Router, private toastr: ToastrService) { super() }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getPayRollComponents();
        this.getComponents();

    }


    clearForm() {
        this.validationMessage = null;
        this.payRollTemplateconfigurationForm = new FormGroup({
            payRollComponentIds: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            )
        })
    }


    getPayRollComponents() {
        var payRollComponentModel = new PayRollComponentModel();
        payRollComponentModel.isArchived = this.isArchivedTypes;
        payRollComponentModel.isVisible = true;

        this.payrollManagementService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollComponents = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getComponents() {
        var payRollComponentModel = new PayRollTemplateModel();
        payRollComponentModel.isArchived = this.isArchivedTypes;

        this.payrollManagementService.getAllComponents(payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.components = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    toggleComponentsPerOne(value) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (this.payRollTemplateconfigurationForm.get("payRollComponentIds").value.length === this.payRollComponents.length) {
            this.allSelected.select();
        }
    }
    
    toggleAllComponentsSelected() {
        if (this.allSelected.selected) {
            this.payRollTemplateconfigurationForm.get("payRollComponentIds").patchValue([
                ...this.payRollComponents.map((item) => item.payRollComponentId),
                0
            ]);
        } else {
            this.payRollTemplateconfigurationForm.get("payRollComponentIds").patchValue([]);
        }
    }

    getAllPayRollTemplateConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollTemplateConfigurationModel = new PayRollTemplateConfigurationModel();
        payRollTemplateConfigurationModel.payRollTemplateId = this.payRollTemplateId;
        payRollTemplateConfigurationModel.isArchived = this.isArchivedTypes;
        if (payRollTemplateConfigurationModel.payRollTemplateId != undefined && payRollTemplateConfigurationModel.payRollTemplateId != null) {
            this.payrollManagementService.getAllPayRollTemplateConfigurations(payRollTemplateConfigurationModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.payRollTemplateConfigurations = response.data;
                    this.gridData = process(this.payRollTemplateConfigurations, this.state);
                    this.cdRef.detectChanges();
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.isAnyOperationIsInprogress = false;
                }
                this.isAnyOperationIsInprogress = false
            });
        }
    }

    addPayRollTemplateConfiguration() {
        this.isAnyOperationIsInprogress = true;
        this.isComponetDuplicate = false;
        this.payRollTemplateconfigurationForm.get("payRollComponentIds").value.forEach(x => {
            let payRollTemplateConfigurationModel = new PayRollTemplateConfigurationModel();
            payRollTemplateConfigurationModel.payRollComponentId = x;
            if (x != 0 && x != null) {
                let payrollComponent = this.payRollComponents.find(y => x == y.payRollComponentId);
                payRollTemplateConfigurationModel.payRollComponentName = payrollComponent.componentName;
                var result = this.payRollTemplateConfigurations.find(item => item.payRollComponentId == x);
                if (result != null && result != undefined) {
                    this.toastr.error("", payRollTemplateConfigurationModel.payRollComponentName + ' ' + this.translateService.instant("PAYROLLROLECONFIGURATION.COMPONENTALREADYEXIST"));
                    this.isComponetDuplicate = true;
                    this.isAnyOperationIsInprogress = false;
                }
            }
        });
        if (this.isComponetDuplicate == false) {
            let payRollTemplateConfigurationModel = new PayRollTemplateConfigurationModel();
            payRollTemplateConfigurationModel.payRollComponentIds = this.payRollTemplateconfigurationForm.get("payRollComponentIds").value;
            this.upsertPayRollTemplateConfiguration(payRollTemplateConfigurationModel);
            this.payRollTemplateconfigurationForm.get("payRollComponentIds").patchValue([]);
            this.clearForm();
        }
        this.isAnyOperationIsInprogress = false;
    }

    upsertPayRollTemplateConfiguration(item) {
        this.isAnyOperationIsInprogress = true;
        this.payRollTemplateConfigurationModel = new PayRollTemplateConfigurationModel();
        if (!item.isNew) {
            this.payRollTemplateConfigurationModel.payRollTemplateConfigurationId = item.payRollTemplateConfigurationId;
        }
        if (this.payRollTemplateId == null || this.payRollTemplateId == undefined) {
            this.toastr.error("", this.translateService.instant("PAYROLLROLECONFIGURATION.REQUIREDPAYROLLTEMPLATEERRORERROR"));
        }
        else {
            this.payRollTemplateConfigurationModel.payRollComponentId = item.payRollComponentId;
            this.payRollTemplateConfigurationModel.payRollComponentIds = item.payRollComponentIds;
            this.payRollTemplateConfigurationModel.payRollTemplateId = this.payRollTemplateId;
            this.payRollTemplateConfigurationModel.timeStamp = item.timeStamp;
            this.payRollTemplateConfigurationModel.isPercentage = item.isPercentage;
            this.payRollTemplateConfigurationModel.amount = item.amount;
            this.payRollTemplateConfigurationModel.percentagevalue = item.percentagevalue;
            this.payRollTemplateConfigurationModel.isCtcDependent = item.isCtcDependent;
            this.payRollTemplateConfigurationModel.isRelatedToPT = item.isRelatedToPT;
            this.payRollTemplateConfigurationModel.componentId = item.componentId;
            this.payRollTemplateConfigurationModel.dependentPayRollComponentId = item.dependentPayRollComponentId;
            this.payRollTemplateConfigurationModel.order = item.order;
            this.payRollTemplateConfigurationModel.isArchived = false;

            this.payrollManagementService.upsertPayRollTemplateConfiguration(this.payRollTemplateConfigurationModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.getAllPayRollTemplateConfigurations();
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        }
    }

    deletePayRollTemplateConfiguration(item) {
        this.isAnyOperationIsInprogress = true;
        this.payRollTemplateConfigurationModel = new PayRollTemplateConfigurationModel();
        this.payRollTemplateConfigurationModel.payRollTemplateConfigurationId = item.payRollTemplateConfigurationId;
        this.payRollTemplateConfigurationModel.payRollComponentId = item.payRollComponentId;
        this.payRollTemplateConfigurationModel.payRollTemplateId = item.payRollTemplateId;
        this.payRollTemplateConfigurationModel.timeStamp = item.timeStamp;
        this.payRollTemplateConfigurationModel.isPercentage = item.isPercentage;
        this.payRollTemplateConfigurationModel.amount = item.amount;
        this.payRollTemplateConfigurationModel.percentagevalue = item.percentagevalue;
        this.payRollTemplateConfigurationModel.isCtcDependent = item.isCtcDependent;
        this.payRollTemplateConfigurationModel.isRelatedToPT = item.isRelatedToPT;
        this.payRollTemplateConfigurationModel.componentId = item.componentId;
        this.payRollTemplateConfigurationModel.dependentPayRollComponentId = item.dependentPayRollComponentId;
        this.payRollTemplateConfigurationModel.order = item.order;
        this.payRollTemplateConfigurationModel.isArchived = true;

        this.payrollManagementService.upsertPayRollTemplateConfiguration(this.payRollTemplateConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.getAllPayRollTemplateConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    closeDeletePayRollTemplateConfigurationDialog() {
        this.deletePayRollTemplateConfigurationPopover.forEach((p) => p.closePopover());
    }

    public editHandler({ sender, rowIndex, dataItem }) {
        if (this.editedRowIndex != null && this.editedRowIndex != undefined) {
            this.toastr.error("",this.translateService.instant("PAYROLLROLECONFIGURATION.SAVINGDETAILSMESSAGE"));
        }
        else {
            this.closeEditor(sender);

            this.editedRowIndex = rowIndex;
            this.editedPayRollTemplateConfiguration = Object.assign({}, dataItem);

            sender.editRow(rowIndex);
        }
    }

    public cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    public saveHandler({ sender, rowIndex, dataItem, isNew }) {
        if (dataItem.type == 0) {
            dataItem.amount = dataItem.value;
            dataItem.percentagevalue = null;
        }
        else if (dataItem.type == 1) {
            dataItem.percentagevalue = dataItem.value;
            dataItem.amount = null;
        }
        else if (dataItem.type == null) {
            dataItem.percentagevalue = null;
            dataItem.amount = null;
        }

        var isRelatedToPTRecordCount = this.payRollTemplateConfigurations.filter(y => y.dependentType == 2) != null ?
            this.payRollTemplateConfigurations.filter(y => y.dependentType == 2).length : null;

        var orderDuplicateCount = this.payRollTemplateConfigurations.filter(y => y.order == dataItem.order) != null ?
            this.payRollTemplateConfigurations.filter(y => y.order == dataItem.order).length : null;

        if (dataItem.type == null && dataItem.dependentType != 2) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.TYPEISREQUIRED"));
        }
        else if ((dataItem.value == null || dataItem.value == '') && dataItem.dependentType != 2) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.VALUEISREQUIRED"));
        }
        else if (dataItem.dependentType == null) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.DEPENDENTTYPEISREQUIRED"));
        }
        else if (dataItem.dependentType == 0 && dataItem.componentId == null) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.COMPONETISREQUIRED"));
        }
        else if (dataItem.dependentType == 3 && dataItem.dependentPayRollComponentId == null) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.DEPENDENTCOMPONETISREQUIRED"));
        }
        else if (isRelatedToPTRecordCount > 1) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.ISRELATEDTOPTRECORDCOUNTMESSAGE"));
        }
        else if (dataItem.order == null || dataItem.order == undefined) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.ORDERREQUIREDMESSAGE"));
        }
        else if (orderDuplicateCount > 1) {
            this.toastr.error("", this.translateService.instant("PAYROLLTEMPLATECONFIGURATION.ORDERDUPLICATEMESSAGE"));
        }
        else {
            this.save(dataItem);

            sender.closeRow(rowIndex);

            this.editedRowIndex = undefined;
            this.editedPayRollTemplateConfiguration = undefined;
        }
    }

    public removeHandler({ dataItem }) {
        this.remove(dataItem);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.resetItem(this.editedPayRollTemplateConfiguration);
        this.editedRowIndex = undefined;
        this.editedPayRollTemplateConfiguration = undefined;
    }

    public save(item: any) {
        this.upsertPayRollTemplateConfiguration(item);
    }

    public remove(item: any) {
        if (item.isNew == true) {
            const index = this.payRollTemplateConfigurations.findIndex(({ payRollTemplateConfigurationId }) => payRollTemplateConfigurationId === item.payRollTemplateConfigurationId);
            this.payRollTemplateConfigurations.splice(index, 1);
        } else {
            if (item != null && item.payRollTemplateConfigurationId != null) {
                this.deletePayRollTemplateConfiguration(item);
            }
        }
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        // find orignal data item
        const originalDataItem = this.payRollTemplateConfigurations.find(item => item.payRollTemplateConfigurationId === dataItem.payRollTemplateConfigurationId);

        // revert changes
        Object.assign(originalDataItem, dataItem);
    }


    changeDependentType(value, dataItem) {
        if (value == '0') {
            dataItem.isCtcDependent = false;
            dataItem.isRelatedToPT = false;
            dataItem.dependentPayRollComponentId = null;
        }
        if (value == '1') {
            dataItem.isRelatedToPT = false;
            dataItem.dependentPayRollComponentId = null;
            dataItem.componentId = null;
            dataItem.isCtcDependent = true;
        }
        if (value == '2') {
            dataItem.isCtcDependent = false;
            dataItem.componentId = null;
            dataItem.dependentPayRollComponentId = null;
            dataItem.isRelatedToPT = true;
            dataItem.value = null;
            dataItem.type = null;
        }
        if (value == '3') {
            dataItem.isCtcDependent = false;
            dataItem.componentId = null;
            dataItem.isRelatedToPT = false;
        }

        Object.assign(
            this.payRollTemplateConfigurations.find(({ payRollTemplateConfigurationId }) => payRollTemplateConfigurationId === dataItem.payRollTemplateConfigurationId),
            dataItem
        );
        this.payRollTemplateConfigurations = [...this.payRollTemplateConfigurations];
    }

    changeType(value, dataItem) {
        if (value == '0') {
            dataItem.type = 0;
            dataItem.isPercentage = false;
        }
        if (value == '1') {
            dataItem.type = 1;
            dataItem.isPercentage = true;
        }
        Object.assign(
            this.payRollTemplateConfigurations.find(({ payRollTemplateConfigurationId }) => payRollTemplateConfigurationId === dataItem.payRollTemplateConfigurationId),
            dataItem
        );
        this.payRollTemplateConfigurations = [...this.payRollTemplateConfigurations];
    }

    changeComponent(value, dataItem) {
        dataItem.componentName = value
        Object.assign(
            this.payRollTemplateConfigurations.find(({ payRollTemplateConfigurationId }) => payRollTemplateConfigurationId === dataItem.payRollTemplateConfigurationId),
            dataItem
        );
        this.payRollTemplateConfigurations = [...this.payRollTemplateConfigurations];
    }

    filterComponents(componentid) {
        return this.payRollTemplateConfigurations.filter(x => x.payRollComponentId != componentid);
    }
    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.payRollTemplateConfigurations, this.state);
    }
} 