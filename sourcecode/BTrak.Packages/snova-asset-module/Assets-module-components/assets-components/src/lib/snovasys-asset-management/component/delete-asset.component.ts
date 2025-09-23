import { Component, Output, EventEmitter, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Assets } from "../models/asset";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from '../store/reducers/index';
import { AssetsActionTypes, CreateAssetsTriggered } from "../store/actions/assets.actions";
import { User } from '../models/user';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LoadUsersTriggered } from '../store/actions/users.actions';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-am-component-delete-asset",
    templateUrl: `delete-asset.component.html`
})

export class DeleteAssetComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input('assetDetails')
    set assetDetails(data: Assets) {
        if (data) {
            this.assetDetailsForm = data;
            this.minDateForDamageDate = this.assetDetailsForm.purchasedDate;
        }
        else {
            this.assetDetailsForm = null;
        }
    }
    @Output() closePopup = new EventEmitter<string>();
    assetDeleteForm: FormGroup;
    assetDetailsForm: Assets;
    isDamaged: boolean;
    minDateForDamageDate: Date;
    maxDate = new Date();
    selectUserDropDownListData$: Observable<User[]>;
    updateAssetInProgress$: Observable<boolean>;
    assetId$: Observable<string>;

    constructor(private store: Store<State>, private actionUpdates$: Actions) {
        super();
        this.actionUpdates$
            .pipe(
                ofType(AssetsActionTypes.CreateAssetsCompleted),
                tap(() => {
                    this.updateAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
                    this.cancelDeletion();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearAssetDeleteForm();
        this.updateAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
        if (this.canAccess_feature_MarkDamagedAssest) {
            this.getUsersList();
        }
    }

    getUsersList() {
        this.store.dispatch(new LoadUsersTriggered());
        this.selectUserDropDownListData$ = this.store.pipe(select(assetModuleReducer.getUsersAll));
    }

    clearAssetDeleteForm() {
        this.assetDeleteForm = new FormGroup({
            damagedByUserId: new FormControl('',
                Validators.compose([
                    Validators.required,
                ])
            ),
            damagedReason: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            ),
            damagedDate: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            )
        });
    }

    cancelDeletion() {
        this.formDirective.resetForm();
        this.clearAssetDeleteForm();
        this.closePopup.emit("");
    }

    deleteAsset() {
        let assetDetailsData = new Assets();
        assetDetailsData.assetId = this.assetDetailsForm.assetId;
        assetDetailsData.assetNumber = this.assetDetailsForm.assetNumber;
        assetDetailsData.assetName = this.assetDetailsForm.assetName;
        assetDetailsData.productDetailsId = this.assetDetailsForm.productDetailsId;
        assetDetailsData.purchasedDate = this.assetDetailsForm.purchasedDate;
        assetDetailsData.assignedDateFrom = this.assetDetailsForm.assignedDateFrom;
        assetDetailsData.approvedByUserId = this.assetDetailsForm.approvedByUserId;
        assetDetailsData.assignedToEmployeeId = this.assetDetailsForm.assignedToEmployeeId;
        assetDetailsData.cost = this.assetDetailsForm.cost;
        assetDetailsData.currencyId = this.assetDetailsForm.currencyId;
        assetDetailsData.branchId = this.assetDetailsForm.branchId;
        assetDetailsData.seatingId = this.assetDetailsForm.seatingId;
        assetDetailsData.timeStamp = this.assetDetailsForm.timeStamp;
        assetDetailsData.damagedByUserId = this.assetDeleteForm.value.damagedByUserId;
        assetDetailsData.damagedReason = this.assetDeleteForm.value.damagedReason;
        assetDetailsData.damagedDate = this.assetDeleteForm.value.damagedDate;
        assetDetailsData.assetUniqueNumber = this.assetDetailsForm.assetUniqueNumber;
        assetDetailsData.assetUniqueNumberId = this.assetDetailsForm.assetUniqueNumberId;
        assetDetailsData.isWriteOff = true;
        assetDetailsData.isEmpty = this.assetDetailsForm.isEmpty;
        assetDetailsData.isVendor =  this.assetDetailsForm.isVendor;
        this.store.dispatch(new CreateAssetsTriggered(assetDetailsData));
        this.updateAssetInProgress$ = this.store.pipe(select(assetModuleReducer.createAssetLoading));
    }
}