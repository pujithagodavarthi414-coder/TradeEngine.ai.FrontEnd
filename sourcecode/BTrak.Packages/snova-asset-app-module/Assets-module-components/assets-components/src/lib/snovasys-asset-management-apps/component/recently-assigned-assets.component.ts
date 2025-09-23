import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { AssetsPreviewComponent } from "./assets-preview.component";
import { Assets } from "../models/asset";
import { AssetInputModel } from "../models/asset-input-model";
import { AssignedAssetsActionTypes, LoadRecentlyAssignedAssetsTriggered } from "../store/actions/assigned-assets.actions";
import * as assetModuleReducer from "../store/reducers/index";
import { Page } from '../models/page';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: "app-am-component-recently-assigned-assets",
  templateUrl: `recently-assigned-assets.component.html`
})
export class RecentlyAssignedAssetsComponent extends CustomAppBaseComponent {

  @Output() closePopUp = new EventEmitter<any>();

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  recentlyAssignedAssetsList$: Observable<Assets[]>;
  recentlyAssignedAssetsDataLoading$: Observable<boolean>;
  searchText: string = "";
  sortBy: string = "assignedDateFrom";
  sortDirection: boolean = false;
  page = new Page();
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(
    private store: Store<State>, private actionUpdates$: Actions, private router: Router,
    private dialog: MatDialog, private assetService: AssetService, private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsCompleted),
        tap(() => {
          this.recentlyAssignedAssetsList$.subscribe((result) => {
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
    this.getAllAssignedAssets();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllAssignedAssets();
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
      this.getAllAssignedAssets();
    }
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getAllAssignedAssets();
  }

  getAllAssignedAssets() {
    const assignedAssetsSearchResult = new AssetInputModel();
    assignedAssetsSearchResult.sortBy = this.sortBy;
    assignedAssetsSearchResult.sortDirectionAsc = this.sortDirection;
    assignedAssetsSearchResult.pageNumber = this.page.pageNumber + 1;
    assignedAssetsSearchResult.pageSize = this.page.size;
    assignedAssetsSearchResult.allAssigned = true;
    assignedAssetsSearchResult.searchText = this.searchText;
    assignedAssetsSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadRecentlyAssignedAssetsTriggered(assignedAssetsSearchResult));
    this.recentlyAssignedAssetsList$ = this.store.pipe(select(assetModuleReducer.getAssignedAssetsAll));
    this.recentlyAssignedAssetsDataLoading$ = this.store.pipe(select(assetModuleReducer.getAssignedAssetsLoading));
  }

  closeSearch() {
    this.searchText = "";
    this.getAllAssignedAssets();
  }

  onSelect(selected) {
    this.dialog.open(AssetsPreviewComponent, {
      height: "auto",
      width: "50%",
      data: { assetId: selected.selected[0].assetId, assetsDetailsType: "RecentlyAssignedAssets" }
    });
  }

  checkForMACAddress(value: string) {
    if (value.toUpperCase() == "CPU") {
      return true;
    } else {
      return false;
    }
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
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
    this.getAllAssignedAssets();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getAllAssignedAssets();
  }
}
