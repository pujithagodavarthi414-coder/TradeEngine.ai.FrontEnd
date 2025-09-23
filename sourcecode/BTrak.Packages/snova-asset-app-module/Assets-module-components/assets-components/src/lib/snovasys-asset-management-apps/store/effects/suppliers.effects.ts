import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { VendorManagement } from "../../models/vendor-management";
import { VendorManagementService } from "../../services/vendor-management.service";
import { SupplierActionTypes, LoadSuppliersTriggered, LoadSuppliersCompleted, CreateSupplierTriggered, CreateSupplierCompleted, CreateSupplierFailed, SupplierExceptionHandled, LoadSuppliersFailed } from '../actions/supplier.actions';
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable()
export class SupplierEffects {
  SupplierSearchResult: VendorManagement;
  toastrMessage: string;

  @Effect()
  loadSuppliers$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSuppliersTriggered>(SupplierActionTypes.LoadSuppliersTriggered),
    switchMap(searchAction => {
      this.SupplierSearchResult = searchAction.supplierSearchResult;
      return this.vendorManagementService
        .getAllSuppliersList(searchAction.supplierSearchResult)
        .pipe(map((suppliers: any) => {
          if (suppliers.success === true) {
            return new LoadSuppliersCompleted(suppliers.data);
          } else {
            return new LoadSuppliersFailed(suppliers.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new SupplierExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertSupplier$: Observable<Action> = this.actions$.pipe(
    ofType<CreateSupplierTriggered>(SupplierActionTypes.CreateSupplierTriggered),
    switchMap(supplierTriggeredAction => {
      if (supplierTriggeredAction.supplier.supplierId === null || supplierTriggeredAction.supplier.supplierId === '' || supplierTriggeredAction.supplier.supplierId === undefined) {
        this.toastrMessage = supplierTriggeredAction.supplier.supplierName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForSupplierCreated);
      } else if (
        supplierTriggeredAction.supplier.supplierId !== undefined &&
        supplierTriggeredAction.supplier.isArchived === true
      ) {
        this.toastrMessage = supplierTriggeredAction.supplier.supplierName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForSupplierArchived);
      } else {
        this.toastrMessage = supplierTriggeredAction.supplier.supplierName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForSupplierUpdated);
      }
      return this.vendorManagementService
        .upsertSupplier(supplierTriggeredAction.supplier)
        .pipe(
          map((supplierId: any) => {
            if (supplierId.success === true) {
              return new CreateSupplierCompleted(supplierId.data);
            } else {
              return new CreateSupplierFailed(supplierId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new SupplierExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertSupplierSuccessfulAndLoadSuppliers$: Observable<Action> = this.actions$.pipe(
    ofType<CreateSupplierCompleted>(SupplierActionTypes.CreateSupplierCompleted),
    pipe(map(() => {
      return new LoadSuppliersTriggered(this.SupplierSearchResult);
    }),
    )
  );

  @Effect()
  upsertSupplierSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateSupplierCompleted>(SupplierActionTypes.CreateSupplierCompleted),
    pipe(map(() => new SnackbarOpen({
      message: this.toastrMessage, // TODO: Change to proper toast message
      action: this.translateService.instant(ConstantVariables.success)
    })
    )
    )
  );

  @Effect()
  showValidationMessagesForLoadSupplierManagement$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSuppliersFailed>(SupplierActionTypes.LoadSuppliersFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForSupplierManagement$: Observable<Action> = this.actions$.pipe(
    ofType<CreateSupplierFailed>(SupplierActionTypes.CreateSupplierFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  SupplierExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<SupplierExceptionHandled>(SupplierActionTypes.SupplierExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private vendorManagementService: VendorManagementService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {
    const browserLang: string = this.cookieService.get(LocalStorageProperties.CurrentCulture);
    this.translateService.use(browserLang);
  }
}