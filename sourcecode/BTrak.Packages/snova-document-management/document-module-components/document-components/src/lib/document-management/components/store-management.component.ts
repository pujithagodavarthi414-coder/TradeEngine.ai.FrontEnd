import { Component, ViewChildren, ViewChild, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from "../store/reducers/index";
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import * as documentModuleReducer from "../store/reducers/index";

import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StoreModel } from '../models/store-model';
import { StoreActionTypes, LoadStoreTriggered, CreateStoreTriggered } from '../store/actions/store.actions';
import { StoreSearchModel } from '../models/store-search-model';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import "../../globaldependencies/helpers/fontawesome-icons";


@Component({
    selector: 'app-fm-component-store-management',
    templateUrl: `store-management.component.html`,
    styles:[`
    .store-panel-height .datatable-body
    {
        height: calc(100vh - 174px);
        overflow-y:auto;
    }
    `]
})

export class StoreManagementComponent extends CustomAppBaseComponent {
    @ViewChildren("storePopup") upsertStorePopover;
    @ViewChildren("deleteStorePopup") deleteStorePopup;
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    storeList: StoreModel[];
    temp: StoreModel[];
    storeData: StoreModel;

    storeForm: FormGroup;

    isArchived: boolean = false;
    searchText: string = '';
    isFiltersVisible: boolean = true;

    storeList$: Observable<StoreModel[]>;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isAnyOperationIsInprogress$: Observable<boolean>;
    upsertInProgress$: Observable<boolean>;
    accessViewStore: Boolean = false;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, public googleAnalyticsService: GoogleAnalyticsService,
        private actionUpdates$: Actions
        , private routes: Router) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(StoreActionTypes.CreateStoreCompleted),
                tap(() => {
                    this.closeUpsertStorePopup(this.formGroupDirective);
                    // this.sharedStore.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(StoreActionTypes.DeleteStoreCompleted),
                tap(() => {
                    this.closeDeleteStorePopup();
                    // this.sharedStore.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(StoreActionTypes.LoadStoreCompleted),
                tap(() => {
                    this.storeList$ = this.store.pipe(select(documentModuleReducer.getStoreAll));
                    this.storeList$.subscribe(result => {
                        this.storeList = result;
                        this.temp = this.storeList;
                        this.searchText = "";
                    })
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getStores();
        this.clearForm();
        this.accessViewStore = this.canAccess_feature_ViewStores;
    }

    getStores() {
        let storeSearchModel = new StoreSearchModel();
        storeSearchModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadStoreTriggered(storeSearchModel));
        this.isAnyOperationIsInprogress$ = this.store.pipe(select(documentModuleReducer.getStoreLoading));
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter((store => (store.storeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.storeList = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    clearForm() {
        this.storeData = null;
        this.searchText = null;
        this.storeForm = new FormGroup({
            storeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
        })
    }

    createStore(storePopup) {
        this.clearForm();
        storePopup.openPopover();
    }

    upsertStore() {
        // this.upsertInProgress = true;
        let storeModel = new StoreModel();
        storeModel = this.storeForm.value;
        if (this.storeData) {
            storeModel.storeId = this.storeData.storeId;
            storeModel.timeStamp = this.storeData.timeStamp;
            this.googleAnalyticsService.eventEmitter("Document Management", "Updated Store", storeModel.storeName, 1);
        }
        else {
            this.googleAnalyticsService.eventEmitter("Document Management", "Created Store", storeModel.storeName, 1);
        }
        this.store.dispatch(new CreateStoreTriggered(storeModel));
        this.upsertInProgress$ = this.store.pipe(select(documentModuleReducer.createStoreLoading));
    }

    editStore(row, storePopup) {
        this.storeForm.patchValue(row);
        this.storeData = row;
        storePopup.openPopover();
    }

    closeUpsertStorePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertStorePopover.forEach((p) => p.closePopover());
    }

    deleteStorePopupOpen(row, deleteStorePopup) {
        this.storeData = row;
        deleteStorePopup.openPopover();
    }

    closeDeleteStorePopup() {
        this.clearForm();
        this.deleteStorePopup.forEach((p) => p.closePopover());
    }

    deleteStore() {
        let storeModel = new StoreModel();
        storeModel.storeId = this.storeData.storeId;
        storeModel.storeName = this.storeData.storeName;
        storeModel.storeSize = this.storeData.storeSize;
        storeModel.isDefault = this.storeData.isDefault;
        storeModel.isCompany = this.storeData.isCompany;
        storeModel.timeStamp = this.storeData.timeStamp;
        storeModel.isArchived = !this.isArchived;
        this.googleAnalyticsService.eventEmitter("Document Management", "Deleted Store", storeModel.storeName, 1);
        this.store.dispatch(new CreateStoreTriggered(storeModel));
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    navigateToStore(row) {
        if (this.accessViewStore)
            this.routes.navigateByUrl("document/store/" + row.storeId);
    }
}