import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { CompanyregistrationService } from '../../services/company-registration.service';
import { TimeZoneModel } from '../../models/hr-models/time-zone';
import { CurrencyModel } from '../../models/hr-models/currency-model';
import { PayRollTemplateModel } from '../../models/branch';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';
import { CompanyHierarchyModel } from '../../models/company-hierarchy-model';
import { ToastrService } from 'ngx-toastr';
import { HRManagementService } from '../../services/hr-management.service';
import { TreeItemDropEvent, DropPosition } from '@progress/kendo-angular-treeview';
import { CountryModel } from '../../models/hr-models/country-model';
import { MatDialog } from '@angular/material/dialog';

const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
    selector: 'app-fm-component-company-hierarchy',
    templateUrl: `company-hierarchy.component.html`,
    styles: [`
    .company-hierarchical-tree .k-widget {
        border-width: 0px !important;
        font-size : 35px !important;
    }

    .tree-height
    {
        width : 925px !important;
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

export class CompanyHierarchyComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("AddCompanyDetailsPopup") addCompanyDetailsPopup;
    @ViewChildren("DeleteCompanyDetailsPopup") deleteCompanyDetailsPopup;
    @ViewChild("confrmationPopup") private confrmationPopup: TemplateRef<any>;

    isAnyOperationIsInprogress: boolean = false;
    showGroup: boolean;
    showEntity: boolean;
    showCountry: boolean;
    showBranch: boolean;
    companyDetailsForm: FormGroup;
    timeZoneList: any;
    selectedCompanyDetails: any;
    timeStamp: any;
    payrollTemplates: any;
    treeviewData: any;
    headOfficeDetails: any;
    entityId: string;
    parentEntityId: string;
    selectedParentCompanyLevel: string;
    childEntityId: string;
    companyStructureModel: any;
    timezones: TimeZoneModel[];
    countries: CountryModel[];
    currencies: CurrencyModel[];
    payRollTemplates: PayRollTemplateModel[];
    public allParentNodes = [];
    public expandKeys = this.allParentNodes.slice();
    parentId: string;

    constructor(private companyRegistration: CompanyregistrationService,
        private payRollService: MasterDataManagementService,
        private hrService: HRManagementService, public dialog: MatDialog,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getCompanyStructure();
        this.getCurrencies();
        this.getTimezones();
        this.getCountries();
        this.getPayrolltemplates();
        this.expandTreeview(true);
    }

    getCompanyStructure() {
        let companyStructureModel = new CompanyHierarchyModel();
        this.payRollService.getCompanyHierarchy(companyStructureModel).subscribe((response: any) => {
            if (response.success == true) {
                this.treeviewData = JSON.parse(response.data);
                if (this.treeviewData && this.treeviewData.length == 0) {
                    this.treeviewData = null;
                }
                this.getAllTextProperties(this.treeviewData);
                this.cdRef.detectChanges();

            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    getPayrolltemplates() {
        var payRollTemplateModel = new PayRollTemplateModel();
        this.payRollService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollTemplates = response.data;
            }
        });
    }

    getTimezones() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.companyRegistration.getTimeZones(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timezones = response.data;
            }
        });
    }

    getCurrencies() {
        var companyModel = new CurrencyModel();
        companyModel.isArchived = false;
        this.hrService.getCurrencies(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencies = response.data;
            }
        });
    }

    getCountries() {
        const countryModel = new CountryModel();
        countryModel.isArchived = false;
        this.hrService.getCountries(countryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.countries = response.data;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.entityId = null;
        this.timeStamp = null;
        this.childEntityId = null;
        this.parentEntityId = null;
        this.companyDetailsForm = new FormGroup({
            entityName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            // address: new FormControl(null,
            //     Validators.compose([
            //         Validators.required,
            //         Validators.maxLength(ConstantVariables.MaxLength)
            //     ])
            // ),
            street: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            city: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            state: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            postalCode: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(7)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(800)
                ])
            ),
            typeOfGrouping: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            timeZoneId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            defaultPayrollTemplateId: new FormControl(null,
                Validators.compose([])
            ),
            currencyId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isToAttachEmployee: new FormControl(true, []),
            isHeadOffice: new FormControl(null, []),
        })
    }

    closeUpsertCompanyDetailsPopup(formDirective) {
        this.addCompanyDetailsPopup.forEach((p) => p.closePopover());
        if (formDirective) {
            formDirective.resetForm();
        }
    }

    upsertCompanyDetails(formDirective) {
        this.isAnyOperationIsInprogress = true;
        let companyStructureModel = new CompanyHierarchyModel();
        companyStructureModel = this.companyDetailsForm.value;
        this.companyStructureModel = companyStructureModel;
        if (companyStructureModel.isHeadOffice) {
            let headOfficeDetails = this.findIndexCategorydata();
            if (headOfficeDetails) {
                this.openConfirmationPopup(formDirective,headOfficeDetails);
            } else {
                this.upsertEntity(this.companyStructureModel, formDirective);
            }
        } else {
            this.upsertEntity(this.companyStructureModel, formDirective);
        }
    }

    upsertEntity(companyStructureModel, formDirective) {
        companyStructureModel.entityId = this.entityId;
        companyStructureModel.parentEntityId = this.parentId ? this.parentId : this.parentEntityId;
        companyStructureModel.childEntityId = this.childEntityId;
        companyStructureModel.timeStamp = this.timeStamp;
        if (this.companyDetailsForm.get('typeOfGrouping').value == '1') {
            companyStructureModel.isGroup = true;
        } else if (this.companyDetailsForm.get('typeOfGrouping').value == '2') {
            companyStructureModel.isEntity = true;
        } else if (this.companyDetailsForm.get('typeOfGrouping').value == '3') {
            companyStructureModel.isCountry = true;
        } else if (this.companyDetailsForm.get('typeOfGrouping').value == '4') {
            companyStructureModel.isBranch = true;
        }
        this.payRollService.upsertCompanyHierarchy(companyStructureModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeUpsertCompanyDetailsPopup(formDirective);
                this.getCompanyStructure();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.parentId = null;
        });
    }

    createCompanyPopupOpen(addCompanyDetailsPopup, parentCompany) {
        this.clearForm();
        addCompanyDetailsPopup.openPopover();
        this.clearValidators();
        if (parentCompany) {
            this.parentEntityId = parentCompany.entityId;
            this.selectedParentCompanyLevel = parentCompany.isGroup ? "1" : parentCompany.isEntity ? "2" :
                parentCompany.isCountry ? "3" : parentCompany.isBranch ? "4" : null;
            this.showBranch = true;
            this.showCountry = true;
            this.showEntity = true;
            this.showGroup = true;
            //this.setOptions(false);
        } else {
            this.showBranch = true;
            this.showCountry = true;
            this.showEntity = true;
            this.showGroup = true;
        }
    }

    createParentCompanyPopupOpen(addCompanyDetailsPopup, parentCompany) {
        this.clearForm();
        addCompanyDetailsPopup.openPopover();
        this.clearValidators();
        this.parentId = parentCompany.parentEntityId;
        this.showCountry = true;
        this.showEntity = true;
        this.showGroup = true;
        this.showBranch = false;
        this.childEntityId = parentCompany.entityId;
    }

    editCompanyPopupOpen(addCompanyDetailsPopup, selectedCompany) {
        this.selectedParentCompanyLevel = null;
        this.clearForm();
        if (selectedCompany.children && selectedCompany.children.length > 0) {
            this.showGroup = true;
            this.showEntity = true;
            this.showCountry = true;
            this.showBranch = false;
        } else {
            this.showGroup = true;
            this.showEntity = true;
            this.showCountry = true;
            this.showBranch = true;
        }
        addCompanyDetailsPopup.openPopover();
        this.entityId = selectedCompany.entityId;
        this.timeStamp = selectedCompany.timeStamp;
        this.parentEntityId = selectedCompany.parentEntityId;
        this.companyDetailsForm.patchValue(selectedCompany);
        if (selectedCompany.isGroup) {
            this.companyDetailsForm.get('typeOfGrouping').setValue(1);
            this.clearValidators();
        } else if (selectedCompany.isEntity) {
            this.companyDetailsForm.get('typeOfGrouping').setValue(2);
            this.clearValidators();
        } else if (selectedCompany.isCountry) {
            this.companyDetailsForm.get('typeOfGrouping').setValue(3);
            this.clearValidators();
        } else if (selectedCompany.isBranch) {
            this.companyDetailsForm.get('typeOfGrouping').setValue(4);
            this.clearBranchValidators();
        }
        if (selectedCompany) {
            this.selectedParentCompanyLevel = selectedCompany.isGroup ? "1" : selectedCompany.isEntity ? "2" :
                selectedCompany.isCountry ? "3" : selectedCompany.isBranch ? "4" : null;
            //this.setOptions(true);
        }
    }

    closeDeleteCompanyPopup() {
        this.selectedCompanyDetails = null;
        this.deleteCompanyDetailsPopup.forEach((p) => p.closePopover());
    }

    deleteCompany() {
        this.isAnyOperationIsInprogress = true;
        let companyStructureModel = new CompanyHierarchyModel();
        companyStructureModel = this.selectedCompanyDetails;
        companyStructureModel.isArchive = true;
        this.payRollService.upsertCompanyHierarchy(companyStructureModel).subscribe((response: any) => {
            if (response.success == true) {
                this.closeDeleteCompanyPopup();
                this.getCompanyStructure();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteCompanyPopupOpen(deleteCompanyDetailsPopup, dataItem) {
        deleteCompanyDetailsPopup.openPopover();
        this.selectedCompanyDetails = dataItem;
    }

    onTypeOfGroupChnage(event) {
        if (event.value == 3) {
            this.clearValidators();
        } else if (event.value == 4) {
            this.clearBranchValidators();
        } else {
            this.clearValidators();
        }
    }

    clearValidators() {
        this.companyDetailsForm.get('defaultPayrollTemplateId').clearValidators();
        this.companyDetailsForm.get('defaultPayrollTemplateId').updateValueAndValidity();
        this.companyDetailsForm.get('street').clearValidators();
        this.companyDetailsForm.get('street').updateValueAndValidity();
        this.companyDetailsForm.get('city').clearValidators();
        this.companyDetailsForm.get('city').updateValueAndValidity();
        this.companyDetailsForm.get('state').clearValidators();
        this.companyDetailsForm.get('state').updateValueAndValidity();
        this.companyDetailsForm.get('postalCode').clearValidators();
        this.companyDetailsForm.get('postalCode').updateValueAndValidity();
        this.companyDetailsForm.get('currencyId').clearValidators();
        this.companyDetailsForm.get('currencyId').updateValueAndValidity();
        this.companyDetailsForm.get('timeZoneId').clearValidators();
        this.companyDetailsForm.get('timeZoneId').updateValueAndValidity();
        this.companyDetailsForm.get('countryId').clearValidators();
        this.companyDetailsForm.get('countryId').updateValueAndValidity();
    }

    clearBranchValidators() {
        this.companyDetailsForm.get('timeZoneId').setValidators([Validators.required]);
        this.companyDetailsForm.get('timeZoneId').updateValueAndValidity();
        this.companyDetailsForm.get('countryId').setValidators([Validators.required]);
        this.companyDetailsForm.get('countryId').updateValueAndValidity();
        this.companyDetailsForm.get('defaultPayrollTemplateId').setValidators([]);
        this.companyDetailsForm.get('defaultPayrollTemplateId').updateValueAndValidity();
        // this.companyDetailsForm.get('address').setValidators([Validators.required, Validators.maxLength(150)]);
        // this.companyDetailsForm.get('address').updateValueAndValidity();
        this.companyDetailsForm.get('street').setValidators([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)]);
        this.companyDetailsForm.get('street').updateValueAndValidity();
        this.companyDetailsForm.get('city').setValidators([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)]);
        this.companyDetailsForm.get('city').updateValueAndValidity();
        this.companyDetailsForm.get('state').setValidators([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)]);
        this.companyDetailsForm.get('state').updateValueAndValidity();
        this.companyDetailsForm.get('postalCode').setValidators([Validators.required, Validators.maxLength(7)]);
        this.companyDetailsForm.get('postalCode').updateValueAndValidity();
        this.companyDetailsForm.get('currencyId').setValidators([Validators.required]);
        this.companyDetailsForm.get('currencyId').updateValueAndValidity();
    }

    getAllTextProperties(items: Array<any>) {
        if (items) {
            items.forEach(i => {
                if (i.children) {
                    this.allParentNodes.push(i.entityName);
                    this.getAllTextProperties(i.children);
                }
            });
        }
    }

    expandTreeview(isToExpand: boolean) {
        if (isToExpand) {
            this.expandKeys = this.allParentNodes.slice();
        } else {
            this.expandKeys = [];
        }
    }

    setOptions(isEdit) {
        this.showGroup = false;
        this.showEntity = false;
        this.showCountry = false;
        this.showBranch = false;
        if (isEdit) {
            if (this.selectedParentCompanyLevel == '1') {
                this.showGroup = true;
                this.showEntity = true;
                this.showCountry = true;
            } else if (this.selectedParentCompanyLevel == '2') {
                this.showEntity = true;
                this.showCountry = true;
            } else if (this.selectedParentCompanyLevel == '3') {
                this.showCountry = true;
            }
            this.showBranch = true;
        } else {
            if (!this.selectedParentCompanyLevel) {
                this.showGroup = true;
            }
            if (this.selectedParentCompanyLevel != '2' && this.selectedParentCompanyLevel != '3') {
                this.showEntity = true;
            }
            if (this.selectedParentCompanyLevel != '3') {
                this.showCountry = true;
            }
            this.showBranch = true;
        }
    }

    getChipData(dataItem) {
        let text = dataItem.isGroup ? "Group" : dataItem.isEntity ? "Entity" : dataItem.isCountry ? "Country" : "Branch";
        return text;
    }

    getTagsForBranch(dataItem) {
        let tags = [];
        if (dataItem.isBranch) {
            if (dataItem.timeZoneName) {
                tags.push(dataItem.timeZoneName);
            }
            if (dataItem.currencyName) {
                tags.push(dataItem.currencyName);
            }
            if (dataItem.payRollTemplateName) {
                tags.push(dataItem.payRollTemplateName);
            }
            if (dataItem.countryName) {
                tags.push(dataItem.countryName);
            }
            return tags;
        } else {
            return null;
        }
    }

    public handleDrop(event: TreeItemDropEvent): void {
        if (event.destinationItem.item.dataItem.isBranch && event.dropPosition === DropPosition.Over) {
            event.setValid(false);
        }
        else {
            let companyDetails = new CompanyHierarchyModel();
            companyDetails.entityId = event.sourceItem.item.dataItem.entityId;
            companyDetails.parentEntityId = event.destinationItem.item.dataItem.entityId;
            companyDetails.entityName = event.sourceItem.item.dataItem.entityName;
            companyDetails.isEntity = event.sourceItem.item.dataItem.isEntity;
            companyDetails.isGroup = event.sourceItem.item.dataItem.isGroup;
            companyDetails.isBranch = event.sourceItem.item.dataItem.isBranch;
            companyDetails.isCountry = event.sourceItem.item.dataItem.isCountry;
            companyDetails.isHeadOffice = event.sourceItem.item.dataItem.isHeadOffice;
            companyDetails.timeStamp = event.sourceItem.item.dataItem.timeStamp;
            companyDetails.currencyId = event.sourceItem.item.dataItem.currencyId;
            companyDetails.timeZoneId = event.sourceItem.item.dataItem.timeZoneId;
            companyDetails.countryId = event.sourceItem.item.dataItem.countryId;
            companyDetails.isArchive = false;
            companyDetails.defaultPayrollTemplateId = event.sourceItem.item.dataItem.defaultPayrollTemplateId;
            companyDetails.description = event.sourceItem.item.dataItem.description;
            companyDetails.city = event.sourceItem.item.dataItem.city;
            companyDetails.street = event.sourceItem.item.dataItem.street;
            companyDetails.state = event.sourceItem.item.dataItem.state;
            companyDetails.postalCode = event.sourceItem.item.dataItem.postalCode;
            this.payRollService.upsertCompanyHierarchy(companyDetails).subscribe((response: any) => {
                if (response.success == true) {
                    this.closeUpsertCompanyDetailsPopup(null);
                    this.getCompanyStructure();
                    this.isAnyOperationIsInprogress = false;
                } else {
                    this.isAnyOperationIsInprogress = false;
                    this.toastr.error("", response.apiResponseMessages[0].message);
                    this.getCompanyStructure();
                }
            });
        }
    }

    findIndexCategorydata() {
        if (this.treeviewData) {
            for (let i = 0; i < this.treeviewData.length; i++) {
                if (this.treeviewData[i].isHeadOffice) {
                    return this.treeviewData[i];
                }
                else if (this.treeviewData[i].children && this.treeviewData[i].children.length > 0) {
                    let headOfficeDetails = this.recursiveFindIndexSectiondata(this.treeviewData[i].children, i);
                    return headOfficeDetails;
                }
            }
        }
    }

    recursiveFindIndexSectiondata(childList, index) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].isHeadOffice) {
                    return childList[i];
                }
                else if (childList[i].children && childList[i].children.length > 0) {
                    let headOfficeDetails = this.recursiveFindIndexSectiondata(childList[i].children, i);
                    if (headOfficeDetails != undefined)
                        return headOfficeDetails;
                }
            }
        }
    }

    openConfirmationPopup(formDirective,headOfficeDetails) {
        const dialogRef = this.dialog.open(this.confrmationPopup, {
            height: "20vh",
            width: "20%",
            direction: 'ltr',
            disableClose: true,
            data: headOfficeDetails,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe(() => {
            this.upsertEntity(this.companyStructureModel, formDirective);
        });
    }

    upsertHeadOffice(isHeadOffice) {
        this.companyStructureModel.isHeadOffice = isHeadOffice;
        this.dialog.closeAll();
    }
}
