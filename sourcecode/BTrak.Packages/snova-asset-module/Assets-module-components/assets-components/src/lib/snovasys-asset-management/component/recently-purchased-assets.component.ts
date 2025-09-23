import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from "@angular/material/dialog";
import { AssetsPreviewComponent } from "./assets-preview.component";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import { AssetsActionTypes, LoadAssetsTriggered } from '../store/actions/assets.actions';
import * as assetModuleReducer from "../store/reducers/index";
import { Page } from '../models/page';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AssetService } from '../services/assets.service';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-am-component-recently-purchased-assets',
  templateUrl: `recently-purchased-assets.component.html`
})
export class RecentlyPurchasedAssetsComponent extends CustomAppBaseComponent {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  recentlyPurchasedAssetsList$: Observable<Assets[]>;
  recentlyPurchasedAssetsDataLoading$: Observable<boolean>;

  searchText: string = "";
  sortBy: string = "purchasedDate";
  sortDirection: boolean = false;
  page = new Page();
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(private store: Store<State>, private actionUpdates$: Actions,
    private dialog: MatDialog, private assetService: AssetService, private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(AssetsActionTypes.LoadAssetsCompleted),
        tap(() => {
          this.recentlyPurchasedAssetsList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          });
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getEntityDropDown()
    this.getAllPurchasedAssets();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllPurchasedAssets();
  }

  onSort(event) {
    if (this.page.totalElements > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === "asc") {
        this.sortDirection = true;
      } else {
        this.sortDirection = false;
      }
      this.page.size = 10;
      this.page.pageNumber = 0;
      this.getAllPurchasedAssets();
    }
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getAllPurchasedAssets();
  }

  getAllPurchasedAssets() {
    const purchasedAssetsSearchResult = new AssetInputModel();
    purchasedAssetsSearchResult.searchText = this.searchText;
    purchasedAssetsSearchResult.sortBy = this.sortBy;
    purchasedAssetsSearchResult.sortDirectionAsc = this.sortDirection;
    purchasedAssetsSearchResult.pageNumber = this.page.pageNumber + 1;
    purchasedAssetsSearchResult.pageSize = this.page.size;
    purchasedAssetsSearchResult.allPurchasedAssets = true;
    purchasedAssetsSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadAssetsTriggered(purchasedAssetsSearchResult));
    this.recentlyPurchasedAssetsList$ = this.store.pipe(select(assetModuleReducer.getAssetsAll));
    this.recentlyPurchasedAssetsDataLoading$ = this.store.pipe(select(assetModuleReducer.getAssetLoading));
  }

  onSelect(selected) {
    this.dialog.open(AssetsPreviewComponent, {
      height: "auto",
      width: "50%",
      data: { assetId: selected.selected[0].assetId, assetsDetailsType: "PersonalAssets" }
    });
  }

  closeSearch() {
    this.searchText = "";
    this.getAllPurchasedAssets();
  }

  checkForMACAddress(value: string) {
    if (value.toUpperCase() == "CPU") {
      return true;
    } else {
      return false;
    }
  }

  getEntityDropDown() {
    let searchText = "";
    this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      } else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllPurchasedAssets();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getAllPurchasedAssets();
  }
}
