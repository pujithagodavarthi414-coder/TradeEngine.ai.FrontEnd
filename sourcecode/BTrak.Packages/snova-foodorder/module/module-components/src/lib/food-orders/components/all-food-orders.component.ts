import { Component, ViewChild, ViewChildren, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize } from 'ngx-gallery-9';

import { FoodOrderManagementApiInput, FoodOrderModel, ChangeFoodOrderStatusInputModel } from '../models/all-food-orders';

import { State } from "../store/reducers/index";
import * as hrManagementModuleReducer from "../store/reducers/index";

import { FoodOrderActionTypes, LoadFoodOrdersTriggered, ChangeFoodOrderStatusTriggred } from '../store/actions/food-order.actions';

import { DatePipe } from '@angular/common';
import { FoodOrderService } from '../services/food-order.service';
import { ToastrService } from 'ngx-toastr';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { FetchSizedAndCachedImagePipe } from '../pipes/fetchSizedAndCachedImage.pipe';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { Page } from '../models/Page';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-all-food-orders',
  templateUrl: 'all-food-orders.component.html',
})

export class AllFoodOrdersComponent extends CustomAppBaseComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("placeAnOrderPopover") placeAnOrderPopover;
  @ViewChild('label')
  @ViewChildren("approveFoodOrderPopUp") approveFoodOrderPopover;
  @ViewChildren("rejectFoodOrderPopUp") rejectFoodOrderPopover;
  @ViewChildren("showReceiptsPopUp") showReceiptsPopover;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
      if (data && data !== undefined) {
          this.dashboardFilters = data;
      }
  }

  dashboardFilters: DashboardFilterModel;
  foodOrderDetails: FoodOrderModel;
  foodOrderManagementApiInputModel: FoodOrderManagementApiInput;
  page = new Page();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  sortBy: string;
  searchText: string;
  pageSize: number = 30;
  sortDirection: boolean;
  isPlaceOrder: boolean = false;
  isScrollable: boolean = false;
  timeStamp: any;
  receiptsForAnOrder: any[] = [];
  receiptsPdfForAnOrder: any[] = [];
  imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];

  reason = new FormControl('', [Validators.required, Validators.maxLength(800)]);
  selectedEntity: string ;
  entities:EntityDropDownModel[];
  open=true;
  validationMessage : string;
  foodOrderList$: Observable<FoodOrderModel[]>;
  foodOrderListGridSpinner$: Observable<boolean>;
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(private actionUpdates$: Actions, private store: Store<State>, private imagePipe: FetchSizedAndCachedImagePipe, private datePipe: DatePipe, private foodOrderService: FoodOrderService
    ,private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(FoodOrderActionTypes.LoadFoodOrdersCompleted),
        tap(() => {
          this.foodOrderList$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderAll));
          this.foodOrderList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
            this.isScrollable = true;
          })
        })
      )
      .subscribe();

    // this.actionUpdates$
    //   .pipe(
    //     ofType(FoodOrderActionTypes.CreateFoodOrderCompleted),
    //     tap(() => {
    //       this.getAllFoodOrders();
    //     })
    //   )
    //   .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(FoodOrderActionTypes.ChangeFoodOrderStatusCompleted),
        tap(() => {
          this.getAllFoodOrders();
          this.closeApproveFoodOrderPopup();
          this.closeRejectFoodOrderPopup();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    // this.canAccess_feature_ViewFoodOrders$.subscribe(result => {
    //   this.canAccess_feature_ViewFoodOrders = result;
    // });
    if (this.canAccess_feature_ViewFoodOrders) {
      this.page.size = 50;
      this.page.pageNumber = 0;
      this.getAllFoodOrders();
      this.galleryOptions = [
        { image: false, height: "50px", width: "200px", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: 3, thumbnailMargin: 5 },
      ]
    }
  }

  SearchFoodOrderList() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.page.pageNumber = 0;
    this.getAllFoodOrders();
  }

  closeSearch() {
    this.searchText = '';
    this.getAllFoodOrders();
  }

  getAllFoodOrders() {
    const foodOrderSearchResult = new FoodOrderManagementApiInput();
    foodOrderSearchResult.sortBy = this.sortBy;
    foodOrderSearchResult.sortDirectionAsc = this.sortDirection;
    foodOrderSearchResult.pageNumber = this.page.pageNumber + 1;
    foodOrderSearchResult.pageSize = this.page.size;
    foodOrderSearchResult.searchText = this.searchText;
    foodOrderSearchResult.isRecent = false;
    foodOrderSearchResult.entityId = this.selectedEntity;
    this.foodOrderManagementApiInputModel = foodOrderSearchResult;
    this.store.dispatch(new LoadFoodOrdersTriggered(foodOrderSearchResult));
    this.foodOrderListGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderLoading));
  }

  closeDialog() {
    this.isPlaceOrder = false;
    this.placeAnOrderPopover.close();
  }

  approveFoodOrderPopupOpen(foodOrderData, approveFoodOrderPopUp) {
    this.foodOrderDetails = foodOrderData;
    this.timeStamp = foodOrderData.timeStamp;
    approveFoodOrderPopUp.openPopover();
  }

  closeApproveFoodOrderPopup() {
    this.clearReason();
    this.approveFoodOrderPopover.forEach((p) => p.closePopover());
  }

  rejectFoodOrderPopupOpen(foodOrderData, rejectFoodOrderPopUp) {
    this.foodOrderDetails = foodOrderData;
    this.timeStamp = foodOrderData.timeStamp;
    rejectFoodOrderPopUp.openPopover();
  }

  closeRejectFoodOrderPopup() {
    this.clearReason();
    this.rejectFoodOrderPopover.forEach((p) => p.closePopover());
  }

  getFoodOrderData(foodOrderData) {
    this.foodOrderDetails = foodOrderData.value;
  }

  openPlaceOrderPopover() {
    this.isPlaceOrder = true;
  }

  approveFoodOrder() {
    var changeFoodOrderStatus = new ChangeFoodOrderStatusInputModel();
    changeFoodOrderStatus.foodOrderId = this.foodOrderDetails.foodOrderId;
    changeFoodOrderStatus.isFoodOrderApproved = true;
    changeFoodOrderStatus.rejectReason = null;
    changeFoodOrderStatus.timeStamp = this.timeStamp;
    this.store.dispatch(new ChangeFoodOrderStatusTriggred(changeFoodOrderStatus));
    this.foodOrderListGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderLoading));
  }

  rejectFoodOrder() {
    var changeFoodOrderStatus = new ChangeFoodOrderStatusInputModel();
    changeFoodOrderStatus.foodOrderId = this.foodOrderDetails.foodOrderId;
    changeFoodOrderStatus.isFoodOrderApproved = false;
    changeFoodOrderStatus.rejectReason = this.reason.value;
    changeFoodOrderStatus.timeStamp = this.timeStamp;
    this.store.dispatch(new ChangeFoodOrderStatusTriggred(changeFoodOrderStatus));
    this.foodOrderListGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderLoading));
  }

  cancelRejection() {
    this.clearReason();
    this.trigger.closeMenu();
  }

  clearReason() {
    this.timeStamp = null;
    this.reason = new FormControl('', [Validators.required, Validators.maxLength(800)]);
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.getAllFoodOrders();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllFoodOrders();
  }

  showReceiptsPopupOpen(row, showReceiptsPopUp) {
    this.galleryImages = [];
    const receipts = row.receipts.split(',');
    receipts.forEach(item => {
      const result = item.split(".");
      const fileExtension = result.pop();
      if (this.imageExtensions.includes(fileExtension)) {
        const album = {
          small: this.imagePipe.transform(item, "50", "50"),
          big: this.imagePipe.transform(item, "", "")
        };
        this.receiptsForAnOrder.push(album);
      } else {
        const file = {
          filePath: item,
          fileName: item.split('/').pop()
        }
        this.receiptsPdfForAnOrder.push(file);
      }
    })
    this.galleryImages = this.receiptsForAnOrder;
    showReceiptsPopUp.openPopover();
  }

  closeReceiptsPopup() {
    this.receiptsForAnOrder = [];
    this.receiptsPdfForAnOrder = [];
    this.showReceiptsPopover.forEach((p) => p.closePopover());
  }

  downloadFile(filePath) {
    const parts = filePath.split(".");
    const fileExtension = parts.pop();
    alert(fileExtension);
    if (fileExtension == 'pdf') {
      this.downloadPdf(filePath);
    } else {
      const downloadLink = document.createElement("a");
      downloadLink.href = filePath;
      downloadLink.download = filePath.split(".").pop() + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File' + fileExtension;
      downloadLink.click();
    }
  }

  downloadPdf(pdf) {
    const parts = pdf.split("/");
    const loc = parts.pop();
    this.foodOrderService.downloadFile(pdf).subscribe((responseData: any) => {
      const linkSource = 'data:application/pdf;base64,' + responseData;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = loc.split(".")[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File.pdf';
      downloadLink.click();
    })
  }
  getEntityDropDown() {
    let searchText = "";
    this.foodOrderService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
    this.getAllFoodOrders();
  }
  
  filterClick() {
    this.open = !this.open;
  }
  
  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = '';
    this.getAllFoodOrders();
  }
}