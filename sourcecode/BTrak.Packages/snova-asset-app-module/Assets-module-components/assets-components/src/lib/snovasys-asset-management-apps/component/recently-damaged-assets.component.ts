import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { MatDialog } from "@angular/material/dialog";
import { AssetsPreviewComponent } from "./assets-preview.component";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as assetModuleReducer from "../store/reducers/index";
import { DamagedAssetsActionTypes, LoadRecentlyDamagedAssetsTriggered } from "../store/actions/damaged-assets.actions";
import { Page } from '../models/page';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-recently-damaged-assets",
  templateUrl: `recently-damaged-assets.component.html`
})

export class RecentlyDamagedAssetsComponent extends CustomAppBaseComponent {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  recentlyDamagedAssetsList$: Observable<Assets[]>;
  recentlyDamagedAssetsDataLoading$: Observable<boolean>;
  searchText: string = "";
  sortBy: string = "damagedDate";
  sortDirection: boolean = false;
  page = new Page();
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(
    private store: Store<State>, private actionUpdates$: Actions,
    private router: Router, private translateService: TranslateService, private dialog: MatDialog,
    private assetService: AssetService, private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsCompleted),
        tap(() => {
          this.recentlyDamagedAssetsList$.subscribe((result) => {
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
    this.getEntityDropDown();
    this.getAllDamagedAssets();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllDamagedAssets();
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
      this.getAllDamagedAssets();
    }
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getAllDamagedAssets();
  }

  getAllDamagedAssets() {
    const damagedAssetsSearchResult = new AssetInputModel();
    damagedAssetsSearchResult.searchText = this.searchText;
    damagedAssetsSearchResult.sortBy = this.sortBy;
    damagedAssetsSearchResult.sortDirectionAsc = this.sortDirection;
    damagedAssetsSearchResult.pageNumber = this.page.pageNumber + 1;
    damagedAssetsSearchResult.pageSize = this.page.size;
    damagedAssetsSearchResult.allDamaged = true;
    damagedAssetsSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadRecentlyDamagedAssetsTriggered(damagedAssetsSearchResult));
    this.recentlyDamagedAssetsList$ = this.store.pipe(select(assetModuleReducer.getDamagedAssetsAll));
    this.recentlyDamagedAssetsDataLoading$ = this.store.pipe(select(assetModuleReducer.getDamagedAssetsLoading));
  }

  onSelect(selected) {
    this.dialog.open(AssetsPreviewComponent, {
      height: "auto",
      width: "50%",
      data: { assetId: selected.selected[0].assetId, assetsDetailsType: "DamagedAssets" }
    });
  }

  closeSearch() {
    this.searchText = "";
    this.getAllDamagedAssets();
  }

  checkForMACAddress(value: string) {
    if (value.toUpperCase() == "CPU") {
      return true;
    } else {
      return false;
    }
  }

  goToProfile(url) {
    this.router.navigateByUrl("dashboard/profile/" + url);
  }
  getEntityDropDown() {
    let searchText = "";
    this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllDamagedAssets();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getAllDamagedAssets();
  }
}
