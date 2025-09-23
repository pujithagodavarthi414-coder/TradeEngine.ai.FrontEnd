import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { CanteenCreditModel } from '../models/canteen-credit-model';
import { CanteenCreditSearchInputModel } from '../models/canteen-credit-search-input-model';

import { LoadCanteenCreditsTriggered, CanteenCreditActionTypes } from '../store/actions/canteen-credit.actions';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';

import { Router } from '@angular/router';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { Page } from '../models/Page';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CanteenManagementService } from '../services/canteen-management.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-offers-credited-to-users',
    templateUrl: `offers-credited-to-users.component.html`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersCreditedComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    isScrollable: boolean = false;
    page = new Page();

    softLabels: SoftLabelConfigurationModel[];
    validationMessage: string;
    selectedEntity: string;
    entities: EntityDropDownModel[];
    open = true;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    offersCreditedRecords$: Observable<CanteenCreditModel[]>;
    offersCreditedToUsersGridSpinner$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions, private employeeService: CanteenManagementService, private toaster: ToastrService,
        private router: Router) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CanteenCreditActionTypes.LoadCanteenCreditsCompleted),
                tap(() => {
                    this.offersCreditedRecords$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenCreditsAll));
                    this.offersCreditedRecords$.subscribe((result) => {
                        this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                        this.page.totalPages = this.page.totalElements / this.page.size;
                        this.isScrollable = true;
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getEntityDropDown();
        //this.canAccess_feature_OffersCreditedToUsersSummary$.subscribe(result => {
        if (this.canAccess_feature_OffersCreditedToUsersSummary) {
            this.page.size = 10;
            this.page.pageNumber = 0;
            this.getOffersCreditedToUsersList();
        }
        //});
    }

    getSoftLabels() {
        this.softLabels$ = this.store.pipe(select(hrManagementModuleReducer.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
        if (!this.softLabels) {
            this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        }
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getOffersCreditedToUsersList();
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.sortBy = sort.prop;
        console.log(sort);
        if (sort.dir === 'asc')
            this.sortDirection = true;
        else
            this.sortDirection = false;
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.getOffersCreditedToUsersList();
    }

    searchOffersCreditedList() {
        if (this.searchText && this.searchText.length <= 0) return;
        this.page.pageNumber = 0;
        this.getOffersCreditedToUsersList();
    }

    closeSearch() {
        this.searchText = '';
        this.getOffersCreditedToUsersList();
    }

    getOffersCreditedToUsersList() {
        const canteenCreditSearchResult = new CanteenCreditSearchInputModel();
        canteenCreditSearchResult.sortBy = this.sortBy;
        canteenCreditSearchResult.sortDirectionAsc = this.sortDirection;
        canteenCreditSearchResult.pageNumber = this.page.pageNumber + 1;
        canteenCreditSearchResult.pageSize = this.page.size;
        canteenCreditSearchResult.searchText = this.searchText;
        canteenCreditSearchResult.entityId = this.selectedEntity;
        this.store.dispatch(new LoadCanteenCreditsTriggered(canteenCreditSearchResult));
        this.offersCreditedToUsersGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenCreditLoading));
    }

    goToProfile(url) {
        this.router.navigateByUrl('dashboard/profile/' + url);
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    getEntityDropDown() {
        let searchText = "";
        this.employeeService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
        this.getOffersCreditedToUsersList();
    }

    filterClick() {
        this.open = !this.open;
    }
    resetAllFilters() {
        this.selectedEntity = "";
        this.searchText = ""
        this.getOffersCreditedToUsersList();
    }
}