import { Component, Input, OnInit } from '@angular/core';
import { CanteenPurchaseItemActionTypes, LoadMyCanteenPurchasesTriggered } from '../store/actions/canteen-purchage.actions';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/cantenn-purchase.reducers';
import { Subject, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as hrManagementModuleReducer from '../store/reducers/index';
import { takeUntil, tap } from 'rxjs/operators';
import { CanteenPurchaseItemModel } from '../models/canteen-purchase.model';
import { Page } from '../models/Page.model';
import { CanteenPurchaseItemSearchModel } from '../models/canteen-purchase-item-search.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-profile-component-canteenPurchases',
    templateUrl: 'canteenPurchases.component.html'
})
export class CanteenPurchasesComponent implements OnInit {

    searchText: string;
    page = new Page();
    sortBy: string;
    sortDirection: boolean;
    canteenPurchaseSummaryGridSpinner$: Observable<boolean>;
    canteenPurchaseSummaryRecords$: Observable<CanteenPurchaseItemModel[]>;
    introJS = new introJs();
    multiPage: string = null;
    userId: string = '';
    public ngDestroyed$ = new Subject();
    isHrModuleAccess: boolean;
    isDocumentModuleAccess: boolean;
    isAssertModuleAccess: boolean;
    isTimeSheetModuleAccess: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router,private cookieService: CookieService,
        private route: ActivatedRoute,private translateService: TranslateService) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesCompleted),
                tap(() => {
                    this.canteenPurchaseSummaryRecords$ = this.store.pipe(select(hrManagementModuleReducer.myCanteenPurchasesList));
                    this.canteenPurchaseSummaryRecords$.subscribe((result) => {
                        this.page.totalElements = result ? result.length > 0 ? result[0].totalCount : 0 : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                    })
                })
            )
            .subscribe();
            this.route.queryParams.subscribe(params => {
                if (!this.multiPage) {
                    this.multiPage = params['multipage'];
                }
            });
    }

    ngOnInit() {
        this.page.size = 20;
        this.page.pageNumber = 0;
        this.getCanteenPurchaseSummaryList();
    }
    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#cp-1',
                    intro: this.translateService.instant('INTROTEXT.CP-1'),
                    position: 'bottom'
                },
                {
                    element: '#cp-2',
                    intro: this.translateService.instant('INTROTEXT.CP-2'),
                    position: 'bottom'
                },
            ]
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getCanteenPurchaseSummaryList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
            this.page.size = 20;
            this.page.pageNumber = 0;
        this.getCanteenPurchaseSummaryList();
    }

    searchCanteenPurchaseList() {
        this.page.size = 20;
        this.page.pageNumber = 0;
        this.getCanteenPurchaseSummaryList();
    }

    closeSearch() {
        this.searchText = '';
        this.getCanteenPurchaseSummaryList();
    }

    getCanteenPurchaseSummaryList() {
        const canteenPurchaseSummarySearchResult = new CanteenPurchaseItemSearchModel();
        if (this.routes.url.includes("profile") && this.routes.url.split("/")[3]) {
            canteenPurchaseSummarySearchResult.userId = this.routes.url.split("/")[3];
          }
        canteenPurchaseSummarySearchResult.sortBy = this.sortBy;
        canteenPurchaseSummarySearchResult.sortDirectionAsc = this.sortDirection;
        canteenPurchaseSummarySearchResult.pageNumber = this.page.pageNumber + 1;
        canteenPurchaseSummarySearchResult.pageSize = this.page.size;
        canteenPurchaseSummarySearchResult.searchText = this.searchText;
        this.store.dispatch(new LoadMyCanteenPurchasesTriggered(canteenPurchaseSummarySearchResult));
        this.canteenPurchaseSummaryGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getMyCanteenPurchasesLoading));
        if (this.multiPage == "true") {
            this.introStart();
            this.multiPage = null;
        }
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
          //  preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
            let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
            if (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/induction-work"], navigationExtras);
            }
            else if (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/exit-work"], navigationExtras);
            }
            else if (this.isDocumentModuleAccess =userModules.filter(x =>
                x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/signature-inviations"], navigationExtras);
            }
            else if (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0) {
                    this.routes.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
          });
    }
    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
