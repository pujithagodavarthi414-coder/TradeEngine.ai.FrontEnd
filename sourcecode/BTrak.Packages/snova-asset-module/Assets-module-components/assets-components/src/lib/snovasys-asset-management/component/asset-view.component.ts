import { Component, ViewChild, Input, ChangeDetectorRef,EventEmitter, Output } from "@angular/core";
import { Observable, combineLatest, Subject } from "rxjs";
import { select, Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { map, takeUntil, tap } from "rxjs/operators";
import { SatPopover } from "@ncstate/sat-popover";
import { Router } from "@angular/router";
import { Assets } from "../models/asset";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from "../store/reducers/index";
import { AssetsActionTypes } from "../store/actions/assets.actions";
import { CompanysettingsModel } from '../models/company-model';
import { AssetService } from '../services/assets.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';


@Component({
  selector: "app-am-asset-view",
  templateUrl: `asset-view.component.html`
})

export class AssetViewComponent extends CustomAppBaseComponent {
  @ViewChild("writeoffPopover") writeOffPopover: SatPopover;
  @ViewChild("commentPopover") commentPopover: SatPopover;
  @Input() activeAssignee: boolean;
  @Input("reload")
  set _reload(data: string) {
    this.reload = data;
  }
  @Output() getCustomFieldsLength = new EventEmitter<number>();
  anyOperationInProgress$: Observable<boolean>;
  selectedAssetData$: Observable<Assets>;
  assetsList$: Observable<Assets[]>;
  commentsAndHistory$: Observable<any[]>;
  assetDetails: Assets;
  reload: string;
  validationMessage: string;
  editAssets: boolean;
  closeEditForm: boolean;
  getCommentsInProgress: boolean = false;
  saveCommentsSpinner: boolean;
  iscpu: boolean = false;
  assetValue: string;
  assetIdForComments: string;
  usingAssetId: boolean = true;
  isMACApplicable: boolean = false;
  isNoData: boolean = false;
  referenceTypeId : string = ConstantVariables.ASSETSREFERENCEID;
  moduleTypeId: number = 2
  public ngDestroyed$ = new Subject();

  constructor(private cdRef: ChangeDetectorRef, private actionUpdates$: Actions, private store: Store<State>,
    private assetService: AssetService) {
    super();
    this.closeForm();
    const assetsListLoadingSpinner$ = this.store.pipe(select(assetModuleReducer.getAssetLoading));
    const getAssetByIdLoadingSpinner$ = this.store.pipe(select(assetModuleReducer.gettingAssetByIdLoading));

    this.anyOperationInProgress$ = combineLatest(
      assetsListLoadingSpinner$,
      getAssetByIdLoadingSpinner$
    ).pipe(map(
      ([
        assetsListLoadingSpinner,
        getAssetByIdLoadingSpinner
      ]) =>
        assetsListLoadingSpinner ||
        getAssetByIdLoadingSpinner
    ));

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AssetsActionTypes.GetSelectedAssetCompleted),
        tap((result: any) => {
          if (result.selectedAssetId && result.selectedAssetId.trim().length > 0) {
            this.editAssets = false;
            this.closeEditForm = false;
            this.isNoData = false;
            this.getAssetById(result.selectedAssetId);
          } else {
            this.isNoData = true;
            this.closeForm();
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getAllCompanySettings();
  }

  enableDisableForm() {
    this.editAssets = true;
  }

  getAssetById(assetId) {
    this.assetIdForComments = "";
    this.cdRef.detectChanges();
    this.selectedAssetData$ = this.store.pipe(select(assetModuleReducer.getAssetDetailsByAssetIdFromGetAssetsAll, { assetId: assetId }));
    this.selectedAssetData$.subscribe((result) => {
      if (result) {
        this.assetDetails = result;
        this.assetIdForComments = this.assetDetails.assetId;
      }
      else {
        this.assetsList$ = this.store.pipe(select(assetModuleReducer.getAssetsAll));
        this.assetsList$.subscribe(x => {
          if (x && x.length > 0) {
            let data = x[0];
            this.assetDetails = data;
            this.assetIdForComments = data.assetId;
          }
        });
      }
    });
  }

  closeAssetsViewAndEdit(closeEdit) {
    this.closeEditForm = closeEdit;
  }

  discardAssetChanges(close) {
    this.editAssets = close;
  }

  closeForm() {
    this.closeEditForm = true;
  }

  cancelDeletion() {
    this.writeOffPopover.close();
  }

  cancelComments() {
    this.commentPopover.close();
  }

  checkForMACAddress(value: string) {
    if ((value.toUpperCase() == "CPU" || value.toUpperCase() == "LAPTOP") && this.isMACApplicable) {
      return true;
    } else {
      return false;
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

  getCustomFieldLength(event) {
    this.getCustomFieldsLength.emit(event);
  }

  refreshFields(event) {
    this.getCustomFieldsLength.emit(event);
  }

  updateEvent(event) {
    this.getCustomFieldsLength.emit(event);
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
