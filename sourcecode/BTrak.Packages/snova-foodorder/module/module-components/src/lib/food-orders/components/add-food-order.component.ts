import { Component, Output, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ofType, Actions } from '@ngrx/effects';
import { tap, takeUntil, map } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';

import { FoodOrderModel, FoodOrderManagementApiInput } from '../models/all-food-orders';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';
import * as fileReducer from '@snovasys/snova-file-uploader';
import { FoodOrderActionTypes, CreateFoodOrderTriggered, LoadFoodOrdersTriggered } from '../store/actions/food-order.actions';
import { User } from '../models/induction-user-model';
import { Currency } from '../models/currency';
import { CurrencyActionTypes, LoadCurrencyTriggered } from '../store/actions/currency.actions';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { FoodOrderService } from '../services/food-order.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-hr-component-addfoodorder",
  templateUrl: "add-food-order.component.html",
})

export class AddFoodOrderComponent implements OnInit {
  @Input() foodOrderDetails: FoodOrderModel;
  @Input() foodOrderManagementApiInputModel: FoodOrderManagementApiInput;
  @Output() closePopup = new EventEmitter<string>();

  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;

  foodOrderForm: FormGroup;

  foodOrder: FoodOrderModel;
  receiptsFormData = new FormData();
  usersList: User[];

  selectedUsersList: string;
  maxDate = new Date();
  moduleTypeId = 3;
  referenceTypeId = ConstantVariables.FoodOrderReferenceTypeId;
  selectedStoreId: null;
  selectedParentFolderId: null;
  isFileExist: boolean;
  referenceId: string = "";

  userDropDownListData: User[];
  currencyList$: Observable<Currency[]>;
  currencyList: Currency[];
  anyOperationInProgress$: Observable<boolean>;
  fileUploadInProgress$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  isToUploadFiles: boolean = false;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private foodOrderService: FoodOrderService) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(FoodOrderActionTypes.CreateFoodOrderCompleted),
        tap(() => {
          this.store.pipe(select(hrManagementModuleReducer.getUpsertedFoodOrderId)).subscribe(result => this.foodOrder.foodOrderId = result);
          this.store.pipe(select(hrManagementModuleReducer.getUpsertedFoodOrderId)).subscribe(result => {
            this.referenceId = result;
          });
          this.isToUploadFiles = true;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CurrencyActionTypes.LoadCurrencyCompleted),
        tap(() => {
          this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll)).subscribe(result => {
            this.currencyList = result;
          });
        })
      )
      .subscribe();

    const upsertingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.createFileLoading));
    const uploadingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.getFileUploadLoading));

    this.fileUploadInProgress$ = combineLatest(
      uploadingFilesInProgress$,
      upsertingFilesInProgress$
    ).pipe(map(
      ([
        uploadingFilesInProgress,
        upsertingFilesInProgress
      ]) =>
        uploadingFilesInProgress ||
        upsertingFilesInProgress
    ));
  }

  ngOnInit() {
    this.clearFoodOrderForm();
    this.getCurrencyList();
    this.getUsersList();
    this.anyOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createFoodOrderLoading)
    );
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  closeFilePopup() {
    this.clearFoodOrderForm();
    this.closePopup.emit();
    this.formGroupDirective.resetForm();
    this.store.dispatch(new LoadFoodOrdersTriggered(this.foodOrderManagementApiInputModel));
  }

  getCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
    this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
  }

  getUsersList() {
    // this.store.dispatch(new LoadUsersTriggered());
    // this.userDropDownListData = this.store.pipe(select(hrManagementModuleReducer.getUsersAll));
    this.foodOrderService.GetAllUsers().subscribe((response: any) => {
      if (response.success == true) {
        this.userDropDownListData = response.data;
        this.usersList = response.data;
      }
    });
  }

  clearFoodOrderForm() {
    this.receiptsFormData = new FormData();
    this.foodOrderForm = new FormGroup({
      orderedDate: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      foodOrderItems: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.CommentsMaxLength)
        ])
      ),
      memberId: new FormControl("", [
      ]),
      amount: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(100000)
        ])
      ),
      comment: new FormControl("", [
      ]),
      file: new FormControl(null, [
      ])
    });
  }

  upsertFoodOrder() {
    let indinaCurrencyId = null;
    this.isToUploadFiles = false;
    if (this.currencyList && this.currencyList.length > 0) {
      indinaCurrencyId = this.currencyList.find(x => x.currencyName.toLowerCase() == "indian rupee").currencyId;

      if (!indinaCurrencyId) {
        indinaCurrencyId = this.currencyList[0].currencyId;
      }
    }

    this.foodOrder = this.foodOrderForm.value;
    this.foodOrder.currencyId = indinaCurrencyId;
    this.store.dispatch(new CreateFoodOrderTriggered(this.foodOrder));
    this.anyOperationInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createFoodOrderLoading))
  }

  closeAddFoodOrderPopup() {
    this.clearFoodOrderForm();
    this.formGroupDirective.resetForm();
    this.closePopup.emit();
  }

  toggleAllUsersSelected() {
    if (this.allSelected.selected) {
      if (this.usersList.length === 0) {
        this.foodOrderForm.controls.memberId.patchValue([]);
      } else {
        this.foodOrderForm.controls.memberId.patchValue([
          ...this.usersList.map(item => item.id),
          0
        ]);
      }
    } else {
      this.foodOrderForm.controls.memberId.patchValue([]);
    }
    this.getUserslistByUserId();
  }

  toggleUserPerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.foodOrderForm.controls.memberId.value.length === this.usersList.length) {
      this.allSelected.select();
    }
  }

  getUserslistByUserId() {
    // let selectedUser = this.selectedUserIds;
    const selectedUser = this.foodOrderForm.get('memberId').value;
    const index = selectedUser.indexOf("0");
    if (index > -1) {
      selectedUser.splice(index, 1);
    }
    const usersList = this.usersList;
    const users = _.filter(usersList, function (status) {
      return selectedUser.toString().includes(status.id);
    })
    const userNames = users.map(x => x.fullName);
    this.selectedUsersList = userNames.toString();
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.subscribe;
  }
}
