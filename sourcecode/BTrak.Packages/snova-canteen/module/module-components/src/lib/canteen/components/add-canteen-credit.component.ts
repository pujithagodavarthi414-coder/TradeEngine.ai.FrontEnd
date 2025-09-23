import { Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { tap, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';

import { UserDropDownModel } from '../models/user-model';
import { CanteenCreditModel } from '../models/canteen-credit-model';

import * as hrManagementModuleReducer from '../store/reducers/index';
import { State } from '../store/reducers/index';

import * as _ from 'underscore';
import { CanteenCreditActionTypes, CreateCanteenCreditTriggered } from '../store/actions/canteen-credit.actions';
import { UsersActionTypes, LoadUsersDropDownTriggered } from '../store/actions/users.actions';
import { CurrencyActionTypes, LoadCurrencyTriggered } from '../store/actions/currency.actions';
import { Currency } from '../models/currency';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: 'app-hr-component-add-canteen-credit',
    templateUrl: 'add-canteen-credit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddCanteenCreditComponent implements OnInit {
    @Output() closeCanteenCreditPopup = new EventEmitter<string>();
    @ViewChild("allSelected") private allSelected: MatOption;

    addCanteenCreditForm: FormGroup;
    formDirective: FormGroupDirective;
    addCanteenCredit: CanteenCreditModel;
    usersList: UserDropDownModel[];

    userDropDownListData$: Observable<UserDropDownModel[]>;
    upsertCanteenCreditInProgress$: Observable<boolean>;

    userSearchText: string = '';
    selectedUsersList: string;

    public ngDestroyed$ = new Subject();
    currencyList$: Observable<Currency[]>;
    currencyList: Currency[];

    constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        this.clearCanteenCreditForm();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CurrencyActionTypes.LoadCurrencyCompleted),
                tap(() => {
                    this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
                    this.currencyList$.subscribe((result) => {
                        this.currencyList = result;
                    })
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
                tap(() => {
                    this.formDirective.resetForm();
                    this.closeAddCanteenCreditForm();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                ofType(UsersActionTypes.LoadUsersDropDownCompleted),
                tap(() => {
                    this.userDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getUserDropDownAll), tap(result => {
                        this.usersList = result
                    }));
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.GetCurrencyList();
        this.GetUsersList();
        this.upsertCanteenCreditInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenCreditLoading))
    }

    GetUsersList() {
        this.store.dispatch(new LoadUsersDropDownTriggered(this.userSearchText));
    }

    clearCanteenCreditForm() {
        this.addCanteenCreditForm = new FormGroup({
            amount: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100000)
                ])
            ),
            userIds: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),
        });
    }

    closeAddCanteenCreditForm() {
        if (this.formDirective != null) {
            this.formDirective.resetForm();
        }
        this.clearCanteenCreditForm();
        this.closeCanteenCreditPopup.emit();
    }

    upsertCanteenCredit(formDirective: FormGroupDirective) {
        let indinaCurrencyId = null;

        if (this.currencyList && this.currencyList.length > 0) {
            indinaCurrencyId = this.currencyList.find(x => x.currencyName.toLowerCase() == "indian rupee").currencyId;

            if (!indinaCurrencyId) {
                indinaCurrencyId = this.currencyList[0].currencyId;
            }
        }

        this.formDirective = formDirective;
        this.addCanteenCredit = this.addCanteenCreditForm.value;
        this.addCanteenCredit.currencyId = indinaCurrencyId;
        this.store.dispatch(new CreateCanteenCreditTriggered(this.addCanteenCredit));
        this.upsertCanteenCreditInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenCreditLoading));
    }

    GetCurrencyList() {
        this.store.dispatch(new LoadCurrencyTriggered());
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    toggleAllUsersSelected() {
        if (this.allSelected.selected) {
            if (this.usersList.length === 0) {
                this.addCanteenCreditForm.controls.userIds.patchValue([]);
            }
            else {
                this.addCanteenCreditForm.controls.userIds.patchValue([
                    ...this.usersList.map(item => item.id),
                    0
                ]);
            }

        } else {
            this.addCanteenCreditForm.controls.userIds.patchValue([]);
        }
        this.getUserslistByUserId();
    }

    toggleUserPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.addCanteenCreditForm.controls.userIds.value.length === this.usersList.length
        ) {
            this.allSelected.select();
        }
    }

    getUserslistByUserId() {
        let selectedUser = this.addCanteenCreditForm.get('userIds').value;
        let index = selectedUser.indexOf('0');
        if (index > -1) {
            selectedUser.splice(index, 1);
        }

        var usersList = this.usersList;
        var users = _.filter(usersList, function (status) {
            return selectedUser.toString().includes(status.id);
        })
        var userNames = users.map(x => x.fullName);
        this.selectedUsersList = userNames.toString();
    }
}