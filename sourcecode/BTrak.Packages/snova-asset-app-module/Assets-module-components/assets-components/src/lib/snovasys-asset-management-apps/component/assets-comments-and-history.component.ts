import { Component, Input } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { AssetCommentsAndHistory } from "../models/assets-comments-and-history.model";
import { AssetCommentsAndHistorySearch } from "../models/assets-comments-and-history-search.model";
import * as assetModuleReducer from "../store/reducers/index";
import * as AssetManagementState from "../store/reducers/index";
import { LoadAssetsCommentsAndHistoryItemsTriggered, AssetsCommentsAndHistoryActionTypes } from "../store/actions/assetsCommentsAndHistory.actions";
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-am-component-assets-comments-and-history",
    templateUrl: `assets-comments-and-history.component.html`
})

export class AssetsCommentsAndHistoryComponent extends CustomAppBaseComponent {
    @Input("assetId")
    set _assetId(data: string) {
        this.pageSize = 20;
        this.pageIndex = 0;
        this.selectedAssetId = data;
        this.isUsingAssetId = data ? true : false;
        this.getAssetComments();
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.pageSize = 20;
            this.pageIndex = 0;
            this.isUsingAssetId = data ? true : false;
            this.getAssetComments();
        }
        else {
            this.pageSize = 20;
            this.pageIndex = 0;
            this.getAssetComments();
        }
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;           
        }
    }

    dashboardFilters: DashboardFilterModel;
    loadingCommentsAndHistory$: Observable<boolean>;
    assetComments$: Observable<AssetCommentsAndHistory[]>;
    totalAssetsCommentsCount: number = 0;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [20, 40, 60, 80, 100];
    isUsingAssetId: boolean;
    selectedAssetId: string;
    dashboardId: string;

    public ngDestroyed$ = new Subject();

    constructor(private router: Router, private actionUpdates$: Actions, private assetsStore: Store<AssetManagementState.State>) {
        super();
        this.actionUpdates$
            .pipe(
                ofType(AssetsCommentsAndHistoryActionTypes.AddAssetCommentCompleted),
                tap(() => {
                    this.pageSize = 20;
                    this.pageIndex = 0;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                ofType(AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsCompleted),
                tap(() => {
                    this.assetComments$ = this.assetsStore.pipe(select(assetModuleReducer.getAssetsCommentsAndHistoryAll), tap((result) => {
                        if (result) {
                            this.totalAssetsCommentsCount = result[0].totalCount;
                        }
                    }));
                })
            )
            .subscribe();

        this.loadingCommentsAndHistory$ = this.assetsStore.pipe(select(assetModuleReducer.getAssetsCommentsAndHistoryLoading));
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAssetComments();
    }


    goToUserProfile(selectedUserId) {
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    getFilteredAssetComments(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageIndex = 0;
        } else {
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.getAssetComments();
    }

    getAssetComments() {
        const assetCommentsAndHistorySearch = new AssetCommentsAndHistorySearch()
        assetCommentsAndHistorySearch.pageNumber = this.pageIndex + 1;
        assetCommentsAndHistorySearch.pageSize = this.pageSize;
        assetCommentsAndHistorySearch.assetId = this.selectedAssetId;
        this.assetsStore.dispatch(new LoadAssetsCommentsAndHistoryItemsTriggered(assetCommentsAndHistorySearch));
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;
           
        if (optionalParameters['gridsterView']) {
          interval = setInterval(() => {
            try {
              if (count > 30) {
                clearInterval(interval);
              }
              count++;
              if ($(optionalParameters['gridsterViewSelector'] + ' .assets-comments-history').length > 0) {
                  $(optionalParameters['gridsterViewSelector'] + ' .assets-comments-history').height($(optionalParameters['gridsterViewSelector']).height() - 96);
                clearInterval(interval);
              }
            } catch (err) {
              clearInterval(interval);
            }
          }, 1000);
        }
    
      }
}
