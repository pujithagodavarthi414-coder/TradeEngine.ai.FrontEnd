import { Component, ViewChildren, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Page } from "../models/Page.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { State } from '../store/reducers/authentication.reducers';
import * as commonModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Assets } from '../models/asset.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DashboardService } from '../services/dashboard.service';
import { AssetInputModel } from '../models/asset-input.model';
import { PrintAssetsModel } from '../models/print-asset.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: "app-profile-component-assests",
  templateUrl: "assets.component.html"
})

export class MyAssetsComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('assetPopover') assetPopover;

  sortBy: string = 'assetName';
  searchText: string;
  sortDirection: boolean = true;
  page = new Page();
  selectedUserId: string;
  gettingAssetsInProgress: boolean;
  savingAssetsInProgress: boolean;
  validationMessage: string;
  assetsAllocatedToMeAssetId: string;
  pdfName: string;
  loading: boolean = false;
  assetsAllocatedToMeData: Assets[];
  changedAssetsAllocatedToMeData: Assets;
  roleFeaturesIsInProgress$: Observable<boolean>;
  introJS = new introJs();
  multiPage: string = null;
  userId: string = '';
  isTimeSheetModuleAccess: boolean = false;
  isHrModuleAccess: boolean = false;
  applyHeight: boolean = false;

  constructor(private router: Router, private cookieService: CookieService,
    private toastr: ToastrService, private snackbar: MatSnackBar, private datePipe: DatePipe,
    private translateService: TranslateService, private store: Store<State>,
    private dashboardService: DashboardService,private route: ActivatedRoute) {
    super();
    if (this.router.url.split("/")[3])
      this.selectedUserId = this.router.url.split("/")[3];
    else
      this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.route.queryParams.subscribe(params => {
      if (!this.multiPage) {
          this.multiPage = params['multipage'];
      }
   });
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.router.url.includes('/assetmanagement/myassets')) {
      this.applyHeight = true;
    }
    this.page.size = 20;
    this.page.pageNumber = 0;
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducer.getRoleFeaturesLoading));
    this.getAllAssetsAllocatedToMe();
  }
  ngAfterViewInit() {
    this.introJS.setOptions({
      steps: [
        {
          element: '#as-1',
          intro: this.translateService.instant('INTROTEXT.AS-1'),
          position: 'bottom'
        },
        {
          element: '#as-2',
          intro: this.translateService.instant('INTROTEXT.AS-2'),
          position: 'bottom'
        },
      ]
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllAssetsAllocatedToMe();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === "asc") this.sortDirection = true;
    else this.sortDirection = false;
    this.page.size = 20;
    this.page.pageNumber = 0;
    this.getAllAssetsAllocatedToMe();
  }

  getAllAssetsAllocatedToMe() {
    this.gettingAssetsInProgress = true;
    const assetsAllocatedToMeSearchResult = new AssetInputModel();
    assetsAllocatedToMeSearchResult.searchText = this.searchText;
    assetsAllocatedToMeSearchResult.sortBy = this.sortBy;
    assetsAllocatedToMeSearchResult.sortDirectionAsc = this.sortDirection;
    assetsAllocatedToMeSearchResult.pageNumber = this.page.pageNumber + 1;
    assetsAllocatedToMeSearchResult.pageSize = this.page.size;
    assetsAllocatedToMeSearchResult.userId = this.selectedUserId;
    this.dashboardService.getAllAssets(assetsAllocatedToMeSearchResult).subscribe((responseData: any) => {
      let success = responseData.success;
      this.gettingAssetsInProgress = false;
      if (success) {
        this.assetsAllocatedToMeData = responseData.data;
        this.page.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
        this.page.totalPages = this.page.totalElements / this.page.size;
      } else {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      if (this.multiPage == "true") {
        this.introStart();
        this.multiPage = null;
      }
    });
  }

  saveAsset() {
    this.savingAssetsInProgress = true;
    let assetDetailsData = new Assets();
    assetDetailsData = this.changedAssetsAllocatedToMeData;
    this.dashboardService.upsertAssetDetails(assetDetailsData).subscribe((responseData: any) => {
      let success = responseData.success;
      this.savingAssetsInProgress = false;
      if (success) {
        this.snackbar.open(this.translateService.instant('ASSETS.ASSETACCEPTEDSUCCESSFULLY'), "", { duration: 3000 });
        this.assetsAllocatedToMeAssetId = responseData.data;
        this.assetPopover.forEach((p) => p.closePopover());
        this.getAllAssetsAllocatedToMe();
      } else {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
    });
  }

  getCheckBoxChecked(event, assetPopup) {
    this.changedAssetsAllocatedToMeData = event;
    assetPopup.openPopover();
  }

  approveAsset() {
    this.changedAssetsAllocatedToMeData.isSelfApproved = true;
    this.saveAsset();
  }

  declineAsset() {
    this.assetPopover.forEach((p) => p.closePopover());
  }

  printAssets() {
    if (this.assetsAllocatedToMeData.length == 0) {
      this.toastr.error(this.translateService.instant('NODATATOPRINT'));
      return;
    }
    let assetModel = new PrintAssetsModel();
    assetModel.userId = this.selectedUserId;
    assetModel.fileName = this.assetsAllocatedToMeData[0].assignedToEmployeeName;
    this.loading = true;
    this.dashboardService.printAssets(assetModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.pdfName = this.assetsAllocatedToMeData[0].assignedToEmployeeName + this.datePipe.transform(new Date(), 'yyyy-MM-dd'); +'-Assets.pdf';
        const linkSource = 'data:application/pdf;base64,' + responseData.data;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = this.pdfName;
        downloadLink.click();
        this.loading = false;
      }
      else {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
        this.loading = false;
      }
    });
  }
  public async introStart() {
    await this.delay(2000);
    const navigationExtras: NavigationExtras = {
        queryParams: { multipage: true },
        queryParamsHandling: 'merge',
       // preserveQueryParams: true
    }

    this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
      this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
      if (this.canAccess_feature_ViewHistoricalTimesheet) {
        let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
      }
    });
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}