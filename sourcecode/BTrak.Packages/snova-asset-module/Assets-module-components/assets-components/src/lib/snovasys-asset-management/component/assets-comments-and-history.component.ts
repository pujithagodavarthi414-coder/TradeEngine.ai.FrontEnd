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
//import * as introJs from 'intro.js/intro.js';
//import { ActivatedRoute, NavigationExtras} from '@angular/router';

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
        }
    }

    dashboardFilters: DashboardFilterModel;
    loadingCommentsAndHistory$: Observable<boolean>;
    assetComments$: Observable<AssetCommentsAndHistory[]>;
    noCommentsAndHistory:boolean=false;
    totalAssetsCommentsCount: number = 0;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [20, 40, 60, 80, 100];
    isUsingAssetId: boolean;
    selectedAssetId: string = null;
    //introJS = new introJs();
   // multiPage: string = null;

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
                            if(result.length==0){
                                this.noCommentsAndHistory=true;
                            }
                            this.totalAssetsCommentsCount = result[0].totalCount;
                            // if(this.totalAssetsCommentsCount == 0){
                            //     this.noCommentsAndHistory=true;
                            // }
                        }
                    }));
                })
            )
            .subscribe();
            
        this.loadingCommentsAndHistory$ = this.assetsStore.pipe(select(assetModuleReducer.getAssetsCommentsAndHistoryLoading));
      //  this.route.queryParams.subscribe(params => {
        //    if (!this.multiPage) {
        //        this.multiPage = params['multipage'];
        //    }
       // });
      //  this.introEnable();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAssetComments();
    }
    removespaces(history)
    {
        while ( history.indexOf("& nbsp;") != -1)
        {
            history = history.replace(/\& nbsp\;/,"&nbsp;");
        }
        return history;
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
       // if (this.multiPage == "true") {
       //     this.introStart();
       //     this.multiPage = null;
       // }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
   /* public async introStart() {
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            preserveQueryParams: true
        }

        this.introJS.start().oncomplete(() => {

        });
    }

    introEnable() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#assetComments-1',
                    intro: "It will diplay assigned and damaged assets history.",
                    position: 'top'
                },

            ]
        });
    }*/
}
