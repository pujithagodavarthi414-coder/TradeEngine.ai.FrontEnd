import { Component, Input, Output, EventEmitter, OnInit, ViewChildren } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import { AssetsExcelService } from "../services/assets-excel.service";
import { ListOfAssetsService } from "../services/list-of-assets.service";
import * as assetModuleReducer from "../store/reducers/index";
import { LoadAssetsTriggered, AssetsActionTypes, GetSelectedAssetTriggered, RemoveMultipleAssetsIdsCompleted, GetAssetsByIdsTriggered } from "../store/actions/assets.actions";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EmployeeListModel } from '../models/employee-model';
import { LoadEmployeeListItemsTriggered } from '../store/actions/employee-list.action';
import '../../globaldependencies/helpers/fontawesome-icons';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';

@Component({
  selector: "app-am-list-of-assets",
  templateUrl: `list-of-assets.component.html`
})

export class ListOfAssetsComponent implements OnInit {
  @Input("assetsSearchResult")
  set assetsSearchResult(data: AssetInputModel) {
    this.assetsSearchResults = data;
    this.pageIndex = 0;
    this.pageSize = 20;
    this.getAllAssets();
  }

  @Input("isFilterApplied")
  set _isFilterApplied(data: any) {
    this.isFilterApplied = data;
  }

  @Output() handleSelectedAssetId = new EventEmitter<string>();
  @ViewChildren("updateAssigneePopup") updateAssigneePopup;
  @ViewChildren("rootMenuTrigger") rootMenuTrigger;
  assetsList$: Observable<Assets[]>;
  assetsIdList: string[] = [];
  assetsList: Assets[];
  temp: Assets[];
  assetsListLoadingSpinner$: Observable<boolean>;
  anyOperationInProgress$: Observable<boolean>;
  userList$: Observable<EmployeeListModel[]>;
  assetsSearchResults: AssetInputModel;
  selectedUserId: string;
  totalAssetsCount: number;
  selectedAssetId: string;
  responseAssetId: string;
  loading$: Observable<boolean>;
  pageSize: number = 20;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [20, 40, 60, 80, 100];
  loading: boolean = false;
  updatingMultiple: boolean = false;
  selectedAssetIds: string[] = [];
  updateAssigneForm: FormGroup;
  updatedAssets: Assets[] = [];
  assetNumbers: string;
  isError: boolean;
  assetCodes: string;
  minDate: Date;
  maxDate: Date = new Date();
  isEntered: boolean = false;
  isFilterApplied: boolean = false;
  moduleTypeId = 2;
  referenceTypeId: string = ConstantVariables.ASSETSREFERENCEID;


  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private assetService: ListOfAssetsService, private router: Router,
    private assetsExcelService: AssetsExcelService, private snackbar: MatSnackBar, private translateService: TranslateService) {
    this.assetsList$ = this.store.pipe(select(assetModuleReducer.getAssetsAll));
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AssetsActionTypes.GetSelectedAssetCompleted),
        tap((result: any) => {
          if (result.selectedAssetId) {
            this.selectedAssetId = result.selectedAssetId;
            this.selectedAssetIds = [];
            this.selectedAssetIds.push(result.selectedAssetId);
          } else {
            this.selectedAssetId = null;
            this.selectedAssetIds = [];
          }
        })
      )
      .subscribe();

    this.loading$ = this.store.pipe(select(assetModuleReducer.getAssetsByIdsLoading));
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AssetsActionTypes.GetAssetsByIdsCompleted),
        tap(() => {
          this.closeUpsertMultipleAssetPopup();
        })
      )
      .subscribe();

    this.store.pipe(select(assetModuleReducer.getAssetsTotalCount)).subscribe((response) => {
      this.totalAssetsCount = response;
    })
  }

  ngOnInit() {
    this.getUsers();
    this.intializeUpdateForm();
  }

  getUsers() {
    const employeeSearchResult = new EmployeeListModel();
    employeeSearchResult.isArchived = false;
    employeeSearchResult.isActive = true;
    employeeSearchResult.sortDirectionAsc = true;
    this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeSearchResult));
    this.userList$ = this.store.pipe(select(assetModuleReducer.getEmployeeAll));
  }

  getAllAssets() {
    let assetsSearchResult = new AssetInputModel();
    assetsSearchResult = this.assetsSearchResults;
    assetsSearchResult.pageNumber = this.pageIndex + 1;
    assetsSearchResult.pageSize = this.pageSize;
    this.store.dispatch(new LoadAssetsTriggered(assetsSearchResult));
    this.assetsList$.subscribe((result: Assets[]) => {
      this.assetsIdList = result.map((x) => x.assetId);
      this.assetsList = result;
      this.temp = result;
    })
    this.assetsListLoadingSpinner$ = this.store.pipe(
      select(assetModuleReducer.getAssetLoading)
    );
  }

  getFilteredAssets(pageEvent) {
    if (pageEvent.pageSize != this.pageSize) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    this.getAllAssets();
  }

  selectedAsset(assetId, e) {
    if (!e.ctrlKey && !e.shiftKey) {
      if (assetId != this.selectedAssetId) {
        this.store.dispatch(new GetSelectedAssetTriggered(assetId));
      }
      this.selectedAssetId = assetId;
      this.selectedUserId = null;
      this.selectedAssetIds = [];
      this.selectedAssetIds.push(assetId);
    } else if (e.ctrlKey) {
      const index = this.selectedAssetIds.indexOf(assetId)
      if (index === -1) {
        this.selectedAssetIds.push(assetId);
      } else {
        this.selectedAssetIds.splice(index, 1);
      }
    } else if (e.shiftKey) {
      const startindex = this.assetsIdList.indexOf(this.selectedAssetId);
      const endindex = this.assetsIdList.indexOf(assetId)
      if (startindex >= endindex) {
        this.selectedAssetIds = this.assetsIdList.slice(endindex, startindex + 1);
      } else {
        this.selectedAssetIds = this.assetsIdList.slice(startindex, endindex + 1);
      }
    }
  }

  assetSelected(assetId) {
    if (this.selectedAssetIds.toString().includes(assetId)) {
      return true;
    } else {
      return false;
    }
  }

  printAssets() {
    this.loading = true;
    this.assetService.getAllUsersAssets(this.assetsSearchResults).subscribe((responseData: any) => {
      console.log(responseData)
      if (responseData.success && responseData.data && responseData.data.length > 0) {
        this.assetsExcelService.exportAsExcelFiles(this.getRequiredColumns(responseData.data), "assets")
      }
      this.loading = false;
    });
  }

  getRequiredColumns(dataList) {
    return dataList.map((excelItem) =>
      ({
        firstName: excelItem.userName,
        assets: excelItem.assets
      })
    );
  }

  intializeUpdateForm() {
    this.updateAssigneForm = new FormGroup({
      assignedToEmployeeId: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      assignedDateFrom: new FormControl(null,
        Validators.compose([
        ])
      ),
      approvedByUserId: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      )
    })
  }

  closeUpsertMultipleAssetPopup() {
    this.updateAssigneForm.reset();
    this.isError = false;
    this.assetNumbers = null;
    this.intializeUpdateForm();
    this.selectedAssetIds = [];
    this.selectedAssetIds.push(this.selectedAssetId);
    this.rootMenuTrigger.forEach((p) => p.closeMenu());
  }

  updateAssigneeAssets() {
    this.updatingMultiple = true;
    let assetsInput = new AssetInputModel();
    assetsInput = this.updateAssigneForm.value;
    assetsInput.isUpdateMultipleAssignee = true;
    assetsInput.assetIds = this.selectedAssetIds.toString();
    this.assetService.upsertMultipleAssets(assetsInput).subscribe((response: any) => {
      this.updatingMultiple = false;
      if (response.success) {
        this.updatedAssets = response.data;
        if (this.updatedAssets[0].failedCount > 0) {
          this.isError = true;
          this.assetNumbers = this.updatedAssets.map((x) => x.assetNumber).toString();
        } else {
          this.isError = false;
          if (this.assetsSearchResults.activeAssignee) {
            this.assetsSearchResults.assetIds = this.selectedAssetIds.toString();
            this.store.dispatch(new GetAssetsByIdsTriggered(this.assetsSearchResults));
          } else {
            this.store.dispatch(new RemoveMultipleAssetsIdsCompleted(this.selectedAssetIds));
            this.closeUpsertMultipleAssetPopup();
          }
          this.store.dispatch(new GetSelectedAssetTriggered(this.selectedAssetId));
          this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForAssetUpdated), "Ok",
            { duration: 3000 });
        }
      } else {
        this.closeUpsertMultipleAssetPopup();
      }
    });
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger, element: Assets) {
    event.preventDefault();
    this.updateAssigneForm.reset();
    // this.updateAssigneForm = new FormGroup({
    //   assignedToEmployeeId: new FormControl(element.assignedToEmployeeId,
    //     Validators.compose([
    //       Validators.required
    //     ])
    //   ),
    //   assignedDateFrom: new FormControl(element.assignedDateFrom,
    //     Validators.compose([
    //     ])
    //   ),
    //   approvedByUserId: new FormControl(element.approvedByUserId,
    //     Validators.compose([
    //       Validators.required
    //     ])
    //   )
    // })
    this.isError = false;
    this.assetNumbers = null;

    var assets = this.assetsList;
    var selectedAssets = [];

    var assetIdList = this.selectedAssetIds.toString();
    assets.forEach((x) => {
      if (assetIdList.includes(x.assetId)) {
        selectedAssets.push(x);
      }
    })

    var temp = new Date();
    if (selectedAssets.length > 0) {
      temp = selectedAssets[0].purchasedDate;
      for (let i = 0; i < selectedAssets.length; i++) {
        var date = selectedAssets[i].purchasedDate;
        if (date > temp) {
          temp = date;
        }
      }
    }

    this.minDate = temp;

    if (this.selectedAssetIds.length == 1) {
      if (element.assetId != this.selectedAssetId) {
        this.store.dispatch(new GetSelectedAssetTriggered(element.assetId));
      }
      this.selectedAssetId = element.assetId;
      this.selectedAssetIds = [];
      this.selectedAssetIds.push(this.selectedAssetId);
    }
    viewChild.openMenu();
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
