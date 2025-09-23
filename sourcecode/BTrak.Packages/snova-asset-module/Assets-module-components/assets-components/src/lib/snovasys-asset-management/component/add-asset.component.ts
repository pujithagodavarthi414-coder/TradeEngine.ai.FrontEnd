import { Component, ViewChild, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { ToastrService } from "ngx-toastr";
import { SatPopover } from "@ncstate/sat-popover";
import { Currency } from "../models/currency";
import { CustomFormFieldModel, ProductDetails } from "../models/product-details";
import { Assets } from "../models/asset";
import { LocationManagement } from "../models/location-management";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from "../store/reducers/index";
import { LoadCurrencyTriggered } from "../store/actions/currency.actions";
import { LoadUsersTriggered } from "../store/actions/users.actions";
import { LoadProductDetailsTriggered } from "../store/actions/product-details.actions";
import { CreateAssetsTriggered, AssetsActionTypes } from "../store/actions/assets.actions";
import { LoadBranchTriggered } from "../store/actions/branch.actions";
import { LoadLocationsTriggered } from "../store/actions/location.actions";
import * as _ from "underscore";
import { User } from '../models/user';
import { Branch } from '../models/branch';
import { CompanysettingsModel } from '../models/company-model';
import { AssetService } from '../services/assets.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
  selector: "app-am-component-add-asset",
  templateUrl: `add-asset.component.html`
})

export class AddAssetComponent extends CustomAppBaseComponent {
  @Input("selectedAssetData")
  set selectedAssetData(data: string) {
    this.isreload = null;
    if (isNullOrUndefined(data)) {
      this.newAssest = true;
      this.closeForm();
      this.referenceId = null;
    } else {
      this.assetDetails = data;
      this.newAssest = false;

      this.referenceId = this.assetDetails.assetId;
      this.editForm = true;
      this.assetDetailsForm.patchValue(this.assetDetails);
      this.assetValue = this.assetDetails.assetName;
      this.startDate();
      if (this.assetDetails.branchId) {
        this.branchSelected(this.assetDetails.branchId)
      }
      if (this.assetDetailsForm.value.assetName.toUpperCase() == "CPU") {
        this.assetDetailsForm.controls["assetUniqueNumber"].setValidators([Validators.required,
        Validators.maxLength(12),
        Validators.minLength(12)]);
        this.isRequired = true;
      }
    }
  }

  @Input("activeAssignee") set _activeAssignee(data: boolean) {
    this.activeAssignee = data;
  }

  @Output() closeAssetsViewAndEdit = new EventEmitter<boolean>();
  @Output() discardAssetChanges = new EventEmitter<boolean>();
  @Output() refreshCustomField = new EventEmitter<string>();
  @Output() updateCustomFields = new EventEmitter<number>();
  @ViewChild("addNewProductDetails") addNewProductDetails: SatPopover;
  @ViewChild("writeoffPopover") writeOffPopover: SatPopover;
  @ViewChild("commentPopover") commentPopover: SatPopover;
  @ViewChild("addNewCurrencyDetails") addNewCurrencyDetails: SatPopover;
  @Output() closeMatDialog = new EventEmitter<string>();

  isAnyAppSelected = false;
  savingAssetInProgress$: Observable<boolean>;
  updateAssetInProgress$: Observable<boolean>;
  saveAssetAndClearInProgress$: Observable<boolean>;
  assetId$: Observable<string>;
  productDetailsList$: Observable<ProductDetails[]>;
  currencyList$: Observable<Currency[]>;
  assetsList$: Observable<Assets[]>;
  assetsListGridSpinner$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  selectUserDropDownListData$: Observable<User[]>;
  branchList$: Observable<Branch[]>;
  moduleTypeId = 2;
  referenceTypeId: string = ConstantVariables.ASSETSREFERENCEID;
  referenceId: string = ConstantVariables.ASSETSREFERENCEID;
  locationList$: Observable<LocationManagement[]>;
  newAssest: boolean;
  isreload: string;
  public ngDestroyed$ = new Subject();

  private assetDetailsData: Assets;

  assetDetailsForm: FormGroup;
  assetDetails;
  assetDeleteForm: Assets;
  assetCommentsForm: FormGroup;

  buttonType: string;
  minDateForDamageDate: Date;
  minDate = new Date(1753, 0, 1);
  maxDate = new Date();
  closeEditForm: boolean;
  isDamaged: boolean;
  editForm: boolean;
  validationMessage: string;
  upsertCommentsInProgress: boolean;
  isBranchCode: boolean = true;
  selectedSeatCode: string;
  assetValue: string;
  minDateForEndDate = new Date();
  endDateBool: boolean = true;
  selectUserDropDownListData: User[];
  assignedMember: string;
  approvedMember: string;
  isRequired: boolean = false;
  activeAssignee: boolean;
  roleFeaturesIsInProgress$: Observable<boolean>;
  isMACApplicable: boolean = false;
  containsSpecialChar: boolean;
  assetReferenceId: string;
  customFields: CustomFormFieldModel[];
  customFieldsLength: number;

  constructor(private routes: Router, private store: Store<State>, private assetService: AssetService,
    private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddAssetComponent>) {
    super();
    this.clearAssetDetailsForm();
    this.searchCustomForms();
    this.isAnyAppSelected = false;

    this.actionUpdates$
      .pipe(
        ofType(AssetsActionTypes.CreateAssetsCompleted),
        tap(() => {
          let assetId;
          this.assetId$ = this.store.pipe(select(assetModuleReducer.getAssetIdOfUpsertAsset));
          this.assetId$.subscribe((x) => assetId = x);
          if (this.newAssest) {
            this.assetReferenceId = assetId;
            this.cdRef.detectChanges();
          }
          if (this.buttonType === "Save") {
            // this.routes.navigate(["listofassets"]);
            this.routes.navigate(["assetmanagement/allassets"]);
            this.clearAssetDetailsForm();
          } else if (this.buttonType === "SaveAndClear") {
            this.clearAssetDetailsForm();
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getAllCompanySettings();
    this.anyOperationInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
    this.updateAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
    if (this.canAccess_feature_AddOrUpdateAsset) {
      this.getAllProductDetails();
      this.getCurrencyList();
      this.getUsersList();
      this.getAllBranches();
      if (this.assetDetailsForm.value.assignedToEmployeeId != null) {
        this.getassignedToEmployee(this.assetDetailsForm.value.assignedToEmployeeId);
      }

      if (this.assetDetailsForm.value.approvedByUserId != null) {
        this.getApprovedByEmployee(this.assetDetailsForm.value.approvedByUserId);
      }
    }
  }

  getAllCompanySettings() {
    var companysettingsModel = new CompanysettingsModel();
    companysettingsModel.isArchived = false;
    this.assetService.getAllCompanySettings(companysettingsModel).subscribe((response: any) => {
      if (response.success == true && response.data.length > 0) {
        let companyResult = response.data.filter(item => item.key == "ConsiderMACAddressInEmployeeScreen");
        this.isMACApplicable = companyResult[0].value == "0" ? true : false;
      }
    });
  }

  getAllProductDetails() {
    const productDetailsSearchResult = new ProductDetails();
    productDetailsSearchResult.isArchived = false;
    this.store.dispatch(new LoadProductDetailsTriggered(productDetailsSearchResult));
    this.productDetailsList$ = this.store.pipe(select(assetModuleReducer.getProductDetailsAll));
  }

  getCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
    this.currencyList$ = this.store.pipe(select(assetModuleReducer.getCurrencyAll));
  }

  getUsersList() {
    this.store.dispatch(new LoadUsersTriggered());
    this.selectUserDropDownListData$ = this.store.pipe(select(assetModuleReducer.getUsersAll));
    this.selectUserDropDownListData$.subscribe(s => (this.selectUserDropDownListData = s));
  }

  closeProductDetails() {
    this.addNewProductDetails.close();
  }

  emptySeatingId() {
    this.assetDetailsForm.controls["seatingId"].setValue("");
  }

  branchSelected(branchId) {
    const locationSearchResult = new LocationManagement;
    locationSearchResult.branchId = branchId;
    locationSearchResult.isArchived = false;
    this.store.dispatch(new LoadLocationsTriggered(locationSearchResult));
    this.locationList$ = this.store.pipe(select(assetModuleReducer.getLocationsAll));
  }

  seatCodeSelected(SeatCode) {
    this.selectedSeatCode = SeatCode;
  }

  getAllBranches() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(assetModuleReducer.getBranchAll));
  }

  startDate() {
    if (this.assetDetailsForm.value.purchasedDate) {
      this.minDateForEndDate = this.assetDetailsForm.value.purchasedDate;
      this.endDateBool = false;
    } else {
      this.endDateBool = true;
      this.assetDetailsForm.controls["assignedDateFrom"].setValue("");
    }
  }

  clearAssetDetailsForm() {
    this.assetDetails = "";
    this.assetDetailsForm = new FormGroup({
      assetNumber: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      assetName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      productDetailsId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      purchasedDate: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      assignedDateFrom: new FormControl("",
        Validators.compose([
        ])),
      approvedByUserId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      assignedToEmployeeId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      cost: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(99999999999999999)
        ])
      ),
      currencyId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      seatingId: new FormControl("", [
      ]),
      assetUniqueNumber: new FormControl("",
        Validators.compose([
          Validators.maxLength(12),
          Validators.minLength(12),
          Validators.pattern(/^[A-Za-z0-9]+$/)
        ])
      ),
      branchId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      isVendor: new FormControl(false, [
      ]),
      isEmpty: new FormControl(false, [
      ])
    })
    this.endDateBool = true;
    this.buttonType = "";
    this.assetDetailsForm.controls["assetUniqueNumber"].clearValidators();
    this.isRequired = false;
    this.assetValue = null;
  }

  closeAssetsForm() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
    this.cdRef.detectChanges();
    this.clearAssetDetailsForm();
  }


  getCustomFieldLength(event) {
    this.updateCustomFields.emit(event);
    //  this.refreshCustomField.emit(event);
  }


  getassignedToEmployee(selectedEvent) {
    var membersList = this.selectUserDropDownListData;
    var filteredList = _.find(membersList, function (member) {
      return member.id == selectedEvent;
    })
    if (filteredList) {
      this.assignedMember = filteredList.fullName;
      this.cdRef.detectChanges();
    }
  }

  getApprovedByEmployee(selectedEvent) {
    var membersList = this.selectUserDropDownListData;
    var filteredList = _.find(membersList, function (member) {
      return member.id == selectedEvent;
    })
    if (filteredList) {
      this.approvedMember = filteredList.fullName;
      this.cdRef.detectChanges();
    }
  }

  changeValidators() {
    if ((this.assetValue.toUpperCase().trim() == "CPU" || this.assetValue.toUpperCase().trim() == "LAPTOP") && this.isMACApplicable) {
      this.assetDetailsForm.controls["assetUniqueNumber"].setValidators([Validators.required,
      Validators.maxLength(12),
      Validators.minLength(12),
      Validators.pattern(/^[A-Za-z0-9]+$/)]);
      this.isRequired = true;
    } else {
      this.assetDetailsForm.controls["assetUniqueNumber"].clearValidators();
      this.isRequired = false;
    }
    this.assetDetailsForm.controls["assetUniqueNumber"].updateValueAndValidity();
  }

  saveAssetDetails(buttonType) {
    this.buttonType = buttonType;
    this.assetDetailsData = this.assetDetailsForm.value;
    this.assetDetailsData.activeAssignee = this.activeAssignee;
    if (this.editForm) {
      this.assetDetailsData.assetId = this.assetDetails.assetId;
      this.assetDetailsData.assetUniqueNumberId = this.assetDetails.assetUniqueNumberId;
      this.assetDetailsData.timeStamp = this.assetDetails.timeStamp;
      if (this.assetDetails.isWriteOff) {
        this.assetDetailsData.isWriteOff = this.assetDetails.isWriteOff;
        this.assetDetailsData.damagedByUserId = this.assetDetails.damagedByUserId;
        this.assetDetailsData.damagedReason = this.assetDetails.damagedReason;
        this.assetDetailsData.damagedDate = this.assetDetails.damagedDate;
      }
    }
    this.store.dispatch(new CreateAssetsTriggered(this.assetDetailsData));
    this.anyOperationInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading))
    if (buttonType === "Save") {
      this.savingAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
      this.dialogRef.close(this.isAnyAppSelected);
    }
    if (buttonType === "SaveAndClear") {
      this.saveAssetAndClearInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
    } else {
      this.updateAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
    }

  }
  appsSelected(app) {
    this.isAnyAppSelected = true;
    this.closeMatDialog.emit(app);
  }

  cancelDeletion() {
    this.writeOffPopover.close();
  }

  cancelComments() {
    this.commentPopover.close();
  }

  cancelCurrency(data) {
    if (data) {
      this.getCurrencyList();
    }
    this.addNewCurrencyDetails.close();
  }

  closeForm() {
    this.closeAssetsViewAndEdit.emit(true);
  }

  discardChanges() {
    this.discardAssetChanges.emit(false);
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  gotoAllAssets() {
    this.dialogRef.close(this.isAnyAppSelected);
    // this.routes.navigate(['listofassets']);
    // this.routes.navigate(['assetmanagement/allassets']);
  }
  outputs = {
    appsSelected: app => {
      if (app == null)
        this.dialogRef.close(this.isAnyAppSelected);
      else {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
      }

    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
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
}
