import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { MatDialog } from "@angular/material/dialog";
import { AssetsPreviewComponent } from "./assets-preview.component";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import * as assetModuleReducer from "../store/reducers/index";
import { AssetsAllocatedToMeActionTypes, LoadAssetsAllocatedToMeTriggered } from "../store/actions/assets-assigned-to-me.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { Page } from '../models/page';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-assets-allocated-to-me",
  templateUrl: `assets-allocated-to-me.component.html`
})
export class AssetsAllocatedToMeComponent extends CustomAppBaseComponent {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  assetsAllocatedToMeList$: Observable<Assets[]>
  assetsAllocatedToMeDataLoading$: Observable<boolean>
  searchText: string = "";
  sortBy: string = "assignedDateFrom";
  sortDirection: boolean = false;
  page = new Page();
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(
    private store: Store<State>, private actionUpdates$: Actions, private dialog: MatDialog) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeCompleted),
        tap(() => {
          this.assetsAllocatedToMeList$.subscribe((result) => {
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
    this.getAllAssetsAssignedToMe();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllAssetsAssignedToMe();
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
      this.getAllAssetsAssignedToMe();
    }
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getAllAssetsAssignedToMe();
  }

  getAllAssetsAssignedToMe() {
    const assetsAllocatedToMeSearchResult = new AssetInputModel();
    assetsAllocatedToMeSearchResult.searchText = this.searchText;
    assetsAllocatedToMeSearchResult.sortBy = this.sortBy;
    assetsAllocatedToMeSearchResult.sortDirectionAsc = this.sortDirection;
    assetsAllocatedToMeSearchResult.pageNumber = this.page.pageNumber + 1;
    assetsAllocatedToMeSearchResult.pageSize = this.page.size;
    assetsAllocatedToMeSearchResult.byUser = true;
    assetsAllocatedToMeSearchResult.allDamaged = false;
    this.store.dispatch(new LoadAssetsAllocatedToMeTriggered(assetsAllocatedToMeSearchResult));
    this.assetsAllocatedToMeList$ = this.store.pipe(select(assetModuleReducer.getAssetsAllocatedToMeAll));
    this.assetsAllocatedToMeDataLoading$ = this.store.pipe(select(assetModuleReducer.getAssetsAllocatedToMeLoading));
  }

  onSelect(selected) {
    this.dialog.open(AssetsPreviewComponent, {
      height: "auto",
      width: "50%",
      data: { assetId: selected.selected[0].assetId, assetsDetailsType: "AssetsAllocatedToMe" }
    });
  }

  closeSearch() {
    this.searchText = "";
    this.getAllAssetsAssignedToMe();
  }

  checkForMACAddress(value: string) {
    if (value.toUpperCase() == "CPU") {
      return true;
    } else {
      return false;
    }
  }
}
