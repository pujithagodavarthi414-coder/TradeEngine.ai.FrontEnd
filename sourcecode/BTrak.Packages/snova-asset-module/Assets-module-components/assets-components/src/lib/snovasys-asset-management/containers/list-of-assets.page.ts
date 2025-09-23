import { Component, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CustomFormFieldModel, ProductDetails } from "../models/product-details";
import { VendorManagement } from "../models/vendor-management";
import { AssetInputModel } from "../models/asset-input-model";
import { LoadSuppliersTriggered } from "../store/actions/supplier.actions";
import { LoadProductDetailsTriggered } from "../store/actions/product-details.actions";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Branch } from '../models/branch';
import { User } from '../models/user';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import { UserModel } from '../models/user-model';
import { LoadUsersListTriggered } from '../store/actions/users.actions';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AddAssetComponent } from "../component/add-asset.component";

@Component({
    selector: "app-am-page-list-of-assets",
    templateUrl: "list-of-assets.page.template.html"
})

export class ListOfAssetsPageComponent extends CustomAppBaseComponent {
    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;

    selectUserDropDownListData$: Observable<User[]>;
    productDetailsList$: Observable<ProductDetails[]>;
    suppliersList$: Observable<VendorManagement[]>;
    branchList$: Observable<Branch[]>;
    entities: EntityDropDownModel[];
    customFields: CustomFormFieldModel[];
    assetSearchResultsData: AssetInputModel;
    customFieldData: CustomFormFieldModel;
    searchText = null;
    displaySearchText = null;
    searchAssetCode: string = null;
    displayAssetCode = null;
    selectedProductId = null;
    productName: string = null;
    selectedSupplierId = null;
    supplierName: string = null;
    selectedAssigneeId = null;
    assigneeNames: string = null;
    selectedEntityId: string = null;
    entityName: string = null;
    moduleTypeId = 2;
    isEmpty: boolean = null;
    isAvailableValue: string = null;
    isVendor: boolean = null;
    anyOperationInProgress: boolean;
    isVendorName: string = null;
    activeAssignee: boolean = true;
    activeAssignees: string = "true";
    purchaseDate: Date;
    assignedDate: Date;
    isEntered: boolean = null;
    isEnteredSearch: boolean = null;
    referenceId: string = ConstantVariables.ASSETSREFERENCEID;
    referenceTypeId: string = ConstantVariables.ASSETSREFERENCEID;
    roleFeaturesIsInProgress$: Observable<boolean>;
    customFieldsLength: number;
    isreload: string;
    validationMessage: string;
    // isWriteOff: boolean = null;


    constructor(private cdRef: ChangeDetectorRef, private routes: Router, private dialog: MatDialog,
        private store: Store<State>, private assetService: AssetService, private toaster: ToastrService) {
        super();
        this.selectUserDropDownListData$ = this.store.pipe(select(assetModuleReducer.getUsersListAll));
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllAssets();
        this.searchCustomForms();
        this.getEntityDropDown();
        this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
        if (this.canAccess_feature_ViewAssetsWithAdvancedSearch) {
            this.getAllProductDetails();
            this.getAllSuppliers();
        }
        this.getUsersList();
    }

    getUsersList() {
        const usersInput = new UserModel();
        usersInput.isActive = this.activeAssignee;
        this.store.dispatch(new LoadUsersListTriggered(usersInput));
    }

    searchCustomForms() {
        var customFormModel = new CustomFormFieldModel();
        customFormModel.moduleTypeId = this.moduleTypeId;
        customFormModel.referenceTypeId = this.referenceTypeId;
        customFormModel.referenceId = this.referenceId;
        this.assetService.searchCustomFields(customFormModel).subscribe((result) => {
            if (result.success == true) {
                this.customFields = result.data;
                this.customFieldsLength = this.customFields.length
            }
        });
    }

    getAllProductDetails() {
        const productDetailsSearchResult = new ProductDetails();
        productDetailsSearchResult.isArchived = false;
        this.store.dispatch(new LoadProductDetailsTriggered(productDetailsSearchResult));
        this.productDetailsList$ = this.store.pipe(select(assetModuleReducer.getProductDetailsAll));
    }

    getAllSuppliers() {
        const supplierSearchResult = new VendorManagement();
        supplierSearchResult.isArchived = false;
        this.store.dispatch(new LoadSuppliersTriggered(supplierSearchResult));
        this.suppliersList$ = this.store.pipe(select(assetModuleReducer.getSuppliersAll));
    }

    searchByProduct(productId, event) {
        if (productId === "all") {
            this.selectedProductId = productId;
            if (event == null) {
                this.productName = null;
            } else {
                this.productName = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else {
            this.selectedProductId = productId;
            this.productName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchByAsset(event) {
        if (event.keyCode == 13) {
            if (this.searchAssetCode.length > 0) {
                this.searchAssetCode = this.searchAssetCode.trim();
                if (this.searchAssetCode.length <= 0) return;
            }
            this.isEntered = true;
            this.displayAssetCode = this.searchAssetCode;
            this.getAllAssets();
        }
    }

    searchByAssetIcons() {
        if (this.searchAssetCode.length > 0) {
            this.searchAssetCode = this.searchAssetCode.trim();
            if (this.searchAssetCode.length <= 0) return;
        }
        this.isEntered = true;
        this.displayAssetCode = this.searchAssetCode;
        this.getAllAssets();
    }

    closeSearchByAsset() {
        if (this.isEntered) {
            this.searchAssetCode = "";
            this.displayAssetCode = "";
            this.getAllAssets();
        } else {
            this.searchAssetCode = "";
        }
    }

    search(event) {
        if (event.keyCode == 13) {
            if (this.searchText.length > 0) {
                this.searchText = this.searchText.trim();
                if (this.searchText.length <= 0) return;
            }
            this.isEnteredSearch = true;
            this.displaySearchText = this.searchText;
            this.getAllAssets();
        }
    }

    closeSearch() {
        if (this.isEnteredSearch) {
            this.searchText = "";
            this.displaySearchText = "";
            this.getAllAssets();
        } else {
            this.searchText = "";
        }
    }

    searchByAssignee(assigneeId, event) {
        if (assigneeId === "all") {
            this.selectedAssigneeId = assigneeId;
            if (event == null) {
                this.assigneeNames = null;
            } else {
                this.assigneeNames = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else {
            this.selectedAssigneeId = assigneeId;
            this.assigneeNames = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchBySupplier(supplierId, event) {
        if (supplierId === "all") {
            this.selectedSupplierId = supplierId;
            if (event == null) {
                this.supplierName = null;
            } else {
                this.supplierName = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else {
            this.selectedSupplierId = supplierId;
            this.supplierName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchByEmpty(checkedIsEmpty, event) {
        if (checkedIsEmpty == null) {
            this.isEmpty = null;
            if (event == null) {
                this.isAvailableValue = null;
            } else {
                this.isAvailableValue = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else if (checkedIsEmpty) {
            this.isEmpty = checkedIsEmpty;
            this.isAvailableValue = event.source.selected._element.nativeElement.innerText.trim();
        } else {
            this.isEmpty = checkedIsEmpty;
            this.isAvailableValue = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchByVendor(checkedVendor, event) {
        if (checkedVendor == null) {
            this.isVendor = null;
            if (event == null) {
                this.isVendorName = null;
            } else {
                this.isVendorName = event.source.selected._element.nativeElement.innerText.trim();
            }
        } else if (checkedVendor) {
            this.isVendor = checkedVendor;
            this.isVendorName = event.source.selected._element.nativeElement.innerText.trim();
        } else {
            this.isVendor = checkedVendor;
            this.isVendorName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchByEntityId(id, event) {
        this.selectedEntityId = id;
        if (event == null) {
            this.entityName = null;
        } else {
            this.entityName = event.source.selected._element.nativeElement.innerText.trim();
        }
        this.getAllAssets();
    }

    searchByUserStatus(e) {
        if (e == "true") {
            this.activeAssignees = "true";
            this.activeAssignee = true;
        } else {
            this.activeAssignees = "false";
            this.activeAssignee = false;
        }

        this.getAllAssets();
        this.getUsersList();
        this.searchByAssignee("all", null);
        this.cdRef.detectChanges();
    }

    getAllAssets() {
        const assetsSearchResult = new AssetInputModel();
        assetsSearchResult.productDetailsId = this.selectedProductId === "all" ? "" : this.selectedProductId;
        assetsSearchResult.assignedToEmployeeId = this.selectedAssigneeId === "all" ? "" : this.selectedAssigneeId;
        assetsSearchResult.supplierId = this.selectedSupplierId === "all" ? "" : this.selectedSupplierId;
        assetsSearchResult.searchAssetCode = this.searchAssetCode;
        assetsSearchResult.searchText = this.searchText;
        assetsSearchResult.isListOfAssetsPage = true;
        assetsSearchResult.isEmpty = this.isEmpty;
        assetsSearchResult.entityId = this.selectedEntityId;
        assetsSearchResult.isVendor = this.isVendor;
        assetsSearchResult.activeAssignee = this.activeAssignee;
        assetsSearchResult.purchasedDate = this.purchaseDate;
        assetsSearchResult.assignedDate = this.assignedDate;
        //  assetsSearchResult.isWriteOff = this.isWriteOff;
        this.assetSearchResultsData = assetsSearchResult;
    }

    resetAllFilters() {
        this.searchText = null;
        this.displaySearchText = null;
        this.searchAssetCode = null;
        this.displayAssetCode = null;
        this.selectedAssigneeId = null;
        this.assigneeNames = null;
        this.selectedProductId = null;
        this.productName = null;
        this.selectedSupplierId = null;
        this.supplierName = null;
        this.selectedEntityId = null;
        this.entityName = null;
        this.isEmpty = null;
        this.isAvailableValue = null;
        this.isVendor = null;
        this.isVendorName = null;
        this.activeAssignee = true;
        this.activeAssignees = "true";
        this.purchaseDate = null;
        this.assignedDate = null;
        this.isEntered = null;
        this.isEnteredSearch = null;
        //  this.isWriteOff = null;
        this.getUsersList();
        this.getAllAssets();
    }



    onPurchasedDateChange(event: MatDatepickerInputEvent<Date>) {
        if (event != null) {
            this.purchaseDate = event.target.value;
        } else {
            this.purchaseDate = null;
        }
        this.getAllAssets();
    }

    onAssignedDateChange(event: MatDatepickerInputEvent<Date>) {
        if (event != null) {
            this.assignedDate = event.target.value;
        } else {
            this.assignedDate = null;
        }
        this.getAllAssets();
    }

    filter() {
        if (this.displaySearchText || this.displayAssetCode || this.assigneeNames || this.entityName || this.productName || this.supplierName ||
            this.isAvailableValue || this.isVendorName || this.activeAssignees == "false" || this.assignedDate || this.purchaseDate) {
            return true;
        } else {
            return false;
        }
    }

    getEntityDropDown() {
        let searchText = "";
        this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.toaster.error(responseData.apiResponseMessages[0].message);
            } else {
                this.entities = responseData.data;
            }
        });
    }
    gotoAddAsset() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "50%";
        // dialogConfig.height = "0%";
        const dialg = this.dialog.open(AddAssetComponent, dialogConfig);
        dialg.afterClosed().subscribe(() => {
            this.getAllAssets();
        });

    }
    openCustomForm() {
        this.customFieldData = null;
        this.openDialog();
    }

    openDialog() {
        let dialogId = "app-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "62%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: this.moduleTypeId,
                referenceId: this.referenceId,
                referenceTypeId: this.referenceTypeId,
                customFieldComponent: this.customFieldData,
                isButtonVisible: true,
                formPhysicalId: dialogId,
                dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
    }

    editCustomForm() {
        this.customFieldData = this.customFields[0];
        this.openDialog();
    }

    closeDialog(result) {
        result.dialog.close();
        this.searchCustomForms();
    }

    getCustomFieldsLength(event) {
        this.customFieldsLength = event;
        this.cdRef.detectChanges();
    }

    deleteCustomForm() {
        this.anyOperationInProgress = true;
        let customField = this.customFields[0];
        var customFieldModel = new CustomFormFieldModel();
        customFieldModel.moduleTypeId = customField.moduleTypeId;
        customFieldModel.referenceId = customField.referenceId;
        customFieldModel.referenceTypeId = customField.referenceTypeId;
        customFieldModel.formName = customField.formName;
        customFieldModel.timeStamp = customField.timeStamp;
        customFieldModel.customFieldId = customField.customFieldId;
        customFieldModel.formJson = customField.formJson;
        customFieldModel.formKeys = customField.formKeys;
        customFieldModel.IsArchived = true;
        this.assetService.upsertcustomField(customFieldModel).subscribe((result) => {
            if (result.success === true) {
                this.searchCustomForms();
            } else {
                this.validationMessage = result.apiResponseMessages[0];
                this.toaster.success(this.validationMessage);
            }
            this.anyOperationInProgress = false;
        });
    }
}
