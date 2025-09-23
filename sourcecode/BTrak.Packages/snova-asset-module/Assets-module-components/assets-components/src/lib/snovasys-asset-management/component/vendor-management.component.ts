import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { State } from '../store/reducers/index';
import { VendorManagement } from '../models/vendor-management';
import { LoadSuppliersTriggered, SupplierActionTypes } from '../store/actions/supplier.actions';
import * as supplierModule from '../store/reducers/index';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { Page } from '../models/page';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { AssetService } from '../services/assets.service';
import * as assetModuleReducer from "../store/reducers/index";
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-am-component-vendor-management',
  templateUrl: `vendor-management.component.html`
})

export class VendorManagementComponent extends CustomAppBaseComponent {
  @ViewChildren('supplierPopover') editSupplierPopovers;
  @ViewChildren("archiveVendorPopUp") archiveVendorPopUp;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  suppliersList$: Observable<VendorManagement[]>;
  vendorListGridSpinner$: Observable<boolean>;
  selectedSupplierDetails: any;
  searchText: string = '';
  sortBy: string = 'supplierName';
  sortDirection: boolean = true;
  editSupplier: boolean;
  isScroll: boolean;
  page = new Page();
  selectedEntity: string;
  validationMessages: string;
  entities: EntityDropDownModel[];
  roleFeaturesIsInProgress$: Observable<boolean>;
  isArchived: boolean = false;
  savingVendorInProgress$: Observable<boolean>;

  constructor(
    private store: Store<State>, private actionUpdates$: Actions,
    private assetService: AssetService, private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(SupplierActionTypes.LoadSuppliersCompleted),
        tap(() => {
          this.closeArchiveVendorDialog();
          this.suppliersList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          })
        })
      )
      .subscribe();
      this.actionUpdates$
      .pipe(
        ofType(SupplierActionTypes.CreateSupplierFailed),
        tap((data : any) => {
          this.closeArchiveVendorDialog();
         this.toastr.error(data.validationMessages[0].message);
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.page.size = 30;
    this.page.pageNumber = 0;
    if (this.canAccess_feature_ViewVendors) {
      this.getAllSuppliers();
    }
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(assetModuleReducer.getRoleFeaturesLoading));
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllSuppliers();
  }

  onSort(event) {
    if (this.page.totalElements > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === 'asc')
        this.sortDirection = true;
      else
        this.sortDirection = false;
      this.page.size = 30;
      this.page.pageNumber = 0;
      this.getAllSuppliers();
    }
  }

  getAllSuppliers() {
    const supplierSearchResult = new VendorManagement();
    supplierSearchResult.searchText = this.searchText;
    supplierSearchResult.sortBy = this.sortBy;
    supplierSearchResult.sortDirectionAsc = this.sortDirection;
    supplierSearchResult.pageNumber = this.page.pageNumber + 1;
    supplierSearchResult.pageSize = this.page.size;
    supplierSearchResult.isArchived = false;
    supplierSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadSuppliersTriggered(supplierSearchResult));
    this.suppliersList$ = this.store.pipe(select(supplierModule.getSuppliersAll));
    this.isScroll = true;
    this.vendorListGridSpinner$ = this.store.pipe(select(supplierModule.getSupplierLoading));
  }

  searchSuppliersList() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getAllSuppliers();
  }

  closeSearch() {
    this.searchText = '';
    this.getAllSuppliers();
  }

  EditSupplier(dataItem, editSupplierPopover) {
    this.editSupplier = true;
    this.selectedSupplierDetails = dataItem;
    editSupplierPopover.openPopover();
  }

  closeDialog() {
    this.editSupplierPopovers.forEach((p) => p.closePopover());
    this.editSupplier = false;
  }

  createSupplier(addSupplierPopover) {
    addSupplierPopover.openPopover();
    this.editSupplier = false;
  }

  getEntityDropDown() {
    let searchText = "";
    this.assetService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessages = responseData.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessages);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllSuppliers();
  }

  resetFilter() {
    this.searchText = "";
    this.selectedEntity = "";
    this.getAllSuppliers();
  }

  archiveVendorPopupOpen(row, archiveVendorPopUp) {
    if(row !=undefined && row !="" && row !=null){
      this.selectedSupplierDetails = row;
      archiveVendorPopUp.openPopover();
    }
  }

  closeArchiveVendorDialog() {
    this.archiveVendorPopUp.forEach((p) => p.closePopover());
    this.selectedSupplierDetails = null;
  }
  
  archiveVendor(){
    
      let vendorData = new VendorManagement();
      if(this.selectedSupplierDetails.supplierId){
        vendorData.supplierId = this.selectedSupplierDetails.supplierId;
        vendorData.timeStamp = this.selectedSupplierDetails.timeStamp;
        vendorData.supplierName = this.selectedSupplierDetails.supplierName,
        vendorData.startedWorkingFrom = this.selectedSupplierDetails.startedWorkingFrom
      }
      vendorData.isArchived = true;
      this.store.dispatch(new LoadSuppliersTriggered(vendorData));
      this.savingVendorInProgress$ = this.store.pipe(select(assetModuleReducer.createSupplierLoading));
  }

}