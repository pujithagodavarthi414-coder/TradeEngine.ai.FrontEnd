import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import { LoadBranchTriggered } from "../store/actions/branch.actions";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from "../store/reducers/index";
import { Actions, ofType } from "@ngrx/effects";
import { AssetsActionTypes, LoadAssetsTriggered } from "../store/actions/assets.actions";
import { takeUntil, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { AssetsPreviewComponent } from "./assets-preview.component";
import { User } from '../models/user';
import { Branch } from '../models/branch';
import { LoadUsersTriggered } from '../store/actions/users.actions';
import { SoftLabelConfigurationModel } from '../models/softlabelconfiguration.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-assets-report",
  templateUrl: `assets-report.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetsReportComponent implements OnInit {
  assetsAllocatedToEmployeesList$: Observable<Assets[]>;
  selectUserDropDownListData$: Observable<User[]>;
  assetsListGridSpinner$: Observable<boolean>;
  branchList$: Observable<Branch[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  userId: string = "";
  branchId: string = "";
  searchAssetCode: string = "";
  searchByAssetName: boolean = false;
  searchByEmployee: boolean = false;
  searchByBranch: boolean = false;
  isFiltersVisible: boolean = false;
  assetsAllocatedToEmployeesList: any;
  isAssetsExist: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private dialog: MatDialog) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AssetsActionTypes.LoadAssetsCompleted),
        tap(() => {
          this.assetsAllocatedToEmployeesList$ = this.store.pipe(select(assetModuleReducer.getAssetsAll));
          this.assetsAllocatedToEmployeesList$.subscribe((result) => {
            this.assetsAllocatedToEmployeesList = result;

            if (this.assetsAllocatedToEmployeesList != null && this.assetsAllocatedToEmployeesList.length > 0)
              this.isAssetsExist = true;
            else
              this.isAssetsExist = false;
          })
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.getSoftLabels();
    this.getAllAssets();
    this.getAllBranches();
    this.getUsersList();
  }

  getSoftLabels() {
    this.softLabels$ = this.store.pipe(select(assetModuleReducer.getSoftLabelsAll));
    this.softLabels$.subscribe((x) => this.softLabels = x);
  }

  showFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  getAllBranches() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(assetModuleReducer.getBranchAll));
  }

  getUsersList() {
    this.store.dispatch(new LoadUsersTriggered());
    this.selectUserDropDownListData$ = this.store.pipe(
      select(assetModuleReducer.getUsersAll)
    );
  }

  employeeSelected(EmployeeId) {
    if (EmployeeId == "all") {
      this.userId = "";
      this.searchByEmployee = false;
    } else {
      this.userId = EmployeeId;
      this.searchByEmployee = true;
    }
    this.getAllAssets();
  }

  closeSearch() {
    this.searchAssetCode = "";
    this.getAllAssets();
  }

  branchSelected(BranchId) {
    if (BranchId == "all") {
      this.branchId = "";
      this.searchByBranch = false;
    } else {
      this.branchId = BranchId;
      this.searchByBranch = true;
    }
    this.getAllAssets();
  }

  searchByAsset() {
    if (this.searchAssetCode.trim() == "")
      this.searchByAssetName = false;
    else
      this.searchByAssetName = true;
    this.getAllAssets();
  }

  getAllAssets() {
    const assetsSearchResult = new AssetInputModel();
    assetsSearchResult.userId = this.userId;
    assetsSearchResult.branchId = this.branchId;
    assetsSearchResult.searchAssetCode = this.searchAssetCode.trim();
    this.store.dispatch(new LoadAssetsTriggered(assetsSearchResult));
    this.assetsListGridSpinner$ = this.store.pipe(
      select(assetModuleReducer.getAssetLoading)
    );
  }

  onSelect(assetId) {
    this.dialog.open(AssetsPreviewComponent, {
      height: "auto",
      width: "auto",
      disableClose: true,
      data: { assetId: assetId, assetsDetailsType: "PersonalAssets" }
    });
  }
}