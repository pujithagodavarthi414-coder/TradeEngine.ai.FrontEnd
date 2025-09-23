import { Component, EventEmitter, Output, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { ToastrService } from "ngx-toastr";
import { ValidationModel } from "../models/validation-messages";
import * as assetModuleReducer from "../store/reducers/index";
import { VendorManagement } from '../models/vendor-management';
import { CreateSupplierTriggered, SupplierActionTypes } from '../store/actions/supplier.actions';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-supplier",
  templateUrl: "./suppliers.component.html",
})

export class SupplierComponent {
  @Input() selectedSupplierDetails: VendorManagement;
  @Input("editSupplier")
  set editSupplier(data: boolean) {
    this.editVendor = data;
    if (data) {
      this.vendorDetailsData = this.selectedSupplierDetails;
      this.vendorForm.patchValue(this.vendorDetailsData);
    } else
      this.clearForm();
  };
  @Output() closePopup = new EventEmitter<string>();
  @ViewChild("formDirective") formDirective:FormGroupDirective;
  supplier$: Observable<VendorManagement>;
  savingVendorInProgress$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  supplierValidations: ValidationModel[];
  private vendorData: VendorManagement;
  vendorForm: FormGroup;
  vendorDetailsData;
  editVendor: boolean;
  maxStartedWorkingDate = new Date();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService) {
    this.actionUpdates$
      .pipe(
        ofType(SupplierActionTypes.CreateSupplierCompleted),
        tap(() => {
          this.formDirective.resetForm();
          this.clearForm();
          this.closePopup.emit("");
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (this.editSupplier) {
      this.vendorForm.patchValue(this.selectedSupplierDetails);
    } else {
      this.clearForm();
    }
    this.anyOperationInProgress$ = this.store.pipe(
      select(assetModuleReducer.createSupplierLoading)
    );
  }

  closeDialog() {
    this.clearForm();
    this.formDirective.resetForm();
    this.closePopup.emit("");
  }

  clearForm() {
    this.vendorDetailsData = "";
    this.vendorForm = new FormGroup({
      supplierName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ])
      ),
      supplierCompanyName: new FormControl("",
        Validators.compose([
          Validators.maxLength(250)
        ])
      ),
      contactPerson: new FormControl("",
        Validators.compose([
          Validators.maxLength(250)
        ])
      ),
      contactPosition: new FormControl("",
        Validators.compose([
          Validators.maxLength(250)
        ])
      ),
      companyPhoneNumber: new FormControl("",
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      contactPhoneNumber: new FormControl("",
        Validators.compose([
          Validators.maxLength(20)
        ])
      ),
      vendorIntroducedBy: new FormControl("",
        Validators.compose([
          Validators.maxLength(250)
        ])
      ),
      startedWorkingFrom: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      )
    })
  }

  saveVendor() {
    this.vendorData = this.vendorForm.value;
    if(this.vendorDetailsData.supplierId){
      this.vendorData.supplierId = this.vendorDetailsData.supplierId;
      this.vendorData.timeStamp = this.vendorDetailsData.timeStamp;
    }
    this.store.dispatch(new CreateSupplierTriggered(this.vendorData));
    this.savingVendorInProgress$ = this.store.pipe(select(assetModuleReducer.createSupplierLoading));
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
}