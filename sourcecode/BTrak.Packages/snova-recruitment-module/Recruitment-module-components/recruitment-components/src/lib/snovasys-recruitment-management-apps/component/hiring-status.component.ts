import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { HiringStatusUpsertModel } from '../models/hiringStatusUpsertModel';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { CreateHiringStatusItemTriggered, HiringStatusActionTypes, LoadHiringStatusItemsTriggered } from '../store/actions/hiring-status.action';
import * as hiringStatusModuleReducer from '../store/reducers/index';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-am-component-hiring-status',
    templateUrl: `hiring-status.component.html`
})

export class HiringStatusComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
    @ViewChildren('upsertHiringStatusPopUp') upsertHiringStatusPopover;
    @ViewChildren('deleteHiringStatusPopup') deleteHiringStatusPopover;
    @ViewChild('formDirective') formDirective: FormGroupDirective;

    @Input('dashboardFilters')
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input('fromRoute')
    set _fromRoute(data: boolean) {
        if (data || data === false) {
            this.isFromRoute = data;
        } else {
            this.isFromRoute = true;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = true;
    isArchived = false;
    toastr: any;
    hiringStatus: HiringStatusUpsertModel[];
    isFromRoute = false;
    validationMessage: string;
    isFiltersVisible = false;
    isThereAnError: boolean;
    hiringStatusForm: FormGroup;
    timeStamp: any;
    temp: any;
    searchText: string;
    hiringStatusId: string;
    status: string;
    loading = false;
    hiringStatusTitle: string;
    color = '';
    order: number;
    hiringStatus$: Observable<HiringStatusUpsertModel[]>;
    validationMessage$: Observable<any[]>;
    hiringStatusId$: Observable<string>;
    public ngDestroyed$ = new Subject();

    constructor(
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private store: Store<State>, private actionUpdates$: Actions) {
        super();
        this.actionUpdates$
            .pipe(
                ofType(HiringStatusActionTypes.LoadHiringStatusItemsCompleted),
                tap(() => {
                    this.hiringStatus$ = this.store.pipe(select(hiringStatusModuleReducer.getHiringStatusAll));
                    this.hiringStatus$.subscribe((result) => {
                        this.hiringStatus = result;
                        this.isThereAnError = false;
                        this.clearForm();
                        this.temp = this.hiringStatus;
                        this.isAnyOperationIsInprogress = false;
                        this.cdRef.detectChanges();
                    });
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                ofType(HiringStatusActionTypes.CreateHiringStatusItemCompleted),
                tap(() => {
                    this.hiringStatusId$ = this.store.pipe(select(hiringStatusModuleReducer.hiringStatusCreatedorUpsert));
                    let id = null;
                    this.hiringStatusId$.subscribe((result) => {
                        if (result) {
                            id = result;
                        }
                    });
                    if (id) {
                        this.isAnyOperationIsInprogress = false;
                        this.clearForm();
                        this.formDirective.resetForm();
                        this.upsertHiringStatusPopover.forEach((p) => p.closePopover());
                        this.deleteHiringStatusPopover.forEach((p) => p.closePopover());
                    }
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                ofType(HiringStatusActionTypes.CreateHiringStatusItemCompleted),
                tap(() => {
                    this.validationMessage$ = this.store.pipe(select(hiringStatusModuleReducer.hiringStatusCreatedorUpsertFailed));
                    this.validationMessage$.subscribe((result) => {
                        if (result) {
                            this.validationMessage = result[0];
                            this.isThereAnError = true;
                        }
                    });
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getHiringStatus();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    getHiringStatus() {
        this.isAnyOperationIsInprogress = true;
        const hiringStatusModel = new HiringStatusUpsertModel();
        hiringStatusModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadHiringStatusItemsTriggered(hiringStatusModel));
    }

    createHiringStatus(upsertHiringStatusPopUp) {
        upsertHiringStatusPopUp.openPopover();
        this.hiringStatusTitle = this.translateService.instant('HIRINGSTATUS.ADDHIRINGSTATUSTITLE');
    }

    closeUpsertHiringStatusPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertHiringStatusPopover.forEach((p) => p.closePopover());
    }

    editHiringStatus(row, upsertHiringStatusPopUp) {
        this.hiringStatusForm.patchValue(row);
        this.hiringStatusId = row.hiringStatusId;
        this.status = row.status;
        this.color = row.color;
        this.order = row.order;
        this.timeStamp = row.timeStamp;
        this.hiringStatusTitle = this.translateService.instant('HIRINGSTATUS.EDITHIRINGSTATUSTITLE');
        upsertHiringStatusPopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    upsertHiringStatus(formDirective: FormGroupDirective) {
        let hiringStatus = new HiringStatusUpsertModel();
        hiringStatus = this.hiringStatusForm.value;
        hiringStatus.status = hiringStatus.status.toString().trim();
        hiringStatus.color = hiringStatus.color;
        hiringStatus.order = hiringStatus.order;
        hiringStatus.hiringStatusId = this.hiringStatusId;
        hiringStatus.timeStamp = this.timeStamp;
        this.store.dispatch(new CreateHiringStatusItemTriggered(hiringStatus));
    }

    clearForm() {
        this.status = null;
        this.order = null;
        this.color = null;
        this.hiringStatusId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.hiringStatusForm = new FormGroup({
            status: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            color: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            order: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
        });
    }

    deleteHiringStatusPopupOpen(row, deleteHiringStatusPopup) {
        this.hiringStatusId = row.hiringStatusId;
        this.status = row.status;
        this.color = row.color;
        this.order = row.order;
        this.timeStamp = row.timeStamp;
        deleteHiringStatusPopup.openPopover();
    }

    closeDeleteHiringStatusPopup() {
        this.clearForm();
        this.deleteHiringStatusPopover.forEach((p) => p.closePopover());
    }

    deleteHiringStatus() {
        this.isAnyOperationIsInprogress = true;
        const hiringStatusInputModel = new HiringStatusUpsertModel();
        hiringStatusInputModel.hiringStatusId = this.hiringStatusId;
        hiringStatusInputModel.status = this.status;
        hiringStatusInputModel.order = this.order;
        hiringStatusInputModel.color = this.color;
        hiringStatusInputModel.timeStamp = this.timeStamp;
        hiringStatusInputModel.isArchived = !this.isArchived;
        this.store.dispatch(new CreateHiringStatusItemTriggered(hiringStatusInputModel));
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = '';
        }
        const temp = this.temp.filter(hiringStatus => (hiringStatus.status.toLowerCase().indexOf(this.searchText) > -1)
         || (hiringStatus.order.toString().indexOf(this.searchText) > -1));

        this.hiringStatus = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    closeUpsertHiringStatusPopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertHiringStatusPopover.forEach((p) => p.closePopover());
    }
}
