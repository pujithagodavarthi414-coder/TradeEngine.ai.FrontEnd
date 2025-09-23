import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { CompanyregistrationService } from '../../services/company-registration.service';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';
import { CompanyHierarchyModel } from '../../models/company-hierarchy-model';
import { ToastrService } from 'ngx-toastr';
import { HRManagementService } from '../../services/hr-management.service';
import { TreeItemDropEvent, DropPosition } from '@progress/kendo-angular-treeview';
import { MatDialog } from '@angular/material/dialog';
import { BusinessUnitModel } from '../../models/business-unit-model';

const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: 'app-fm-component-business-unit',
    templateUrl: `business-unit.component.html`,
    styles: [`
    .company-hierarchical-tree .k-widget {
        border-width: 0px !important;
        font-size : 35px !important;
    }

    .tree-height
    {
        height: calc(100vh - 145px) !important;
    }
    
    .company-details-size
    {
        font-size : 22px !important;
    }

    .group-styling
    {
        border-width: 1px !important;
        background-color: orange !important;
        border-radius: 10px !important;
    }

    .entity-styling
    {
        border-width: 1px !important;
        background-color: #c9b53e !important;
        border-radius: 10px !important;
    }

    .country-styling
    {
        border-width: 1px !important;
        border-radius: 10px !important;
        background-color: aquamarine !important;
    }

    .branch-styling
    {
        border-width: 1px !important;
        border-radius: 10px !important;
        background-color: lightgreen !important;
    }
    `]
})

export class BusinessUnitComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("AddBusinessUnitsPopup") addBusinessUnitsPopup;
    @ViewChildren("DeleteBusinessUnitPopup") deleteCompanyDetailsPopup;
    
    treeviewData: any;
    public allParentNodes = [];
    public expandKeys = this.allParentNodes.slice();
    businessUnitDetailsForm: FormGroup;
    businessUnitModel: any;
    isAnyOperationIsInprogress: boolean = false;
    selectedBusinessUnitDetails: any;
    employees: any;
    employeeIds: any[];
    allEmployeeIds: any = [];
    isExpandAll: boolean = true;
    showEmployeeDropDown : boolean;
    //local diclarations for model values
    businessUnitId: string;
    isExpandOnLoad: boolean = true;
    timeStamp: boolean;
    parentBusinessUnitId: string;

    constructor(private companyRegistration: CompanyregistrationService,
        private masterDataManagementService: MasterDataManagementService,
        private hrService: HRManagementService, public dialog: MatDialog,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.isExpandOnLoad  = true;
        this.getBusinessUnits();
        this.getEmployees();
    }

    getBusinessUnits() {
        let businessUnitModel = new BusinessUnitModel();
        this.masterDataManagementService.getBusinessUnits(businessUnitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.treeviewData = JSON.parse(response.data);
                if (this.treeviewData && this.treeviewData.length == 0) {
                    this.treeviewData = null;
                }
                this.getAllTextProperties(this.treeviewData);
                if (this.isExpandOnLoad) {
                    this.isExpandOnLoad = false;
                    this.expandTreeview(true);
                }
                this.cdRef.detectChanges();

            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    getAllTextProperties(items: Array<any>) {
        if (items) {
            items.forEach(i => {
                if (i.children) {
                    this.allParentNodes.push(i.businessUnitName);
                    this.getAllTextProperties(i.children);
                }
            });
        }
    }

    upsertBusinessUnitDetails(formDirective) {
        this.isAnyOperationIsInprogress = true;
        let businessUnitModel = new BusinessUnitModel();
        businessUnitModel = this.businessUnitDetailsForm.value;
        businessUnitModel.employeeIds = this.businessUnitDetailsForm.value.selectedEmployeeIds; ///TODO
        this.businessUnitModel = businessUnitModel;
        this.upsertBusinessUnit(this.businessUnitModel, formDirective);
    }

    upsertBusinessUnit(businessUnitModel, formDirective) {
        businessUnitModel.businessUnitId = this.businessUnitId;
        businessUnitModel.timeStamp = this.timeStamp;
        businessUnitModel.parentBusinessUnitId = this.parentBusinessUnitId;

        this.masterDataManagementService.upsertBusinessUnit(businessUnitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeBusinessUnitDetailsPopup(formDirective);
                this.getBusinessUnits();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    closeBusinessUnitDetailsPopup(formDirective) {
        this.addBusinessUnitsPopup.forEach((p) => p.closePopover());
        if (formDirective) {
            formDirective.resetForm();
        }
    }

    createBusinessUnitPopupOpen(addBusinessUnitsPopup, parentBusinessUnit) {
        this.clearForm();
        addBusinessUnitsPopup.openPopover();
        this.showEmployeeDropDown = true;
        // this.clearValidators();
        if (parentBusinessUnit) {
            this.parentBusinessUnitId = parentBusinessUnit.businessUnitId;
        } 
    }

    getEmployees() {
        this.hrService.getEmployees().subscribe((response: any) => {
            if (response.success === true) {
                this.employees = response.data;
                this.allEmployeeIds = this.employees.map(x => x.employeeId);
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.businessUnitId = null;
        this.timeStamp = null;
        this.parentBusinessUnitId = null;
        this.businessUnitDetailsForm = new FormGroup({
            businessUnitName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.BusinessUnitNameLength)
                ])
            ),
            selectedEmployeeIds: new FormControl(null,
                Validators.compose([
                    // Validators.required
                ])
            )
        });
    }

    expandTreeview(isToExpand: boolean) {
        this.isExpandAll = !isToExpand;
        if (isToExpand) {
            this.expandKeys = this.allParentNodes.slice();
        } else {
            this.expandKeys = [];
        }
    }

    editBusinessUnitPopupOpen(addBusinessUnitsPopup, selectedBusinessUnit) {
        this.clearForm();
        this.businessUnitDetailsForm.get("selectedEmployeeIds").patchValue([]);
        addBusinessUnitsPopup.openPopover();
        this.businessUnitId = selectedBusinessUnit.businessUnitId;
        this.timeStamp = selectedBusinessUnit.timeStamp;
        this.parentBusinessUnitId = selectedBusinessUnit.parentBusinessUnitId;
        this.employeeIds = selectedBusinessUnit.employeeIds;
        this.showEmployeeDropDown = selectedBusinessUnit.canAddEmployee;
        this.businessUnitDetailsForm.patchValue(selectedBusinessUnit);
        if (selectedBusinessUnit.employeeIds != null) {
            const employeeIds = selectedBusinessUnit.employeeIds;
            this.businessUnitDetailsForm.get("selectedEmployeeIds").patchValue(employeeIds);
        }
    }

    public handleDrop(event: TreeItemDropEvent): void {
        // if (event.destinationItem.item.dataItem.isBranch && event.dropPosition === DropPosition.Over) {
        //     event.setValid(false);
        // }
        let businessUnitModel = new BusinessUnitModel();
        businessUnitModel.businessUnitId = event.sourceItem.item.dataItem.businessUnitId;
        businessUnitModel.parentBusinessUnitId = event.destinationItem.item.dataItem.businessUnitId;
        businessUnitModel.businessUnitName = event.sourceItem.item.dataItem.businessUnitName;
        businessUnitModel.employeeIds = event.sourceItem.item.dataItem.employeeIds;
        businessUnitModel.timeStamp = event.sourceItem.item.dataItem.timeStamp;
        businessUnitModel.isArchive = false;
        this.masterDataManagementService.upsertBusinessUnit(businessUnitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeBusinessUnitDetailsPopup(null);
                this.getBusinessUnits();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", response.apiResponseMessages[0].message);
                this.getBusinessUnits();
            }
        });
    }

    deleteBusinessUnitPopupOpen(deleteBusinessUnitPopup, dataItem) {
        deleteBusinessUnitPopup.openPopover();
        this.selectedBusinessUnitDetails = dataItem;
    }

    closeDeletBusinessUnitPopup() {
        this.selectedBusinessUnitDetails = null;
        this.deleteCompanyDetailsPopup.forEach((p) => p.closePopover());
    }

    deleteBusinessUnit() {
        this.isAnyOperationIsInprogress = true;
        let businessUnitModel = new BusinessUnitModel();
        businessUnitModel = this.selectedBusinessUnitDetails;
        businessUnitModel.isArchive = true;
        this.masterDataManagementService.upsertBusinessUnit(businessUnitModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeDeletBusinessUnitPopup();
                this.getBusinessUnits();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }
}